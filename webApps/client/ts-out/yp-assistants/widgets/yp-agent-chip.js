var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, property } from "lit/decorators.js";
import { YpBaseElement } from "../../common/yp-base-element.js";
import { css, html } from "lit";
import '@material/web/iconbutton/filled-icon-button.js';
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
        }

        .agent-chip[isSelected] {
          background-color: var(--md-sys-color-surface-variant);
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

        .agent-name[isUnsubscribed] {
          color: var(--yp-sys-color-down);
        }

        .agent-description {
          color: var(--secondary-text-color);
          font-size: 0.9em;
          line-height: 1.4;
        }

        md-filled-icon-button {
          margin-left: 32px;
          margin-top: 8px;
        }
      `,
        ];
    }
    getStatus() {
        return this.isUnsubscribed ? "unsubscribed" : this.isSelected ? "selected" : "";
    }
    render() {
        return html `
      <div class="agent-chip" ?isSelected="${this.isSelected}" ?isUnsubscribed="${this.isUnsubscribed}">
        <img src="${this.agentImageUrl}" alt="${this.agentName}" />
        <div class="content">
          <div class="layout horizontal">
            <div class="layout vertical">
              <div class="agent-name" ?isUnsubscribed="${this.isUnsubscribed}">${this.agentName} ${this.getStatus()}</div>
              <div class="agent-description">${this.agentDescription}</div>
            </div>
            <md-filled-icon-button><md-icon>play_arrow</md-icon></md-filled-icon-button>
          </div>
        </div>
      </div>
    `;
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
    property({ type: String })
], YpAgentChip.prototype, "isSelected", void 0);
__decorate([
    property({ type: String })
], YpAgentChip.prototype, "isUnsubscribed", void 0);
YpAgentChip = __decorate([
    customElement("yp-agent-chip")
], YpAgentChip);
export { YpAgentChip };
//# sourceMappingURL=yp-agent-chip.js.map