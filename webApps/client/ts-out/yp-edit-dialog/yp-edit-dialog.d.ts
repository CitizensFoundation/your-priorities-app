import { YpBaseElement } from "../common/yp-base-element.js";
import "@material/web/progress/circular-progress.js";
import "@material/web/button/text-button.js";
import "@material/web/dialog/dialog.js";
import "@material/web/icon/icon.js";
import "@material/web/iconbutton/icon-button.js";
import "../common/yp-form.js";
export declare class YpEditDialog extends YpBaseElement {
    action: string | undefined;
    tablet: boolean;
    baseAction: string | undefined;
    cancelText: string | undefined;
    buttonText: string | undefined;
    method: string;
    customValidationFunction: Function | undefined;
    errorText: string | undefined;
    snackbarText: string | undefined;
    snackbarTextCombined: string | undefined;
    saveText: string | undefined;
    response: object | undefined;
    params: YpEditFormParams | undefined;
    doubleWidth: boolean;
    icon: string | undefined;
    opened: boolean;
    useNextTabAction: boolean;
    nextActionText: string | undefined;
    uploadingState: boolean;
    disableDialog: boolean;
    confirmationText: string | undefined;
    heading: string;
    name: string | undefined;
    customSubmit: boolean;
    hideAllActions: boolean;
    static get styles(): any[];
    renderMobileView(): import("lit-html").TemplateResult<1>;
    renderDesktopView(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
    get narrow(): boolean;
    scrollResize(): void;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    _fileUploadStarting(): void;
    _fileUploadComplete(): void;
    _nextTab(): void;
    get computeClass(): "fullScreenDialog" | "popUpDialogDouble" | "popUpDialog";
    connectedCallback(): void;
    disconnectedCallback(): void;
    open(): void;
    close(): void;
    _formSubmitted(): void;
    _formResponse(event: CustomEvent): void;
    _formError(event: CustomEvent): void;
    _formInvalid(): void;
    submit(): void;
    _setSubmitDisabledStatus(status: boolean): void;
    get hasLongSaveText(): boolean | "" | undefined;
    get hasLongTitle(): boolean | "";
    _reallySubmit(validate?: boolean): Promise<void>;
    submitForce(): void;
    getForm(): HTMLElement | null;
    stopSpinner(): void;
    validate(): void;
    _showErrorDialog(errorText: string): void;
    _clearErrorText(): void;
}
//# sourceMappingURL=yp-edit-dialog.d.ts.map