import { html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

import "./yp-registration-questions.js";
import "./yp-forgot-password.js";

import { YpBaseElement } from "../common/yp-base-element.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
import { YpRegistrationQuestions } from "./yp-registration-questions.js";

import "@material/web/iconbutton/standard-icon-button.js";
import "@material/web/textfield/filled-text-field.js";
import "@material/web/radio/radio.js";
import "@material/web/icon/icon.js";
import "@material/web/button/tonal-button.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/text-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/dialog/dialog.js";
import "@material/web/circularprogress/circular-progress.js";
import { Layouts } from "../../flexbox-literals/classes.js";
import { Dialog } from "@material/web/dialog/lib/dialog.js";
import { TextField } from "@material/web/textfield/lib/text-field.js";
import { YpForgotPassword } from "./yp-forgot-password.js";

@customElement("yp-login")
export class YpLogin extends YpBaseElement {
  @property({ type: Boolean })
  userSpinner = false;

  @property({ type: Object })
  domain: YpDomainData | undefined;

  @property({ type: String })
  reCaptchaSiteKey = "";

  @property({ type: String })
  emailErrorMessage: string | undefined;

  @property({ type: String })
  passwordErrorMessage: string | undefined;

  @property({ type: String })
  name = "";

  @property({ type: String })
  email = "";

  @property({ type: String })
  password = "";

  @property({ type: String })
  submitText = "";

  @property({ type: String })
  redirectToURL: string | undefined;

  @property({ type: Boolean })
  forgotPasswordOpen = false;

  @property({ type: String })
  heading: string | undefined;

  @property({ type: String })
  customUserRegistrationText: string | undefined;

  @property({ type: Boolean })
  opened = false;

  @property({ type: Object })
  target: any | undefined;

  @property({ type: Boolean })
  forceSecureSamlLogin = false;

  @property({ type: Boolean })
  hasAnonymousLogin = false;

  @property({ type: Boolean })
  disableFacebookLoginForGroup = false;

  @property({ type: String })
  credentials: Record<string, unknown> | undefined;

  @property({ type: Object })
  pollingStartedAt: Date | undefined;

  @property({ type: Number })
  signupTermsId: number | undefined;
  @property({ type: String })
  samlLoginButtonUrl: string | undefined;

  @property({ type: String })
  customSamlLoginText: string | undefined;

  @property({ type: String })
  oneTimeLoginName: string | undefined;

  @property({ type: Boolean })
  hasOneTimeLoginWithName = false;

  @property({ type: Object })
  registrationQuestionsGroup: YpGroupData | undefined;

  onLoginFunction: Function | undefined;

  isSending = false;

  reloadPageOnDialogClose = true;

  _logingDialogClose() {
    if (this.reloadPageOnDialogClose) {
      setTimeout(() => {
        window.location.reload();
      }, 350);
    }
  }

  static get styles() {
    return [
      super.styles,
      Layouts,
      css`
        :host {
          --md-dialog-container-color: var(--md-sys-color-surface);
          --md-filled-field-container-color: var(--md-sys-color-surface) !important;
        }

        md-filled-text-field {
          --md-filled-field-container-color: var(--md-sys-color-surface) !important;
        }

        .createUser {
          padding: 16px;
          text-align: left;
        }

        .loginInfo {
          padding-right: 4px;
        }

        .capitalize {
          text-transform: capitalize;
        }

        .loginInfoOptions {
          margin-top: 8px;
        }

        .login-button-row {
          margin-top: 16px;
          margin-bottom: 24px;
        }

        .loginInfoContainer {
          margin-bottom: 8px;
          text-align: left;
          margin-left: 8px;
          margin-right: 8px;
        }

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

        .login-user-row {
          text-align: left;
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
          background-image: -webkit-gradient(
            linear,
            0 0,
            0 100%,
            from(#637bad),
            to(#5872a7)
          );
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

        md-textarea,
        md-textfield {
          font-family: var(--app-header-font-family, Roboto);
        }

        .innerScroll {
          height: 100% !important;
        }

        .islandIs {
          width: 107px;
          height: 19px;
          margin-left: 8px;
          margin-top: 4px;
          margin-bottom: 8px;
          margin-right: 8px;
          margin-left: 8px;
          padding: 2px;
          border: 2px solid var(--md-sys-color-primary);
          border-radius: 3px;
        }

        .buttons {
          font-size: 15px;
          margin-top: 20px;
          text-align: center;
          vertical-align: bottom;
          margin-bottom: 16px;
        }

        .buttons[has-registration-questions] {
          padding-bottom: 16px;
        }


        .boldButton {
          font-weight: bold;
        }

        .create-user {
          --md-dialog-container-min-inline-size: calc(100vw - 212px);
        }

        .create-user [slot="header"] {
          display: flex;
          flex-direction: row-reverse;
          align-items: center;
        }

        .create-user[showing-fullscreen] [slot="header"] {
          flex-direction: row;
        }

        .headline {
          flex-direction: row-reverse;
          align-items: center;
          text-align:center;
        }

        .create-user-content,
        .login-user-row {
          display: flex;
          gap: 8px;
        }

        .create-user-content {
          flex-direction: column;
        }

        .login-user-row > * {
          flex: 1;
        }

        .login-button-row {
          display: flex;
          justify-content: flex-end;
        }

        md-filled-text-field {
          width: 340px;
        }

        @media (max-width: 900px) {
          md-filled-text-field {
            width: 280px;
          }
          .login-user-row {
            flex-direction: column;
          }

          .loginField {
            margin-bottom: 8px;
            margin-top: 8px;
          }

          .login-button-row {
            justify-content: center;
          }
        }


        @media (max-width: 480px) {
          .buttons {
            margin-top: 12px;
            font-size: 14px;
          }
        }

        @media (max-width: 320px) {


          :host {
            max-height: 100% !important;
            height: 100% !important;
          }

          .buttons {
            font-size: 13px;
          }
        }

        .additionAuthMethodsDivider {
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
        }

        .cursor {
          cursor: pointer;
        }

        .orContainer {
          padding-top: 0;
          margin-top: 0;
          padding-bottom: 24px;
        }

        yp-magic-text,
        .customUserRegistrationText {
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


        .largeSamlLogo {
          margin-top: 16px;
          padding: 12px;
          padding-top: 18px;
        }

        md-circular-progress {
          width: 24px;
          height: 24px;
        }
      `,
    ];
  }

  renderSamlLogin() {
    return html`
      ${this.samlLoginButtonUrl
        ? html`
            <div
              class="islandIs cursor layout horizontal center-center"
              role="button"
              tabindex="0"
            >
              <img
                ?hidden="${this.forceSecureSamlLogin}"
                @click="${this._openSamlLogin}"
                width="80"
                src="${this.samlLoginButtonUrl}"
              />
              <div
                ?hidden="${!this.forceSecureSamlLogin}"
                class="largeSamlLogo"
                @click="${this._openSamlLogin}"
                role="button"
                tabindex="0"
              >
                <img width="130" src="${this.samlLoginButtonUrl}" />
              </div>
            </div>
          `
        : html`
            <div
              class="islandIs cursor layout horizontal center-center"
              role="button"
              tabindex="0"
              @keydown="${this._keySaml}"
            >
              <img
                ?hidden="${this.forceSecureSamlLogin}"
                @click="${this._openSamlLogin}"
                width="107"
                height="19"
                src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/islanddotis.png"
              />
              <div
                ?hidden="${!this.forceSecureSamlLogin}"
                class="largeSamlLogo"
                @click="${this._openSamlLogin}"
                role="button"
                tabindex="0"
              >
                <img
                  width="140"
                  height="25"
                  src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/islanddotis.png"
                />
              </div>
            </div>
          `}
    `;
  }

  renderAdditionalMethods() {
    return html`<div
      class="layout vertical center-center socialMediaLogin"
      ?hidden="${!this.hasAdditionalAuthMethods}"
    >
      <div class="layout vertical center-center">
        ${this.hasAnonymousLogin
          ? html`
              <md-tonal-button
                raised
                class="anonLoginButton"
                @click="${this.anonymousLogin}"
                >${this.t("participateAnonymously")}</md-tonal-button
              >
            `
          : nothing}
        ${this.hasOneTimeLoginWithName
          ? html`
              <md-tonal-button
                raised
                class="anonLoginButton"
                @click="${this.oneTimeLogin}"
                >${this.t("oneTimeLoginWithName")}</md-tonal-button
              >
            `
          : nothing}

        <div class="layout horizontal">
          ${this.hasFacebookLogin
            ? html`
                <span ?hidden="${this.forceSecureSamlLogin}">
                  <div
                    class="btn-auth btn-facebook cursor"
                    @click="${this._facebookLogin}"
                    role="button"
                    tabindex="0"
                    ?hidden="${this.disableFacebookLoginForGroup}"
                  >
                    ${this.t("user.facebookLogin")}
                  </div>
                </span>
              `
            : nothing}
          ${this.hasSamlLogin ? this.renderSamlLogin() : nothing}
        </div>
      </div>
    </div>`;
  }

  renderLogin() {
    return html`
      <md-dialog
        id="loginDialog"
        class="createUser"
        escapeKeyAction=""
        scrimClickAction=""
        transition="grow-right"
        ?open="${this.opened}"
        footerHidden
        @closed="${this.closeAndReset}"
        .fullscreen=${!this.wide}
      >
        <span slot="header">
          <md-standard-icon-button
            dialogAction="close"
            @click="${this._logingDialogClose}"
          ><md-icon>close</md-icon></md-standard-icon-button>
          <span class="headline">${this.t("loginAndRegistration")}</span>
        </span>
        <div class="create-user-content">
          <div
            ?hidden="${!this.customUserRegistrationText}"
            class="customUserRegistrationText"
          >
            <yp-magic-text
              disableTranslation
              linkifyCutoff="100"
              .content="${this.customUserRegistrationText}"
            ></yp-magic-text>
          </div>
          <div
            class="customUserRegistrationText"
            ?hidden="${!this.forceSecureSamlLogin}"
          >
            <div ?hidden="${!this.customSamlLoginText}">
              <yp-magic-text
                disableTranslation
                linkifyCutoff="100"
                .content="${this.customSamlLoginText}"
              ></yp-magic-text>
            </div>
            <div ?hidden="${this.customSamlLoginText != null}">
              ${this.t("forceSecureSamlLoginInfo")}
            </div>
          </div>

          ${this.renderAdditionalMethods()}

          <div ?hidden="${this.forceSecureSamlLogin}">
            <div
              class="orContainer"
              ?hidden="${!this.hasAdditionalAuthMethods}"
            >
              <div class="strike">
                <span>${this.t("or")}</span>
              </div>
            </div>

            <div class="login-user-row">
              <md-outlined-text-field
                id="email"
                type="email"
                .label="${this.t("user.email")}"
                name="username"
                pattern=".+@.+"
                minLength="5"
                required
                class="loginField"
                .value="${this.email}"
                autocomplete="username"
              ></md-outlined-text-field>
              <md-outlined-text-field
                id="password"
                type="password"
                .label="${this.t("user.password")}"
                autocomplete="current-password"
                class="loginField"
                minLength="1"
                .value="${this.password}"
                @keyup="${this.onEnterLogin}"
              ></md-outlined-text-field>
            </div>
            <div class="login-button-row">
              <md-filled-button
                autofocus
                raised
                class="loginButton"
                @click="${() => this._validateAndSend(false)}"
                ><span class="capitalize"
                  >${this.submitText}</span
                ></md-filled-button
              >
            </div>

            <div class="loginInfoOptions layout horizontal center-center wrap">
              <div class="loginInfoContainer layout vertical">
                <div class="loginInfo">${this.t("dontHaveAccount")}</div>
                <md-text-button @click="${this.openCreateUser}"
                  >${this.t("user.create")}</md-text-button
                >
              </div>
              <div class="loginInfoContainer layout vertical">
                <div class="loginInfo">${this.t("cantRememberPassword")}</div>
                <md-text-button @click="${this._forgotPassword}"
                  ><span class="capitalize"
                    >${this.t("user.newPassword")}</span
                  ></md-text-button
                >
              </div>
            </div>
          </div>
        </div>
      </md-dialog>
    `;
  }

  renderCreateUser() {
    return html`
      <md-dialog
        id="createUserDialog"
        class="createUser"
        escapeKeyAction=""
        scrimClickAction=""
        transition="grow-left"
        .fullscreen=${!this.wide}
      >
        <div slot="header" class="layout horizontal center-center">
         ${this.t("user.create")}
        </div>
        <div class="create-user-content">
          <md-filled-text-field
            id="fullname"
            type="text"
            .label="${this.userNameText}"
            maxLength="50"
            minLength="2"
            required
            charCounter
          ></md-filled-text-field>
          <md-filled-text-field
            id="regEmail"
            type="email"
            .label="${this.t("user.email")}"
            name="username"
            pattern=".+@.+"
            min="5"
            autocomplete="username"
          ></md-filled-text-field>
          <md-filled-text-field
            id="regPassword"
            type="password"
            minLength="5"
            .label="${this.t("user.password")}"
            autocomplete="current-password"
            @keyup="${this.onEnterRegistration}"
          ></md-filled-text-field>
          ${this.registrationQuestionsGroup
            ? html`
                <yp-registration-questions
                  id="registrationQuestions"
                  @questions-changed="${this._registrationQuestionsChanged}"
                  @resize-scroller="${this._registrationQuestionsChanged}"
                  .group="${this.registrationQuestionsGroup}"
                >
                </yp-registration-questions>
              `
            : nothing}
          <div class="signupTerms" ?hidden="${!this.showSignupTerms}">
            ${this.customTermsIntroText} -
            <span @click="${this._openTerms}" class="openTerms"
              >${this.t("signupTermsOpen")}</span
            >
          </div>
        </div>
        <md-text-button slot="footer" @click="${this.cancelRegistration}" dialogAction="cancel"
          >${this.t("cancel")}</md-text-button
        >
        <md-text-button @click="${() => this._validateAndSend(true)}" slot="footer"
          >${this.t("user.create")}</md-text-button
        >
      </md-dialog>
    `;
  }

  renderButtons() {
    return html`
      <div
        class="buttons layout horizontal self-end"
        ?has-registration-questions="${this.registrationQuestionsGroup !=
        undefined}"
      >
        <md-circular-progress
          class="mainSpinner"
          indeterminate
          ?hidden="${!this.userSpinner}"
        ></md-circular-progress>
        <div class="flex"></div>
        <md-text-button dialogAction="cancel" @click="${this._cancel}"
          >${this.t("cancel")}</md-text-button
        >
        <md-text-button
          ?hidden="${this.forceSecureSamlLogin}"
          @click="${this._forgotPassword}"
          >${this.t("user.newPassword")}</md-text-button
        >
        <md-filled-button
          ?hidden="${this.forceSecureSamlLogin}"
          autofocus
          raised
          class="boldButton"
          .label="${this.submitText}"
          @click="${this._validateAndSend}"
        ></md-filled-button>
      </div>
    `;
  }

  closeAndReset() {
    this.close();
  }

  renderOneTimeDialog() {
    return html`
      <md-dialog id="dialogOneTimeWithName" modal>
        <h3>[[t('oneTimeLoginWithName')]]</h3>
        <md-filled-text-field
          id="oneTimeLoginWithNameId"
          type="text"
          .label="${this.userNameText}"
          maxlength="50"
          @keyup="${this._updateOneTimeLoginName}"
          autocomplete="off"
        ></md-filled-text-field>
        ${this.registrationQuestionsGroup
          ? html`
              <yp-registration-questions
                id="registrationQuestionsOneTimeLogin"
                @questions-changed="${this._registrationQuestionsChanged}"
                @resize-scroller="${this._registrationQuestionsChanged}"
                .group="${this.registrationQuestionsGroup}"
              ></yp-registration-questions>
            `
          : nothing}

        <div class="buttons">
          <md-text-button
            slot="footer"
            dialogAction="cancel"
            @click="${this._cancel}"
            >${this.t("cancel")}</md-text-button
          >
          <md-text-button
            slot="footer"
            ?disabled="${!this.oneTimeLoginName}"
            @click="${this.finishOneTimeLoginWithName}"
          >
            ${this.t("user.login")}</md-text-button
          >
        </div>
      </md-dialog>
    `;
  }

  openCreateUser() {
    (this.$$("#createUserDialog") as Dialog).open = true;
    (this.$$("#loginDialog") as Dialog).open = false;
  }

  cancelRegistration() {
    (this.$$("#loginDialog") as Dialog).open = true;
  }

  _setupJsonCredentials(registerMode: boolean) {
    this.credentials = {
      name: this.fullnameValue,
      email: this.emailValue(registerMode),
      identifier: this.emailValue(registerMode),
      username: this.emailValue(registerMode),
      password: this.passwordValue(registerMode),
      registration_answers:
        this.registrationQuestionsGroup && this.$$("#registrationQuestions")
          ? (
              this.$$("#registrationQuestions") as YpRegistrationQuestions
            ).getAnswers()
          : undefined,
    };
  }

  _updateOneTimeLoginName(event: KeyboardEvent) {
    this.oneTimeLoginName = (
      this.$$("#oneTimeLoginWithNameId") as TextField
    ).value;
    if (this.oneTimeLoginName && this.oneTimeLoginName.length > 0) {
      if (event.key == "enter") {
        this.finishOneTimeLoginWithName();
      }
    }
  }

  renderForgotPassword() {
    return html`
      <yp-forgot-password id="forgotPasswordDialog"></yp-forgot-password>
    `;
  }

  render() {
    return html`
      ${this.renderLogin()} ${this.renderCreateUser()} ${this.renderForgotPassword()}
      ${this.hasOneTimeLoginWithName ? this.renderOneTimeDialog() : nothing}
    `;
  }

  _registrationQuestionsChanged() {
    //this.$.dialog.fire('iron-resize');
    const oneTimeDialog = this.$$("#dialogOneTimeWithName");
    if (oneTimeDialog) {
      //oneTimeDialog.fire('iron-resize');
    }
  }

  _setupCustomRegistrationQuestions() {
    if (window.appGlobals.registrationQuestionsGroup) {
      this.registrationQuestionsGroup =
        window.appGlobals.registrationQuestionsGroup;
    } else {
      this.registrationQuestionsGroup = undefined;
    }
  }

  _keySaml(event: KeyboardEvent) {
    if (event.keyCode == 13) {
      event.preventDefault();
      this._openSamlLogin();
    }
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has("opened")) {
      this._openedChanged();
    }
  }

  get customTermsIntroText() {
    if (
      window.appGlobals.currentGroup &&
      window.appGlobals.currentGroup.configuration &&
      window.appGlobals.currentGroup.configuration.customTermsIntroText
    ) {
      return window.appGlobals.currentGroup.configuration.customTermsIntroText;
    } else {
      return this.t("signupTermsInfo");
    }
  }

  get userNameText() {
    if (
      window.appGlobals.currentGroup &&
      window.appGlobals.currentGroup.configuration &&
      window.appGlobals.currentGroup.configuration.customUserNamePrompt
    ) {
      return window.appGlobals.currentGroup.configuration.customUserNamePrompt;
    } else {
      return this.t("user.name");
    }
  }

  get showSignupTerms() {
    return this.signupTermsId;
  }

  _isiOsInApp() {
    return (
      /iPad|iPhone|Android|android|iPod/.test(navigator.userAgent) &&
      !window.MSStream &&
      (/FBAN/.test(navigator.userAgent) ||
        /FBAV/.test(navigator.userAgent) ||
        /Instagram/.test(navigator.userAgent))
    );
  }

  _openTerms() {
    this.fire("yp-open-page", { pageId: this.signupTermsId });
  }

  _facebookLogin() {
    const domainName = window.location.hostname.split(".").slice(-2).join(".");

    let hostName;

    if (domainName.indexOf("forbrukerradet") > -1) {
      hostName = "mineideer";
    } else if (domainName.indexOf("parliament.scot") > -1) {
      hostName = "engage";
    } else if (domainName.indexOf("multicitychallenge.org") > -1) {
      hostName = "yp";
    } else if (domainName.indexOf("smarter.nj.gov") > -1) {
      hostName = "enjine";
    } else if (
      window.appGlobals.domain &&
      window.appGlobals.domain.loginCallbackCustomHostName
    ) {
      hostName = window.appGlobals.domain.loginCallbackCustomHostName;
    } else {
      hostName = "login";
    }

    const url =
      "https://" + hostName + "." + domainName + "/api/users/auth/facebook";

    const width = 1000,
      height = 650,
      top = (window.outerHeight - height) / 2,
      left = (window.outerWidth - width) / 2,
      name = "_blank";
    if (this._isInApp()) {
      document.cookie =
        "ypRedirectCookie=" +
        encodeURI(window.location.href) +
        ";domain=." +
        domainName +
        ";path=/";
      window.location.href = url;
    } else {
      window.appUser.facebookPopupWindow = window.open(
        url,
        name,
        "width=" +
          width +
          ",height=" +
          height +
          ",scrollbars=0,top=" +
          top +
          ",left=" +
          left
      );
    }
    window.appUser.startPollingForLogin();
    this._startSpinner();
    window.appGlobals.analytics.sendLoginAndSignup(
      -1,
      "Login Submit",
      "Facebook"
    );
  }

  oneTimeLogin() {
    this.oneTimeLoginName = undefined;
    (this.$$("#dialogOneTimeWithName") as Dialog).open = true;
    setTimeout(() => {
      this.$$("#oneTimeLoginWithNameId")?.focus();
    }, 50);
  }

  finishOneTimeLoginWithName() {
    (this.$$("#dialogOneTimeWithName") as Dialog).open = false;
    if (
      this.oneTimeLoginName &&
      (!this.registrationQuestionsGroup ||
        (
          this.$$(
            "#registrationQuestionsOneTimeLogin"
          ) as YpRegistrationQuestions
        ).validate())
    ) {
      let registrationAnswers: Record<string, string>[] | undefined = undefined;
      if (this.registrationQuestionsGroup) {
        registrationAnswers = (
          this.$$(
            "#registrationQuestionsOneTimeLogin"
          ) as YpRegistrationQuestions
        ).getAnswers();
      }
      this.anonymousLogin("One Time Login", registrationAnswers);
    }
  }

  async anonymousLogin(
    loginSubType = "Anonymous",
    registrationAnswers: Record<string, string>[] | undefined = undefined
  ) {
    if (window.appGlobals.currentAnonymousGroup) {
      window.appGlobals.analytics.sendLoginAndSignup(
        -1,
        "Signup Submit",
        loginSubType
      );

      this._startSpinner();

      const user = (await window.serverApi.registerAnonymously({
        groupId: window.appGlobals.currentAnonymousGroup.id,
        trackingParameters: window.appGlobals.originalQueryParameters,
        oneTimeLoginName: this.hasOneTimeLoginWithName
          ? this.oneTimeLoginName
          : null,
        registration_answers: registrationAnswers,
      })) as YpUserData;

      this._cancel();

      this.isSending = false;

      if (user) {
        window.appGlobals.analytics.sendLoginAndSignup(
          user.id,
          "Signup Success",
          loginSubType
        );
        this._loginCompleted(user);
        if (this.$$("#dialogOneTimeWithName") as Dialog) {
          (this.$$("#dialogOneTimeWithName") as Dialog).open = false;
        }
      } else {
        console.error("No user in anonymousLogin");
      }
    } else {
      console.error("No anon group in config");
    }
  }

  _isInApp() {
    return (
      /iPad|iPhone|Android|android|iPod/.test(navigator.userAgent) &&
      !window.MSStream &&
      (/FBAN/.test(navigator.userAgent) ||
        /FBAV/.test(navigator.userAgent) ||
        /Instagram/.test(navigator.userAgent))
    );
  }

  _openSamlLogin() {
    if (this.forceSecureSamlLogin && window.appUser && window.appUser.user) {
      window.appUser.logout();
      setTimeout(() => {
        window.appUser.logout();
      });
    }

    const domainName = window.location.hostname.split(".").slice(-2).join(".");

    const url = "/api/users/auth/saml",
      width = 1200,
      height = 650,
      top = (window.outerHeight - height) / 2,
      left = (window.outerWidth - width) / 2,
      name = "_blank";
    if (this._isInApp()) {
      document.cookie =
        "ypRedirectCookie=" +
        encodeURI(window.location.href) +
        ";domain=." +
        domainName +
        ";path=/";
      window.location.href = url;
    } else {
      window.appUser.samlPopupWindow = window.open(
        url,
        name,
        "width=" +
          width +
          ",height=" +
          height +
          ",scrollbars=0,top=" +
          top +
          ",left=" +
          left
      );
    }
    window.appUser.startPollingForLogin();
    this._startSpinner();
    window.appGlobals.analytics.sendLoginAndSignup(-1, "Login Submit", "Saml2");
  }

  firstUpdated() {
    //    (this.$$("#createUserDialog") as Dialog).open = true;
  }

  _startSpinner() {
    this.userSpinner = true;
    setTimeout(() => {
      //this.$$('#dialog').fire('iron-resize');
    });
  }

  _cancel() {
    this.userSpinner = true;
    window.appUser.cancelLoginPolling();
  }

  _domainEvent(event: CustomEvent) {
    if (event.detail.domain) {
      this.domain = event.detail.domain as YpDomainData;
    }
  }

  get hasAdditionalAuthMethods() {
    return (
      this.domain &&
      ((this.hasFacebookLogin && !this.disableFacebookLoginForGroup) ||
        this.hasSamlLogin ||
        this.hasAnonymousLogin ||
        this.hasOneTimeLoginWithName)
    );
  }

  get hasFacebookLogin() {
    if (this.domain) {
      return this.domain.facebookLoginProvided;
    } else {
      return false;
    }
  }

  get hasSamlLogin() {
    if (this.domain) {
      return this.domain.samlLoginProvided;
    } else {
      return false;
    }
  }

  _openedChanged() {
    if (this.opened) {
      if (
        window.appGlobals.currentAnonymousGroup &&
        window.appGlobals.currentGroup &&
        window.appGlobals.currentGroup.configuration &&
        window.appGlobals.currentGroup.configuration.allowAnonymousUsers
      ) {
        this.hasAnonymousLogin = true;
      } else {
        this.hasAnonymousLogin = false;
      }

      if (
        window.appGlobals.currentAnonymousGroup &&
        window.appGlobals.currentGroup &&
        window.appGlobals.currentGroup.configuration &&
        window.appGlobals.currentGroup.configuration.allowOneTimeLoginWithName
      ) {
        this.hasOneTimeLoginWithName = true;
      } else {
        this.hasOneTimeLoginWithName = false;
      }

      if (window.appGlobals.disableFacebookLoginForGroup) {
        this.disableFacebookLoginForGroup = true;
      } else {
        this.disableFacebookLoginForGroup = false;
      }

      if (
        window.appGlobals.domain &&
        window.appGlobals.domain.configuration &&
        window.appGlobals.domain.configuration.customUserRegistrationText
      ) {
        this.customUserRegistrationText =
          window.appGlobals.domain.configuration.customUserRegistrationText;
      } else {
        this.customUserRegistrationText = undefined;
      }

      if (
        window.appGlobals.domain &&
        window.appGlobals.domain.configuration &&
        window.appGlobals.domain.configuration.samlLoginButtonUrl
      ) {
        this.samlLoginButtonUrl =
          window.appGlobals.domain.configuration.samlLoginButtonUrl;
      } else {
        this.samlLoginButtonUrl = undefined;
      }

      if (
        window.appGlobals.domain &&
        window.appGlobals.domain.configuration &&
        window.appGlobals.domain.configuration.customSamlLoginText
      ) {
        this.customSamlLoginText =
          window.appGlobals.domain.configuration.customSamlLoginText;
      } else if (window.appGlobals.currentSamlLoginMessage) {
        this.customSamlLoginText = window.appGlobals.currentSamlLoginMessage;
      } else {
        this.customSamlLoginText = undefined;
      }

      setTimeout(() => {
        //TODO: Make return work - shold work now 24112020
        //this.$$('#a11y').target = this.$$('#form');
        //this.$$('#email').focus();
      }, 50);

      if (window.appGlobals.signupTermsPageId) {
        this.signupTermsId = window.appGlobals.signupTermsPageId;
      } else {
        this.signupTermsId = undefined;
      }

      if (window.appGlobals.currentForceSaml) {
        this.forceSecureSamlLogin = true;
      } else {
        this.forceSecureSamlLogin = false;
      }
    }
  }

  onEnterLogin(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this._validateAndSend(false);
    }
  }

  onEnterRegistration(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this._validateAndSend(true);
    }
  }

  onEnterOneTimeLogin(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this._validateAndSend(true);
    }
  }

  //TODO: Test and make sure this works as expected
  _networkError(event: CustomEvent) {
    const response = event.detail.response;

    if (response.url.indexOf("/api/users/register") > -1) {
      this.isSending = false;
      window.appGlobals.analytics.sendLoginAndSignup(
        -1,
        "Signup Fail",
        "Email",
        response.message
      );
    } else if (response.url.indexOf("/api/users/login") > -1) {
      this.isSending = false;
      window.appGlobals.analytics.sendLoginAndSignup(
        -1,
        "Login Fail",
        "Email",
        response.message
      );
    }
  }

  _forgotPassword() {
    (this.$$("#forgotPasswordDialog") as YpForgotPassword).open({ email: this.emailValue(true) });
  }

  connectedCallback() {
    super.connectedCallback();
    if (window.appGlobals && window.appGlobals.domain) {
      this.domain = window.appGlobals.domain;
    }
    this.addListener("yp-domain-changed", this._domainEvent.bind(this));
    this.addListener("yp-network-error", this._networkError.bind(this));
  }

  disconnectedCallback() {
    super.connectedCallback();
    this.removeListener("yp-domain-changed", this._domainEvent.bind(this));
    this.removeListener("yp-network-error", this._networkError.bind(this));
  }

  setup(onLoginFunction: Function, domain: YpDomainData) {
    this.onLoginFunction = onLoginFunction;
    this._setTexts();
    if (domain) {
      this.domain = domain;
    }
  }

  _setTexts() {
    this.emailErrorMessage = this.t("inputError");
    this.passwordErrorMessage = this.t("inputError");
    this.submitText = this.t("user.login");
  }

  emailValue(registerMode: boolean | undefined = undefined) {
    const email = (this.$$("#email") as TextField).value.trim();
    const regEmail = (this.$$("#regEmail") as TextField).value.trim();

    if (registerMode===undefined) {
      return email || regEmail;
    } else if (registerMode===true) {
      return regEmail;
    } else {
      return email;
    }
  }

  passwordValue(registerMode: boolean | undefined = undefined) {
    const password = (this.$$("#password") as TextField).value.trim();
    const regPassword = (this.$$("#regPassword") as TextField).value.trim();

    if (registerMode===undefined) {
      return password || regPassword;
    } else if (registerMode===true) {
      return regPassword;
    } else {
      return password;
    }
  }

  get fullnameValue(): string | void {
    if (this.$$("#fullname"))
      return (this.$$("#fullname") as HTMLInputElement).value.trim();
  }

  async _registerUser() {
    const user = (await window.serverApi.registerUser(
      this.credentials!
    )) as YpUserData;
    this.isSending = false;
    if (user) {
      window.appGlobals.analytics.sendLoginAndSignup(
        user.id,
        "Signup Success",
        "Email"
      );
      this._loginCompleted(user);
      console.debug(
        "Got register response for: " + user ? user.email : "unknown"
      );
      (this.$$("#createUserDialog") as Dialog).open = false;
    } else {
      console.error("No user in registerUser");
    }
  }

  async _loginUser() {
    const user = (await window.serverApi.loginUser(
      this.credentials!
    )) as YpUserData;
    this.isSending = false;
    if (user) {
      this._loginCompleted(user);
    } else {
      console.error("No user in loginUser");
    }
  }

  _validateAndSend(registerMode: boolean) {
    if (!this.isSending) {
      this.isSending = true;
      window.appGlobals.analytics.sendLoginAndSignup(
        -1,
        registerMode ? "Signup Submit" : "Login Submit",
        "Email"
      );
      debugger;
      if (
        this.emailValue(registerMode) &&
        this.passwordValue(registerMode) &&
        (!registerMode ||
          !this.registrationQuestionsGroup ||
          (
            this.$$("#registrationQuestions") as YpRegistrationQuestions
          ).validate())
      ) {
        this.userSpinner = true;
        this._setupJsonCredentials(registerMode);
        if (registerMode) {
          this._registerUser();
        } else {
          this._loginUser();
        }
        this.userSpinner = false;
      } else {
        this.fire("yp-error", this.t("user.completeForm"));
        window.appGlobals.analytics.sendLoginAndSignup(
          -1,
          registerMode ? "Signup Fail" : "Login Fail",
          "Email",
          "Form not validated"
        );
        this.isSending = false;
        return false;
      }
    } else {
      console.warn("Trying to call _validateAndSend while sending");
    }
  }

  _loginAfterSavePassword(user: YpUserData) {
    if (this.redirectToURL) YpNavHelpers.redirectTo(this.redirectToURL);
    if (this.onLoginFunction) {
      this.onLoginFunction(user);
    } else {
      window.appUser.setLoggedInUser(user);
    }
    this.close();
    this.fireGlobal("yp-logged-in", user);
  }

  _loginCompleted(user: YpUserData) {
    if (window.PasswordCredential &&
        this.emailValue() &&
        this.passwordValue()) {
      const c = new window.PasswordCredential({
        name: this.emailValue(),
        id: this.emailValue(),
        password: this.passwordValue(),
      });
      navigator.credentials
        .store(c)
        .then(() => {
          this._loginAfterSavePassword(user);
        })
        .catch((error) => {
          console.error(error);
          this._loginAfterSavePassword(user);
        });
    } else {
      this._loginAfterSavePassword(user);
    }
  }

  open(
    redirectToURL: string | undefined,
    email: string | undefined,
    collectionConfiguration: YpCollectionConfiguration | undefined
  ) {
    this.redirectToURL = redirectToURL;
    this.userSpinner = false;

    if (email) {
      this.email = email;
    }

    if (
      collectionConfiguration &&
      ((collectionConfiguration as YpGroupConfiguration)
        .disableFacebookLoginForGroup ||
        (collectionConfiguration as YpCommunityConfiguration)
          .disableFacebookLoginForCommunity)
    ) {
      window.appGlobals.disableFacebookLoginForGroup = true;
    }

    this.opened = true;

    window.appGlobals.analytics.sendLoginAndSignup(
      -1,
      "Signup/Login Opened",
      "Undecided"
    );

    setTimeout(() => {
      if (
        !this.forceSecureSamlLogin &&
        window.PasswordCredential &&
        navigator.credentials
      ) {
        navigator.credentials
          // @ts-ignore
          .get({ password: true })
          .then(async (credentials) => {
            // @ts-ignore
            const passwordCredentials = credentials as PasswordCredential;
            if (credentials && credentials.id && passwordCredentials.password) {
              this.email = credentials.id;
              this.password = passwordCredentials.password
                ? passwordCredentials.password
                : "";
              await this.requestUpdate();
              if (window.appUser.hasIssuedLogout === true) {
                console.log("Have issued logout not auto logging in");
              } else {
                //this._validateAndSend();
              }
            } else {
              console.warn("Canceling credentials.get");
            }
          });
      }
    });

    this._setupCustomRegistrationQuestions();
  }

  close() {
    this.opened = false;
    this.userSpinner = false;
  }
}
