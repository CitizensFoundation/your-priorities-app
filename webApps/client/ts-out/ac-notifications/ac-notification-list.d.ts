import { nothing } from "lit";
import "@material/web/button/text-button.js";
import "../yp-user/yp-user-info.js";
import "./ac-notification-list-post.js";
import "./ac-notification-list-point.js";
import "./ac-notification-list-general-item.js";
import { YpBaseElementWithLogin } from "../common/yp-base-element-with-login.js";
export declare class AcNotificationList extends YpBaseElementWithLogin {
    notifications: Array<AcNotificationData> | undefined;
    notificationGetTTL: number;
    oldestProcessedNotificationAt: Date | undefined;
    latestProcessedNotificationAt: Date | undefined;
    url: string;
    user: YpUserData | undefined;
    firstReponse: boolean;
    timer: ReturnType<typeof setTimeout> | undefined;
    unViewedCount: number;
    moreToLoad: boolean;
    opened: boolean;
    route: string | undefined;
    lastFetchStartedAt: number | undefined;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    static get styles(): any[];
    renderNotification(notification: AcNotificationData): import("lit-html").TemplateResult<1> | typeof nothing;
    render(): import("lit-html").TemplateResult<1>;
    scrollEvent(event: {
        last: number;
    }): void;
    get notificationsLength(): number;
    _openedChanged(): void;
    _getNotificationTypeAndName(theType: string | undefined, name: string | undefined): string;
    _openEdit(): void;
    _clearScrollThreshold(): void;
    _markAllAsViewed(): void;
    _reallyMarkAllAsViewed(): Promise<void>;
    _handleUnViewedCount(unViewedCount: number): void;
    markCurrentAsViewed(): void;
    _markAsViewed(notifications: Array<AcNotificationData>): void;
    _setAsViewed(body: {
        viewedIds: Array<number>;
    }): Promise<void>;
    _setAllLocalCurrentAsViewed(): void;
    _newNotificationsError(event: CustomEvent): void;
    _getNotifications(options?: AcNotificationsDateFetchOptions | undefined): Promise<AcNotificationsResponse>;
    _processNotifications(notificationsResponse: AcNotificationsResponse): void;
    _userChanged(): Promise<void>;
    _loggedInUserChanged(): void;
    cancelTimer(): void;
    _notificationType(notification: AcNotificationData, type: string): boolean;
    _startTimer(): void;
    _sendReloadPointsEvents(notifications: Array<AcNotificationData>): void;
    _loadNewNotificationsResponse(notificationsResponse: AcNotificationsResponse): void;
    _removeOldIfExists(notification: AcNotificationData): void;
    _getNotificationText(notification: AcNotificationData): string;
    _displayToast(notifications: Array<AcNotificationData>): void;
    _finalizeAfterResponse(notifications: Array<AcNotificationData>): void;
    _loadMoreData(): Promise<void>;
    loadNewData(): Promise<void>;
}
//# sourceMappingURL=ac-notification-list.d.ts.map