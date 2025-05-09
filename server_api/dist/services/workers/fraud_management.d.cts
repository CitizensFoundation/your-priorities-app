declare const _exports: FraudManagementWorker;
export = _exports;
/**
 * @class FraudManagementWorker
 * @constructor
 */
declare function FraudManagementWorker(): void;
declare class FraudManagementWorker {
    /**
     * Processes a fraud management work package.
     * @param {object} workPackage - The work package for fraud management.
     * @param {(error?: any) => void} callback - The callback function.
     * @memberof FraudManagementWorker
     */
    process(workPackage: object, callback: (error?: any) => void): Promise<void>;
}
