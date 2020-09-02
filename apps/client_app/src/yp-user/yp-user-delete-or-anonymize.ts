import '@polymer/polymer/polymer-legacy.js';
import 'lite-signal/lite-signal.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@material/mwc-button';
import '@polymer/paper-dialog/paper-dialog.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';

class YpUserDeleteOrAnonymizeLit extends YpBaseElement {
  static get properties() {
    return {

    }
  }

  static get styles() {
    return [
      css`

      paper-dialog {
        padding-left: 8px;
        padding-right: 8px;
        background-color: #fff;
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
        color: #F00;
        font-weight: bold;
      }

      @media (max-width: 480px) {
      }

      @media (max-width: 320px) {
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
    <paper-dialog id="dialog" modal>
      <div class="header layout horizontal center-center">
        <div>${this.t('deleteOrAnonymizeUser')}</div>
      </div>

      <div class="helpInfo">${this.t('anonymizeUserInfo')}</div>

      <div class="helpInfo">${this.t('deleteUserInfo')}</div>

      <div class="buttons layout vertical center-center">
        <div class="layout horizontal ajaxElements">
          <yp-ajax id="deleteUserAjax" ?useSpinner @response="${this._completed}" method="DELETE" url="/api/users/delete_current_user"></yp-ajax>
          <yp-ajax id="anonymizeAjax" ?useSpinner @response="${this._completed}" method="DELETE" url="/api/users/anonymize_current_user"></yp-ajax>
        </div>
        <div class="layout horizontal center-center">
          <mwc-button dialog-dismiss="">${this.t('cancel')}</mwc-button>
          <mwc-button raised class="boldButton" @click="${this._deleteUser}">${this.t('deleteAccount')}</mwc-button>
          <mwc-button raised class="boldButton" @click="${this._anonymizeUser}">${this.t('anonymizeAccount')}</mwc-button>
        </div>
      </div>
    </paper-dialog>
`
  }

  _deleteUser() {
    dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
      dialog.open(this.t('areYouSureYouWantToDeleteUser'), this._deleteUserFinalWarning.bind(this), true);
    }.bind(this));
  }

  _deleteUserFinalWarning() {
    this.async(function () {
      dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
        dialog.open(this.t('areYouReallySureYouWantToDeleteUser'), this._deleteUserForReal.bind(this), true);
      }.bind(this));
    });
  }

  _anonymizeUser() {
    dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
      dialog.open(this.t('areYouSureYouWantToAnonymizeUser'), this._anonymizeUserFinalWarning.bind(this), true);
    }.bind(this));
  }

  _anonymizeUserFinalWarning() {
    this.async(function () {
      dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
        dialog.open(this.t('areYouReallySureYouWantToAnonymizeUser'), this._anonymizeUserForReal.bind(this), true);
      }.bind(this));
    });
  }

  _deleteUserForReal() {
    this.$$("#deleteUserAjax").body = {};
    this.$$("#deleteUserAjax").generateRequest();
  }

  _anonymizeUserForReal() {
    this.$$("#anonymizeAjax").body = {};
    this.$$("#anonymizeAjax").generateRequest();
  }

  open() {
    this.$$("#dialog").open();
  }

  _completed() {
    this.$$("#dialog").close();
    window.location = "/";
  }
}

window.customElements.define('yp-user-delete-or-anonymize-lit', YpUserDeleteOrAnonymizeLit)
