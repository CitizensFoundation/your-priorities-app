/**
 * Output of AudioAnalysis for the frequency domain of the audio
 */
export interface AudioAnalysisOutputType {
    /** Amplitude of this frequency between {0, 1} inclusive */
    values: Float32Array;
    /** Raw frequency bucket values */
    frequencies: number[];
    /** Labels for the frequency bucket values */
    labels: string[];
}
/**
 * Analyzes audio for visual output
 */
export declare class AudioAnalysis {
    private fftResults;
    private audio;
    private context;
    private analyser;
    private sampleRate;
    private audioBuffer;
    /**
     * Retrieves frequency domain data from an AnalyserNode adjusted to a decibel range
     * returns human-readable formatting and labels
     * @param analyser
     * @param sampleRate
     * @param fftResult
     * @param analysisType
     * @param minDecibels default -100
     * @param maxDecibels default -30
     * @returns
     */
    static getFrequencies(analyser: AnalyserNode, sampleRate: number, fftResult?: Float32Array, analysisType?: 'frequency' | 'music' | 'voice', minDecibels?: number, maxDecibels?: number): AudioAnalysisOutputType;
    /**
     * Creates a new AudioAnalysis instance for an HTMLAudioElement
     * @param audioElement
     * @param audioBuffer If provided, will cache all frequency domain data from the buffer
     */
    constructor(audioElement: HTMLAudioElement, audioBuffer?: AudioBuffer | null);
    /**
     * Gets the current frequency domain data from the playing audio track
     * @param analysisType
     * @param minDecibels default -100
     * @param maxDecibels default -30
     * @returns
     */
    getFrequencies(analysisType?: 'frequency' | 'music' | 'voice', minDecibels?: number, maxDecibels?: number): AudioAnalysisOutputType;
    /**
     * Resume the internal AudioContext if it was suspended due to the lack of
     * user interaction when the AudioAnalysis was instantiated.
     * @returns
     */
    resumeIfSuspended(): Promise<true>;
}
//# sourceMappingURL=audio_analysis.d.ts.map