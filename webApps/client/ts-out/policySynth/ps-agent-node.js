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
import "@material/web/menu/sub-menu.js";
import "@material/web/divider/divider.js";
import "@trystan2k/fleshy-jsoneditor/fleshy-jsoneditor.js";
import { PsServerApi } from "./PsServerApi.js";
import { PsOperationsBaseNode } from "./ps-operations-base-node.js";
let PsAgentNode = class PsAgentNode extends PsOperationsBaseNode {
    constructor() {
        super();
        this.running = false;
        this.agentState = "stopped";
        this.latestMessage = "";
        this.menuOpen = false;
        this.agentMemory = null;
        this.api = new PsServerApi();
    }
    firstUpdated() {
        if (this.agentConnectorMenu && this.connectorMenuAnchor) {
            this.agentConnectorMenu.anchorElement =
                this.connectorMenuAnchor;
        }
        if (this.agentMainMenu && this.mainMenuAnchor) {
            this.agentMainMenu.anchorElement = this.mainMenuAnchor;
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
    getSafeFileName(name) {
        const safeName = name.toLowerCase().replace(/\s+/g, "_");
        const date = new Date();
        const dateString = `${date.getFullYear()}${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}_${date
            .getHours()
            .toString()
            .padStart(2, "0")}${date.getMinutes().toString().padStart(2, "0")}`;
        return `${safeName}_memory_${dateString}.json`;
    }
    async saveMemoryToFile() {
        try {
            const memory = await this.api.getAgentMemory(this.groupId, this.agent.id);
            if (memory) {
                const fileName = this.getSafeFileName(this.agent.configuration.name);
                const jsonString = JSON.stringify(memory, null, 2);
                const blob = new Blob([jsonString], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = fileName;
                // Append to the document body to work in Firefox
                document.body.appendChild(link);
                link.click();
                // Clean up
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }
            else {
                console.error("No memory available to save");
            }
        }
        catch (error) {
            console.error("Error saving agent memory:", error);
        }
    }
    triggerFileInput() {
        this.fileInput.click();
    }
    handleFileSelect(event) {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = JSON.parse(e.target?.result);
                    this.confirmLoadMemory(content);
                }
                catch (error) {
                    console.error("Error parsing JSON file:", error);
                }
            };
            reader.readAsText(file);
        }
    }
    confirmLoadMemory(content) {
        window.appDialogs.getDialogAsync("confirmationDialog", (dialog) => {
            dialog.open(this.t("confirmLoadAndOverrideMemory"), () => this.loadMemoryFromContent(content), true, true);
        });
    }
    async loadMemoryFromContent(content) {
        try {
            await this.api.replaceAgentMemory(this.groupId, this.agent.id, content);
            this.agentMemory = content;
            this.requestUpdate();
        }
        catch (error) {
            console.error("Error loading agent memory:", error);
        }
    }
    toggleConnectorMenu(e) {
        e.stopPropagation();
        if (this.agentConnectorMenu) {
            this.agentConnectorMenu.open = !this.agentConnectorMenu.open;
        }
    }
    toggleMainMenu(e) {
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
        }
        catch (error) {
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
    addExistingConnector(connectorId, type) {
        this.fire("add-existing-connector", {
            agentId: this.agent.id,
            connectorId,
            type,
        });
    }
    startStatusUpdates() {
        this.statusInterval = window.setInterval(() => this.updateAgentStatus(), 1000);
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
    renderMemoryDialog() {
        return html `
      <md-dialog id="memoryDialog">
        <div slot="headline">${this.t("agentMemoryExplorer")}</div>
        <div slot="content">
          ${this.agentMemory && !this.agentMemory.error
            ? html `
                <fleshy-jsoneditor
                  style="height: 100%;"
                  .json=${this.agentMemory}
                  mode="view"
                ></fleshy-jsoneditor>
              `
            : this.agentMemory && this.agentMemory.error
                ? html `${this.agentMemory.error}`
                : html `<md-linear-progress indeterminate></md-linear-progress>`}
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
                return html `
          <md-icon-button hidden
            class="playButtons"
            @click="${this.pauseAgent}"
            disabled
          >
            <md-icon>pause</md-icon>
          </md-icon-button>
          <md-icon-button class="playButtons" @click="${this.stopAgent}">
            <md-icon>stop</md-icon>
          </md-icon-button>
        `;
            case "paused":
                return html `
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
                return html `
          <md-icon-button class="playButtons" @click="${this.startAgent}">
            <md-icon>play_circle</md-icon>
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
    renderConnectorMenu() {
        if (window.psAppGlobals.activeConnectorsInstanceRegistry) {
            const allConnectors = Array.from(window.psAppGlobals.activeConnectorsInstanceRegistry.values());
            const currentConnectorIds = new Set([
                ...(this.agent.InputConnectors?.map((c) => c.id) || []),
                ...(this.agent.OutputConnectors?.map((c) => c.id) || []),
            ]);
            const availableConnectors = allConnectors.filter((c) => !currentConnectorIds.has(c.id));
            return html `
        <md-icon-button
          id="connectorMenuAnchor"
          @click="${this.toggleConnectorMenu}"
        >
          <md-icon>add</md-icon>
        </md-icon-button>
        <md-menu
          has-overflow
          id="agentConnectorMenu"
          anchor="connectorMenuAnchor"
          positioning="popover"
          quick
        >
          <md-menu-item @click="${this.addInputConnector}">
            <div slot="headline">Add Input Connector</div>
          </md-menu-item>
          <md-menu-item @click="${this.addOutputConnector}">
            <div slot="headline">Add Output Connector</div>
          </md-menu-item>

          ${availableConnectors.length > 0
                ? html `
                <md-divider></md-divider>
                <md-sub-menu positioning="popover">
                  <md-menu-item slot="item">
                    <div slot="headline">Add Existing Connector</div>
                    <md-icon slot="end">arrow_right</md-icon>
                  </md-menu-item>
                  <md-menu slot="menu" positioning="popover">
                    ${availableConnectors.map((connector) => html `
                        <md-sub-menu>
                          <md-menu-item slot="item">
                            <div slot="headline">
                              ${connector.configuration.name}
                            </div>
                            <md-icon slot="end">arrow_right</md-icon>
                          </md-menu-item>
                          <md-menu slot="menu" positioning="popover">
                            <md-menu-item
                              @click="${() => this.addExistingConnector(connector.id, "input")}"
                            >
                              <div slot="headline">Add as Input</div>
                            </md-menu-item>
                            <md-menu-item
                              @click="${() => this.addExistingConnector(connector.id, "output")}"
                            >
                              <div slot="headline">Add as Output</div>
                            </md-menu-item>
                          </md-menu>
                        </md-sub-menu>
                      `)}
                  </md-menu>
                </md-sub-menu>
              `
                : ""}
        </md-menu>
      `;
        }
        else {
            console.warn("activeConnectorsInstanceRegistry is not available");
            return nothing;
        }
    }
    renderMainMenu() {
        return html ` <md-icon-button
        id="mainMenuAnchor"
        @click="${this.toggleMainMenu}"
      >
        <md-icon>more_horiz</md-icon>
      </md-icon-button>
      <md-menu id="agentMainMenu" positioning="popover">
        <md-menu-item @click="${this.editNode}">
          <div slot="headline">Settings</div>
        </md-menu-item>
        <md-menu-item @click="${this.saveMemoryToFile}">
          <div slot="headline">Save Memory to File</div>
        </md-menu-item>
        <md-menu-item @click="${this.triggerFileInput}">
          <div slot="headline">Load Memory from File</div>
        </md-menu-item>
        <md-menu-item @click="${this.openMemoryDialog}">
          <div slot="headline">Explore Memory</div>
        </md-menu-item>
      </md-menu>
      <input
        type="file"
        id="fileInput"
        @change="${this.handleFileSelect}"
        accept=".json"
        style="display: none;"
      />`;
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
          <div class="agentClassName">${this.agent.Class?.name}</div>
          <div class="agentName">${this.agent.configuration["name"]}</div>
          ${this.agentState === "running" ? this.renderProgress() : nothing}
          <div class="statusMessage">${this.latestMessage}</div>
        </div>
        <div class="buttonContainer">
          ${this.renderConnectorMenu()}
          <div class="flex"></div>

          ${this.renderActionButtons()}
          <div class="flex"></div>

          ${this.renderMainMenu()}
        </div>
      </div>
      ${this.renderMemoryDialog()}
    `;
    }
    static get styles() {
        return [
            super.styles,
            css `
        :host {
          display: block;
        }

        .playButtons {
          --md-icon-button-icon-size: 34px;
          width: 42px;
          height: 42px;
          margin-top: -16px;
        }

        #connectorMenuAnchor {
          margin-bottom: 4px;
        }

        #mainMenuAnchor {
          margin-bottom: 8px;
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
          font-size: 10px;
          text-align: left;
          margin: 8px;
          margin-top: 0;
          line-height: 15px;
          font-weight: 500;
          color: var(--md-sys-color-primary);
          text-transform: uppercase;
        }

        .agentName {
          font-size: 14px;
          text-align: left;
          font-weight: 700;
          margin: 8px;
          margin-top: 0;
          margin-bottom: 0;
          line-height: 22px;
          font-family: var(--md-ref-typeface-brand);
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
    state()
], PsAgentNode.prototype, "agentMemory", void 0);
__decorate([
    query("#connectorMenuAnchor")
], PsAgentNode.prototype, "connectorMenuAnchor", void 0);
__decorate([
    query("#agentConnectorMenu")
], PsAgentNode.prototype, "agentConnectorMenu", void 0);
__decorate([
    query("#mainMenuAnchor")
], PsAgentNode.prototype, "mainMenuAnchor", void 0);
__decorate([
    query("#agentMainMenu")
], PsAgentNode.prototype, "agentMainMenu", void 0);
__decorate([
    query("#memoryDialog")
], PsAgentNode.prototype, "memoryDialog", void 0);
__decorate([
    query("#fileInput")
], PsAgentNode.prototype, "fileInput", void 0);
PsAgentNode = __decorate([
    customElement("ps-agent-node")
], PsAgentNode);
export { PsAgentNode };
//# sourceMappingURL=ps-agent-node.js.map