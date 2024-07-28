var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, nothing } from "lit";
import { property, query, customElement, state } from "lit/decorators.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/progress/circular-progress.js";
import "@material/web/progress/linear-progress.js";
import "@material/web/menu/menu.js";
import "@material/web/menu/menu-item.js";
import { PsServerApi } from "./PsServerApi.js";
import { PsOperationsBaseNode } from "./ps-operations-base-node.js";
let PsAgentNode = class PsAgentNode extends PsOperationsBaseNode {
    constructor() {
        super();
        this.running = false;
        this.agentState = "stopped";
        this.latestMessage = "";
        this.menuOpen = false;
        this.api = new PsServerApi();
    }
    firstUpdated() {
        if (this.agentMenu && this.menuAnchor) {
            this.agentMenu.anchorElement = this.menuAnchor;
        }
    }
    connectedCallback() {
        super.connectedCallback();
        this.agent = window.psAppGlobals.getAgentInstance(this.agentId);
        this.updateAgentStatus(); // Initial status check
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.stopStatusUpdates();
    }
    toggleMenu(e) {
        e.stopPropagation();
        if (this.agentMenu) {
            this.agentMenu.open = !this.agentMenu.open;
        }
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
        this.statusInterval = window.setInterval(() => this.updateAgentStatus(), 5000);
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
                this.agentState = status.state;
                this.progress = status.progress;
                this.latestMessage = status.messages[status.messages.length - 1] || "";
                if (this.agentState === "stopped" || this.agentState === "error") {
                    this.stopStatusUpdates();
                }
                else if (this.agentState === "running" && !this.statusInterval) {
                    console.log("Starting status updates from server");
                    this.startStatusUpdates();
                }
                this.requestUpdate();
                this.fire("get-costs");
                if (this.agentState === "running") {
                    this.running = true;
                }
                else {
                    this.running = false;
                }
            }
        }
        catch (error) {
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
        }
        catch (error) {
            console.error("Failed to start agent:", error);
        }
    }
    async pauseAgent() {
        try {
            await this.api.pauseAgent(this.groupId, this.agent.id);
            this.agentState = "paused";
            this.requestUpdate();
        }
        catch (error) {
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
        }
        catch (error) {
            console.error("Failed to stop agent:", error);
        }
    }
    editNode() {
        this.fire("edit-node", {
            nodeId: this.nodeId,
            element: this.agent,
        });
    }
    renderActionButtons() {
        switch (this.agentState) {
            case "running":
                return html `
          <md-icon-button @click="${this.pauseAgent}" disabled>
            <md-icon>pause</md-icon>
          </md-icon-button>
          <md-icon-button @click="${this.stopAgent}">
            <md-icon>stop</md-icon>
          </md-icon-button>
        `;
            case "paused":
                return html `
          <md-icon-button @click="${this.startAgent}">
            <md-icon>play_arrow</md-icon>
          </md-icon-button>
          <md-icon-button @click="${this.stopAgent}">
            <md-icon>stop</md-icon>
          </md-icon-button>
        `;
            case "stopped":
            case "completed":
            case "error":
                return html `
          <md-icon-button @click="${this.startAgent}">
            <md-icon>play_arrow</md-icon>
          </md-icon-button>
        `;
        }
    }
    renderProgress() {
        if (this.progress === undefined) {
            return html `<md-linear-progress indeterminate></md-linear-progress>`;
        }
        else {
            const progress = Math.min(1, Math.max(0, this.progress / 100));
            return html `<md-linear-progress
        value="${progress}"
      ></md-linear-progress>`;
        }
    }
    render() {
        if (!this.agent)
            return nothing;
        return html `
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
          <md-icon-button id="menuAnchor" @click="${this.toggleMenu}">
            <md-icon>more_vert</md-icon>
          </md-icon-button>
          <md-menu id="agentMenu" positioning="popover">
            <md-menu-item @click="${this.addInputConnector}">
              <div slot="headline">Add Input Connector</div>
            </md-menu-item>
            <md-menu-item @click="${this.addOutputConnector}">
              <div slot="headline">Add Output Connector</div>
            </md-menu-item>
          </md-menu>

          ${this.renderActionButtons()}

          <md-icon-button @click="${this.editNode}">
            <md-icon>settings</md-icon>
          </md-icon-button>
        </div>
      </div>
    `;
    }
    static get styles() {
        return [
            super.styles,
            css `
        :host {
          display: block;
        }

        .buttonContainer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
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

        .buttonContainer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
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
};
__decorate([
    property({ type: Object })
], PsAgentNode.prototype, "agent", void 0);
__decorate([
    property({ type: Number })
], PsAgentNode.prototype, "agentId", void 0);
__decorate([
    property({ type: Number })
], PsAgentNode.prototype, "groupId", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], PsAgentNode.prototype, "running", void 0);
__decorate([
    state()
], PsAgentNode.prototype, "agentState", void 0);
__decorate([
    state()
], PsAgentNode.prototype, "latestMessage", void 0);
__decorate([
    state()
], PsAgentNode.prototype, "progress", void 0);
__decorate([
    state()
], PsAgentNode.prototype, "menuOpen", void 0);
__decorate([
    query("#menuAnchor")
], PsAgentNode.prototype, "menuAnchor", void 0);
__decorate([
    query("#agentMenu")
], PsAgentNode.prototype, "agentMenu", void 0);
PsAgentNode = __decorate([
    customElement("ps-agent-node")
], PsAgentNode);
export { PsAgentNode };
//# sourceMappingURL=ps-agent-node.js.map