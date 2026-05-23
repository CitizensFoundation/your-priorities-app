declare const _exports: BulkStatusUpdateWorker;
export = _exports;
/**
 * @class BulkStatusUpdateWorker
 * @constructor
 */
declare function BulkStatusUpdateWorker(): void;
declare class BulkStatusUpdateWorker {
    /**
     * Processes a bulk status update.
     * @param {object} bulkStatusUpdateInfo - Information for the bulk status update.
     * @param {(error?: any) => void} callback - The callback function.
     * @memberof BulkStatusUpdateWorker
     */
    process(bulkStatusUpdateInfo: object, callback: (error?: any) => void): void;
}
