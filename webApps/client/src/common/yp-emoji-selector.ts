import { html, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";
import { YpBaseElement } from "./yp-base-element.js";
//import insertTextAtCursor from 'insert-text-at-cursor';

import "@material/web/iconbutton/icon-button.js";
import "./yp-emoji-dialog.js";

//TODO: Load this one later emoji-button is 256KB!
@customElement("yp-emoji-selector")
export class YpEmojiSelector extends YpBaseElement {
  private static idCounter = 0;

  @property({ type: Object })
  inputTarget: HTMLInputElement | undefined;

  @property({ type: Boolean })
  open: boolean = false;

  private dialogId = `emojiPickerDialog-${YpEmojiSelector.idCounter++}`;

  override render() {
    return html`
      <md-icon-button
        id="trigger"
        aria-label="${this.t("addEmoji")}"
        title="${this.t("addEmoji")}"
        aria-haspopup="dialog"
        aria-controls="${this.open ? this.dialogId : nothing}"
        aria-expanded="${this.open ? "true" : "false"}"
        @click="${this.togglePicker}"
        ><md-icon>sentiment_satisfied_alt</md-icon></md-icon-button
      >
      ${this.open
        ? html`<yp-emoji-dialog
            id="${this.dialogId}"
            @dialog-closed="${() => (this.open = false)}"
            .inputTarget="${this.inputTarget}"
          ></yp-emoji-dialog>`
        : html``}
    `;
  }

  async togglePicker() {
    const trigger = this.$$("#trigger") as HTMLElement;
    this.open = true;
    await this.updateComplete;
    const emojiDialog = this.$$("yp-emoji-dialog") as any;
    emojiDialog.open(trigger, this.inputTarget!);
  }
}
