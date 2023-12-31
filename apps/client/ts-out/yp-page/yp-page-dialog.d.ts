import { YpBaseElement } from "../common/yp-base-element.js";
import "@material/web/dialog/dialog.js";
import "@material/web/button/text-button.js";
import "@material/web/button/text-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/icon/icon.js";
export declare class YpPageDialog extends YpBaseElement {
    dialogTitle: string | undefined;
    page: YpHelpPageData | undefined;
    textButtonText: string | undefined;
    modal: boolean;
    closeFunction: Function | undefined;
    static get styles(): any[];
    scrimDisableAction(event: CustomEvent<any>): void;
    render(): import("lit-html").TemplateResult<1>;
    _switchLanguage(): void;
    get pageTitle(): string;
    open(page: YpHelpPageData, language: string, closeFunction?: Function | undefined, textButtonText?: string | undefined, modal?: boolean): Promise<void>;
    _close(): void;
}
//# sourceMappingURL=yp-page-dialog.d.ts.map