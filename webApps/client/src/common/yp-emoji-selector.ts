import { html } from "lit";
import { property, customElement } from "lit/decorators.js";
import { YpBaseElement } from "./yp-base-element.js";
//import insertTextAtCursor from 'insert-text-at-cursor';

import "@material/web/iconbutton/icon-button.js";
import "./yp-emoji-dialog.js";

//TODO: Load this one later emoji-button is 256KB!
@customElement("yp-emoji-selector")
export class YpEmojiSelector extends YpBaseElement {
  @property({ type: Object })
  inputTarget: HTMLInputElement | undefined;

  @property({ type: Boolean })
  open: boolean = false;

  override render() {
    return html`
      <md-icon-button
        .label="${this.t("addEmoji")}"
        id="trigger"
        @click="${this.togglePicker}"
        ><md-icon>sentiment_satisfied_alt</md-icon></md-icon-button
      >
      ${this.open
        ? html`<yp-emoji-dialog
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
