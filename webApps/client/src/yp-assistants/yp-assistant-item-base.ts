import { css, html, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";
import { YpAiChatbotItemBase } from '../yp-chatbots/yp-chatbot-item-base.js';
import { resolveMarkdown } from "../common/litMarkdown/litMarkdown.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import "./yp-agent-chip.js";
import "./yp-agent-chip-for-purchase.js";

@customElement("yp-assistant-item-base")
export class YpAssistantItemBase extends YpAiChatbotItemBase {
  @property({ type: Boolean })
  isVoiceMode = false;

  @property({ type: Boolean })
  isListening = false;

  @property({ type: Boolean })
  override isSpeaking = false;

  @property({ type: String })
  htmlToRender?: string;

  override firstUpdated(changedProps: Map<string, any>) {
    super.firstUpdated(changedProps);
  }

  override updated(changedProps: Map<string, any>) {
    super.updated(changedProps);
  }

  static override get styles() {
    return [
      super.styles,
      css`
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
    if (!this.isVoiceMode) return nothing;

    return html`
      <div class="voice-status">
        ${this.isListening
          ? html`
              <md-icon class="voice-icon" listening>mic</md-icon>
              <span>${this.t('Listening...')}</span>
            `
          : nothing}
        ${this.isSpeaking
          ? html`
              <md-icon class="voice-icon" speaking>volume_up</md-icon>
              <span>${this.t('Speaking...')}</span>
            `
          : nothing}
      </div>
    `;
  }

  override renderChatGPT() {
    return html`
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
              ${this.htmlToRender ? html`
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


  override renderUser() {
    return html`
      <div class="userChatDialog layout horizontal">
        <div class="layout vertical chatImage">
          ${this.renderRoboImage()}
        </div>
        <div class="layout vertical">
          <div class="chatText">
            ${this.message}
          </div>
          ${this.renderVoiceStatus()}
              ${this.htmlToRender ? html`
                <div class="component-container">
                  ${unsafeHTML(this.htmlToRender)}
                </div>
              ` : nothing}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "yp-assistant-item-base": YpAssistantItemBase;
  }
}