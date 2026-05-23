import { YpBaseChatBot } from "../../services/llms/baseChatBot.js";
import { YpBaseAssistant } from "./baseAssistant.js";
import WebSocket from "ws";
import ioredis from "ioredis";
interface VoiceMessage {
    delta: any;
    type: string;
    content?: string;
    audio?: string;
    metadata?: any;
}
interface VoiceState {
    speaking: boolean;
    listening: boolean;
    processingAudio: boolean;
    lastAudioTimestamp?: number;
}
interface VoiceConnectionConfig {
    model: string;
    voice: string;
    instructions?: string;
    tools?: AssistantChatbotTool[];
    modalities: ("text" | "audio")[];
}
interface RealtimeVoiceConnection {
    ws: WebSocket;
    connected: boolean;
    model: string;
    voice: string;
}
export declare class YpBaseChatBotWithVoice extends YpBaseChatBot {
    protected voiceEnabled: boolean;
    assistantVoiceConnection?: RealtimeVoiceConnection;
    directAgentVoiceConnection?: RealtimeVoiceConnection;
    private voiceMainMessageHandler?;
    private voiceDirectMessageHandler?;
    protected voiceConfig: VoiceConnectionConfig;
    protected voiceState: VoiceState;
    protected readonly VAD_TIMEOUT = 1000;
    protected vadTimeout?: NodeJS.Timeout;
    protected parentAssistant: YpBaseAssistant;
    sendTranscriptsToClient: boolean;
    isWaitingOnCancelResponseCompleted: boolean;
    lastNumberOfChatHistoryForInstructions: number;
    exitMessageFromDirectAgentConversation: string | undefined;
    DEBUG: boolean;
    constructor(wsClientId: string, wsClients: Map<string, WebSocket>, redisKey: string, redisConnection: ioredis.Redis, voiceEnabled: boolean | undefined, parentAssistant: YpBaseAssistant);
    updateAiModelSession(message: string): Promise<void>;
    initializeMainAssistantVoiceConnection(): Promise<void>;
    initializeDirectAgentVoiceConnection(): Promise<void>;
    destroyDirectAgentVoiceConnection(): Promise<void>;
    destroyAssistantVoiceConnection(): void;
    protected setupVoiceMessageHandlers(ws: WebSocket, disableWhenAgentIsSpeaking: boolean): void;
    destroy(): void;
    handleResponseDone(event: any): Promise<void>;
    handleAudioTranscriptDone(event: any): Promise<void>;
    callFunctionHandler(event: any): Promise<void>;
    getRandomStringAscii(length?: number): string;
    proxyToClient(event: any): Promise<void>;
    handleIncomingAudio(audioData: Uint8Array): Promise<void>;
    private handleVADSilence;
    private handleSpeechStarted;
    private handleSpeechStopped;
    handleAudioDelta(event: VoiceMessage): Promise<void>;
    private handleTextOutput;
    sendToVoiceConnection(message: any): void;
    private handleAudioBufferCommitted;
    waitForCancelResponseCompleted(): Promise<void>;
    sendCancelResponse(): Promise<void>;
    initializeVoiceSession(customResponseMessage?: string): Promise<void>;
    triggerResponse(message: string, cancelResponse?: boolean): Promise<void>;
    protected handleVoiceSessionCreated(event: any): Promise<void>;
    protected handleVoiceSessionError(event: any): Promise<void>;
    protected handleVoiceResponseStatus(event: any): Promise<void>;
    streamWebSocketResponses(stream: any): Promise<void>;
    updateVoiceConfig(config: Partial<VoiceConnectionConfig>): Promise<void>;
}
export {};
