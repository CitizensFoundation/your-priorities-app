export interface ConversationBackupConfig {
    backupEndpoint: string;
    batchInterval?: number;
    headers?: Record<string, string>;
    sessionId: string;
}
export interface ConversationMessage {
    type: 'avatar' | 'user';
    message: string;
    timestamp: number;
    taskId?: string;
}
export declare class ConversationBackupManager {
    private config;
    private messageBuffer;
    private sendIntervalId;
    private isActive;
    constructor(config: ConversationBackupConfig);
    addMessage(message: ConversationMessage): void;
    stop(): void;
    private sendMessages;
}
//# sourceMappingURL=ConverationBackup.d.ts.map