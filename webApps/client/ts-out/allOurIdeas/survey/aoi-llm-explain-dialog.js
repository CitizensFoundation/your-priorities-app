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
import { YpChatbotBase } from "../../yp-llms/yp-chatbot-base.js";
import { AoiServerApi } from "./AoiServerApi.js";
let AoiLlmExplainDialog = class AoiLlmExplainDialog extends YpChatbotBase {
    constructor() {
        super(...arguments);
        this.defaultInfoMessage = "I'm your All Our Ideas AI assitant ready to explain anything connected to this project.";
    }
    setupServerApi() {
        this.serverApi = new AoiServerApi();
    }
    async connectedCallback() {
        super.connectedCallback();
        this.sendFirstQuestion();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
    }
    async sendFirstQuestion() {
        const firstMessage = `Question: ${this.question.name} \n\nLeft Answer: ${this.leftAnswer} \n\nRight Answer: ${this.rightAnswer} \n\n`;
        this.addChatBotElement({
            sender: 'you',
            type: 'start',
            message: firstMessage,
        });
        await this.serverApi.startLlmAnswerExplain(this.groupId, firstMessage, this.chatLog, this.wsClientId);
    }
    async sendChatMessage() {
        const message = this.chatInputField.value;
        if (message.length === 0)
            return;
        //this.ws.send(message);
        this.chatInputField.value = '';
        this.sendButton.disabled = false;
        //this.sendButton!.innerHTML = this.t('Thinking...');
        setTimeout(() => {
            this.chatInputField.blur();
        });
    }
    open() {
        this.dialog.show();
        this.currentError = undefined;
        window.appGlobals.activity(`Llm explain - open`);
    }
    cancel() {
        this.dialog.close();
        window.appGlobals.activity(`Llm explain - cancel`);
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
        return html ` <div class="layout horizontal footer">
      <md-text-button class="cancelButton" @click="${this.cancel}">
        ${this.t("Cancel")}
      </md-text-button>
    </div>`;
    }
    render() {
        return html `<md-dialog
      ?fullscreen="${!this.wide}"
      style="max-width: 800px;max-height: 90vh;"
      id="dialog"
    >
      <div slot="content">${super.render()}</div>
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
], AoiLlmExplainDialog.prototype, "leftAnswer", void 0);
__decorate([
    property({ type: String })
], AoiLlmExplainDialog.prototype, "rightAnswer", void 0);
__decorate([
    property({ type: String })
], AoiLlmExplainDialog.prototype, "currentError", void 0);
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