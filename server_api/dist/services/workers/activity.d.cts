declare const _exports: ActivityWorker;
export = _exports;
/**
 * Defines the ActivityWorker class.
 * @class ActivityWorker
 */
declare function ActivityWorker(): void;
declare class ActivityWorker {
    /**
     * Processes an activity.
     * @param {object} activityJson - The activity JSON object.
     * @param {(error?: any) => void} callback - The callback function.
     * @memberof ActivityWorker
     */
    process(activityJson: object, callback: (error?: any) => void): void;
}
