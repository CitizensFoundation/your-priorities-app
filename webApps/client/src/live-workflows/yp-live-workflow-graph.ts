// Adapted from policySynth/ps-operations-view.ts: Lit lifecycle and JointJS rendering.
import { LitElement, html, css, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { dia, shapes } from "@joint/core";
import { dollars } from "./api.js";

@customElement("yp-live-workflow-graph")
export class YpLiveWorkflowGraph extends LitElement {
  @property({ attribute: false }) graph!: YpWorkflowGraph;
  @property({ attribute: false }) run?: YpWorkflowRun;
  @property({ type: Boolean }) readonly = false;
  @state() private zoom = 0.75;
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
      height: 440px;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      overflow: auto;
      border: 1px solid var(--md-sys-color-outline-variant, #ddd);
      border-radius: 12px;
      background: var(--md-sys-color-surface, #fff);
    }
    .tools {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 8px;
    }
    button {
      border: 1px solid #bbb;
      background: transparent;
      color: inherit;
      border-radius: 8px;
      padding: 7px 12px;
      cursor: pointer;
    }
    .legend {
      font-size: 12px;
      opacity: 0.8;
      margin-left: auto;
    }
  `;
  override render() {
    return html`<div class="tools">
        <button aria-label="Zoom out" @click=${() => this.scale(-0.1)}>
          −</button
        ><button aria-label="Zoom in" @click=${() => this.scale(0.1)}>
          +</button
        ><span>${Math.round(this.zoom * 100)}%</span
        ><span class="legend"
          >${this.run
            ? `Run revision ${this.run.revision}`
            : "Draft graph"}
          · select an agent to ${this.run ? "inspect" : "configure"}</span
        >
      </div>
      <div
        class="canvas"
        role="group"
        aria-label="Live workflow agents and data connections"
        @click=${this.select}
        @keydown=${this.select}
      >
        <div class="paper"></div>
      </div>`;
  }
  private select(event: MouseEvent | KeyboardEvent) {
    if (
      event instanceof KeyboardEvent &&
      !["Enter", " "].includes(event.key)
    )
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
    this.dispatchEvent(
      new CustomEvent("select-node", {
        detail: { id: cell.get("agentId") ?? cell.id },
        bubbles: true,
        composed: true,
      }),
    );
  }
  override firstUpdated() {
    if (this.paper) return;
    let canvas = this.renderRoot.querySelector(
      ".paper",
    ) as HTMLElement | null;
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
    this.observer = new ResizeObserver(() => this.paper?.scale(this.zoom));
    this.observer.observe(this);
    this.draw();
  }
  override updated(changed: PropertyValues) {
    if (this.hasUpdated && !this.paper) this.firstUpdated();
    if (changed.has("graph") || changed.has("run")) this.draw();
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
    this.paper?.scale(this.zoom);
  }
  private draw() {
    if (!this.diagram || !this.graph) return;
    const cells: dia.Cell[] = [];
    for (const node of this.graph.nodes) {
      const status = this.run?.nodeStates[node.id];
      const running = status?.status === "running",
        complete = status?.status === "completed";
      const cost = this.run?.nodeCosts?.[node.id];
      const fill = status?.failedRecords
        ? "#fff0db"
        : running
          ? "#e4f4ff"
          : complete
            ? "#e7f4e7"
            : node.kind === "connector"
              ? "#fff3d9"
              : "#f3f0fa";
      const element = new shapes.standard.Rectangle({
        id: node.id,
        position: node.position,
        size: { width: 210, height: 90 },
        attrs: {
          root: {
            tabindex: 0,
            role: "button",
            "aria-label": node.label,
            cursor: "pointer",
          },
          body: {
            fill,
            stroke: running ? "#1673b8" : complete ? "#3b7a45" : "#807a90",
            strokeWidth: running ? 3 : 1,
            rx: 12,
            ry: 12,
            opacity: node.enabled ? 1 : 0.5,
          },
          label: {
            text: `${node.label}\n${status ? `${status.status} · ${status.processed}/${status.total}` : node.enabled ? node.kind : "disabled"}${cost ? `\n${dollars(cost.spentMicros)} spent` : ""}${status?.outputCount !== undefined && status.outputCount !== status.total ? ` · ${status.outputCount} outputs` : ""}${status?.failedRecords ? ` · ${status.failedRecords} need review` : ""}`,
            fill: "#25232b",
            fontSize: 13,
            fontFamily: "system-ui",
            textWrap: { width: 190, height: 72 },
          },
        },
      });
      cells.push(element);
    }
    for (const edge of this.graph.edges) {
      const flow = this.run?.edgeStates?.[edge.id];
      const active =
        Boolean(flow) &&
        this.run?.nodeStates[edge.target]?.status === "running";
      const link = new shapes.standard.Link({
        id: edge.id,
        source: { id: edge.source },
        target: { id: edge.target },
        attrs: {
          line: {
            stroke: active ? "#1673b8" : "#b2adbd",
            strokeWidth: active ? 3 : 1.5,
            strokeDasharray: active ? "6 4" : "none",
            targetMarker: { type: "path", d: "M 8 -4 0 0 8 4 z" },
          },
        },
      });
      if (flow)
        link.labels([
          {
            attrs: {
              text: { text: `${flow.records} records`, fontSize: 11 },
            },
          },
        ]);
      link.router("manhattan", { padding: 20 });
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
              150 +
              Math.floor(index / 4) * 60,
          },
          size: { width: 210, height: 44 },
          attrs: {
            body: {
              fill: child.processed >= child.total ? "#e7f4e7" : "#e4f4ff",
              stroke: "#807a90",
              rx: 8,
              ry: 8,
            },
            label: {
              text: `${child.label} · ${child.processed}/${child.total}`,
              fontSize: 11,
              textWrap: { width: 200, height: 40 },
            },
          },
        }),
      );
      cells.unshift(
        new shapes.standard.Link({
          source: { id: parent.id },
          target: { id },
          attrs: { line: { stroke: "#b2adbd", strokeDasharray: "3 3" } },
        }),
      );
    }
    this.diagram.resetCells(cells);
    this.paper?.scale(this.zoom);
  }
}
