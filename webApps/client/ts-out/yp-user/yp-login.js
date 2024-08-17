var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import "./yp-registration-questions.js";
import "./yp-forgot-password.js";
import { YpBaseElement } from "../common/yp-base-element.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/textfield/filled-text-field.js";
import "@material/web/radio/radio.js";
import "@material/web/icon/icon.js";
import "@material/web/button/filled-tonal-button.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/text-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/dialog/dialog.js";
import "@material/web/progress/circular-progress.js";
let YpLogin = class YpLogin extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.userSpinner = false;
        this.reCaptchaSiteKey = "";
        this.name = "";
        this.email = "";
        this.password = "";
        this.submitText = "";
        this.forgotPasswordOpen = false;
        this.opened = false;
        this.dialogMode = false;
        this.forceSecureSamlLogin = false;
        this.directSamlIntegration = false;
        this.hasAnonymousLogin = false;
        this.disableFacebookLoginForGroup = false;
        this.hasOneTimeLoginWithName = false;
        this.fullWithLoginButton = false;
        this.isSending = false;
        this.reloadPageOnDialogClose = true;
    }
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
            css `
        :host {
          --md-dialog-container-color: var(--md-sys-color-surface);
          --md-filled-field-container-color: var(
            --md-sys-color-surface
          ) !important;
        }

        .createUserInputField {
          margin: 16px;
        }

        .dontHaveAccountInfo {
          align-items: center;
          width: fit-content;
          text-align: left;
          align-self: start;
          margin-top: 8px;
      }

        .createUserButton {
          margin-left: 4px;
        }

        .resetPasswordButton {
          width: fit-content;
          margin-left: -10px;
        }

        .loginButton[fullWithLoginButton] {
          width: 100%;
          --md-filled-button-container-shape: 4px;
        }

        .closeLoginDialog {
          margin-bottom: 6px;
        }

        md-filled-text-field {
          --md-filled-field-container-color: var(
            --md-sys-color-surface
          ) !important;
        }

        md-dialog[open][is-safari] {
          height: 100%;
        }

        .createUser {
          padding: 16px;
          text-align: left;
          margin-bottom: 8px;
          margin-top: 8px;
        }

        .loginInfo {
          padding-right: 4px;
          font-size: 16px;
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
          border: 1px solid;
          border-radius: 2px;
          text-align: center;
          text-decoration: none;
          font-size: 14px;
          line-height: 22px;
          white-space: nowrap;
          cursor: pointer;
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
          text-align: center;
        }

        .create-user-content,
        .login-user-row {
          display: flex;
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

        .loginField {
          margin-bottom: 8px;
          margin-top: 8px;
        }

        @media (max-width: 900px) {
          md-filled-text-field {
            width: 280px;
          }
          .login-user-row {
            flex-direction: column;
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
        return html `
      ${this.samlLoginButtonUrl
            ? html `
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
            : html `
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
        return html `<div
      class="layout vertical center-center socialMediaLogin"
      ?hidden="${!this.hasAdditionalAuthMethods}"
    >
      <div class="layout vertical center-center">
        ${this.hasAnonymousLogin
            ? html `
              <md-filled-tonal-button
                raised
                class="anonLoginButton"
                @click="${this.anonymousLogin}"
                >${this.t("participateAnonymously")}</md-filled-tonal-button
              >
            `
            : nothing}
        ${this.hasOneTimeLoginWithName
            ? html `
              <md-filled-tonal-button
                raised
                class="anonLoginButton"
                @click="${this.oneTimeLogin}"
                >${this.t("oneTimeLoginWithName")}</md-filled-tonal-button
              >
            `
            : nothing}

        <div class="layout horizontal">
          ${this.hasFacebookLogin
            ? html `
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
    renderLoginButton() {
        return html `<md-filled-button
        autofocus
        raised
        ?fullWithLoginButton="${this.fullWithLoginButton}"
        class="loginButton"
        @click="${() => this._validateAndSend(false)}"
        ><span class="capitalize"
          >${this.submitText}</span
        ></md-filled-button
      >
    </div>`;
    }
    renderLoginInput() {
        return html `<md-outlined-text-field
        id="email"
        type="email"
        .label="${this.t("user.email")}"
        name="username"
        pattern="^.+@.+$"
        minLength="5"
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
      <div style="width: 100%">
        ${this.renderForgotPasswordButton()}
      </div>
      `;
    }
    renderSamlInfo() {
        return html `
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
    `;
    }
    renderCustomUserRegistrationText() {
        return html `<div
      ?hidden="${!this.customUserRegistrationText}"
      class="customUserRegistrationText"
    >
      <yp-magic-text
        disableTranslation
        linkifyCutoff="100"
        .content="${this.customUserRegistrationText}"
      ></yp-magic-text>
    </div>`;
    }
    renderLoginSurface() {
        return html `${this.renderCustomUserRegistrationText()}
      ${this.renderSamlInfo()} ${this.renderAdditionalMethods()}

      <div ?hidden="${this.forceSecureSamlLogin}">
        <div class="orContainer" ?hidden="${!this.hasAdditionalAuthMethods}">
          <div class="strike">
            <span>${this.t("or")}</span>
          </div>
        </div>

        <div class="login-user-row layout vertical center-center">
          ${this.renderLoginInput()}
        </div>
        <div class="login-button-row layout vertical center-center">
          ${this.renderLoginButton()}
          <div class="layout horizontal dontHaveAccountInfo">
            ${this.t('dontHaveAnAccount')} ${this.renderCreateUserButton()}
          </div>
        </div>
      </div>`;
    }
    renderCreateUserButton() {
        return html `<md-text-button class="createUserButton" @click="${this.openCreateUser}"
      >${this.t("user.create")}</md-text-button
    >`;
    }
    renderForgotPasswordButton() {
        return html `<md-text-button class="resetPasswordButton" @click="${this._forgotPassword}"
      >${this.t("forgotPassword")}</md-text-button
    >`;
    }
    renderLoginDialog() {
        return html `
      <md-dialog
        id="loginDialog"
        class="createUser"
        @cancel="${this.scrimDisableAction}"
        ?is-safari="${this.isSafari}"
        transition="grow-right"
        ?open="${this.opened}"
        footerHidden
        @closed="${this.closeAndReset}"
        .fullscreen=${!this.wide}
      >
        <div slot="headline">
          <span class="headline">${this.t("loginAndRegistration")}</span>
        </div>
        <div slot="icon">
          <md-icon>person</md-icon>
        </div>

        <div class="create-user-content" slot="content">
          ${this.renderLoginSurface()}
        </div>
        <div slot="actions">
          <div class="loginInfoOptions layout horizontal center-center wrap">
            <md-icon-button
              class="closeLoginDialog"
              @click="${this._logingDialogClose}"
              ><md-icon>close</md-icon></md-icon-button
            >
          </div>
        </div>
      </md-dialog>
    `;
    }
    renderCreateUserSurface() {
        return html `<div class="create-user-content">
      <md-outlined-text-field
        id="fullname"
        type="text"
        .label="${this.userNameText}"
        maxLength="50"
        minLength="2"
        class="createUserInputField"
        required
        charCounter
      ></md-outlined-text-field>
      <md-outlined-text-field
        id="regEmail"
        type="email"
        .label="${this.t("user.email")}"
        name="username"
        class="createUserInputField"
        pattern=".+@.+"
        min="5"
        autocomplete="username"
      ></md-outlined-text-field>
      <md-outlined-text-field
        id="regPassword"
        type="password"
        minLength="5"
        class="createUserInputField"
        .label="${this.t("user.password")}"
        autocomplete="current-password"
        @keyup="${this.onEnterRegistration}"
      ></md-outlined-text-field>
      ${this.registrationQuestionsGroup
            ? html `
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
    </div>`;
    }
    renderCreateUserDialog() {
        return html `
      <md-dialog
        id="createUserDialog"
        class="createUser"
        @cancel="${this.scrimDisableAction}"
        ?is-safari="${this.isSafari}"
        transition="grow-left"
        .fullscreen=${!this.wide}
      >
        <div slot="headline" class="layout horizontal center-center">
          ${this.t("user.create")}
        </div>
        <div slot="content">${this.renderCreateUserSurface()}</div>
        <div slot="actions">
          <md-text-button
            @click="${this.cancelRegistration}"
            dialogAction="cancel"
            >${this.t("cancel")}</md-text-button
          >
          ${this.renderCreateUserButton()}
        </div>
      </md-dialog>
    `;
    }
    renderButtons() {
        return html `
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
        return html `
      <md-dialog
        id="dialogOneTimeWithName"
        @cancel="${this.scrimDisableAction}"
        ?is-safari="${this.isSafari}"
      >
        <div slot="headline">[[t('oneTimeLoginWithName')]]</div>
        <div slot="content">
          <md-filled-text-field
            id="oneTimeLoginWithNameId"
            type="text"
            .label="${this.userNameText}"
            maxlength="50"
            @keyup="${this._updateOneTimeLoginName}"
            autocomplete="off"
          ></md-filled-text-field>
          ${this.registrationQuestionsGroup
            ? html `
                <yp-registration-questions
                  id="registrationQuestionsOneTimeLogin"
                  @questions-changed="${this._registrationQuestionsChanged}"
                  @resize-scroller="${this._registrationQuestionsChanged}"
                  .group="${this.registrationQuestionsGroup}"
                ></yp-registration-questions>
              `
            : nothing}
        </div>

        <div class="buttons" slot="actions">
          <md-text-button dialogAction="cancel" @click="${this._cancel}"
            >${this.t("cancel")}</md-text-button
          >
          <md-text-button
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
        this.$$("#createUserDialog").show();
        if (this.$$("#loginDialog")) {
            this.$$("#loginDialog").close();
        }
    }
    cancelRegistration() {
        this.$$("#createUserDialog").close();
        if (this.$$("#loginDialog")) {
            this.$$("#loginDialog").show();
        }
    }
    _setupJsonCredentials(registerMode) {
        this.credentials = {
            name: this.fullnameValue,
            email: this.emailValue(registerMode),
            identifier: this.emailValue(registerMode),
            username: this.emailValue(registerMode),
            password: this.passwordValue(registerMode),
            registration_answers: this.registrationQuestionsGroup && this.$$("#registrationQuestions")
                ? this.$$("#registrationQuestions").getAnswers()
                : undefined,
        };
    }
    _updateOneTimeLoginName(event) {
        this.oneTimeLoginName = this.$$("#oneTimeLoginWithNameId").value;
        if (this.oneTimeLoginName && this.oneTimeLoginName.length > 0) {
            if (event.key == "enter") {
                this.finishOneTimeLoginWithName();
            }
        }
    }
    renderForgotPassword() {
        return html `
      <yp-forgot-password id="forgotPasswordDialog"></yp-forgot-password>
    `;
    }
    render() {
        if (this.dialogMode) {
            return html `
        ${this.renderLoginDialog()} ${this.renderCreateUserDialog()}
        ${this.renderForgotPassword()}
        ${this.hasOneTimeLoginWithName ? this.renderOneTimeDialog() : nothing}
      `;
        }
        else {
            return html `
        ${this.renderForgotPassword()}
        ${this.hasOneTimeLoginWithName ? this.renderOneTimeDialog() : nothing}
        ${this.renderLoginSurface()} ${this.renderCreateUserDialog()}
      `;
        }
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
        }
        else {
            this.registrationQuestionsGroup = undefined;
        }
    }
    _keySaml(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            this._openSamlLogin();
        }
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("opened")) {
            this._openedChanged();
        }
    }
    get customTermsIntroText() {
        if (window.appGlobals.currentGroup &&
            window.appGlobals.currentGroup.configuration &&
            window.appGlobals.currentGroup.configuration.customTermsIntroText) {
            return window.appGlobals.currentGroup.configuration.customTermsIntroText;
        }
        else {
            return this.t("signupTermsInfo");
        }
    }
    get userNameText() {
        if (window.appGlobals.currentGroup &&
            window.appGlobals.currentGroup.configuration &&
            window.appGlobals.currentGroup.configuration.customUserNamePrompt) {
            return window.appGlobals.currentGroup.configuration.customUserNamePrompt;
        }
        else {
            return this.t("user.name");
        }
    }
    get showSignupTerms() {
        return this.signupTermsId;
    }
    _isiOsInApp() {
        return (/iPad|iPhone|Android|android|iPod/.test(navigator.userAgent) &&
            !window.MSStream &&
            (/FBAN/.test(navigator.userAgent) ||
                /FBAV/.test(navigator.userAgent) ||
                /Instagram/.test(navigator.userAgent)));
    }
    _openTerms() {
        this.fire("yp-open-page", { pageId: this.signupTermsId });
    }
    _facebookLogin() {
        const domainName = window.location.hostname.split(".").slice(-2).join(".");
        let hostName;
        if (domainName.indexOf("forbrukerradet") > -1) {
            hostName = "mineideer";
        }
        else if (domainName.indexOf("parliament.scot") > -1) {
            hostName = "engage";
        }
        else if (domainName.indexOf("multicitychallenge.org") > -1) {
            hostName = "yp";
        }
        else if (domainName.indexOf("smarter.nj.gov") > -1) {
            hostName = "enjine";
        }
        else if (window.appGlobals.domain &&
            window.appGlobals.domain.loginCallbackCustomHostName) {
            hostName = window.appGlobals.domain.loginCallbackCustomHostName;
        }
        else {
            hostName = "login";
        }
        const url = "https://" + hostName + "." + domainName + "/api/users/auth/facebook";
        const width = 1000, height = 650, top = (window.outerHeight - height) / 2, left = (window.outerWidth - width) / 2, name = "_blank";
        if (this._isInApp()) {
            document.cookie =
                "ypRedirectCookie=" +
                    encodeURI(window.location.href) +
                    ";domain=." +
                    domainName +
                    ";path=/";
            window.location.href = url;
        }
        else {
            window.appUser.facebookPopupWindow = window.open(url, name, "width=" +
                width +
                ",height=" +
                height +
                ",scrollbars=0,top=" +
                top +
                ",left=" +
                left);
        }
        window.appUser.startPollingForLogin();
        this._startSpinner();
        window.appGlobals.analytics.sendLoginAndSignup(-1, "Login Submit", "Facebook");
    }
    oneTimeLogin() {
        this.oneTimeLoginName = undefined;
        this.$$("#dialogOneTimeWithName").show();
        setTimeout(() => {
            this.$$("#oneTimeLoginWithNameId")?.focus();
        }, 50);
    }
    finishOneTimeLoginWithName() {
        this.$$("#dialogOneTimeWithName").close();
        if (this.oneTimeLoginName &&
            (!this.registrationQuestionsGroup ||
                this.$$("#registrationQuestionsOneTimeLogin").validate())) {
            let registrationAnswers = undefined;
            if (this.registrationQuestionsGroup) {
                registrationAnswers = this.$$("#registrationQuestionsOneTimeLogin").getAnswers();
            }
            this.anonymousLogin("One Time Login", registrationAnswers);
        }
    }
    async anonymousLogin(loginSubType = "Anonymous", registrationAnswers = undefined) {
        if (window.appGlobals.currentAnonymousGroup) {
            window.appGlobals.analytics.sendLoginAndSignup(-1, "Signup Submit", loginSubType);
            this._startSpinner();
            const user = (await window.serverApi.registerAnonymously({
                groupId: window.appGlobals.currentAnonymousGroup.id,
                trackingParameters: window.appGlobals.originalQueryParameters,
                oneTimeLoginName: this.hasOneTimeLoginWithName
                    ? this.oneTimeLoginName
                    : null,
                registration_answers: registrationAnswers,
            }));
            this._cancel();
            this.isSending = false;
            if (user) {
                window.appGlobals.analytics.sendLoginAndSignup(user.id, "Signup Success", loginSubType);
                this._loginCompleted(user);
                if (this.$$("#dialogOneTimeWithName")) {
                    this.$$("#dialogOneTimeWithName").close();
                }
                return true;
            }
            else {
                console.error("No user in anonymousLogin");
                return false;
            }
        }
        else {
            console.error("No anon group in config");
            return false;
        }
    }
    _isInApp() {
        return (/iPad|iPhone|Android|android|iPod/.test(navigator.userAgent) &&
            !window.MSStream &&
            (/FBAN/.test(navigator.userAgent) ||
                /FBAV/.test(navigator.userAgent) ||
                /Instagram/.test(navigator.userAgent)));
    }
    _openSamlLogin() {
        if (this.forceSecureSamlLogin && window.appUser && window.appUser.user) {
            window.appUser.logout();
            setTimeout(() => {
                window.appUser.logout();
            });
        }
        const domainName = window.location.hostname.split(".").slice(-2).join(".");
        const url = "/api/users/auth/saml", width = 1200, height = 650, top = (window.outerHeight - height) / 2, left = (window.outerWidth - width) / 2, name = "_blank";
        if (this._isInApp()) {
            document.cookie =
                "ypRedirectCookie=" +
                    encodeURI(window.location.href) +
                    ";domain=." +
                    domainName +
                    ";path=/";
            window.location.href = url;
        }
        else {
            window.appUser.samlPopupWindow = window.open(url, name, "width=" +
                width +
                ",height=" +
                height +
                ",scrollbars=0,top=" +
                top +
                ",left=" +
                left);
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
    _domainEvent(event) {
        if (event.detail.domain) {
            this.domain = event.detail.domain;
        }
    }
    get hasAdditionalAuthMethods() {
        return (this.domain &&
            ((this.hasFacebookLogin && !this.disableFacebookLoginForGroup) ||
                this.hasSamlLogin ||
                this.hasAnonymousLogin ||
                this.hasOneTimeLoginWithName));
    }
    get hasFacebookLogin() {
        if (this.domain) {
            return this.domain.facebookLoginProvided;
        }
        else {
            return false;
        }
    }
    get hasGoogleLogin() {
        if (this.domain) {
            return false; //TODO: this.domain.googleLoginProvided;
        }
        else {
            return false;
        }
    }
    get hasSamlLogin() {
        if (this.domain) {
            return this.domain.samlLoginProvided;
        }
        else {
            return false;
        }
    }
    _openedChanged() {
        if (this.opened) {
            if (window.appGlobals.currentAnonymousGroup &&
                window.appGlobals.currentGroup &&
                window.appGlobals.currentGroup.configuration &&
                window.appGlobals.currentGroup.configuration.allowAnonymousUsers) {
                this.hasAnonymousLogin = true;
            }
            else {
                this.hasAnonymousLogin = false;
            }
            if (window.appGlobals.currentAnonymousGroup &&
                window.appGlobals.currentGroup &&
                window.appGlobals.currentGroup.configuration &&
                window.appGlobals.currentGroup.configuration.allowOneTimeLoginWithName) {
                this.hasOneTimeLoginWithName = true;
            }
            else {
                this.hasOneTimeLoginWithName = false;
            }
            if (window.appGlobals.disableFacebookLoginForGroup) {
                this.disableFacebookLoginForGroup = true;
            }
            else {
                this.disableFacebookLoginForGroup = false;
            }
            if (window.appGlobals.domain &&
                window.appGlobals.domain.configuration &&
                window.appGlobals.domain.configuration.customUserRegistrationText) {
                this.customUserRegistrationText =
                    window.appGlobals.domain.configuration.customUserRegistrationText;
            }
            else {
                this.customUserRegistrationText = undefined;
            }
            if (window.appGlobals.domain && window.appGlobals.domain.configuration) {
                this.samlLoginButtonUrl =
                    window.appGlobals.domain.configuration.samlLoginButtonUrl;
                this.directSamlIntegration =
                    window.appGlobals.domain.configuration.directSamlIntegration !==
                        undefined
                        ? window.appGlobals.domain.configuration.directSamlIntegration
                        : false;
            }
            else {
                this.samlLoginButtonUrl = undefined;
                this.directSamlIntegration = false;
            }
            if (window.appGlobals.domain &&
                window.appGlobals.domain.configuration &&
                window.appGlobals.domain.configuration.customSamlLoginText) {
                this.customSamlLoginText =
                    window.appGlobals.domain.configuration.customSamlLoginText;
            }
            else if (window.appGlobals.currentSamlLoginMessage) {
                this.customSamlLoginText = window.appGlobals.currentSamlLoginMessage;
            }
            else {
                this.customSamlLoginText = undefined;
            }
            setTimeout(() => {
                //TODO: Make return work - shold work now 24112020
                //this.$$('#a11y').target = this.$$('#form');
                //this.$$('#email').focus();
            }, 50);
            if (window.appGlobals.signupTermsPageId) {
                this.signupTermsId = window.appGlobals.signupTermsPageId;
            }
            else {
                this.signupTermsId = undefined;
            }
            if (window.appGlobals.currentForceSaml) {
                this.forceSecureSamlLogin = true;
            }
            else {
                this.forceSecureSamlLogin = false;
            }
        }
    }
    onEnterLogin(event) {
        if (event.key == "Enter") {
            this._validateAndSend(false);
        }
    }
    onEnterRegistration(event) {
        if (event.key == "Enter") {
            this._validateAndSend(true);
        }
    }
    onEnterOneTimeLogin(event) {
        if (event.key == "Enter") {
            this._validateAndSend(true);
        }
    }
    //TODO: Test and make sure this works as expected
    _networkError(event) {
        const response = event.detail.response;
        if (response.url.indexOf("/api/users/register") > -1) {
            this.isSending = false;
            window.appGlobals.analytics.sendLoginAndSignup(-1, "Signup Fail", "Email", response.message);
        }
        else if (response.url.indexOf("/api/users/login") > -1) {
            this.isSending = false;
            window.appGlobals.analytics.sendLoginAndSignup(-1, "Login Fail", "Email", response.message);
        }
    }
    _forgotPassword() {
        this.$$("#forgotPasswordDialog").open({
            email: this.emailValue(true),
        });
    }
    connectedCallback() {
        super.connectedCallback();
        if (window.appGlobals && window.appGlobals.domain) {
            this.domain = window.appGlobals.domain;
        }
        this.addListener("yp-domain-changed", this._domainEvent.bind(this));
        this.addListener("yp-network-error", this._networkError.bind(this));
        this.addGlobalListener("yp-logged-in-via-polling", this.close.bind(this));
        this.addGlobalListener("yp-language-loaded", this._setTexts.bind(this));
    }
    disconnectedCallback() {
        super.connectedCallback();
        this.removeListener("yp-domain-changed", this._domainEvent.bind(this));
        this.removeListener("yp-network-error", this._networkError.bind(this));
        this.removeGlobalListener("yp-logged-in-via-polling", this.close.bind(this));
        this.removeGlobalListener("yp-language-loaded", this._setTexts.bind(this));
    }
    setup(onLoginFunction, domain) {
        this.onLoginFunction = onLoginFunction;
        if (domain) {
            this.domain = domain;
        }
    }
    _setTexts() {
        this.emailErrorMessage = this.t("inputError");
        this.passwordErrorMessage = this.t("inputError");
        this.submitText = this.t("user.login");
    }
    emailValue(registerMode = undefined) {
        const email = this.$$("#email").value.trim();
        const regEmail = this.$$("#regEmail").value.trim();
        if (registerMode === undefined) {
            return email || regEmail;
        }
        else if (registerMode === true) {
            return regEmail;
        }
        else {
            return email;
        }
    }
    passwordValue(registerMode = undefined) {
        const password = this.$$("#password").value.trim();
        const regPassword = this.$$("#regPassword").value.trim();
        if (registerMode === undefined) {
            return password || regPassword;
        }
        else if (registerMode === true) {
            return regPassword;
        }
        else {
            return password;
        }
    }
    get fullnameValue() {
        if (this.$$("#fullname"))
            return this.$$("#fullname").value.trim();
    }
    async _registerUser() {
        const user = (await window.serverApi.registerUser(this.credentials));
        this.isSending = false;
        if (user) {
            window.appGlobals.analytics.sendLoginAndSignup(user.id, "Signup Success", "Email");
            this._loginCompleted(user);
            console.debug("Got register response for: " + user ? user.email : "unknown");
            this.$$("#createUserDialog").close();
        }
        else {
            this.fire("yp-error", this.t("user.alreadyRegisterred"));
            console.error("No user in registerUser");
        }
    }
    async _loginUser() {
        const user = (await window.serverApi.loginUser(this.credentials));
        this.isSending = false;
        if (user) {
            this._loginCompleted(user);
        }
        else {
            this.fire("yp-error", this.t("user.loginNotAuthorized"));
            console.error("No user in loginUser");
        }
    }
    _validateAndSend(registerMode) {
        if (!this.isSending) {
            this.isSending = true;
            window.appGlobals.analytics.sendLoginAndSignup(-1, registerMode ? "Signup Submit" : "Login Submit", "Email");
            if (this.emailValue(registerMode) &&
                this.passwordValue(registerMode) &&
                (!registerMode ||
                    !this.registrationQuestionsGroup ||
                    this.$$("#registrationQuestions").validate())) {
                this.userSpinner = true;
                this._setupJsonCredentials(registerMode);
                if (registerMode) {
                    this._registerUser();
                }
                else {
                    this._loginUser();
                }
                this.userSpinner = false;
                return true;
            }
            else {
                //this.fire("yp-error", this.t("user.completeForm"));
                window.appGlobals.analytics.sendLoginAndSignup(-1, registerMode ? "Signup Fail" : "Login Fail", "Email", "Form not validated");
                this.isSending = false;
                return false;
            }
        }
        else {
            console.warn("Trying to call _validateAndSend while sending");
            return false;
        }
    }
    _loginAfterSavePassword(user) {
        if (this.redirectToURL)
            YpNavHelpers.redirectTo(this.redirectToURL);
        if (this.onLoginFunction) {
            this.onLoginFunction(user);
        }
        else {
            window.appUser.setLoggedInUser(user);
        }
        this.close();
        this.fireGlobal("yp-logged-in", user);
    }
    _loginCompleted(user) {
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
        }
        else {
            this._loginAfterSavePassword(user);
        }
    }
    async openDialog(redirectToURL, email, collectionConfiguration) {
        this.redirectToURL = redirectToURL;
        this.userSpinner = false;
        if (email) {
            this.email = email;
        }
        if (collectionConfiguration &&
            (collectionConfiguration
                .disableFacebookLoginForGroup ||
                collectionConfiguration
                    .disableFacebookLoginForCommunity)) {
            window.appGlobals.disableFacebookLoginForGroup = true;
        }
        this.opened = true;
        await this.updateComplete;
        this.$$("md-dialog").show();
        window.appGlobals.analytics.sendLoginAndSignup(-1, "Signup/Login Opened", "Undecided");
        setTimeout(() => {
            if (!this.forceSecureSamlLogin &&
                window.PasswordCredential &&
                navigator.credentials) {
                navigator.credentials
                    // @ts-ignore
                    .get({ password: true })
                    .then(async (credentials) => {
                    // @ts-ignore
                    const passwordCredentials = credentials;
                    if (credentials && credentials.id && passwordCredentials.password) {
                        this.email = credentials.id;
                        this.password = passwordCredentials.password
                            ? passwordCredentials.password
                            : "";
                        await this.requestUpdate();
                        if (window.appUser.hasIssuedLogout === true) {
                            console.log("Have issued logout not auto logging in");
                        }
                        else {
                            //this._validateAndSend();
                        }
                    }
                    else {
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
        this.$$("md-dialog").close();
        console.log("Closed login dialog");
    }
};
__decorate([
    property({ type: Boolean })
], YpLogin.prototype, "userSpinner", void 0);
__decorate([
    property({ type: Object })
], YpLogin.prototype, "domain", void 0);
__decorate([
    property({ type: String })
], YpLogin.prototype, "reCaptchaSiteKey", void 0);
__decorate([
    property({ type: String })
], YpLogin.prototype, "emailErrorMessage", void 0);
__decorate([
    property({ type: String })
], YpLogin.prototype, "passwordErrorMessage", void 0);
__decorate([
    property({ type: String })
], YpLogin.prototype, "name", void 0);
__decorate([
    property({ type: String })
], YpLogin.prototype, "email", void 0);
__decorate([
    property({ type: String })
], YpLogin.prototype, "password", void 0);
__decorate([
    property({ type: String })
], YpLogin.prototype, "submitText", void 0);
__decorate([
    property({ type: String })
], YpLogin.prototype, "redirectToURL", void 0);
__decorate([
    property({ type: Boolean })
], YpLogin.prototype, "forgotPasswordOpen", void 0);
__decorate([
    property({ type: String })
], YpLogin.prototype, "heading", void 0);
__decorate([
    property({ type: String })
], YpLogin.prototype, "customUserRegistrationText", void 0);
__decorate([
    property({ type: Boolean })
], YpLogin.prototype, "opened", void 0);
__decorate([
    property({ type: Boolean })
], YpLogin.prototype, "dialogMode", void 0);
__decorate([
    property({ type: Object })
], YpLogin.prototype, "target", void 0);
__decorate([
    property({ type: Boolean })
], YpLogin.prototype, "forceSecureSamlLogin", void 0);
__decorate([
    property({ type: Boolean })
], YpLogin.prototype, "directSamlIntegration", void 0);
__decorate([
    property({ type: Boolean })
], YpLogin.prototype, "hasAnonymousLogin", void 0);
__decorate([
    property({ type: Boolean })
], YpLogin.prototype, "disableFacebookLoginForGroup", void 0);
__decorate([
    property({ type: String })
], YpLogin.prototype, "credentials", void 0);
__decorate([
    property({ type: Object })
], YpLogin.prototype, "pollingStartedAt", void 0);
__decorate([
    property({ type: Number })
], YpLogin.prototype, "signupTermsId", void 0);
__decorate([
    property({ type: String })
], YpLogin.prototype, "samlLoginButtonUrl", void 0);
__decorate([
    property({ type: String })
], YpLogin.prototype, "customSamlLoginText", void 0);
__decorate([
    property({ type: String })
], YpLogin.prototype, "oneTimeLoginName", void 0);
__decorate([
    property({ type: Boolean })
], YpLogin.prototype, "hasOneTimeLoginWithName", void 0);
__decorate([
    property({ type: Boolean })
], YpLogin.prototype, "fullWithLoginButton", void 0);
__decorate([
    property({ type: Object })
], YpLogin.prototype, "registrationQuestionsGroup", void 0);
YpLogin = __decorate([
    customElement("yp-login")
], YpLogin);
export { YpLogin };
//# sourceMappingURL=yp-login.js.map