import { html, css } from "lit";
import { property, customElement } from "lit/decorators.js";

import { YpBaseElement } from "../common/yp-base-element.js";
import { Dialog } from "@material/mwc-dialog";

import "@material/web/dialog/dialog.js";
import "@material/web/button/text-button.js";

@customElement("yp-confirmation-dialog")
export class YpConfirmationDialog extends YpBaseElement {
  @property({ type: String })
  confirmationText: string | undefined;

  @property({ type: Object })
  onConfirmedFunction: Function | undefined;

  @property({ type: Boolean })
  useFinalWarning = false;

  @property({ type: Boolean })
  haveIssuedFinalWarning = false;

  @property({ type: Boolean })
  hideCancel = false;

  static get styles() {
    return [
      css`
        md-dialog[open][is-safari] {
          height: 100%;
        }
      `,
    ];
  }

  render() {
    return html`
      <md-dialog
        id="confirmationDialog"
        ?is-safari="${this.isSafari}"
        @cancel="${this.scrimDisableAction}"
      >
        <div slot="content">${this.confirmationText}</div>
        <div slot="actions">
          <md-text-button
            ?hidden="${this.hideCancel}"
            @click="${this._reset}"
            dialogAction="close"
            >${this.t("cancel")}</md-text-button
          >
          <md-text-button @click="${this._confirm}" dialogAction="save"
            >${this.t("confirm")}</md-text-button
          >
        </div>
      </md-dialog>
    `;
  }

  _reset() {
    this.confirmationText = undefined;
    this.onConfirmedFunction = undefined;
    this.haveIssuedFinalWarning = false;
    this.useFinalWarning = false;
    this.hideCancel = false;
    (this.$$("#confirmationDialog") as Dialog).close();
  }

  async open(
    confirmationText: string,
    onConfirmedFunction: Function | undefined,
    useModal = false,
    useFinalWarning = false,
    hideCancel = false
  ) {
    this.confirmationText = confirmationText;
    this.onConfirmedFunction = onConfirmedFunction;
    if (useModal) {
      //TODO: Implrement when ready
      //(this.$$('#confirmationDialog') as Dialog).modal = true;
    } else {
      //TODO: Implrement when ready
      //(this.$$('#confirmationDialog') as Dialog).modal = false;
    }
    await this.updateComplete;
    (this.$$("#confirmationDialog") as Dialog).show();
    if (useFinalWarning) {
      this.useFinalWarning = true;
    } else {
      this.useFinalWarning = false;
    }
    this.haveIssuedFinalWarning = false;
    if (hideCancel) {
      this.hideCancel = true;
    } else {
      this.hideCancel = false;
    }
  }

  _confirm() {
    if (this.useFinalWarning && !this.haveIssuedFinalWarning) {
      this.haveIssuedFinalWarning = true;
      (this.$$("#confirmationDialog") as Dialog).close();
      this.confirmationText = this.t("finalDeleteWarning");
      setTimeout(() => {
        (this.$$("#confirmationDialog") as Dialog).show();
      });
    } else {
      if (this.onConfirmedFunction) {
        this.onConfirmedFunction();
        this._reset();
      }
    }
    (this.$$("#confirmationDialog") as Dialog).close();
  }
}
