var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";
import { resolveMarkdown } from "../common/litMarkdown/litMarkdown.js";
import "@material/web/icon/icon.js";
import "@material/web/checkbox/checkbox.js";
import "@material/web/button/outlined-button.js";
import "@material/web/button/filled-button.js";
import "@material/web/textfield/filled-text-field.js";
import "@material/web/progress/circular-progress.js";
import "../common/yp-image.js";
import { YpBaseElement } from "../common/yp-base-element.js";
let YpAiChatbotItemBase = class YpAiChatbotItemBase extends YpBaseElement {
    constructor() {
        super();
        this.spinnerActive = false;
        this.fullReferencesOpen = false;
        this.followUpQuestionsRaw = "";
        this.followUpQuestions = [];
        this.jsonLoading = false;
        this.isSpeaking = false;
        this.handleJsonLoadingStart = () => {
            console.log("JSON loading start event triggered");
            this.jsonLoading = true;
            this.requestUpdate(); // If needed to trigger a re-render
        };
        this.handleJsonLoadingEnd = (event) => {
            const jsonContent = event.detail;
            console.log("JSON loading end event triggered with JSON content:", jsonContent);
            this.jsonLoading = false;
        };
    }
    connectedCallback() {
        super.connectedCallback();
        // Subscribe to MarkdownDirective events
        this.addEventListener("jsonLoadingStart", this.handleJsonLoadingStart);
        this.addEventListener("jsonLoadingEnd", this.handleJsonLoadingEnd);
    }
    disconnectedCallback() {
        // Remove event listeners for MarkdownDirective
        this.removeEventListener("jsonLoadingStart", this.handleJsonLoadingStart);
        this.removeEventListener("jsonLoadingEnd", this.handleJsonLoadingEnd);
        super.disconnectedCallback();
    }
    stopJsonLoading() {
        this.jsonLoading = false;
    }
    static get styles() {
        return [
            super.styles,
            css `
        :host {
          display: flex;
        }
        .chatImage {
          padding: 8px;
          vertical-align: text-top;
        }

        .robotIcon {
          --md-icon-size: 34px;
        }

        .chatText {
          padding: 8px;
          padding-left: 8px;
          margin-top: 0;
          padding-top: 2px;
        }

        .chatTextUser {
        }

        .userChatDialog {
          color: var(--md-sys-color-on-surface);
          background-color: var(--md-sys-color-surface-container);
          padding: 8px;
          margin: 16px;
          line-height: 1.5;
          margin-bottom: 0px;
          border-radius: 12px;
        }

        .post {
          margin: 8px;
          padding: 12px;
          border-radius: 24px;
          margin-right: 0;
          background-color: var(--md-sys-color-secondary);
          color: var(--md-sys-color-on-secondary);
          cursor: pointer;
        }

        .postImage {
          height: 28px;
          width: 50px;
        }

        .postName {
          display: flex;
          justify-content: center;
          align-content: center;
          flex-direction: column;
          margin-right: 8px;
        }

        .chatGPTDialogContainer {
          max-width: 100%;
          width: 100%;
        }

        .chatGPTDialog {
          color: var(--md-sys-color-on-surface);
          background-color: var(--md-sys-color-surface);
          padding: 8px;
          margin: 16px;
          line-height: 1.5;
          margin-bottom: 0px;
          border-radius: 10px;
          max-width: 89%;
          margin-top: 12px;
        }

        @media (max-width: 800px) {
          .chatGPTDialog {
            margin: 8px;
            max-width: 100%;
          }
        }

        .chatGPTDialog[error] {
          background-color: var(--md-sys-color-error);
          color: var(--md-sys-color-on-error);
        }

        .followup-question-container {
          margin-top: 12px;
          width: 100%;
          align-self: flex-end;
          justify-content: flex-end;
          margin-right: 32px;
          width: 100%;
        }

        .labelText {
          padding-left: 6px;
          width: 100%;
        }

        md-circular-progress {
          --md-circular-progress-size: 32px;
          width: 32px;
          height: 32px;
          margin-top: 8px;
        }

        .refinedSuggestions {
          padding: 0;
          border-radius: 8px;
          margin: 16px;
          margin-top: 0;
        }

        .refinedSuggestions label {
          display: flex;
          align-items: center;
          margin-bottom: 0; // Reduced margin for a tighter layout
          padding: 8px;
        }

        .labelText {
          margin-left: 4px; // Adjust as needed
        }

        .refinedContainer {
          padding: 0;
        }

        md-filled-button {
          max-width: 250px;
          margin-top: 16px;
          margin-bottom: 16px;
        }

        .followup-question {
          padding: 0;
          margin: 6px;
        }

        .chat-message {
          flex: 1;
        }

        .thinkingText {
          margin-top: 4px;
          margin-left: 6px;
          color: var(--md-sys-color-secondary);
        }

        .thinkingText[spinnerActive] {
          color: var(--md-sys-color-primary);
        }

        .doneIcon {
          margin-left: 16px;
          margin-right: 4px;
          color: var(--md-sys-color-secondary);
          font-size: 28px;
        }

        .postCitation {
          font-size: 9px;
          background-color: var(--md-sys-color-inverse-on-surface);
          color: var(--md-sys-color-primary);
          padding: 3px;
        }

        md-checkbox {
          margin: 15px;
        }

        .followUpQuestionMark {
          color: var(--md-sys-color-primary);
          font-size: 36px;
          margin-top: 8px;
        }

        .citationLink {
          margin-left: 8px;
          margin-bottom: 8px;
        }

        .progress-ring {
          transform: rotate(-90deg);
          color: var(--md-sys-color-secondary);
          transform-origin: 50% 50%;
          margin-left: 16px;
          margin-right: 4px;
        }
        .progress-ring__circle {
          stroke: var(--md-sys-color-primary);
          stroke-dasharray: 75.4;
          stroke-dashoffset: 75.4;
          stroke-linecap: round;
          animation: progress-ring 2.5s infinite;
        }
        @keyframes progress-ring {
          0% {
            stroke-dashoffset: 75.4;
          }
          50% {
            stroke-dashoffset: 0;
            transform: rotate(0deg);
          }
        }
      `,
        ];
    }
    get isError() {
        return this.type == "error" || this.type == "moderation_error";
    }
    renderCGImage() {
        return html ` <md-icon class="robotIcon">smart_toy</md-icon> `;
    }
    renderRoboImage() {
        return html ` <md-icon class="robotIcon">person</md-icon> `;
    }
    renderJson() {
        return html ``;
    }
    renderChatGPT() {
        return html `


      <div class="layout vertical chatGPTDialogContainer">
        <div
          class="chatGPTDialog layout vertical bot-message"
          ?error="${this.isError}"
        >
          <div class="layout ${this.wide ? "horizontal" : "vertical"}">
            <div class="layout vertical chatImage">${this.renderCGImage()}</div>
            <div class="layout vertical chatText">
              ${resolveMarkdown(this.message, {
            includeImages: true,
            includeCodeBlockClassNames: true,
            handleJsonBlocks: true,
            targetElement: this,
        })}
              ${this.jsonLoading
            ? html `<div class="layout horizontal center-center">
                    <md-circular-progress indeterminate></md-circular-progress>
                  </div>`
            : nothing}
            </div>
          </div>
          ${this.renderJson()}
        </div>
        ${this.followUpQuestions && this.followUpQuestions.length > 0
            ? html `
              <div class="layout horizontal followup-question-container wrap">
                <md-icon class="followUpQuestionMark">contact_support</md-icon
                >${this.followUpQuestions.map((question) => html `
                    <md-outlined-button
                      class="followup-question"
                      .label="${question}"
                      @click="${() => this.fire("followup-question", question)}"
                    ></md-outlined-button>
                  `)}
              </div>
            `
            : nothing}
      </div>
    `;
    }
    parseFollowUpQuestions() {
        this.followUpQuestionsRaw = this.followUpQuestionsRaw.replace(/<<([^>>]+)>>/g, (match, content) => {
            this.followUpQuestions.push(content);
            return "";
        });
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("followUpQuestionsRaw") &&
            this.followUpQuestionsRaw) {
            this.parseFollowUpQuestions();
        }
    }
    renderUser() {
        return html `
      <div class="userChatDialog layout horizontal user-message">
        <div class="layout vertical chatImage">${this.renderRoboImage()}</div>
        <div class="layout vertical chatText chatTextUser">
          ${resolveMarkdown(this.message, {
            includeImages: true,
            includeCodeBlockClassNames: true,
            handleJsonBlocks: true,
            targetElement: this,
        })}
        </div>
      </div>
    `;
    }
    renderNoStreaming() {
        return html `${this.spinnerActive
            ? html `<svg class="progress-ring" width="28" height="28">
            <circle
              class="progress-ring__circle"
              ?spinnerActive="${this.spinnerActive}"
              stroke="blue"
              stroke-width="2"
              fill="transparent"
              r="10"
              cx="12"
              cy="12"
            />
          </svg>`
            : html `<md-icon class="doneIcon">done</md-icon>`}
      <div class="thinkingText" ?spinnerActive="${this.spinnerActive}">
        ${this.message}
        ${this.updateMessage ? html `- ${this.updateMessage}` : nothing}
      </div> `;
    }
    renderThinking() {
        return html `${this.spinnerActive
            ? html `<svg class="progress-ring" width="28" height="28">
            <circle
              class="progress-ring__circle"
              ?spinnerActive="${this.spinnerActive}"
              stroke="blue"
              stroke-width="2"
              fill="transparent"
              r="10"
              cx="12"
              cy="12"
            />
          </svg>`
            : html `<md-icon class="doneIcon">done</md-icon>`}
      <div class="thinkingText" ?spinnerActive="${this.spinnerActive}">
        ${this.getThinkingText()}
      </div> `;
    }
    getThinkingText() {
        return `${this.t("thinking")}...`;
    }
    renderMessage() {
        if (this.sender === "user") {
            return this.renderUser();
        }
        else if (this.sender === "assistant" && this.type === "thinking") {
            return this.renderThinking();
        }
        else if (this.sender === "assistant" && this.type === "noStreaming") {
            return this.renderNoStreaming();
        }
        else if (this.sender === "assistant") {
            return this.renderChatGPT();
        }
    }
    render() {
        return html `${this.renderMessage()} `;
    }
};
__decorate([
    property({ type: String })
], YpAiChatbotItemBase.prototype, "message", void 0);
__decorate([
    property({ type: String })
], YpAiChatbotItemBase.prototype, "updateMessage", void 0);
__decorate([
    property({ type: String })
], YpAiChatbotItemBase.prototype, "sender", void 0);
__decorate([
    property({ type: String })
], YpAiChatbotItemBase.prototype, "detectedLanguage", void 0);
__decorate([
    property({ type: Number })
], YpAiChatbotItemBase.prototype, "clusterId", void 0);
__decorate([
    property({ type: String })
], YpAiChatbotItemBase.prototype, "type", void 0);
__decorate([
    property({ type: Boolean })
], YpAiChatbotItemBase.prototype, "spinnerActive", void 0);
__decorate([
    property({ type: Boolean })
], YpAiChatbotItemBase.prototype, "fullReferencesOpen", void 0);
__decorate([
    property({ type: String })
], YpAiChatbotItemBase.prototype, "followUpQuestionsRaw", void 0);
__decorate([
    property({ type: Array })
], YpAiChatbotItemBase.prototype, "followUpQuestions", void 0);
__decorate([
    property({ type: Boolean })
], YpAiChatbotItemBase.prototype, "jsonLoading", void 0);
__decorate([
    property({ type: Boolean })
], YpAiChatbotItemBase.prototype, "isSpeaking", void 0);
YpAiChatbotItemBase = __decorate([
    customElement("yp-chatbot-item-base")
], YpAiChatbotItemBase);
export { YpAiChatbotItemBase };
//# sourceMappingURL=yp-chatbot-item-base.js.map