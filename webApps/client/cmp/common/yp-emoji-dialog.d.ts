import { EmojiSelection } from 'picmo';
import { PopupPickerController } from '@picmo/popup-picker';
import { YpBaseElement } from './yp-base-element.js';
export declare class YpEmojiDialog extends YpBaseElement {
    inputTarget: HTMLInputElement | undefined;
    picker: PopupPickerController | undefined;
    trigger: HTMLElement | undefined;
    connectedCallback(): void;
    disconnectedCallback(): void;
    createPicker(): void;
    removePicker(): void;
    static get styles(): import("lit").CSSResult[];
    pickEmoji(selection: EmojiSelection): void;
    open(trigger: HTMLElement, inputTarget: HTMLInputElement): void;
    get i18nStrings(): {
        'categories.activities': string;
        'categories.animals-nature': string;
        'categories.custom': string;
        'categories.flags': string;
        'categories.food-drink': string;
        'categories.objects': string;
        'categories.people-body': string;
        'categories.recents': string;
        'categories.smileys-emotion': string;
        'categories.symbols': string;
        'categories.travel-places': string;
        'error.load': string;
        'recents.clear': string;
        'recents.none': string;
        retry: string;
        'search.clear': string;
        'search.error': string;
        'search.notFound': string;
        search: string;
    };
}
//# sourceMappingURL=yp-emoji-dialog.d.ts.map