export interface WavPackerAudioType {
    blob: Blob;
    url: string;
    channelCount: number;
    sampleRate: number;
    duration: number;
}
interface AudioData {
    bitsPerSample: number;
    channels: Float32Array[];
    data: Int16Array;
}
/**
 * Utility class for assembling PCM16 "audio/wav" data
 */
export declare class WavPacker {
    /**
     * Converts Float32Array of amplitude data to ArrayBuffer in Int16Array format
     */
    static floatTo16BitPCM(float32Array: Float32Array): ArrayBuffer;
    /**
     * Concatenates two ArrayBuffers
     */
    static mergeBuffers(leftBuffer: ArrayBuffer, rightBuffer: ArrayBuffer): ArrayBuffer;
    /**
     * Packs data into an Int16 format
     * @private
     * @param size - 0 = 1x Int16, 1 = 2x Int16
     * @param arg - value to pack
     */
    private _packData;
    /**
     * Packs audio into "audio/wav" Blob
     */
    pack(sampleRate: number, audio: AudioData): WavPackerAudioType;
}
declare global {
    interface Window {
        WavPacker: typeof WavPacker;
    }
}
export {};
//# sourceMappingURL=wav_packer.d.ts.map