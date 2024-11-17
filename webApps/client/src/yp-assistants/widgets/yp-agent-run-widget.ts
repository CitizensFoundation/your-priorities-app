import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { YpBaseElement } from "../../common/yp-base-element.js";
import { PsServerApi } from "../../policySynth/PsServerApi.js";

// Assuming we have an API client

@customElement("yp-agent-run-widget")
export class YpAgentRunWidget extends YpBaseElement {
  @property({ type: Number })
  agentProductId!: number;

  @property({ type: Number })
  runId!: number;

  @property({ type: Number })
  agentId!: number;

  @property({ type: String })
  wsClientId!: string;

  @property({ type: Number })
  topLevelWorkflowGroupId!: number;

  @property({ type: String })
  agentName = "";

  @property({ type: String })
  agentDescription = "";

  @property({ type: String })
  agentImageUrl = "";

  @property({ type: String })
  workflowStatus = "ready";

  @state()
  private agentState: "running" | "paused" | "stopped" | "error" | "completed" =
    "stopped";

  @state()
  private latestMessage: string = "";

  @state()
  private progress: number | undefined;

  private statusInterval: number | undefined;

  @property({ type: String })
  workflow!: string;

  @property({ type: Number })
  maxRunsPerCycle!: number;

  private api: PsServerApi;

  constructor() {
    super();
    this.api = new PsServerApi();
    const workflow = this.parsedWorkflow;
    // Go through the workflow and set the this.agentId to the correct agent based on the workflow step
    if (
      workflow.steps[workflow.currentStepIndex] &&
      workflow.steps[workflow.currentStepIndex].agentId
    ) {
      this.agentId = workflow.steps[workflow.currentStepIndex].agentId!;
    } else {
      console.error("No agentId found in workflow");
    }
  }

  get parsedWorkflow(): YpWorkflowConfiguration {
    try {
      const decodedWorkflow = atob(this.workflow);
      return JSON.parse(decodedWorkflow);
    } catch (error) {
      console.error("Failed to decode or parse workflow:", error);
      return { currentStepIndex: 0, steps: [] };
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this.updateAgentStatus(); // Initial status check
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.stopStatusUpdates();
  }

  private startStatusUpdates() {
    this.statusInterval = window.setInterval(
      () => this.updateAgentStatus(),
      1000
    );
  }

  private stopStatusUpdates() {
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
      this.statusInterval = undefined;
    }
  }

