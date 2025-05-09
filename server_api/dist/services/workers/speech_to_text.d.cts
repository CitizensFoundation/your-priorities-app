declare const _exports: VoiceToTextWorker;
export = _exports;
/**
 * @class VoiceToTextWorker
 * @constructor
 */
declare function VoiceToTextWorker(): void;
declare class VoiceToTextWorker {
    /**
     * Processes a speech-to-text work package.
     * @param {object} workPackage - The work package for speech-to-text.
     * @param {(error?: any) => void} callback - The callback function.
     * @memberof VoiceToTextWorker
     */
    process(workPackage: object, callback: (error?: any) => void): void;
}
