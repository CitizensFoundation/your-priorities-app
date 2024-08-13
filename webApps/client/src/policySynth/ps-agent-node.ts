import { css, html, nothing } from "lit";
import { property, query, customElement, state } from "lit/decorators.js";

import "@material/web/iconbutton/icon-button.js";
import "@material/web/progress/circular-progress.js";
import "@material/web/progress/linear-progress.js";
import "@material/web/menu/menu.js";
import "@material/web/menu/menu-item.js";
import "@trystan2k/fleshy-jsoneditor/fleshy-jsoneditor.js";

import { PsServerApi } from "./PsServerApi.js";
import { PsOperationsBaseNode } from "./ps-operations-base-node.js";
import { MdMenu } from "@material/web/menu/menu.js";
import { MdDialog } from "@material/web/dialog/dialog.js";

@customElement("ps-agent-node")
export class PsAgentNode extends PsOperationsBaseNode {
  @property({ type: Object })
  agent!: PsAgentAttributes;

  @property({ type: Number })
  agentId!: number;

  @property({ type: Number }) groupId!: number;

  @property({ type: Boolean, reflect: true }) running = false;

  @state()
  private agentState: "running" | "paused" | "stopped" | "error" | "completed" =
    "stopped";

  @state()
  private latestMessage: string = "";

  @state()
  private progress: number | undefined;

  @state()
  private menuOpen = false;

  @state()
  private agentMemory: object | null = null;

  @query("#connectorMenuAnchor")
  connectorMenuAnchor!: HTMLElement;

  @query("#agentConnectorMenu")
  agentConnectorMenu!: MdMenu;

  @query("#mainMenuAnchor")
  mainMenuAnchor!: HTMLElement;

  @query("#agentMainMenu")
  agentMainMenu!: MdMenu;

  @query("#memoryDialog")
  memoryDialog!: MdDialog;

  override api: PsServerApi;
  private statusInterval: number | undefined;

  constructor() {
    super();
    this.api = new PsServerApi();
  }

  override firstUpdated() {
    if (this.agentConnectorMenu && this.connectorMenuAnchor) {
      (this.agentConnectorMenu as MdMenu).anchorElement =
        this.connectorMenuAnchor;
    }

    if (this.agentMainMenu && this.mainMenuAnchor) {
      (this.agentMainMenu as MdMenu).anchorElement = this.mainMenuAnchor;
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.agent = window.psAppGlobals.getAgentInstance(this.agentId)!;
    this.updateAgentStatus(); // Initial status check
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.stopStatusUpdates();
  }

  toggleConnectorMenu(e: Event) {
    e.stopPropagation();
    if (this.agentConnectorMenu) {
      this.agentConnectorMenu.open = !this.agentConnectorMenu.open;
    }
  }

  toggleMainMenu(e: Event) {
    e.stopPropagation();
    if (this.agentMainMenu) {
      this.agentMainMenu.open = !this.agentMainMenu.open;
    }
  }

  async fetchAgentMemory() {
    try {
      const memory = await this.api.getAgentMemory(this.groupId, this.agent.id);
      this.agentMemory = memory;
      if (!this.agentMemory) {
        this.agentMemory = { error: "No memory available" };
      }
    } catch (error) {
      console.error("Error fetching agent memory:", error);
      this.agentMemory = { error: "Failed to fetch agent memory" };
    }
  }

  openMemoryDialog() {
    this.fetchAgentMemory();
    this.memoryDialog.show();
  }

  addInputConnector() {
    this.fire("add-connector", { agentId: this.agent.id, type: "input" });
    this.menuOpen = false;
  }

  addOutputConnector() {
    this.fire("add-connector", { agentId: this.agent.id, type: "output" });
    this.menuOpen = false;
  }

  startStatusUpdates() {
    this.statusInterval = window.setInterval(
      () => this.updateAgentStatus(),
      1000
    );
  }

  stopStatusUpdates() {
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
      this.statusInterval = undefined;
    }
  }

  async updateAgentStatus() {
    try {
      const status = await this.api.getAgentStatus(this.groupId, this.agent.id);
      if (status) {
        this.agentState = status.state as
          | "running"
          | "paused"
          | "stopped"
          | "completed"
          | "error";
        this.progress = status.progress;
        this.latestMessage = status.messages[status.messages.length - 1] || "";

        if (this.agentState === "stopped" || this.agentState === "error") {
          this.stopStatusUpdates();
        } else if (this.agentState === "running" && !this.statusInterval) {
          console.log("Starting status updates from server");
          this.startStatusUpdates();
        }

        this.requestUpdate();
        this.fire("get-costs");

        if (this.agentState === "running") {
          this.running = true;
        } else {
          this.running = false;
        }
      }
    } catch (error) {
      console.error("Failed to get agent status:", error);
    }
  }

  async startAgent() {
    try {
      await this.api.startAgent(this.groupId, this.agent.id);
      this.agentState = "running";
      window.psAppGlobals.setCurrentRunningAgentId(this.agent.id);
      this.startStatusUpdates();
      this.requestUpdate();
    } catch (error) {
      console.error("Failed to start agent:", error);
    }
  }

  async pauseAgent() {
    try {
      await this.api.pauseAgent(this.groupId, this.agent.id);
      this.agentState = "paused";
      this.requestUpdate();
    } catch (error) {
      console.error("Failed to pause agent:", error);
    }
  }

  async stopAgent() {
    try {
      await this.api.stopAgent(this.groupId, this.agent.id);
      this.agentState = "stopped";
      window.psAppGlobals.setCurrentRunningAgentId(undefined);
      this.stopStatusUpdates();
      this.requestUpdate();
    } catch (error) {
      console.error("Failed to stop agent:", error);
    }
  }

