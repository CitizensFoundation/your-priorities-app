var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css } from "lit";
import { property, customElement } from "lit/decorators.js";
import { YpBaseElement } from "../common/yp-base-element.js";
import "@material/web/dialog/dialog.js";
import "@material/web/button/text-button.js";
let YpConfirmationDialog = class YpConfirmationDialog extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.useFinalWarning = false;
        this.haveIssuedFinalWarning = false;
        this.hideCancel = false;
    }
    static get styles() {
        return [
            css `
        md-dialog[open][is-safari] {
          height: 100%;
        }
      `,
        ];
    }
    render() {
        return html `
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
        this.$$("#confirmationDialog").close();
    }
    async open(confirmationText, onConfirmedFunction, useModal = false, useFinalWarning = false, hideCancel = false) {
        this.confirmationText = confirmationText;
        this.onConfirmedFunction = onConfirmedFunction;
        if (useModal) {
            //TODO: Implrement when ready
            //(this.$$('#confirmationDialog') as Dialog).modal = true;
        }
        else {
            //TODO: Implrement when ready
            //(this.$$('#confirmationDialog') as Dialog).modal = false;
        }
        await this.updateComplete;
        this.$$("#confirmationDialog").show();
        if (useFinalWarning) {
            this.useFinalWarning = true;
        }
        else {
            this.useFinalWarning = false;
        }
        this.haveIssuedFinalWarning = false;
        if (hideCancel) {
            this.hideCancel = true;
        }
        else {
            this.hideCancel = false;
        }
    }
    _confirm() {
        if (this.useFinalWarning && !this.haveIssuedFinalWarning) {
            this.haveIssuedFinalWarning = true;
            this.$$("#confirmationDialog").close();
            this.confirmationText = this.t("finalDeleteWarning");
            setTimeout(() => {
                this.$$("#confirmationDialog").show();
            }, 350);
        }
        else {
            if (this.onConfirmedFunction) {
                this.onConfirmedFunction();
                this._reset();
            }
        }
        this.$$("#confirmationDialog").close();
    }
};
__decorate([
    property({ type: String })
], YpConfirmationDialog.prototype, "confirmationText", void 0);
__decorate([
    property({ type: Object })
], YpConfirmationDialog.prototype, "onConfirmedFunction", void 0);
__decorate([
    property({ type: Boolean })
], YpConfirmationDialog.prototype, "useFinalWarning", void 0);
__decorate([
    property({ type: Boolean })
], YpConfirmationDialog.prototype, "haveIssuedFinalWarning", void 0);
__decorate([
    property({ type: Boolean })
], YpConfirmationDialog.prototype, "hideCancel", void 0);
YpConfirmationDialog = __decorate([
    customElement("yp-confirmation-dialog")
], YpConfirmationDialog);
export { YpConfirmationDialog };
//# sourceMappingURL=yp-confirmation-dialog.js.map