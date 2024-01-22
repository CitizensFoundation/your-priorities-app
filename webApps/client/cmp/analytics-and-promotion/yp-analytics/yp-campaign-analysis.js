var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html } from 'lit';
import { customElement, } from 'lit/decorators.js';
import '@material/web/radio/radio.js';
import '@material/web/button/elevated-button.js';
import '@material/web/button/text-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/filled-button.js';
import '@material/web/checkbox/checkbox.js';
import '@material/web/iconbutton/icon-button.js';
import '../../common/yp-image.js';
import { YpCampaign } from '../yp-promotion/yp-campaign';
let YpCampaignAnalysis = class YpCampaignAnalysis extends YpCampaign {
    static get styles() {
        return [
            super.styles,
            css `
        .mediumImage {
          width: 42px;
          height: 42px;
          margin-top: 12px;
          margin-bottom: 16px;
        }

        .mainContainer {
          width: 1050px;
          height: 200px;
        }

        @media (max-width: 1100px) {
          .mainContainer {
            width: 100%;
            max-width: calc(100vw - 80px);
          }
        }

        .mediumTopStats {
          font-size: 14px;
          text-align: left;
          width: 150px;
        }

        .mediumCard {
          width: 150px;
        }

        .mediumInnerCard {
          width: 150px;
        }

        .statValue {
          text-align: right;
          margin-bottom: 2px;
          color: var(--md-sys-color-on-secondary-container);
        }

        .statLabel {
          text-align: left;
          margin-bottom: 2px;
          color: var(--md-sys-color-on-secondary-container);
        }

        .mediumsContainer {
          height: 220px;
        }
      `,
        ];
    }
    renderMediumTopStats(medium) {
        return html `
      <div class="layout vertical mediumTopStats">
        ${medium.topStats.map(stat => html `
            <div class="layout horizontal">
              <div class="column self-start">
                <div class="statLabel">${this.t(stat.name)}</div>
              </div>
              <div class="flex"></div>
              <div class="column self-end">
                <div class="statValue">${stat.value}${stat.name === "Bounce rate" ? "%" : ""}</div>
              </div>
            </div>
          `)}
      </div>
    `;
    }
    renderMedium(medium) {
        return html `
      <div class="mediumCard ${medium.active ? '' : 'disabledCard'}">
        <div class="layout vertical center-center mediumInnerCard">
          <div>${this.t(medium.utm_medium)}</div>
          <yp-image
            class="mediumImage"
            sizing="contain"
            .src="${this.getMediumImageUrl(medium.utm_medium)}"
          >
          </yp-image>

          ${this.renderMediumTopStats(medium)}
        </div>
      </div>
    `;
    }
    get orderedMedium() {
        return this.campaign.configuration.mediums.sort((a, b) => {
            return (b.topStats[0].value -
                a.topStats[0].value);
        });
    }
    render() {
        return html `
      <div class="layout vertical mainContainer">
        <div class="layout horizontal">
          <div class="campaignName">
            ${this.campaign.configuration.utm_campaign}
          </div>
        </div>
        <div class="layout horizontal mediumsContainer">
          ${this.orderedMedium.map(medium => this.renderMedium(medium))}
        </div>
      </div>
    `;
    }
};
YpCampaignAnalysis = __decorate([
    customElement('yp-campaign-analysis')
], YpCampaignAnalysis);
export { YpCampaignAnalysis };
//# sourceMappingURL=yp-campaign-analysis.js.map