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

  @property({ type: String })
  avatarUrl?: string;

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
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 8px;
        }

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
          margin-bottom: 8px;
          border-radius: 50px;
          margin-left: auto;
        }

        .chatGPTDialog {
          margin: 0;
        }

        .chatText {
          padding: 8px;
          padding-left: 16px;
          padding-right: 16px;
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

  renderAvatar() {
    if (this.avatarUrl) {
      return html`<img class="avatar" src="${this.avatarUrl}" />`;
    } else {
      return this.renderCGImage();
    }
  }

  override renderChatGPT() {
    return html`
      <div
        class="layout vertical chatGPTDialogContainer"
        ?hidden="${this.message == "" && this.htmlToRender == ""}"
      >
        <div class="chatGPTDialog layout vertical" ?error="${this.isError}">
          <div class="layout horizontal">
            ${!this.htmlToRender
              ? html`
                  <div class="layout vertical chatImage">
                    ${this.renderAvatar()}
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
                ? html`
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

  override renderUser() {
    return html`
      <div class="userChatDialog layout horizontal">
        <div class="flex"></div>
        <div class="chatText">${this.message}</div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "yp-assistant-item-base": YpAssistantItemBase;
  }
}
