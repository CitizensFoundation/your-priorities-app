import { property, customElement, html } from 'lit-element';
import { EmojiButton, EmojiSelection } from '@joeattardi/emoji-button';
import { YpBaseElement } from './yp-base-element.js';
//import insertTextAtCursor from 'insert-text-at-cursor';

import '@material/mwc-icon-button';

//TODO: Load this one later emoji-button is 256KB!
@customElement('yp-emoji-selector')
export class YpEmojiSelector extends YpBaseElement {
  @property({ type: Object })
  inputTarget: HTMLInputElement | undefined;

  picker: EmojiButton | undefined;

  render() {
    return html`
      <mwc-icon-button
        .label="${this.t('addEmoji')}"
        id="trigger"
        icon="face"
        @click="${this.togglePicker}"></mwc-icon-button>
    `;
  }

  togglePicker() {
    window.appDialogs.getDialogAsync("emojiDialog", (dialog: YpEmojiSelectorData) => {
      dialog.open(this.$$("#trigger") as HTMLInputElement, this.inputTarget!)
    })
  }
}
