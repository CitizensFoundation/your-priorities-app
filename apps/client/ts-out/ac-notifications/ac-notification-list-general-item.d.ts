import { YpBaseElement } from '../common/yp-base-element.js';
export declare class AcNotificationListGenaralItem extends YpBaseElement {
    notification: AcNotificationData | undefined;
    user: YpUserData | undefined;
    post: YpPostData | undefined;
    icon: string | undefined;
    shortText: string | undefined;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
    _goTo(): void;
    get nameTruncated(): string;
    get shortTextTruncated(): string;
    goToPost(): void;
    _notificationChanged(): void;
    _addWithComma(text: string, toAdd: string): string;
}
//# sourceMappingURL=ac-notification-list-general-item.d.ts.map