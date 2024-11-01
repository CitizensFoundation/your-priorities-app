// https://github.com/openai/openai-realtime-console/blob/main/src/lib/wavtools/lib/wav_stream_player.js

import { StreamProcessorSrc } from './worklets/stream_processor.js';
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

interface StreamProcessorMessage {
  event: 'stop' | 'offset' | 'write' | 'interrupt';
  requestId?: string;
  trackId?: string;
  offset?: number;
  buffer?: Int16Array;
}

/**
 * Plays audio streams received in raw PCM16 chunks from the browser
 */
export class WavStreamPlayer {
  private readonly scriptSrc: string;
  private readonly sampleRate: number;
  private context: AudioContext | null;
  private stream: AudioWorkletNode | null;
  private analyser: AnalyserNode | null;
  private trackSampleOffsets: Record<string, TrackSampleOffset>;
  private interruptedTrackIds: Record<string, boolean>;

  /**
   * Creates a new WavStreamPlayer instance
   * @param options - Configuration options
   * @returns WavStreamPlayer instance
   */
  constructor({ sampleRate = 44100 }: WavStreamPlayerOptions = {}) {
    this.scriptSrc = StreamProcessorSrc;
    this.sampleRate = sampleRate;
    this.context = null;
    this.stream = null;
    this.analyser = null;
    this.trackSampleOffsets = {};
    this.interruptedTrackIds = {};
  }

  /**
   * Connects the audio context and enables output to speakers
   * @returns Promise resolving to true when connected
   */
  async connect(): Promise<true> {
    this.context = new AudioContext({ sampleRate: this.sampleRate });
    if (this.context.state === 'suspended') {
      await this.context.resume();
    }
    try {
      await this.context.audioWorklet.addModule(this.scriptSrc);
    } catch (e) {
      console.error(e);
      throw new Error(`Could not add audioWorklet module: ${this.scriptSrc}`);
    }
    const analyser = this.context.createAnalyser();
    analyser.fftSize = 8192;
    analyser.smoothingTimeConstant = 0.1;
    this.analyser = analyser;
    return true;
  }

  /**
   * Gets the current frequency domain data from the playing track
   * @param analysisType - Type of analysis to perform
   * @param minDecibels - Minimum decibels level
   * @param maxDecibels - Maximum decibels level
   * @returns Audio analysis output
   */
  getFrequencies(
    analysisType: AnalysisType = 'frequency',
    minDecibels = -100,
    maxDecibels = -30
  ): ReturnType<typeof AudioAnalysis.getFrequencies> {
    if (!this.analyser) {
      throw new Error('Not connected, please call .connect() first');
    }
    return AudioAnalysis.getFrequencies(
      this.analyser,
      this.sampleRate,
      undefined,
      analysisType,
      minDecibels,
      maxDecibels
    );
  }

  /**
   * Starts audio streaming
   * @private
   * @returns Promise resolving to true when started
   */
  private _start(): Promise<true> {
    if (!this.context) {
      throw new Error('AudioContext not initialized');
    }

    const streamNode = new AudioWorkletNode(this.context, 'stream_processor');
    streamNode.connect(this.context.destination);

    streamNode.port.onmessage = (e: MessageEvent<StreamProcessorMessage>) => {
      const { event } = e.data;
      if (event === 'stop') {
        streamNode.disconnect();
        this.stream = null;
      } else if (event === 'offset') {
        const { requestId, trackId, offset } = e.data;
        if (requestId && typeof offset === 'number') {
          const currentTime = offset / this.sampleRate;
          this.trackSampleOffsets[requestId] = { trackId: trackId || null, offset, currentTime };
        }
      }
    };

    if (this.analyser) {
      this.analyser.disconnect();
      streamNode.connect(this.analyser);
    }

    this.stream = streamNode;
    return Promise.resolve(true);
  }

  /**
   * Adds 16BitPCM data to the currently playing audio stream
   * You can add chunks beyond the current play point and they will be queued for play
   * @param arrayBuffer - Buffer containing PCM data
   * @param trackId - Identifier for the track
   * @returns Int16Array containing the PCM data
   */
  add16BitPCM(arrayBuffer: ArrayBuffer | Int16Array, trackId = 'default'): Int16Array | void {
    if (typeof trackId !== 'string') {
      throw new Error('trackId must be a string');
    } else if (this.interruptedTrackIds[trackId]) {
      return;
    }
    if (!this.stream) {
      this._start();
    }

    let buffer: Int16Array;
    if (arrayBuffer instanceof Int16Array) {
      buffer = arrayBuffer;
    } else if (arrayBuffer instanceof ArrayBuffer) {
      buffer = new Int16Array(arrayBuffer);
    } else {
      throw new Error('argument must be Int16Array or ArrayBuffer');
    }

    this.stream?.port.postMessage({ event: 'write', buffer, trackId });
    return buffer;
  }

  /**
   * Gets the offset (sample count) of the currently playing stream
   * @param interrupt - Whether to interrupt the current stream
   * @returns Track sample offset information
   */
  async getTrackSampleOffset(interrupt = false): Promise<TrackSampleOffset | null> {
    if (!this.stream) {
      return null;
    }

    const requestId = crypto.randomUUID();
    this.stream.port.postMessage({
      event: interrupt ? 'interrupt' : 'offset',
      requestId,
    });

    let trackSampleOffset: TrackSampleOffset | undefined;
    while (!trackSampleOffset) {
      trackSampleOffset = this.trackSampleOffsets[requestId];
      await new Promise((r) => setTimeout(r, 1));
    }

    const { trackId } = trackSampleOffset;
    if (interrupt && trackId) {
      this.interruptedTrackIds[trackId] = true;
    }

    return trackSampleOffset;
  }

  /**
   * Strips the current stream and returns the sample offset of the audio
   * @param interrupt - Whether to interrupt the current stream
   * @returns Track sample offset information
   */
  async interrupt(): Promise<TrackSampleOffset | null> {
    return this.getTrackSampleOffset(true);
  }
}

declare global {
  var WavStreamPlayer: WavStreamPlayer;
  interface Window {
    WavStreamPlayer: WavStreamPlayer;
  }
}

(globalThis as any).WavStreamPlayer = WavStreamPlayer;
