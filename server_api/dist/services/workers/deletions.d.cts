declare const _exports: DeletionWorker;
export = _exports;
/**
 * @class DeletionWorker
 * @constructor
 */
declare function DeletionWorker(): void;
declare class DeletionWorker {
    /**
     * Processes a deletion work package.
     * @param {object} workPackage - The work package containing details for the deletion.
     * @param {(error?: any) => void} callback - The callback function.
     * @memberof DeletionWorker
     */
    process(workPackage: object, callback: (error?: any) => void): void;
}
