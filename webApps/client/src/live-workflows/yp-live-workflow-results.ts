import { LitElement, html, css, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LiveWorkflowApi, dollars } from "./api.js";

@customElement("yp-live-workflow-results")
export class YpLiveWorkflowResults extends LitElement {
  @property({ type: Number }) groupId!: number;
  @property({ attribute: false }) runs: YpWorkflowRun[] = [];
  @property({ type: Number }) revision = 0;
  @property({ attribute: false }) runId = "";
  @state() private compare = "";
  @state() private search = "";
  @state() private filter = "all";
  @state() private offset = 0;
  @state() private page?: YpWorkflowResultPage;
  @state() private error = "";
  @state() private busy = false;
  private generation = 0;
  static override styles = css`
    :host {
      display: block;
    }
    .controls {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: end;
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    select,
    input,
    button {
      font: inherit;
      padding: 8px;
    }
    article {
      border: 1px solid #8886;
      border-radius: 8px;
      padding: 12px;
      margin: 12px 0;
    }
    .compare {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
    }
    pre {
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      max-height: 420px;
      overflow: auto;
    }
    .muted {
      opacity: 0.75;
    }
    [role="alert"] {
      color: #b3261e;
    }
    h4 {
      margin: 4px 0 12px;
    }
  `;
  protected override updated(changed: PropertyValues) {
    if (changed.has("groupId")) {
      this.generation++;
      if (changed.get("groupId") !== undefined) this.runId = "";
      this.compare = "";
      this.page = undefined;
      this.offset = 0;
    }
    if (!this.runId && this.runs.length)
      this.runId =
        this.runs.find((r) => r.status === "completed")?.id ?? this.runs[0].id;
    if (changed.has("runId") && this.runId) {
      this.page = undefined;
      if (this.compare === this.runId) this.compare = "";
      this.offset = 0;
      this.dispatchEvent(
        new CustomEvent("workflow-run-selected", {
          detail: this.runId,
          bubbles: true,
          composed: true,
        }),
      );
    }
    if (
      changed.has("groupId") ||
      changed.has("revision") ||
      changed.has("runId") ||
      changed.has("compare")
    )
      void this.load();
  }
  override disconnectedCallback() {
    super.disconnectedCallback();
    this.generation++;
  }
  private async load() {
    if (!this.runId) return;
    const generation = ++this.generation;
    this.busy = true;
    this.error = "";
    try {
      const query = new URLSearchParams({
        offset: String(this.offset),
        limit: "20",
        search: this.search,
        filter: this.filter,
      });
      if (this.compare) query.set("compare", this.compare);
      const page = await new LiveWorkflowApi(
        this.groupId,
      ).request<YpWorkflowResultPage>(`/runs/${this.runId}/results?${query}`);
      if (generation === this.generation) this.page = page;
    } catch (error) {
      if (generation === this.generation) {
        this.page = undefined;
        this.error = error instanceof Error ? error.message : String(error);
      }
    } finally {
      if (generation === this.generation) this.busy = false;
    }
  }
  private runSummary(id: string) {
    const run = this.runs.find((r) => r.id === id);
    if (!run) return nothing;
    const models = [
      ...new Set(
        run.graph.nodes
          .filter((n) => run.nodeIds.includes(n.id))
          .flatMap((n) => Object.values(n.models)),
      ),
    ];
    return html`<p>
      ${run.mode} · ${run.inputCount} sampled/input parents ·
      ${dollars(run.spentMicros)} settled · ${dollars(run.reservedMicros)}
      reserved<br />Models: ${models.join(", ") || "none"}<br /><span
        class="muted"
        >Source ${run.sourceHash.slice(0, 12)} · ${run.status}</span
      >
    </p>`;
  }
  private record(row: Record<string, YpWorkflowJson>) {
    return html`<h4>${String(row.name ?? row.id ?? "Result")}</h4>
      <p>
        ${String(row.status ?? "")}${row.parentId
          ? html` · Parent: ${String(row.parentName ?? row.parentId)} · Level:
            ${String(
              (row.level as Record<string, YpWorkflowJson> | undefined)?.name ??
                "",
            )}`
          : nothing}
      </p>
      ${row.rewrittenText
        ? html`<p><strong>Proposed rewrite</strong></p>
            <pre>${String(row.rewrittenText)}</pre>`
        : nothing}
      ${row.errors && Array.isArray(row.errors) && row.errors.length
        ? html`<p role="alert">${row.errors.join("; ")}</p>`
        : nothing}
      <details>
        <summary>Original, evidence and full record</summary>
        <pre>${JSON.stringify(row, null, 2)}</pre>
      </details>`;
  }
  override render() {
    return html`<h3>Review results</h3>
      <form
        class="controls"
        @submit=${(e: Event) => {
          e.preventDefault();
          this.offset = 0;
          void this.load();
        }}
      >
        <label
          >Result run<select
            .value=${this.runId}
            @change=${(e: Event) => {
              this.runId = (e.target as HTMLSelectElement).value;
              this.offset = 0;
            }}
          >
            ${this.runs.map(
              (r) =>
                html`<option value=${r.id} ?selected=${r.id === this.runId}>
                  ${r.mode} · ${r.status} · ${r.createdAt.slice(0, 16)} ·
                  ${r.id.slice(0, 8)}
                </option>`,
            )}
          </select></label
        >
        <label
          >Compare with<select
            .value=${this.compare}
            @change=${(e: Event) => {
              this.compare = (e.target as HTMLSelectElement).value;
            }}
          >
            <option value="" ?selected=${!this.compare}>No comparison</option>
            ${this.runs
              .filter((r) => r.id !== this.runId)
              .map(
                (r) =>
                  html`<option value=${r.id} ?selected=${r.id === this.compare}>
                    ${r.mode} · ${r.createdAt.slice(0, 16)} ·
                    ${r.id.slice(0, 8)}
                  </option>`,
              )}
          </select></label
        >
        <label
          >Search results<input
            .value=${this.search}
            maxlength="200"
            @input=${(e: Event) =>
              (this.search = (e.target as HTMLInputElement).value)}
        /></label>
        <label
          >Show<select
            .value=${this.filter}
            @change=${(e: Event) => {
              this.filter = (e.target as HTMLSelectElement).value;
              this.offset = 0;
              void this.load();
            }}
          >
            ${["all", "failed", "unknown", "children", "parents"].map(
              (f) => html`<option value=${f}>${f}</option>`,
            )}
          </select></label
        >
        <button ?disabled=${this.busy}>Search</button>
      </form>
      <div class="compare">
        <div>${this.runSummary(this.runId)}</div>
        ${this.compare
          ? html`<div>${this.runSummary(this.compare)}</div>`
          : nothing}
      </div>
      ${this.compare
        ? html`<p class="muted">
            Records match by stable ID. Changed inputs or level identities may
            have no match. Reverse the selected runs to inspect records unique
            to the comparison.
          </p>`
        : nothing}
      ${this.error ? html`<p role="alert">${this.error}</p>` : nothing}
      ${this.busy ? html`<p role="status">Loading results…</p>` : nothing}
      ${this.page
        ? html`<p role="status">
              ${this.page.available
                ? `${this.page.total} matching results`
                : "No review results yet. Older runs still have downloadable artifacts in Data."}
            </p>
            ${this.page.rows.map(
              (row) =>
                html`<article class="compare">
                  <div>${this.record(row.value)}</div>
                  ${this.compare
                    ? html`<div>
                        ${row.comparison
                          ? this.record(row.comparison)
                          : html`<p>No matching record in comparison run.</p>`}
                      </div>`
                    : nothing}
                </article>`,
            )}
            <div class="controls">
              <button
                ?disabled=${this.busy || !this.offset}
                @click=${() => {
                  this.offset = Math.max(0, this.offset - 20);
                  void this.load();
                }}
              >
                Previous results</button
              ><span
                >${this.page.total ? this.offset + 1 : 0}–${Math.min(
                  this.offset + 20,
                  this.page.total,
                )}
                of ${this.page.total}</span
              ><button
                ?disabled=${this.busy || this.offset + 20 >= this.page.total}
                @click=${() => {
                  this.offset += 20;
                  void this.load();
                }}
              >
                Next results
              </button>
            </div>`
        : nothing}`;
  }
}
