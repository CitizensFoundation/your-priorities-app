import '../../../../@polymer/polymer/polymer-legacy.js';
import '../../../../@polymer/iron-form/iron-form.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '../../../../@polymer/paper-input/paper-input.js';
import '../../../../@polymer/paper-button/paper-button.js';
import '../../../../@polymer/paper-dialog/paper-dialog.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">
      paper-dialog {
        padding-left: 8px;
        padding-right: 8px;
        width: 420px;
        background-color: #fff;
        z-index: 9999;
      }


      @media (max-width: 480px) {
        paper-dialog {
          padding: 0;
          margin: 0;
          height: 100%;
          width: 100%;
        }
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <paper-dialog id="dialog" modal="">
      <h3>[[t('user.resetPassword')]]</h3>

      <p>[[t('user.resetPasswordInstructions')]]</p>

      <form is="iron-form" id="form">
        <paper-input id="password" type="password" label="[[t('password')]]" value="{{password}}" autocomplete="off" error-message="[[passwordErrorMessage]]">
        </paper-input>

      </form>
      <div class="buttons">
        <yp-ajax id="resetPasswordAjax" method="POST" on-response="_resetPasswordResponse"></yp-ajax>
        <paper-button on-tap="_cancel" dialog-dismiss="">[[t('cancel')]]</paper-button>
        <paper-button autofocus="" on-tap="_validateAndSend">[[t('user.resetPassword')]]</paper-button>
      </div>
    </paper-dialog>

    <iron-a11y-keys id="a11y" keys="enter" on-keys-pressed="onEnter"></iron-a11y-keys>
`,

  is: 'yp-reset-password',

  behaviors: [
    ypLanguageBehavior
  ],

  properties: {

    password: {
      type: String,
      value: ""
    },

    token: {
      type: String
    },

    passwordErrorMessage: {
      type: String
    }
  },

  onEnter: function (event) {
    event.stopPropagation();
    this._validateAndSend();
  },

  _validateAndSend: function(e) {
    if (this.$.form.checkValidity() && this.password){
      this.$.resetPasswordAjax.url = '/api/users/reset/'+this.token;
      this.$.resetPasswordAjax.body = JSON.stringify({
        password: this.password
      });
      this.$.resetPasswordAjax.generateRequest();
    }
  },

  _resetPasswordResponse: function(event, detail) {
    if (detail.response.error && detail.response.error=='not_found') {
      this.$.resetPasswordAjax.showErrorDialog(this.t('errorResetTokenNotFoundOrUsed'));
    } else {
      this.close();
      window.appGlobals.notifyUserViaToast(this.t('notification.passwordResetAndLoggedIn'));
      this._loginCompleted(detail.response);
      window.location = "/";
    }
  },

  _cancel: function () {
    window.location = "/";
  },

  _loginCompleted: function (user) {
    window.appUser.setLoggedInUser(user);
    this.fire("login",user);
  },

  open: function(token) {
    if (token)
      this.token = token;
    this.$.dialog.open();
  },

  close: function() {
    this.$.dialog.close();
  }
});
