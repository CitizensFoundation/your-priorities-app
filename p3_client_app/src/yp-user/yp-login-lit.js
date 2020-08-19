import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-form/iron-form.js';
import 'lite-signal/lite-signal.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@material/mwc-button';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/paper-tabs/paper-tabs.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import '../yp-magic-text/yp-magic-text.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';
import { YpFlexLayout } from '../yp-flex-layout.js';

class YpLoginLit extends YpBaseElement {
  static get properties() {
    return {
      userSpinner: {
        type: Boolean,
        value: false
      },

      domain: {
        type: Object
      },

      reCaptchaSiteKey: {
        type: String,
        value: ''
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
        value: ""
      },

      email: {
        type: String,
        value: ""
      },

      password: {
        type: String,
        value: ""
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
        computed: '_hasAdditionalAuthMethods(domain, hasAnonymousLogin, disableFacebookLoginForGroup)'
      },

      userNameText: {
        type: String,
        computed: '_userNameText(domain)'
      },

      customTermsIntroText: {
        type: String,
        computed: '_customTermsIntroText(domain)'
      },

      disableFacebookLoginForGroup: {
        type: Boolean,
        value: false
      },

      pollingStartedAt: {
        type: Date,
        value: null
      },

      signupTermsId: {
        type: Number,
        value: null
      },

      showSignupTerms: {
        type: Boolean,
        computed: "_showSignupTerms(signupTermsId, registerMode)"
      },

      forceSecureSamlLogin: {
        type: Boolean,
        value: false
      },

      isSending: {
        type: Boolean,
        value: false
      },

      samlLoginButtonUrl: {
        type: String,
        value: null
      },

      customSamlLoginText: {
        type: String,
        value: null
      }
    }
  }

