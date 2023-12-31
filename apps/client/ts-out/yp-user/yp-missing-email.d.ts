import '@material/web/button/text-button.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/dialog/dialog.js';
import { YpBaseElement } from '../common/yp-base-element.js';
export declare class YpMissingEmail extends YpBaseElement {
    emailErrorMessage: string | undefined;
    passwordErrorMessage: string | undefined;
    needPassword: boolean;
    linkAccountText: boolean;
    onlyConfirmingEmail: boolean;
    originalConfirmationEmail: string | undefined;
    email: string | undefined;
    password: string | undefined;
    heading: string | undefined;
    target: HTMLElement | undefined;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
    get submitButtonLabel(): string;
    _onEnter(event: KeyboardEvent): void;
    _notNow(): void;
    _logout(): void;
    _forgotPassword(): void;
    connectedCallback(): void;
    get credentials(): {
        email: string;
        password: string | undefined;
    };
    _validateAndSend(): Promise<boolean>;
    open(onlyConfirming: boolean, email: string): void;
    close(): void;
}
//# sourceMappingURL=yp-missing-email.d.ts.map