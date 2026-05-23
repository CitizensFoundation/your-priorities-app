declare const _exports: SimilaritiesWorker;
export = _exports;
/**
 * @class SimilaritiesWorker
 * @constructor
 */
declare function SimilaritiesWorker(): void;
declare class SimilaritiesWorker {
    /**
     * Processes a similarities work package.
     * @param {object} workPackage - The work package for similarities.
     * @param {(error?: any) => void} callback - The callback function.
     * @memberof SimilaritiesWorker
     */
    process(workPackage: object, callback: (error?: any) => void): void;
}
