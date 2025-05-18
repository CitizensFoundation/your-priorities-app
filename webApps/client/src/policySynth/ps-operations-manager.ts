import { PropertyValueMap, css, html, nothing } from "lit";
import { property, customElement, query, state } from "lit/decorators.js";

import "@material/web/iconbutton/icon-button.js";
import "@material/web/progress/linear-progress.js";
import "@material/web/tabs/tabs.js";
import "@material/web/tabs/secondary-tab.js";
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/iconbutton/outlined-icon-button.js";
import "@material/web/button/filled-tonal-button.js";
import "@vaadin/grid";
import "@vaadin/grid/vaadin-grid-sort-column.js";

import { MdOutlinedTextField } from "@material/web/textfield/outlined-text-field.js";
import { MdTabs } from "@material/web/tabs/tabs.js";

import "./ps-operations-view.js";
import "./PsServerApi.js";
import { PsServerApi } from "./PsServerApi.js";

import "./ps-edit-node-dialog.js";
import "./ps-add-agent-dialog.js";
import "./ps-add-connector-dialog.js";

import { PsOperationsView } from "./ps-operations-view.js";
import {
  PsAiModelSize,
  PsAiModelType,
} from "@policysynth/agents/aiModelTypes.js";
import { PsBaseWithRunningAgentObserver } from "./ps-base-with-running-agents.js";
import { PsAppGlobals } from "./PsAppGlobals.js";
import { YpFormattingHelpers } from "../common/YpFormattingHelpers.js";
import { YpMediaHelpers } from "../common/YpMediaHelpers.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";

@customElement("ps-operations-manager")
export class PsOperationsManager extends PsBaseWithRunningAgentObserver {
  @property({ type: Number })
  currentAgentId: number | undefined = 1;

  @property({ type: Number })
  totalCosts: number | undefined;

  @property({ type: Object })
  currentAgent: PsAgentAttributes | undefined;

  @property({ type: Boolean })
  isFetchingAgent = false;

  @property({ type: Boolean })
  minimizeWorkflow = false;

  @property({ type: Object })
  nodeToEditInfo: PsAgentAttributes | PsAgentConnectorAttributes | undefined;

  @property({ type: Number })
  activeTabIndex = 0;

  @property({ type: Boolean })
  showEditNodeDialog = false;

  @property({ type: Boolean })
  showAddAgentDialog = false;

  @property({ type: Boolean })
  showAddConnectorDialog = false;

  @property({ type: Number })
  selectedAgentIdForConnector: number | null = null;

  @property({ type: String })
  selectedInputOutputType: string | null = null;

  @query("ps-operations-view")
  agentElement!: PsOperationsView;

  @property({ type: Number })
  groupId!: number;

  @property({ type: Object })
  group!: YpGroupData;

  @state()
  detailedCosts: PsDetailedAgentCostResults[] = [];

  private activeAiModels: PsAiModelAttributes[] = [];

  api: PsServerApi;

