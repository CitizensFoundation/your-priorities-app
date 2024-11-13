import { YpServerApi } from "../common/YpServerApi.js";
interface SavedChat {
    serverMemoryId: string;
    questionSnippet: string;
}
export declare class YpAssistantServerApi extends YpServerApi {
    private readonly localStorageChatsKey;
    clientMemoryUuid: string;
    constructor(clientMemoryUuid: string, urlPath?: string);
    sendChatMessage(domainId: number, wsClientId: string, chatLog: PsSimpleChatLog[], languageName: string, currentMode?: string | undefined, serverMemoryId?: string): Promise<{
        serverMemoryId: string;
    }>;
    updateAssistantMemoryUserLoginStatus(domainId: number): Promise<any>;
    getMemoryFromServer(domainId: number): Promise<{
        chatLog: PsSimpleChatLog[];
    }>;
    clearChatLogFromServer(domainId: number): Promise<void>;
    startVoiceSession(domainId: number, wsClientId: string, currentMode: string, serverMemoryId?: string): Promise<void>;
    private saveChatToLocalStorage;
    loadChatsFromLocalStorage(): SavedChat[];
    clearServerMemory(serverMemoryId: string): Promise<void>;
    submitAgentConfiguration(domainId: number, agentProductId: string, subscriptionId: string, requiredQuestionsAnswers: YpStructuredAnswer[]): Promise<void>;
}
export {};
//# sourceMappingURL=AssistantServerApi.d.ts.map