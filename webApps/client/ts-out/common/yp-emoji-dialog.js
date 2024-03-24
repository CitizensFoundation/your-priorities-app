var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html } from "lit";
import { property, customElement } from "lit/decorators.js";
import { YpBaseElement } from "./yp-base-element.js";
//import insertTextAtCursor from 'insert-text-at-cursor';
//TODO: See if we need to load this one lader
import "emoji-picker-element";
import "@material/web/dialog/dialog.js";
let YpEmojiDialog = class YpEmojiDialog extends YpBaseElement {
    connectedCallback() {
        super.connectedCallback();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
    }
    static get styles() {
        return [
            css `
        emoji-picker {
          --background: var(--md-sys-color-lowest-surface);
          --border-color: var(--md-sys-color-lowest-surface);
        }
      `,
        ];
    }
    closeDialog() {
        this.$$("#emojiDialog").open = false;
        this.fire("dialog-closed");
    }
    open(trigger, inputTarget) {
        this.trigger = trigger;
        this.inputTarget = inputTarget;
        if (this.inputTarget) {
            this.$$("#emojiDialog").open = true;
        }
        else {
            console.error("No input target for emoji dialog");
        }
    }
    emojiClick(e) {
        const emoji = e.detail.emoji;
        const emojiText = emoji.unicode;
        if (this.inputTarget) {
            const start = this.inputTarget.selectionStart;
            const end = this.inputTarget.selectionEnd;
            const text = this.inputTarget.value;
            this.inputTarget.value =
                text.substring(0, start || 0) + emojiText + text.substring(end || 0);
            this.inputTarget.focus();
            this.inputTarget.setSelectionRange(start + emojiText.length, start + emojiText.length);
        }
        this.closeDialog();
    }
    render() {
        return html `
      <md-dialog id="emojiDialog" @closed="${this.closeDialog}">
        <div slot="content">
          <emoji-picker
            id="emojiPicker"
            @emoji-click="${this.emojiClick}"
          ></emoji-picker>
        </div>
        <div slot="actions">
          <md-text-button @click="${this.closeDialog}"
            >${this.t("close")}</md-text-button
          >
        </div>
      </md-dialog>
    `;
    }
};
__decorate([
    property({ type: Object })
], YpEmojiDialog.prototype, "inputTarget", void 0);
YpEmojiDialog = __decorate([
    customElement("yp-emoji-dialog")
], YpEmojiDialog);
export { YpEmojiDialog };
//# sourceMappingURL=yp-emoji-dialog.js.map