  override editNode() {
    this.fire("edit-node", {
      nodeId: this.nodeId,
      element: this.agent,
    });
  }

  renderMemoryDialog() {
    return html`
      <md-dialog id="memoryDialog">
        <div slot="headline">${this.t("agentMemoryExplorer")}</div>
        <div slot="content">
          ${this.agentMemory && !(this.agentMemory as any).error
            ? html`
                <fleshy-jsoneditor
                  style="height: 100%;"
                  .json=${this.agentMemory}
                  mode="view"
                ></fleshy-jsoneditor>
              `
            : this.agentMemory && (this.agentMemory as any).error
            ? html`${(this.agentMemory as any).error}`
            : html`<md-linear-progress indeterminate></md-linear-progress>`}
        </div>
        <div slot="actions">
          <md-text-button @click=${() => this.memoryDialog.close()}>
            ${this.t("close")}
          </md-text-button>
        </div>
      </md-dialog>
    `;
  }

  renderActionButtons() {
    switch (this.agentState) {
      case "running":
        return html`
          <md-icon-button class="playButtons" @click="${this.pauseAgent}" disabled>
            <md-icon>pause</md-icon>
          </md-icon-button>
          <md-icon-button class="playButtons" @click="${this.stopAgent}">
            <md-icon>stop</md-icon>
          </md-icon-button>
        `;
      case "paused":
        return html`
          <md-icon-button class="playButtons" @click="${this.startAgent}">
            <md-icon>play_circle</md-icon>
          </md-icon-button>
          <md-icon-button class="playButtons" @click="${this.stopAgent}">
            <md-icon>stop</md-icon>
          </md-icon-button>
        `;
      case "stopped":
      case "completed":
      case "error":
        return html`
          <md-icon-button class="playButtons" @click="${this.startAgent}">
            <md-icon>play_circle</md-icon>
          </md-icon-button>
        `;
    }
  }

  renderProgress() {
    if (this.progress === undefined) {
      return html`<md-linear-progress indeterminate></md-linear-progress>`;
    } else {
      const progress = Math.min(1, Math.max(0, this.progress / 100));
      return html`<md-linear-progress
        value="${progress}"
      ></md-linear-progress>`;
    }
  }

  renderConnectorMenu() {
    return html`
      <md-icon-button
        id="connectorMenuAnchor"
        @click="${this.toggleConnectorMenu}"
      >
        <md-icon>add</md-icon>
      </md-icon-button>
      <md-menu id="agentConnectorMenu" positioning="popover">
        <md-menu-item @click="${this.addInputConnector}">
          <div slot="headline">Add Input Connector</div>
        </md-menu-item>
        <md-menu-item @click="${this.addOutputConnector}">
          <div slot="headline">Add Output Connector</div>
        </md-menu-item>
      </md-menu>
    `;
  }

  renderMainMenu() {
    return html` <md-icon-button
        id="mainMenuAnchor"
        @click="${this.toggleMainMenu}"
      >
        <md-icon>more_horiz</md-icon>
      </md-icon-button>
      <md-menu id="agentMainMenu" positioning="popover">
        <md-menu-item @click="${this.openMemoryDialog}">
          <div slot="headline">Explore Memory</div>
        </md-menu-item>
      </md-menu>`;
  }
  override render() {
    if (!this.agent) return nothing;

    return html`
      <div class="mainContainer">
        <img
          class="image"
          src="${this.agent.Class?.configuration.imageUrl}"
          alt="${this.agent.Class?.name}"
        />
        <div class="contentContainer">
          <div class="agentName">${this.agent.configuration["name"]}</div>
          <div class="agentClassName">${this.agent.Class?.name}</div>
          ${this.agentState === "running" ? this.renderProgress() : nothing}
          <div class="statusMessage">${this.latestMessage}</div>
        </div>
        <div class="buttonContainer">
          ${this.renderConnectorMenu()}

          ${this.renderActionButtons()}

          <md-icon-button @click="${this.editNode}">
            <md-icon>settings</md-icon>
          </md-icon-button>
        </div>
      </div>
      ${this.renderMemoryDialog()}
    `;
  }

  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .playButtons {
          --md-icon-button-icon-size: 32px;
          padding-bottom: 16px;
          width: 44px;
          height: 44px;
        }

        #memoryDialog {
          width: 95vw;
          height: 95vh;
          max-width: 97vw;
          max-height: 97vh;
        }

        .buttonContainer {
          display: flex;
          padding: 0px;
          padding-bottom: 0;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: absolute;
        }

        md-icon-button {
          margin: 0 4px;
        }

        :host {
          display: block;
          position: relative;
        }

        .mainContainer {
          position: relative;
        }

        md-menu {
          --md-menu-container-color: var(--md-sys-color-surface-container);
          --md-menu-container-elevation: 2;
          z-index: 2000;
        }

        md-linear-progress {
          margin: 16px;
          margin-bottom: 8px;
          margin-top: 8px;
        }

        .mainContainer {
          height: 300px;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
        }

        .image {
          width: 100%;
          height: 113px;
          object-fit: cover;
          border-radius: 16px 16px 0 0;
        }

        .contentContainer {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          padding: 8px;
        }

        .agentClassName {
          font-size: 9px;
          text-align: center;
          margin: 8px;
        }

        .agentName {
          font-size: 14px;
          text-align: center;
        }

        .statusMessage {
          font-size: 11px;
          text-align: center;
          margin-top: 8px;
          border-radius: 16px;
          flex-grow: 1;
          color: var(--md-sys-color-on-surface-variant);
        }


        md-circular-progress {
          --md-circular-progress-size: 28px;
        }

        md-menu {
          --md-menu-z-index: 1000;
          z-index: 1000;
        }

        [hidden] {
          display: none !important;
        }
      `,
    ];
  }
}
