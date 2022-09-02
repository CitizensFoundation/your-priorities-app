import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { YpBaseElementWithLogin } from '../@yrpri/common/yp-base-element-with-login';

import '@material/web/fab/fab-extended.js';
import '@material/web/formfield/formfield.js';
import '@material/web/radio/radio.js';
import '@material/web/button/tonal-button.js';
import '@material/web/button/text-button.js';

import '@material/mwc-textarea/mwc-textarea.js';

import '@material/web/textfield/outlined-text-field.js';
import '@material/web/textfield/filled-text-field.js';

import { Dialog } from '@material/mwc-dialog';

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
          padding-bottom: 24px;
        }

        .promotionText {
        }

        mwc-textarea {
          width: 400px;
        }

        mwc-textarea.rounded {
          --mdc-shape-small: 0px;
        }
        .formField {
          margin-top: 16px;
        }
      `,
    ];
  }

  open() {
    const dialog = this.$$('mwc-dialog') as Dialog;
    dialog.show();
  }

  render() {
    return html`<style></style>

      <mwc-dialog heading="${this.t('newAdGroup')}">
        <div class="layout vertical">
          <md-outlined-text-field
            class="formField"
            .label="${this.t('targetAudience')}"
          ></md-outlined-text-field>

          <mwc-textarea rows="7" class="rounded formField" label="${this.t('promotionText')}" outlined>
          </mwc-textarea>
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
          class="button okButton"
          .label="${this.t('save')}"
          slot="primaryAction"
        >
        </md-tonal-button>
      </mwc-dialog>`;
  }
}
