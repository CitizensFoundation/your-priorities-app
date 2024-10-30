export interface AudioBackupConfig {
    sessionId: string;
    sendInterval: number;
    backupEndpoint: string;
    headers?: Record<string, string>;
}
export declare class AudioBackupManager {
    private config;
    private audioBuffer;
    private mediaRecorder;
    private audioContext;
    private sourceNode;
    private processorNode;
    private sendIntervalId;
    private isRecording;
    constructor(config: AudioBackupConfig);
    attachToStream(stream: MediaStream): void;
    stop(): void;
    private sendAudioChunks;
}
//# sourceMappingURL=AudioBackup.d.ts.map