  private async updateAgentStatus() {
    try {
      const status = await this.api.getAgentStatus(
        this.topLevelWorkflowGroupId,
        this.agentId
      );
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
          this.startStatusUpdates();
        }

        this.requestUpdate();
      }
    } catch (error) {
      console.error("Failed to get agent status:", error);
    }
  }

  private async startAgent() {
    try {
      await this.api.startWorkflowAgent(
        this.topLevelWorkflowGroupId,
        this.agentId,
        this.wsClientId
      );
      this.agentState = "running";
      this.startStatusUpdates();
      this.requestUpdate();
    } catch (error) {
      console.error("Failed to start agent:", error);
    }
  }

  private async stopAgent() {
    try {
      await this.api.stopAgent(this.topLevelWorkflowGroupId, this.agentId);
      this.agentState = "stopped";
      this.stopStatusUpdates();
      this.requestUpdate();
    } catch (error) {
      console.error("Failed to stop agent:", error);
    }
  }

  static override get styles() {
    return [
      super.styles,
      css`
        :host {
        }

        .container {
          padding: 16px;
          border: 1px solid var(--md-sys-color-outline-variant);
          border-radius: 4px;
          width: 100%;
          min-width: 700px;
        }

        .workflow-step {
          width: calc(241px - 20px);
          height: calc(158px - 24px);
          max-height: calc(86px - 24px);
          padding: 12px;
          border: 1px solid var(--md-sys-color-outline-variant);
          border-radius: 4px;
          margin-right: 24px;
          margin-top: 12px;
          margin-bottom: 12px;
        }

        .agent-header-title {
          font-size: 22px;
          font-weight: 700;
          color: var(--md-sys-color-on-surface);
          font-family: var(--md-ref-typeface-brand);
        }

        .startStopButtons {
          margin-top: 24px;
          margin-bottom: 16px;
        }

        md-outlined-button {
          --md-outlined-button-icon-size: 26px;
        }

        md-filled-button {
          --md-filled-button-icon-size: 26px;
        }

        .max-runs-per-cycle {
          font-size: 13px;
          color: var(--md-sys-color-tertiary);
          text-transform: uppercase;
          font-weight: 500;
          margin-top: 4px;
        }

        @media (max-width: 700px) {
          .container {
            min-width: 100%;
          }

          .workflow-step {
            margin: 8px;
          }
        }

        .step-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 31px;
          height: 31px;
          font-weight: 600;
          border-radius: 50%;
          font-size: 15px;
          flex-shrink: 0;
          transition: background-color 0.3s ease;
        }

        .step-number[isNotActive] {
          background-color: #eaeaea !important;
          color: var(--yp-sys-color-agent-black) !important;
        }

        .startButton {
          margin-right: 24px;
        }

        .startButton,
        .stopButton {
          width: 130px;
        }

        .startButtonFilled {
          --md-filled-button-disabled-container-color: var(
            --yp-sys-color-agent-green
          );
          --md-filled-button-disabled-label-text-color: #fff;
          --md-filled-button-disabled-container-opacity: 1;
          --md-filled-button-disabled-label-text-opacity: 1;
          --md-filled-button-disabled-icon-color: #fff;
          --md-filled-button-disabled-icon-opacity: 1;
          --md-sys-color-on-primary: #ffffff;
        }

        .step-content[notActive] {
          opacity: 0.5;
        }

        .step-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0px;
        }

        .step-title {
          font-size: 15px;
          font-family: var(--md-ref-typeface-brand);
          font-weight: 600;
          line-height: 22.68px;
          margin-top: 12px;
          margin-bottom: 0px;
        }

        .step-icon {
          width: 20px;
          height: 20px;
          color: var(--md-sys-color-outline);
          fill: currentColor;
        }

        .agent-running-status {
          margin-top: 16px;
        }

        .statusMessage {
          font-size: 11px;
          text-align: center;
          margin-top: 8px;
          border-radius: 16px;
          flex-grow: 1;
          color: var(--md-sys-color-on-surface-variant);
        }

        md-linear-progress {
          margin: 16px;
          margin-bottom: 8px;
          margin-top: 8px;
        }
      `,
    ];
  }

  private getStepClass(index: number): string {
    if (this.workflowStatus === "stopped" || this.workflowStatus === "ready") {
      return "";
    }
    if (index < this.parsedWorkflow.currentStepIndex) {
      return "step-completed";
    }
    if (index === this.parsedWorkflow.currentStepIndex) {
      return this.workflowStatus === "running" ? "step-active" : "";
    }
    return "step-disabled";
  }

  private renderStep(
    step: YpWorkflowStep,
    index: number,
    isSelected: boolean
  ) {
    const stepClass = this.getStepClass(index);

    const isActive = isSelected && this.workflowStatus !== "stopped";

    return html`
      <div class="workflow-step layout vertical">
        <div class="layout horizontal">
          <div
            class="step-number"
            ?isNotActive=${!isActive}
            style="
            background-color: ${step.stepBackgroundColor};
            color: ${step.stepTextColor}"
          >
            ${index + 1}
          </div>
          <div class="flex"></div>
          <div>
            ${step.type === "engagmentFromOutputConnector"
              ? this.renderIcon("users")
              : this.renderIcon("sparkles")}
          </div>
        </div>

        <div class="step-content" ?notActive=${!isActive}>
          <div class="step-header">
            <h3 class="step-title">${step.shortName}</h3>
          </div>
        </div>
      </div>
    `;
  }

  private renderIcon(type: "users" | "sparkles") {
    return type === "users"
      ? html`<svg
          class="step-icon"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.8918 10.9417C15.0335 11.7167 15.8335 12.7667 15.8335 14.1667V16.6667H19.1668V14.1667C19.1668 12.35 16.1918 11.275 13.8918 10.9417Z"
            fill="currentColor"
          />
          <path
            d="M12.5002 10C14.3418 10 15.8335 8.50837 15.8335 6.66671C15.8335 4.82504 14.3418 3.33337 12.5002 3.33337C12.1085 3.33337 11.7418 3.41671 11.3918 3.53337C12.0835 4.39171 12.5002 5.48337 12.5002 6.66671C12.5002 7.85004 12.0835 8.94171 11.3918 9.80004C11.7418 9.91671 12.1085 10 12.5002 10Z"
            fill="currentColor"
          />
          <path
            d="M7.50016 10C9.34183 10 10.8335 8.50837 10.8335 6.66671C10.8335 4.82504 9.34183 3.33337 7.50016 3.33337C5.6585 3.33337 4.16683 4.82504 4.16683 6.66671C4.16683 8.50837 5.6585 10 7.50016 10ZM7.50016 5.00004C8.41683 5.00004 9.16683 5.75004 9.16683 6.66671C9.16683 7.58337 8.41683 8.33337 7.50016 8.33337C6.5835 8.33337 5.8335 7.58337 5.8335 6.66671C5.8335 5.75004 6.5835 5.00004 7.50016 5.00004Z"
            fill="currentColor"
          />
          <path
            d="M7.50016 10.8334C5.27516 10.8334 0.833496 11.95 0.833496 14.1667V16.6667H14.1668V14.1667C14.1668 11.95 9.72516 10.8334 7.50016 10.8334ZM12.5002 15H2.50016V14.175C2.66683 13.575 5.25016 12.5 7.50016 12.5C9.75016 12.5 12.3335 13.575 12.5002 14.1667V15Z"
            fill="currentColor"
          />
        </svg>`
      : html`<svg
          class="step-icon"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.9994 10.0001C15.0056 10.0001 10.0117 5.01187 10 0.0177776V0.000277886C10 0.00305563 9.99972 0.00611118 9.99972 0.00888892C9.99972 0.0058334 9.99944 0.00305551 9.99944 0V0.0174999C9.98778 5.01187 4.99417 10.0001 0 10.0001C5 10.0001 10 15.0001 10 20C10 15.0001 15 10.0001 20 10.0001H19.9994Z"
            fill="currentColor"
          />
        </svg>`;
  }

  private renderAgentHeader() {
    return html`<div class="agent-header layout horizontal">
      <div class="agent-header-title">${this.t("agentController")}</div>
      <div class="flex"></div>
      <div class="max-runs-per-cycle">
        ${this.maxRunsPerCycle} ${this.t("reportsPerMonth")}
      </div>
    </div>`;
  }

  get shouldDisableStopButton() {
    return this.workflowStatus !== "running";
  }

  get shouldDisableStartButton() {
    return this.workflowStatus === "running";
  }

  get isRunning() {
    return this.workflowStatus === "running";
  }

  private renderAgentRunningStatus() {
    return html`<div class="agent-running-status">
      ${this.progress !== undefined
        ? html`<md-linear-progress
            value="${this.progress / 100}"
          ></md-linear-progress>`
        : html`<md-linear-progress indeterminate></md-linear-progress>`}
      <div class="statusMessage">${this.latestMessage}</div>
    </div>`;
  }


  renderStartStopButtons() {
    return html`<div class="layout horizontal startStopButtons">
      ${this.isRunning
        ? html` <md-filled-button class="startButton startButtonFilled" disabled
            ><md-icon slot="icon" class="startIcon">play_circle</md-icon
            >${this.t("start")}</md-filled-button
          >`
        : html` <md-outlined-button
            class="startButton"
            ?disabled=${this.shouldDisableStartButton}
            ><md-icon slot="icon" class="startIcon">play_circle</md-icon
            >${this.t("start")}</md-outlined-button
          >`}

      <md-outlined-button
        class="stopButton"
        ?disabled=${this.shouldDisableStopButton}
        ><md-icon slot="icon" class="stopIcon">stop_circle</md-icon> ${this.t(
          "stop"
        )}</md-outlined-button
      >
    </div>`;
  }


  override render() {
    if (
      !this.workflow ||
      !this.parsedWorkflow.steps ||
      this.parsedWorkflow.steps.length === 0
    ) {
      return html`<div>No workflow configuration available</div>`;
    }

    return html`
      <div class="layout vertical container">
        ${this.renderAgentHeader()} ${this.renderStartStopButtons()}
        <div class="layout horizontal wrap">
          ${this.parsedWorkflow.steps.map((step, index) =>
            this.renderStep(
              step,
              index,
              index === this.parsedWorkflow.currentStepIndex
            )
          )}
        </div>
        ${this.isRunning ? this.renderAgentRunningStatus() : nothing}
      </div>
    `;
  }
}
