import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
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
import { TonalButton } from '@material/web/button/lib/tonal-button';
import { TextArea } from '@material/mwc-textarea/mwc-textarea.js';
import { OutlinedField } from '@material/web/field/lib/outlined-field';
import { OutlinedTextField } from '@material/web/textfield/lib/outlined-text-field';

@customElement('yp-new-ad-group')
export class YpNewAdGroup extends YpBaseElementWithLogin {
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
        mwc-dialog div {
          flex-direction: column;
        }

        mwc-dialog div,
        md-radio {
          display: flex;
        }

        .button {
          padding-right: 16px;
          padding-bottom: 24px;
        }

        .okButton {
          padding-right: 24px;
        }

        .headerText {
          color: var(--md-sys-color-on-surface);
          font-size: 18px;
          margin-top: 16px;
          margin-bottom: 8px;
        }

        mwc-dialog {
          --mdc-shape-medium: 24px !important;
          --mdc-theme-surface: var(--md-sys-color-surface);
          --mdc-dialog-heading-ink-color: var(--md-sys-color-on-surface);
          --mdc-dialog-box-shadow: none;
        }

        md-outlined-text-field {
          width: 350px;
        }

        mwc-textarea {
          width: 350px;
          --mdc-theme-primary: var(--md-sys-color-primary);
          --mdc-text-field-ink-color: var(--md-sys-color-on-surface);
          --mdc-text-area-outlined-hover-border-color: var(
            --md-sys-color-on-surface
          );
          --mdc-text-area-outlined-idle-border-color: var(
            --md-sys-color-on-surface
          );
          --mdc-notched-outline-border-color: var(
            --md-sys-color-on-surface-variant
          );
        }

        mwc-textarea.rounded {
          --mdc-shape-small: 4px;
        }
        .formField {
          margin-top: 16px;
        }

        md-formfield {
          width: 130px;
        }

        .otherFormField {
          width: 50px;
          margin-top: 8px;
        }
      `,
    ];
  }

  open() {
    const dialog = this.$$('mwc-dialog') as Dialog;
    dialog.show();
  }

  textChanged() {
    const okButton = this.$$('md-tonal-button') as TonalButton;
    const textArea = this.$$('mwc-textarea') as TextArea;
    const textField = this.$$('md-outlined-text-field') as OutlinedTextField;
    if (textArea.value.length > 0 && textField.value.length > 0) {
      okButton.disabled = false;
    } else {
      okButton.disabled = true;
    }
  }

  renderAdMediums() {
    return html`
      <div class="layout vertical center-center">
        <div class="layout horizontal wrap">
          <md-formfield .label="${this.t('Facebook')}">
            <md-checkbox name="facebook"></md-checkbox>
          </md-formfield>
          <md-formfield .label="${this.t('Twitter')}">
            <md-checkbox name="twitter"></md-checkbox>
          </md-formfield>
          <md-formfield .label="${this.t('LinkedIn')}">
            <md-checkbox name="linkedin"></md-checkbox>
          </md-formfield>
        </div>
        <div class="layout horizontal wrap">
          <md-formfield .label="${this.t('Instagram')}">
            <md-checkbox name="instagram"></md-checkbox>
          </md-formfield>
          <md-formfield .label="${this.t('TikTok')}">
            <md-checkbox name="tiktok"></md-checkbox>
          </md-formfield>
          <md-formfield .label="${this.t('Email')}">
            <md-checkbox name="email"></md-checkbox>
          </md-formfield>
        </div>
        <div class="layout horizontal wrap">
          <md-formfield class="otherFormField">
            <md-checkbox name="other"></md-checkbox>
          </md-formfield>
          <md-outlined-text-field
            class="formField"
            disabled
            .label="${this.t('other')}"
          ></md-outlined-text-field>
        </div>
      </div>
    `;
  }

  renderInput() {
    return html`
      <div class="layout vertical">
        <md-outlined-text-field
          class="formField"
          @keydown="${this.textChanged}"
          .label="${this.t('targetAudience')}"
        ></md-outlined-text-field>

        <mwc-textarea
          rows="5"
          class="rounded formField"
          label="${this.t('promotionText')}"
          outlined
          charCounter
          @keydown="${this.textChanged}"
        >
        </mwc-textarea>

        <div class="headerText">${this.t('chooseAdMediums')}</div>

        ${this.renderAdMediums()}
      </div>
    `;
  }

  renderPreview() {
    return html`
      <div class="layout vertical center-center">
        <div class="headerText">${this.t('promotionPreview')}</div>
      </div>
    `;
  }

  render() {
    return html`
      <mwc-dialog heading="${this.t('newTrackingPromotion')}">
        <div class="layout horizontal">
          ${this.renderInput()} ${this.renderPreview()}
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
          disabled
          class="button okButton"
          .label="${this.t('save')}"
          slot="primaryAction"
        >
        </md-tonal-button>
      </mwc-dialog>
    `;
  }
}
