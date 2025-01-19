import { YpBaseElement } from "../common/yp-base-element.js";
import "@material/web/dialog/dialog.js";
import "@material/web/button/text-button.js";
export declare class YpConfirmationDialog extends YpBaseElement {
    confirmationText: string | undefined;
    onConfirmedFunction: Function | undefined;
    useFinalWarning: boolean;
    haveIssuedFinalWarning: boolean;
    hideCancel: boolean;
    static get styles(): import("lit").CSSResult[];
    _close(): void;
    render(): import("lit-html").TemplateResult<1>;
    _reset(): void;
    open(confirmationText: string, onConfirmedFunction: Function | undefined, useModal?: boolean, useFinalWarning?: boolean, hideCancel?: boolean): Promise<void>;
    _confirm(): void;
}
//# sourceMappingURL=yp-confirmation-dialog.d.ts.map