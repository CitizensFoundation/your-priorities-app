import { TemplateResult } from 'lit';
import '../yp-user/yp-user-with-organization.js';
import { Snackbar } from '@material/mwc-snackbar';
export declare class AcNotificationToast extends Snackbar {
    notificationText: string;
    user: YpUserData | undefined;
    icon: string | undefined;
    largerFont: boolean;
    static get styles(): any[];
    render(): TemplateResult<1>;
    openDialog(user: YpUserData | undefined, notificationText: string, systemNotification: boolean, icon?: string | undefined, timeoutMs?: number | undefined, largerFont?: boolean | undefined): void;
}
//# sourceMappingURL=ac-notification-toast.d.ts.map