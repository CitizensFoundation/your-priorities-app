import { OpenAI } from "openai";
import WebSocket from "ws";
import ioredis from "ioredis";
import { type ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { YpBaseChatBot } from "../../services/llms/baseChatBot.js";
import { YpAgentProduct } from "../models/agentProduct.js";
/**
 * Common modes that implementations might use
 */
export declare enum CommonModes {
    ErrorRecovery = "error_recovery"
}
export declare abstract class YpBaseAssistant extends YpBaseChatBot {
    protected voiceEnabled: boolean;
    openaiClient: OpenAI;
    memory: YpBaseAssistantMemoryData;
    private eventEmitter;
    persistMemory: boolean;
    domainId: number;
    DEBUG: boolean;
    protected modes: Map<YpAssistantMode, AssistantChatbotMode>;
    protected availableTools: Map<string, AssistantChatbotTool>;
    protected toolCallTimeout: number;
    protected maxModeTransitions: number;
    private clientSystemMessageListener;
    redis: ioredis.Redis;
    modelName: string;
    constructor(wsClientId: string, wsClients: Map<string, WebSocket>, redis: ioredis.Redis, redisKey: string, domainId: number);
    destroy(): void;
    removeClientSystemMessageListener(): void;
    handleClientSystemMessage(data: Buffer): void;
    setupClientSystemMessageListener(): void;
    getCurrentAgentProduct(): Promise<YpAgentProductAttributes | undefined>;
    getCurrentSubscriptionPlan(): Promise<YpSubscriptionPlanAttributes | undefined>;
    getCurrentSubscription(): Promise<YpSubscriptionAttributes | undefined>;
    getCurrentAgentRun(): Promise<YpAgentProductRunAttributes | undefined>;
    updateAiModelSession(message: string): Promise<void>;
    maybeSendTextResponse(message: string): Promise<void>;
    processClientSystemMessage(clientEvent: YpAssistantClientSystemMessage): Promise<void>;
    emit(event: string, ...args: any[]): boolean;
    on(event: string, listener: (...args: any[]) => void): void;
    updateCurrentAgentProductPlan(subscriptionPlanId: number, subscriptionId: number | null): Promise<void>;
    /**
     * Convert tool result to message format
     */
    protected convertToolResultToMessage(toolCall: ToolCall, result: ToolExecutionResult): ToolResponseMessage;
    /**
     * Handle executing tool calls with results
     */
    handleToolCalls(toolCalls: Map<string, ToolCall>): Promise<void>;
    /**
     * Handle tool responses by creating a new completion
     */
    handleToolResponses(toolResponses: ToolResponseMessage[]): Promise<void>;
    /**
     * Abstract method that subclasses must implement to define their modes
     */
    abstract defineAvailableModes(): Promise<AssistantChatbotMode[]>;
    setupMemoryAsync(): Promise<void>;
    loadMemoryAsync(): Promise<void>;
    getCleanedParams<T extends object>(params: string | T): T;
    setCurrentMode(mode: YpAssistantMode): Promise<void>;
    /**
     * Initialize modes from subclass definitions
     */
    initializeModes(): Promise<void>;
    /**
     * Get current mode's functions
     */
    getCurrentModeFunctions(): AssistantChatbotTool[];
    get isLoggedIn(): boolean;
    renderLoginStatus(): string;
    defaultSystemPrompt: string;
    /**
     * Get current mode's system prompt
     */
    getCurrentSystemPrompt(): string;
    sendAvatarUrlChange(url: string | null, avatarName: string | null): void;
    /**
     * Validate mode transition
     */
    protected validateModeTransition(fromMode: YpAssistantMode, toMode: YpAssistantMode): boolean;
    /**
     * Clean up mode-specific resources
     */
    protected cleanupMode(mode: YpAssistantMode): Promise<void>;
    /**
     * Set mode data with type safety
     */
    setModeData<T>(type: string, data: T): Promise<void>;
    /**
     * Get mode data with type safety
     */
    protected getModeData<T>(): T | undefined;
    /**
     * Main conversation handler with updated function handling
     */
    conversation(chatLog: YpSimpleChatLog[]): Promise<void>;
    getAgentProduct(agentProductId: number): Promise<YpAgentProduct | null>;
    /**
     * Convert chat log to OpenAI message format
     */
    protected convertToOpenAIMessages(chatLog: YpSimpleChatLog[]): ChatCompletionMessageParam[];
    /**
     * Handle mode switching
     */
    handleModeSwitch(newMode: YpAssistantMode, reason: string, params: any): Promise<void>;
    addUserMessage(message: string): Promise<void>;
    addAssistantMessage(message: string): Promise<void>;
    addAssistantHtmlMessage(html: string, uniqueToken?: string): Promise<void>;
    /**
     * Handle streaming responses and function calls with comprehensive debugging
     */
    streamWebSocketResponses(stream: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>): Promise<void>;
}
