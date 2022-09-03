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
import '@material/web/button/tonal-button.js';
import '@material/web/button/text-button.js';

import '@material/web/checkbox/checkbox.js';

import '@material/mwc-textarea/mwc-textarea.js';

import '@material/web/textfield/outlined-text-field.js';
import '@material/web/textfield/filled-text-field.js';

import { Dialog } from '@material/mwc-dialog';
import { TonalButton } from '@material/web/button/lib/tonal-button.js';
import { TextArea } from '@material/mwc-textarea/mwc-textarea.js';
import { OutlinedTextField } from '@material/web/textfield/lib/outlined-text-field';
import { Checkbox } from '@material/web/checkbox/lib/checkbox.js';

import { YpCollectionHelpers } from '../@yrpri/common/YpCollectionHelpers';

import '../@yrpri/common/yp-image.js';
import { YpFormattingHelpers } from '../@yrpri/common/YpFormattingHelpers';

@customElement('yp-campaign')
export class YpCampaign extends YpBaseElementWithLogin {
  @property({ type: String })
  collectionType!: string;

  @property({ type: Number })
  collectionId!: number | string;

  @property({ type: Object })
  collection: YpCollectionData | undefined;

  @property({ type: Object })
  campaign!: YpCampaignData;

  static get styles() {
    return [super.styles, css``];
  }

  renderMedium(medium: YpCampaignMediumData) {
    return html`
      <div class="mediumCard">
        <div class="layout vertical">${medium.utm_medium}}</div>
      </div>
    `;
  }

  renderMediums() {
    return html`
      <div class="layout vertical adMediumsList">
        <md-formfield .label="${this.t('Facebook')}">
          <md-checkbox name="facebook"></md-checkbox>
        </md-formfield>
        <md-formfield .label="${this.t('Twitter')}">
          <md-checkbox name="twitter"></md-checkbox>
        </md-formfield>
        <md-formfield .label="${this.t('AdWords')}">
          <md-checkbox name="adwords"></md-checkbox>
        </md-formfield>
        <md-formfield .label="${this.t('LinkedIn')}">
          <md-checkbox name="linkedin"></md-checkbox>
        </md-formfield>
        <md-formfield .label="${this.t('Instagram')}">
          <md-checkbox name="instagram"></md-checkbox>
        </md-formfield>
        <md-formfield .label="${this.t('YouTube')}">
          <md-checkbox name="youtube"></md-checkbox>
        </md-formfield>
        <md-formfield .label="${this.t('TikTok')}">
          <md-checkbox name="tiktok"></md-checkbox>
        </md-formfield>
        <md-formfield .label="${this.t('Email')}">
          <md-checkbox name="email"></md-checkbox>
        </md-formfield>
        <md-formfield .label="${this.t('other')}" class="otherFormField">
          <md-checkbox name="other"></md-checkbox>
        </md-formfield>
        <md-outlined-text-field
          class="formField otherTextField"
          hidden
          .label="${this.t('other')}"
        ></md-outlined-text-field>
      </div>
    `;
  }

  render() {
    return html`
      <div class="layout horizontal">
        ${this.campaign.configuration.mediums.map(medium =>
          this.renderMedium(medium)
        )}
      </div>
    `;
  }
}
