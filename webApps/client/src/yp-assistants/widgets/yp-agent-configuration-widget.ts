import { customElement, property } from "lit/decorators.js";
import { YpBaseElement } from "../../common/yp-base-element.js";
import { css, html } from "lit";

import "@material/web/iconbutton/filled-icon-button.js";
import { YpAssistantServerApi } from "../AssistantServerApi.js";

@customElement("yp-agent-configuration-widget")
export class YpAgentConfigurationWidget extends YpBaseElement {
  @property({ type: Number })
  agentProductId!: number;

  @property({ type: String })
  agentName!: string;

  @property({ type: String })
  subscriptionId!: string;

  @property({ type: Number })
  domainId!: number;

  @property({ type: String })
  agentDescription!: string;

  @property({ type: String })
  agentImageUrl!: string;

  @property({ type: String })
  requiredQuestions!: string;

  @property({ type: String })
  requiredQuestionsAnswered!: string;

  @property({ type: Boolean })
  haveSubmittedConfigurationPastSecond = false;

  serverApi!: YpAssistantServerApi;

  constructor() {
    super();
    this.serverApi = new YpAssistantServerApi(
      window.appGlobals.currentClientMemoryUuid!
    );
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addGlobalListener(
      "assistant-requested-submit-agent-configuration",
      this.submitConfiguration.bind(this)
    );
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeGlobalListener(
      "assistant-requested-submit-agent-configuration",
      this.submitConfiguration.bind(this)
    );
  }

  static override get styles() {
    return [
      super.styles,
      css`
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

  async submitConfiguration() {
    console.log("submitConfiguration");

    if (this.haveSubmittedConfigurationPastSecond) {
      console.error("Already submitted configuration past second", new Error().stack);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      this.haveSubmittedConfigurationPastSecond = false;
      return;
    } else {
      this.haveSubmittedConfigurationPastSecond = true;
    }

    const answers: YpStructuredAnswer[] = [];

    // Get answers from required questions
    if (this.requiredQuestions) {
      const questions = JSON.parse(this.requiredQuestions);
      for (const question of questions) {
        const questionElement = this.shadowRoot!.querySelector(
          `#structuredQuestion_${
            question.uniqueId || `noId_${questions.indexOf(question)}`
          }`
        ) as any;

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

    await this.serverApi.submitAgentConfiguration(
      this.domainId,
      this.agentProductId.toString(),
      this.subscriptionId,
      answers
    );

    this.fireGlobal("agent-configuration-submitted");
  }

  get parsedRequiredQuestions(): YpStructuredQuestionData[] {
    try {
      const questions = JSON.parse(this.requiredQuestions);
      questions.forEach((question: YpStructuredQuestionData) => {
        question.rows = 14;
      });
      return questions;
    } catch (error) {
      console.error("Error parsing required questions", error);
      return [];
    }
  }

  get parsedRequiredQuestionsAnswered(): YpStructuredAnswer[] {
    try {
      return JSON.parse(this.requiredQuestionsAnswered);
    } catch (error) {
      console.error("Error parsing required questions answered", error);
      return [];
    }
  }

  private renderAgentHeader() {
    return html`<div class="agent-header layout horizontal">
      <div class="agent-header-title">${this.t("agentConfiguration")}</div>
      <div class="flex"></div>

    </div>`;
  }

  override render() {
    return html`
      <div class="layout vertical container">
        ${this.renderAgentHeader()}
        <div class="content">
          <div id="surveyContainer">
            ${this.parsedRequiredQuestions.map(
              (question: YpStructuredQuestionData, index: number) => html`
                <yp-structured-question-edit
                  index="${index}"
                  id="structuredQuestion_${question.uniqueId ||
                  `noId_${index}`}"
                  .question="${question}"
                  .value="${this.parsedRequiredQuestionsAnswered.find(
                    (answer) => answer.uniqueId === question.uniqueId
                  )?.value}"
                >
                </yp-structured-question-edit>
              `
            )}
          </div>
        </div>
        <div class="layout horizontal">
          <md-filled-button ?has-static-theme="${this.hasStaticTheme}" @click="${this.submitConfiguration}">
            ${this.t("Submit")}
          </md-filled-button>
        </div>
      </div>
    `;
  }
}