  static get styles() {
    return [
      css`

      .btn-auth,
      .btn-auth:visited {
        position: relative;
        display: inline-block;
        height: 22px;
        padding: 0 1em;
        border: 1px solid #999;
        border-radius: 2px;
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
        *overflow: visible; /* 2 */
        *display: inline; /* 3 */
        *zoom: 1; /* 3 */
        margin: 4px;
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
        width: 450px;
        background-color: #fff;
      }

      .innerScroll {
        height: 100% !important;
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
        padding: 0;
        margin: 0;
      }

      .buttons {
        color: var(--accent-color, #000);
        font-size: 15px;
        margin-top: 20px;
        text-align: center;
        vertical-align: bottom;
        margin-bottom: 3px;
      }

      .boldButton {
        font-weight: bold;
      }

      @media (max-width: 480px) {
        paper-dialog {
          padding: 0;
          margin: 0;
          width: 100%;
        }
      }

      @media (max-width: 480px) {
        .buttons {
          margin-top: 12px;
          font-size: 14px;
        }
      }

      @media (max-width: 320px) {
        paper-dialog {
          min-width: 320px;
        }

        :host {
          max-height: 100% !important;
          height: 100% !important;
        }

        .buttons {
          font-size: 13px;
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

      yp-magic-text, .customUserRegistrationText {
        font-size: 14px;
        margin: 8px;
        margin-bottom: 8px;
      }

      .mainSpinner[hide] {
        display: none;
      }

      [hidden] {
        display: none !important;
      }

      .openTerms {
        text-decoration: underline;
        cursor: pointer;
      }

      @media all and (-ms-high-contrast: none) {
        #scrollable {
          min-height: 350px;
        }
      }

      .signupTerms {
        margin-top: 16px;
        margin-bottom: 8px;
      }

      .ajaxElements {
        margin-top: 8px;
      }

      .forceSecureSamlLoginInfo {
        font-weight: bold;
        font-size: 17px;
        margin-bottom: 8px;
      }

      .anonLoginButton {
        margin-top: 0;
        margin-bottom: 12px;
      }

      paper-tabs {
        margin-bottom: 8px;
      }

      .largeSamlLogo {
        margin-top: 16px;
        border: 1px solid;
        border-color: #ddd;
        padding: 12px;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
    <lite-signal @lite-signal-yp-domain-changed="${this_domainEvent}"></lite-signal>

    <paper-dialog id="dialog" modal>
      <paper-dialog-scrollable id="scrollable">
        <iron-form id="form">
          <form name="loginForm">
            <paper-tabs .selected="${this.registerMode}" id="paper_tabs" focused ?hidden="${this.forceSecureSamlLogin}">
              <paper-tab>${this.t('user.login')}</paper-tab>
              <paper-tab>${this.t('user.register')}</paper-tab>
            </paper-tabs>

            <div class="layout vertical innerScroll">
              <span ?hidden="${!this.registerMode}">
                <div ?hidden="${!this.customUserRegistrationText}" class="customUserRegistrationText">
                  <yp-magic-text ?disable-translation .linkifyCutoff="100" .content="${this.customUserRegistrationText}"></yp-magic-text>
                </div>
              </span>

              <div class="customUserRegistrationText" ?hidden="${!this.forceSecureSamlLogin}">
                <div ?hidden="${!this.customSamlLoginText}">
                  <yp-magic-text ?disable-translation .linkifyCutoff="100" .content="${this.customSamlLoginText}"></yp-magic-text>
                </div>
                <div ?hidden="${this.customSamlLoginText}">
                  ${this.t('forceSecureSamlLoginInfo')}
                </div>
              </div>

              <div class="layout vertical center-center socialMediaLogin" ?hidden="${!this.hasAdditionalAuthMethods}">
                <div class="layout vertical center-center">

                  ${this.hasAnonymousLogin ? html`
                    <mwc-button raised class="anonLoginButton" @click="${this.anonymousLogin}">${this.t('participateAnonymously')}</mwc-button>
                  ` : html``}

                  <div class="layout horizontal">

                    ${ this.hasFacebookLogin ? html`
                      <span ?hidden="${this.forceSecureSamlLogin}">
                        <div class="btn-auth btn-facebook cursor" @tap="${this._facebookLogin}" role="button" tabindex="0" ?hidden="${this.disableFacebookLoginForGroup}">
                          ${this.t('user.facebookLogin')}
                        </div>
                      </span>
                    ` : html``}

                    ${this.hasSamlLogin ? html`
                      ${this.samlLoginButtonUrl ? html`
                        <div class="islandIs cursor layout horizontal center-center">
                          <img ?hidden="${this.forceSecureSamlLogin}" @tap="${this._openSamlLogin}" width="80" src="${this.samlLoginButtonUrl}">
                          <div ?hidden="${!this.forceSecureSamlLogin}" class="largeSamlLogo" @tap="${this._openSamlLogin}" role="button" tabindex="0">
                            <img width="130" src="${this.samlLoginButtonUrl}">
                          </div>
                        </div>
                      ` : html`
                        <div class="islandIs cursor layout horizontal center-center">
                          <img ?hidden="${this.forceSecureSamlLogin}" @tap="${this._openSamlLogin}" width="80" height="18" src="https://s3.amazonaws.com/yrpri-direct-asset/yrpri6/islandisLogo.png">
                          <div ?hidden="${!this.forceSecureSamlLogin}" class="largeSamlLogo" @tap="${this._openSamlLogin}" role="button" tabindex="0">
                            <img width="130" height="30" src="https://s3.amazonaws.com/yrpri-direct-asset/yrpri6/islandisLogo.png">
                          </div>
                        </div>
                      `}
                    ` : html``}
                  </div>
                </div>
              </div>

              <div class="orContainer" ?hidden="${!this.hasAdditionalAuthMethods}">
                <div class="strike" ?hidden="${this.forceSecureSamlLogin}">
                  <span>${this.t('or')}</span>
                </div>
              </div>

              <div ?hidden="${this.forceSecureSamlLogin}">

                ${this.registerMode ? html`
                  <paper-input id="fullname" .type="text" .label="${this.userNameText}" .value="${this.name}" .maxlength="50" .minlength="2" required char-counter>
                  </paper-input>
                ` : html``}


                <paper-input id="email" .type="text" .label="${this.t('user.email')}" .value="${this.email}" .name="username" .autocomplete="username" .pattern="${this.emailValidationPattern}" .errorMessage="${this.emailErrorMessage}">
                </paper-input>

                <paper-input id="password" .type="password" .label="${this.t('user.password')}" .value="${this.password}" .autocomplete="current-password" .errorMessage="${this.passwordErrorMessage}">
                </paper-input>
              </div>
            </div>
            <div class="signupTerms" ?hidden="${!this.showSignupTerms}">${this.customTermsIntroText} - <span @tap="${this._openTerms}" class="openTerms">${this.t('signupTermsOpen')}</span>
            </div>
            <div class="buttons layout vertical center-center">
              <div class="layout horizontal center-center">
                <mwc-button .dialogDismiss @click="${this._cancel}">${this.t('cancel')}</mwc-button>
                <mwc-button ?hidden="${this.forceSecureSamlLogin}" @click="${this._forgotPassword}">${this.t('user.newPassword')}</mwc-button>
                <mwc-button ?hidden="${this.forceSecureSamlLogin}" .autofocus raised class="boldButton" @click="${this._validateAndSend}">${this.submitText}</mwc-button>
              </div>
            </div>
          </form>
        </iron-form>
      </paper-dialog-scrollable>
      <div class="layout horizontal center-center ajaxElements">
        <paper-spinner .active class="mainSpinner" ?hide="${!this.userSpinner}"></paper-spinner>
        <yp-ajax id="loginAjax" .dispatchError @error="${this._loginError}" method="POST" url="/api/users/login" @response="${this._loginResponse}"></yp-ajax>
        <yp-ajax id="registerAjax" method="POST" .dispatchError @error="${this._registerError}" url="/api/users/register" @response="${this._registerResponse}"></yp-ajax>
        <yp-ajax id="pagesAjax" @response="${this._pagesResponse}"></yp-ajax>
      </div>
    </paper-dialog>

    <iron-a11y-keys id="a11y" keys="enter" @keys-pressed="${this.onEnter}"></iron-a11y-keys>
    <yp-ajax id="registerAnonymouslyAjax" method="POST" .dispatchError @error="${this._registerError}" url="/api4/users/register_anonymously" @response="${this._registerResponse}"></yp-ajax>
    `
  }

/*
  behaviors: [
    ypGotoBehavior
  ],
*/

  _customTermsIntroText() {
    if (window.appGlobals.currentGroup && window.appGlobals.currentGroup.configuration && window.appGlobals.currentGroup.configuration.customTermsIntroText) {
      return window.appGlobals.currentGroup.configuration.customTermsIntroText;
    } else {
      return this.t('signupTermsInfo');
    }
  }

  _userNameText() {
    if (window.appGlobals.currentGroup && window.appGlobals.currentGroup.configuration && window.appGlobals.currentGroup.configuration.customUserNamePrompt) {
      return window.appGlobals.currentGroup.configuration.customUserNamePrompt;
    } else {
      return this.t('user.name');
    }
  }

  base64EncodeUnicode(str) {
    var utf8Bytes = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
      return String.fromCharCode('0x' + p1);
    });

