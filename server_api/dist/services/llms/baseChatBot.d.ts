import { OpenAI } from "openai";
import { Stream } from "openai/streaming.js";
import WebSocket from "ws";
import ioredis from "ioredis";
export declare class YpBaseChatBot {
    wsClientId: string;
    wsClientSocket: WebSocket;
    wsClients: Map<string, WebSocket>;
    openaiClient: OpenAI;
    memory: YpBaseChatBotMemoryData;
    static redisMemoryKeyPrefix: string;
    temperature: number;
    maxTokens: number;
    llmModel: string;
    persistMemory: boolean;
    redisKey: string;
    lastSentToUserAt?: Date;
    currentAssistantAvatarUrl?: string;
    destroy(): void;
    loadMemory(): Promise<PsAgentBaseMemoryData | undefined>;
    redis: ioredis.default;
    constructor(wsClientId: string, wsClients: Map<string, WebSocket>, redisConnection: ioredis.default, redisKey: string);
    saveMemory(): Promise<void>;
    renderSystemPrompt(): string;
    sendAgentStart(name: string, hasNoStreaming?: boolean): void;
    sendAgentCompleted(name: string, lastAgent?: boolean, error?: string | undefined): void;
    sendAgentUpdate(message: string): void;
    sendToClient(sender: YpSenderType, message: string, type?: YpAssistantMessageType, uniqueToken?: string | undefined, hiddenContextMessage?: boolean): void;
    streamWebSocketResponses(stream: Stream<OpenAI.Chat.Completions.ChatCompletionChunk>): Promise<void>;
    saveMemoryIfNeeded(): Promise<void>;
    setChatLog(chatLog: YpSimpleChatLog[]): Promise<void>;
    conversation(chatLog: YpSimpleChatLog[]): Promise<void>;
}
