declare const _exports: AnonymizationWorker;
export = _exports;
/**
 * Defines the AnonymizationWorker class.
 * @class AnonymizationWorker
 */
declare function AnonymizationWorker(): void;
declare class AnonymizationWorker {
    /**
     * Processes an anonymization work package.
     * @param {object} workPackage - The work package containing details for anonymization.
     * @param {(error?: any) => void} callback - The callback function.
     * @memberof AnonymizationWorker
     */
    process(workPackage: object, callback: (error?: any) => void): void;
}
