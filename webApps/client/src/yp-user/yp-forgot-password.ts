import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import "@material/web/dialog/dialog.js";
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/button/text-button.js";
import { Dialog } from "@material/web/dialog/internal/dialog.js";
import { TextField } from "@material/web/textfield/internal/text-field.js";

import { YpBaseElement } from "../common/yp-base-element.js";

@customElement("yp-forgot-password")
export class YpForgotPassword extends YpBaseElement {
  @property({ type: String })
  emailErrorMessage: string | undefined;

  @property({ type: String })
  email = "";

  @property({ type: Boolean })
  emailHasBeenSent = false;

  @property({ type: Boolean })
  isSending = false;

  static override get styles() {
    return [
      super.styles,
      css`
        md-dialog {
         // height: 100%;
        }

        md-dialog[open][is-safari] {
          //height: 100%;
        }

        :host {
          --md-dialog-container-color: var(--md-sys-color-surface);
          --md-filled-field-container-color: var(
            --md-sys-color-surface
          ) !important;
        }

        md-filled-text-field {
          --md-filled-field-container-color: var(
            --md-sys-color-surface
          ) !important;
        }
        md-outlined-text-field {
          text-align: left;
        }
      `,
    ];
  }

  closed() {
    this.fireGlobal("yp-dialog-closed");
  }

  override render() {
    return html`
      <md-dialog
        id="dialog"
        ?is-safari="${this.isSafari}"
        @closed="${this.closed}"
        @cancel="${this.scrimDisableAction}"
        class="layout vertical center-center"
      >
        <div slot="headline">${this.t("user.forgotPassword")}</div>

        <div slot="content">
          <p ?hidden="${this.emailHasBeenSent}">
            ${this.t("user.forgotPasswordInstructions")}
          </p>

          <p ?hidden="${!this.emailHasBeenSent}">
            ${this.t("user.forgotPasswordEmailHasBeenSent")}
          </p>

          <md-outlined-text-field
            id="email"
            type="email"
            @keydown="${this._onEnter}"
            .label="${this.t("email")}"
            .value="${this.email}"
            pattern=".+@.+"
            minLength="3"
            ?hidden="${this.emailHasBeenSent}"
          >
          </md-outlined-text-field>
        </div>

        <div slot="actions">
          <md-text-button
            dialogAction="cancel"
            @click="${this.close}"
            ?hidden="${this.emailHasBeenSent}"
            >${this.t("cancel")}</md-text-button
          >
          <md-text-button
            autofocus
            ?hidden="${this.emailHasBeenSent}"
            @click="${this._validateAndSend}"
            >${this.t("user.forgotPassword")}</md-text-button
          >

          <md-text-button dialogAction="ok"
            ?hidden="${!this.emailHasBeenSent}"
            @click="${this.close}"
            >${this.t("ok")}</md-text-button
          >
        </div>
      </md-dialog>
    `;
  }

  _onEnter(event: KeyboardEvent) {
    if (event.keyCode == 13) {
      event.stopPropagation();
      this._validateAndSend();
    }
  }

  async _validateAndSend() {
    const email = this.$$("#email") as TextField;
    if (email && email.checkValidity() && email.value) {
      if (!this.isSending) {
        this.isSending = true;

        const response = await window.serverApi.forgotPassword({
          email: email.value,
        });

        this.isSending = false;

        if (response) {
          window.appGlobals.notifyUserViaToast(
            this.t("user.forgotPasswordEmailHasBeenSent")
          );
          this.emailHasBeenSent = true;
        }
      }
      return true;
    } else {
      this.fire("yp-error", this.t("user.completeForm"));
      return false;
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addGlobalListener(
      "yp-network-error",
      this._forgotPasswordError.bind(this)
    );
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeGlobalListener(
      "yp-network-error",
      this._forgotPasswordError.bind(this)
    );
  }

  _forgotPasswordError(event: CustomEvent) {
    if (event.detail.errorId && event.detail.errorId == "forgotPassword") {
      this.isSending = false;
    }
  }

  open(detail: { email: string }) {
    if (detail && detail.email) {
      this.email = detail.email;
    }

    this.fireGlobal("yp-dialog-opened");

    (this.$$("#dialog") as Dialog).show();
  }

  close() {
    (this.$$("#dialog") as Dialog).close();
  }
}
