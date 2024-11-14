var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { YpBaseElement } from "../../common/yp-base-element";
let YpAgentWorkflowWidget = class YpAgentWorkflowWidget extends YpBaseElement {
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
            console.error('Failed to decode or parse workflow:', error);
            return { currentStepIndex: 0, steps: [] };
        }
    }
    static get styles() {
        return [
            super.styles,
            css `
        :host {
          display: block;
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
      font-family: system-ui, -apple-system, sans-serif;
    }

    .workflow-step {
      position: relative;
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 16px;
    }

    .step-connector {
      position: absolute;
      left: 32px;
      top: 64px;
      width: 2px;
      height: 64px;
      background-color: var(--md-sys-color-outline-variant, #e2e8f0);
    }

    .step-number {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      font-weight: bold;
      font-size: 20px;
      flex-shrink: 0;
      transition: background-color 0.3s ease;
    }

    .step-content {
      flex: 1;
      background: var(--md-sys-color-surface-container, white);
      border: 1px solid var(--md-sys-color-outline-variant, #e2e8f0);
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .step-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }

    .step-title {
      font-size: 20px;
      font-weight: 600;
      margin: 0;
    }

    .step-description {
      margin: 0;
      font-size: 16px;
      line-height: 1.5;
    }

    .step-icon {
      width: 20px;
      height: 20px;
      color: var(--md-sys-color-outline, #94a3b8);
    }

    /* Status-specific styles */
    .step-completed {
      opacity: 0.7;
    }

    .step-active {
      animation: pulse 2s infinite;
    }

    .step-disabled {
      opacity: 0.5;
    }

    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.4);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(46, 204, 113, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(46, 204, 113, 0);
        }
      }
    `
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
    renderStep(step, index, isLast) {
        const stepClass = this.getStepClass(index);
        return html `
      <div class="workflow-step ${stepClass}">
        ${!isLast ? html `<div class="step-connector"></div>` : ''}
        <div
          class="step-number"
          style="
            background-color: ${step.stepBackgroundColor};
            color: ${step.stepTextColor};
          "
        >
          ${index + 1}
        </div>
        <div class="step-content">
          <div class="step-header">
            <h3 class="step-title" style="color: ${step.stepTextColor}">
              ${step.shortName}
            </h3>
            ${step.type === "engagmentFromOutputConnector"
            ? this.renderIcon("users")
            : this.renderIcon("sparkles")}
          </div>
          <p
            class="step-description"
            style="color: ${this.adjustTextColor(step.stepTextColor || "#000000")}"
          >
            ${step.shortDescription}
          </p>
        </div>
      </div>
    `;
    }
    renderIcon(type) {
        return type === "users"
            ? html `<svg class="step-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>`
            : html `<svg class="step-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 3l1.88 5.76a1 1 0 0 0 .95.69h6.08a1 1 0 0 1 .59 1.81l-4.92 3.58a1 1 0 0 0-.36 1.12l1.88 5.76a1 1 0 0 1-1.54 1.12l-4.92-3.58a1 1 0 0 0-1.18 0l-4.92 3.58a1 1 0 0 1-1.54-1.12l1.88-5.76a1 1 0 0 0-.36-1.12l-4.92-3.58a1 1 0 0 1 .59-1.81h6.08a1 1 0 0 0 .95-.69L12 3z"></path>
        </svg>`;
    }
    adjustTextColor(backgroundColor) {
        // If text color is light, darken it slightly for better contrast
        return backgroundColor === "#ffffff" ? "#64748b" : backgroundColor;
    }
    render() {
        debugger;
        if (!this.workflow || !this.parsedWorkflow.steps || this.parsedWorkflow.steps.length === 0) {
            return html `<div>No workflow configuration available</div>`;
        }
        return html `
      ${this.parsedWorkflow.steps.map((step, index) => this.renderStep(step, index, index === this.parsedWorkflow.steps.length - 1))}
    `;
    }
};
__decorate([
    property({ type: String })
], YpAgentWorkflowWidget.prototype, "agentProductId", void 0);
__decorate([
    property({ type: String })
], YpAgentWorkflowWidget.prototype, "runId", void 0);
__decorate([
    property({ type: String })
], YpAgentWorkflowWidget.prototype, "agentName", void 0);
__decorate([
    property({ type: String })
], YpAgentWorkflowWidget.prototype, "agentDescription", void 0);
__decorate([
    property({ type: String })
], YpAgentWorkflowWidget.prototype, "workflowStatus", void 0);
__decorate([
    property({ type: String })
], YpAgentWorkflowWidget.prototype, "workflow", void 0);
YpAgentWorkflowWidget = __decorate([
    customElement("yp-agent-workflow-widget")
], YpAgentWorkflowWidget);
export { YpAgentWorkflowWidget };
//# sourceMappingURL=yp-agent-workflow-widget.js.map