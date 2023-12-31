import "@material/web/button/text-button.js";
import "@material/web/dialog/dialog.js";
import { YpBaseElement } from "../common/yp-base-element.js";
export declare class YpApiActionDialog extends YpBaseElement {
    action: string | undefined;
    method: string | undefined;
    confirmationText: string | undefined;
    confirmButtonText: string | undefined;
    onFinishedFunction: Function | undefined;
    finalDeleteWarning: boolean;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
    _onClose(): void;
    setup(action: string, confirmationText: string, onFinishedFunction?: Function | undefined, confirmButtonText?: string | undefined, method?: string | undefined): void;
    open(options?: {
        finalDeleteWarning: boolean;
    } | undefined): Promise<void>;
    _delete(): Promise<void>;
}
//# sourceMappingURL=yp-api-action-dialog.d.ts.map