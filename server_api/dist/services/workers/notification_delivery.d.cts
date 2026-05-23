declare const _exports: NotificationDeliveryWorker;
export = _exports;
/**
 * @class NotificationDeliveryWorker
 * @constructor
 */
declare function NotificationDeliveryWorker(): void;
declare class NotificationDeliveryWorker {
    /**
     * Processes a notification for delivery.
     * @param {object} notificationJson - The notification JSON object.
     * @param {(error?: any) => void} callback - The callback function.
     * @memberof NotificationDeliveryWorker
     */
    process(notificationJson: object, callback: (error?: any) => void): void;
}
