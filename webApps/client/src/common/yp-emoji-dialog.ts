import { css, html } from "lit";
import { property, query, customElement } from "lit/decorators.js";

import { YpBaseElement } from "./yp-base-element.js";
//import insertTextAtCursor from 'insert-text-at-cursor';
//TODO: See if we need to load this one lader
import "emoji-picker-element";

import "@material/web/dialog/dialog.js";
import { MdDialog } from "@material/web/dialog/dialog.js";

@customElement("yp-emoji-dialog")
export class YpEmojiDialog extends YpBaseElement {
  @property({ type: Object })
  inputTarget: HTMLInputElement | undefined;

  trigger: HTMLElement | undefined;

  override connectedCallback() {
    super.connectedCallback();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
  }

  static override get styles() {
    return [
      css`
        [hidden] {
          display: none !important;
        }
      `,
    ];
  }


  closeDialog() {
    (this.$$("#emojiDialog") as MdDialog).open = false;
    this.fire("dialog-closed")
  }

  open(trigger: HTMLElement, inputTarget: HTMLInputElement) {
    this.trigger = trigger;
    this.inputTarget = inputTarget;
    if (this.inputTarget) {
      (this.$$("#emojiDialog") as MdDialog).open = true;
    } else {
      console.error("No input target for emoji dialog");
    }
  }

  emojiClick(e: CustomEvent) {
    const emoji = e.detail.emoji;
    const emojiText = emoji.unicode;
    if (this.inputTarget) {
      const start = this.inputTarget.selectionStart;
      const end = this.inputTarget.selectionEnd;
      const text = this.inputTarget.value;
      this.inputTarget.value =
        text.substring(0, start || 0) + emojiText + text.substring(end || 0);
      this.inputTarget.focus();
      this.inputTarget.setSelectionRange(
        start + emojiText.length,
        start + emojiText.length
      );
    }
    this.closeDialog();
  }

  protected override render(): unknown {
    return html`
      <md-dialog id="emojiDialog" @closed="${this.closeDialog}">
        <div slot="content">
          <emoji-picker
            id="emojiPicker"
            @emoji-click="${this.emojiClick}"
          ></emoji-picker>
        </div>
        <div slot="actions">
          <md-button @click="${this.closeDialog}">${this.t("close")}</md-button>
        </div>
      </md-dialog>
    `;
  }
}
