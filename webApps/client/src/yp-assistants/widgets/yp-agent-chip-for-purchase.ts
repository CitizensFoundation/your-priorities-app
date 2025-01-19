import { customElement, property } from "lit/decorators.js";
import { YpAgentChip } from "./yp-agent-chip.js";
import { css, html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

@customElement("yp-agent-chip-for-purchase")
export class YpAgentChipForPurchase extends YpAgentChip {
  @property({ type: Number })
  price!: number;

  @property({ type: String })
  type: string = "coming_soon";

  @property({ type: String })
  currency!: string;

  @property({ type: Number })
  maxRunsPerCycle!: number;

  @property({ type: String })
  isSubscribed!: string | undefined;

  static override get styles() {
    return [
      super.styles,
      css`
        .purchase-info {
          text-align: right;
        }

        .coming-soon-info {
          font-size: 13px;
          font-weight: 500;
          color: var(--yp-sys-color-agent-blue);
          text-transform: uppercase;
          text-align: right;
          margin-bottom: 8px;
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

        .subscribed-status {
          color: var(--yp-sys-color-agent-green);
          text-transform: uppercase;
          font-weight: 600;
          font-size: 14px;
          margin-left: 4px;
        }

        .container {
          width: calc(768px - 48px);
          border: 1px solid #eaeaea;
          padding: 16px;
          margin-bottom: 16px;
        }

        .container[isSubscribed] {
          border: 1px solid var(--yp-sys-color-agent-green);
        }
      `,
    ];
  }

  getSubscribedStatus() {
    return this.isSubscribed ? this.t('subscribed') : "";
  }

  override render() {
    return html`
      <div class="layout horizontal container" ?isSubscribed="${this.isSubscribed}">
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
              <div class="agent-name">
                ${unsafeHTML(this.agentName)} <span class="subscribed-status">${this.getSubscribedStatus()}</span>
              </div>
            </div>
            <div class="flex"></div>
            <div class="layout vertical self-end">
              <div class="free-trial"><div ?hidden="${this.price > 0}">${this.t("freeTrial")}</div></div>
              <div class="coming-soon-info"><div ?hidden="${this.type != "coming_soon" || this.isSubscribed}">${this.t("comingSoon")}</div></div>
              <div class="purchase-info" ?hidden="${this.type != "paid"}">
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
}
