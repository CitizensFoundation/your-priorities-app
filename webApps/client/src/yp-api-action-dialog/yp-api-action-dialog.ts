import { html, css } from "lit";
import { property, customElement } from "lit/decorators.js";

import "@material/web/button/text-button.js";
import "@material/web/dialog/dialog.js";

import { YpBaseElement } from "../common/yp-base-element.js";
import { Dialog } from "@material/web/dialog/internal/dialog.js";

@customElement("yp-api-action-dialog")
export class YpApiActionDialog extends YpBaseElement {
  @property({ type: String })
  action: string | undefined;

  @property({ type: String })
  method: string | undefined;

  @property({ type: String })
  confirmationText: string | undefined;

  @property({ type: String })
  confirmButtonText: string | undefined;

  @property({ type: Object })
  onFinishedFunction: Function | undefined;

  @property({ type: Boolean })
  finalDeleteWarning = false;

  static override get styles() {
    return [
      super.styles,
      css`
        md-dialog {
          // height: 100%;
        }
        md-dialog[open][is-safari] {
         // height: 100%;
        }
      `,
    ];
  }

  override render() {
    return html`
      <md-dialog
        id="confirmationDialog"
        ?is-safari="${this.isSafari}"
        @close="${this._onClose}"
      >
        <div slot="content">${this.confirmationText}</div>
        <div slot="actions">
          <md-text-button dialogAction="cancel"
            @click="${()=>(this.$$("#confirmationDialog") as Dialog).close()}"
            >${this.t("cancel")}</md-text-button
          >
          <md-text-button dialogAction="accept" @click="${this._delete}"
            >${this.confirmButtonText || ""}</md-text-button
          >
        </div>
      </md-dialog>
    `;
  }

  _onClose() {
    this.fire("close");
  }

  setup(
    action: string,
    confirmationText: string,
    onFinishedFunction: Function | undefined = undefined,
    confirmButtonText: string | undefined = undefined,
    method: string | undefined = undefined
  ) {
    this.action = action;
    this.confirmationText = confirmationText;
    this.onFinishedFunction = onFinishedFunction;
    if (confirmButtonText) {
      this.confirmButtonText = confirmButtonText;
    } else {
      this.confirmButtonText = this.t("delete");
    }
    if (method) {
      this.method = method;
    } else {
      this.method = "DELETE";
    }
  }

  async open(options: { finalDeleteWarning: boolean } | undefined = undefined) {
    if (options && options.finalDeleteWarning) {
      this.finalDeleteWarning = true;
    }

    await this.updateComplete;

    (this.$$("#confirmationDialog") as Dialog).show();
  }

  async _delete() {
    if (!this.finalDeleteWarning && this.action && this.method) {
      const response = await window.serverApi.apiAction(
        this.action,
        this.method,
        { deleteConfirmed: true }
      );
      this.fire("api-action-finished");
      if (this.onFinishedFunction) {
        this.onFinishedFunction(response);
      }
      (this.$$("#confirmationDialog") as Dialog).close()
    } else {
      this.finalDeleteWarning = false;
      this.confirmationText = this.t("finalDeleteWarning");

      await this.updateComplete;

      (this.$$("#confirmationDialog") as Dialog).show();
    }
  }
}
