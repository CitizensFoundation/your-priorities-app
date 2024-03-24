import { YpBaseElement } from "./yp-base-element.js";
import "@material/web/iconbutton/icon-button.js";
import "./yp-emoji-dialog.js";
export declare class YpEmojiSelector extends YpBaseElement {
    inputTarget: HTMLInputElement | undefined;
    open: boolean;
    render(): import("lit-html").TemplateResult<1>;
    togglePicker(): Promise<void>;
}
//# sourceMappingURL=yp-emoji-selector.d.ts.map