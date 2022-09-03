import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { YpBaseElementWithLogin } from '../@yrpri/common/yp-base-element-with-login';

import '@material/web/fab/fab-extended.js';
import '@material/web/formfield/formfield.js';
import '@material/web/radio/radio.js';
import '@material/web/button/tonal-button.js';
import '@material/web/button/text-button.js';

import '@material/web/textfield/outlined-text-field.js';
import '@material/web/textfield/filled-text-field.js';

import { Dialog } from '@material/mwc-dialog';

@customElement('yp-new-ad')
export class YpNewAd extends YpBaseElementWithLogin {
  @property({ type: String })
  collectionType!: string;

  @property({ type: Number })
  collectionId!: number | string;

  @property({ type: Object })
  collection: YpCollectionData | undefined;

  @property({ type: Object })
  campaign: YpCampaignData | undefined;

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --mdc-shape-medium: 16px !important;
        }
        mwc-dialog div {
          flex-direction: column;
        }
        mwc-dialog div,
        md-radio {
          display: flex;
        }

        mwc-dialog {
          --mdc-shape-medium: 28px !important;
          --mdc-theme-surface: #F00;
        }
        .button {
          padding-right: 16px;
          padding-bottom: 24px;
        }
        .okButton {
          padding-right: 24px;
          padding-bottom: 24px;
        }
      `,
    ];
  }

  open() {
    const dialog = this.$$('mwc-dialog') as Dialog;
    dialog.show();
  }

  render() {
    return html`

      <mwc-dialog heading="${this.t('newAdGroup')}">
        <div>
          <md-formfield label="Never Gonna Give You Up">
            <md-radio id="a1" name="a" checked></md-radio>
          </md-formfield>
          <md-formfield label="Hot Cross Buns">
            <md-radio name="a"></md-radio>
          </md-formfield>
          <md-formfield label="None">
            <md-radio name="a"></md-radio>
          </md-formfield>
        </div>

        <div class="layout vertical">
          <md-outlined-text-field label="blah"></md-outlined-text-field>
          <md-filled-text-field rows="5" label="blah"></md-filled-text-field>
        </div>

        <md-text-button
          .label="${this.t('cancel')}"
          class="button"
          dialogAction="cancel"
          slot="secondaryAction"
        >
        </md-text-button>
        <md-tonal-button
          dialogAction="ok"
          disable
          class="button okButton"
          .label="${this.t('create')}"
          slot="primaryAction"
        >
        </md-tonal-button>
      </mwc-dialog>`;
  }
}
