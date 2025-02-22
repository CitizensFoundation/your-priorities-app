import { YpServerApi } from "../common/YpServerApi.js";
import { YpStreamingLlmBase } from "../yp-chatbots/yp-streaming-llm-base.js";

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

  public async startNextWorkflowStep(
    groupId: number,
    agentId: string
  ): Promise<void> {
    return this.fetchWrapper(
      this.baseUrlPath + `/${groupId}/startNextWorkflowStep`,
      {
        method: "POST",
        body: JSON.stringify({
          agentId,
        }),
      }
    );
  }

  public sendEmailInvitesForAnons(
    groupId: number,
    agentId: string,
    agentRunId: number,
    emails: string
  ): Promise<void> {
    return this.fetchWrapper(
      `/api/groups/${groupId}/sendEmailInvitesForAnons`,
      {
        method: "POST",
        body: JSON.stringify({
          agentId,
          agentRunId,
          emails,
        }),
      }
    );
  }

  public async stopCurrentWorkflowStep(
    groupId: number,
    agentId: string
  ): Promise<void> {
    return this.fetchWrapper(
      this.baseUrlPath + `/${groupId}/stopCurrentWorkflowStep`,
      {
        method: "POST",
        body: JSON.stringify({
          agentId,
        }),
      }
    );
  }

  public async sendChatMessage(
    domainId: number,
    wsClientId: string,
    chatLog: PsSimpleChatLog[],
    languageName: string,
    currentMode: string | undefined = undefined,
    serverMemoryId?: string
  ): Promise<{ serverMemoryId: string }> {
    try {
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
        false,
        undefined,
        true
      );

      if (response.status && response.status === 500) {
        throw new Error("Internal Server Error");
      }

      if (response.serverMemoryId) {
        this.saveChatToLocalStorage(response.serverMemoryId, chatLog);
      }
      return response;
    } catch (err) {
      console.warn("Error detected on sendChatMessage, triggering reconnection...");
      YpStreamingLlmBase.scheduleReconnect();

      try {
        // Wait for the reconnection with retry delays.
        await this.waitForWsReconnectionWithRetry();
        // Once reconnected, try sending the message again.
        return await this.sendChatMessage(
          domainId,
          wsClientId,
          chatLog,
          languageName,
          currentMode,
          serverMemoryId
        );
      } catch (reconnectErr) {
        // If reconnection still fails after retries, throw error to user.
        throw new Error("Reconnection failed, please try again later.");
      }
    }
  }

  public async startVoiceSession(
    domainId: number,
    wsClientId: string,
    currentMode: string,
    serverMemoryId?: string
  ): Promise<void> {

    try {
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
      false,
      undefined,
      true
    );
    } catch (err) {
      console.warn("Error detected on startVoiceSession, triggering reconnection...");
      YpStreamingLlmBase.scheduleReconnect();

      try {
        // Wait for the reconnection with retry delays.
        await this.waitForWsReconnectionWithRetry();
        // Once reconnected, try sending the message again.
        return await this.startVoiceSession(
          domainId,
          wsClientId,
          currentMode,
          serverMemoryId
        );
      } catch (reconnectErr) {
        // If reconnection still fails after retries, throw error to user.
        throw new Error("Reconnection failed, please try again later.");
      }
    }
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
    subscriptionId: string,
    requiredQuestionsAnswers: YpStructuredAnswer[]
  ): Promise<void> {
    return this.fetchWrapper(
      this.baseUrlPath + `/${domainId}/${subscriptionId}/submitAgentConfiguration`,
      {
        method: "PUT",
        body: JSON.stringify({
          requiredQuestionsAnswers,
          clientMemoryUuid: this.clientMemoryUuid,
        }),
      }
    );
  }

  public getConfigurationAnswers(
    domainId: number,
    subscriptionId: string
  ): Promise<{ success: boolean; data: YpStructuredAnswer[] }> {
    return this.fetchWrapper(
      this.baseUrlPath + `/${domainId}/${subscriptionId}/getConfigurationAnswers`
    );
  }

  // Helper function that waits for a reconnection event with a given timeout.
private waitForWsReconnection(timeout: number): Promise<boolean> {
  return new Promise((resolve) => {
    let resolved = false;

    // Handler for the WS reconnection event.
    const onWsConnected = () => {
      resolved = true;
      window.removeEventListener("wsConnected", onWsConnected);
      resolve(true);
    };

    // Listen for the global reconnection event.
    window.addEventListener("wsConnected", onWsConnected, { once: true });

    // Set a timeout after which we resolve false if not reconnected.
    setTimeout(() => {
      if (!resolved) {
        window.removeEventListener("wsConnected", onWsConnected);
        resolve(false);
      }
    }, timeout);
  });
}

// Retry function that attempts reconnection with delays: 1 sec, 3 sec, 5 sec.
private async waitForWsReconnectionWithRetry(): Promise<void> {
  const retryDelays = [1000, 3000, 5000, 10000, 20000, 30000];
  for (const delay of retryDelays) {
    console.log(`Waiting ${delay}ms for WebSocket reconnection...`);
    const reconnected = await this.waitForWsReconnection(delay);
    if (reconnected) {
      console.log("WebSocket reconnected successfully.");
      return; // Exit once reconnected.
    }
  }
  // If all retries fail, throw an error.
  throw new Error("WebSocket reconnection failed after 3 attempts.");
}

}
