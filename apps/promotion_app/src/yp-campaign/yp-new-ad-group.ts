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

  @property({ type: Boolean })
  previewEnabled = false;

  @property({ type: String })
  targetAudience: string | undefined;

  @property({ type: String })
  promotionText: string | undefined;

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

        .collectionLogoImage {
          width: 350px;
          height: 197px;
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

        .otherTextField {
          width: 79px;
        }

        .adMediumsList {
          margin-top: 3px;
        }
      `,
    ];
  }

  open() {
    const dialog = this.$$('mwc-dialog') as Dialog;
    dialog.show();
  }

  async inputsChanged() {
    const okButton = this.$$('md-tonal-button') as TonalButton;
    const promotionTextTextArea = this.$$('mwc-textarea') as TextArea;
    const targetAudienceTextField = this.$$(
      'md-outlined-text-field'
    ) as OutlinedTextField;

    //TODO: don't use timeout here, find away to wait for all the checkboxes to be updated
    setTimeout(() => {
      this.targetAudience = targetAudienceTextField.value;
      this.promotionText = promotionTextTextArea.value;

      let mediums = [];

      const checkboxes = this.shadowRoot!.querySelectorAll(
        'md-checkbox'
      ) as NodeListOf<Checkbox>;

      checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
          mediums.push(checkbox.name);
        }
      });

      if (
        mediums.length > 0 &&
        targetAudienceTextField.value.length > 0 &&
        promotionTextTextArea.value.length > 0
      ) {
        this.previewEnabled = true;
        okButton.disabled = false;
      } else {
        this.previewEnabled = false;
        okButton.disabled = true;
      }
    }, 50);
  }

  renderAdMediums() {
    return html`
      <div class="layout vertical adMediumsList" @click="${this.inputsChanged}">
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

  renderTextInputs() {
    return html`
      <div class="layout horizontal">
        <div class="layout vertical">
          <md-outlined-text-field
            class="formField"
            @keydown="${this.inputsChanged}"
            .label="${this.t('targetAudience')}"
          ></md-outlined-text-field>

          <mwc-textarea
            rows="5"
            class="rounded formField"
            label="${this.t('promotionText')}"
            outlined
            charCounter
            @keydown="${this.inputsChanged}"
          >
          </mwc-textarea>
        </div>
      </div>
    `;
  }

  renderPreview() {
    return html`
      <div class="layout vertical center-center">
        <div class="headerText">${this.t('promotionPreview')}</div>
        <div class="preview">
          <div class="previewPromotionText">${this.promotionText}</div>
          <div class="linkImage">
            <yp-image
              class="collectionLogoImage"
              sizing="cover"
              .src="${YpCollectionHelpers.logoImagePath(
                  this.collectionType,
                  this.collection!
                )}"
            ></yp-image>
          </div>
          <div class="linkContentPanel">
            <div class="linkTitle">${this.collection!.name}</div>
            <div class="linkDescription">${YpFormattingHelpers.truncate(this.collection!.description!, 150)}</div>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <mwc-dialog heading="${this.t('newTrackingPromotion')}">
        <div class="layout horizontal">
          <div class="layout vertical">
            ${this.renderTextInputs()}
            ${this.renderPreview()}
          </div>
          ${this.renderAdMediums()}
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
