import { YpBaseElement } from "./yp-base-element.js";
import "emoji-picker-element";
import "@material/web/dialog/dialog.js";
export declare class YpEmojiDialog extends YpBaseElement {
    inputTarget: HTMLInputElement | undefined;
    trigger: HTMLElement | undefined;
    connectedCallback(): void;
    disconnectedCallback(): void;
    static get styles(): import("lit").CSSResult[];
    closeDialog(): void;
    open(trigger: HTMLElement, inputTarget: HTMLInputElement): void;
    emojiClick(e: CustomEvent): void;
    protected render(): unknown;
}
//# sourceMappingURL=yp-emoji-dialog.d.ts.map