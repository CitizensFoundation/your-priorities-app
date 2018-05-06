import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-form/iron-form.js';
import '../../../../@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/paper-input/paper-input.js';
import '../../../../@polymer/paper-button/paper-button.js';
import '../../../../@polymer/paper-dialog/paper-dialog.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';

Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      paper-dialog {
        background-color: #FFF;
        width: 420px;
      }

      .linkAccounts {
        padding-top: 16px;
      }

      @media (max-width: 480px) {
        paper-dialog {
          padding: 0;
          margin: 0;
          height: 100%;
          width: 100%;
        }
      }

      [hidden] {
        display: none !important;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <div id="outer">
      <paper-dialog id="dialog" modal="">
        <h2>[[heading]]</h2>
        <h2 class="setEmailInfo">
          [[t('user.setEmailInfo')]]
        </h2>
        <form is="iron-form" id="form">
          <paper-input id="email" type="text" label="[[t('user.email')]]" value="{{email}}" pattern="[[emailValidationPattern]]" error-message="[[emailErrorMessage]]">
          </paper-input>

          <template is="dom-if" if="[[needPassword]]">
            <div class="linkAccounts">
              [[t('user.existsLinkAccountInfo')]]
            </div>
            <paper-input id="password" type="password" label="[[t('user.password')]]" value="{{password}}" autocomplete="off" error-message="[[passwordErrorMessage]]">
            </paper-input>
          </template>
        </form>
        <div class="buttons">
          <yp-ajax id="setEmailAjax" dispatch-error="" method="PUT" url="/api/users/missingEmail/setEmail" on-response="_setEmailResponse"></yp-ajax>
          <yp-ajax id="linkAccountsAjax" method="PUT" dispatch-error="" on-error="_registerError" url="/api/users/missingEmail/linkAccounts" on-response="_linkAccountsResponse"></yp-ajax>
          <paper-button on-tap="_logout">[[t('user.logout')]]</paper-button>
          <paper-button on-tap="_forgotPassword" hidden\$="[[!needPassword]]">[[t('user.newPassword')]]</paper-button>
          <paper-button on-tap="_notNow">[[t('later')]]</paper-button>
          <paper-button id="sendButton" autofocus="" on-tap="_validateAndSend">
            <span hidden\$="[[linkAccountText]]">
              [[t('user.setEmail')]]
            </span>
            <span hidden\$="[[!linkAccountText]]">
              [[t('user.linkAccount')]]
            </span>
          </paper-button>
        </div>
      </paper-dialog>

      <iron-a11y-keys id="a11y" keys="enter" on-keys-pressed="onEnter"></iron-a11y-keys>
    </div>
`,

  is: 'yp-missing-email',

  behaviors: [
    ypLanguageBehavior
  ],

  properties: {


    emailValidationPattern: {
      type: String,
      value: "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$"
    },

    emailErrorMessage: {
      type: String
    },

    passwordErrorMessage: {
      type: String
    },

    needPassword: {
      type: Boolean,
      value: false
    },

    email: {
      type: String,
      value: "" //robert@citizens.is"
    },

    password: {
      type: String,
      value: "" //"DksdSodksSokssss"
    },

    credentials: {
      type: String,
      notify: true,
      computed: '_computeCredentials(email, password)'
    },

    linkAccountText: {
      type: Boolean,
      value: false
    },

    heading: {
      type: String
    },

    target: {
      type: Object
    }
  },

  onEnter: function (event) {
    this._validateAndSend();
  },

  _notNow: function (event) {
    this.$$("#dialog").close();
  },

  _logout: function () {
    window.appUser.logout();
  },

  _forgotPassword: function () {
    window.appUser.fire("yp-forgot-password", { email: this.email });
  },

  ready: function () {
    this.header = this.t('user.setEmail');
    this.async(function () {
      this.$$("#a11y").target = this.$$("#form");
    }.bind(this), 50);
  },

  _computeCredentials: function(email, password) {
   return JSON.stringify({
      email: email,
      password: password
    });
  },

  _validateAndSend: function(e) {
    if (this.$$("#form").checkValidity() && this.email){
      if (this.needPassword && this.password) {
        this.$$("#linkAccountsAjax").body = this.credentials;
        this.$$("#linkAccountsAjax").generateRequest();
      } else {
        this.$$("#setEmailAjax").body = {email: this.email };
        this.$$("#setEmailAjax").generateRequest();
      }
    } else {
      this.$$("#linkAccountsAjax").showErrorDialog(this.t('user.completeForm'));
      return false;
    }
  },

  _setEmailResponse: function(event, detail) {
    if (detail.response && detail.response.alreadyRegistered) {
      this.set('needPassword', true);
      this.set('header', this.t('user.linkAccount'));
      this.set('linkAccountText', true);
    } else {
      window.appGlobals.notifyUserViaToast(this.t('user.haveSetEmail')+ " " + detail.response.email);
      this.close();
    }
  },

  _linkAccountsResponse: function(event, detail) {
    if (detail.response.accountLinked) {
      window.appGlobals.notifyUserViaToast(this.t('user.haveLinkedAccounts')+ " " + detail.response.email);
      window.appUser.checkLogin();
      this.close();
    } else {
      this.$$("#linkAccountsAjax").showErrorDialog(this.t('user.loginNotAuthorized'));
    }
  },

  open: function(loginProvider) {
    this.$$("#dialog").open();
  },

  close: function() {
    this.$$("#dialog").close();
  }
});
