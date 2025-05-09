declare const _exports: DelayedJobWorker;
export = _exports;
/**
 * @class DelayedJobWorker
 * @constructor
 */
declare function DelayedJobWorker(): void;
declare class DelayedJobWorker {
    /**
     * Processes a delayed job.
     * @param {object} workPackage - The work package for the delayed job.
     * @param {(error?: any) => void} callback - The callback function.
     * @memberof DelayedJobWorker
     */
    process(workPackage: object, callback: (error?: any) => void): void;
}
