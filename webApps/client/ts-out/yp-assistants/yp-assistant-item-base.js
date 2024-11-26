var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";
import { YpAiChatbotItemBase } from "../yp-chatbots/yp-chatbot-item-base.js";
import { resolveMarkdown } from "../common/litMarkdown/litMarkdown.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import "./widgets/yp-agent-chip.js";
import "./widgets/yp-agent-chip-for-purchase.js";
import "./widgets/yp-login-widget.js";
import "./widgets/yp-agent-configuration-widget.js";
import "./widgets/yp-agent-workflow-widget.js";
import "./widgets/yp-agent-run-widget.js";
import "./widgets/yp-configuration-submitted.js";
let YpAssistantItemBase = class YpAssistantItemBase extends YpAiChatbotItemBase {
    constructor() {
        super(...arguments);
        this.isVoiceMode = false;
        this.isListening = false;
        this.isSpeaking = false;
    }
    firstUpdated(changedProps) {
        super.firstUpdated(changedProps);
    }
    updated(changedProps) {
        super.updated(changedProps);
    }
    static get styles() {
        return [
            super.styles,
            css `
        .voice-status {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          color: var(--md-sys-color-secondary);
        }

        .voice-icon {
          --md-icon-size: 24px;
          animation: pulse 2s infinite;
        }

        .voice-icon[speaking] {
          color: var(--md-sys-color-primary);
        }

        .voice-icon[listening] {
          color: var(--md-sys-color-tertiary);
        }

        .component-container {
          margin-top: 16px;
        }

        .userChatDialog {
          color: var(--md-sys-color-on-surface);
          background-color: var(--md-sys-color-surface-container);
          padding: 0px;
          margin: 16px;
          margin-left: 0;
          margin-right: 0;
          line-height: 1.5;
          margin-bottom: 0px;
          border-radius: 50px;
          margin-left: auto;
        }

        .chatGPTDialog {
          margin: 0;
        }


        .chatText {
          padding: 16px;
          margin: 0;
          font-size: 15px;
          font-weight: 400;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `,
        ];
    }
    renderChatGPT() {
        return html `
      <div class="layout vertical chatGPTDialogContainer">
        <div class="chatGPTDialog layout vertical" ?error="${this.isError}">
          <div class="layout horizontal">
            ${!this.htmlToRender
            ? html `
                  <div class="layout vertical chatImage">
                    ${this.renderCGImage()}
                  </div>
                `
            : nothing}
            <div class="layout vertical">
              ${resolveMarkdown(this.message, {
            includeImages: true,
            includeCodeBlockClassNames: true,
            handleJsonBlocks: true,
            targetElement: this,
        })}
              ${this.htmlToRender
            ? html `
                    <div class="component-container">
                      ${unsafeHTML(this.htmlToRender)}
                    </div>
                  `
            : nothing}
            </div>
          </div>
        </div>
      </div>
    `;
    }
    renderUser() {
        return html `
      <div class="userChatDialog layout horizontal">
        <div class="flex"></div>
        <div class="chatText">${this.message}</div>
      </div>
    `;
    }
};
__decorate([
    property({ type: Boolean })
], YpAssistantItemBase.prototype, "isVoiceMode", void 0);
__decorate([
    property({ type: Boolean })
], YpAssistantItemBase.prototype, "isListening", void 0);
__decorate([
    property({ type: Boolean })
], YpAssistantItemBase.prototype, "isSpeaking", void 0);
__decorate([
    property({ type: String })
], YpAssistantItemBase.prototype, "htmlToRender", void 0);
YpAssistantItemBase = __decorate([
    customElement("yp-assistant-item-base")
], YpAssistantItemBase);
export { YpAssistantItemBase };
//# sourceMappingURL=yp-assistant-item-base.js.map