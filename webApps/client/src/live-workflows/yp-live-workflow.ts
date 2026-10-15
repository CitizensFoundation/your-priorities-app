import { LitElement, html, css, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { keyed } from "lit/directives/keyed.js";
import { LiveWorkflowApi, LiveWorkflowApiError, dollars } from "./api.js";
import {
  agentModelRoles,
  modelReasoning,
  modelRoleLabel,
} from "./modelInfo.js";
import "./yp-live-workflow-graph.js";
import "./yp-live-workflow-admin.js";
import "./yp-live-workflow-results.js";
import "./yp-live-workflow-message.js";
import { assistantSettingsLabel } from "./yp-live-workflow-assistant-settings.js";

type ChatItem = {
  id: string;
  role: "user" | "assistant" | "activity";
  text: string;
  completed?: boolean;
  userId?: number;
  at?: string;
  modelDetails?: string;
};
type Approval = {
  requestId: string | number;
  method: string;
  params: Record<string, YpWorkflowJson>;
};
@customElement("yp-live-workflow")
export class YpLiveWorkflow extends LitElement {
  @property({ type: Number }) groupId!: number;
  @state() private snapshot?: YpWorkflowSnapshot;
  @state() private error = "";
  @state() private busy = false;
  @state() private assistantSettingsPending = false;
  @state() private missing = false;
  @state() private mayCreate = false;
  @state() private tab: "graph" | "data" | "results" | "usage" | "settings" =
    "graph";
  @state() private selectedNode?: string;
  @state() private agentEditor?: {
    graph: YpWorkflowGraph;
    nodeId: string;
    revision: number;
    runId?: string;
  };
  @state() private agentError = "";
  @state() private agentSaving = false;
  @state() private selectedAssets: string[] = [];
  @state() private viewedRunId = "";
  @state() private chat: ChatItem[] = [];
  @state() private loggedInUser?: YpUserData;
  @state() private approvals: Approval[] = [];
  @state() private auth?: { verificationUrl: string; userCode: string };
  @state() private uploadProgress = 0;
  @state() private draft?: YpWorkflowRun;
  @state() private usage: {
    id: string;
    runId: string;
    description: string;
    status: string;
    maximumMicros: number;
    actualMicros?: number;
  }[] = [];
  @state() private quota = "";
  @state() private sampleCount = 5;
  @state() private targetNodeId = "";
  @state() private preview?: {
    assetId: string;
    name: string;
    inputCount: number;
    rows: Record<string, YpWorkflowJson>[];
  };
  @state() private connectionGroups: { id: number; name: string }[] = [];
  @state() private connectionMessage = "";
  @state() private history?: {
    currentHash?: string;
    revisions: YpWorkflowRevision[];
  };
  @state() private comparedRevision?: {
    hash: string;
    files: Record<string, string>;
    currentFiles: Record<string, string>;
  };
  @state() private storageInfo?: {
    availableBytes: number;
    minimumFreeBytes: number;
    eligibleRuns: number;
    removed: number;
  };

  private stream?: EventSource;
  private cursor = 0;
  private refreshTimer?: ReturnType<typeof setTimeout>;
  private userChanged = (event: Event) => {
    this.loggedInUser =
      (event as CustomEvent<YpUserData | null>).detail ?? undefined;
  };
  private get api() {
    return new LiveWorkflowApi(this.groupId);
  }
  private get workspace() {
    return this.snapshot?.workspace;
  }
  private get assistantName() {
    return this.snapshot?.assistantName ?? "Workflow Assistant";
  }
  private get operator() {
    return (
      this.workspace?.operator?.userId === this.snapshot?.permissions.userId
    );
  }
  private get run() {
    return this.snapshot?.runs.find(
      (r) => r.id === (this.viewedRunId || this.workspace?.activeRunId),
    );
  }
  static override styles = css`
    fieldset {
      border: 0;
      padding: 0;
      margin: 0;
      min-width: 0;
      display: grid;
      gap: 12px;
    }
    :host {
      display: block;
      color: var(--md-sys-color-on-surface, #222);
      font-family: inherit;
    }
    .header {
      display: flex;
      gap: 16px;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }
    h2,
    h3 {
      margin: 0 0 10px;
    }
    .muted {
      opacity: 0.7;
      font-size: 13px;
    }
    .layout {
      display: grid;
      grid-template-columns: minmax(320px, 38%) minmax(0, 1fr);
      gap: 16px;
      align-items: start;
    }
    .panel {
      border: 1px solid var(--md-sys-color-outline-variant, #ddd);
      border-radius: 20px;
      padding: 18px;
      background: var(--md-sys-color-surface, #fff);
      min-width: 0;
      box-shadow: 0 6px 28px #30234506;
    }
    .chat {
      display: flex;
      flex-direction: column;
      min-height: 630px;
      background: linear-gradient(
        165deg,
        color-mix(
          in srgb,
          var(--md-sys-color-primary, #7663a8) 5%,
          var(--md-sys-color-surface, #fff)
        ),
        var(--md-sys-color-surface, #fff) 48%
      );
    }
    .chat-heading {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-bottom: 16px;
    }
    .chat-heading h3 {
      margin: 0;
      font-size: 18px;
      letter-spacing: -0.3px;
      overflow-wrap: anywhere;
    }
    .chat-heading p {
      margin: 4px 0 0;
      font-size: 12px;
      color: var(--md-sys-color-on-surface-variant, #716b80);
    }
    .codex-mark {
      display: grid;
      flex-shrink: 0;
      place-items: center;
      width: 42px;
      height: 42px;
      border-radius: 14px;
      background: linear-gradient(135deg, #8e7bc6, #574788);
      color: white;
      box-shadow: 0 5px 12px #59438d24;
      font-family: monospace;
      font-size: 19px;
      font-weight: 600;
    }
    .connection-status {
      font-size: 12px;
      margin: 10px 0;
      color: var(--md-sys-color-on-surface-variant, #716b80);
    }
    .connection-status[data-connected]::before {
      content: "";
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #44816e;
      margin-right: 7px;
    }
    .history {
      flex: 1;
      min-height: 230px;
      max-height: 580px;
      overflow: auto;
      padding: 4px 2px 10px;
      scrollbar-width: thin;
      scrollbar-color: #ccc4de transparent;
    }
    .composer {
      padding: 10px 12px 12px;
      border-radius: 16px;
      border: 1px solid var(--md-sys-color-outline-variant, #dcd5e9);
      background: var(--md-sys-color-surface, #fff);
      box-shadow: 0 4px 16px #30234508;
    }
    .composer:focus-within {
      border-color: var(--md-sys-color-primary, #7663a8);
      box-shadow: 0 0 0 3px #8e7bc614;
    }
    .composer label {
      margin-top: 0;
      font-size: 12px;
    }
    .composer textarea {
      min-height: 78px;
      border: 0;
      padding: 6px 0;
      outline: none;
      font-size: 14px;
      line-height: 1.5;
    }
    .composer .toolbar {
      justify-content: space-between;
    }
    .composer .inline {
      margin: 0;
      font-size: 11px;
    }
    .toolbar,
    .tabs,
    .row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }
    .tabs {
      margin-bottom: 16px;
      padding: 4px;
      border-radius: 12px;
      background: var(--md-sys-color-surface-container, #f4f1f8);
      width: fit-content;
      gap: 4px;
    }
    .tabs button {
      border: none;
      padding: 8px 14px;
      font-size: 13px;
      font-weight: 600;
    }
    .tabs button[aria-selected="true"] {
      background: var(--md-sys-color-primary, #65558f);
      color: var(--md-sys-color-on-primary, #fff);
      box-shadow: 0 2px 6px #46345c24;
    }
    button,
    input,
    select,
    textarea {
      font: inherit;
      border: 1px solid var(--md-sys-color-outline, #aaa);
      border-radius: 8px;
      padding: 9px;
      background: transparent;
      color: inherit;
      box-sizing: border-box;
    }
    button {
      cursor: pointer;
      transition:
        background 120ms,
        border-color 120ms,
        box-shadow 120ms;
    }
    button:hover:not(:disabled) {
      border-color: var(--md-sys-color-primary, #7663a8);
      box-shadow: 0 2px 6px #46345c12;
    }
    button:focus-visible {
      outline: 2px solid var(--md-sys-color-primary, #7663a8);
      outline-offset: 3px;
    }
    button:disabled {
      cursor: default;
      opacity: 0.5;
    }
    button.primary {
      background: linear-gradient(
        135deg,
        var(--md-sys-color-primary, #7663a8),
        color-mix(in srgb, var(--md-sys-color-primary, #7663a8) 80%, #292039)
      );
      color: var(--md-sys-color-on-primary, #fff);
      border-color: transparent;
      padding-inline: 20px;
      font-weight: 600;
      box-shadow: 0 3px 8px #65558f22;
    }
    textarea {
      width: 100%;
      resize: vertical;
      min-height: 84px;
    }
    .error {
      padding: 12px;
      border-radius: 8px;
      background: var(--md-sys-color-error-container, #ffe3e3);
      color: var(--md-sys-color-on-error-container, #811);
    }
    label {
      display: grid;
      gap: 6px;
      margin: 10px 0;
    }
    label.inline {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .table-scroll {
      max-width: 100%;
      overflow-x: auto;
    }
    .agent-dialog {
      width: min(780px, calc(100vw - 32px));
      max-width: calc(100vw - 32px);
      max-height: calc(100dvh - 40px);
      box-sizing: border-box;
      border: 1px solid var(--md-sys-color-outline-variant, #ddd);
      border-radius: 20px;
      padding: 24px;
      color: inherit;
      background: var(--md-sys-color-surface, #fff);
      box-shadow: 0 20px 80px #251b4533;
      overflow: auto;
    }
    .agent-dialog::backdrop {
      background: #21172c66;
      backdrop-filter: blur(3px);
    }
    .agent-dialog header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      gap: 16px;
      margin-bottom: 16px;
    }
    .agent-dialog h3 {
      margin-top: 20px;
    }
    .agent-dialog h2 {
      overflow-wrap: anywhere;
    }
    .agent-dialog p {
      line-height: 1.5;
    }
    .agent-dialog .row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr));
      align-items: start;
    }
    .agent-dialog .row label {
      margin: 0;
    }
    .agent-dialog .model-note {
      display: block;
      font-size: 12px;
      margin-top: 6px;
      color: var(--md-sys-color-on-surface-variant, #716b80);
    }
    .agent-dialog details {
      margin-block: 12px;
    }
    .agent-dialog summary {
      cursor: pointer;
    }
    .agent-dialog td small {
      display: block;
      margin-top: 4px;
    }
    .agent-dialog .model-role {
      margin-bottom: 8px;
    }
    .agent-dialog .history-run {
      text-align: left;
      font-size: 12px;
    }
    .agent-dialog .notice {
      background: var(--md-sys-color-surface-container, #f4f1f8);
      padding: 12px;
      border-radius: 10px;
    }
    .agent-dialog .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
      flex-wrap: wrap;
    }
    .agent-selection {
      margin-top: 14px;
      padding: 12px;
      border-radius: 12px;
      background: var(--md-sys-color-surface-container, #f4f1f8);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    input,
    select {
      min-width: 0;
      max-width: 100%;
    }
    label {
      min-width: 0;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      font-size: 13px;
    }
    th,
    td {
      text-align: left;
      padding: 10px 6px;
      border-bottom: 1px solid var(--md-sys-color-outline-variant, #ddd);
      vertical-align: top;
    }
    td {
      overflow-wrap: anywhere;
    }
    a {
      color: var(--md-sys-color-primary, #65558f);
    }
    .run {
      margin-top: 14px;
      border-top: 1px solid #ddd;
      padding-top: 14px;
    }
    .estimate {
      padding: 14px;
      background: var(--md-sys-color-secondary-container, #e8e7f4);
      border-radius: 12px;
      margin-top: 12px;
    }
    .inspector {
      margin-top: 16px;
    }
    .auth {
      padding: 10px 12px;
      border: 1px solid var(--md-sys-color-outline-variant, #e7e2ee);
      border-radius: 10px;
      margin-bottom: 12px;
      font-size: 12px;
    }
    .auth code {
      font-size: 20px;
      letter-spacing: 2px;
    }
    details {
      margin: 12px 0;
    }
    pre {
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      font-size: 12px;
    }
    .cost {
      font-variant-numeric: tabular-nums;
    }
    form {
      margin: 0;
    }
    .empty {
      padding: 30px 10px;
      opacity: 0.7;
    }
    .approval {
      border: 1px solid #b68929;
      border-radius: 8px;
      padding: 12px;
      margin: 10px 0;
    }
    @media (max-width: 1000px) {
      .layout {
        grid-template-columns: 1fr;
      }
      .chat {
        min-height: 400px;
      }
      .history {
        max-height: 400px;
      }
    }
  `;
  override updated(changed: PropertyValues) {
    if (changed.has("groupId") && this.groupId) {
      this.stream?.close();
      this.stream = undefined;
      this.cursor = 0;
      this.chat = [];
      this.assistantSettingsPending = false;
      this.approvals = [];
      this.snapshot = undefined;
      this.selectedAssets = [];
      this.viewedRunId = "";
      this.draft = undefined;
      this.auth = undefined;
      this.quota = "";
      this.preview = undefined;
      this.history = undefined;
      this.comparedRevision = undefined;
      this.storageInfo = undefined;
      this.targetNodeId = "";
      this.selectedNode = undefined;
      this.agentEditor = undefined;
      this.agentError = "";
      this.connectionGroups = [];
      this.connectionMessage = "";
      clearTimeout(this.refreshTimer);
      this.refreshTimer = undefined;
      void this.refresh();
    }
  }
  override connectedCallback() {
    super.connectedCallback();
    this.loggedInUser = window.appUser?.user ?? undefined;
    document.addEventListener("yp-logged-in", this.userChanged);
  }
  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("yp-logged-in", this.userChanged);
    this.stream?.close();
    this.stream = undefined;
    clearTimeout(this.refreshTimer);
    this.refreshTimer = undefined;
  }
  private async refresh() {
    const groupId = this.groupId;
    try {
      const snapshot = await this.api.request<YpWorkflowSnapshot>();
      if (this.groupId !== groupId) return;
      // Keep the run and its final agent messages visible when it releases the active lock.
      if (
        !this.viewedRunId &&
        this.snapshot?.workspace.activeRunId &&
        !snapshot.workspace.activeRunId
      )
        this.viewedRunId = this.snapshot.workspace.activeRunId;
      this.snapshot = snapshot;
      if (this.tab === "usage") {
        const usage = await this.api.request<typeof this.usage>("/usage");
        if (this.groupId !== groupId) return;
        this.usage = usage;
      }
      this.missing = false;
      if (!this.stream && this.isConnected) this.connect();
    } catch (error) {
      if (this.groupId !== groupId) return;
      this.error =
        error instanceof Error ? error.message : "Cannot load workflow";
      this.missing =
        error instanceof LiveWorkflowApiError && error.status === 404;
      if (this.missing) {
        try {
          this.mayCreate = (
            await this.api.request<{ admin: boolean }>("/access")
          ).admin;
        } catch {
          this.mayCreate = false;
        }
      }
    }
  }
  private connect() {
    this.stream = new EventSource(
      `${this.api.base}/stream?after=${this.cursor}`,
    );
    this.stream.onmessage = (message) => {
      try {
        const event = JSON.parse(message.data) as YpWorkflowEvent;
        if (event.seq <= this.cursor) return;
        this.cursor = event.seq;
        this.event(event);
      } catch {
        this.error =
          "A workflow event could not be displayed. Refresh to replay the history.";
      }
    };
    this.stream.onerror = () => {
      this.error =
        "Live connection interrupted. Reconnecting and replaying saved events…";
    };
    this.stream.onopen = () => {
      if (this.error.startsWith("Live connection interrupted")) this.error = "";
    };
  }
  private record(
    value: YpWorkflowJson | undefined,
  ): Record<string, YpWorkflowJson> {
    return value && typeof value === "object" && !Array.isArray(value)
      ? value
      : {};
  }
  private event(event: YpWorkflowEvent) {
    if (event.type === "asset.deleted")
      this.forgetAsset(String(event.data.assetId));
    if (
      ["operator.changed", "host.restarted", "session.closed"].includes(
        event.type,
      )
    )
      this.approvals = [];
    if (event.type === "chat.user") {
      const settings = this.record(event.data.assistantSettings);
      this.chat = [
        ...this.chat,
        {
          id: `user:${event.seq}`,
          role: "user",
          text: String(event.data.text),
          userId:
            typeof event.data.userId === "number"
              ? event.data.userId
              : undefined,
          at: event.at,
          modelDetails:
            typeof settings.model === "string"
              ? `${event.data.steer ? "Steering" : "Requested"}: ${assistantSettingsLabel(settings as unknown as YpWorkflowAssistantSettings)}`
              : undefined,
        },
      ];
    }
    if (event.type === "session.event") {
      const type = String(event.data.eventType),
        payload = this.record(event.data.payload),
        item = this.record(payload.item);
      const id = `${event.data.sessionId}:${event.data.itemId ?? payload.itemId ?? event.data.turnId}`;
      if (type === "message.delta" || type === "message.completed") {
        const text = String(
          type === "message.delta"
            ? (payload.delta ?? "")
            : (item.text ?? payload.text ?? ""),
        );
        const previous = this.chat.find((c) => c.id === id);
        if (previous)
          this.chat = this.chat.map((c) =>
            c.id === id
              ? type === "message.delta" && c.completed
                ? c // HTTP event delivery can lag behind the authoritative completed message.
                : {
                    ...c,
                    completed: type === "message.completed",
                    text:
                      type === "message.delta" ? c.text + text : text || c.text,
                  }
              : c,
          );
        else
          this.chat = [
            ...this.chat,
            {
              id,
              role: "assistant",
              text,
              completed: type === "message.completed",
              at: event.at,
            },
          ];
      } else if (type === "quota.updated")
        this.quota = JSON.stringify(payload, null, 2);
      else if (type === "approval.requested") {
        const requestId = payload.requestId as string | number;
        if (
          requestId !== undefined &&
          !this.approvals.some((a) => a.requestId === requestId)
        )
          this.approvals = [
            ...this.approvals,
            {
              requestId,
              method: String(payload.method ?? "approval"),
              params: this.record(payload.params ?? payload),
            },
          ];
      } else if (type === "approval.resolved")
        this.approvals = this.approvals.filter(
          (a) => a.requestId !== payload.requestId,
        );
      else if (
        [
          "command.output.delta",
          "file.output.delta",
          "turn.plan.updated",
          "session.error",
          "usage.routing.unavailable",
        ].includes(type)
      ) {
        this.chat = [
          ...this.chat,
          {
            id: `activity:${event.seq}`,
            role: "activity",
            at: event.at,
            text: `${type}: ${String(payload.delta ?? payload.message ?? JSON.stringify(payload))}`,
          },
        ];
      }
    }
    if (!this.refreshTimer)
      this.refreshTimer = setTimeout(() => {
        this.refreshTimer = undefined;
        void this.refresh();
      }, 750);
  }
  private async action(work: () => Promise<unknown>) {
    this.busy = true;
    this.error = "";
    try {
      await work();
      await this.refresh();
    } catch (error) {
      this.error =
        error instanceof Error ? error.message : "Workflow operation failed";
    } finally {
      this.busy = false;
    }
  }
  private async login() {
    await this.action(async () => {
      this.auth = await this.api.request("/account/login", "POST", {});
    });
  }
  private async loginApiKey(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const input = form.elements.namedItem("apiKey") as HTMLInputElement;
    let apiKey = input.value;
    // Keep credentials out of reactive state and clear the password field immediately.
    form.reset();
    await this.action(async () => {
      try {
        await this.api.request("/account/api-key", "POST", { apiKey });
        this.auth = undefined;
      } finally {
        apiKey = "";
      }
    });
  }
  private async send(event: Event) {
    event.preventDefault();
    if (this.assistantSettingsPending) return;
    const form = event.target as HTMLFormElement,
      text = String(new FormData(form).get("message") ?? "");
    await this.action(async () => {
      await this.api.request("/chat", "POST", {
        text,
        steer: new FormData(form).get("steer") === "on",
      });
      form.reset();
    });
  }
  private async upload(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files) return;
    await this.action(async () => {
      try {
        for (const file of files) {
          if (file.size > 250 * 1024 ** 2)
            throw new Error("Each file must be 250 MiB or smaller");
          const asset = await this.api.upload(file, (p) => {
            this.uploadProgress = p;
          });
          this.selectedAssets = [...this.selectedAssets, asset.id];
        }
      } finally {
        this.uploadProgress = 0;
        // A failed file can be selected again after correcting the error.
        input.value = "";
      }
    });
  }
  private async draftRun(mode: "trial" | "bulk") {
    await this.action(async () => {
      const run = await this.api.request<YpWorkflowRun>("/runs", "POST", {
        mode,
        assetIds: this.selectedAssets,
        sampleCount: this.sampleCount,
        ...(this.targetNodeId ? { targetNodeId: this.targetNodeId } : {}),
      });
      if (mode === "trial") {
        await this.api.request(`/runs/${run.id}/start`, "POST", {});
        this.viewedRunId = run.id;
      } else this.draft = run;
    });
  }
  private async approve(event: Event) {
    event.preventDefault();
    const budgetMicros = Math.round(
      Number(new FormData(event.target as HTMLFormElement).get("cap")) * 1e6,
    );
    await this.action(async () => {
      await this.api.request(`/runs/${this.draft!.id}/start`, "POST", {
        budgetMicros,
      });
      this.viewedRunId = this.draft!.id;
      this.draft = undefined;
    });
  }
  private async openAgentSettings(id: string, run = this.run) {
    const graph = run?.graph ?? this.workspace?.graph;
    if (!graph?.nodes.some((node) => node.id === id && node.kind === "agent"))
      return;
    this.selectedNode = id;
    this.agentError = "";
    this.agentEditor = {
      nodeId: id,
      graph: structuredClone(graph),
      revision: run?.revision ?? this.workspace!.revision,
      runId: run?.id,
    };
    await this.updateComplete;
    const dialog =
      this.renderRoot.querySelector<HTMLDialogElement>(".agent-dialog");
    if (dialog && !dialog.open) dialog.showModal();
  }
  private closeAgentSettings() {
    this.renderRoot.querySelector<HTMLDialogElement>(".agent-dialog")?.close();
  }
  private async agentDialogClosed() {
    const id = this.agentEditor?.nodeId;
    this.agentEditor = undefined;
    this.agentError = "";
    await this.updateComplete;
    if (id)
      this.renderRoot
        .querySelector("yp-live-workflow-graph")
        ?.shadowRoot?.querySelector<SVGElement>(
          `[model-id="${CSS.escape(id)}"]`,
        )
        ?.focus();
  }
  private editAgentDraft() {
    const id = this.agentEditor?.nodeId;
    if (!id) return;
    this.viewedRunId = "draft";
    this.draft = undefined;
    void this.openAgentSettings(id);
  }
  private async saveNode(event: Event) {
    event.preventDefault();
    const editor = this.agentEditor;
    if (!editor || editor.runId || !this.operator || this.agentSaving) return;
    const form = new FormData(event.target as HTMLFormElement),
      graph = structuredClone(editor.graph),
      node = graph.nodes.find((n) => n.id === editor.nodeId)!;
    this.agentSaving = true;
    this.agentError = "";
    try {
      node.enabled = form.get("enabled") === "on";
      node.models = Object.fromEntries(
        agentModelRoles(
          node,
          this.snapshot?.modelRoles ?? ["default", "review"],
        )
          .map((role) => [role, String(form.get(`agent-model:${role}`) ?? "")])
          .filter(([, value]) => value),
      );
      node.configuration = JSON.parse(
        String(form.get("configuration") ?? "{}"),
      );
      const effort = String(form.get("reasoningEffort") ?? "");
      if (effort) node.reasoningEffort = effort as YpWorkflowReasoningEffort;
      else delete node.reasoningEffort;
      for (const modelId of Object.values(node.models)) {
        const model = this.snapshot!.models.find((item) => item.id === modelId);
        if (!model)
          throw new Error(
            `Model ${modelId} is no longer available. Choose an available model.`,
          );
        if (effort && (model.provider !== "openai" || !model.reasoning))
          throw new Error(
            "Choose Use model default for reasoning effort, or select OpenAI reasoning models for every role.",
          );
      }
      const cap = String(form.get("nodeCap") ?? "");
      if (cap) node.budgetMicros = Math.round(Number(cap) * 1e6);
      else delete node.budgetMicros;
      if (node.id === "normalize")
        node.configuration.fields = {
          name: String(form.get("nameColumn") || "name"),
          text: String(form.get("textColumn") || "text"),
        };
      await this.api.request("/graph", "PUT", {
        graph,
        revision: editor.revision,
      });
      this.draft = undefined;
      await this.refresh();
      this.closeAgentSettings();
    } catch (error) {
      this.agentError =
        error instanceof Error
          ? error.message
          : "Could not save agent settings";
    } finally {
      this.agentSaving = false;
    }
  }
  private async bindConnector(event: Event) {
    event.preventDefault();
    const form = new FormData(event.target as HTMLFormElement);
    await this.action(async () => {
      await this.api.request("/connectors", "POST", {
        binding: {
          id: String(form.get("id")),
          label: String(form.get("label")),
          kind: String(form.get("kind")),
          resourceId: String(form.get("resource")),
          writeEnabled: form.get("write") === "on",
          settings: JSON.parse(String(form.get("settings") || "{}")),
        },
        credential: JSON.parse(String(form.get("credential") || "{}")),
      });
      (event.target as HTMLFormElement).reset();
    });
  }
  private async previewAsset(asset: YpWorkflowAsset) {
    const groupId = this.groupId;
    this.preview = undefined;
    await this.action(async () => {
      const result = await this.api.request<{
        inputCount: number;
        preview: Record<string, YpWorkflowJson>[];
      }>(`/assets/${asset.id}/preview`);
      if (this.groupId === groupId)
        this.preview = {
          assetId: asset.id,
          name: asset.name,
          inputCount: result.inputCount,
          rows: result.preview,
        };
    });
  }
  private forgetAsset(id: string) {
    this.selectedAssets = this.selectedAssets.filter(
      (selected) => selected !== id,
    );
    if (this.preview?.assetId === id) this.preview = undefined;
  }
  private async deleteAsset(asset: YpWorkflowAsset) {
    await this.action(async () => {
      await this.api.request(`/assets/${asset.id}`, "DELETE");
      this.forgetAsset(asset.id);
    });
  }
  private async connectGroup(event: Event) {
    event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement);
    const id = String(data.get("group"));
    const group = this.connectionGroups.find((g) => String(g.id) === id);
    if (!group) return;
    await this.action(() =>
      this.api.request("/connectors", "POST", {
        binding: {
          id: `group-${id}`,
          kind: "your-priorities",
          label: group.name,
          resourceId: id,
          writeEnabled: data.get("write") === "on",
          settings: {},
        },
        credential: {},
      }),
    );
  }
  private async reconcile(event: Event, id: string) {
    event.preventDefault();
    const form = new FormData(event.target as HTMLFormElement);
    await this.action(async () => {
      await this.api.request(`/usage/${id}/reconcile`, "POST", {
        actualMicros: Math.round(Number(form.get("cost")) * 1e6),
        result: JSON.parse(String(form.get("result") ?? "null")),
        note: String(form.get("note")),
      });
      this.usage = await this.api.request("/usage");
    });
  }
  private async respond(approval: Approval, allow: boolean) {
    await this.action(async () => {
      await this.api.request("/session/approval", "POST", {
        requestId: approval.requestId,
        ...(allow
          ? { result: { decision: "accept" } }
          : {
              error: { code: -32000, message: "Declined by the operator" },
            }),
      });
      this.approvals = this.approvals.filter((a) => a !== approval);
    });
  }
  private async answer(event: Event, approval: Approval) {
    event.preventDefault();
    const form = new FormData(event.target as HTMLFormElement);
    const questions = Array.isArray(approval.params.questions)
      ? approval.params.questions.map((q) => this.record(q))
      : [];
    await this.action(async () => {
      const answers = Object.fromEntries(
        questions.map((q) => [
          String(q.id),
          { answers: [String(form.get(String(q.id)) ?? "")] },
        ]),
      );
      await this.api.request("/session/approval", "POST", {
        requestId: approval.requestId,
        result: { answers },
      });
      this.approvals = this.approvals.filter((a) => a !== approval);
    });
  }
  private renderApproval(approval: Approval) {
    if (
      approval.method === "item/tool/requestUserInput" &&
      Array.isArray(approval.params.questions)
    )
      return html`<form
        class="approval"
        @submit=${(event: Event) => this.answer(event, approval)}
      >
        <strong>${this.assistantName} needs your input</strong
        >${approval.params.questions.map((value) => {
          const question = this.record(value);
          return html`<label
            >${String(question.question ?? question.header ?? "")}<input
              name=${String(question.id)}
              required
              list=${`choices-${question.id}`}
            /><datalist id=${`choices-${question.id}`}>
              ${(Array.isArray(question.options) ? question.options : []).map(
                (option) =>
                  html`<option value=${String(this.record(option).label ?? "")}>
                    ${String(this.record(option).description ?? "")}
                  </option>`,
              )}
            </datalist></label
          >`;
        })}<button ?disabled=${!this.operator || this.busy}>
          Send answers
        </button>
      </form>`;
    return html`<div class="approval">
      <strong>${this.assistantName} requests approval</strong>
      <pre>${JSON.stringify(approval.params, null, 2)}</pre>
      <div class="toolbar">
        <button
          ?disabled=${!this.operator || this.busy}
          @click=${() => this.respond(approval, true)}
        >
          Approve</button
        ><button
          ?disabled=${!this.operator || this.busy}
          @click=${() => this.respond(approval, false)}
        >
          Decline
        </button>
      </div>
    </div>`;
  }
  private async resume(event: Event, run: YpWorkflowRun) {
    event.preventDefault();
    const fields = new FormData(event.target as HTMLFormElement);
    const budgetMicros = Math.round(Number(fields.get("cap")) * 1e6);
    const nodeBudgets = Object.fromEntries(
      run.nodeIds.flatMap((id) => {
        const value = fields.get(`node:${id}`);
        return value ? [[id, Math.round(Number(value) * 1e6)]] : [];
      }),
    );
    await this.action(() =>
      this.api.request(`/runs/${run.id}/resume`, "POST", {
        budgetMicros,
        nodeBudgets,
      }),
    );
  }
  override render() {
    if (this.missing)
      return html`<section class="panel">
        <h2>Live workflow setup</h2>
        ${this.mayCreate
          ? html`<yp-live-workflow-admin
              .groupId=${this.groupId}
              @workflow-updated=${() => {
                this.error = "";
                void this.refresh();
              }}
            ></yp-live-workflow-admin>`
          : html`<p>A group administrator needs to set up this workflow.</p>`}
      </section>`;
    if (!this.snapshot)
      return this.error
        ? html`<p class="error" role="alert">${this.error}</p>
            <button @click=${() => this.refresh()}>Retry</button>`
        : html`<p>Loading live workflow…</p>`;
    const state = this.workspace!,
      permissions = this.snapshot.permissions;
    return html` <div class="header">
        <div>
          <h2>
            ${state.config.packageId === "skills-first"
              ? "Skills First"
              : state.config.packageId}
            · Live workflow
          </h2>
          <div class="muted">
            Draft revision ${state.revision} ·
            ${state.operator
              ? `Operator #${state.operator.userId}`
              : "No active operator"}
          </div>
        </div>
        <div class="cost">
          ${dollars(state.spentMicros)} spent + ${dollars(state.reservedMicros)}
          reserved / ${dollars(state.config.budgetMicros)}
        </div>
        <div class="toolbar">
          ${permissions.operate
            ? html`<button
                ?disabled=${this.busy || this.operator}
                @click=${() =>
                  this.action(() =>
                    this.api.request("/operator", "POST", {
                      takeover: Boolean(state.operator),
                    }),
                  )}
              >
                ${state.operator && !this.operator
                  ? `Take over and stop the current ${this.assistantName} session`
                  : "Take operator control"}
              </button>`
            : nothing}
        </div>
      </div>
      ${this.error
        ? html`<p class="error" role="alert">${this.error}</p>`
        : nothing}
      <div class="layout">
        <section class="panel chat">
          <div class="chat-heading">
            <span class="codex-mark" aria-hidden="true">&lt;/&gt;</span>
            <div>
              <h3>Talk with ${this.assistantName}</h3>
              <p>Plan, build, and run your workflow.</p>
            </div>
          </div>
          ${permissions.operate
            ? html`<div class="toolbar">
                <button ?disabled=${this.busy} @click=${this.login}>
                  ${this.snapshot.chatgptConnected
                    ? "Reconnect ChatGPT"
                    : "Connect ChatGPT"}</button
                >${this.snapshot.codexAuthMode
                  ? html`<button
                      ?disabled=${this.busy}
                      @click=${() =>
                        this.action(() =>
                          this.api.request("/account", "DELETE"),
                        )}
                    >
                      Disconnect
                    </button>`
                  : nothing}
              </div>`
            : nothing}
          ${permissions.operate
            ? html` <p
                  role="status"
                  class="connection-status"
                  ?data-connected=${Boolean(this.snapshot.codexAuthMode)}
                >
                  ${this.snapshot.codexAuthMode === "api-key"
                    ? "OpenAI API key connected"
                    : this.snapshot.codexAuthMode === "chatgpt"
                      ? "ChatGPT connected"
                      : `Connect ChatGPT or an OpenAI API key to talk with ${this.assistantName}.`}
                </p>
                <details class="auth">
                  <summary>Use an OpenAI API key</summary>
                  <p>
                    Assistant usage is billed to your OpenAI API account.
                    Processing agents use the workflow's configured provider
                    credentials.
                  </p>
                  <form @submit=${this.loginApiKey}>
                    <label
                      >OpenAI API key<input
                        name="apiKey"
                        type="password"
                        required
                        minlength="20"
                        maxlength="512"
                        autocomplete="off"
                        spellcheck="false"
                        ?disabled=${this.busy || Boolean(this.auth)}
                    /></label>
                    <button ?disabled=${this.busy || Boolean(this.auth)}>
                      Connect API key
                    </button>
                  </form>
                </details>`
            : nothing}
          ${this.auth
            ? html`<div class="auth">
                <p>
                  <a
                    href=${this.auth.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    >Sign in with ChatGPT</a
                  >
                  and enter:
                </p>
                <code>${this.auth.userCode}</code>
                <div class="toolbar">
                  <button
                    @click=${() =>
                      navigator.clipboard.writeText(this.auth!.userCode)}
                  >
                    Copy code</button
                  ><button
                    ?disabled=${this.busy}
                    @click=${() =>
                      this.action(async () => {
                        await this.api.request("/account/complete", "POST", {});
                        this.auth = undefined;
                      })}
                  >
                    I have signed in</button
                  ><button
                    ?disabled=${this.busy}
                    @click=${() =>
                      this.action(async () => {
                        await this.api.request("/account", "DELETE");
                        this.auth = undefined;
                      })}
                  >
                    Cancel login
                  </button>
                </div>
              </div>`
            : nothing}
          <div class="history" role="log" aria-live="polite">
            ${this.chat.length
              ? this.chat.map(
                  (item) =>
                    html`<yp-live-workflow-message
                      .messageRole=${item.role}
                      .assistantName=${this.assistantName}
                      .text=${item.text}
                      .at=${item.at}
                      .modelDetails=${item.modelDetails}
                      .completed=${Boolean(item.completed)}
                      .sender=${item.userId === this.loggedInUser?.id
                        ? this.loggedInUser
                        : undefined}
                    ></yp-live-workflow-message>`,
                )
              : html`<p class="empty">
                  Describe the experiment you want to run. ${this.assistantName}
                  can inspect data, improve agents, and update the workflow
                  diagram.
                </p>`}
          </div>
          ${this.approvals.map((approval) => this.renderApproval(approval))}
          <yp-live-workflow-assistant-settings
            .groupId=${this.groupId}
            .settings=${{
              model: state.config.codexModel,
              reasoningEffort: state.config.codexReasoningEffort,
              serviceTier: state.config.codexServiceTier ?? "regular",
            }}
            .session=${this.snapshot.assistantSession}
            .canEdit=${permissions.operate && this.operator}
            .connected=${Boolean(this.snapshot.codexAuthMode)}
            @assistant-settings-pending=${(event: CustomEvent<boolean>) => {
              this.assistantSettingsPending = event.detail;
            }}
            @workflow-updated=${(
              event: CustomEvent<YpWorkflowAssistantSettings | undefined>,
            ) => {
              if (event.detail) {
                state.config = {
                  ...state.config,
                  codexModel: event.detail.model,
                  codexReasoningEffort: event.detail.reasoningEffort,
                  codexServiceTier: event.detail.serviceTier,
                };
              }
              void this.refresh();
            }}
          ></yp-live-workflow-assistant-settings>
          <form class="composer" @submit=${this.send}>
            <label
              >Message ${this.assistantName}<textarea
                name="message"
                required
                ?disabled=${!this.operator || !this.snapshot.codexAuthMode}
                placeholder="Inspect the uploaded job descriptions and propose a Skills First trial…"
              ></textarea>
            </label>
            <div class="toolbar">
              <button
                class="primary"
                ?disabled=${this.busy ||
                this.assistantSettingsPending ||
                !this.operator ||
                !this.snapshot.codexAuthMode}
              >
                Send</button
              ><label class="inline"
                ><input type="checkbox" name="steer" />Steer current turn</label
              ><button
                type="button"
                ?disabled=${!this.operator || this.busy}
                @click=${() =>
                  this.action(() =>
                    this.api.request("/session/interrupt", "POST", {}),
                  )}
              >
                Interrupt
              </button>
              <button
                type="button"
                ?disabled=${!this.operator ||
                this.busy ||
                !this.workspace?.sessionId}
                @click=${() =>
                  this.action(() =>
                    this.api.request("/session/terminate", "POST", {}),
                  )}
              >
                Restart ${this.assistantName} session
              </button>
            </div>
          </form>
          ${this.snapshot.codexAuthMode === "chatgpt"
            ? html`<details>
                <summary>ChatGPT plan usage</summary>
                <p class="muted">
                  ChatGPT quotas are separate from processing API charges.
                </p>
                <pre>
${this.quota ||
                  `Quota information appears when reported by ${this.assistantName}.`}</pre
                >
              </details>`
            : nothing}
        </section>
        <section class="panel">
          <nav class="tabs" aria-label="Workflow views">
            ${(["graph", "data", "results", "usage", "settings"] as const)
              .filter((tab) => tab !== "settings" || permissions.admin)
              .map(
                (tab) =>
                  html`<button
                    aria-selected=${this.tab === tab}
                    @click=${() => {
                      this.tab = tab;
                      if (tab === "usage")
                        void this.action(async () => {
                          this.usage = await this.api.request("/usage");
                        });
                    }}
                  >
                    ${{
                      graph: "Agents",
                      data: "Data",
                      results: "Results",
                      usage: "Usage",
                      settings: "Settings",
                    }[tab]}
                  </button>`,
              )}
          </nav>
          ${this.tab === "graph"
            ? this.renderGraph()
            : this.tab === "data"
              ? this.renderData()
              : this.tab === "results"
                ? html`<yp-live-workflow-results
                    .groupId=${this.groupId}
                    .runs=${this.snapshot!.runs}
                    .runId=${this.run?.id ?? ""}
                    @workflow-run-selected=${(event: CustomEvent<string>) => {
                      this.viewedRunId = event.detail;
                    }}
                    .revision=${this.snapshot!.workspace.nextEvent}
                  ></yp-live-workflow-results>`
                : this.tab === "usage"
                  ? this.renderUsage()
                  : html`<yp-live-workflow-admin
                        .groupId=${this.groupId}
                        @workflow-updated=${() => this.refresh()}
                      ></yp-live-workflow-admin
                      >${this.renderStorage()}`}
          ${this.renderRuns()}
        </section>
      </div>
      ${this.renderAgentDialog()}`;
  }
  private renderGraph() {
    const node = (this.run?.graph ?? this.workspace?.graph)?.nodes.find(
      (n) => n.id === this.selectedNode,
    );
    return html` <div class="toolbar">
        <label
          >Display<select
            .value=${this.viewedRunId}
            @change=${(e: Event) => {
              this.viewedRunId = (e.target as HTMLSelectElement).value;
              this.draft =
                this.run?.status === "awaiting_approval" ? this.run : undefined;
            }}
          >
            <option value="" ?selected=${!this.viewedRunId}>
              ${this.workspace?.activeRunId ? "Active run" : "Current draft"}
            </option>
            <option value="draft" ?selected=${this.viewedRunId === "draft"}>
              Current draft
            </option>
            ${this.snapshot!.runs.map(
              (r) =>
                html`<option
                  value=${r.id}
                  ?selected=${this.viewedRunId === r.id}
                >
                  ${r.mode} · ${r.status} · ${r.createdAt.slice(0, 16)}
                </option>`,
            )}
          </select></label
        ><button
          ?disabled=${this.busy || !this.operator}
          @click=${() =>
            this.action(() => this.api.request("/validate", "POST", {}))}
        >
          Validate ${this.assistantName} changes
        </button>
      </div>
      <yp-live-workflow-graph
        .graph=${this.run?.graph ?? this.workspace!.graph}
        .run=${this.run}
        .selectedNode=${this.selectedNode}
        @select-node=${(
          e: CustomEvent<{ id?: string; configure?: boolean }>,
        ) => {
          this.selectedNode = e.detail.id;
          if (e.detail.configure && e.detail.id)
            void this.openAgentSettings(e.detail.id);
        }}
      ></yp-live-workflow-graph>
      ${node?.kind === "agent"
        ? html`<div class="agent-selection">
            <strong>${node.label}</strong
            ><button @click=${() => this.openAgentSettings(node.id)}>
              Models &amp; settings
            </button>
          </div>`
        : nothing}
      ${this.renderHistory()}`;
  }
  private renderAgentDialog() {
    const editor = this.agentEditor;
    if (!editor || !this.snapshot) return nothing;
    const node = editor.graph.nodes.find((n) => n.id === editor.nodeId)!;
    const run = this.snapshot.runs.find((r) => r.id === editor.runId);
    const catalog = editor.runId
      ? (run?.modelCatalog ?? [])
      : this.snapshot.models;
    const readonly = Boolean(editor.runId) || !this.operator;
    const stale = !editor.runId && editor.revision !== this.workspace!.revision;
    return html`<dialog
      class="agent-dialog"
      aria-labelledby="agent-dialog-title"
      @close=${this.agentDialogClosed}
      @cancel=${(event: Event) => {
        event.preventDefault();
        if (!this.agentSaving) this.closeAgentSettings();
      }}
    >
      ${keyed(
        editor,
        html`
          <header>
            <div>
              <h2 id="agent-dialog-title">${node.label}</h2>
              <span class="muted"
                >Models &amp; settings ·
                ${editor.runId
                  ? `Saved run · revision ${editor.revision}`
                  : `Current draft · revision ${editor.revision}`}</span
              >
            </div>
            <button
              type="button"
              aria-label="Close agent settings"
              ?disabled=${this.agentSaving}
              @click=${this.closeAgentSettings}
            >
              ✕
            </button>
          </header>
          ${editor.runId
            ? html`<div class="notice">
                <p>
                  This run keeps its original models and reasoning settings.
                  Changes to the draft apply to future runs.
                </p>
                ${this.operator &&
                this.workspace!.graph.nodes.some((n) => n.id === node.id)
                  ? html`<button type="button" @click=${this.editAgentDraft}>
                      Edit current draft
                    </button>`
                  : nothing}
              </div>`
            : html`<p class="notice">
                Choose models for this agent’s next run. Other agents and the
                chat assistant keep their own model settings. Model changes
                require a new trial before bulk approval.
              </p>`}
          ${!this.operator
            ? html`<p class="notice">
                ${this.snapshot.permissions.operate
                  ? "Take operator control to change models."
                  : "You can review this agent’s settings and model history."}
              </p>`
            : nothing}
          ${stale
            ? html`<p class="error" role="alert">
                The draft changed while this window was open. Reload the current
                draft before saving.
                <button type="button" @click=${this.editAgentDraft}>
                  Reload current draft
                </button>
              </p>`
            : nothing}
          ${this.agentError
            ? html`<p class="error" role="alert">${this.agentError}</p>`
            : nothing}
          <form @submit=${this.saveNode}>
            <fieldset ?disabled=${readonly || this.agentSaving}>
              <div class="row">
                ${agentModelRoles(
                  node,
                  this.snapshot.modelRoles ?? ["default", "review"],
                ).map((role) => {
                  const id = node.models[role] ?? "";
                  const model = catalog.find(
                    (item) => item.id === (id || node.models.default),
                  );
                  return html`<div>
                    <label
                      >${modelRoleLabel(role)} model
                      <select
                        name=${`agent-model:${role}`}
                        .value=${id}
                        @change=${(event: Event) =>
                          this.modelChoiceChanged(event, role)}
                      >
                        <option value="" ?selected=${!id}>
                          ${role === "default"
                            ? "No model selected"
                            : "Use processing model"}
                        </option>
                        ${id && !catalog.some((item) => item.id === id)
                          ? html`<option value=${id} selected>
                              ${id}
                              (${editor.runId ? "saved model" : "unavailable"})
                            </option>`
                          : nothing}
                        ${catalog.map(
                          (item) =>
                            html`<option
                              value=${item.id}
                              ?selected=${id === item.id}
                            >
                              ${item.label} · ${item.id}
                            </option>`,
                        )}
                      </select></label
                    >
                    <span class="model-note"
                      >${modelReasoning(node, model)}${!id && role !== "default"
                        ? " · uses processing model"
                        : ""}</span
                    >
                    ${model
                      ? html`<span class="model-note"
                          >${dollars(model.inputMicrosPerMillion)} input /
                          ${dollars(model.outputMicrosPerMillion)} output per 1M
                          tokens${model.inferenceType
                            ? ` · ${model.inferenceType}`
                            : ""}</span
                        >`
                      : nothing}
                  </div>`;
                })}
              </div>
              <label
                >Agent reasoning effort<select
                  name="reasoningEffort"
                  .value=${node.reasoningEffort ?? ""}
                  @change=${(event: Event) => {
                    const effort = (event.target as HTMLSelectElement).value as
                      | YpWorkflowReasoningEffort
                      | "";
                    if (effort) node.reasoningEffort = effort;
                    else delete node.reasoningEffort;
                    this.requestUpdate();
                  }}
                >
                  <option value="" ?selected=${!node.reasoningEffort}>
                    Use model default
                  </option>
                  ${["low", "medium", "high", "xhigh", "max"].map(
                    (effort) =>
                      html`<option
                        value=${effort}
                        ?selected=${node.reasoningEffort === effort}
                      >
                        ${effort}
                      </option>`,
                  )}
                </select></label
              >
              <small
                >Reasoning overrides apply to every role and require OpenAI
                reasoning models. Review and other roles use the processing
                model unless you choose an override. Only roles requested by the
                agent make model calls.</small
              >
              <label
                >Agent spending cap (USD, optional)<input
                  name="nodeCap"
                  type="number"
                  min="0.01"
                  step="0.01"
                  .value=${node.budgetMicros === undefined
                    ? ""
                    : String(node.budgetMicros / 1e6)}
              /></label>
              <details>
                <summary>Agent configuration</summary>
                ${node.description ? html`<p>${node.description}</p>` : nothing}
                <label class="inline"
                  ><input
                    name="enabled"
                    type="checkbox"
                    .checked=${node.enabled}
                  />Enabled</label
                >
                ${node.id === "normalize"
                  ? html`<div class="row">
                      <label
                        >Title column<input
                          name="nameColumn"
                          .value=${String(
                            this.record(node.configuration.fields).name ??
                              "name",
                          )} /></label
                      ><label
                        >Description column<input
                          name="textColumn"
                          .value=${String(
                            this.record(node.configuration.fields).text ??
                              "text",
                          )}
                      /></label>
                    </div>`
                  : nothing}
                <label
                  >Agent settings (JSON)<textarea
                    name="configuration"
                    .value=${JSON.stringify(node.configuration, null, 2)}
                  ></textarea>
                </label>
              </details>
            </fieldset>
            ${!readonly
              ? html`<div class="dialog-actions">
                  <button
                    type="button"
                    ?disabled=${this.agentSaving}
                    @click=${this.closeAgentSettings}
                  >
                    Cancel</button
                  ><button
                    class="primary"
                    ?disabled=${this.agentSaving || stale}
                  >
                    ${this.agentSaving ? "Saving…" : "Save agent settings"}
                  </button>
                </div>`
              : nothing}
          </form>
          ${run?.nodeCosts?.[node.id]
            ? html`<p>
                ${dollars(run.nodeCosts[node.id].spentMicros)} settled ·
                ${dollars(run.nodeCosts[node.id].reservedMicros)} reserved ·
                ${run.nodeCosts[node.id].requests} requests
              </p>`
            : nothing}
          ${run?.nodeStates[node.id]?.failedRecords
            ? html`<p class="error">
                ${run.nodeStates[node.id].failedRecords} records need review.
              </p>`
            : nothing}
          ${this.renderAgentModelHistory(node.id)}
        `,
      )}
    </dialog>`;
  }
  private modelChoiceChanged(event: Event, role: string) {
    const node = this.agentEditor!.graph.nodes.find(
      (n) => n.id === this.agentEditor!.nodeId,
    )!;
    const id = (event.target as HTMLSelectElement).value;
    if (id) node.models[role] = id;
    else delete node.models[role];
    this.requestUpdate();
  }
  private renderAgentModelHistory(nodeId: string) {
    const runs = this.snapshot!.runs.filter((run) =>
      run.nodeIds.includes(nodeId),
    )
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return html`<section aria-label="Model history">
      <h3>Model history</h3>
      <p class="muted">
        Saved selections for this agent in each run. Other roles inherit the
        processing model unless an override is listed.
      </p>
      ${runs.length
        ? html`<div class="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Run</th>
                  <th scope="col">Models &amp; reasoning</th>
                  <th scope="col">Agent cost</th>
                </tr>
              </thead>
              <tbody>
                ${runs.map((run) => {
                  const node = run.graph.nodes.find((n) => n.id === nodeId);
                  if (!node) return nothing;
                  const cap = run.nodeBudgets?.[nodeId] ?? node.budgetMicros;
                  return html`<tr>
                    <td>
                      <button
                        type="button"
                        class="history-run"
                        ?disabled=${this.agentSaving}
                        aria-current=${run.id === this.agentEditor?.runId
                          ? "true"
                          : "false"}
                        @click=${() => {
                          this.viewedRunId = run.id;
                          void this.openAgentSettings(nodeId, run);
                        }}
                      >
                        ${run.mode} · ${run.id.slice(0, 8)}</button
                      ><small>${new Date(run.createdAt).toLocaleString()}</small
                      ><small>Revision ${run.revision} · ${run.status}</small>
                    </td>
                    <td>
                      ${Object.entries(node.models).length
                        ? Object.entries(node.models).map(([role, id]) => {
                            const model = run.modelCatalog?.find(
                              (item) => item.id === id,
                            );
                            return html`<div class="model-role">
                              <strong>${modelRoleLabel(role)}</strong>:
                              ${id}<small>${modelReasoning(
                                node,
                                model,
                              )}</small>${model
                                ? html`<small
                                    >${dollars(model.inputMicrosPerMillion)} in
                                    / ${dollars(model.outputMicrosPerMillion)}
                                    out per 1M · ${model.priceVersion}</small
                                  >`
                                : nothing}
                            </div>`;
                          })
                        : "No model selected"}
                    </td>
                    <td>
                      ${run.nodeCosts?.[nodeId]
                        ? dollars(run.nodeCosts[nodeId].spentMicros)
                        : "Not recorded"}${cap
                        ? html`<small>Cap ${dollars(cap)}</small>`
                        : nothing}
                    </td>
                  </tr>`;
                })}
              </tbody>
            </table>
          </div>`
        : html`<p>No saved runs for this agent yet.</p>`}
    </section>`;
  }
  private async compareRevision(hash: string) {
    const groupId = this.groupId;
    await this.action(async () => {
      const selected = await this.api.request<{
        files: Record<string, string>;
      }>(`/revisions/${hash}`);
      const current = this.history?.currentHash
        ? await this.api.request<{ files: Record<string, string> }>(
            `/revisions/${this.history.currentHash}`,
          )
        : { files: {} };
      if (this.groupId === groupId)
        this.comparedRevision = {
          hash,
          files: selected.files,
          currentFiles: current.files,
        };
    });
  }
  private renderHistory() {
    const selected = this.comparedRevision;
    const changed = selected
      ? [
          ...new Set([
            ...Object.keys(selected.files),
            ...Object.keys(selected.currentFiles),
          ]),
        ]
          .filter(
            (file) => selected.files[file] !== selected.currentFiles[file],
          )
          .sort()
      : [];
    return html`<details>
      <summary>Package revision history</summary>
      <p>
        Validate ${this.assistantName} changes to save a revision. Comparisons
        use the last validated draft.
      </p>
      <button
        ?disabled=${this.busy}
        @click=${() =>
          this.action(async () => {
            this.history = await this.api.request("/revisions");
          })}
      >
        Load saved revisions
      </button>
      ${this.history?.revisions.map(
        (revision) =>
          html`<p>
            ${revision.at.slice(0, 16)} · ${revision.agents} agents ·
            ${revision.hash.slice(0, 10)}
            <button
              ?disabled=${this.busy}
              @click=${() => this.compareRevision(revision.hash)}
            >
              Inspect revision
            </button>
          </p>`,
      )}
      ${selected
        ? html`<h4>Revision ${selected.hash.slice(0, 10)}</h4>
            <p>${changed.length} files differ from the last validated draft.</p>
            ${changed.map(
              (file) =>
                html`<details>
                  <summary>${file}</summary>
                  <h5>Selected revision</h5>
                  <pre>${selected.files[file] ?? "File absent"}</pre>
                  <h5>Last validated draft</h5>
                  <pre>${selected.currentFiles[file] ?? "File absent"}</pre>
                </details>`,
            )}
            <details>
              <summary>All files in selected revision</summary>
              ${Object.entries(selected.files).map(
                ([file, content]) =>
                  html`<details>
                    <summary>${file}</summary>
                    <pre>${content}</pre>
                  </details>`,
              )}
            </details>
            <p>
              Restore requires an idle assistant and no active run. The current
              draft is retained as a VM backup. New runs require a fresh trial.
            </p>
            <button
              ?disabled=${this.busy ||
              !this.operator ||
              Boolean(this.workspace?.activeRunId)}
              @click=${() =>
                this.action(async () => {
                  await this.api.request(
                    `/revisions/${selected.hash}/restore`,
                    "POST",
                    { revision: this.workspace!.revision },
                  );
                  this.history = await this.api.request("/revisions");
                  this.comparedRevision = undefined;
                  this.viewedRunId = "draft";
                  this.draft = undefined;
                })}
            >
              Restore this revision and retain draft backup
            </button>`
        : nothing}
    </details>`;
  }
  private renderStorage() {
    return html`<details>
      <summary>VM storage</summary>
      <button
        ?disabled=${this.busy}
        @click=${() =>
          this.action(async () => {
            this.storageInfo = await this.api.request("/storage");
          })}
      >
        Check host disk space
      </button>
      ${this.storageInfo
        ? html`<p>
              ${(this.storageInfo.availableBytes / 1024 ** 3).toFixed(1)} GiB
              available ·
              ${(this.storageInfo.minimumFreeBytes / 1024 ** 3).toFixed(1)} GiB
              required before starting work.
            </p>
            <p>
              ${this.storageInfo.eligibleRuns} finished runs have VM snapshots
              eligible for cleanup after 30 days. Uploaded data, exported
              results and audit history are retained.
            </p>
            <button
              ?disabled=${this.busy || !this.storageInfo.eligibleRuns}
              @click=${() =>
                this.action(async () => {
                  this.storageInfo = await this.api.request(
                    "/storage/prune",
                    "POST",
                    {},
                  );
                })}
            >
              Remove up to 100 old run snapshots
            </button>`
        : nothing}
    </details>`;
  }
  private renderData() {
    return html` <h3>Private workspace data</h3>
      <p class="muted">
        ${(this.workspace!.storedBytes / 1024 ** 2).toFixed(1)} MiB used ·
        ${(this.workspace!.config.quotaBytes / 1024 ** 3).toFixed(1)} GiB quota.
        Uploads create immutable file versions.
      </p>
      <label
        >Upload documents or tables (250 MiB per file)<input
          type="file"
          multiple
          accept=".json,.csv,.tsv,.txt,.md,.html,.pdf,.docx"
          ?disabled=${!this.operator || this.busy}
          @change=${this.upload} /></label
      >${this.uploadProgress
        ? html`<progress .value=${this.uploadProgress} max="1"></progress>`
        : nothing}
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Use</th>
              <th>File</th>
              <th>Version</th>
              <th>Size</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${this.snapshot!.assets.map(
              (asset) =>
                html`<tr>
                  <td>
                    <input
                      aria-label=${`Select ${asset.name}`}
                      type="checkbox"
                      .checked=${this.selectedAssets.includes(asset.id)}
                      @change=${(e: Event) => {
                        this.selectedAssets = (e.target as HTMLInputElement)
                          .checked
                          ? [...this.selectedAssets, asset.id]
                          : this.selectedAssets.filter((id) => id !== asset.id);
                      }}
                    />
                  </td>
                  <td>
                    <a href=${`${this.api.base}/assets/${asset.id}`} download
                      >${asset.name}</a
                    >
                    <div class="muted">${asset.source}</div>
                  </td>
                  <td>${asset.version}</td>
                  <td>${(asset.bytes / 1024).toFixed(1)} KiB</td>
                  <td>
                    <button
                      ?disabled=${!this.operator || this.busy}
                      @click=${() => this.deleteAsset(asset)}
                    >
                      Delete
                    </button>
                    <button
                      ?disabled=${this.busy}
                      @click=${() => this.previewAsset(asset)}
                    >
                      Preview
                    </button>
                  </td>
                </tr>`,
            )}
          </tbody>
        </table>
      </div>
      ${this.preview
        ? html`<section class="inspector">
            <h3>${this.preview.name}</h3>
            <p>
              ${this.preview.inputCount} records · preview shows up to 20
              records with shortened long fields.
            </p>
            ${this.preview.rows.map(
              (row) =>
                html`<details>
                  <summary>
                    ${String(row.name ?? row.title ?? row.id ?? "Record")} ·
                    ${String(row.status ?? "input")}
                  </summary>
                  ${row.text || row.description
                    ? html`<h4>Original</h4>
                        <pre>${String(row.text ?? row.description)}</pre>`
                    : nothing}
                  ${row.rewrittenText
                    ? html`<h4>Proposed rewrite</h4>
                        <pre>${String(row.rewrittenText)}</pre>`
                    : nothing}
                  ${row.citations
                    ? html`<h4>Evidence</h4>
                        <pre>${JSON.stringify(row.citations, null, 2)}</pre>`
                    : nothing}
                  ${row.errors
                    ? html`<h4>Review notes</h4>
                        <pre>${JSON.stringify(row.errors, null, 2)}</pre>`
                    : nothing}
                  <details>
                    <summary>All fields</summary>
                    <pre>${JSON.stringify(row, null, 2)}</pre>
                  </details>
                </details>`,
            )}
          </section>`
        : nothing}
      <h3 style="margin-top:24px">Data connections</h3>
      ${(this.snapshot!.connectionProposals ?? [])
        .filter((p) => p.status === "pending")
        .map(
          (proposal) =>
            html` <section class="panel">
              <h4>Proposed connection: ${proposal.binding.label}</h4>
              <p>${proposal.purpose}</p>
              <p>
                ${proposal.binding.kind} · ${proposal.binding.resourceId} ·
                ${proposal.binding.writeEnabled
                  ? "Read and approved exports"
                  : "Read only"}
              </p>
              <details>
                <summary>Connection settings</summary>
                <pre>${JSON.stringify(proposal.binding, null, 2)}</pre>
              </details>
              ${this.snapshot!.permissions.admin
                ? html` <form
                    @submit=${(event: Event) => {
                      event.preventDefault();
                      const form = event.target as HTMLFormElement;
                      void this.action(async () => {
                        const credential = JSON.parse(
                          String(new FormData(form).get("credential") || "{}"),
                        );
                        await this.api.request(
                          `/connection-proposals/${proposal.id}/approve`,
                          "POST",
                          { credential },
                        );
                        form.reset();
                      });
                    }}
                  >
                    ${proposal.binding.kind !== "your-priorities"
                      ? html`
                          <label
                            >Credentials (JSON, encrypted)<textarea
                              name="credential"
                              required
                              autocomplete="off"
                              placeholder='Google service account JSON, or {"apiKey":"…"} for Firecrawl'
                            ></textarea>
                          </label>
                          <p class="muted">
                            Credentials are stored by the server.
                            ${this.assistantName} does not receive them.
                            ${proposal.binding.kind === "firecrawl"
                              ? "Verify the configured credit price and request limit before approving."
                              : "Share the Google file with the service account first."}
                          </p>
                        `
                      : nothing}
                    <button ?disabled=${this.busy}>Approve connection</button>
                    <button
                      type="button"
                      ?disabled=${this.busy}
                      @click=${() =>
                        this.action(() =>
                          this.api.request(
                            `/connection-proposals/${proposal.id}/reject`,
                            "POST",
                            {},
                          ),
                        )}
                    >
                      Reject
                    </button>
                  </form>`
                : html`<p>Waiting for an administrator to review.</p>`}
            </section>`,
        )}
      ${this.snapshot!.permissions.admin
        ? html`<details>
            <summary>Connect a Your Priorities group</summary>
            <form
              @submit=${(event: Event) => {
                event.preventDefault();
                const query = String(
                  new FormData(event.target as HTMLFormElement).get("search") ??
                    "",
                );
                void this.action(async () => {
                  this.connectionGroups = await this.api.request(
                    `/connection-groups?q=${encodeURIComponent(query)}`,
                  );
                });
              }}
            >
              <label>Group name<input name="search" /></label
              ><button ?disabled=${this.busy}>Find accessible groups</button>
            </form>
            ${this.connectionGroups.length
              ? html`<form @submit=${this.connectGroup}>
                  <label
                    >Group<select name="group">
                      ${this.connectionGroups.map(
                        (group) =>
                          html`<option value=${group.id}>
                            ${group.name}
                          </option>`,
                      )}
                    </select></label
                  >
                  <label class="inline"
                    ><input type="checkbox" name="write" />Allow approved
                    exports (requires group administration)</label
                  >
                  <button ?disabled=${this.busy}>Connect group</button>
                </form>`
              : nothing}
          </details>`
        : nothing}
      ${this.connectionMessage
        ? html`<p role="status">${this.connectionMessage}</p>`
        : nothing}
      ${this.snapshot!.connectors.map(
        (binding) =>
          html`<div class="row">
            <strong>${binding.label}</strong
            ><span class="muted">${binding.kind} · ${binding.resourceId}</span
            >${binding.kind !== "firecrawl"
              ? html`<button
                  ?disabled=${!this.operator || this.busy}
                  @click=${() =>
                    this.action(async () => {
                      const asset = await this.api.request<YpWorkflowAsset>(
                        `/connectors/${binding.id}/import`,
                        "POST",
                        {},
                      );
                      this.selectedAssets = [...this.selectedAssets, asset.id];
                    })}
                >
                  Import a version
                </button>`
              : nothing}
            ${this.snapshot!.permissions.admin
              ? html` ${binding.kind !== "firecrawl"
                    ? html`<button
                        ?disabled=${this.busy}
                        @click=${() =>
                          this.action(async () => {
                            const result = await this.api.request<{
                              records: number;
                            }>(`/connectors/${binding.id}/check`, "POST", {});
                            this.connectionMessage = `${binding.label}: connected, ${result.records} records available.`;
                          })}
                      >
                        Test connection
                      </button>`
                    : nothing}
                  <button
                    ?disabled=${this.busy}
                    @click=${() =>
                      this.action(() =>
                        this.api.request(`/connectors/${binding.id}`, "DELETE"),
                      )}
                  >
                    Disconnect
                  </button>`
              : nothing}
          </div>`,
      )}
      ${this.snapshot!.permissions.admin
        ? html`<details>
            <summary>Add or update a connection</summary>
            <form @submit=${this.bindConnector}>
              <div class="row">
                <label
                  >Binding ID<input
                    name="id"
                    required
                    placeholder="firecrawl" /></label
                ><label>Label<input name="label" required /></label>
              </div>
              <label
                >Connector<select name="kind">
                  <option>your-priorities</option>
                  <option>google-sheets</option>
                  <option>google-docs</option>
                  <option>google-drive</option>
                  <option>firecrawl</option>
                </select></label
              ><label>Group or Google file ID<input name="resource" /></label
              ><label
                >Settings (JSON)<textarea
                  name="settings"
                  placeholder='{"range":"A:ZZ"} or {"creditMicros":1000,"maxCreditsPerRequest":20}'
                ></textarea></label
              ><label
                >Credentials (JSON, encrypted)<textarea
                  name="credential"
                  autocomplete="off"
                  placeholder='Google service account JSON, or {"apiKey":"…"} for Firecrawl'
                ></textarea></label
              ><label class="inline"
                ><input type="checkbox" name="write" />Allow approved output
                stages to write</label
              ><button ?disabled=${this.busy}>Save connection</button>
            </form>
          </details>`
        : nothing}`;
  }
  private renderUsage() {
    return html`<h3>Processing costs</h3>
      ${this.run?.forecast
        ? html`<p>
              Selected run forecast:
              ${dollars(this.run.forecast.remainingMicros)} remaining ·
              ${dollars(this.run.forecast.totalMicros)} total.
            </p>
            <p class="muted">${this.run.forecast.basis}</p>
            ${this.run.forecast.exceedsAllowance
              ? html`<p role="alert">
                  The current forecast exceeds this run’s approved allowance.
                </p>`
              : nothing}`
        : nothing}
      <p>
        ${dollars(this.workspace!.spentMicros)} settled ·
        ${dollars(this.workspace!.reservedMicros)} reserved
      </p>
      <p class="muted">
        Trial allowance: ${dollars(this.workspace!.trialSpentMicros)} used /
        ${dollars(this.workspace!.config.trialBudgetMicros)}. Infrastructure
        charges are separate.
      </p>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Request</th>
              <th>Status</th>
              <th>Cost / reserved</th>
            </tr>
          </thead>
          <tbody>
            ${this.usage.map(
              (u) =>
                html`<tr>
                  <td>
                    ${u.description}
                    <div class="muted">${u.id}</div>
                  </td>
                  <td>${u.status}</td>
                  <td>
                    ${dollars(u.actualMicros ?? u.maximumMicros)}${u.status ===
                      "unknown" && this.snapshot!.permissions.admin
                      ? html`<details>
                          <summary>Reconcile</summary>
                          <form
                            @submit=${(e: Event) => this.reconcile(e, u.id)}
                          >
                            <label
                              >Verified charge (USD)<input
                                name="cost"
                                type="number"
                                min="0"
                                step="0.000001"
                                required /></label
                            ><label
                              >Verified result (JSON)<textarea
                                name="result"
                                required
                              >
null</textarea
                              ></label
                            ><label
                              >Reconciliation note<input
                                name="note"
                                minlength="5"
                                required /></label
                            ><button ?disabled=${this.busy}>
                              Record verified outcome
                            </button>
                          </form>
                        </details>`
                      : nothing}
                  </td>
                </tr>`,
            )}
          </tbody>
        </table>
      </div>`;
  }
  private renderRuns() {
    const run = this.run;
    return html`<section class="run">
      <div class="row">
        <label
          >Trial records<input
            type="number"
            min="1"
            max="20"
            .value=${String(this.sampleCount)}
            @change=${(event: Event) => {
              this.sampleCount = Math.max(
                1,
                Math.min(
                  20,
                  Number((event.target as HTMLInputElement).value) || 5,
                ),
              );
            }}
        /></label>
        <label
          >Experiment scope<select
            .value=${this.targetNodeId}
            @change=${(event: Event) => {
              this.targetNodeId = (event.target as HTMLSelectElement).value;
              this.draft = undefined;
            }}
          >
            <option value="">Whole workflow</option>
            ${this.workspace!.graph.nodes.filter(
              (n) => n.kind === "agent" && n.enabled,
            ).map(
              (n) =>
                html`<option value=${n.id}>
                  Through ${n.label} (including dependencies)
                </option>`,
            )}
          </select></label
        >
      </div>
      <div class="toolbar">
        <button
          ?disabled=${!this.operator ||
          this.busy ||
          !this.selectedAssets.length ||
          Boolean(this.workspace!.activeRunId)}
          @click=${() => this.draftRun("trial")}
        >
          Run ${this.sampleCount}-record trial</button
        ><button
          ?disabled=${!this.operator ||
          this.busy ||
          !this.selectedAssets.length ||
          Boolean(this.workspace!.activeRunId)}
          @click=${() => this.draftRun("bulk")}
        >
          Estimate full run</button
        ><span class="muted"
          >${this.selectedAssets.length} input file(s) selected</span
        >
      </div>
      ${this.draft
        ? html`<form class="estimate" @submit=${this.approve}>
            <h3>Approve bulk processing</h3>
            <p>
              ${this.draft.inputCount} records · expected
              ${dollars(this.draft.estimate!.expectedMicros)} · upper projection
              ${dollars(this.draft.estimate!.upperMicros)}
            </p>
            <p class="muted">${this.draft.estimate!.notes.join(" ")}</p>
            ${this.draft.estimate!.evidence
              ? html`<p>
                  Sample coverage:
                  ${(this.draft.estimate!.evidence.coverage * 100).toFixed(2)}%
                  · per-parent cost range
                  ${dollars(
                    this.draft.estimate!.evidence.minRecordMicros,
                  )}–${dollars(this.draft.estimate!.evidence.maxRecordMicros)}
                  · cost attributed to records:
                  ${(
                    this.draft.estimate!.evidence.attributedCostFraction * 100
                  ).toFixed(0)}%.
                </p>`
              : nothing}
            ${this.draft.estimate?.agents
              ? html`<div class="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Agent</th>
                        <th>Sample cost</th>
                        <th>Expected</th>
                        <th>Upper projection</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${this.draft.estimate.agents.map(
                        (agent) =>
                          html`<tr>
                            <td>
                              ${this.draft!.graph.nodes.find(
                                (n) => n.id === agent.nodeId,
                              )?.label ?? agent.nodeId}
                            </td>
                            <td>${dollars(agent.sampleMicros)}</td>
                            <td>${dollars(agent.expectedMicros)}</td>
                            <td>${dollars(agent.upperMicros)}</td>
                          </tr>`,
                      )}
                    </tbody>
                  </table>
                </div>`
              : nothing}
            <label
              >Maximum approved spend (USD)<input
                name="cap"
                type="number"
                min="0.01"
                step="0.01"
                required
                .value=${String(
                  Math.ceil(this.draft.estimate!.upperMicros / 10000) / 100,
                )} /></label
            ><button class="primary" ?disabled=${this.busy}>
              Approve and start this revision</button
            ><button
              type="button"
              @click=${() => {
                this.draft = undefined;
              }}
            >
              Close
            </button>
          </form>`
        : nothing}
      ${run
        ? html`<p>
              <strong>${run.mode} · ${run.status}</strong> · ${run.inputCount}
              records · ${dollars(run.spentMicros)} /
              ${dollars(run.budgetMicros)}
            </p>
            ${run.error ? html`<p class="error">${run.error}</p>` : nothing}
            <div class="toolbar">
              ${(["pause", "cancel"] as const).map(
                (operation) =>
                  html`<button
                    ?disabled=${!this.operator ||
                    this.busy ||
                    ["completed", "failed", "cancelled"].includes(run.status)}
                    @click=${() =>
                      this.action(() =>
                        this.api.request(
                          `/runs/${run.id}/${operation}`,
                          "POST",
                          {},
                        ),
                      )}
                  >
                    ${operation}
                  </button>`,
              )}
            </div>
            ${run.status === "paused"
              ? html`<form @submit=${(event: Event) => this.resume(event, run)}>
                  <label
                    >Approved total run cap (USD)<input
                      name="cap"
                      type="number"
                      min=${String(run.spentMicros / 1e6)}
                      step="0.000001"
                      required
                      .value=${String(run.budgetMicros / 1e6)}
                  /></label>
                  ${run.nodeIds.map((id) => {
                    const node = run.graph.nodes.find((n) => n.id === id)!;
                    const cap = run.nodeBudgets?.[id] ?? node.budgetMicros;
                    return html`<label
                      >${node.label} total cap (USD, optional)
                      <input
                        name=${`node:${id}`}
                        type="number"
                        step="0.000001"
                        min="0.000001"
                        .value=${cap === undefined ? "" : String(cap / 1e6)}
                        placeholder="Run cap applies"
                    /></label>`;
                  })}
                  <button ?disabled=${!this.operator || this.busy}>
                    Approve allowance and resume
                  </button>
                </form>`
              : nothing}`
        : nothing}
    </section>`;
  }
}
