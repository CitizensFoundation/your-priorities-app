import { customElement, property } from "lit/decorators.js";
import { YpBaseElement } from "../../common/yp-base-element.js";
import { css, html } from "lit";

import "@material/web/iconbutton/filled-icon-button.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

@customElement("yp-agent-chip")
export class YpAgentChip extends YpBaseElement {
  @property({ type: Number })
  agentId!: number;

  @property({ type: String })
  agentName!: string;

  @property({ type: String })
  agentDescription!: string;

  @property({ type: String })
  agentImageUrl!: string;

  @property({ type: Boolean })
  isSelected!: boolean;

  @property({ type: String })
  isUnsubscribed: string | undefined;

  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          width: 100%;
        }

        .agent-chip {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 16px;
          background-color: var(--md-sys-color-surface-container-low);
          border-radius: 8px;
          gap: 16px;
          margin-left: 128px;
        }

        .agent-chip[isSelected] {
          background-color: var(--yp-sys-color-agent-green-10);
          margin-left: 0;
          width: calc(768px - 44px);
          padding: 16px;
          border-radius: 4px;
        }


        .selectedSwitchTo {
          margin-top: 4px;
        }

        img {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
        }

        .content {
          flex: 1;
          min-width: 0;
        }

        .agent-name-container {
          font-weight: 500;
          font-size: 15px;
        }

        .agent-name {
          font-weight: 700;
          font-size: 15px;
          margin-bottom: 4px;
        }

        .selectedImage {
          margin-right: 16px;
        }

        .agent-name[isUnsubscribed] {
          color: var(--yp-sys-color-down);
        }

        .agent-description {
          color: var(--secondary-text-color);
          font-size: 0.9em;
          line-height: 1.4;
        }

        .status {
          font-size: 16px;
          font-weight: 600;
          color: var(--yp-sys-color-agent-blue);
          text-transform: uppercase;
          padding-left: 8px;
        }

        .textMuted {
          opacity: 0.5;
        }

        .textBold {
          font-weight: 700;
        }

        md-filled-icon-button {
          margin-left: 32px;
          margin-top: 8px;
        }
      `,
    ];
  }

  getStatus() {
    return this.isUnsubscribed
      ? "unsubscribed"
      : this.isSelected
      ? "selected"
      : "";
  }

  override render() {
    if (this.isSelected) {
      return html`
        <div
          class="agent-chip layout vertical center-center"
          ?isSelected="${this.isSelected}"
          ?isUnsubscribed="${this.isUnsubscribed}"
        >
          <div class="layout horizontal center-center">
            <img class="selectedImage" src="${this.agentImageUrl}" alt="${this.agentName}" />
            <div class="layout vertical center-center">
              <div class="agent-name-container selectedSwitchTo">
                ${this.t("youHaveSwitchedTo")}
              </div>
              <div class="agent-name" ?isUnsubscribed="${this.isUnsubscribed}">
                ${this.agentName}
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      return html`
        <div
          class="agent-chip"
          ?isSelected="${this.isSelected}"
          ?isUnsubscribed="${this.isUnsubscribed}"
        >
          <img src="${this.agentImageUrl}" alt="${this.agentName}" />
          <div class="content">
            <div class="layout horizontal">
              <div class="layout vertical">
                <div
                  class="agent-name"
                  ?isUnsubscribed="${this.isUnsubscribed}"
                >
                  ${this.agentName}
                  <span class="status" ?hidden="${!this.getStatus()}"
                    >${this.getStatus()}</span
                  >
                </div>
                <div class="agent-description" ?hidden="${this.isSelected}">
                  ${this.agentDescription}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }
}
