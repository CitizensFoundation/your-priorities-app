import { YpServerApi } from "../common/YpServerApi.js";
export class YpAssistantServerApi extends YpServerApi {
    constructor(urlPath = "/api/assistants") {
        super();
        this.localStorageChatsKey = "yp-assistant-chats-v1";
        this.baseUrlPath = urlPath;
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
            }),
        }, true);
        if (response.serverMemoryId) {
            this.saveChatToLocalStorage(response.serverMemoryId, chatLog);
        }
        return response;
    }
    async getChatLogFromServer(domainId, serverMemoryId = "123") {
        return this.fetchWrapper(this.baseUrlPath + `/${domainId}/chatlog`, {
            method: "GET",
        }, true);
    }
    startVoiceSession(domainId, wsClientId, currentMode, serverMemoryId) {
        return this.fetchWrapper(this.baseUrlPath + `/${domainId}/voice`, {
            method: "POST",
            body: JSON.stringify({
                wsClientId,
                currentMode,
                serverMemoryId
            })
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
                const existingChatIndex = savedChats.findIndex(chat => chat.serverMemoryId === serverMemoryId);
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
            console.error('Error saving chat to local storage:', error);
        }
    }
    loadChatsFromLocalStorage() {
        try {
            const storedChats = localStorage.getItem(this.localStorageChatsKey);
            return storedChats ? JSON.parse(storedChats) : [];
        }
        catch (error) {
            console.error('Error loading chats from local storage:', error);
            return [];
        }
    }
    clearServerMemory(serverMemoryId) {
        return this.fetchWrapper(this.baseUrlPath + `/memory/${serverMemoryId}`, {
            method: "DELETE",
        }, false);
    }
}
//# sourceMappingURL=AssistantServerApi.js.map