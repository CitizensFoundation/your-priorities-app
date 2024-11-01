import { AudioAnalysis } from './analysis/audio_analysis.js';
type AnalysisType = 'frequency' | 'music' | 'voice';
interface TrackSampleOffset {
    trackId: string | null;
    offset: number;
    currentTime: number;
}
interface WavStreamPlayerOptions {
    sampleRate?: number;
}
/**
 * Plays audio streams received in raw PCM16 chunks from the browser
 */
export declare class WavStreamPlayer {
    private readonly scriptSrc;
    private readonly sampleRate;
    private context;
    private stream;
    private analyser;
    private trackSampleOffsets;
    private interruptedTrackIds;
    /**
     * Creates a new WavStreamPlayer instance
     * @param options - Configuration options
     * @returns WavStreamPlayer instance
     */
    constructor({ sampleRate }?: WavStreamPlayerOptions);
    /**
     * Connects the audio context and enables output to speakers
     * @returns Promise resolving to true when connected
     */
    connect(): Promise<true>;
    /**
     * Gets the current frequency domain data from the playing track
     * @param analysisType - Type of analysis to perform
     * @param minDecibels - Minimum decibels level
     * @param maxDecibels - Maximum decibels level
     * @returns Audio analysis output
     */
    getFrequencies(analysisType?: AnalysisType, minDecibels?: number, maxDecibels?: number): ReturnType<typeof AudioAnalysis.getFrequencies>;
    /**
     * Starts audio streaming
     * @private
     * @returns Promise resolving to true when started
     */
    private _start;
    /**
     * Adds 16BitPCM data to the currently playing audio stream
     * You can add chunks beyond the current play point and they will be queued for play
     * @param arrayBuffer - Buffer containing PCM data
     * @param trackId - Identifier for the track
     * @returns Int16Array containing the PCM data
     */
    add16BitPCM(arrayBuffer: ArrayBuffer | Int16Array, trackId?: string): Int16Array | void;
    /**
     * Gets the offset (sample count) of the currently playing stream
     * @param interrupt - Whether to interrupt the current stream
     * @returns Track sample offset information
     */
    getTrackSampleOffset(interrupt?: boolean): Promise<TrackSampleOffset | null>;
    /**
     * Strips the current stream and returns the sample offset of the audio
     * @param interrupt - Whether to interrupt the current stream
     * @returns Track sample offset information
     */
    interrupt(): Promise<TrackSampleOffset | null>;
}
declare global {
    var WavStreamPlayer: WavStreamPlayer;
    interface Window {
        WavStreamPlayer: WavStreamPlayer;
    }
}
export {};
//# sourceMappingURL=wav_stream_player.d.ts.map