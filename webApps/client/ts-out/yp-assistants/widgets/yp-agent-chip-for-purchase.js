var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, property } from "lit/decorators.js";
import { YpAgentChip } from "./yp-agent-chip.js";
import { css, html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
let YpAgentChipForPurchase = class YpAgentChipForPurchase extends YpAgentChip {
    static get styles() {
        return [
            super.styles,
            css `
        .purchase-info {
          text-align: right;
        }

        .free-trial {
          font-size: 13px;
          font-weight: 500;
          color: var(--yp-sys-color-agent-green);
          text-transform: uppercase;
          text-align: right;
          margin-bottom: 8px;
        }

        .agent-name {
          font-weight: 700;
          font-family: var(--md-ref-typeface-brand);
          font-size: 16px;
        }

        .runs-info {
          font-size: 13px;
          font-weight: 500;
          color: var(--yp-sys-color-agent-blue);
          text-transform: uppercase;
        }

        .price {
          text-align: right;
          font-size: 16px;
          font-weight: 700;
          color: var(--md-sys-color-on-surface);
          font-family: var(--md-ref-typeface-brand);
        }

        .agent-image {
          width: 66px;
          height: 66px;
          margin-right: 16px;
        }

        md-filled-icon-button {
          --md-sys-color-primary: var(--md-sys-color-primary-container);
          margin-left: auto;
        }

        .agent-chip {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          cursor: pointer;
          margin-top: 16px;
          margin-bottom: 16px;
        }

        .agent-chip:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .agent-name[isSubscribed] {
          color: var(--yp-sys-color-up);
        }

        .container {
          width: calc(768px - 48px);
          border: 1px solid #eaeaea;
          padding: 16px;
          margin-bottom: 16px;
        }
      `,
        ];
    }
    getSubscribedStatus() {
        return this.isSubscribed ? " (subscribed)" : "";
    }
    render() {
        return html `
      <div class="layout horizontal container">
        <div>
          <img
            class="agent-image"
            src="${this.agentImageUrl}"
            alt="${this.agentName}"
          />
        </div>
        <div class="layout vertical flex">
          <div class="layout horizontal">
            <div class="layout vertical">
              <div class="runs-info">
                ${this.maxRunsPerCycle} ${this.t("reportsPerMonth")}
              </div>
              <div class="agent-name" ?isSubscribed="${this.isSubscribed}">
                ${unsafeHTML(this.agentName)} ${this.getSubscribedStatus()}
              </div>
            </div>
            <div class="flex"></div>
            <div class="layout vertical self-end">
              <div class="free-trial"><div ?hidden="${this.price > 0}">${this.t("freeTrial")}</div></div>
              <div class="purchase-info">
                <div
                  class="${this.currency == "USD"
            ? "price"
            : "price-other-currency"}"
                >
                  ${this.currency == "USD" ? "$" : this.currency + " "}${this
            .price}
                </div>
              </div>
            </div>
          </div>
          <div class="agent-description">${unsafeHTML(this.agentDescription)}</div>
        </div>
      </div>
    `;
    }
};
__decorate([
    property({ type: Number })
], YpAgentChipForPurchase.prototype, "price", void 0);
__decorate([
    property({ type: String })
], YpAgentChipForPurchase.prototype, "currency", void 0);
__decorate([
    property({ type: Number })
], YpAgentChipForPurchase.prototype, "maxRunsPerCycle", void 0);
__decorate([
    property({ type: String })
], YpAgentChipForPurchase.prototype, "isSubscribed", void 0);
YpAgentChipForPurchase = __decorate([
    customElement("yp-agent-chip-for-purchase")
], YpAgentChipForPurchase);
export { YpAgentChipForPurchase };
//# sourceMappingURL=yp-agent-chip-for-purchase.js.map