var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, property } from "lit/decorators.js";
import { YpBaseElement } from "../../common/yp-base-element.js";
import { css, html } from "lit";
import "@material/web/iconbutton/filled-icon-button.js";
import { YpAssistantServerApi } from "../AssistantServerApi.js";
let YpAgentConfigurationWidget = class YpAgentConfigurationWidget extends YpBaseElement {
    constructor() {
        super();
        this.serverApi = new YpAssistantServerApi(window.appGlobals.currentClientMemoryUuid);
    }
    connectedCallback() {
        super.connectedCallback();
        this.addGlobalListener("assistant-requested-submit-agent-configuration", this.submitConfiguration.bind(this));
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeGlobalListener("assistant-requested-submit-agent-configuration", this.submitConfiguration.bind(this));
    }
    static get styles() {
        return [
            super.styles,
            css `
        :host {
          display: block;
          width: 100%;
        }

        .agent-chip {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 16px;
          background-color: var(--md-sys-color-surface-container-low);
          border-radius: 8px;
          gap: 16px;
        }

        .agent-chip[isSelected] {
          background-color: var(--md-sys-color-surface-variant);
        }

        img {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
        }

        .content {
          flex: 1;
          min-width: 0;
        }

        .agent-name {
          font-weight: 500;
          font-size: 1.1em;
          margin-bottom: 4px;
        }

        .agent-name[isUnsubscribed] {
          color: var(--yp-sys-color-down);
        }

        .agent-description {
          color: var(--secondary-text-color);
          font-size: 0.9em;
          line-height: 1.4;
        }

        md-filled-icon-button {
          margin-left: 32px;
          margin-top: 8px;
        }
      `,
        ];
    }
    async submitConfiguration() {
        console.log("submitConfiguration");
        debugger;
        const answers = [];
        // Get answers from required questions
        if (this.requiredQuestions) {
            const questions = JSON.parse(this.requiredQuestions);
            for (const question of questions) {
                const questionElement = this.shadowRoot.querySelector(`#structuredQuestion_${question.uniqueId || `noId_${questions.indexOf(question)}`}`);
                if (questionElement) {
                    const answer = questionElement.getAnswer();
                    if (answer) {
                        answers.push({
                            uniqueId: question.uniqueId,
                            value: answer,
                        });
                    }
                }
            }
        }
        await this.serverApi.submitAgentConfiguration(this.domainId, this.agentId.toString(), this.subscriptionId, answers);
        this.fireGlobal("agent-configuration-submitted");
    }
    get parsedRequiredQuestions() {
        try {
            return JSON.parse(this.requiredQuestions);
        }
        catch (error) {
            console.error("Error parsing required questions", error);
            return [];
        }
    }
    get parsedRequiredQuestionsAnswered() {
        try {
            return JSON.parse(this.requiredQuestionsAnswered);
        }
        catch (error) {
            console.error("Error parsing required questions answered", error);
            return [];
        }
    }
    render() {
        return html `
      <div class="agent-chip">
        <img src="${this.agentImageUrl}" alt="${this.agentName}" />
        <div class="content">
          <div class="agent-name">${this.agentName}</div>
          <div class="agent-description">${this.agentDescription}</div>
          <div id="surveyContainer">
            ${this.parsedRequiredQuestions.map((question, index) => html `
                <yp-structured-question-edit
                  index="${index}"
                  id="structuredQuestion_${question.uniqueId ||
            `noId_${index}`}"
                  .question="${question}"
                  .value="${this.parsedRequiredQuestionsAnswered.find((answer) => answer.uniqueId === question.uniqueId)?.value}"
                >
                </yp-structured-question-edit>
              `)}
          </div>
        </div>
        <div class="layout horizontal">
          <md-filled-button @click="${this.submitConfiguration}">
            ${this.t("Submit")}
          </md-filled-button>
        </div>
      </div>
    `;
    }
};
__decorate([
    property({ type: Number })
], YpAgentConfigurationWidget.prototype, "agentId", void 0);
__decorate([
    property({ type: String })
], YpAgentConfigurationWidget.prototype, "agentName", void 0);
__decorate([
    property({ type: String })
], YpAgentConfigurationWidget.prototype, "subscriptionId", void 0);
__decorate([
    property({ type: Number })
], YpAgentConfigurationWidget.prototype, "domainId", void 0);
__decorate([
    property({ type: String })
], YpAgentConfigurationWidget.prototype, "agentDescription", void 0);
__decorate([
    property({ type: String })
], YpAgentConfigurationWidget.prototype, "agentImageUrl", void 0);
__decorate([
    property({ type: String })
], YpAgentConfigurationWidget.prototype, "requiredQuestions", void 0);
__decorate([
    property({ type: String })
], YpAgentConfigurationWidget.prototype, "requiredQuestionsAnswered", void 0);
YpAgentConfigurationWidget = __decorate([
    customElement("yp-agent-configuration-widget")
], YpAgentConfigurationWidget);
export { YpAgentConfigurationWidget };
//# sourceMappingURL=yp-agent-configuration-widget.js.map