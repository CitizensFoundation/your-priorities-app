import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { YpBaseElement } from '../common/yp-base-element.js';
import '../common/yp-image.js';

import '@material/web/dialog/dialog.js';
import '@material/web/button/text-button.js';

import '@material/web/progress/circular-progress.js';

import { YpConfirmationDialog } from '../yp-dialog-container/yp-confirmation-dialog.js';
import { Dialog } from '@material/web/dialog/internal/dialog.js';

@customElement('yp-user-delete-or-anonymize')
export class YpUserDeleteOrAnonymize extends YpBaseElement {
  @property({type: Boolean})
  spinnerActive = false

  static override get styles() {
    return [
      super.styles,
      css`
        md-dialog {
          padding-left: 8px;
          padding-right: 8px;
          max-width: 450px;
        }

        .buttons {
          margin-top: 16px;
          margin-bottom: 4px;
          text-align: center;
        }

        .boldButton {
          font-weight: bold;
        }

        .header {
          font-size: 22px;
          color: var(--md-sys-color-on-error-container);
          background-color: var(--md-sys-color-error-container);
          font-weight: bold;
        }

        @media (max-width: 480px) {
        }

        @media (max-width: 320px) {
        }
      `,
    ];
  }

  override render() {
    return html`
      <md-dialog id="dialog" modal>
        <div slot="headline" class="header layout horizontal center-center">
          <div>${this.t('deleteOrAnonymizeUser')}</div>
        </div>
        <div slot="content">
        <div class="helpInfo">${this.t('anonymizeUserInfo')}</div>

        <div class="helpInfo">${this.t('deleteUserInfo')}</div>


        </div>

        <div class="buttons layout vertical center-center" slot="actions">
          <div class="layout horizontal ajaxElements">
            <md-circular-progress hidden?="${!this.spinnerActive}" indeterminate></md-circular-progress>
          </div>
          <div class="layout horizontal center-center">
            <md-text-button
              .label="${this.t('cancel')}"
              slot="secondaryAction"
              dialog-dismiss=""></md-text-button>
            <md-text-button
              .label="${this.t('deleteAccount')}"
              raised
              slot="primaryAction"

              class="boldButton"
              @click="${this._deleteUser}"></md-text-button>
            <md-text-button
              .label="${this.t('anonymizeAccount')}"
              slot="primaryAction"
              raised
              class="boldButton"
              @click="${this._anonymizeUser}"></md-text-button>
          </div>
        </div>
      </md-dialog>
    `;
  }

  _deleteUser() {
    window.appDialogs.getDialogAsync('confirmationDialog', (dialog: YpConfirmationDialog) => {
      dialog.open(
        this.t('areYouSureYouWantToDeleteUser'),
        this._deleteUserFinalWarning.bind(this),
        true
      );
    });
  }

  _deleteUserFinalWarning() {
    setTimeout( ()  =>{
      window.appDialogs
        .getDialogAsync(
          'confirmationDialog',
           (dialog: YpConfirmationDialog) => {
            dialog.open(
              this.t('areYouReallySureYouWantToDeleteUser'),
              this._deleteUserForReal.bind(this),
              true
            );
          }
        );
    });
  }

  _anonymizeUser() {
    window.appDialogs
      .getDialogAsync(
        'confirmationDialog',
         (dialog: YpConfirmationDialog) => {
          dialog.open(
            this.t('areYouSureYouWantToAnonymizeUser'),
            this._anonymizeUserFinalWarning.bind(this),
            true
          );
        }
      );
  }

  _anonymizeUserFinalWarning() {
    setTimeout( () => {
      window.appDialogs
        .getDialogAsync(
          'confirmationDialog',
           (dialog: YpConfirmationDialog) => {
            dialog.open(
              this.t('areYouReallySureYouWantToAnonymizeUser'),
              this._anonymizeUserForReal.bind(this),
              true
            );
          }
        );
    });
  }

  async _deleteUserForReal() {
    this.spinnerActive = true
    await window.serverApi.deleteUser()
    this.spinnerActive = false
    this._completed()
  }

  async _anonymizeUserForReal() {
    this.spinnerActive = true
    await window.serverApi.anonymizeUser()
    this.spinnerActive = false
    this._completed()
  }

  open() {
    (this.$$('#dialog') as Dialog).open = true
  }

  _completed() {
    (this.$$('#dialog') as Dialog).open = false
    window.location.href = '/'
  }
}
