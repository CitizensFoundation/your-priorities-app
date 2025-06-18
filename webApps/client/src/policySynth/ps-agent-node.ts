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
import { MdMenu } from "@material/web/menu/menu.js";
import { MdDialog } from "@material/web/dialog/dialog.js";
import { YpConfirmationDialog } from "../yp-dialog-container/yp-confirmation-dialog.js";

@customElement("ps-agent-node")
export class PsAgentNode extends PsOperationsBaseNode {
  @property({ type: Object })
  agent!: PsAgentAttributes;

  @property({ type: Number })
  agentId!: number;

  @property({ type: Boolean, reflect: true })
  override hasStaticTheme!: boolean;

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

  @query("#fileInput")
  fileInput!: HTMLInputElement;

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

  private getSafeFileName(name: string): string {
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
      } else {
        console.error("No memory available to save");
      }
    } catch (error) {
      console.error("Error saving agent memory:", error);
    }
  }

  triggerFileInput() {
    this.fileInput.click();
  }

  handleFileSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = JSON.parse(e.target?.result as string);
          this.confirmLoadMemory(content);
        } catch (error) {
          console.error("Error parsing JSON file:", error);
        }
      };
      reader.readAsText(file);
    }
  }

  confirmLoadMemory(content: any) {
    window.appDialogs.getDialogAsync(
      "confirmationDialog",
      (dialog: YpConfirmationDialog) => {
        dialog.open(
          this.t("confirmLoadAndOverrideMemory"),
          () =>
            this.loadMemoryFromContent(content),
          true,
          true
        );
      }
    );
  }

  async loadMemoryFromContent(content: any) {
    try {
      await this.api.replaceAgentMemory(this.groupId, this.agent.id, content);
      this.agentMemory = content;
      this.requestUpdate();
    } catch (error) {
      console.error("Error loading agent memory:", error);
    }
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

  addExistingConnector(connectorId: number, type: "input" | "output") {
    this.fire("add-existing-connector", {
      agentId: this.agent.id,
      connectorId,
      type,
    });
  }

  confirmDeleteAgent() {
    window.appDialogs.getDialogAsync(
      "confirmationDialog",
      (dialog: YpConfirmationDialog) => {
        dialog.open(
          this.t("confirmDeleteFromWorkflow"),
          () => this.deleteAgent(),
          true,
          true
        );
      }
    );
  }

  async deleteAgent() {
    try {
      await this.api.deleteAgent(this.groupId, this.agent.id);
      this.dispatchEvent(
        new CustomEvent("agent-deleted", { detail: { agentId: this.agent.id } })
      );
    } catch (error) {
      console.error("Error deleting agent:", error);
    }
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
    if (window.psAppGlobals.activeConnectorsInstanceRegistry) {
      const allConnectors = Array.from(
        window.psAppGlobals.activeConnectorsInstanceRegistry.values()
      );
      const currentConnectorIds = new Set([
        ...(this.agent.InputConnectors?.map((c) => c.id) || []),
        ...(this.agent.OutputConnectors?.map((c) => c.id) || []),
      ]);
      const availableConnectors = allConnectors.filter(
        (c) => !currentConnectorIds.has(c.id)
      );

      return html`
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
            ? html`
                <md-divider></md-divider>
                <md-sub-menu positioning="popover">
                  <md-menu-item slot="item">
                    <div slot="headline">Add Existing Connector</div>
                    <md-icon slot="end">arrow_right</md-icon>
                  </md-menu-item>
                  <md-menu slot="menu" positioning="popover">
                    ${availableConnectors.map(
                      (connector) => html`
                        <md-sub-menu>
                          <md-menu-item slot="item">
                            <div slot="headline">
                              ${connector.configuration.name}
                            </div>
                            <md-icon slot="end">arrow_right</md-icon>
                          </md-menu-item>
                          <md-menu slot="menu" positioning="popover">
                            <md-menu-item
                              @click="${() =>
                                this.addExistingConnector(
                                  connector.id,
                                  "input"
                                )}"
                            >
                              <div slot="headline">Add as Input</div>
                            </md-menu-item>
                            <md-menu-item
                              @click="${() =>
                                this.addExistingConnector(
                                  connector.id,
                                  "output"
                                )}"
                            >
                              <div slot="headline">Add as Output</div>
                            </md-menu-item>
                          </md-menu>
                        </md-sub-menu>
                      `
                    )}
                  </md-menu>
                </md-sub-menu>
              `
            : ""}
        </md-menu>
      `;
    } else {
      console.warn("activeConnectorsInstanceRegistry is not available");
      return nothing;
    }
  }

  renderMainMenu() {
    return html` <md-icon-button
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
        <md-divider></md-divider>
        <md-menu-item class="deleteMenuItem" @click="${this.confirmDeleteAgent}">
          <div slot="headline">${this.t("deleteFromWorkflow")}</div>
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

  override render() {
    if (!this.agent) return nothing;

    return html`
      <div class="mainContainer" ?has-static-theme=${this.hasStaticTheme}>
        <img
          class="image"
          ?has-static-theme=${this.hasStaticTheme}
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

  static override get styles() {
    return [
      super.styles,
      css`
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

        .deleteMenuItem {
          color: var(--md-sys-color-error);
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

        .image[has-static-theme] {
          border-radius: 4px;
        }


        .mainContainer[has-static-theme] {
          border-radius: 4px;
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
          color: var(--md-sys-color-tertiary);
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
          margin-top: 2px;
          border-radius: 16px;
          flex-grow: 1;
          color: var(--md-sys-color-on-surface-variant);
          overflow: hidden;
          text-overflow: ellipsis;
          height: 65px;
          max-height: 65px;
          max-width: 180px;
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
