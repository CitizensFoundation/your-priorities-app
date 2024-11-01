var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";
import { YpAiChatbotItemBase } from '../yp-llms/yp-chatbot-item-base.js';
import { resolveMarkdown } from "../common/litMarkdown/litMarkdown.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import "./yp-agent-chip.js";
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
          padding: 8px;
          background: var(--md-sys-color-surface-variant);
          border-radius: 8px;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `
        ];
    }
    renderVoiceStatus() {
        if (!this.isVoiceMode)
            return nothing;
        return html `
      <div class="voice-status">
        ${this.isListening
            ? html `
              <md-icon class="voice-icon" listening>mic</md-icon>
              <span>${this.t('Listening...')}</span>
            `
            : nothing}
        ${this.isSpeaking
            ? html `
              <md-icon class="voice-icon" speaking>volume_up</md-icon>
              <span>${this.t('Speaking...')}</span>
            `
            : nothing}
      </div>
    `;
    }
    renderChatGPT() {
        return html `
      <div class="layout vertical chatGPTDialogContainer">
        <div class="chatGPTDialog layout vertical" ?error="${this.isError}">
          <div class="layout horizontal">
            <div class="layout vertical chatImage">
              ${this.renderCGImage()}
            </div>
            <div class="layout vertical chatText">
              ${resolveMarkdown(this.message, {
            includeImages: true,
            includeCodeBlockClassNames: true,
            handleJsonBlocks: true,
            targetElement: this,
        })}
              ${this.htmlToRender ? html `
              <div class="component-container">
                ${unsafeHTML(this.htmlToRender)}
              </div>
            ` : nothing}
            </div>
          </div>
        </div>

      </div>
    `;
    }
    renderUser() {
        return html `
      <div class="userChatDialog layout horizontal">
        <div class="layout vertical chatImage">
          ${this.renderRoboImage()}
        </div>
        <div class="layout vertical">
          <div class="chatText">
            ${this.message}
          </div>
          ${this.renderVoiceStatus()}
              ${this.htmlToRender ? html `
                <div class="component-container">
                  ${unsafeHTML(this.htmlToRender)}
                </div>
              ` : nothing}
        </div>
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