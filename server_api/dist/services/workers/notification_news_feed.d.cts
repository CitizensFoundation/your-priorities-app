declare const _exports: NotificationNewsFeedWorker;
export = _exports;
/**
 * @class NotificationNewsFeedWorker
 * @constructor
 */
declare function NotificationNewsFeedWorker(): void;
declare class NotificationNewsFeedWorker {
    /**
     * Processes a notification to generate a news feed item.
     * @param {object} notificationJson - The notification JSON object.
     * @param {(error?: any) => void} callback - The callback function.
     * @memberof NotificationNewsFeedWorker
     */
    process(notificationJson: object, callback: (error?: any) => void): void;
}
