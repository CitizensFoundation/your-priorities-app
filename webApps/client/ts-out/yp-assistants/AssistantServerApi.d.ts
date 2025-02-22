import { YpServerApi } from "../common/YpServerApi.js";
interface SavedChat {
    serverMemoryId: string;
    questionSnippet: string;
}
export declare class YpAssistantServerApi extends YpServerApi {
    private readonly localStorageChatsKey;
    clientMemoryUuid: string;
    constructor(clientMemoryUuid: string, urlPath?: string);
    startNextWorkflowStep(groupId: number, agentId: string): Promise<void>;
    sendEmailInvitesForAnons(groupId: number, agentId: string, agentRunId: number, emails: string): Promise<void>;
    stopCurrentWorkflowStep(groupId: number, agentId: string): Promise<void>;
    sendChatMessage(domainId: number, wsClientId: string, chatLog: PsSimpleChatLog[], languageName: string, currentMode?: string | undefined, serverMemoryId?: string): Promise<{
        serverMemoryId: string;
    }>;
    startVoiceSession(domainId: number, wsClientId: string, currentMode: string, serverMemoryId?: string): Promise<void>;
    updateAssistantMemoryUserLoginStatus(domainId: number): Promise<any>;
    getMemoryFromServer(domainId: number): Promise<{
        chatLog: PsSimpleChatLog[];
    }>;
    clearChatLogFromServer(domainId: number): Promise<void>;
    private saveChatToLocalStorage;
    loadChatsFromLocalStorage(): SavedChat[];
    clearServerMemory(serverMemoryId: string): Promise<void>;
    submitAgentConfiguration(domainId: number, subscriptionId: string, requiredQuestionsAnswers: YpStructuredAnswer[]): Promise<void>;
    getConfigurationAnswers(domainId: number, subscriptionId: string): Promise<{
        success: boolean;
        data: YpStructuredAnswer[];
    }>;
    private waitForWsReconnection;
    private waitForWsReconnectionWithRetry;
}
export {};
//# sourceMappingURL=AssistantServerApi.d.ts.map