import { customElement, property } from "lit/decorators.js";
import { YpAssistantBase } from "./yp-assistant-base.js";
import { YpLanguages } from "../common/languages/ypLanguages.js";
import { YpAssistantServerApi } from "./AssistantServerApi.js";
import { css, html } from "lit";
import { YpCollection } from "../yp-collection/yp-collection.js";
import { YpBaseElementWithLogin } from "../common/yp-base-element-with-login.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

@customElement("yp-assistant-welcome")
export class YpAssistantWelcome extends YpBaseElementWithLogin {
  @property({ type: String })
  welcomeTextHtml!: string;

  @property({ type: String })
  avatarUrl!: string;

  static override get styles() {
    return [
      super.styles,
      css`
        .talking-head-image {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          align-self: start;
          margin-right: 40px;
        }


        .voice-mode-toggle {
          margin-top: 70px;
          margin-bottom: 70px;
        }

        md-icon.voiceModeToggleIcon {
          --md-icon-size: 81px;
          width: 81px;
          height: 81px;
        }

        .welcomeContainer {
          align-self: center;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }

        .mainContent {
          max-width: 460px;
        }

        .green {
          color: var(--yp-sys-color-agent-green);
          font-weight: 600;
        }

        .title {
          font-family: var(--md-ref-typeface-brand);
          font-size: 50px;
          font-weight: 700;
          line-height: 75.6px;
        }

        .mainText {
          font-size: 20px;
          font-weight: 400;
        }

        .messageMeText {
          --md-text-button-label-text-size: 20px;
          --md-text-button-label-text-line-height: 40px;
          margin-top: 46px;
          --md-text-button-label-text-weight: 700;
          border-radius: 0;
          --md-text-button-label-text-color: var(--md-sys-color-on-surface);
          border-bottom: 3px solid var(--md-sys-color-primary-container);
        }

        .
      `,
    ];
  }

  startInVoiceMode(event: CustomEvent) {
    this.fire("yp-start-voice-mode", event);
  }

  renderVoiceStartIcon() {
    return html`<svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="20" cy="20" r="20" fill="#2ECC71" />
      <rect width="24" height="24" transform="translate(8 8)" fill="#2ECC71" />
      <path
        d="M15 29.5H17V31.5H15V29.5ZM20 20.5C21.66 20.5 23 19.16 23 17.5V11.5C23 9.84 21.66 8.5 20 8.5C18.34 8.5 17 9.84 17 11.5V17.5C17 19.16 18.34 20.5 20 20.5ZM19 11.5C19 10.95 19.45 10.5 20 10.5C20.55 10.5 21 10.95 21 11.5V17.5C21 18.06 20.56 18.5 20 18.5C19.45 18.5 19 18.05 19 17.5V11.5ZM19 29.5H21V31.5H19V29.5ZM23 29.5H25V31.5H23V29.5ZM27 17.5H25.3C25.3 20.5 22.76 22.6 20 22.6C17.24 22.6 14.7 20.5 14.7 17.5H13C13 20.91 15.72 23.73 19 24.22V27.5H21V24.22C24.28 23.73 27 20.91 27 17.5Z"
        fill="white"
      />
    </svg> `;
  }

  renderVoiceButton() {
    return html`<md-icon-button
      ?has-static-theme="${this.hasStaticTheme}"
      class="voice-mode-toggle"
      @click="${this.startInVoiceMode}"
      .label="${this.t("voiceAssistant")}"
    >
      <md-icon class="voiceModeToggleIcon">
        ${this.renderVoiceStartIcon()}</md-icon
      ></md-icon-button
    >`;
  }

  renderVoiceTalkingHead() {
    return html`
      <div class="layout horizontal avatarImage">
        <img
          class="talking-head-image"
          src="${this.avatarUrl}"
          alt="Voice Assistant Image"
        />
      </div>
    `;
  }

  override render() {
    return html`
      <div class="layout vertical center-center welcomeContainer">
        <div class="layout horizontal">
          ${this.renderVoiceTalkingHead()}
          <div class="layout vertical mainContent">
            <div class="title">${this.t("welcome")}</div>
            <div class="mainText">${unsafeHTML(this.welcomeTextHtml)}</div>
            <div class="layout vertical center-center">
              ${this.renderVoiceButton()}
            </div>
            <div class="mainText layout vertical center-center">
              ${this.t("orifyoucanttalkmessage")}
            </div>
            <div class="layout vertical center-center">
              <md-text-button class="messageMeText"
                >${this.t("messageMe")}
              </md-text-button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
