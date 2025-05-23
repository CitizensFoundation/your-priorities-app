import { PropertyValueMap, css, html, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";
import { dia, shapes, util, highlighters, V, layout } from "@joint/core";

import "@material/web/iconbutton/filled-icon-button.js";
import "@material/web/iconbutton/filled-tonal-icon-button.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/iconbutton/outlined-icon-button.js";

import "./ps-agent-node.js";
import "./ps-connector-node.js";

import { PsServerApi } from "./PsServerApi.js";
import { AgentShape, AgentsShapeView } from "./ps-agent-shape.js";
import { ConnectorShape } from "./ps-connector-shape.js";
import { PsBaseWithRunningAgentObserver } from "./ps-base-with-running-agents.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
import { YpMediaHelpers } from "../common/YpMediaHelpers.js";

type Cell = dia.Element | dia.Link;

@customElement("ps-operations-view")
export class PsOperationsView extends PsBaseWithRunningAgentObserver {
  @property({ type: Object })
  currentAgent!: PsAgentAttributes;

  @property({ type: Number })
  groupId!: number;

  @property({ type: Boolean })
  minimizeWorkflow = false;

  @property({ type: Object })
  group!: YpGroupData;

  @property({ type: Object })
  connectorRegistry: { [key: number]: PsAgentConnectorAttributes } = {};

  private graph!: dia.Graph;
  private paper!: dia.Paper;
  private elements: { [key: string]: dia.Element } = {};
  private selection: dia.Element | null = null;
  private panning = false;
  private lastClientX = 0;
  private lastClientY = 0;
  private debounce: number | undefined;

  api: PsServerApi;

  constructor() {
    super();
    this.api = new PsServerApi();
  }

  override async connectedCallback() {
    super.connectedCallback();
    window.appGlobals.activity(`Agent Ops - open`);

    window.addEventListener("resize", () => {
      this.updatePaperSize();
    });
  }

  private zoom(factor: number, x: number, y: number): void {
    // Get the current scale and calculate the new scale based on the zoom factor
    const currentScale = this.paper.scale().sx; // sx and sy should be the same
    const newScale = currentScale * factor;

    // Calculate the new position for the origin
    const paperRect = this.paper.getComputedSize(); // Get dimensions of the paper
    const centerX = x - paperRect.width / 2;
    const centerY = y - paperRect.height / 2;

    const beta = factor - 1;
    const offsetX = (centerX * beta) / factor;
    const offsetY = (centerY * beta) / factor;

    // Apply the scaling and translation adjustments
    this.paper.translate(
      this.paper.translate().tx - offsetX,
      this.paper.translate().ty - offsetY
    );
    this.paper.scale(newScale, newScale);
  }

  private zoomIn(): void {
    const center = this.paper.getComputedSize(); // or another way to get center
    this.zoom(1.1, center.width / 2, center.height / 2);
  }

  private zoomOut(): void {
    const center = this.paper.getComputedSize(); // or another way to get center
    this.zoom(0.9, center.width / 2, center.height / 2);
  }

  private resetZoom(): void {
    // Reset the origin before resetting the scale
    this.paper.scale(1, 1);
  }

  protected override firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    this.initializeJointJS();
    //@ts-ignore
    this.paper.el.addEventListener("wheel", (event) => {
      if (!event.shiftKey) {
        return; // Only zoom if the Shift key is held down
      }

      event.preventDefault(); // Prevent default scrolling behavior

      // Clear the previous timeout if it exists
      if (this.debounce) {
        clearTimeout(this.debounce);
      }

      // Set a new timeout for the zoom function
      this.debounce = window.setTimeout(() => {
        const localPoint = this.paper.clientToLocalPoint({
          x: event.offsetX,
          y: event.offsetY,
        });
        const newScale = event.deltaY < 0 ? 1.05 : 0.95; // Smaller factors for smoother zoom

        this.zoom(newScale, localPoint.x, localPoint.y);
      }, 5); // Debounce zoom calls to every 50ms
    });
  }

  override updated(
    changedProperties: Map<string | number | symbol, unknown>
  ): void {
    super.updated(changedProperties);
    if (changedProperties.has("currentAgent") && this.currentAgent) {
      this.paper.freeze();
      this.updateGraphWithAgentData();
      this.paper.unfreeze();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.appGlobals.activity(`Agent Ops - close`);
  }

  private handleNodeDoubleClick(
    element: dia.Element,
    zoomOut: boolean = false
  ): void {
    const bbox = element.getBBox();

    if (zoomOut) {
      const centerX = (bbox.x + bbox.width / 2) * this.paper.scale().sx;
      const centerY = (bbox.y + bbox.height / 2) * this.paper.scale().sy;
      const currentScale = this.paper.scale().sx; // Assuming sx and sy are the same

      // Depending on your needs, adjust the zoom-out factor, this example halves the scale
      const zoomFactor = 1 / 4;
      const newScale = Math.max(
        this.paper.options.zoom.min,
        currentScale * zoomFactor
      );

      // Zoom out, centered on the clicked node
      this.zoom(newScale, centerX, centerY);
    } else {
      // Existing logic for zooming in
      const centerX = bbox.x + bbox.width / 2;
      const centerY = bbox.y + bbox.height / 2;

      // Zoom in to 2x scale, centered on the double-clicked node
      this.zoom(2, centerX, centerY);
    }
  }

  jointNamespace = {};

  private createLink(
    source: dia.Element,
    target: dia.Element,
    isInputConnector: boolean
  ): dia.Link | null {
    if (!source || !target) {
      console.error(`source or target is null ${source} ${target}`);
      return null;
    }
    const link = new shapes.standard.Link({
      source: { id: isInputConnector ? target.id : source.id },
      target: { id: isInputConnector ? source.id : target.id },
      attrs: {
        line: {
          stroke: "var(--md-sys-color-on-surface)",
          strokeWidth: 2,
          targetMarker: {
            type: "path",
            d: "M 10 -5 L 0 0 L 10 5 z",
            fill: "var(--md-sys-color-on-surface)",
          },
        },
      },
      z: 1,
      router: {
        name: "manhattan",
        args: {
          step: 20,
        },
      },
      connector: { name: "rounded" },
    });

    return link;
  }

  private async initializeJointJS(): Promise<void> {
    const paperContainer = this.shadowRoot?.getElementById(
      "paper-container"
    ) as HTMLElement;

    if (!paperContainer) {
      console.error("Paper container not found");
      return;
    }

    this.graph = new dia.Graph({}, { cellNamespace: this.jointNamespace });
    this.paper = new dia.Paper({
      //@ts-ignore
      elementView: () => AgentsShapeView,
      el: paperContainer,
      model: this.graph,
      cellViewNamespace: this.jointNamespace,
      width: "100%",
      height: "100%",
      gridSize: 20,
      panning: {
        enabled: false, // Initially disabled
        modifiers: "mouseMiddle", // Enable panning with the middle mouse button
      },
      zoom: {
        enabled: true, // Initially disabled
        mousewheel: false, // Enable mouse wheel zooming
        wheelEnabled: true, // Enable touchpad pinch zooming
        max: 2, // Set max zoom level
        min: 0.2, // Set min zoom level
        step: 0.2, // Set zoom step increment
      },
      async: true,
      frozen: true,
      sorting: dia.Paper.sorting.APPROX,
      background: { color: "var(--md-sys-color-surface)" },
      clickThreshold: 10,
      defaultConnector: {
        name: "rounded",
      },
      defaultRouter: {
        name: "manhattan",
        args: {
          step: 15,
        },
      },
    });

    this.paper.on("element:pointerclick", (elementView) => {
      debugger;
      //      this.selectElement((elementView as any).model as dia.Element);
    });

    this.paper.on(
      "element:pointerdblclick",
      (cellView: dia.ElementView, evt: dia.Event) => {
        //@ts-ignore
        const element = cellView.model as dia.Element;
        if (evt.shiftKey) {
          // Handle zoom out with Shift key held down
          this.handleNodeDoubleClick(element, true); // Passing true for zooming out
        }
        if (evt.shiftKey && evt.ctrlKey) {
          // Handle zoom in if Shift key is not held down
          this.handleNodeDoubleClick(element);
        } else {
          //this.highlightBranch(element);
        }
      }
    );

    this.paper.on("blank:pointerclick", (elementView, evt) => {
      //this.updatePaperSize();
    });

    // Initialize SVG styles for the paper
    V(paperContainer as any).prepend(
      V("style", {
        type: "text/css",
      }).text(`
      .joint-element .selection {
          stroke: var(--md-sys-color-surface);
      }
      .joint-link .selection {
          stroke: var(--md-sys-color-surface);
          stroke-dasharray: 5;
          stroke-dashoffset: 10;
          animation: dash 0.5s infinite linear;
      }
      @keyframes dash {
          to {
              stroke-dashoffset: 0;
          }
      }
    `)
    );

    Object.assign(this.jointNamespace, {
      myShapeGroup: {
        AgentsShapeView,
        AgentShape,
        ConnectorShape,
      },
      standard: {
        Rectangle: shapes.standard.Rectangle,
      },
    });

    this.paper.unfreeze();
    this.updatePaperSize();

    await this.updateComplete;

    //@ts-ignore
    const paperEl = this.paper.el;

    paperEl.addEventListener("mousedown", (event: MouseEvent) => {
      // Middle mouse button is pressed
      if (event.button === 1) {
        this.panning = true;
        this.lastClientX = event.clientX;
        this.lastClientY = event.clientY;
        paperEl.style.cursor = "move"; // Optional: Change the cursor to a move icon
        event.preventDefault(); // Prevent any default behavior
      }
    });

    paperEl.addEventListener("mousemove", (event: MouseEvent) => {
      if (this.panning) {
        const dx = event.clientX - this.lastClientX;
        const dy = event.clientY - this.lastClientY;

        this.lastClientX = event.clientX;
        this.lastClientY = event.clientY;

        // Manually apply the translation to the paper's viewport
        const currentTranslate = this.paper.translate();
        this.paper.translate(
          currentTranslate.tx + dx,
          currentTranslate.ty + dy
        );
      }
    });

    // Listen for mouse up on the paper element itself
    paperEl.addEventListener("mouseup", (event: MouseEvent) => {
      if (this.panning && event.button === 1) {
        this.panning = false;
        paperEl.style.cursor = "default"; // Reset the cursor
      }
    });

    // Optionally, listen for the mouse leaving the paper area to also cancel panning
    paperEl.addEventListener("mouseleave", (event: MouseEvent) => {
      if (this.panning) {
        this.panning = false;
        paperEl.style.cursor = "default"; // Reset the cursor
      }
    });
  }

  private applyDirectedGraphLayout(): void {
    /*DirectedGraph.layout(this.graph, {
      setLinkVertices: true,
      align: 'UR',
      ranker: 'longest-path',
      rankDir: 'BT', // Adjust as needed
      marginX: 20,
      marginY: 40,
      nodeSep: 120,
      edgeSep: 120,
      rankSep: 80,
    });*/

    // Additional manual adjustments if needed
    this.graph.getElements().forEach((element) => {
      // Adjust positions manually if necessary
    });

    // Translate the graph to ensure consistency in positioning
    const bbox = this.graph.getBBox();
    //@ts-ignore
    const diffX = 100 - bbox.x - bbox.width / 2;
    //@ts-ignore
    const diffY = 100 - bbox.y - bbox.height / 2;
    this.graph.translate(diffX, diffY);

    //this.updatePaperSize();
  }

  private centerParentNodeOnScreen(parentNodeId: string): void {
    const parentNode = this.elements[parentNodeId];
    if (!parentNode) {
      console.error(`Parent node with ID ${parentNodeId} not found.`);
      return;
    }

    // First, we need to get the current scale so that we can account for it in our calculations
    const currentScale = this.paper.scale().sx; // Assuming uniform scaling for simplicity; sx and sy are the same

    // Fetch the bounding box of the parent node (which includes sub-elements like labels)
    const parentNodeBBox = parentNode.getBBox();

    // Compute the dimensions of the paper's visible area
    const paperSize = this.paper.getComputedSize();

    // Calculate the center of the parent node's bounding box in the coordinates of the current viewport
    const bboxCenterX = parentNodeBBox.x + parentNodeBBox.width / 2;
    const bboxCenterY = parentNodeBBox.y + parentNodeBBox.height / 2;

    // Calculate the center of the paper's visible area
    const paperCenterX = paperSize.width / 2;
    const paperCenterY = paperSize.height / 2;

    // Calculate the desired translation to put the center of the bounding box in the center of the paper
    // We need to account for the current scale because the translation is in unscaled coordinates
    const desiredTx = paperCenterX - bboxCenterX * currentScale;
    const desiredTy = paperCenterY - bboxCenterY * currentScale;

    // Translate the paper by the calculated amount
    this.paper.translate(desiredTx - 107 / 2, desiredTy - 185 / 2);
  }

  private updatePaperSize(): void {
    if (!this.paper) {
      console.warn("Paper not initialized");
      return;
    }

    // Automatically adjust the viewport to fit all the content
    this.paper.transformToFitContent({
      padding: 78,
      minScaleX: 0.2,
      minScaleY: 0.2,
      maxScaleX: 1.1,
      maxScaleY: 1.1,
      preserveAspectRatio: true,
      //@ts-ignore
      contentArea: this.graph.getBBox(),
      verticalAlign: "top",
      horizontalAlign: "middle",
    });
  }

  createAgentElement(agent: PsAgentAttributes): dia.Element {
    if (this.elements[this.getUniqueAgentId(agent)]) {
      return this.elements[this.getUniqueAgentId(agent)];
    }
    window.psAppGlobals.addToAgentsRegistry(agent);
    //@ts-ignore
    const el = new AgentShape({
      position: {
        x: agent.configuration.graphPosX || Math.random() * 600,
        y: agent.configuration.graphPosY || Math.random() * 400,
      },
      label: agent.Class?.configuration.description,
      text: agent.Class?.configuration.description,
      agentId: agent.id,
      groupId: this.groupId,
      hasStaticTheme: this.hasStaticTheme,
      nodeType: "agent" as PsAgentsNodeType,
      attrs: {
        //cause: node.description,
      },
      type: "html.Element",
    });
    el.addTo(this.graph);
    return el;
  }

  createConnectorElement(
    connector: PsAgentConnectorAttributes,
    sourceAgent: PsAgentAttributes
  ): dia.Element | null | undefined {
    let sourceElement = this.elements[this.getUniqueAgentId(sourceAgent)];
    let targetElement;
    let el;

    if (this.elements[this.getUniqueConnectorId(connector)]) {
      targetElement = this.elements[this.getUniqueConnectorId(connector)];
    } else {
      window.psAppGlobals.addToConnectorsRegistry(connector);
      // Create a new ConnectorShape element
      el = new ConnectorShape({
        position: {
          x: connector.configuration.graphPosX || Math.random() * 600,
          y: connector.configuration.graphPosY || Math.random() * 400,
        },
        label: connector.Class?.configuration.description,
        text: connector.Class?.configuration.description,
        connectorId: connector.id,
        agentName: sourceAgent.configuration.name,
        hasStaticTheme: this.hasStaticTheme,
        groupId: this.groupId,
        nodeType: "connector" as PsAgentsNodeType,
        attrs: {
          //cause: node.description,
        },
        type: "html.Element",
      });
      el.addTo(this.graph);
      targetElement = el;
    }

    if (sourceElement && targetElement && sourceAgent) {
      const isInputConnector = sourceAgent.InputConnectors?.some(
        (input) => input.id === connector.id
      );
      const link = this.createLink(
        sourceElement,
        targetElement,
        isInputConnector!
      );
      link?.addTo(this.graph);
    } else {
      console.warn("Source or target element not found");
    }

    return el;
  }

  getUniqueConnectorId(connector: PsAgentConnectorAttributes): string {
    return `connector-${connector.id}`;
  }

  getUniqueAgentId(agent: PsAgentAttributes): string {
    return `agent-${agent.id}`;
  }

  updateGraphWithAgentData(): void {
    // Clear the existing graph elements
    this.graph.clear();
    this.elements = {};
    const renderedNodes = new Set();

    if (this.currentAgent.SubAgents && this.currentAgent.SubAgents.length > 0) {
      this.currentAgent.SubAgents.forEach((subAgent) => {
        const el = this.createAgentElement(subAgent);
        this.elements[this.getUniqueAgentId(subAgent)] = el;
        renderedNodes.add(this.getUniqueAgentId(subAgent));

        // Collect all subAgent.InputConnectors and subAgent.OutputConnectors into const connectors
        const connectors = [
          ...subAgent.InputConnectors!,
          ...subAgent.OutputConnectors!,
        ];

        connectors.forEach((connector) => {
          const el = this.createConnectorElement(connector, subAgent);
          this.elements[this.getUniqueConnectorId(connector)] = el!;
          renderedNodes.add(this.getUniqueConnectorId(connector));
        });
      });
    }

    const connectors = [
      ...this.currentAgent.InputConnectors!,
      ...this.currentAgent.OutputConnectors!,
    ];

    connectors.forEach((connector) => {
      const el = this.createConnectorElement(connector, this.currentAgent);
      this.elements[this.getUniqueConnectorId(connector)] = el!;
      renderedNodes.add(this.getUniqueConnectorId(connector));
    });

    setTimeout(() => {
      this.applyDirectedGraphLayout();
      this.updatePaperSize();
    });
  }

  // Function to create a link/edge

  private selectElement(el: dia.Element | null): void {
    debugger;
    // Deselect the current selection if any
    if (this.selection) {
      this.unhighlightCell(this.selection);
      this.graph.getLinks().forEach((link) => this.unhighlightCell(link));
    }

    // Select and highlight the new element
    if (el) {
      this.highlightCell(el);
      this.selection = el;
    } else {
      this.selection = null;
    }
  }

  private highlightCell(cell: Cell): void {
    const view = cell.findView(this.paper);
    if (view) {
      highlighters.addClass.add(
        view,
        cell.isElement() ? "body" : "line",
        "selection",
        { className: "selection" }
      );
    }
  }

  private unhighlightCell(cell: Cell): void {
    const view = cell.findView(this.paper);
    if (view) {
      highlighters.addClass.remove(view, "selection");
    }
  }

  static override get styles() {
    return [
      super.styles,
      css`
        md-fab {
          --md-fab-container-shape: 4px;
          --md-fab-label-text-size: 16px !important;
          --md-fab-label-text-weight: 600 !important;
          margin-bottom: 24px;
          --md-fab-container-elevation: 0;
          --md-fab-container-shadow-color: transparent;
        }

        .addAgentButton {
          width: 180px;
        }

        .addAgentButton {
          max-height: 36px;
          margin-top: 10px;
          margin-right: 16px;
        }

        md-fab:not([has-static-theme]) {
          --md-sys-color-primary-container: var(--md-sys-color-primary);
          --md-sys-color-on-primary-container: var(--md-sys-color-on-primary);
        }
        .agentHeaderImage {
          max-width: 72px;
          border-radius: 16px;
        }

        .agentHeaderText {
          font-size: 17px;
          padding: 8px;
          margin-left: 16px;
          margin-right: 16px;
          font-family: var(--md-ref-typeface-brand);
        }

        .agentHeader {
          margin-left: 16px;
        }

        .mainAgentPlayButton {
          margin-right: 10px;
        }

        .mainAgentStopButton {
          --md-filled-icon-button-selected-container-color: var(
            --md-sys-color-error
          );
          margin-right: 10px;
        }

        .navControls {
          margin-left: 16px;
        }

        .masterPlayConfigButtons {
          margin-right: 16px;
        }

        .agentContainer {
          color: var(--md-sys-color-on-surface);
          background-color: var(--md-sys-color-surface-container-high);
          padding: 0;
        }

        .agentContainer {
          background-color: var(--md-sys-color-surface-container-lowest);
          border-radius: 16px;
          border: 1px solid var(--md-sys-color-surface-container-high);
        }

        .agentContainer[has-static-theme] {
          border-radius: 4px;
        }

        .agentContainerRunning {
          color: var(--md-sys-color-on-surface);
          background-color: var(--md-sys-color-surface-container-highest);
          border-radius: 16px;
          padding: 0;
        }

        .agentContainerRunning {
          background-color: var(--md-sys-color-surface-container-lowest);
          border: 1px solid var(--md-sys-color-surface-container-highest);
        }

        .connectorContainer[has-static-theme] {
          border-radius: 4px;
        }

        .connectorContainer {
          color: var(--md-sys-color-on-surface);
          background-color: var(--md-sys-color-surface-container-low);
          padding: 0;
        }

        .connectorContainer[has-static-theme] {
          border-radius: 4px;
        }

        .connectorContainer {
          background-color: var(--md-sys-color-surface-container-lowest);
          border: 1px solid var(--md-sys-color-surface-container-highest);
        }

        /* Define your component styles here */
        .jointJSCanvas {
          width: 100vw !important;
          height: calc(500vh - 90px) !important;
          overflow-x: auto !important;
          overflow-y: auto !important;
          /* styles for the JointJS canvas */
        }

        .jointJSCanvas[minimize-workflow] {
          height: 100% !important;
          width: 920px !important;
          height: 500px !important;
        }

        .controlPanel {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          margin: 0 0;
          width: 100%;
          position: absolute;
          top: 198px;
          left: 0;
          width: 100%;
          padding: 0;
          opacity: 1;
          height: 52px;
          z-index: 1000;
          background: transparent;
          color: var(--md-sys-color-on-surface-variant);
        }

        md-filled-tonal-icon-button {
          margin-left: 8px;
          margin-right: 8px;
        }

        .firstButton {
          margin-left: 16px;
        }

        .lastButton {
          margin-right: 16px;
        }

        @keyframes fadeAwayAnimation {
          0% {
            opacity: 1;
          }
          8% {
            opacity: 0.1;
          }
          100% {
            opacity: 1;
          }
        }

        .fadeAway {
          animation: fadeAwayAnimation 60.5s;
        }

        .downloadButton {
          margin-right: 28px;
        }
      `,
    ];
  }

  pan(direction: string): void {
    const currentTranslate = this.paper.translate();
    let dx = 0;
    let dy = 0;

    switch (direction) {
      case "left":
        dx = 25;
        break;
      case "right":
        dx = -25;
        break;
      case "up":
        dy = 25;
        break;
      case "down":
        dy = -25;
        break;
    }

    this.paper.translate(currentTranslate.tx + dx, currentTranslate.ty + dy);
  }

  renderHeader() {
    return html`
      <div class="layout horizontal center-center agentHeader">
        <img
          src="${YpMediaHelpers.getImageFormatUrl(
            this.group.GroupLogoImages,
            0
          )}"
          class="agentHeaderImage"
          alt="${this.group.name}"
        />
        <div class="layout vertical agentHeaderText">${this.group.name}</div>
      </div>
    `;
  }

  stop() {
    this.fireGlobal("pause-agent", {
      agentId: this.currentAgent.id,
    });
    window.psAppGlobals.setCurrentRunningAgentId(undefined);
  }

  start() {
    this.fireGlobal("run-agent", {
      agentId: this.currentAgent.id,
    });
    window.psAppGlobals.setCurrentRunningAgentId(this.currentAgent.id);
  }

  override render() {
    return html`
      <div class="controlPanel" ?hidden="${this.minimizeWorkflow}">
        <div class="navControls">
          <md-icon-button @click="${this.zoomIn}" class="firstButton"
            ><md-icon>zoom_in</md-icon></md-icon-button
          >
          <md-icon-button @click="${this.zoomOut}"
            ><md-icon>zoom_out</md-icon></md-icon-button
          >
          <md-icon-button @click="${this.resetZoom}"
            ><md-icon>center_focus_strong</md-icon></md-icon-button
          >
          <md-icon-button @click="${this.updatePaperSize}"
            ><md-icon>zoom_out_map</md-icon></md-icon-button
          >
        </div>

        <div class="flex"></div>

        <div class="masterPlayConfigButtons" ?hidden="${this.minimizeWorkflow}">
          ${this.currentRunningAgentId
            ? html`<md-filled-icon-button
                class="mainAgentStopButton"
                @click="${this.stop}"
                ><md-icon>stop</md-icon></md-filled-icon-button
              >`
            : html`<md-outlined-icon-button
                hidden
                class="mainAgentPlayButton"
                @click="${this.start}"
                ><md-icon>play_arrow</md-icon></md-outlined-icon-button
              >`}
          <md-fab
            ?has-static-theme="${this.hasStaticTheme}"
            lowered
            size="large"
            class="addAgentButton"
            variant="primary"
            @click="${() => this.fire("add-agent")}"
            .label="   ${this.t("Add Agent")}"
          >
            <md-icon hidden slot="icon">addExistingConnector</md-icon></md-fab
          >
        </div>

        <div hidden ?hidden="${this.minimizeWorkflow}">
          <md-icon-button @click="${() => this.pan("left")}"
            ><md-icon>arrow_back</md-icon></md-icon-button
          >

          <md-icon-button @click="${() => this.pan("up")}"
            ><md-icon>arrow_upward</md-icon></md-icon-button
          >

          <md-icon-button @click="${() => this.pan("down")}"
            ><md-icon>arrow_downward</md-icon></md-icon-button
          >

          <md-icon-button @click="${() => this.pan("right")}" class="lastButton"
            ><md-icon>arrow_forward</md-icon></md-icon-button
          >
        </div>
      </div>
      <div
        class="jointJSCanvas"
        id="paper-container"
        ?minimize-workflow="${this.minimizeWorkflow}"
      ></div>
    `;
  }
}
