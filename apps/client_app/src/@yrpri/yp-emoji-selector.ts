import { property, customElement, html } from 'lit-element';
import { EmojiButton, EmojiSelection } from '@joeattardi/emoji-button';
import { YpBaseElement } from './yp-base-element.js';
import insertTextAtCursor from 'insert-text-at-cursor';

import '@material/mwc-icon-button';

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

  connectedCallback() {
    super.connectedCallback();
    this.picker = new EmojiButton({
      style: 'twemoji',
      i18n: this.i18nStrings,
    });

    this.picker.on('emoji', selection => this.pickEmoji(selection));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.picker?.off('emoji', selection => this.pickEmoji(selection));
    this.picker = undefined;
  }

  pickEmoji(selection: EmojiSelection) {
    if (this.inputTarget) {
      //TODO: Test if this actually works
      insertTextAtCursor(this.inputTarget, selection.emoji as string);
      //if (this.inputTarget.value) value = this.inputTarget.value;
      //this.inputTarget.value = `${value}${selection.emoji}`;
      setTimeout(()=>{
        this.inputTarget!.scrollIntoView({
          block: 'center',
          inline: 'center',
          behavior: 'smooth',
        });
        this.inputTarget!.focus();
      })
    } else {
      console.error('No input target for emojis');
    }
  }

  togglePicker() {
    this.picker?.togglePicker(this.$$('#trigger') as HTMLElement);
  }

  get i18nStrings() {
    //TODO: Finish localizing this
    return {
      search: this.t('findAnEmoji'),
      categories: {
        recents: this.t('recentlyUsedEmoji'),
        smileys: 'Smileys & Emotion',
        people: 'People & Body',
        animals: 'Animals & Nature',
        food: 'Food & Drink',
        activities: 'Activities',
        travel: 'Travel & Places',
        objects: 'Objects',
        symbols: 'Symbols',
        flags: 'Flags',
        custom: 'Custom',
      },
      notFound: 'No emojis found',
    };
  }
}
