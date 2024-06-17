var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css } from "lit";
import { property, customElement } from "lit/decorators.js";
import "@material/web/button/text-button.js";
import "@material/web/dialog/dialog.js";
import { YpBaseElement } from "../common/yp-base-element.js";
let YpApiActionDialog = class YpApiActionDialog extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.finalDeleteWarning = false;
    }
    static get styles() {
        return [
            super.styles,
            css `
        md-dialog {
          // height: 100%;
        }
        md-dialog[open][is-safari] {
         // height: 100%;
        }
      `,
        ];
    }
    render() {
        return html `
      <md-dialog
        id="confirmationDialog"
        ?is-safari="${this.isSafari}"
        @close="${this._onClose}"
      >
        <div slot="content">${this.confirmationText}</div>
        <div slot="actions">
          <md-text-button dialogAction="cancel"
            @click="${() => this.$$("#confirmationDialog").close()}"
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
    setup(action, confirmationText, onFinishedFunction = undefined, confirmButtonText = undefined, method = undefined) {
        this.action = action;
        this.confirmationText = confirmationText;
        this.onFinishedFunction = onFinishedFunction;
        if (confirmButtonText) {
            this.confirmButtonText = confirmButtonText;
        }
        else {
            this.confirmButtonText = this.t("delete");
        }
        if (method) {
            this.method = method;
        }
        else {
            this.method = "DELETE";
        }
    }
    async open(options = undefined) {
        if (options && options.finalDeleteWarning) {
            this.finalDeleteWarning = true;
        }
        await this.updateComplete;
        this.$$("#confirmationDialog").show();
    }
    async _delete() {
        if (!this.finalDeleteWarning && this.action && this.method) {
            const response = await window.serverApi.apiAction(this.action, this.method, { deleteConfirmed: true });
            this.fire("api-action-finished");
            if (this.onFinishedFunction) {
                this.onFinishedFunction(response);
            }
            this.$$("#confirmationDialog").close();
        }
        else {
            this.finalDeleteWarning = false;
            this.confirmationText = this.t("finalDeleteWarning");
            await this.updateComplete;
            this.$$("#confirmationDialog").show();
        }
    }
};
__decorate([
    property({ type: String })
], YpApiActionDialog.prototype, "action", void 0);
__decorate([
    property({ type: String })
], YpApiActionDialog.prototype, "method", void 0);
__decorate([
    property({ type: String })
], YpApiActionDialog.prototype, "confirmationText", void 0);
__decorate([
    property({ type: String })
], YpApiActionDialog.prototype, "confirmButtonText", void 0);
__decorate([
    property({ type: Object })
], YpApiActionDialog.prototype, "onFinishedFunction", void 0);
__decorate([
    property({ type: Boolean })
], YpApiActionDialog.prototype, "finalDeleteWarning", void 0);
YpApiActionDialog = __decorate([
    customElement("yp-api-action-dialog")
], YpApiActionDialog);
export { YpApiActionDialog };
//# sourceMappingURL=yp-api-action-dialog.js.map