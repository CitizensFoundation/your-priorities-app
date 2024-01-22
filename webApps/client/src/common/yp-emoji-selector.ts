import { html } from "lit";
import { property, customElement } from "lit/decorators.js";
import { YpBaseElement } from "./yp-base-element.js";
//import insertTextAtCursor from 'insert-text-at-cursor';

import "@material/web/iconbutton/icon-button.js";

//TODO: Load this one later emoji-button is 256KB!
@customElement("yp-emoji-selector")
export class YpEmojiSelector extends YpBaseElement {
  @property({ type: Object })
  inputTarget: HTMLInputElement | undefined;

  override render() {
    return html`
      <md-icon-button
        .label="${this.t("addEmoji")}"
        id="trigger"
        @click="${this.togglePicker}"
        ><md-icon>sentiment_satisfied_alt</md-icon></md-icon-button
      >
    `;
  }

  togglePicker() {
    window.appDialogs.getDialogAsync(
      "emojiDialog",
      (dialog: YpEmojiSelectorData) => {
        dialog.open(this.$$("#trigger") as HTMLInputElement, this.inputTarget!);
      }
    );
  }
}
