import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { live } from "lit/directives/live.js";
import { LiveWorkflowApi, LiveWorkflowApiError } from "./api.js";

export const assistantEfforts: YpWorkflowCodexReasoningEffort[] = [
  "none",
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
  "max",
];

export function assistantSettingsLabel(settings: YpWorkflowAssistantSettings) {
  return `${settings.model} · ${settings.reasoningEffort} reasoning · ${settings.serviceTier === "fast" ? "Fast" : "Standard"}`;
}

function sameSettings(
  a?: YpWorkflowAssistantSettings,
  b?: YpWorkflowAssistantSettings,
) {
  return (
    a?.model === b?.model &&
    a?.reasoningEffort === b?.reasoningEffort &&
    a?.serviceTier === b?.serviceTier
  );
}

@customElement("yp-live-workflow-assistant-settings")
export class YpLiveWorkflowAssistantSettings extends LitElement {
  @property({ type: Number }) groupId!: number;
  @property({ attribute: false }) settings!: YpWorkflowAssistantSettings;
  @property({ attribute: false })
  session?: YpWorkflowSnapshot["assistantSession"];
  @property({ type: Boolean }) canEdit = false;
  @property({ type: Boolean }) connected = false;
  @state() private draft?: YpWorkflowAssistantSettings;
  @state() private models: YpWorkflowCodexModel[] = [];
  @state() private saving = false;
  @state() private loading = false;
  @state() private error = "";
  @state() private saved = false;
  @state() private settingsOpen = false;
  private expected?: YpWorkflowAssistantSettings;

  static override styles = css`
    :host {
      display: block;
      margin: 8px 0;
    }
    .settings-trigger {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 7px 8px;
      border-color: transparent;
      color: var(--md-sys-color-on-surface-variant, #716b80);
    }
    .settings-trigger:hover {
      background: color-mix(
        in srgb,
        var(--md-sys-color-primary, #7663a8) 7%,
        transparent
      );
    }
    .selection {
      flex: 1;
      min-width: 0;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .settings-trigger svg {
      flex-shrink: 0;
      width: 15px;
      height: 15px;
    }
    dialog {
      box-sizing: border-box;
      width: min(420px, calc(100vw - 32px));
      max-height: calc(100dvh - 32px);
      margin: auto;
      overflow: auto;
      color: inherit;
      border: 1px solid var(--md-sys-color-outline-variant, #e2ddeb);
      border-radius: 18px;
      padding: 20px;
      background: var(--md-sys-color-surface, #fff);
      box-shadow: 0 18px 60px #30234530;
    }
    dialog::backdrop {
      background: #241b3940;
      backdrop-filter: blur(3px);
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
    header,
    .actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    header {
      justify-content: space-between;
      margin-bottom: 12px;
    }
    header h3 {
      margin: 0;
      font-size: 16px;
    }
    .close {
      padding: 3px 8px;
      border-color: transparent;
      font-size: 22px;
    }
    .badge {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      padding: 4px 7px;
      border-radius: 6px;
      background: #7663a815;
    }
    form {
      display: grid;
      gap: 10px;
    }
    .options {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 10px;
    }
    label {
      display: grid;
      gap: 5px;
      font-size: 12px;
      min-width: 0;
    }
    input,
    select,
    button {
      font: inherit;
      color: inherit;
      border: 1px solid var(--md-sys-color-outline-variant, #d4cede);
      border-radius: 8px;
      padding: 8px 10px;
      min-width: 0;
    }
    input,
    select {
      width: 100%;
      box-sizing: border-box;
      background: var(--md-sys-color-surface, #fff);
      font-size: 13px;
    }
    button {
      cursor: pointer;
      background: transparent;
      font-size: 12px;
    }
    button.primary {
      background: var(--md-sys-color-primary, #7663a8);
      color: var(--md-sys-color-on-primary, #fff);
      border-color: transparent;
    }
    button:disabled,
    input:disabled,
    select:disabled {
      opacity: 0.6;
      cursor: default;
    }
    :focus-visible {
      outline: 2px solid var(--md-sys-color-primary, #7663a8);
      outline-offset: 2px;
    }
    p {
      margin: 8px 0 0;
      font-size: 12px;
      line-height: 1.5;
      overflow-wrap: anywhere;
    }
    .hint {
      color: var(--md-sys-color-on-surface-variant, #716b80);
    }
    .running {
      border-left: 3px solid #8b77ba;
      padding-left: 9px;
    }
    .error {
      color: var(--md-sys-color-error, #a22);
    }
  `;

