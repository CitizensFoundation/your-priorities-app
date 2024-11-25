var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, property } from "lit/decorators.js";
import { YpBaseElement } from "../../common/yp-base-element.js";
import { css, html } from "lit";
import "@material/web/iconbutton/filled-icon-button.js";
let YpAgentChip = class YpAgentChip extends YpBaseElement {
    static get styles() {
        return [
            super.styles,
            css `
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

        .agent-name {
          font-weight: 500;
          font-size: 1.1em;
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
    render() {
        if (this.isSelected) {
            return html `
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
        }
        else {
            return html `
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
};
__decorate([
    property({ type: Number })
], YpAgentChip.prototype, "agentId", void 0);
__decorate([
    property({ type: String })
], YpAgentChip.prototype, "agentName", void 0);
__decorate([
    property({ type: String })
], YpAgentChip.prototype, "agentDescription", void 0);
__decorate([
    property({ type: String })
], YpAgentChip.prototype, "agentImageUrl", void 0);
__decorate([
    property({ type: Boolean })
], YpAgentChip.prototype, "isSelected", void 0);
__decorate([
    property({ type: String })
], YpAgentChip.prototype, "isUnsubscribed", void 0);
YpAgentChip = __decorate([
    customElement("yp-agent-chip")
], YpAgentChip);
export { YpAgentChip };
//# sourceMappingURL=yp-agent-chip.js.map