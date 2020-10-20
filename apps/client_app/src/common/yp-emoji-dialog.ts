import { property, customElement, html } from 'lit-element';
import { EmojiButton, EmojiSelection } from '@joeattardi/emoji-button';
import { YpBaseElement } from './yp-base-element.js';
//import insertTextAtCursor from 'insert-text-at-cursor';

//TODO: Load this one later emoji-button is 256KB!
@customElement('yp-emoji-dialog')
export class YpEmojiDialog extends YpBaseElement {
  @property({ type: Object })
  inputTarget: HTMLInputElement | undefined;

  picker: EmojiButton | undefined;
  trigger: HTMLElement | undefined;

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
    this.trigger = undefined;
  }

  pickEmoji(selection: EmojiSelection) {
    if (this.inputTarget) {
      //TODO: Get this or something like it working
      //insertTextAtCursor(this.inputTarget, selection.emoji as string);
      let value = '';
      if (this.inputTarget.value) value = this.inputTarget.value;
      this.inputTarget.value = `${value}${selection.emoji}`;
      setTimeout(()=>{
        this.inputTarget!.scrollIntoView({
          block: 'center',
          inline: 'center',
          behavior: 'smooth',
        });
        this.inputTarget!.focus();
        this.inputTarget!.dispatchEvent(new CustomEvent("change"));
        this.inputTarget = undefined
        this.trigger = undefined
      })
    } else {
      console.error('No input target for emojis');
    }
  }

  open(trigger: HTMLElement, inputTarget: HTMLInputElement) {
    this.trigger = trigger
    this.inputTarget = inputTarget
    this.togglePicker()
  }

  togglePicker() {
    if (this.trigger)
      this.picker?.togglePicker(this.trigger);
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
