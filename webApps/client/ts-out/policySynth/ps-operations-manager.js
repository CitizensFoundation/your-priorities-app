var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html } from "lit";
import { property, customElement, query } from "lit/decorators.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/progress/linear-progress.js";
import "@material/web/tabs/tabs.js";
import "@material/web/tabs/primary-tab.js";
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/iconbutton/outlined-icon-button.js";
import "@material/web/button/filled-tonal-button.js";
import "./ps-operations-view.js";
import "./PsServerApi.js";
import { PsServerApi } from "./PsServerApi.js";
import "./ps-edit-node-dialog.js";
import "./ps-add-agent-dialog.js";
import "./ps-add-connector-dialog.js";
import { PsBaseWithRunningAgentObserver } from "./ps-base-with-running-agents.js";
import { PsAppGlobals } from "./PsAppGlobals.js";
let PsOperationsManager = class PsOperationsManager extends PsBaseWithRunningAgentObserver {
    constructor() {
        super();
        this.currentAgentId = 1;
        this.isFetchingAgent = false;
        this.activeTabIndex = 0;
        this.showEditNodeDialog = false;
        this.showAddAgentDialog = false;
        this.showAddConnectorDialog = false;
        this.selectedAgentIdForConnector = null;
        this.selectedInputOutputType = null;
        this.groupId = 30995; //!: number;
        this.activeAiModels = [];
        this.api = new PsServerApi();
        window.psAppGlobals = new PsAppGlobals(this.api);
    }
    async getAgent() {
        this.isFetchingAgent = true;
        try {
            if (!this.groupId) {
                throw new Error("Current group ID is not set");
            }
            const agent = await this.api.getAgent(this.groupId);
            this.currentAgent = agent;
            this.currentAgentId = agent.id;
        }
        catch (error) {
            console.error("Error fetching agent:", error);
        }
        finally {
            this.isFetchingAgent = false;
        }
    }
    async connectedCallback() {
        super.connectedCallback();
        this.getAgent();
        this.addEventListener("edit-node", this.openEditNodeDialog);
        this.addEventListener("add-connector", this.openAddConnectorDialog);
        this.addEventListener("get-costs", this.fetchAgentCosts);
        this.addEventListener("add-agent", this.openAddAgentDialog);
    }
    async fetchAgentCosts() {
        if (this.currentAgentId) {
            try {
                this.totalCosts = await this.api.getAgentCosts(this.groupId, this.currentAgentId);
            }
            catch (error) {
                console.error("Error fetching agent costs:", error);
            }
        }
    }
    // Add this method to fetch and set active AI models
    async fetchActiveAiModels() {
        try {
            this.activeAiModels = await this.api.getActiveAiModels(this.groupId);
        }
        catch (error) {
            console.error("Error fetching active AI models:", error);
        }
    }
    async handleEditDialogSave(event) {
        const { updatedConfig, aiModelUpdates } = event.detail;
        const isInputConnector = event.detail.connectorType === "input";
        if (!this.nodeToEditInfo)
            return;
        try {
            const nodeType = "Class" in this.nodeToEditInfo &&
                this.nodeToEditInfo.Class?.name.toLowerCase().includes("agent")
                ? "agent"
                : "connector";
            const nodeId = this.nodeToEditInfo.id;
            await this.api.updateNodeConfiguration(this.groupId, nodeType, nodeId, updatedConfig);
            // Handle AI model updates for agents
            if (nodeType === "agent" && aiModelUpdates) {
                const currentAiModels = await this.api.getAgentAiModels(this.groupId, nodeId);
                for (const update of aiModelUpdates) {
                    const currentModel = currentAiModels.find((m) => m.configuration.modelSize === update.size);
                    if (currentModel && update.modelId === null) {
                        await this.api.removeAgentAiModel(this.groupId, nodeId, currentModel.id);
                    }
                    else if (update.modelId !== null &&
                        currentModel?.id !== update.modelId) {
                        if (currentModel) {
                            await this.api.removeAgentAiModel(this.groupId, nodeId, currentModel.id);
                        }
                        await this.api.addAgentAiModel(this.groupId, nodeId, update.modelId, update.size);
                    }
                }
            }
            // Update the local state
            if (nodeType === "agent") {
                this.currentAgent = {
                    ...this.currentAgent,
                    configuration: {
                        ...this.currentAgent.configuration,
                        ...updatedConfig,
                    },
                };
                // Update AI models in local state
                if (aiModelUpdates) {
                    const updatedAiModels = this.currentAgent.AiModels.filter((model) => !aiModelUpdates.some((update) => update.size === model.configuration.modelSize));
                    for (const update of aiModelUpdates) {
                        if (update.modelId !== null) {
                            const newModel = this.activeAiModels.find((m) => m.id === update.modelId);
                            if (newModel) {
                                updatedAiModels.push(newModel);
                            }
                        }
                    }
                    this.currentAgent = {
                        ...this.currentAgent,
                        AiModels: updatedAiModels,
                    };
                }
            }
            else {
                // Update connector (unchanged from your original code)
                if (isInputConnector) {
                    const updatedInputConnectors = this.currentAgent.InputConnectors.map((connector) => connector.id === nodeId
                        ? {
                            ...connector,
                            configuration: {
                                ...connector.configuration,
                                ...updatedConfig,
                            },
                        }
                        : connector);
                    this.currentAgent = {
                        ...this.currentAgent,
                        InputConnectors: updatedInputConnectors,
                    };
                }
                else {
                    const updatedOutputConnectors = this.currentAgent.OutputConnectors.map((connector) => connector.id === nodeId
                        ? {
                            ...connector,
                            configuration: {
                                ...connector.configuration,
                                ...updatedConfig,
                            },
                        }
                        : connector);
                    this.currentAgent = {
                        ...this.currentAgent,
                        OutputConnectors: updatedOutputConnectors,
                    };
                }
            }
            this.requestUpdate();
            this.showEditNodeDialog = false;
        }
        catch (error) {
            console.error("Failed to update node configuration:", error);
            // You might want to show an error message to the user here
        }
    }
    openEditNodeDialog(event) {
        this.nodeToEditInfo = event.detail.element;
        this.showEditNodeDialog = true;
    }
    openAddConnectorDialog(event) {
        this.selectedAgentIdForConnector = event.detail.agentId;
        this.selectedInputOutputType = event.detail.type;
        this.showAddConnectorDialog = true;
    }
    openAddAgentDialog(event) {
        this.showAddAgentDialog = true;
    }
    tabChanged() {
        this.activeTabIndex = this.$$("#tabBar").activeTabIndex;
    }
    randomizeTheme() {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        this.fire("yp-theme-color", `#${randomColor}`);
    }
    renderTotalCosts() {
        return html `${this.t("Costs")}
    ${this.totalCosts !== undefined ? `($${this.totalCosts.toFixed(2)})` : ""}`;
    }
    render() {
        if (this.isFetchingAgent) {
            return html `<md-linear-progress indeterminate></md-linear-progress>`;
        }
        else {
            return html `
        <ps-edit-node-dialog
          ?open="${this.showEditNodeDialog}"
          .nodeToEditInfo="${this.nodeToEditInfo}"
          .groupId="${this.groupId}"
          @save="${this.handleEditDialogSave}"
          @close="${() => (this.showEditNodeDialog = false)}"
        ></ps-edit-node-dialog>

        <ps-add-agent-dialog
          ?open="${this.showAddAgentDialog}"
          @close="${() => (this.showAddAgentDialog = false)}"
          @agent-added="${this.getAgent}"
          .parentAgentId="${this.currentAgent?.id}"
          .groupId="${this.groupId}"
        ></ps-add-agent-dialog>

        <ps-add-connector-dialog
          ?open="${this.showAddConnectorDialog}"
          .groupId="${this.groupId}"
          @connector-added="${this.getAgent}"
          .selectedAgentId="${this.selectedAgentIdForConnector}"
          .selectedInputOutputType="${this.selectedInputOutputType}"
          @close="${() => (this.showAddConnectorDialog = false)}"
        ></ps-add-connector-dialog>

        <md-tabs id="tabBar" @change="${this.tabChanged}">
          <md-primary-tab id="configure-tab" aria-controls="configure-panel">
            <md-icon slot="icon">support_agent</md-icon>
            ${this.t("Agents Operations")}
          </md-primary-tab>
          <md-primary-tab id="crt-tab" aria-controls="crt-panel">
            <md-icon slot="icon">checklist</md-icon>
            ${this.t("Audit Log")}
          </md-primary-tab>
          <md-primary-tab id="crt-tab" aria-controls="crt-panel">
            <md-icon slot="icon">account_balance</md-icon>
            ${this.renderTotalCosts()}
          </md-primary-tab>
        </md-tabs>
        <ps-operations-view
          .currentAgent="${this.currentAgent}"
          .groupId="${this.groupId}"
        ></ps-operations-view>
        ${this.renderThemeToggle()}
      `;
        }
    }
    static get styles() {
        return [
            super.styles,
            css `
        md-tabs {
          margin-bottom: 64px;
        }
        md-filled-select {
          width: 100%;
          margin-bottom: 16px;
        }
        .nodeEditHeadlineImage {
          max-width: 100px;
          margin-right: 16px;
        }

        .nodeEditHeadlineTitle {
          display: flex;
          align-items: center;
          justify-content: center; /* This will also center the content horizontally */
          height: 55px; /* Make sure this element has a defined height */
        }

        .childEditing {
          color: var(--md-sys-color-on-surface-variant);
          background-color: var(--md-sys-color-surface-variant);
          padding: 16px;
          border-radius: 8px;
        }

        .childrenList {
          height: 100px;
          overflow-y: auto;
        }

        md-icon-button {
          margin-top: 32px;
        }

        .createOptionsButtons {
          display: flex;
          justify-content: center;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding-left: 8px;
          padding-right: 8px;
        }

        .deleteButton {
          --md-sys-color-primary: var(--md-sys-color-error);
        }

        md-circular-progress {
          margin-bottom: 6px;
        }

        md-filled-text-field,
        md-outlined-text-field {
          width: 600px;
          margin-bottom: 16px;
        }

        [type="textarea"] {
          min-height: 150px;
        }

        [type="textarea"][supporting-text] {
          min-height: 76px;
        }

        .formContainer {
          margin-top: 32px;
        }

        md-filled-button,
        md-outlined-button {
          margin-top: 8px;
          margin-left: 8px;
          margin-right: 8px;
          margin-bottom: 8px;
        }

        .aiConfigReview {
          margin-left: 8px;
          margin-right: 8px;
          padding: 16px;
          margin-top: 8px;
          margin-bottom: 8px;
          border-radius: 12px;
          max-width: 560px;
          font-size: 14px;
          background-color: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
        }

        .agentUDEDescription {
          font-size: 18px;
          margin: 32px;
          margin-bottom: 0;
          padding: 24px;
          border-radius: 12px;
          background-color: var(--md-sys-color-primary);
          color: var(--md-sys-color-on-primary);
        }

        md-tabs,
        agent-tab,
        configure-tab {
          width: 100%;
        }

        .themeToggle {
          margin-top: 32px;
        }

        ltp-chat-assistant {
          height: 100%;
          max-height: 100%;
          width: 100%;
          height: 100%;
        }

        md-linear-progress {
          width: 600px;
        }

        .darkModeButton {
          margin-right: 8px;
          margin-left: 8px;
        }

        .topDiv {
          margin-bottom: 256px;
        }

        md-outlined-select {
          z-index: 1500px;
          margin: 16px;
          margin-left: 0;
          max-width: 250px;
        }

        .automaticCreateButton {
          max-width: 300px;
        }

        [hidden] {
          display: none !important;
        }
      `,
        ];
    }
};
__decorate([
    property({ type: Number })
], PsOperationsManager.prototype, "currentAgentId", void 0);
__decorate([
    property({ type: Number })
], PsOperationsManager.prototype, "totalCosts", void 0);
__decorate([
    property({ type: Object })
], PsOperationsManager.prototype, "currentAgent", void 0);
__decorate([
    property({ type: Boolean })
], PsOperationsManager.prototype, "isFetchingAgent", void 0);
__decorate([
    property({ type: Object })
], PsOperationsManager.prototype, "nodeToEditInfo", void 0);
__decorate([
    property({ type: Number })
], PsOperationsManager.prototype, "activeTabIndex", void 0);
__decorate([
    property({ type: Boolean })
], PsOperationsManager.prototype, "showEditNodeDialog", void 0);
__decorate([
    property({ type: Boolean })
], PsOperationsManager.prototype, "showAddAgentDialog", void 0);
__decorate([
    property({ type: Boolean })
], PsOperationsManager.prototype, "showAddConnectorDialog", void 0);
__decorate([
    property({ type: Number })
], PsOperationsManager.prototype, "selectedAgentIdForConnector", void 0);
__decorate([
    property({ type: String })
], PsOperationsManager.prototype, "selectedInputOutputType", void 0);
__decorate([
    query("ps-operations-view")
], PsOperationsManager.prototype, "agentElement", void 0);
__decorate([
    property({ type: Number })
], PsOperationsManager.prototype, "groupId", void 0);
PsOperationsManager = __decorate([
    customElement("ps-operations-manager")
], PsOperationsManager);
export { PsOperationsManager };
//# sourceMappingURL=ps-operations-manager.js.map