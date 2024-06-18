import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import { YpBaseElement } from "../common/yp-base-element.js";

import "@material/web/dialog/dialog.js";
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/button/text-button.js";
import { Dialog } from "@material/web/dialog/internal/dialog.js";
import { TextField } from "@material/web/textfield/internal/text-field.js";

@customElement("yp-reset-password")
export class YpResetPassword extends YpBaseElement {
  @property({ type: String })
  password = "";

  @property({ type: String })
  token = "";

  @property({ type: String })
  passwordErrorMessage = "";

  static override get styles() {
    return [
      super.styles,
      css`
        md-dialog[open][is-safari] {
          height: 100%;
        }
      `,
    ];
  }

  override render() {
    return html`
      <md-dialog
        id="dialog"
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
            validationMessage="${this.passwordErrorMessage}"
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

  onEnter(event: KeyboardEvent) {
    if (event.keyCode == 13) {
      event.stopPropagation();
      this._validateAndSend();
    }
  }

  async _validateAndSend() {
    const passwordField = this.$$("#password") as TextField;
    if (passwordField && passwordField.checkValidity() && passwordField.value) {
      let password = passwordField.value;
      const response = await window.serverApi.resetPassword(this.token, {
        password: passwordField.value,
      });

      //TODO Figure out the error here and test if it works
      if (!response || (response.error && response.error == "not_found")) {
        this.fire("yp-error", this.t("errorResetTokenNotFoundOrUsed"));
      } else {
        this.close();
        window.appGlobals.notifyUserViaToast(
          this.t("notification.passwordResetAndLoggedIn")
        );
        this._loginCompleted(response);
      }
    }
  }

  _cancel() {
    this.fire("cancel");
    window.location.href = "/";
  }

  _loginCompleted(user: YpUserData) {
    window.appUser.setLoggedInUser(user);
    this.fire("logged-in");
    window.location.href = "/";
  }

  async open(token: string) {
    if (token) {
      this.token = token;
      if (this.token.endsWith("/")) this.token = this.token.slice(0, -1);
    }
    await this.updateComplete;
    (this.$$("#dialog") as Dialog).show();
  }

  close() {
    (this.$$("#dialog") as Dialog).close();
  }
}
