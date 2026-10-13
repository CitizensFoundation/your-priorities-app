import { LitElement, html, css, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LiveWorkflowApi } from "./api.js";

@customElement("yp-live-workflow-admin")
export class YpLiveWorkflowAdmin extends LitElement {
  @property({ type: Number }) groupId!: number;
  @state() private snapshot?: YpWorkflowSnapshot;
  @state() private error = "";
  @state() private busy = false;
  @state() private defaultCodexModel = "";
  @state() private defaultCodexReasoningEffort: YpWorkflowReasoningEffort =
    "max";
  @state() private codexModels: {
    id: string;
    model?: string;
    displayName?: string;
  }[] = [];
  @state() private packages: { id: string; name: string; version: string }[] =
    [];
  @state() private hosts: { id: string; name: string }[] = [];
  static override styles = css`
    :host {
      display: block;
    }
    form {
      display: grid;
      gap: 14px;
      max-width: 680px;
    }
    label {
      display: grid;
      gap: 6px;
    }
    input,
    select,
    button {
      font: inherit;
      padding: 10px;
      border: 1px solid #aaa;
      border-radius: 8px;
      background: transparent;
      color: inherit;
    }
    button {
      cursor: pointer;
    }
    p {
      line-height: 1.5;
    }
    .error {
      color: var(--md-sys-color-error, #a22);
    }
    .row {
      display: flex;
      gap: 12px;
    }
    .row > * {
      flex: 1;
    }
  `;
  override updated(changed: PropertyValues) {
    if (changed.has("groupId") && this.groupId) void this.load();
  }
  private async load() {
    try {
      const response = await fetch("/api/live-workflows/catalog", {
        credentials: "same-origin",
      });
      if (response.ok) {
        const catalog = await response.json();
        this.packages = catalog.packages;
        this.defaultCodexModel = catalog.modelDefaults.codexModel;
        this.defaultCodexReasoningEffort =
          catalog.modelDefaults.codexReasoningEffort;
      }
      this.snapshot = await new LiveWorkflowApi(
        this.groupId,
      ).request<YpWorkflowSnapshot>();
      this.hosts = this.snapshot.hosts;
    } catch (error) {
      try {
        const response = await fetch("/api/live-workflows/catalog", {
          credentials: "same-origin",
        });
        if (!response.ok) throw error;
        const catalog = await response.json();
        this.hosts = catalog.hosts;
        this.packages = catalog.packages;
        this.defaultCodexModel = catalog.modelDefaults.codexModel;
        this.defaultCodexReasoningEffort =
          catalog.modelDefaults.codexReasoningEffort;
      } catch {
        this.error =
          "Live Workflows is not enabled, or this group is not accessible.";
      }
    }
  }
  private async save(event: Event) {
    event.preventDefault();
    this.busy = true;
    this.error = "";
    try {
      const form = new FormData(event.target as HTMLFormElement),
        current = this.snapshot?.workspace.config;
      const config: YpWorkflowConfiguration = {
        packageId: String(form.get("package")),
        hostId: String(form.get("host")),
        codexModel: String(form.get("model")),
        codexReasoningEffort: String(
          form.get("reasoningEffort"),
        ) as YpWorkflowReasoningEffort,
        operatorIds: String(form.get("operators") ?? "")
          .split(",")
          .filter((v) => v.trim())
          .map(Number),
        budgetMicros: Math.round(Number(form.get("budget")) * 1e6),
        trialBudgetMicros: Math.round(Number(form.get("trial")) * 1e6),
        quotaBytes: Math.round(Number(form.get("quota")) * 1024 ** 3),
        concurrency: Number(form.get("concurrency")),
      };
      await new LiveWorkflowApi(this.groupId).request(
        current ? "/configuration" : "",
        current ? "PUT" : "POST",
        config,
      );
      await this.load();
      this.dispatchEvent(
        new CustomEvent("workflow-updated", { bubbles: true, composed: true }),
      );
    } catch (error) {
      this.error =
        error instanceof Error
          ? error.message
          : "Unable to save workflow settings";
    } finally {
      this.busy = false;
    }
  }
  private async discover() {
    this.busy = true;
    try {
      const result = await new LiveWorkflowApi(this.groupId).request<{
        data: {
          models: { id: string; model?: string; displayName?: string }[];
        };
      }>("/codex-models");
      this.codexModels = result.data.models;
    } catch (error) {
      this.error =
        error instanceof Error ? error.message : "Unable to list models";
    } finally {
      this.busy = false;
    }
  }
  override render() {
    const config = this.snapshot?.workspace.config;
    return html` <p>
        Each workflow package runs in a private group workspace on a registered
        VM host. Operators connect their own ChatGPT accounts. Processing agents
        use separately budgeted provider models.
      </p>
      ${this.error ? html`<p class="error" role="alert">${this.error}</p>` : ""}
      <form @submit=${this.save}>
        <label
          >Package<select name="package">
            ${this.packages
              .filter((p) => !config || p.id === config.packageId)
              .map(
                (p) =>
                  html`<option value=${p.id}>${p.name} ${p.version}</option>`,
              )}
          </select></label
        >
        <label
          >VM host<select name="host" required>
            ${this.hosts
              .filter((h) => !config || h.id === config.hostId)
              .map(
                (h) =>
                  html`<option
                    value=${h.id}
                    ?selected=${h.id === config?.hostId}
                  >
                    ${h.name}
                  </option>`,
              )}
          </select></label
        >
        <label
          >Codex model<input
            name="model"
            list="codex-models"
            required
            .value=${config?.codexModel ?? this.defaultCodexModel}
            placeholder="Select a model available to your ChatGPT account"
          /><datalist id="codex-models">
            ${this.codexModels.map(
              (m) =>
                html`<option value=${m.model ?? m.id}>
                  ${m.displayName ?? m.id}
                </option>`,
            )}
          </datalist></label
        >
        <label
          >Codex reasoning effort<select name="reasoningEffort">
            ${["low", "medium", "high", "xhigh", "max"].map(
              (effort) =>
                html`<option
                  value=${effort}
                  ?selected=${effort ===
                  (config?.codexReasoningEffort ??
                    this.defaultCodexReasoningEffort)}
                >
                  ${effort}
                </option>`,
            )}
          </select></label
        >
        <small
          >Higher effort allows more thinking and can increase response time and
          token usage. Choose a level supported by the selected model. Agent
          effort is configured separately in the graph.</small
        >
        ${config
          ? html`<button
                type="button"
                ?disabled=${this.busy}
                @click=${this.discover}
              >
                Load models from connected Codex</button
              ><small
                >Connect ChatGPT and take operator control in the workflow
                first.</small
              >`
          : ""}
        <div class="row">
          <label
            >Workflow spending cap (USD)<input
              name="budget"
              type="number"
              min="0"
              step="0.01"
              required
              .value=${String((config?.budgetMicros ?? 0) / 1e6)} /></label
          ><label
            >Cumulative trial allowance (USD)<input
              name="trial"
              type="number"
              min="0"
              step="0.01"
              required
              .value=${String((config?.trialBudgetMicros ?? 5e6) / 1e6)}
          /></label>
        </div>
        <label
          >Additional operator user IDs (comma separated)<input
            name="operators"
            .value=${config?.operatorIds.join(", ") ?? ""}
        /></label>
        <div class="row">
          <label
            >Storage quota (GiB)<input
              name="quota"
              type="number"
              min="1"
              step="1"
              required
              .value=${String(
                (config?.quotaBytes ?? 10 * 1024 ** 3) / 1024 ** 3,
              )} /></label
          ><label
            >Processing concurrency<input
              name="concurrency"
              type="number"
              min="1"
              max="16"
              required
              .value=${String(config?.concurrency ?? 2)}
          /></label>
        </div>
        <button type="submit" ?disabled=${this.busy || !this.hosts.length}>
          ${this.busy
            ? "Saving…"
            : config
              ? "Save workflow settings"
              : "Create live workspace"}
        </button>
      </form>`;
  }
}
