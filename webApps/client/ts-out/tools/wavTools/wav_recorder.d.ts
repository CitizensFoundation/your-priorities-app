import { AudioAnalysisOutputType } from './analysis/audio_analysis.js';
import { WavPackerAudioType } from './wav_packer.js';
/**
 * Decodes audio into a wav file
 */
interface DecodedAudioType {
    blob: Blob;
    url: string;
    values: Float32Array;
    audioBuffer: AudioBuffer;
}
/**
 * Records live stream of user audio as PCM16 "audio/wav" data
 */
export declare class WavRecorder {
    private scriptSrc;
    private sampleRate;
    private outputToSpeakers;
    private debug;
    private _deviceChangeCallback;
    private _devices;
    private stream;
    private processor;
    private source;
    private node;
    private recording;
    private _lastEventId;
    private eventReceipts;
    private eventTimeout;
    private _chunkProcessor;
    private _chunkProcessorSize;
    private _chunkProcessorBuffer;
    private analyser;
    /**
     * Create a new WavRecorder instance
     */
    constructor({ sampleRate, outputToSpeakers, debug, }?: {
        sampleRate?: number;
        outputToSpeakers?: boolean;
        debug?: boolean;
    });
    /**
     * Decodes audio data from multiple formats to a Blob, url, Float32Array and AudioBuffer
     */
    static decode(audioData: Blob | Float32Array | Int16Array | ArrayBuffer | number[], sampleRate?: number, fromSampleRate?: number): Promise<DecodedAudioType>;
    /**
     * Logs data in debug mode
     */
    log(...args: any[]): true;
    /**
     * Retrieves the current sampleRate for the recorder
     */
    getSampleRate(): number;
    /**
     * Retrieves the current status of the recording
     */
    getStatus(): 'ended' | 'paused' | 'recording';
    /**
     * Sends an event to the AudioWorklet
     */
    private _event;
    /**
     * Sets device change callback, remove if callback provided is `null`
     */
    listenForDeviceChange(callback: ((devices: (MediaDeviceInfo & {
        default: boolean;
    })[]) => void) | null): true;
    /**
     * Manually request permission to use the microphone
     */
    requestPermission(): Promise<true>;
    /**
     * List all eligible devices for recording, will request permission to use microphone
     */
    listDevices(): Promise<(MediaDeviceInfo & {
        default?: boolean;
    })[]>;
    /**
     * Begins a recording session and requests microphone permissions if not already granted
     * Microphone recording indicator will appear on browser tab but status will be "paused"
     */
    begin(deviceId?: string): Promise<true>;
    /**
     * Gets the current frequency domain data from the recording track
     */
    getFrequencies(analysisType?: 'frequency' | 'music' | 'voice', minDecibels?: number, maxDecibels?: number): AudioAnalysisOutputType;
    /**
     * Pauses the recording
     * Keeps microphone stream open but halts storage of audio
     */
    pause(): Promise<true>;
    /**
     * Start recording stream and storing to memory from the connected audio source
     */
    record(chunkProcessor?: (data: {
        mono: Int16Array;
        raw: Int16Array;
    }) => any, chunkSize?: number): Promise<true>;
    /**
     * Clears the audio buffer, empties stored recording
     */
    clear(): Promise<true>;
    /**
     * Reads the current audio stream data
     */
    read(): Promise<{
        meanValues: Float32Array;
        channels: Float32Array[];
    }>;
    /**
     * Saves the current audio stream to a file
     */
    save(force?: boolean): Promise<WavPackerAudioType>;
    /**
     * Ends the current recording session and saves the result
     */
    end(): Promise<WavPackerAudioType>;
    /**
     * Performs a full cleanup of WavRecorder instance
     * Stops actively listening via microphone and removes existing listeners
     */
    quit(): Promise<true>;
}
export {};
//# sourceMappingURL=wav_recorder.d.ts.map