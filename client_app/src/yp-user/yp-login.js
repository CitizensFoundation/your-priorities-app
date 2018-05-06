import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-form/iron-form.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '../../../../@polymer/paper-input/paper-input.js';
import '../../../../@polymer/paper-spinner/paper-spinner.js';
import '../../../../@polymer/paper-button/paper-button.js';
import '../../../../@polymer/paper-dialog/paper-dialog.js';
import '../../../../@polymer/paper-tabs/paper-tabs.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';

Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      .btn-auth,
      .btn-auth:visited {
        position: relative;
        display: inline-block;
        height: 22px;
        padding: 0 1em;
        border: 1px solid #999;
        border-radius: 2px;
        margin: 0;
        text-align: center;
        text-decoration: none;
        font-size: 14px;
        line-height: 22px;
        white-space: nowrap;
        cursor: pointer;
        color: #222;
        background: #fff;
        -webkit-box-sizing: content-box;
        -moz-box-sizing: content-box;
        box-sizing: content-box;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        /* iOS */
        -webkit-appearance: none; /* 1 */
        /* IE6/7 hacks */
        *overflow: visible;  /* 2 */
        *display: inline; /* 3 */
        *zoom: 1; /* 3 */
      }

      .btn-auth:hover,
      .btn-auth:focus,
      .btn-auth:active {
        color: #222;
        text-decoration: none;
      }

      .btn-auth:before {
        content: "";
        float: left;
        width: 22px;
        height: 22px;
        background: url(/images/auth-icons.png) no-repeat 99px 99px;
      }

      /**
       * 36px
       */

      .btn-auth.large {
        height: 32px;
        line-height: 36px;
        font-size: 20px;
      }

      .btn-auth.large:before {
        width: 36px;
        height: 36px;
      }

      /*
       * Remove excess padding and border in FF3+
       */

      .btn-auth::-moz-focus-inner {
        border: 0;
        padding: 0;
      }


      /* Facebook (extends .btn-auth)
         ========================================================================== */

      .btn-facebook,
      .btn-facebook:visited {
        border-color: #29447e;
        border-bottom-color: #1a356e;
        color: #fff;
        background-color: #5872a7;
        background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#637bad), to(#5872a7));
        background-image: -webkit-linear-gradient(#637bad, #5872a7);
        background-image: -moz-linear-gradient(#637bad, #5872a7);
        background-image: -ms-linear-gradient(#637bad, #5872a7);
        background-image: -o-linear-gradient(#637bad, #5872a7);
        background-image: linear-gradient(#637bad, #5872a7);
        -webkit-box-shadow: inset 0 1px 0 #879ac0;
        box-shadow: inset 0 1px 0 #879ac0;
      }

      .btn-facebook:hover,
      .btn-facebook:focus {
        color: #fff;
        background-color: #3b5998;
      }

      .btn-facebook:active {
        color: #fff;
        background: #4f6aa3;
        -webkit-box-shadow: inset 0 1px 0 #45619d;
        box-shadow: inset 0 1px 0 #45619d;
      }

      /*
       * Icon
       */

      .btn-facebook:before {
        border-right: 1px solid #465f94;
        margin: 0 1em 0 -1em;
        background-position: 0 0;
      }

      .btn-facebook.large:before {
        background-position: 0 -22px;
      }

      :host {
      }

      paper-dialog {
        padding-left: 8px;
        padding-right: 8px;
        width: 440px;
        background-color: #fff;
      }

      re-captcha {
        padding-top: 28px;
        padding-bottom: 28px;
      }

      @media (max-width: 480px) {
        paper-dialog {
          position: absolute;
          display: block;
          top: 0;
          bottom: 0;
          margin: 0;
          min-width: 360px;
          max-width: 1024px;
          width: 100%;
          @apply --paper-fullscreen-dialog;
        }
      }

      .islandIs {
        width: 80px;
        height: 18px;
        padding-left: 16px;
        padding-top: 8px;
        padding-bottom: 8px;
        padding-right: 8px;
        margin-left: 8px;
      }

      paper-spinner {
        padding:0;
        margin:0;
      }

      .buttons {
        margin-bottom: 0;
        padding-bottom: 8px;
        font-size: 15px;
      }

      @media (max-width: 480px) {
        .buttons {
          font-size: 14px;
        }
      }

      @media (max-width: 320px) {
        paper-dialog {
          min-width: 320px;
        }

        .buttons {
          font-size: 13px;
          font-weight: bold;
          margin-top: 8px;
        }
      }

      .additionAuthMethodsDivider {
        color: #444;
        padding-bottom: 8px;
      }

      .strike {
        display: block;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        font-size: 17px;
      }

      .strike > span {
        position: relative;
        display: inline-block;
      }

      .strike > span:before,
      .strike > span:after {
        content: "";
        position: absolute;
        top: 50%;
        width: 9999px;
        height: 1px;
        background: #888;
      }

      .strike > span:before {
        right: 85%;
        margin-right: 15px;
      }

      .strike > span:after {
        left: 85%;
        margin-left: 15px;
      }

      .socialMediaLogin {
        padding-top: 8px;
        margin-top: 8px;
        padding-bottom: 16px;
      }

      .cursor {
        cursor: pointer;
      }

      .orContainer {
        padding-top: 0;
        margin-top: 0;
        padding-bottom: 4px;
        color: #555;
      }

      .customUserRegistrationText {
        font-size: 14px;
        padding-top: 8px;
      }

      .mainSpinner[hide] {
        display: none;
      }

      [hidden] {
        display: none !important;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>
    <lite-signal on-lite-signal-yp-domain-changed="_domainEvent"></lite-signal>

    <paper-dialog id="dialog" modal="">
      <h3>[[heading]]</h3>

      <paper-tabs selected="{{registerMode}}" id="paper_tabs" focused="">
        <paper-tab>[[t('user.login')]]</paper-tab>
        <paper-tab>[[t('user.register')]]</paper-tab>
      </paper-tabs>

      <iron-form id="form">
        <form name="loginForm">
          <div class="layout vertical">
            <span hidden\$="[[!registerMode]]">
              <div hidden\$="[[!customUserRegistrationText]]" class="customUserRegistrationText">
                [[customUserRegistrationText]]
              </div>
            </span>

            <div class="layout vertical center-center socialMediaLogin" hidden\$="[[!hasAdditionalAuthMethods]]">
              <div class="layout horizontal center-center">

                <template is="dom-if" if="[[hasAnonymousLogin]]">
                  <paper-button raised="" on-tap="anonymousLogin">[[t('participateAnonymously')]]</paper-button>
                </template>

                <template is="dom-if" if="[[hasFacebookLogin]]">
                  <div class="btn-auth btn-facebook cursor" on-tap="_facebookLogin" hidden\$="[[disableFacebookLoginForGroup]]">
                    [[t('user.facebookLogin')]]
                  </div>
                </template>
                <template is="dom-if" if="[[hasSamlLogin]]">
                  <div class="islandIs cursor" on-tap="_islandIsLogin">
                    <img width="80" height="18" src="https://s3.amazonaws.com/yrpri-direct-asset/yrpri6/islandisLogo.png">
                  </div>
                </template>
              </div>
            </div>

            <div class="orContainer" hidden\$="[[!hasAdditionalAuthMethods]]">
              <div class="strike">
                <span>[[t('or')]]</span>
              </div>
            </div>

            <paper-input id="name" type="text" label="[[t('user.name')]]" value="{{name}}" hidden\$="[[!registerMode]]" maxlength="50" char-counter="">
            </paper-input>

            <paper-input id="email" type="text" label="[[t('user.email')]]" value="{{email}}" pattern="[[emailValidationPattern]]" error-message="[[emailErrorMessage]]">
            </paper-input>

            <paper-input id="password" type="password" label="[[t('user.password')]]" value="{{password}}" error-message="[[passwordErrorMessage]]">
            </paper-input>
          </div>
        </form>
      </iron-form>
      <div class="buttons">
        <paper-spinner active="" class="mainSpinner" hide\$="[[!userSpinner]]"></paper-spinner>
        <yp-ajax id="loginAjax" dispatch-error="" on-error="_loginError" method="POST" url="/api/users/login" on-response="_loginResponse"></yp-ajax>
        <yp-ajax id="registerAjax" method="POST" dispatch-error="" on-error="_registerError" url="/api/users/register" on-response="_registerResponse"></yp-ajax>
        <paper-button dialog-dismiss="">[[t('cancel')]]</paper-button>
        <paper-button on-tap="_forgotPassword">[[t('user.newPassword')]]</paper-button>
        <paper-button autofocus="" on-tap="_validateAndSend">[[submitText]]</paper-button>
      </div>

    </paper-dialog>

    <iron-a11y-keys id="a11y" keys="enter" on-keys-pressed="onEnter"></iron-a11y-keys>
    <yp-ajax id="registerAnonymouslyAjax" method="POST" dispatch-error="" on-error="_registerError" url="/api/users/register_anonymously" on-response="_registerResponse"></yp-ajax>
`,

  is: 'yp-login',

  behaviors: [
    ypLanguageBehavior,
    ypGotoBehavior
  ],

  properties: {

    userSpinner: {
      type: Boolean,
      value: false
    },

    domain: {
      type: Object
    },

    reCaptchaSiteKey: {
      type: String,
      value: '6Ld9UBsTAAAAAPq059P_AGqo-tVE_T9gPj5ifrmY'
    },

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

    name: {
      type: String,
      value: "" //"Róbert Viðar Bjarnason"
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
      computed: '_computeCredentials(name, email, password)'
    },

    registerMode: {
      type: Number,
      value: 0,
      observer: "_onRegisterChanged"
    },

    submitText: {
      type: String,
      value: ""
    },

    redirectToURL: {
      type: String,
      value: null
    },

    forgotPasswordOpen: {
      type: Boolean,
      value: false
    },

    heading: {
      type: String
    },

    customUserRegistrationText: {
      type: String,
      value: null
    },

    opened: {
      type: Boolean,
      value: false,
      observer: '_openedChanged'
    },

    target: {
      type: Object
    },

    onLoginFunction: {
      type: Function,
      value: null
    },

    hasFacebookLogin: {
      type: Boolean,
      value: null,
      computed: '_hasFacebookLogin(domain)'
    },

    hasAnonymousLogin: {
      type: Boolean,
      value: false
    },

    hasSamlLogin: {
      type: Boolean,
      value: null,
      computed: '_hasSamlLogin(domain)'
    },

    hasAdditionalAuthMethods: {
      type: Boolean,
      computed: '_hasAdditionalAuthMethods(domain, hasAnonymousLogin)'
    },

    disableFacebookLoginForGroup: {
      type: Boolean,
      value: false
    },

    pollingStartedAt: {
      type: Date,
      value: null
    }
  },

  _isiOsInApp: function () {
    return /iPad|iPhone|Android|iPod/.test(navigator.userAgent) && !window.MSStream && /FBAN/.test(navigator.userAgent);
  },

  _facebookLogin: function () {
    var domainName = window.location.hostname.split('.').slice(-2).join('.');

    var hostName;

    if (domainName.indexOf("forbrukerradet") > -1) {
      hostName = "mineideer";
    } else {
      hostName = "login";
    }

    var url = 'https://'+hostName+'.'+domainName+'/api/users/auth/facebook';

    var width = 1000,
        height = 650,
        top = (window.outerHeight - height) / 2,
        left = (window.outerWidth - width) / 2,
        name = '_blank';
    if (this._isiOsInApp()) {
      window.location = url;
    } else {
      window.appUser.facebookPopupWindow = window.open(url, name, 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left);
    }
    window.appUser.startPollingForLogin();
    this.set('userSpinner', true);
    window.appGlobals.sendLoginAndSignupToAnalytics(null, 'Login Submit', 'Facebook');
  },

  anonymousLogin: function () {
    this.$$("#registerAnonymouslyAjax").body = {
      groupId: window.appGlobals.currentAnonymousGroup.id,
      trackingParameters: window.appGlobals.originalQueryParameters };
    this.$$("#registerAnonymouslyAjax").generateRequest();
    window.appGlobals.sendLoginAndSignupToAnalytics(null, 'Signup Submit', 'Anonymous');
  },

  _islandIsLogin: function () {
    var url = '/api/users/auth/saml',
      width = 1200,
      height = 650,
      top = (window.outerHeight - height) / 2,
      left = (window.outerWidth - width) / 2,
      name = '_blank';
    if (this._isiOsInApp()) {
      window.location = url;
    } else {
      window.appUser.samlPopupWindow = window.open(url, name, 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left);
    }
    window.appGlobals.sendLoginAndSignupToAnalytics(null, 'Login Submit', 'Saml2');
  },

  _domainEvent: function (event, detail) {
    if (detail.domain) {
      this.set('domain', detail.domain);
    }
  },

  _hasAdditionalAuthMethods: function (domain, hasAnonymousLogin) {
    return (this._hasFacebookLogin(domain) || this._hasSamlLogin(domain) || hasAnonymousLogin);
  },

  _hasFacebookLogin: function (domain) {
    if (domain) {
      return (domain.facebookLoginProvided != null && domain.facebookLoginProvided != "")
    } else {
      return false;
    }
  },

  _hasSamlLogin: function (domain) {
    if (domain) {
      return (domain.samlLoginProvided != null && domain.samlLoginProvided != "");
    } else {
      return false;
    }
  },

  _openedChanged: function (newValue) {
    if (newValue) {
      if (window.appGlobals.currentAnonymousGroup) {
        this.set('hasAnonymousLogin', true);
      } else {
        this.set('hasAnonymousLogin', false);
      }
      if (window.appGlobals.disableFacebookLoginForGroup) {
        this.set('disableFacebookLoginForGroup', true);
      } else {
        this.set('disableFacebookLoginForGroup', false);
      }
      if (window.appGlobals.domain &&
        window.appGlobals.domain.configuration &&
        window.appGlobals.domain.configuration.customUserRegistrationText) {
        this.set('customUserRegistrationText', window.appGlobals.domain.configuration.customUserRegistrationText);
      } else {
        this.set('customUserRegistrationText', null);
      }
      this.async(function () {
        this.$$("#a11y").target = this.$$("#form");
        this.$$("#email").focus();
      }.bind(this), 50);
    }
  },

  onEnter: function (event) {
    this._validateAndSend();
  },

  _registerError: function (event, error) {
    if (error=='SequelizeUniqueConstraintError') {
      this.$$("#registerAjax").showErrorDialog(this.t('user.alreadyRegisterred'));
    } else {
      this.$$("#registerAjax").showErrorDialog(this.t('user.registrationError')+': '+error);
    }
    window.appGlobals.sendLoginAndSignupToAnalytics(null, "Signup Fail",'Email', error);
  },

  _loginError: function (event, error) {
    if (error=='Unauthorized') {
      this.$$("#loginAjax").showErrorDialog(this.t('user.loginNotAuthorized'));
    } else {
      this.$$("#loginAjax").showErrorDialog(this.t('user.loginError')+': '+error);
    }
    window.appGlobals.sendLoginAndSignupToAnalytics(null, "Login Fail",'Email', error);
  },

  _forgotPassword: function () {
    this.fire("yp-forgot-password");
  },

  _onRegisterChanged: function (newValue, oldValue) {
    this._setTexts();
    if (newValue==1) {
      var nameElement = this.$$("#name");
      if (nameElement) {
        nameElement.focus();
      }
    }
  },

  ready: function () {
    if (window.appGlobals && window.appGlobals.domain) {
      this.set('domain', window.appGlobals.domain)
    }
  },

  setup: function (onLoginFunction, domain) {
    this.set('onLoginFunction', onLoginFunction);
    this._setTexts();
    if (domain) {
      this.set('domain', domain);
    }
  },

  _setTexts: function () {
    this.emailErrorMessage = this.t('inputError');
    this.passwordErrorMessage = this.t('inputError');
    if (this.registerMode===1) {
      this.header = this.t('user.registerHeader');
      this.set('submitText',this.t('user.create'));
    } else {
      this.header = this.t('user.header');
      this.set('submitText',this.t('user.login'));
    }
  },

  _computeCredentials: function(name, email, password) {
    return  JSON.stringify({
      name: name,
      email: email,
      identifier: email,
      username: email,
      password: password
    });
  },

  _validateAndSend: function(e) {
    window.appGlobals.sendLoginAndSignupToAnalytics(null, this.registerMode ? 'Signup Submit' : 'Login Submit', 'Email');
    if (this.$$("#form").validate() && this.email && this.password){
      if (this.registerMode) {
        this.$$("#registerAjax").body = this.credentials;
        this.$$("#registerAjax").generateRequest();
      } else {
        this.$$("#loginAjax").body = this.credentials;
        this.$$("#loginAjax").generateRequest();
      }
    } else {
      this.$$("#loginAjax").showErrorDialog(this.t('user.completeForm'));
      window.appGlobals.sendLoginAndSignupToAnalytics(null, this.registerMode ? 'Signup Fail' : 'Login Fail', 'Email', 'Form not validated');
      return false;
    }
  },

  _registerResponse: function(event, detail) {
    window.appGlobals.sendLoginAndSignupToAnalytics(detail.response.id, "Signup Success", 'Email');
    this._loginCompleted(detail.response);
  },

  _loginResponse: function(event, detail) {
    this._loginCompleted(detail.response);
  },

  _loginCompleted: function (user) {
    if (this.redirectToURL)
      this.redirectTo(this.redirectToURL);
    this.fire("login", user);
    if (this.onLoginFunction) {
      this.onLoginFunction(user);
    } else {
      window.appUser.setLoggedInUser(user);
    }
    document.dispatchEvent(
      new CustomEvent("lite-signal", {
        bubbles: true,
        compose: true,
        detail: { name: 'logged-in', data: user }
      })
    );
  },

  open: function(redirectToURL, email) {
    this.redirectToURL = redirectToURL;
    this.set('userSpinner', false);
    this.set('opened', false);
    if (email) {
      this.set('email', email);
    }
    this.async(function () {
      this.set('opened', true);
      this.async(function () {
        this.$$("#dialog").open();
      });
    });
    window.appGlobals.sendLoginAndSignupToAnalytics(null, 'Signup/Login Opened', 'Undecided');
  },

  close: function() {
    var dialog = this.$$("#dialog");
    if (dialog) {
      dialog.close();
    }
    this.set('opened', false);
    this.set('userSpinner', false);
  }
});