    return btoa(utf8Bytes);
  }

  _showSignupTerms(signupTermsId, registerMode) {
    return signupTermsId && registerMode == 1;
  }

  _isiOsInApp() {
    return /iPad|iPhone|Android|android|iPod/.test(navigator.userAgent) && !window.MSStream && (/FBAN/.test(navigator.userAgent) || /FBAV/.test(navigator.userAgent) || /Instagram/.test(navigator.userAgent));
  }

  _openTerms() {
    this.fire('yp-open-page', {pageId: this.signupTermsId});
  }

  _facebookLogin() {
    const domainName = window.location.hostname.split('.').slice(-2).join('.');

    let hostName;

    if (domainName.indexOf("forbrukerradet") > -1) {
      hostName = "mineideer";
    } else if (domainName.indexOf("parliament.scot") > -1) {
      hostName = "engage";
    } else if (domainName.indexOf("smarter.nj.gov") > -1) {
      hostName = "enjine";
    } else {
      hostName = "login";
    }

    var url = 'https://' + hostName + '.' + domainName + '/api/users/auth/facebook';

    var width = 1000,
      height = 650,
      top = (window.outerHeight - height) / 2,
      left = (window.outerWidth - width) / 2,
      name = '_blank';
    if (this._isInApp()) {
      document.cookie = "ypRedirectCookie=" + encodeURI(window.location.href) + ";domain=."+domainName+";path=/";
      window.location = url;
    } else {
      window.appUser.facebookPopupWindow = window.open(url, name, 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left);
    }
    window.appUser.startPollingForLogin();
    this._startSpinner();
    window.appGlobals.sendLoginAndSignupToAnalytics(null, 'Login Submit', 'Facebook');
  }

  anonymousLogin() {
    this.$$("#registerAnonymouslyAjax").body = {
      groupId: window.appGlobals.currentAnonymousGroup.id,
      trackingParameters: window.appGlobals.originalQueryParameters
    };
    this.$$("#registerAnonymouslyAjax").generateRequest();
    window.appGlobals.sendLoginAndSignupToAnalytics(null, 'Signup Submit', 'Anonymous');
  }

  _openSamlLogin() {
    if (this.forceSecureSamlLogin && window.appUser && window.appUser.user) {
      window.appUser.logout();
      this.async(function () {
        window.appUser.logout();
      });
    }

    var domainName = window.location.hostname.split('.').slice(-2).join('.');

    var url = '/api/users/auth/saml',
      width = 1200,
      height = 650,
      top = (window.outerHeight - height) / 2,
      left = (window.outerWidth - width) / 2,
      name = '_blank';
    if (this._isInApp()) {
      document.cookie = "ypRedirectCookie=" + encodeURI(window.location.href) + ";domain=."+domainName+";path=/";
      window.location = url;
    } else {
      window.appUser.samlPopupWindow = window.open(url, name, 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left);
    }
    window.appUser.startPollingForLogin();
    this._startSpinner();
    window.appGlobals.sendLoginAndSignupToAnalytics(null, 'Login Submit', 'Saml2');
  }

  _startSpinner() {
    this.userSpinner = true;
    this.async(function () {
      this.$$("#dialog").fire('iron-resize');
    });
  }

  _cancel() {
    this.userSpinner = true;
    window.appUser.cancelLoginPolling();
  }

  _domainEvent(event, detail) {
    if (detail.domain) {
      this.domain = detail.domain;
    }
  }

  _hasAdditionalAuthMethods(domain, hasAnonymousLogin) {
    return domain && ((this._hasFacebookLogin(domain) && !this.disableFacebookLoginForGroup) || this._hasSamlLogin(domain) || hasAnonymousLogin);
  }

  _hasFacebookLogin(domain) {
    if (domain) {
      return (domain.facebookLoginProvided != null && domain.facebookLoginProvided != "")
    } else {
      return false;
    }
  }

  _hasSamlLogin(domain) {
    if (domain) {
      return (domain.samlLoginProvided != null && domain.samlLoginProvided != "");
    } else {
      return false;
    }
  }

  _openedChanged(newValue) {
    if (newValue) {
      if (window.appGlobals.currentAnonymousGroup) {
        this.hasAnonymousLogin = true;
      } else {
        this.hasAnonymousLogin = false;
      }
      if (window.appGlobals.disableFacebookLoginForGroup) {
        this.disableFacebookLoginForGroup = true;
      } else {
        this.disableFacebookLoginForGroup = false;
      }

      if (window.appGlobals.domain &&
        window.appGlobals.domain.configuration &&
        window.appGlobals.domain.configuration.customUserRegistrationText) {
        this.customUserRegistrationText = window.appGlobals.domain.configuration.customUserRegistrationText;
      } else {
        this.customUserRegistrationText = null;
      }

      if (window.appGlobals.domain &&
        window.appGlobals.domain.configuration &&
        window.appGlobals.domain.configuration.samlLoginButtonUrl) {
        this.samlLoginButtonUrl = window.appGlobals.domain.configuration.samlLoginButtonUrl;
      } else {
        this.samlLoginButtonUrl = null;
      }

      if (window.appGlobals.domain &&
        window.appGlobals.domain.configuration &&
        window.appGlobals.domain.configuration.customSamlLoginText) {
        this.customSamlLoginText = window.appGlobals.domain.configuration.customSamlLoginText;
      } else if (window.appGlobals.currentSamlLoginMessage) {
        this.customSamlLoginText = window.appGlobals.currentSamlLoginMessage;
      } else {
        this.customSamlLoginText = null;
      }

      this.async(function () {
        this.$$("#a11y").target = this.$$("#form");
        this.$$("#email").focus();
      }.bind(this), 50);

      if (window.appGlobals.signupTermsPageId) {
        this.signupTermsId = window.appGlobals.signupTermsPageId;
      } else {
        this.signupTermsId = null;
      }

      if (window.appGlobals.currentForceSaml) {
        this.forceSecureSamlLogin = true;
        this.registerMode = 1;
      } else {
        this.forceSecureSamlLogin = false;
        this.registerMode = 0;
      }
    }
  }

  onEnter(event) {
    this._validateAndSend();
  }

  _registerError(event, error) {
    this.isSending = false;
    if (error == 'SequelizeUniqueConstraintError') {
      this.$$("#registerAjax").showErrorDialog(this.t('user.alreadyRegisterred'));
    } else {
      this.$$("#registerAjax").showErrorDialog(this.t('user.registrationError') + ': ' + error);
    }
    window.appGlobals.sendLoginAndSignupToAnalytics(null, "Signup Fail", 'Email', error);
  }

  _loginError(event, error) {
    this.isSending = false;
    if (error == 'Unauthorized') {
      this.$$("#loginAjax").showErrorDialog(this.t('user.loginNotAuthorized'));
    } else {
      this.$$("#loginAjax").showErrorDialog(this.t('user.loginError') + ': ' + error);
    }
    window.appGlobals.sendLoginAndSignupToAnalytics(null, "Login Fail", 'Email', error);
  }

  _forgotPassword() {
    this.fire("yp-forgot-password");
  }

  _onRegisterChanged(newValue, oldValue) {
    this._setTexts();
    this.$$("#dialog").fire('iron-resize');
    if (newValue == 1) {
      const nameElement = this.$$("#name");
      if (nameElement) {
        nameElement.focus();
      }
    }
  }

  connectedCallback() {
    super.connectedCallback()
      if (window.appGlobals && window.appGlobals.domain) {
        this.domain = window.appGlobals.domain
      }
  }

  setup(onLoginFunction, domain) {
    this.onLoginFunction = onLoginFunction;
    this._setTexts();
    if (domain) {
      this.domain = domain;
    }
  }

  _setTexts() {
    this.emailErrorMessage = this.t('inputError');
    this.passwordErrorMessage = this.t('inputError');
    if (this.registerMode === 1) {
      this.header = this.t('user.registerHeader');
      this.submitText = this.t('user.create');
    } else {
      this.header = this.t('user.header');
      this.submitText = this.t('user.login');
    }
  }

  _computeCredentials(name, email, password) {
    return JSON.stringify({
      name: name,
      email: email,
      identifier: email,
      username: email,
      password: password
    });
  }

  _validateAndSend(e) {
    if (!this.isSending) {
      this.isSending = true;
      window.appGlobals.sendLoginAndSignupToAnalytics(null, this.registerMode ? 'Signup Submit' : 'Login Submit', 'Email');
      if (this.$$("#form").validate() && this.email && this.password) {
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
        this.isSending = false;
        return false;
      }
    } else {
      console.warn("Trying to call _validateAndSend while sending");
    }
  }

  _registerResponse(event, detail) {
    this.isSending = false;
    window.appGlobals.sendLoginAndSignupToAnalytics(detail.response.id, "Signup Success", 'Email');
    this._loginCompleted(detail.response);
    console.error("Got register response for: "+ detail.response ? detail.response.email : 'unknown');
  }

  _loginResponse(event, detail) {
    this.isSending = false;
    this._loginCompleted(detail.response);
  }

  _loginAfterSavePassword(user) {
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
        detail: {name: 'logged-in', data: user}
      })
    );
  }

  _loginCompleted(user) {
    if (window.PasswordCredential && this.email && this.password) {
      const c = new PasswordCredential({ name: this.email, id: this.email, password: this.password });
      navigator.credentials.store(c).then(function (message) {
        this._loginAfterSavePassword(user);
      }.bind(this)).catch(function (error) {
        console.error(error);
        this._loginAfterSavePassword(user);
      }.bind(this));
    } else {
      this._loginAfterSavePassword(user);
    }
  }

  open(redirectToURL, email, collectionConfiguration) {
    this.redirectToURL = redirectToURL;
    this.userSpinner = false;
    this.opened = false;

    if (email) {
      this.email = email;
    }

    if (collectionConfiguration &&
       (collectionConfiguration.disableFacebookLoginForGroup || collectionConfiguration.disableFacebookLoginForCommunity)) {
      window.appGlobals.disableFacebookLoginForGroup = true;
    }

    this.async(function () {
      this.opened = true;
      this.async(function () {
        this.$$("#dialog").open();
      });
    });

    window.appGlobals.sendLoginAndSignupToAnalytics(null, 'Signup/Login Opened', 'Undecided');

    this.async(function () {
      if (!this.forceSecureSamlLogin && window.PasswordCredential && navigator.credentials) {
        navigator.credentials.get({password: true}).then(function (credentials) {
          if (credentials && credentials.id && credentials.password) {
            this.email = credentials.id;
            this.password = credentials.password;
            if (window.appUser.hasIssuedLogout===true) {
              console.log("Have issued logout not auto logging in");
            } else {
              this._validateAndSend();
            }
          } else {
            console.warn("Canceling credentials.get");
          }

        }.bind(this));
      }
    });
  }

  close() {
    const dialog = this.$$("#dialog");
    if (dialog) {
      dialog.close();
    }
    this.opened = false;
    this.userSpinner = false;
  }
}

window.customElements.define('yp-login-lit', YpLoginLit)
