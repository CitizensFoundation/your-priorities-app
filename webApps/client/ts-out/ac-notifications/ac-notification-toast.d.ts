import '../yp-user/yp-user-with-organization.js';
import { YpSnackbar } from '../yp-app/yp-snackbar.js';
export declare class AcNotificationToast extends YpSnackbar {
    user: YpUserData | undefined;
    icon: string | undefined;
    largerFont: boolean;
    static get styles(): (any[] | import("lit").CSSResult)[];
    render(): import("lit-html").TemplateResult<1>;
    openDialog(user: YpUserData | undefined, notificationText: string, systemNotification: boolean, icon?: string | undefined, timeoutMs?: number | undefined, largerFont?: boolean | undefined): void;
}
//# sourceMappingURL=ac-notification-toast.d.ts.map