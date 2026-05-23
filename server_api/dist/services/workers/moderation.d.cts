declare const _exports: ModerationWorker;
export = _exports;
/**
 * @class ModerationWorker
 * @constructor
 */
declare function ModerationWorker(): void;
declare class ModerationWorker {
    /**
     * Processes a moderation work package.
     * @param {object} workPackage - The work package for moderation.
     * @param {(error?: any) => void} callback - The callback function.
     * @memberof ModerationWorker
     */
    process(workPackage: object, callback: (error?: any) => void): Promise<void>;
}
