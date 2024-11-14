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
      return JSON.parse(this.requiredQuestions);
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

  override render() {
    return html`
      <div class="agent-chip">
        <img src="${this.agentImageUrl}" alt="${this.agentName}" />
        <div class="content">
          <div class="agent-name">${this.agentName}</div>
          <div class="agent-description">${this.agentDescription}</div>
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
          <md-filled-button @click="${this.submitConfiguration}">
            ${this.t("Submit")}
          </md-filled-button>
        </div>
      </div>
    `;
  }
}
