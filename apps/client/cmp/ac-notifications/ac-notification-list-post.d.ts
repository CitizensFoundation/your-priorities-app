import { nothing } from 'lit';
import "@material/web/icon/icon.js";
import '../yp-magic-text/yp-magic-text.js';
import '../yp-user/yp-user-image.js';
import { YpBaseElement } from '../common/yp-base-element.js';
export declare class AcNotificationListPost extends YpBaseElement {
    notification: AcNotificationData | undefined;
    endorsementsText: string | undefined;
    oppositionsText: string | undefined;
    newPostMode: boolean | undefined;
    endorseMode: boolean | undefined;
    userName: string | undefined;
    user: YpUserData | undefined;
    post: YpPostData | undefined;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1> | typeof nothing;
    _goToPost(): void;
    _notificationChanged(): void;
    _createEndorsementStrings(): void;
    _addWithComma(text: string, toAdd: string): string;
}
//# sourceMappingURL=ac-notification-list-post.d.ts.map