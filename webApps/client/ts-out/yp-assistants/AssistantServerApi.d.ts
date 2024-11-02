import { YpServerApi } from "../common/YpServerApi.js";
interface SavedChat {
    serverMemoryId: string;
    questionSnippet: string;
}
export declare class YpAssistantServerApi extends YpServerApi {
    private readonly localStorageChatsKey;
    constructor(urlPath?: string);
    sendChatMessage(domainId: number, wsClientId: string, chatLog: PsSimpleChatLog[], languageName: string, currentMode?: string | undefined, serverMemoryId?: string): Promise<{
        serverMemoryId: string;
    }>;
    getChatLogFromServer(domainId: number, serverMemoryId?: string): Promise<{
        chatLog: PsSimpleChatLog[];
    }>;
    startVoiceSession(domainId: number, wsClientId: string, currentMode: string, serverMemoryId?: string): Promise<void>;
    private saveChatToLocalStorage;
    loadChatsFromLocalStorage(): SavedChat[];
    clearServerMemory(serverMemoryId: string): Promise<void>;
}
export {};
//# sourceMappingURL=AssistantServerApi.d.ts.map