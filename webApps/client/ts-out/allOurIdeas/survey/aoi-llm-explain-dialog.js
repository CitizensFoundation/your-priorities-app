var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html } from "lit";
import { property, customElement, query } from "lit/decorators.js";
import "@material/web/dialog/dialog.js";
import "@material/web/button/elevated-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/button/text-button.js";
import "@material/web/progress/circular-progress.js";
import "@material/web/textfield/filled-text-field.js";
import { SharedStyles } from "./SharedStyles.js";
import { YpChatbotBase } from "../../yp-chatbots/yp-chatbot-base.js";
import { AoiServerApi } from "./AoiServerApi.js";
import { YpLanguages } from "../../common/languages/ypLanguages.js";
let AoiLlmExplainDialog = class AoiLlmExplainDialog extends YpChatbotBase {
    constructor() {
        super(...arguments);
        this.showCloseButton = true;
        this.defaultInfoMessage = undefined;
        this.haveSentFirstQuestion = false;
    }
    setupServerApi() {
        this.serverApi = new AoiServerApi();
    }
    async connectedCallback() {
        super.connectedCallback();
        this.addEventListener("yp-ws-opened", this.sendFirstQuestion);
        this.addEventListener("chatbot-close", this.cancel);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener("yp-ws-opened", this.sendFirstQuestion);
        this.addEventListener("chatbot-close", this.cancel);
    }
    async sendFirstQuestion() {
        window.appGlobals.activity(`Explain - first qestion`);
        const firstMessage = `**${this.t("hereIsTheQuestion")}:**
${this.questionText}

**${this.t("firstAnswer")}:**
${this.leftAnswerText}

**${this.t("secondAnswer")}**
${this.rightAnswerText}
`;
        this.addChatBotElement({
            sender: "user",
            type: "start",
            message: firstMessage,
        });
        this.addThinkingChatBotMessage();
        await this.serverApi.llmAnswerConverstation(this.groupId, this.wsClientId, this.simplifiedChatLog, YpLanguages.getEnglishName(this.language));
    }
    async sendChatMessage() {
        const message = this.chatInputField.value;
        if (message.length === 0)
            return;
        //this.ws.send(message);
        this.chatInputField.value = "";
        this.sendButton.disabled = false;
        //this.sendButton!.innerHTML = this.t('Thinking...');
        setTimeout(() => {
            this.chatInputField.blur();
        });
        this.addChatBotElement({
            sender: "user",
            type: "start",
            message: message,
        });
        this.addThinkingChatBotMessage();
        await this.serverApi.llmAnswerConverstation(this.groupId, this.wsClientId, this.simplifiedChatLog, YpLanguages.getEnglishName(this.language));
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
    textAreaKeyDown(e) {
        if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();
            return false;
        }
        else {
            return true;
        }
    }
    static get styles() {
        return [
            ...super.styles,
            SharedStyles,
            css `
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
          max-width: 800px;
          max-height: 100vh;
        }

        #ideaText {
          margin-top: 8px;
          width: 500px;
        }


        @media (max-width: 960px) {
          #dialog {
            --_fullscreen-header-block-size: 74px;
          }

          #dialog {
            border-radius: 0;
          }

          #content, slot[name="content"]::slotted(*) {
            padding: 8px;
          }
        }
      `,
        ];
    }
    render() {
        return html `<md-dialog
      @closed="${() => this.cancel()}"
      ?fullscreen="${!this.wide}"
      class="dialog"
      id="dialog"
    >
      <div slot="headline">${this.t("explainBothAnswers")}</div>
      <div slot="content" id="content">${super.render()}</div>
    </md-dialog> `;
    }
};
__decorate([
    property({ type: Object })
], AoiLlmExplainDialog.prototype, "earl", void 0);
__decorate([
    property({ type: Number })
], AoiLlmExplainDialog.prototype, "groupId", void 0);
__decorate([
    property({ type: Object })
], AoiLlmExplainDialog.prototype, "question", void 0);
__decorate([
    property({ type: String })
], AoiLlmExplainDialog.prototype, "questionText", void 0);
__decorate([
    property({ type: String })
], AoiLlmExplainDialog.prototype, "leftAnswerText", void 0);
__decorate([
    property({ type: String })
], AoiLlmExplainDialog.prototype, "rightAnswerText", void 0);
__decorate([
    property({ type: Object })
], AoiLlmExplainDialog.prototype, "leftAnswer", void 0);
__decorate([
    property({ type: Object })
], AoiLlmExplainDialog.prototype, "rightAnswer", void 0);
__decorate([
    property({ type: String })
], AoiLlmExplainDialog.prototype, "currentError", void 0);
__decorate([
    property({ type: Boolean })
], AoiLlmExplainDialog.prototype, "showCloseButton", void 0);
__decorate([
    property({ type: String })
], AoiLlmExplainDialog.prototype, "defaultInfoMessage", void 0);
__decorate([
    query("#dialog")
], AoiLlmExplainDialog.prototype, "dialog", void 0);
AoiLlmExplainDialog = __decorate([
    customElement("aoi-llm-explain-dialog")
], AoiLlmExplainDialog);
export { AoiLlmExplainDialog };
//# sourceMappingURL=aoi-llm-explain-dialog.js.map