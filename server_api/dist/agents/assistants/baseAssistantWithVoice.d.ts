import { WebSocket } from "ws";
import { YpBaseAssistant } from "./baseAssistant.js";
import { YpBaseChatBotWithVoice } from "./voiceAssistant.js";
import ioredis from "ioredis";
export declare abstract class YpBaseAssistantWithVoice extends YpBaseAssistant {
    protected voiceBot: YpBaseChatBotWithVoice | undefined;
    private mainBotWsHandler?;
    private forwardEventHandler?;
    constructor(wsClientId: string, wsClients: Map<string, WebSocket>, redis: ioredis.Redis, voiceEnabled: boolean, redisKey: string, domainId: number);
    destroy(): void;
    initialize(): Promise<void>;
    createVoiceBot(): Promise<void>;
    destroyVoiceBot(): void;
    private setupVoiceEventForwarder;
    setVoiceMode(enabled: boolean): Promise<void>;
    handleModeSwitch(newMode: YpAssistantMode, reason: string, params: any): Promise<void>;
    conversation(chatLog: YpSimpleChatLog[]): Promise<void>;
}
