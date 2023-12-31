var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html } from "lit";
import { property, customElement } from "lit/decorators.js";
import { YpBaseElement } from "./yp-base-element.js";
//import insertTextAtCursor from 'insert-text-at-cursor';
import "@material/web/iconbutton/icon-button.js";
//TODO: Load this one later emoji-button is 256KB!
let YpEmojiSelector = class YpEmojiSelector extends YpBaseElement {
    render() {
        return html `
      <md-icon-button
        .label="${this.t("addEmoji")}"
        id="trigger"
        @click="${this.togglePicker}"
        ><md-icon>sentiment_satisfied_alt</md-icon></md-icon-button
      >
    `;
    }
    togglePicker() {
        window.appDialogs.getDialogAsync("emojiDialog", (dialog) => {
            dialog.open(this.$$("#trigger"), this.inputTarget);
        });
    }
};
__decorate([
    property({ type: Object })
], YpEmojiSelector.prototype, "inputTarget", void 0);
YpEmojiSelector = __decorate([
    customElement("yp-emoji-selector")
], YpEmojiSelector);
export { YpEmojiSelector };
//# sourceMappingURL=yp-emoji-selector.js.map