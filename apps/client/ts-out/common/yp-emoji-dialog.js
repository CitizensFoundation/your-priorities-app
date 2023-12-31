var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { createPopup } from '@picmo/popup-picker';
import { TwemojiRenderer } from '@picmo/renderer-twemoji';
import { YpBaseElement } from './yp-base-element.js';
//import insertTextAtCursor from 'insert-text-at-cursor';
//TODO: Load this one later emoji-button is 256KB!
let YpEmojiDialog = class YpEmojiDialog extends YpBaseElement {
    connectedCallback() {
        super.connectedCallback();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removePicker();
        this.trigger = undefined;
    }
    createPicker() {
        this.picker = createPopup({
            i18n: this.i18nStrings,
            renderer: new TwemojiRenderer(),
        }, {
            referenceElement: this.trigger,
            position: 'bottom-start',
        });
        this.picker.addEventListener('emoji:select', this.pickEmoji.bind(this));
        setTimeout(() => {
            this.picker?.open();
        });
    }
    removePicker() {
        this.picker?.removeEventListener('emoji:select', this.pickEmoji.bind(this));
        this.picker?.destroy();
        this.picker = undefined;
    }
    static get styles() {
        return [
            css `[hidden] { display: none !important; }`
        ];
    }
    pickEmoji(selection) {
        if (this.inputTarget) {
            //TODO: Get this or something like it working
            //insertTextAtCursor(this.inputTarget, selection.emoji as string);
            let value = '';
            if (this.inputTarget.value)
                value = this.inputTarget.value;
            this.inputTarget.value = `${value}${selection.emoji}`;
            setTimeout(() => {
                this.inputTarget.scrollIntoView({
                    block: 'center',
                    inline: 'center',
                    behavior: 'smooth',
                });
                //TODO: Scroll to the right place in the input box
                this.inputTarget.focus();
                this.inputTarget.dispatchEvent(new CustomEvent('change'));
                this.inputTarget = undefined;
                this.trigger = undefined;
                this.removePicker();
            });
        }
        else {
            console.error('No input target for emojis');
        }
    }
    open(trigger, inputTarget) {
        this.trigger = trigger;
        this.inputTarget = inputTarget;
        this.createPicker();
    }
    get i18nStrings() {
        //TODO: Finish localizing this
        return {
            'categories.activities': 'Activities',
            'categories.animals-nature': 'Animals & Nature',
            'categories.custom': 'Custom',
            'categories.flags': 'Flags',
            'categories.food-drink': 'Food & Drink',
            'categories.objects': 'Objects',
            'categories.people-body': 'People & Body',
            'categories.recents': 'Recently Used',
            'categories.smileys-emotion': 'Smileys & Emotion',
            'categories.symbols': 'Symbols',
            'categories.travel-places': 'Travel & Places',
            // Shown if there is an error creating or accessing the local emoji database.
            'error.load': 'Failed to load emojis',
            // Messages for the Recents category.
            'recents.clear': 'Clear recent emojis',
            'recents.none': "You haven't selected any emojis yet.",
            // A retry button shown on the error view.
            retry: 'Try again',
            // Tooltip/title for the clear search button in the search field.
            'search.clear': 'Clear search',
            // Shown when there is an error searching the emoji database.
            'search.error': 'Failed to search emojis',
            // Shown when no emojis match the search query.
            'search.notFound': 'No results found',
            // Placeholder for the search field.
            search: 'Search emojis...',
        };
    }
};
__decorate([
    property({ type: Object })
], YpEmojiDialog.prototype, "inputTarget", void 0);
YpEmojiDialog = __decorate([
    customElement('yp-emoji-dialog')
], YpEmojiDialog);
export { YpEmojiDialog };
//# sourceMappingURL=yp-emoji-dialog.js.map