var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { YpBaseElement } from "../common/yp-base-element.js";
import "@material/web/dialog/dialog.js";
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/button/text-button.js";
let YpResetPassword = class YpResetPassword extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.password = "";
        this.token = "";
        this.passwordErrorMessage = "";
    }
    static get styles() {
        return [super.styles, css `
      md-dialog[open][is-safari] {
          height: 100%;
        }
    `];
    }
    render() {
        return html `
      <md-dialog id="dialog"
        @cancel="${this.scrimDisableAction}"
        ?is-safari="${this.isSafari}"
      >
        <div slot="headline">${this.t("user.resetPassword")}</div>

        <div slot="content">
          <p>${this.t("user.resetPasswordInstructions")}</p>

          <md-outlined-text-field
            id="password"
            @keydown="${this.onEnter}"
            type="password"
            .label="${this.t("password")}"
            .value="${this.password}"
            autocomplete="off"
            .validationMessage="${this.passwordErrorMessage}"
          >
          </md-outlined-text-field>
        </div>

        <div class="buttons" slot="actions">
          <md-text-button @click="${this._cancel}"
            >${this.t("cancel")}</md-text-button
          >
          <md-text-button autofocus @click="${this._validateAndSend}"
            >${this.t("user.resetPassword")}</md-text-button
          >
        </div>
      </md-dialog>
    `;
    }
    onEnter(event) {
        if (event.keyCode == 13) {
            event.stopPropagation();
            this._validateAndSend();
        }
    }
    async _validateAndSend() {
        const passwordField = this.$$("#password");
        if (passwordField && passwordField.checkValidity() && passwordField.value) {
            const response = await window.serverApi.resetPassword(this.token, {
                password: passwordField.value,
            });
            //TODO Figure out the error here and test if it works
            if (!response || (response.error && response.error == "not_found")) {
                this.fire("yp-error", this.t("errorResetTokenNotFoundOrUsed"));
            }
            else {
                this.close();
                window.appGlobals.notifyUserViaToast(this.t("notification.passwordResetAndLoggedIn"));
                this._loginCompleted(response);
            }
        }
    }
    _cancel() {
        this.fire("cancel");
    }
    _loginCompleted(user) {
        window.appUser.setLoggedInUser(user);
        this.fire("logged-in");
    }
    open(token) {
        if (token)
            this.token = token;
        this.$$("#dialog").show();
    }
    close() {
        this.$$("#dialog").close();
    }
};
__decorate([
    property({ type: String })
], YpResetPassword.prototype, "password", void 0);
__decorate([
    property({ type: String })
], YpResetPassword.prototype, "token", void 0);
__decorate([
    property({ type: String })
], YpResetPassword.prototype, "passwordErrorMessage", void 0);
YpResetPassword = __decorate([
    customElement("yp-reset-password")
], YpResetPassword);
export { YpResetPassword };
//# sourceMappingURL=yp-reset-password.js.map