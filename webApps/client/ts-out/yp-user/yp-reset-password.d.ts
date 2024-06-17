import { YpBaseElement } from "../common/yp-base-element.js";
import "@material/web/dialog/dialog.js";
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/button/text-button.js";
export declare class YpResetPassword extends YpBaseElement {
    password: string;
    token: string;
    passwordErrorMessage: string;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
    onEnter(event: KeyboardEvent): void;
    _validateAndSend(): Promise<void>;
    _cancel(): void;
    _loginCompleted(user: YpUserData): void;
    open(token: string): Promise<void>;
    close(): void;
}
//# sourceMappingURL=yp-reset-password.d.ts.map