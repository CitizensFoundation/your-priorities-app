import '../../../../@polymer/polymer/polymer-legacy.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '../../../../@polymer/paper-button/paper-button.js';
import '../../../../@polymer/paper-dialog/paper-dialog.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '../../../../@polymer/polymer/lib/legacy/polymer.dom.js';

Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">

      :host {
      }

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
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <paper-dialog id="dialog" modal="">
      <div class="header layout horizontal center-center">
        <div>{{t('deleteOrAnonymizeUser')}}</div>
      </div>

      <div class="helpInfo">{{t('anonymizeUserInfo')}}</div>

      <div class="helpInfo">{{t('deleteUserInfo')}}</div>

      <div class="buttons layout vertical center-center">
        <div class="layout horizontal ajaxElements">
          <yp-ajax id="deleteUserAjax" use-spinner="" on-response="_completed" method="DELETE" url="/api/users/delete_current_user"></yp-ajax>
          <yp-ajax id="anonymizeAjax" use-spinner="" on-response="_completed" method="DELETE" url="/api/users/anonymize_current_user"></yp-ajax>
        </div>
        <div class="layout horizontal center-center">
          <paper-button dialog-dismiss="">[[t('cancel')]]</paper-button>
          <paper-button raised="" class="boldButton" on-tap="_deleteUser">[[t('deleteAccount')]]</paper-button>
          <paper-button raised="" class="boldButton" on-tap="_anonymizeUser">[[t('anonymizeAccount')]]</paper-button>
        </div>
      </div>
    </paper-dialog>
`,

  is: 'yp-user-delete-or-anonymize',

  behaviors: [
    ypLanguageBehavior
  ],

  _deleteUser: function () {
    dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
      dialog.open(this.t('areYouSureYouWantToDeleteUser'), this._deleteUserFinalWarning.bind(this), true);
    }.bind(this));
  },

  _deleteUserFinalWarning: function () {
    this.async(function () {
      dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
        dialog.open(this.t('areYouReallySureYouWantToDeleteUser'), this._deleteUserForReal.bind(this), true);
      }.bind(this));
    });
  },

  _anonymizeUser: function () {
    dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
      dialog.open(this.t('areYouSureYouWantToAnonymizeUser'), this._anonymizeUserFinalWarning.bind(this), true);
    }.bind(this));
  },

  _anonymizeUserFinalWarning: function () {
    this.async(function () {
      dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
        dialog.open(this.t('areYouReallySureYouWantToAnonymizeUser'), this._anonymizeUserForReal.bind(this), true);
      }.bind(this));
    });
  },

  _deleteUserForReal: function () {
    this.$.deleteUserAjax.body = {};
    this.$.deleteUserAjax.generateRequest();
  },

  _anonymizeUserForReal: function () {
    this.$.anonymizeAjax.body = {};
    this.$.anonymizeAjax.generateRequest();
  },

  open: function () {
    this.$.dialog.open();
  },

  _completed: function () {
    this.$.dialog.close();
    window.location = "/";
  }
});
