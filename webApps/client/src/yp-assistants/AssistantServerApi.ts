import { StringUnitLength } from "luxon";
import { YpServerApi } from "../common/YpServerApi.js";

interface SavedChat {
  serverMemoryId: string;
  questionSnippet: string;
}

export class YpAssistantServerApi extends YpServerApi {
  private readonly localStorageChatsKey = "yp-assistant-chats-v1";
  clientMemoryUuid: string;
  constructor(clientMemoryUuid: string, urlPath: string = "/api/assistants") {
    super();
    this.baseUrlPath = urlPath;
    this.clientMemoryUuid = clientMemoryUuid;
  }

  public async sendChatMessage(
    domainId: number,
    wsClientId: string,
    chatLog: PsSimpleChatLog[],
    languageName: string,
    currentMode: string | undefined = undefined,
    serverMemoryId?: string
  ): Promise<{ serverMemoryId: string }> {
    const response = await this.fetchWrapper(
      this.baseUrlPath + `/${domainId}/chat`,
      {
        method: "PUT",
        body: JSON.stringify({
          wsClientId,
          chatLog,
          languageName,
          currentMode,
          serverMemoryId,
          clientMemoryUuid: this.clientMemoryUuid,
        }),
      },
      true
    );

    if (response.serverMemoryId) {
      this.saveChatToLocalStorage(response.serverMemoryId, chatLog);
    }

    return response;
  }

  public updateAssistantMemoryUserLoginStatus(domainId: number) {
    return this.fetchWrapper(
      this.baseUrlPath + `/${domainId}/updateAssistantMemoryLoginStatus`,
      {
        method: "PUT",
        body: JSON.stringify({
          domainId,
          clientMemoryUuid: this.clientMemoryUuid,
        }),
      }
    );
  }

  public async getMemoryFromServer(domainId: number): Promise<{
    chatLog: PsSimpleChatLog[];
  }> {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/${domainId}/memory?clientMemoryUuid=${this.clientMemoryUuid}`,
      {
        method: "GET",
      },
      true
    );
  }

  public clearChatLogFromServer(domainId: number): Promise<void> {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/${domainId}/chatlog?clientMemoryUuid=${this.clientMemoryUuid}`,
      {
        method: "DELETE",
      },
      false
    );
  }

  public startVoiceSession(
    domainId: number,
    wsClientId: string,
    currentMode: string,
    serverMemoryId?: string
  ): Promise<void> {
    return this.fetchWrapper(
      this.baseUrlPath + `/${domainId}/voice`,
      {
        method: "POST",
        body: JSON.stringify({
          wsClientId,
          currentMode,
          serverMemoryId,
          clientMemoryUuid: this.clientMemoryUuid,
        }),
      },
      false
    );
  }

  private saveChatToLocalStorage(
    serverMemoryId: string,
    chatLog: PsSimpleChatLog[]
  ): void {
    try {
      const savedChats = this.loadChatsFromLocalStorage();
      if (chatLog.length > 0) {
        const questionSnippet = chatLog[0].message.slice(0, 40);
        const newChat: SavedChat = {
          serverMemoryId,
          questionSnippet,
        };

        // Check if chat already exists
        const existingChatIndex = savedChats.findIndex(
          (chat) => chat.serverMemoryId === serverMemoryId
        );

        if (existingChatIndex >= 0) {
          savedChats[existingChatIndex] = newChat;
        } else {
          savedChats.push(newChat);
        }

        localStorage.setItem(
          this.localStorageChatsKey,
          JSON.stringify(savedChats)
        );
      }
    } catch (error) {
      console.error("Error saving chat to local storage:", error);
    }
  }

  public loadChatsFromLocalStorage(): SavedChat[] {
    try {
      const storedChats = localStorage.getItem(this.localStorageChatsKey);
      return storedChats ? JSON.parse(storedChats) : [];
    } catch (error) {
      console.error("Error loading chats from local storage:", error);
      return [];
    }
  }

  public clearServerMemory(serverMemoryId: string): Promise<void> {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/memory/${serverMemoryId}?clientMemoryUuid=${this.clientMemoryUuid}`,
      {
        method: "DELETE",
      },
      false
    );
  }

  public submitAgentConfiguration(
    domainId: number,
    agentProductId: string,
    subscriptionId: string,
    requiredQuestionsAnswers: YpStructuredAnswer[]
  ): Promise<void> {
    return this.fetchWrapper(
      this.baseUrlPath + `/${domainId}/submitAgentConfiguration`,
      {
        method: "PUT",
        body: JSON.stringify({
          agentProductId,
          subscriptionId,
          requiredQuestionsAnswers,
          clientMemoryUuid: this.clientMemoryUuid
        }),
      }
    );
  }
}
