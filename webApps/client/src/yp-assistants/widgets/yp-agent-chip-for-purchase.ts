import { customElement, property } from "lit/decorators.js";
import { YpAgentChip } from "./yp-agent-chip.js";
import { css, html } from "lit";

@customElement("yp-agent-chip-for-purchase")
export class YpAgentChipForPurchase extends YpAgentChip {
  @property({ type: Number })
  price!: number;

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
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid var(--divider-color);
        }

        .price {
          font-size: 1.2em;
          font-weight: 600;
          color: var(--primary-color);
        }

        .runs-info {
          color: var(--secondary-text-color);
          font-size: 0.9em;
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
      `,
    ];
  }

  getSubscribedStatus() {
    return this.isSubscribed ? " (subscribed)" : "";
  }

  override render() {
    return html`
      <div class="agent-chip">
        <img src="${this.agentImageUrl}" alt="${this.agentName}" />
        <div class="content">
          <div class="agent-name" ?isSubscribed="${this.isSubscribed}">${this.agentName} ${this.getSubscribedStatus()}</div>
          <div class="agent-description">${this.agentDescription}</div>
          <div class="purchase-info">
            <div class="${this.currency=="USD" ? "price" : "price-other-currency"}">${this.currency=="USD" ? "$" : this.currency+" "}${this.price}</div>
            <div class="runs-info">
              ${this.maxRunsPerCycle} runs per month
            </div>
            <md-filled-icon-button>
              <md-icon>shopping_cart</md-icon>
            </md-filled-icon-button>
          </div>
        </div>
      </div>
    `;
  }
}