import '@material/web/button/text-button.js';
import '@material/web/dialog/dialog.js';
import { YpBaseElement } from '../common/yp-base-element.js';
export declare class YpAcceptInvite extends YpBaseElement {
    token: string | undefined;
    errorMessage: string | undefined;
    inviteName: string | undefined;
    targetName: string | undefined;
    targetEmail: string | undefined;
    collectionConfiguration: YpCollectionConfiguration | undefined;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
    connectedCallback(): void;
    disconnectedCallback(): void;
    _inviteError(event: CustomEvent): void;
    _checkInviteSender(): Promise<void>;
    _acceptInvite(): void;
    afterLogin(token: string): void;
    _reallyAcceptInvite(): Promise<void>;
    _cancel(): void;
    open(token: string): void;
    reOpen(token: string): void;
    close(): void;
}
//# sourceMappingURL=yp-accept-invite.d.ts.map