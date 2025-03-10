# YpAssistantServerApi

The `YpAssistantServerApi` class extends the `YpServerApi` and provides methods to interact with the YP Assistant server, including managing workflows, sending chat messages, and handling local storage of chat data.

## Properties

| Name                   | Type   | Description                                      |
|------------------------|--------|--------------------------------------------------|
| localStorageChatsKey   | string | Key used for storing chats in local storage.     |
| clientMemoryUuid       | string | UUID for client memory, used in server requests. |

## Methods

| Name                                 | Parameters                                                                                                                                  | Return Type                                           | Description                                                                                     |
|--------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| constructor                          | clientMemoryUuid: string, urlPath: string = "/api/assistants"                                                                              |                                                       | Initializes a new instance of the `YpAssistantServerApi` class.                                 |
| startNextWorkflowStep                | groupId: number, agentId: string                                                                                                            | Promise<void>                                         | Initiates the next step in a workflow for a given group and agent.                              |
| sendEmailInvitesForAnons             | groupId: number, agentId: string, agentRunId: number, emails: string                                                                        | Promise<void>                                         | Sends email invites to anonymous users for a specific group and agent run.                      |
| stopCurrentWorkflowStep              | groupId: number, agentId: string                                                                                                            | Promise<void>                                         | Stops the current workflow step for a given group and agent.                                    |
| sendChatMessage                      | domainId: number, wsClientId: string, chatLog: YpSimpleChatLog[], languageName: string, currentMode: string \| undefined = undefined, serverMemoryId?: string | Promise<{ serverMemoryId: string }>                   | Sends a chat message to the server and optionally saves the chat to local storage.              |
| updateAssistantMemoryUserLoginStatus | domainId: number                                                                                                                            | Promise<void>                                         | Updates the login status of the assistant memory for a given domain.                            |
| getMemoryFromServer                  | domainId: number                                                                                                                            | Promise<{ chatLog: YpSimpleChatLog[] }>               | Retrieves the chat log memory from the server for a given domain.                               |
| clearChatLogFromServer               | domainId: number                                                                                                                            | Promise<void>                                         | Clears the chat log from the server for a given domain.                                         |
| startVoiceSession                    | domainId: number, wsClientId: string, currentMode: string, serverMemoryId?: string                                                          | Promise<void>                                         | Starts a voice session for a given domain and client.                                           |
| saveChatToLocalStorage               | serverMemoryId: string, chatLog: YpSimpleChatLog[]                                                                                          | void                                                  | Saves a chat to local storage, updating existing entries if necessary.                          |
| loadChatsFromLocalStorage            |                                                                                                                                             | SavedChat[]                                           | Loads chats from local storage.                                                                 |
| clearServerMemory                    | serverMemoryId: string                                                                                                                      | Promise<void>                                         | Clears the server memory for a given server memory ID.                                          |
| submitAgentConfiguration             | domainId: number, subscriptionId: string, requiredQuestionsAnswers: YpStructuredAnswer[]                                                    | Promise<void>                                         | Submits the agent configuration with required questions and answers for a given domain.         |
| getConfigurationAnswers              | domainId: number, subscriptionId: string                                                                                                    | Promise<{ success: boolean; data: YpStructuredAnswer[] }> | Retrieves the configuration answers for a given domain and subscription.                        |

## Examples

```typescript
// Example usage of the YpAssistantServerApi class
const api = new YpAssistantServerApi('client-uuid-1234');
api.startNextWorkflowStep(1, 'agent-123').then(() => {
  console.log('Next workflow step started.');
});
```