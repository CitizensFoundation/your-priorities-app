declare const _exports: MarketingWorker;
export = _exports;
/**
 * @class MarketingWorker
 * @constructor
 */
declare function MarketingWorker(): void;
declare class MarketingWorker {
    /**
     * Processes a marketing work package.
     * @param {object} workPackage - The work package for marketing.
     * @param {(error?: any) => void} callback - The callback function.
     * @memberof MarketingWorker
     */
    process(workPackage: object, callback: (error?: any) => void): void;
}
