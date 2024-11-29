import { YpServerApi } from "../common/YpServerApi.js";
export class YpAssistantServerApi extends YpServerApi {
    constructor(clientMemoryUuid, urlPath = "/api/assistants") {
        super();
        this.localStorageChatsKey = "yp-assistant-chats-v1";
        this.baseUrlPath = urlPath;
        this.clientMemoryUuid = clientMemoryUuid;
    }
    async startNextWorkflowStep(groupId, agentId) {
        return this.fetchWrapper(this.baseUrlPath + `/${groupId}/startNextWorkflowStep`, {
            method: "POST",
            body: JSON.stringify({
                agentId,
            }),
        });
    }
    sendEmailInvitesForAnons(groupId, agentId, emails) {
        return this.fetchWrapper(this.baseUrlPath + `/${groupId}/sendEmailInvitesForAnons`, {
            method: "POST",
            body: JSON.stringify({
                agentId,
                emails,
            }),
        });
    }
    async stopCurrentWorkflowStep(groupId, agentId) {
        return this.fetchWrapper(this.baseUrlPath + `/${groupId}/stopCurrentWorkflowStep`, {
            method: "POST",
            body: JSON.stringify({
                agentId,
            }),
        });
    }
    async sendChatMessage(domainId, wsClientId, chatLog, languageName, currentMode = undefined, serverMemoryId) {
        const response = await this.fetchWrapper(this.baseUrlPath + `/${domainId}/chat`, {
            method: "PUT",
            body: JSON.stringify({
                wsClientId,
                chatLog,
                languageName,
                currentMode,
                serverMemoryId,
                clientMemoryUuid: this.clientMemoryUuid,
            }),
        }, true);
        if (response.serverMemoryId) {
            this.saveChatToLocalStorage(response.serverMemoryId, chatLog);
        }
        return response;
    }
    updateAssistantMemoryUserLoginStatus(domainId) {
        return this.fetchWrapper(this.baseUrlPath + `/${domainId}/updateAssistantMemoryLoginStatus`, {
            method: "PUT",
            body: JSON.stringify({
                domainId,
                clientMemoryUuid: this.clientMemoryUuid,
            }),
        });
    }
    async getMemoryFromServer(domainId) {
        return this.fetchWrapper(this.baseUrlPath +
            `/${domainId}/memory?clientMemoryUuid=${this.clientMemoryUuid}`, {
            method: "GET",
        }, true);
    }
    clearChatLogFromServer(domainId) {
        return this.fetchWrapper(this.baseUrlPath +
            `/${domainId}/chatlog?clientMemoryUuid=${this.clientMemoryUuid}`, {
            method: "DELETE",
        }, false);
    }
    startVoiceSession(domainId, wsClientId, currentMode, serverMemoryId) {
        return this.fetchWrapper(this.baseUrlPath + `/${domainId}/voice`, {
            method: "POST",
            body: JSON.stringify({
                wsClientId,
                currentMode,
                serverMemoryId,
                clientMemoryUuid: this.clientMemoryUuid,
            }),
        }, false);
    }
    saveChatToLocalStorage(serverMemoryId, chatLog) {
        try {
            const savedChats = this.loadChatsFromLocalStorage();
            if (chatLog.length > 0) {
                const questionSnippet = chatLog[0].message.slice(0, 40);
                const newChat = {
                    serverMemoryId,
                    questionSnippet,
                };
                // Check if chat already exists
                const existingChatIndex = savedChats.findIndex((chat) => chat.serverMemoryId === serverMemoryId);
                if (existingChatIndex >= 0) {
                    savedChats[existingChatIndex] = newChat;
                }
                else {
                    savedChats.push(newChat);
                }
                localStorage.setItem(this.localStorageChatsKey, JSON.stringify(savedChats));
            }
        }
        catch (error) {
            console.error("Error saving chat to local storage:", error);
        }
    }
    loadChatsFromLocalStorage() {
        try {
            const storedChats = localStorage.getItem(this.localStorageChatsKey);
            return storedChats ? JSON.parse(storedChats) : [];
        }
        catch (error) {
            console.error("Error loading chats from local storage:", error);
            return [];
        }
    }
    clearServerMemory(serverMemoryId) {
        return this.fetchWrapper(this.baseUrlPath +
            `/memory/${serverMemoryId}?clientMemoryUuid=${this.clientMemoryUuid}`, {
            method: "DELETE",
        }, false);
    }
    submitAgentConfiguration(domainId, agentProductId, subscriptionId, requiredQuestionsAnswers) {
        return this.fetchWrapper(this.baseUrlPath + `/${domainId}/submitAgentConfiguration`, {
            method: "PUT",
            body: JSON.stringify({
                agentProductId,
                subscriptionId,
                requiredQuestionsAnswers,
                clientMemoryUuid: this.clientMemoryUuid,
            }),
        });
    }
}
//# sourceMappingURL=AssistantServerApi.js.map