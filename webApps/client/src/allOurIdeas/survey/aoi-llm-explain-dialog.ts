import { css, html } from "lit";
import { property, customElement, query, queryAll } from "lit/decorators.js";
import { YpBaseElement } from "../../common/yp-base-element.js";

import "@material/web/dialog/dialog.js";
import { MdDialog } from "@material/web/dialog/dialog.js";

import "@material/web/button/elevated-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/button/text-button.js";
import "@material/web/progress/circular-progress.js";

import "@material/web/textfield/filled-text-field.js";
import { SharedStyles } from "./SharedStyles.js";
import { YpChatbotBase } from "../../yp-llms/yp-chatbot-base.js";
import { AoiServerApi } from "./AoiServerApi.js";

@customElement("aoi-llm-explain-dialog")
export class AoiLlmExplainDialog extends YpChatbotBase {
  @property({ type: Object })
  earl!: AoiEarlData;

  @property({ type: Number })
  groupId!: number;

  @property({ type: Object })
  question!: AoiQuestionData;

  @property({ type: String })
  leftAnswer!: string;

  @property({ type: String })
  rightAnswer!: string;

  @property({ type: String })
  currentError: string | undefined;

  @property({ type: String })
  override defaultInfoMessage =
    "I'm your All Our Ideas AI assitant ready to explain anything connected to this project.";

  serverApi!: AoiServerApi;

  haveSentFirstQuestion = false;

  override setupServerApi(): void {
    this.serverApi = new AoiServerApi();
  }

  override async connectedCallback() {
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
  }


  async sendFirstQuestion() {
    const firstMessage =`# Question\n${this.question.name}\n\n## First Answer\n${this.leftAnswer}## Second Answer\n${this.rightAnswer} \n\n`;

    this.addChatBotElement({
      sender: 'you',
      type: 'start',
      message: firstMessage,
    });

    this.addThinkingChatBotMessage();

    await this.serverApi.startLlmAnswerExplain(
      this.groupId,
      this.wsClientId,
      this.simplifiedChatLog,
    );

  }

  @query("#dialog")
  dialog!: MdDialog;

  override async sendChatMessage() {
    const message = this.chatInputField!.value;

    if (message.length === 0) return;

    //this.ws.send(message);
    this.chatInputField!.value = '';
    this.sendButton!.disabled = false;
    //this.sendButton!.innerHTML = this.t('Thinking...');
    setTimeout(() => {
      this.chatInputField!.blur();
    });




  }

  open() {
    this.dialog.show();
    this.currentError = undefined;
    window.appGlobals.activity(`Llm explain - open`);
    this.sendFirstQuestion();
  }

  cancel() {
    this.dialog.close();
    window.appGlobals.activity(`Llm explain - cancel`);
  }

  textAreaKeyDown(e: KeyboardEvent) {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  static override get styles() {
    return [
      ...super.styles,
      SharedStyles,
      css`
        :host {
          --md-dialog-container-color: var(--md-sys-color-surface);
        }
        md-dialog[showing-fullscreen] {
          /* hack: private! */
          --_container-max-block-size: 100dvh;
          --md-dialog-container-inset-block-start: 0px;
        }

        md-circular-progress {
          margin-right: 16px;
          --md-circular-progress-size: 40px;
        }



        #dialog {
          width: 100%;
        }

        #ideaText {
          margin-top: 8px;
          width: 500px;
        }




        @media (max-width: 960px) {
          #dialog {
            --_fullscreen-header-block-size: 74px;
          }

          }
        }
      `,
    ];
  }

  renderFooter() {
    return html` <div class="layout horizontal footer">
      <md-text-button class="cancelButton" @click="${this.cancel}">
        ${this.t("Cancel")}
      </md-text-button>
    </div>`;
  }

  override render() {
    return html`<md-dialog
      ?fullscreen="${!this.wide}"
      style="max-width: 800px;max-height: 90vh;"
      id="dialog"
    >
      <div slot="content">${super.render()}</div>
    </md-dialog> `;
  }
}
