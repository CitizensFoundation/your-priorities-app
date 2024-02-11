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
import { YpLanguages } from "../../common/languages/ypLanguages.js";

@customElement("aoi-llm-explain-dialog")
export class AoiLlmExplainDialog extends YpChatbotBase {
  @property({ type: Object })
  earl!: AoiEarlData;

  @property({ type: Number })
  groupId!: number;

  @property({ type: Object })
  question!: AoiQuestionData;

  @property({ type: String })
  questionText!: string

  @property({ type: String })
  leftAnswerText!: string

  @property({ type: String })
  rightAnswerText!: string

  @property({ type: Object })
  leftAnswer!: AoiAnswerToVoteOnData;

  @property({ type: Object })
  rightAnswer!: AoiAnswerToVoteOnData;

  @property({ type: String })
  currentError: string | undefined;

  @property({ type: Boolean })
  override showCloseButton = true;

  @property({ type: String })
  override defaultInfoMessage: string | undefined = undefined;

  serverApi!: AoiServerApi;

  haveSentFirstQuestion = false;

  override setupServerApi(): void {
    this.serverApi = new AoiServerApi();
  }

  override async connectedCallback() {
    super.connectedCallback();
    this.addEventListener("yp-ws-opened", this.sendFirstQuestion);
    this.addEventListener("chatbot-close", this.cancel);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("yp-ws-opened", this.sendFirstQuestion);
    this.addEventListener("chatbot-close", this.cancel);
  }

  async sendFirstQuestion() {
    const firstMessage = `**${this.t('hereIsTheQuestion')}:**
${this.questionText}

**${this.t('firstAnswer')}:**
${this.leftAnswerText}

**${this.t('secondAnswer')}**
${this.rightAnswerText}

${this.t('pleaseAnswerInThisLanguage')}: ${YpLanguages.getEnglishName(this.language)}`;

    this.addChatBotElement({
      sender: "you",
      type: "start",
      message: firstMessage,
    });

    this.addThinkingChatBotMessage();

    await this.serverApi.llmAnswerConverstation(
      this.groupId,
      this.wsClientId,
      this.simplifiedChatLog
    );
  }

  @query("#dialog")
  dialog!: MdDialog;

  override async sendChatMessage() {
    const message = this.chatInputField!.value;

    if (message.length === 0) return;

    //this.ws.send(message);
    this.chatInputField!.value = "";
    this.sendButton!.disabled = false;
    //this.sendButton!.innerHTML = this.t('Thinking...');
    setTimeout(() => {
      this.chatInputField!.blur();
    });

    this.addChatBotElement({
      sender: "you",
      type: "start",
      message: message,
    });

    this.addThinkingChatBotMessage();

    await this.serverApi.llmAnswerConverstation(
      this.groupId,
      this.wsClientId,
      this.simplifiedChatLog
    );
  }

  open() {
    this.dialog.show();
    this.currentError = undefined;
    window.appGlobals.activity(`Llm explain - open`);
  }

  cancel() {
    this.dialog.close();
    window.appGlobals.activity(`Llm explain - cancel`);
    this.fire("closed");
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

  override render() {
    return html`<md-dialog
      @closed="${() => this.cancel()}"
      ?fullscreen="${!this.wide}"
      style="max-width: 800px;max-height: 100vh;"
      id="dialog"
    > <div slot="headline">${this.t("explainBothAnswers")}</div>
      <div slot="content">${super.render()}</div>
    </md-dialog> `;
  }
}
