var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { YpBaseElement } from "../../common/yp-base-element";
let YpAgentRunWidget = class YpAgentRunWidget extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.agentProductId = "";
        this.runId = "";
        this.agentName = "";
        this.agentDescription = "";
        this.workflowStatus = "not_started";
    }
    get parsedWorkflow() {
        try {
            const decodedWorkflow = atob(this.workflow);
            return JSON.parse(decodedWorkflow);
        }
        catch (error) {
            console.error("Failed to decode or parse workflow:", error);
            return { currentStepIndex: 0, steps: [] };
        }
    }
    static get styles() {
        return [
            super.styles,
            css `
        :host {
        }

        .workflow-step {
          width: calc(241px - 20px);
          height: calc(158px - 24px);
          max-height: calc(86px - 24px);
          padding: 12px;
          border: 1px solid var(--md-sys-color-outline-variant);
          margin: 12px;
          border-radius: 4px;
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

        .step-content {
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
      `,
        ];
    }
    getStepClass(index) {
        if (this.workflowStatus === "not_started") {
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
    renderStep(step, index, isSelected) {
        const stepClass = this.getStepClass(index);
        const activeStepStyle = html `background-color: ${step.stepBackgroundColor};color: ${step.stepTextColor}`;
        const isActive = isSelected && this.workflowStatus === "running";
        return html `
      <div class="workflow-step layout vertical">
        <div class="layout horizontal">
          <div class="step-number" style="${isActive ? activeStepStyle : ""}">
            ${index + 1}
          </div>
          <div class="flex"></div>
          <div>
            ${step.type === "engagmentFromOutputConnector"
            ? this.renderIcon("users")
            : this.renderIcon("sparkles")}
          </div>
        </div>

        <div class="step-content">
          <div class="step-header">
            <h3 class="step-title">${step.shortName}</h3>
          </div>
        </div>
      </div>
    `;
    }
    renderIcon(type) {
        return type === "users"
            ? html `<svg
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
            : html `<svg
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
    render() {
        if (!this.workflow ||
            !this.parsedWorkflow.steps ||
            this.parsedWorkflow.steps.length === 0) {
            return html `<div>No workflow configuration available</div>`;
        }
        return html `
      <div class="layout horizontal wrap">
        ${this.parsedWorkflow.steps.map((step, index) => this.renderStep(step, index, index === this.parsedWorkflow.currentStepIndex))}
      </div>
    `;
    }
};
__decorate([
    property({ type: String })
], YpAgentRunWidget.prototype, "agentProductId", void 0);
__decorate([
    property({ type: String })
], YpAgentRunWidget.prototype, "runId", void 0);
__decorate([
    property({ type: String })
], YpAgentRunWidget.prototype, "agentName", void 0);
__decorate([
    property({ type: String })
], YpAgentRunWidget.prototype, "agentDescription", void 0);
__decorate([
    property({ type: String })
], YpAgentRunWidget.prototype, "workflowStatus", void 0);
__decorate([
    property({ type: String })
], YpAgentRunWidget.prototype, "workflow", void 0);
YpAgentRunWidget = __decorate([
    customElement("yp-agent-run-widget")
], YpAgentRunWidget);
export { YpAgentRunWidget };
//# sourceMappingURL=yp-agent-run-widget.js.map