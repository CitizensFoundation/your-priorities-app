import { YpBaseElement } from "../common/yp-base-element.js";
export declare abstract class YpStreamingLlmBase extends YpBaseElement {
    chatLog: YpAssistantMessage[];
    wsClientId: string;
    webSocketsErrorCount: number;
    wsEndpoint: string;
    currentFollowUpQuestions: string;
    programmaticScroll: boolean;
    disableAutoScroll: boolean;
    scrollStart: number;
    serverMemoryId: string | undefined;
    defaultDevWsPort: number;
    disableWebsockets: boolean;
    private static ws;
    private static subscribers;
    private static reconnectDelay;
    private static reconnectionAttempts;
    private static reconnectTimer;
    private static wsManuallyClosed;
    protected get ws(): WebSocket | null;
    protected set ws(value: WebSocket | null);
    constructor();
    connectedCallback(): void;
    /**
     * Initializes the shared WebSocket connection.
     * Uses the defaultDevWsPort from the provided instance (or first subscriber) for the URL.
     */
    private static initWebSocketsStatic;
    static scheduleReconnect(doItNow?: boolean): void;
    sendClientMessage(payload: string): void;
    sendMessage(action: string, payload: any): void;
    disconnectedCallback(): void;
    onMessage(event: MessageEvent): Promise<void>;
    abstract scrollDown(): void;
    addUserChatBotMessage(userMessage: string): void;
    addThinkingChatBotMessage(): void;
    abstract addChatBotElement(wsMessage: YpAssistantMessage): Promise<void>;
    addChatUserElement(data: YpAssistantMessage): void;
    get simplifiedChatLog(): YpSimpleChatLog[];
    reset(): void;
}
//# sourceMappingURL=yp-streaming-llm-base.d.ts.map