  constructor() {
    super();
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

      this.updateConnectorRegistry(agent);
    } catch (error) {
      console.error("Error fetching agent:", error);
    } finally {
      this.isFetchingAgent = false;
    }
  }

  private updateConnectorRegistry(agent: PsAgentAttributes) {
    const processConnectors = (
      connectors: PsAgentConnectorAttributes[] | undefined
    ) => {
      connectors?.forEach((connector) => {
        window.psAppGlobals.activeConnectorsInstanceRegistry.set(
          connector.id,
          connector
        );
      });
    };

    processConnectors(agent.InputConnectors);
    processConnectors(agent.OutputConnectors);

    agent.SubAgents?.forEach((subAgent) => {
      processConnectors(subAgent.InputConnectors);
      processConnectors(subAgent.OutputConnectors);
    });
  }

  override async connectedCallback() {
    super.connectedCallback();
    this.getAgent();

    this.addEventListener(
      "edit-node",
      this.openEditNodeDialog as EventListenerOrEventListenerObject
    );
    this.addEventListener(
      "add-connector",
      this.openAddConnectorDialog as EventListenerOrEventListenerObject
    );
    this.addEventListener(
      "add-existing-connector",
      this.addExistingConnector as any
    );
    this.addEventListener(
      "get-costs",
      this.fetchAgentCosts as EventListenerOrEventListenerObject
    );
    this.addEventListener(
      "add-agent",
      this.openAddAgentDialog as EventListenerOrEventListenerObject
    );
  }

  override async disconnectedCallback() {
    super.disconnectedCallback();
    this.removeListener("edit-node", this.openEditNodeDialog);
    this.removeListener("add-connector", this.openAddConnectorDialog);
    this.removeListener("add-existing-connector", this.addExistingConnector);
    this.removeListener("get-costs", this.fetchAgentCosts);
    this.removeListener("add-agent", this.openAddAgentDialog);
  }

  async addExistingConnector(event: CustomEvent) {
    const { connectorId, agentId, type } = event.detail;
    try {
      await this.api.addExistingConnector(
        this.groupId,
        agentId,
        connectorId,
        type
      );
      this.getAgent();
    } catch (error) {
      console.error("Error adding existing connector:", error);
    }
  }

  async fetchAgentCosts() {
    if (this.currentAgentId) {
      try {
        this.totalCosts = await this.api.getAgentCosts(
          this.groupId,
          this.currentAgentId
        );
      } catch (error) {
        console.error("Error fetching agent costs:", error);
      }
    }
  }

  // Add this method to fetch and set active AI models
  async fetchActiveAiModels() {
    try {
      this.activeAiModels = await this.api.getActiveAiModels(this.groupId);
    } catch (error) {
      console.error("Error fetching active AI models:", error);
    }
  }

  async handleEditDialogSave(event: CustomEvent) {
    const { updatedConfig } = event.detail;
    const aiModelUpdates = event.detail.aiModelUpdates as {
      size: PsAiModelSize;
      modelId: number | null;
      type: PsAiModelType | null;
    }[];
    const isInputConnector = event.detail.connectorType === "input";

    if (!this.nodeToEditInfo) return;

    try {
      const nodeType =
        "Class" in this.nodeToEditInfo &&
        (this.nodeToEditInfo as PsAgentAttributes).parent_agent_id
          ? "agent"
          : "connector";
      const nodeId = this.nodeToEditInfo.id;

      await this.api.updateNodeConfiguration(
        this.groupId,
        nodeType,
        nodeId,
        updatedConfig
      );

      // Handle AI model updates for agents
      if (nodeType === "agent" && aiModelUpdates && aiModelUpdates.length > 0) {
        const currentAiModels = await this.api.getAgentAiModels(
          this.groupId,
          nodeId
        );

        const existingAttachments = currentAiModels.map((m) => ({
          size: m.configuration.modelSize as PsAiModelSize,
          type: m.configuration.type as PsAiModelType,
          id: m.id,
        }));

        // Only process updates if aiModelUpdates contains actual changes
        if (aiModelUpdates.some((update) => update.modelId !== undefined)) {
          // Build array of desired attachments (unchanged)
          const desiredAttachments = aiModelUpdates
            .filter((u) => u.modelId !== null)
            .map((u) => ({
              size: u.size,
              type: u.type as PsAiModelType,
              id: Number(u.modelId),
            }));

          // Rest of the comparison and update logic...
          const toRemove = existingAttachments.filter(
            (oldItem) =>
              !desiredAttachments.some(
                (newItem) =>
                  newItem.size === oldItem.size &&
                  newItem.type === oldItem.type &&
                  newItem.id === oldItem.id
              )
          );

          // 4) Figure out which attachments to ADD
          //    - Those that are desired, but are not in the old array
          const toAdd = desiredAttachments.filter(
            (newItem) =>
              !existingAttachments.some(
                (oldItem) =>
                  newItem.size === oldItem.size &&
                  newItem.type === oldItem.type &&
                  newItem.id === oldItem.id
              )
          );

          // 5) Remove the old attachments that are no longer needed
          for (const item of toRemove) {
            await this.api.removeAgentAiModel(this.groupId, nodeId, item.id);
          }

          // 6) Add the new attachments that are missing
          for (const item of toAdd) {
            await this.api.addAgentAiModel(
              this.groupId,
              nodeId,
              item.id,
              item.size
            );
          }
        }
      }

      // Update the local state
      if (nodeType === "agent") {
        this.currentAgent = {
          ...this.currentAgent!,
          configuration: {
            ...this.currentAgent!.configuration,
            ...updatedConfig,
          },
        };

        // Update AI models in local state
        if (aiModelUpdates) {
          const updatedAiModels = this.currentAgent!.AiModels!.filter(
            (model) =>
              !aiModelUpdates.some(
                (update: { size: PsAiModelSize; modelId: number | null }) =>
                  update.size === model.configuration.modelSize
              )
          );

          for (const update of aiModelUpdates) {
            if (update.modelId !== null) {
              const newModel = this.activeAiModels.find(
                (m) => m.id === update.modelId
              );
              if (newModel) {
                updatedAiModels.push(newModel);
              }
            }
          }

          this.currentAgent = {
            ...this.currentAgent!,
            AiModels: updatedAiModels,
          };
        }
      } else {
        // Update connector (unchanged from your original code)
        if (isInputConnector) {
          const updatedInputConnectors =
            this.currentAgent!.InputConnectors!.map((connector) =>
              connector.id === nodeId
                ? {
                    ...connector,
                    configuration: {
                      ...connector.configuration,
                      ...updatedConfig,
                    },
                  }
                : connector
            );
          this.currentAgent = {
            ...this.currentAgent!,
            InputConnectors: updatedInputConnectors,
          };
        } else {
          const updatedOutputConnectors =
            this.currentAgent!.OutputConnectors!.map((connector) =>
              connector.id === nodeId
                ? {
                    ...connector,
                    configuration: {
                      ...connector.configuration,
                      ...updatedConfig,
                    },
                  }
                : connector
            );
          this.currentAgent = {
            ...this.currentAgent!,
            OutputConnectors: updatedOutputConnectors,
          };
        }
      }

      this.requestUpdate();
      this.showEditNodeDialog = false;

      //TODO: Only get the node that was updated not everything
      await this.getAgent();
    } catch (error) {
      console.error("Failed to update node configuration:", error);
      // You might want to show an error message to the user here
    }
  }

  openEditNodeDialog(event: CustomEvent) {
    this.nodeToEditInfo = event.detail.element;
    this.showEditNodeDialog = true;
  }

  openAddConnectorDialog(event: CustomEvent) {
    this.selectedAgentIdForConnector = event.detail.agentId;
    this.selectedInputOutputType = event.detail.type;
    this.showAddConnectorDialog = true;
  }

  openAddAgentDialog(event: CustomEvent) {
    this.showAddAgentDialog = true;
  }

  override firstUpdated() {
    this.fetchAgentCosts();
  }

  randomizeTheme() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    this.fire("yp-theme-color", `#${randomColor}`);
  }

  renderTotalCosts() {
    return html`${this.t("Costs")}
    ${this.totalCosts !== undefined ? `($${this.totalCosts.toFixed(2)})` : ""}`;
  }

  async getDetailedAgentCosts() {
    if (this.currentAgentId) {
      try {
        this.detailedCosts = await this.api.getDetailedAgentCosts(
          this.groupId,
          this.currentAgentId
        );
        this.requestUpdate();
      } catch (error) {
        console.error("Error fetching detailed agent costs:", error);
      }
    }
  }

  renderDetailedCostsTab() {
    return html`
      <vaadin-grid .items="${this.detailedCosts}">
        <vaadin-grid-sort-column
          hidden
          path="createdAt"
          header="${this.t("Date")}"
        ></vaadin-grid-sort-column>
        <vaadin-grid-sort-column
          path="agentName"
          header="${this.t("Agent")}"
        ></vaadin-grid-sort-column>
        <vaadin-grid-sort-column
          path="aiModelName"
          header="${this.t("AI Model")}"
          auto-width
        ></vaadin-grid-sort-column>
        <vaadin-grid-sort-column
          path="tokenInCount"
          header="${this.t("Tokens In")}"
          .renderer="${(
            root: HTMLElement,
            _column: unknown,
            rowData: { item: PsDetailedAgentCostResults }
          ): void => {
            root.textContent = `${YpFormattingHelpers.number(
              rowData.item.tokenInCount
            )}`;
          }}"
        ></vaadin-grid-sort-column>
        <vaadin-grid-sort-column
          path="tokenOutCount"
          header="${this.t("Tokens Out")}"
          .renderer="${(
            root: HTMLElement,
            _column: unknown,
            rowData: { item: PsDetailedAgentCostResults }
          ): void => {
            root.textContent = `${YpFormattingHelpers.number(
              rowData.item.tokenOutCount
            )}`;
          }}"
        ></vaadin-grid-sort-column>
        <vaadin-grid-sort-column
          path="longContextIn"
          header="${this.t("Long Context In")}"
          .renderer="${(
            root: HTMLElement,
            _column: unknown,
            rowData: { item: PsDetailedAgentCostResults }
          ): void => {
            root.textContent = `${YpFormattingHelpers.number(
              rowData.item.longContextTokenInCount || 0
            )}`;
          }}"
        ></vaadin-grid-sort-column>
        <vaadin-grid-sort-column
          path="longContextIn"
          header="${this.t("Long Context Out")}"
          .renderer="${(
            root: HTMLElement,
            _column: unknown,
            rowData: { item: PsDetailedAgentCostResults }
          ): void => {
            root.textContent = `${YpFormattingHelpers.number(
              rowData.item.longContextTokenOutCount || 0
            )}`;
          }}"
        ></vaadin-grid-sort-column>
        <vaadin-grid-sort-column
          path="cachedContextIn"
          header="${this.t("Cached Context In")}"
          .renderer="${(
            root: HTMLElement,
            _column: unknown,
            rowData: { item: PsDetailedAgentCostResults }
          ): void => {
            root.textContent = `${YpFormattingHelpers.number(
              rowData.item.tokenInCachedContextCount || 0
            )}`;
          }}"
        ></vaadin-grid-sort-column>
        <vaadin-grid-sort-column
          path="costIn"
          header="${this.t("Cost In")}"
          .renderer="${(
            root: HTMLElement,
            _column: unknown,
            rowData: { item: PsDetailedAgentCostResults }
          ): void => {
            root.textContent = `$${rowData.item.costIn.toFixed(4)}`;
          }}"
        >
        </vaadin-grid-sort-column>
        <vaadin-grid-sort-column
          path="costOut"
          header="${this.t("Cost Out")}"
          .renderer="${(
            root: HTMLElement,
            _column: unknown,
            rowData: { item: PsDetailedAgentCostResults }
          ): void => {
            root.textContent = `$${rowData.item.costOut.toFixed(4)}`;
          }}"
        >
        </vaadin-grid-sort-column>
        <vaadin-grid-sort-column
          path="totalCost"
          header="${this.t("Total Cost")}"
          .renderer="${(
            root: HTMLElement,
            _column: unknown,
            rowData: { item: PsDetailedAgentCostResults }
          ): void => {
            root.textContent = `$${rowData.item.totalCost.toFixed(4)}`;
          }}"
        >
        </vaadin-grid-sort-column>

      </vaadin-grid>
    `;
  }

  tabChanged() {
    this.activeTabIndex = (this.$$("#tabBar") as MdTabs).activeTabIndex;
    if (this.activeTabIndex === 1) {
      this.getDetailedAgentCosts();
    }
  }

  renderHeader() {
    return html`
      <div class="layout horizontal agentHeader">
        <img
          hidden
          src="${YpMediaHelpers.getImageFormatUrl(
            this.group.GroupLogoImages,
            0
          )}"
          class="agentHeaderImage"
        />
        <div class="layout vertical agentHeaderText">
          <div class="workflowName">${this.t("workflow")}</div>
          <div class="">${this.group.name}</div>
        </div>
      </div>
    `;
  }

  override render() {
    if (this.isFetchingAgent) {
      return html`<md-linear-progress indeterminate></md-linear-progress>`;
    } else {
      return html`
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
          .parentAgentId="${this.currentAgent?.id || -1}"
          .groupId="${this.groupId}"
        ></ps-add-agent-dialog>

        <ps-add-connector-dialog
          ?open="${this.showAddConnectorDialog}"
          .groupId="${this.groupId}"
          @connector-added="${this.getAgent}"
          .selectedAgentId="${this.selectedAgentIdForConnector}"
          .selectedInputOutputType="${this.selectedInputOutputType as "input" | "output" | null}"
          @close="${() => (this.showAddConnectorDialog = false)}"
        ></ps-add-connector-dialog>

        <div class="layout vertical" ?hidden="${this.minimizeWorkflow}">
          <div class="layout horizontal self-start tabsContainer">
            ${this.renderHeader()}

            <md-tabs id="tabBar" @change="${this.tabChanged}">
              <md-secondary-tab
                id="configure-tab"
                ?has-static-theme="${this.hasStaticTheme}"
                aria-controls="configure-panel"
              >
                <md-icon slot="icon">support_agent</md-icon>
                ${this.t("workflow")}
              </md-secondary-tab>
              <md-secondary-tab
                id="costs-tab"
                ?has-static-theme="${this.hasStaticTheme}"
                aria-controls="costs-panel"
              >
                <md-icon slot="icon">account_balance</md-icon>
                ${this.renderTotalCosts()}
              </md-secondary-tab>
              <md-secondary-tab
                id="crt-tab"
                ?has-static-theme="${this.hasStaticTheme}"
                aria-controls="crt-panel"
              >
                <md-icon slot="icon">checklist</md-icon>
                ${this.t("Audit Log")}
              </md-secondary-tab>
            </md-tabs>
            <div class="flex"></div>
            <md-filled-tonal-icon-button
              @click="${this._openAnalyticsAndPromotions}"
              title="${this.t("analyticsAndPromotions")}"
              ><md-icon>monitoring</md-icon>
            </md-filled-tonal-icon-button>
            <md-filled-tonal-icon-button
              class="configIconButton"
              @click="${this.openConfig}"
              title="${this.t("openGroupMenu")}"
              ><md-icon>settings</md-icon>
            </md-filled-tonal-icon-button>
          </div>
        </div>
        <md-divider></md-divider>
        ${this.activeTabIndex === 0
          ? html`
              <ps-operations-view
                .minimizeWorkflow="${this.minimizeWorkflow}"
                .currentAgent="${this.currentAgent!}"
                .groupId="${this.groupId}"
                .group="${this.group}"
              ></ps-operations-view>
            `
          : ""}
        ${this.activeTabIndex === 2
          ? html` <!-- Render Audit Log tab content here --> `
          : ""}
        ${this.activeTabIndex === 1 ? this.renderDetailedCostsTab() : ""}
        ${this.minimizeWorkflow ? "" : this.renderThemeToggle()}
      `;
    }
  }

  openConfig() {
    YpNavHelpers.redirectTo(`/admin/group/${this.groupId}`);
  }

  _openAnalyticsAndPromotions() {
    YpNavHelpers.redirectTo(`/analytics/group/${this.groupId}`);
  }

  static override get styles() {
    return [
      super.styles,
      css`
        .agentHeaderImage {
          max-width: 72px;
          align-self: self-start;
          border-radius: 4px;
          margin-top: 8px;
        }

        .workflowName {
          font-size: 14px;
          font-weight: 400;
          color: var(--md-sys-color-tertiary);
          text-transform: uppercase;
        }

        md-filled-tonal-icon-button {
          margin-right: 24px;
        }

        .configIconButton {
          margin-right: 64px;
        }

        md-filled-tonal-icon-button {
          --md-filled-tonal-icon-button-container-color: var(
            --md-sys-color-surface-container-low
          );
          --md-sys-color-on-secondary-container: var(--md-sys-color-on-surface);
        }

        .agentHeaderText {
          align-self: self-start;
          font-size: 22px;
          font-weight: 700;
          margin-top: 16px;
          margin-left: 24px;
          margin-right: 24px;
          font-family: var(--md-ref-typeface-brand);
        }

        .agentHeader {
          width: 560px;
        }

        .tabsContainer {
          background-color: var(--md-sys-color-surface);
          width: 100vw;
          padding: 0;
          margin: 0;
          padding-top: 16px;
          padding-bottom: 16px;
          margin-top: 12px;
        }

        md-tabs {
          align-self: flex-start;
          align-items: flex-start;
          max-width: 600px;
          background-color: var(--md-sys-color-surface);
          --md-divider-thickness: 0px;
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
          margin-top: 12px;
          margin-right: 16px;
        }

        md-secondary-tab[has-static-theme] {
          --md-secondary-tab-active-indicator-color: var(
            --md-sys-color-primary-container
          );
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
          width: 100vw;
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

        vaadin-grid {
          background-color: var(--md-sys-color-surface);
          color: var(--md-sys-color-on-surface);
          font-family: var(--md-sys-typescale-body-medium-font-family-name);
          font-size: var(--md-sys-typescale-body-medium-font-size);
          font-weight: var(--md-sys-typescale-body-medium-font-weight);
          line-height: var(--md-sys-typescale-body-medium-line-height);
        }

        vaadin-grid::part(header-cell) {
          background-color: var(--md-sys-color-surface-container);
          color: var(--md-sys-color-on-surface-variant);
          font-weight: var(--md-sys-typescale-title-small-font-weight);
        }

        vaadin-grid::part(cell) {
          color: var(--md-sys-color-on-surface-container);
        }

        vaadin-grid::part(body-cell) {
          background-color: var(--md-sys-color-surface-container-lowest);
          border-bottom: 1px solid var(--md-sys-color-outline-variant);
        }

        vaadin-grid::part(row) {
          background-color: var(--md-sys-color-surface-container-lowest);
          color: var(--md-sys-color-on-surface);
        }

        vaadin-grid::part(row):nth-child(even) {
          background-color: var(--md-sys-color-surface-variant);
        }

        vaadin-grid::part(row:hover) {
          background-color: var(--md-sys-color-surface-container-highest);
        }

        vaadin-grid::part(selected-row) {
          background-color: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
        }

        /* Ensure proper spacing and alignment */
        vaadin-grid-cell-content {
          padding: 12px 16px;
        }

        /* Style for the sort indicators */
        vaadin-grid-sorter {
          color: var(--md-sys-color-on-surface-variant);
        }

        vaadin-grid-sorter[direction] {
          color: var(--md-sys-color-primary);
        }

        /* Adjust these values as needed for your specific layout */
        vaadin-grid {
          height: 400px;
          margin-top: 16px;
          margin-bottom: 16px;
        }

        @media (max-width: 600px) {
          .agentHeader {
            width: 100%;
          }
        }
      `,
    ];
  }
}
