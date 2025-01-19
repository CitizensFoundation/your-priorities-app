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
        this.haveSubmittedConfigurationPastSecond = false;
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
          border-radius: 4px;
          width: 100%;
          max-width: calc(768px - 12px);
          width: calc(768px - 12px);
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

        md-filled-button[has-static-theme] {
          --md-filled-button-container-color: var(
            --md-sys-color-primary-container
          );
          --md-sys-color-on-primary: var(--md-sys-color-on-primary-container);
        }
      `,
        ];
    }
    async firstUpdated() {
        await this.getAgentConfiguration();
    }
    async getAgentConfiguration() {
        try {
            const response = await this.serverApi.getConfigurationAnswers(this.domainId, this.subscriptionId);
            if (response.success && response.data) {
                this.requiredQuestionsAnswered = JSON.stringify(response.data);
            }
        }
        catch (error) {
            console.error("Error fetching previously saved answers:", error);
            //TODO: Fire user error
        }
    }
    getPrefillValue(question) {
        const prefilledValue = this.parsedRequiredQuestionsAnswered.find((answer) => answer.uniqueId === question.uniqueId)?.value || "";
        return prefilledValue;
    }
    async submitConfiguration() {
        console.log("submitConfiguration");
        if (this.haveSubmittedConfigurationPastSecond) {
            console.error("Already submitted configuration past second", new Error().stack);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            this.haveSubmittedConfigurationPastSecond = false;
            return;
        }
        else {
            this.haveSubmittedConfigurationPastSecond = true;
        }
        // Parse the required questions
        const questions = this.parsedRequiredQuestions; // from get parsedRequiredQuestions()
        // Gather answers from user inputs
        const answers = [];
        if (questions.length > 0) {
            for (const question of questions) {
                const questionElement = this.shadowRoot.querySelector(`#structuredQuestion_${question.uniqueId || `noId_${questions.indexOf(question)}`}`);
                if (questionElement) {
                    const answer = questionElement.getAnswer();
                    if (answer) {
                        answers.push({
                            uniqueId: question.uniqueId,
                            value: (answer.value || "").trim(),
                        });
                    }
                }
            }
        }
        // 1) Enforce a “fully answered” check
        //    i.e. you must have as many answers as there are required questions.
        if (questions.length > 0 && answers.length < questions.length) {
            this.sendError("You must complete all required configuration questions before submitting.");
            this.haveSubmittedConfigurationPastSecond = false;
            return;
        }
        // 2) Enforce each answer is non-empty
        for (const question of questions) {
            const found = answers.find((a) => a.uniqueId === question.uniqueId);
            if (!found || !found.value) {
                this.sendError("Please complete all required questions");
                this.haveSubmittedConfigurationPastSecond = false;
                return;
            }
        }
        try {
            await this.serverApi.submitAgentConfiguration(this.domainId, this.subscriptionId, answers);
        }
        catch (error) {
            this.sendError("Error submitting agent configuration");
            return;
        }
        this.fireGlobal("agent-configuration-submitted");
    }
    sendError(message) {
        window.appDialogs.getDialogAsync("masterToast", (toast) => {
            toast.labelText = message;
            toast.open = true;
            debugger;
        });
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
                  .value="${this.getPrefillValue(question)}"
                >
                </yp-structured-question-edit>
              `)}
          </div>
        </div>
        <div class="layout horizontal">
          <md-filled-button
            ?has-static-theme="${this.hasStaticTheme}"
            @click="${this.submitConfiguration}"
          >
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
__decorate([
    property({ type: Boolean })
], YpAgentConfigurationWidget.prototype, "haveSubmittedConfigurationPastSecond", void 0);
YpAgentConfigurationWidget = __decorate([
    customElement("yp-agent-configuration-widget")
], YpAgentConfigurationWidget);
export { YpAgentConfigurationWidget };
//# sourceMappingURL=yp-agent-configuration-widget.js.map