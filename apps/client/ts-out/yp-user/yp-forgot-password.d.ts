import "@material/web/dialog/dialog.js";
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/button/text-button.js";
import { YpBaseElement } from "../common/yp-base-element.js";
export declare class YpForgotPassword extends YpBaseElement {
    emailErrorMessage: string | undefined;
    email: string;
    emailHasBeenSent: boolean;
    isSending: boolean;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
    _onEnter(event: KeyboardEvent): void;
    _validateAndSend(): Promise<boolean>;
    connectedCallback(): void;
    disconnectedCallback(): void;
    _forgotPasswordError(event: CustomEvent): void;
    open(detail: {
        email: string;
    }): void;
    close(): void;
}
//# sourceMappingURL=yp-forgot-password.d.ts.map