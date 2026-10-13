// Adapted from policySynth/ps-operations-view.ts: Lit lifecycle and JointJS rendering.
import { LitElement, html, css, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { dia, shapes } from "@joint/core";
import { dollars } from "./api.js";

@customElement("yp-live-workflow-graph")
export class YpLiveWorkflowGraph extends LitElement {
  @property({ attribute: false }) graph!: YpWorkflowGraph;
  @property({ attribute: false }) run?: YpWorkflowRun;
  @property({ attribute: false }) selectedNode?: string;
  @property({ type: Boolean }) readonly = false;
  @state() private zoom = 0.85;
  private contentWidth = 1200;
  private contentHeight = 700;
  private diagram?: dia.Graph;
  private paper?: dia.Paper;
  private observer?: ResizeObserver;
  static override styles = css`
    :host {
      display: block;
      min-height: 380px;
      min-width: 0;
    }
    .canvas {
      height: 480px;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      overflow: auto;
      border: 1px solid var(--md-sys-color-outline-variant, #ddd);
      border-radius: 16px;
      background: linear-gradient(
        155deg,
        var(--md-sys-color-surface, #fcfbff),
        var(--md-sys-color-surface-container, #f3f1f8)
      );
      scrollbar-width: thin;
      scrollbar-color: #c5bcd8 transparent;
    }
    .tools {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }
    .tools strong {
      font-size: 13px;
      margin-right: auto;
    }
    .tools .legend {
      width: 100%;
      margin: 0 0 6px;
      font-size: 11px;
    }
    .zoom-value {
      font-size: 12px;
      font-variant-numeric: tabular-nums;
      min-width: 38px;
      text-align: center;
    }
    .node-body {
      filter: drop-shadow(0 3px 6px #39284e12);
    }
    .joint-element:hover .node-body {
      stroke: #8b78bc;
      stroke-width: 2;
    }
    .joint-element:focus-visible .node-body {
      stroke: #705299;
      stroke-width: 3;
    }
    .flowing {
      animation: flow 1.5s linear infinite;
    }
    @keyframes flow {
      to {
        stroke-dashoffset: -20;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .flowing {
        animation: none;
      }
    }
    .network-legend {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      font-size: 11px;
      margin-top: 10px;
      color: var(--md-sys-color-on-surface-variant, #716b80);
    }
    .network-legend span {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .network-legend i {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }
    button {
      border: 1px solid var(--md-sys-color-outline-variant, #ded7e9);
      background: var(--md-sys-color-surface, #fff);
      color: inherit;
      border-radius: 9px;
      padding: 7px 12px;
      cursor: pointer;
      font: inherit;
      font-size: 12px;
    }
    .legend {
      font-size: 12px;
      opacity: 0.8;
      margin-left: auto;
    }
    .activity {
      border: 1px solid var(--md-sys-color-outline-variant, #ddd);
      border-radius: 14px;
      padding: 14px;
      margin-bottom: 12px;
      overflow-wrap: anywhere;
      background: linear-gradient(
        115deg,
        color-mix(
          in srgb,
          var(--md-sys-color-primary, #7663a8) 6%,
          var(--md-sys-color-surface, #fff)
        ),
        var(--md-sys-color-surface, #fff)
      );
      box-shadow: inset 3px 0 0 var(--md-sys-color-primary, #8470b6);
    }
    .activity header,
    .latest-heading {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }
    h3,
    p {
      margin: 0;
    }
    h3 {
      font-size: 14px;
    }
    .hint,
    time,
    .counts {
      font-size: 12px;
      opacity: 0.8;
    }
    .hint {
      margin: 8px 0;
    }
    .latest-item {
      margin: 12px 0;
    }
    .latest-item p {
      margin: 6px 0;
      white-space: pre-wrap;
    }
    .agent-name {
      padding: 0;
      border: none;
      text-align: left;
      text-decoration: none;
      font-weight: 600;
      color: var(--md-sys-color-primary, #655194);
    }
    .status {
      display: inline-block;
      font-size: 12px;
      border-radius: 20px;
      padding: 3px 9px;
      background: #eeeaf4;
      color: #393344;
    }
    .status[data-status="running"] {
      background: #eee8fb;
      color: #66508f;
    }
    .status[data-status="completed"] {
      background: #e7f4e7;
      color: #285930;
    }
    .status[data-status="paused"],
    .status[data-status="failed"] {
      background: #fff0db;
      color: #704600;
    }
    summary {
      cursor: pointer;
      font-size: 13px;
    }
    ol {
      max-height: 240px;
      overflow: auto;
      padding-left: 24px;
    }
    li {
      margin: 12px 0;
    }
    li p {
      margin-top: 4px;
      white-space: pre-wrap;
    }
    button:focus-visible,
    summary:focus-visible {
      outline: 2px solid #1673b8;
      outline-offset: 3px;
    }
  `;
  override render() {
    return html`<div class="tools">
        <strong>Agent network</strong>
        <button aria-label="Zoom out" @click=${() => this.scale(-0.1)}>−</button
        ><button aria-label="Zoom in" @click=${() => this.scale(0.1)}>+</button
        ><span class="zoom-value">${Math.round(this.zoom * 100)}%</span
        ><button @click=${this.fit}>Fit</button
        ><span class="legend"
          >${this.run ? `Run revision ${this.run.revision}` : "Draft graph"} ·
          select an agent to ${this.run ? "inspect" : "configure"}</span
        >
      </div>
      ${this.renderActivity()}
      <div
        class="canvas"
        role="group"
        aria-label="Live workflow agents and data connections"
        @click=${this.select}
        @keydown=${this.select}
      >
        <div class="paper"></div>
      </div>
      <div class="network-legend" aria-label="Graph status legend">
        <span><i style="background:#7762ad"></i>Running</span>
        <span><i style="background:#458775"></i>Completed</span>
        <span><i style="background:#bd883c"></i>Paused</span>
        <span><i style="background:#b7b0c5"></i>Waiting</span>
      </div>`;
  }
  private statusLabel(status: string) {
    const text = status.replace(/_/g, " ");
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  private nodeStatus(node: YpWorkflowNode): string {
    if (!node.enabled) return "disabled";
    if (!this.run || node.kind !== "agent") return node.kind;
    if (!this.run.nodeIds.includes(node.id)) return "outside this run";
    const state = this.run.nodeStates[node.id];
    if (state?.status === "completed") return "completed";
    if (["paused", "failed", "cancelled"].includes(this.run.status))
      return this.run.status;
    if (this.run.status === "completed") return "not completed";
    return state?.status ?? "waiting";
  }
  private chooseNode(id?: string, configure = false) {
    this.dispatchEvent(
      new CustomEvent("select-node", {
        detail: { id, configure },
        bubbles: true,
        composed: true,
      }),
    );
  }
  private timestamp(at?: string) {
    if (!at) return nothing;
    const date = new Date(at);
    return html`<time datetime=${at} title=${date.toLocaleString()}
      >Updated ${date.toLocaleTimeString()}</time
    >`;
  }
  private renderActivity() {
    const run = this.run;
    if (!run)
      return html`<p class="hint">
        Agent status messages appear here when you start a run or select a saved
        run.
      </p>`;
    const selected = this.graph.nodes.find(
      (n) => n.kind === "agent" && n.id === this.selectedNode,
    );
    const agents = this.graph.nodes.filter((n) => run.nodeIds.includes(n.id));
    const running = agents.filter(
      (n) => run.nodeStates[n.id]?.status === "running",
    );
    const latest = [...agents]
      .filter((n) => run.nodeStates[n.id])
      .sort((a, b) =>
        (run.nodeStates[b.id].updatedAt ?? "").localeCompare(
          run.nodeStates[a.id].updatedAt ?? "",
        ),
      )
      .slice(0, 1);
    const shown = selected ? [selected] : running.length ? running : latest;
    const messages = (run.agentMessages ?? [])
      .filter((m) => !selected || m.nodeId === selected.id)
      .slice()
      .reverse();
    return html`<section class="activity" aria-label="Agent activity">
      <header>
        <h3>Agent activity</h3>
        <span class="status" data-status=${run.status}
          >${this.statusLabel(run.status)}</span
        >
        ${selected
          ? html`<button @click=${() => this.chooseNode()}>
              Show all agents
            </button>`
          : nothing}
      </header>
      <p class="hint">
        ${run.status === "running"
          ? "Updates live as agents report progress. Long model calls may take several minutes between messages."
          : run.status === "paused"
            ? "Processing is paused. Last reported messages are shown below."
            : run.status === "completed"
              ? "Run completed. Saved agent messages are shown below."
              : run.status === "cancelled" || run.status === "failed"
                ? "Processing has stopped. Last reported messages are shown below."
                : "Waiting for processing to start."}
      </p>
      <div class="latest" role="status" aria-live="polite">
        ${shown.map((node) => {
          const state = run.nodeStates[node.id];
          const message =
            state?.message ??
            (state
              ? "No detailed message reported by this agent."
              : "No messages reported for this agent yet.");
          return html`<div class="latest-item">
            <div class="latest-heading">
              <button
                class="agent-name"
                @click=${() => this.chooseNode(node.id)}
              >
                ${node.label}
              </button>
              <span class="status" data-status=${this.nodeStatus(node)}
                >${this.statusLabel(this.nodeStatus(node))}</span
              >
              ${state
                ? html`<span class="counts"
                    >${state.processed}/${state.total} records
                    processed${state.failedRecords
                      ? ` · ${state.failedRecords} need review`
                      : ""}</span
                  >`
                : nothing}
            </div>
            <p>${message}</p>
            ${this.timestamp(state?.updatedAt)}
          </div>`;
        })}
        ${!shown.length ? html`<p>No agent messages yet.</p>` : nothing}
      </div>
      <details>
        <summary>
          Recent messages${selected ? ` · ${selected.label}` : " · all agents"}
          (${messages.length})
        </summary>
        <p class="hint">
          The latest 50 messages for this run are kept. Select an agent to
          filter them.
        </p>
        <ol>
          ${messages.map(
            (message) =>
              html`<li>
                <button
                  class="agent-name"
                  @click=${() => this.chooseNode(message.nodeId)}
                >
                  ${this.graph.nodes.find((n) => n.id === message.nodeId)
                    ?.label ?? message.nodeId}
                </button>
                · ${this.timestamp(message.at)}
                <p>${message.message}</p>
              </li>`,
          )}
        </ol>
      </details>
    </section>`;
  }
  private select(event: MouseEvent | KeyboardEvent) {
    if (event instanceof KeyboardEvent && !["Enter", " "].includes(event.key))
      return;
    const element = event
      .composedPath()
      .find(
        (target) =>
          target instanceof Element && target.hasAttribute("model-id"),
      ) as Element | undefined;
    const id = element?.getAttribute("model-id"),
      cell = id ? this.diagram?.getCell(id) : undefined;
    if (!cell?.isElement()) return;
    event.preventDefault();
    this.chooseNode(cell.get("agentId") ?? String(cell.id), true);
  }
  override firstUpdated() {
    if (this.paper) return;
    let canvas = this.renderRoot.querySelector(".paper") as HTMLElement | null;
    if (!canvas) {
      canvas = document.createElement("div");
      canvas.className = "paper";
      this.renderRoot.querySelector(".canvas")!.appendChild(canvas);
    }
    this.diagram = new dia.Graph({}, { cellNamespace: shapes });
    this.paper = new dia.Paper({
      el: canvas,
      model: this.diagram,
      width: 1200,
      height: 700,
      gridSize: 10,
      drawGrid: true,
      cellViewNamespace: shapes,
      interactive: false,
      background: { color: "transparent" },
    });
    this.observer = new ResizeObserver(() => this.applyScale());
    this.observer.observe(this);
    this.draw();
  }
  override updated(changed: PropertyValues) {
    if (this.hasUpdated && !this.paper) this.firstUpdated();
    if (
      changed.has("graph") ||
      changed.has("run") ||
      changed.has("selectedNode")
    )
      this.draw();
  }
  override connectedCallback() {
    super.connectedCallback();
    if (this.hasUpdated)
      void this.updateComplete.then(() => {
        if (this.isConnected && !this.paper) this.firstUpdated();
      });
  }
  override disconnectedCallback() {
    super.disconnectedCallback();
    this.observer?.disconnect();
    this.paper?.remove();
    this.paper = undefined;
  }
  private scale(delta: number) {
    this.zoom = Math.max(0.3, Math.min(1.5, this.zoom + delta));
    this.applyScale();
  }
  private fit() {
    const canvas = this.renderRoot.querySelector(".canvas");
    if (!canvas) return;
    this.zoom = Math.max(
      0.3,
      Math.min(
        1,
        (canvas.clientWidth - 16) / this.contentWidth,
        (canvas.clientHeight - 16) / this.contentHeight,
      ),
    );
    this.applyScale();
    canvas.scrollTo(0, 0);
  }
  private applyScale() {
    this.paper?.scale(this.zoom);
    this.paper?.setDimensions(
      this.contentWidth * this.zoom,
      this.contentHeight * this.zoom,
    );
  }
  private draw() {
    if (!this.diagram || !this.graph) return;
    const focused = this.shadowRoot?.activeElement
      ?.closest("[model-id]")
      ?.getAttribute("model-id");
    const cells: dia.Cell[] = [];
    for (const node of this.graph.nodes) {
      const status = this.run?.nodeStates[node.id];
      const running = this.nodeStatus(node) === "running",
        complete = status?.status === "completed";
      const cost = this.run?.nodeCosts?.[node.id];
      const isAgent = node.kind === "agent";
      const state = this.nodeStatus(node);
      const selected = this.selectedNode === node.id;
      const accent =
        status?.failedRecords || state === "paused" || state === "failed"
          ? "#ad792d"
          : running
            ? "#7762ad"
            : complete
              ? "#458775"
              : "#9890a9";
      const tint =
        status?.failedRecords || state === "paused" || state === "failed"
          ? "#fff4df"
          : running
            ? "#f1ecfb"
            : complete
              ? "#edf6f2"
              : "#f5f3f8";
      const width = isAgent ? 220 : 190;
      const progress = status?.total
        ? Math.max(0, Math.min(1, status.processed / status.total))
        : complete
          ? 1
          : 0;
      const element = new shapes.standard.Rectangle({
        id: node.id,
        position: node.position,
        size: { width, height: isAgent ? 168 : 82 },
        markup: [
          { tagName: "rect", selector: "body" },
          { tagName: "rect", selector: "iconBackground" },
          { tagName: "path", selector: "icon" },
          { tagName: "text", selector: "label" },
          { tagName: "circle", selector: "statusDot" },
          { tagName: "text", selector: "statusText" },
          { tagName: "text", selector: "counts" },
          { tagName: "rect", selector: "progressTrack" },
          { tagName: "rect", selector: "progressBar" },
          { tagName: "text", selector: "message" },
          { tagName: "text", selector: "model" },
          { tagName: "text", selector: "footer" },
        ],
        attrs: {
          root: {
            tabindex: 0,
            role: "button",
            "aria-label": node.label,
            "aria-description": `${this.statusLabel(this.nodeStatus(node))}${status?.message ? `: ${status.message}` : ""}`,
            "aria-pressed": selected ? "true" : "false",
            "aria-haspopup": isAgent ? "dialog" : undefined,
            cursor: "pointer",
            opacity: node.enabled ? 1 : 0.6,
          },
          body: {
            class: "node-body",
            fill: "var(--md-sys-color-surface, #fff)",
            stroke: selected ? "#7762ad" : running ? "#b8a9d9" : "#dcd6e6",
            strokeWidth: selected ? 2.5 : 1.2,
            rx: 14,
            ry: 14,
          },
          iconBackground: {
            x: 14,
            y: 14,
            width: 28,
            height: 28,
            rx: 9,
            fill: tint,
          },
          icon: {
            d: isAgent
              ? "M22 25l-4 3 4 3m12-6 4 3-4 3m-5-10-2 14"
              : "M25 25l-2 2a3 3 0 004 4l2-2m-2-4 2-2a3 3 0 014 4l-2 2m-6 0 6-6",
            fill: "none",
            stroke: accent,
            strokeWidth: 1.6,
            strokeLinecap: "round",
            strokeLinejoin: "round",
          },
          label: {
            text: node.label,
            x: 51,
            y: 15,
            textAnchor: "start",
            textVerticalAnchor: "top",
            fill: "var(--md-sys-color-on-surface, #322b42)",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "system-ui",
            textWrap: { width: width - 63, height: 35, ellipsis: true },
          },
          statusDot: { cx: 19, cy: 62, r: 3, fill: accent },
          statusText: {
            x: 28,
            y: 66,
            text: isAgent
              ? this.statusLabel(state)
              : node.enabled
                ? "Data connection"
                : "Disabled",
            fontSize: 11,
            fontFamily: "system-ui",
            fill: accent,
          },
          counts: {
            x: width - 16,
            y: 66,
            textAnchor: "end",
            text: status ? `${status.processed}/${status.total}` : "",
            fontSize: 10,
            fontFamily: "system-ui",
            fill: "#837990",
          },
          progressTrack: {
            x: 16,
            y: 78,
            width: width - 32,
            height: 4,
            rx: 2,
            fill: tint,
            display: isAgent ? "block" : "none",
          },
          progressBar: {
            x: 16,
            y: 78,
            width: (width - 32) * progress,
            height: 4,
            rx: 2,
            fill: accent,
            display: isAgent && progress > 0 ? "block" : "none",
          },
          message: {
            x: 16,
            y: 94,
            textAnchor: "start",
            textVerticalAnchor: "top",
            text: isAgent
              ? (status?.message ??
                (status
                  ? `${status.processed}/${status.total} records processed`
                  : state === "waiting"
                    ? "Waiting for upstream agents"
                    : state === "outside this run"
                      ? "Not included in this run"
                      : node.enabled
                        ? "Ready for the next run"
                        : "Disabled for this workflow"))
              : "",
            fontSize: 11,
            fontFamily: "system-ui",
            fill: "var(--md-sys-color-on-surface-variant, #746b82)",
            textWrap: { width: width - 32, height: 28, ellipsis: true },
          },
          model: {
            x: 16,
            y: 135,
            text: isAgent
              ? `Model: ${node.models.default ?? "Not selected"}`
              : "",
            fontSize: 10,
            fontFamily: "system-ui",
            fill: accent,
            textWrap: { width: width - 32, height: 14, ellipsis: true },
          },
          footer: {
            x: 16,
            y: 154,
            text: isAgent
              ? status?.failedRecords
                ? `${status.failedRecords} records need review`
                : `${cost ? `${dollars(cost.spentMicros)} spent` : "Models & settings ↗"}${status?.outputCount !== undefined && status.outputCount !== status.total ? ` · ${status.outputCount} outputs` : ""}`
              : "",
            fontSize: 10,
            fontFamily: "system-ui",
            fill: accent,
            textWrap: { width: width - 32, height: 14, ellipsis: true },
          },
        },
      });
      cells.push(element);
    }
    for (const edge of this.graph.edges) {
      const flow = this.run?.edgeStates?.[edge.id];
      const active =
        Boolean(flow) &&
        this.run?.status === "running" &&
        this.run?.nodeStates[edge.target]?.status === "running";
      const link = new shapes.standard.Link({
        id: edge.id,
        source: { id: edge.source },
        target: { id: edge.target },
        attrs: {
          line: {
            class: active ? "flowing" : "",
            stroke: active ? "#9279c4" : "#c8c0d5",
            strokeWidth: active ? 2.5 : 1.5,
            strokeDasharray: active ? "6 4" : "none",
            targetMarker: { type: "path", d: "M 8 -4 0 0 8 4 z" },
          },
        },
      });
      if (flow)
        link.labels([
          {
            attrs: {
              text: {
                text: `${flow.records} records`,
                fontSize: 10,
                fontFamily: "system-ui",
                fill: "#756985",
              },
              rect: {
                fill: "var(--md-sys-color-surface, #fff)",
                stroke: "#e2dbe9",
                rx: 5,
                ry: 5,
              },
            },
          },
        ]);
      // Keep paths clear of the wider cards, including closely spaced connectors.
      link.router("manhattan", { padding: 8, maximumLoops: 5000 });
      link.connector("rounded");
      cells.unshift(link);
    }
    for (const [index, child] of Object.values(
      this.run?.childStates ?? {},
    ).entries()) {
      const parent = this.graph.nodes.find((n) => n.id === child.nodeId);
      if (!parent) continue;
      const id = `child:${child.nodeId}:${child.label}`;
      cells.push(
        new shapes.standard.Rectangle({
          id,
          agentId: parent.id,
          position: {
            x: 40 + (index % 4) * 250,
            y:
              Math.max(...this.graph.nodes.map((n) => n.position.y)) +
              190 +
              Math.floor(index / 4) * 60,
          },
          size: { width: 210, height: 44 },
          attrs: {
            body: {
              fill:
                child.processed >= child.total
                  ? "#edf6f2"
                  : this.run?.status === "running"
                    ? "#f1ecfb"
                    : "#eeeaf4",
              stroke: "#dcd6e6",
              rx: 12,
              ry: 12,
            },
            label: {
              text: `${child.label} · ${child.processed}/${child.total}`,
              fontSize: 11,
              fontFamily: "system-ui",
              fill: "#746b82",
              textWrap: { width: 200, height: 40 },
            },
          },
        }),
      );
      cells.unshift(
        new shapes.standard.Link({
          source: { id: parent.id },
          target: { id },
          router: {
            name: "manhattan",
            args: { padding: 8, maximumLoops: 5000 },
          },
          connector: { name: "rounded" },
          attrs: {
            line: {
              stroke: "#b2adbd",
              strokeWidth: 1,
              strokeDasharray: "3 3",
              targetMarker: { type: "path", d: "M 6 -3 0 0 6 3 z" },
            },
          },
        }),
      );
    }
    this.diagram.resetCells(cells);
    const boxes = this.diagram
      .getElements()
      .map((element) => element.getBBox());
    this.contentWidth = Math.max(
      600,
      ...boxes.map((box) => box.x + box.width + 40),
    );
    this.contentHeight = Math.max(
      350,
      ...boxes.map((box) => box.y + box.height + 40),
    );
    this.applyScale();
    if (focused)
      this.renderRoot
        .querySelector<SVGElement>(`[model-id="${CSS.escape(focused)}"]`)
        ?.focus();
  }
}
