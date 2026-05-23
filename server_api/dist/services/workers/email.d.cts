declare const _exports: EmailWorker;
export = _exports;
/**
 * @class EmailWorker
 * @constructor
 */
declare function EmailWorker(): void;
declare class EmailWorker {
    /**
     * Sends a single email.
     * @param {object} emailLocals - Locals for the email template.
     * @param {(error?: any) => void} callback - The callback function.
     * @memberof EmailWorker
     */
    sendOne(emailLocals: object, callback: (error?: any) => void): void;
}
