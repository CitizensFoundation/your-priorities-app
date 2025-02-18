import { YpBaseElement } from "../common/yp-base-element.js";
export declare abstract class YpStreamingLlmBase extends YpBaseElement {
    chatLog: YpAssistantMessage[];
    wsClientId: string;
    webSocketsErrorCount: number;
    wsEndpoint: string;
    scrollElementSelector: string;
    useMainWindowScroll: boolean;
    userScrolled: boolean;
    currentFollowUpQuestions: string;
    programmaticScroll: boolean;
    disableAutoScroll: boolean;
    scrollStart: number;
    serverMemoryId: string | undefined;
    defaultDevWsPort: number;
    ws: WebSocket;
    disableWebsockets: boolean;
    wsManuallyClosed: boolean;
    reconnectDelay: number;
    reconnectionAttempts: number;
    reconnectTimer: number | undefined;
    constructor();
    connectedCallback(): void;
    private initWebSockets;
    private scheduleReconnect;
    sendMessage(action: string, payload: any): void;
    disconnectedCallback(): void;
    onMessage(event: MessageEvent): Promise<void>;
    scrollDown(): void;
    handleScroll(): void;
    addUserChatBotMessage(userMessage: string): void;
    addThinkingChatBotMessage(): void;
    abstract addChatBotElement(wsMessage: YpAssistantMessage): Promise<void>;
    addChatUserElement(data: YpAssistantMessage): void;
    get simplifiedChatLog(): PsSimpleChatLog[];
    reset(): void;
}
//# sourceMappingURL=yp-streaming-llm-base.d.ts.map