  override willUpdate(changed: PropertyValues) {
    if (changed.has("groupId")) {
      this.dialog?.close();
      this.settingsOpen = false;
      this.draft = undefined;
      this.expected = undefined;
      this.models = [];
      this.error = "";
      this.saved = false;
      this.saving = false;
      this.loading = false;
    }
    if (changed.has("canEdit") && !this.canEdit) this.reset();
  }
  override updated() {
    this.notifyPending();
  }
  private get dialog() {
    return this.renderRoot.querySelector<HTMLDialogElement>("dialog");
  }
  private openSettings() {
    this.saved = false;
    this.error = "";
    this.dialog?.showModal();
    this.settingsOpen = true;
  }
  private closeSettings() {
    if (this.saving) return;
    this.reset();
    this.dialog?.close();
  }
  private closed() {
    this.settingsOpen = false;
    if (!this.saved) this.reset();
    this.renderRoot
      .querySelector<HTMLButtonElement>(".settings-trigger")
      ?.focus();
  }

  private get dirty() {
    return Boolean(this.draft && !sameSettings(this.draft, this.settings));
  }
  private get stale() {
    return this.dirty && !sameSettings(this.expected, this.settings);
  }
  private get value() {
    return this.draft ?? this.settings;
  }
  private get efforts() {
    const model = this.models.find(
      (m) => (m.model ?? m.id) === this.value.model,
    );
    return model?.supportedReasoningEfforts?.length
      ? model.supportedReasoningEfforts
          .map((e) => e.reasoningEffort)
          .filter((e) => assistantEfforts.includes(e))
      : assistantEfforts;
  }
  private notifyPending() {
    this.dispatchEvent(
      new CustomEvent("assistant-settings-pending", {
        detail: this.dirty || this.saving,
        bubbles: true,
        composed: true,
      }),
    );
  }
  private edit(change: Partial<YpWorkflowAssistantSettings>) {
    if (!this.draft) this.expected = { ...this.settings };
    this.draft = { ...this.value, ...change };
    this.error = "";
    this.saved = false;
    if (!this.dirty) {
      this.draft = undefined;
      this.expected = undefined;
    }
    this.notifyPending();
  }
  private reset() {
    this.draft = undefined;
    this.expected = undefined;
    this.error = "";
    this.saved = false;
    this.notifyPending();
  }
  private updatedWorkflow(settings?: YpWorkflowAssistantSettings) {
    this.dispatchEvent(
      new CustomEvent("workflow-updated", {
        detail: settings,
        bubbles: true,
        composed: true,
      }),
    );
  }
  private async discover() {
    const groupId = this.groupId;
    this.loading = true;
    this.error = "";
    try {
      const result = await new LiveWorkflowApi(groupId).request<{
        data: { models: YpWorkflowCodexModel[] };
      }>("/codex-models");
      if (this.groupId !== groupId) return;
      this.models = result.data.models;
      this.updatedWorkflow();
    } catch (error) {
      if (this.groupId === groupId)
        this.error =
          error instanceof Error
            ? error.message
            : "Unable to load assistant models";
    } finally {
      if (this.groupId === groupId) this.loading = false;
    }
  }
  private async save(event: Event) {
    event.preventDefault();
    if (!this.canEdit || !this.dirty || this.stale || this.saving) return;
    const groupId = this.groupId;
    this.saving = true;
    this.error = "";
    this.notifyPending();
    try {
      const settings = await new LiveWorkflowApi(
        groupId,
      ).request<YpWorkflowAssistantSettings>("/assistant-settings", "PUT", {
        settings: this.value,
        expected: this.expected,
      });
      if (this.groupId !== groupId) return;
      this.settings = settings;
      this.draft = undefined;
      this.expected = undefined;
      this.saved = true;
      this.updatedWorkflow(settings);
      this.dialog?.close();
    } catch (error) {
      if (this.groupId !== groupId) return;
      this.error =
        error instanceof Error
          ? error.message
          : "Unable to save assistant settings";
      if (error instanceof LiveWorkflowApiError && error.status === 409)
        this.updatedWorkflow();
    } finally {
      if (this.groupId === groupId) {
        this.saving = false;
        this.notifyPending();
      }
    }
  }
  override render() {
    if (!this.settings) return nothing;
    const value = this.value,
      disabled = !this.canEdit || this.saving;
    const unsupported = !this.efforts.includes(value.reasoningEffort);
    const pending =
      this.session?.active &&
      this.session.turnSettings &&
      !sameSettings(this.settings, this.session.turnSettings);
    return html`<button
        class="settings-trigger"
        type="button"
        aria-label="Assistant settings"
        aria-haspopup="dialog"
        aria-controls="assistant-settings-dialog"
        aria-expanded=${this.settingsOpen}
        title=${pending
          ? `Next turn: ${assistantSettingsLabel(this.settings)}. Running: ${assistantSettingsLabel(this.session!.turnSettings!)}`
          : assistantSettingsLabel(this.settings)}
        @click=${this.openSettings}
      >
        <span class="selection"
          >${this.settings.model} ·
          ${this.settings.reasoningEffort}${this.settings.serviceTier === "fast"
            ? " · Fast"
            : ""}</span
        >
        ${pending ? html`<span class="badge">Next turn</span>` : nothing}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
        >
          <path d="M4 7h16M4 17h16" />
          <circle
            cx="9"
            cy="7"
            r="3"
            fill="var(--md-sys-color-surface, #fff)"
          />
          <circle
            cx="15"
            cy="17"
            r="3"
            fill="var(--md-sys-color-surface, #fff)"
          />
        </svg>
        <span>Settings</span>
      </button>
      ${this.saved
        ? html`<span class="sr-only" role="status"
            >Saved for the next turn. Your conversation continues in the same
            session.</span
          >`
        : nothing}
      <dialog
        id="assistant-settings-dialog"
        aria-labelledby="assistant-settings-heading"
        @close=${this.closed}
        @cancel=${(event: Event) => {
          event.preventDefault();
          this.closeSettings();
        }}
      >
        <header>
          <h3 id="assistant-settings-heading">Assistant settings</h3>
          <button
            type="button"
            class="close"
            aria-label="Close assistant settings"
            ?disabled=${this.saving}
            @click=${this.closeSettings}
          >
            ×
          </button>
        </header>
        <form @submit=${this.save}>
          <label
            >Assistant model<input
              name="model"
              list="assistant-models"
              required
              maxlength="160"
              .value=${live(value.model)}
              ?disabled=${disabled}
              @input=${(e: Event) =>
                this.edit({ model: (e.target as HTMLInputElement).value })}
            /><datalist id="assistant-models">
              ${this.models.map(
                (m) =>
                  html`<option value=${m.model ?? m.id}>
                    ${m.displayName ?? m.id}
                  </option>`,
              )}
            </datalist></label
          >
          <div class="options">
            <label
              >Reasoning effort<select
                name="effort"
                .value=${live(value.reasoningEffort)}
                ?disabled=${disabled}
                @change=${(e: Event) =>
                  this.edit({
                    reasoningEffort: (e.target as HTMLSelectElement)
                      .value as YpWorkflowCodexReasoningEffort,
                  })}
              >
                ${unsupported
                  ? html`<option value=${value.reasoningEffort} disabled>
                      ${value.reasoningEffort} (not offered)
                    </option>`
                  : nothing}
                ${this.efforts.map(
                  (e) => html`<option value=${e}>${e}</option>`,
                )}
              </select></label
            >
            <label
              >Response speed<select
                name="speed"
                .value=${live(value.serviceTier)}
                ?disabled=${disabled}
                @change=${(e: Event) =>
                  this.edit({
                    serviceTier: (e.target as HTMLSelectElement)
                      .value as YpWorkflowAssistantSettings["serviceTier"],
                  })}
              >
                <option value="regular">Standard</option>
                <option value="fast">Fast</option>
              </select></label
            >
          </div>
          ${this.canEdit
            ? html`<div class="actions">
                <button
                  class="primary"
                  ?disabled=${this.saving ||
                  !this.dirty ||
                  this.stale ||
                  unsupported ||
                  !value.model.trim()}
                >
                  ${this.saving ? "Saving…" : "Apply to next turn"}
                </button>
                ${this.dirty
                  ? html`<button
                      type="button"
                      ?disabled=${this.saving}
                      @click=${this.stale ? this.reset : this.closeSettings}
                    >
                      ${this.stale ? "Reload settings" : "Cancel"}
                    </button>`
                  : nothing}
                <button
                  type="button"
                  ?disabled=${this.loading || this.saving || !this.connected}
                  @click=${this.discover}
                >
                  ${this.loading ? "Loading models…" : "Load models"}
                </button>
              </div>`
            : nothing}
        </form>
        <p class="hint">
          Higher reasoning uses more time and tokens. Fast requests priority
          service where available and can cost more.
        </p>
        ${this.session?.active
          ? html`<p class="running" role="status">
              Running${this.session.turnSettings
                ? `: ${assistantSettingsLabel(this.session.turnSettings)}`
                : " with its original settings"}.
              Changes apply to your next turn. Steering keeps the current
              settings.
            </p>`
          : nothing}
        ${this.dirty && !this.stale
          ? html`<p class="hint">
              Apply or cancel these changes before sending a message.
            </p>`
          : nothing}
        ${this.stale
          ? html`<p class="error" role="alert">
              Assistant settings changed elsewhere. Reload settings before
              editing again.
            </p>`
          : nothing}
        ${unsupported
          ? html`<p class="error" role="alert">
              Choose a reasoning effort offered by this model.
            </p>`
          : nothing}
        ${this.error
          ? html`<p class="error" role="alert">${this.error}</p>`
          : nothing}
        ${!this.canEdit
          ? html`<p class="hint">
              The current operator can change assistant settings.
            </p>`
          : nothing}
      </dialog>`;
  }
}
