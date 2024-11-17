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

        .container {
          padding: 16px;
          border-radius: 4px;
          width: 100%;
          min-width: 820px;
        }

        @media (max-width: 820px) {
          .container {
            min-width: 100%;
          }
        }

        .agent-header-title {
          font-size: 22px;
          font-weight: 700;
          color: var(--md-sys-color-on-surface);
          font-family: var(--md-ref-typeface-brand);
          margin-bottom: 8px;
        }

        md-filled-button {
          margin-left: auto;
          margin-top: 8px;
        }

        md-filled-icon-button {
          margin-left: 8px;
          margin-top: 8px;
        }
      `,
        ];
    }
    async submitConfiguration() {
        console.log("submitConfiguration");
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
                            value: answer.value,
                        });
                    }
                }
            }
        }
        await this.serverApi.submitAgentConfiguration(this.domainId, this.agentProductId.toString(), this.subscriptionId, answers);
        this.fireGlobal("agent-configuration-submitted");
    }
    get parsedRequiredQuestions() {
        try {
            const questions = JSON.parse(this.requiredQuestions);
            questions.forEach((question) => {
                question.rows = 14;
            });
            return questions;
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
    renderAgentHeader() {
        return html `<div class="agent-header layout horizontal">
      <div class="agent-header-title">${this.t("agentConfiguration")}</div>
      <div class="flex"></div>

    </div>`;
    }
    render() {
        return html `
      <div class="layout vertical container">
        ${this.renderAgentHeader()}
        <div class="content">
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
], YpAgentConfigurationWidget.prototype, "agentProductId", void 0);
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