import { LitElement, css, html, nothing } from 'lit';
import {
  property,
  customElement,
  queryAll,
  queryAsync,
} from 'lit/decorators.js';
import { YpBaseElementWithLogin } from '../@yrpri/common/yp-base-element-with-login';

import '@material/web/fab/fab-extended.js';
import '@material/web/formfield/formfield.js';
import '@material/web/radio/radio.js';
import '@material/web/button/elevated-button.js';
import '@material/web/button/text-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/filled-button.js';

import '@material/web/checkbox/checkbox.js';

import '@material/web/iconbutton/standard-icon-button.js';

import { Dialog } from '@material/mwc-dialog';
import { TonalButton } from '@material/web/button/lib/tonal-button.js';
import { TextArea } from '@material/mwc-textarea/mwc-textarea.js';
import { OutlinedTextField } from '@material/web/textfield/lib/outlined-text-field';
import { Checkbox } from '@material/web/checkbox/lib/checkbox.js';

import { YpCollectionHelpers } from '../@yrpri/common/YpCollectionHelpers';

import '../@yrpri/common/yp-image.js';
import { YpFormattingHelpers } from '../@yrpri/common/YpFormattingHelpers';
import { YpCampaignApi } from '../yp-promotion/YpCampaignApi.js';
import { YpCampaign } from '../yp-promotion/yp-campaign';

@customElement('yp-campaign-analysis')
export class YpCampaignAnalysis extends YpCampaign {
  static get styles() {
    return [
      super.styles,
      css`
        .mediumImage {
          width: 20px;
          height: 20px;
        }
      `,
    ];
  }

  renderMediumTopStats(medium: YpCampaignAnalyticsMediumData) {
    return html`
      <div class="layout vertical center-center mediumStats">
        ${medium.topStats.map(
          stat => html`
            <div class="layout horizontal center-center">
              <div class="statValue">${stat.value}</div>
              <div class="statLabel">${stat.name}</div>
            </div>
          `
        )}
      </div>
    `;
  }

  renderMedium(medium: YpCampaignAnalyticsMediumData) {
    return html`
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

  render() {
    return html`
      <div class="layout vertical mainContainer">
        <div class="layout horizontal">
          <div class="campaignName">
            ${this.campaign.configuration.utm_campaign}
          </div>
        </div>
        <div class="layout horizontal mediumsContainer">
          ${this.campaign.configuration.mediums.map(medium =>
            this.renderMedium(medium as YpCampaignAnalyticsMediumData)
          )}
        </div>
      </div>
    `;
  }
}
