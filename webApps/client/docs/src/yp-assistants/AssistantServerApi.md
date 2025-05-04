# YpAssistantServerApi

A server API class for managing assistant-related operations, including chat workflows, memory management, voice sessions, and configuration handling. Extends `YpServerApi` and provides methods for interacting with the assistant server, handling chat logs, and managing local storage for chat sessions.

## Properties

| Name                   | Type     | Description                                                                 |
|------------------------|----------|-----------------------------------------------------------------------------|
| localStorageChatsKey   | string   | Key used for storing chats in localStorage (private, constant).             |
| clientMemoryUuid       | string   | Unique identifier for the client's memory/session.                          |
| baseUrlPath            | string   | Base URL path for API requests (inherited from YpServerApi).                |

## Methods

| Name                                   | Parameters                                                                                                                                                                                                 | Return Type                                                      | Description                                                                                                   |
|---------------------------------------- |-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| constructor                            | clientMemoryUuid: string, urlPath?: string                                                                                                                          | YpAssistantServerApi                                             | Creates a new instance with the given client memory UUID and optional URL path.                               |
| startNextWorkflowStep                   | groupId: number, agentId: string                                                                                                                                    | Promise<void>                                                    | Starts the next workflow step for a group and agent.                                                          |
| sendEmailInvitesForAnons                | groupId: number, agentId: string, agentRunId: number, emails: string                                                                                                | Promise<void>                                                    | Sends email invites for anonymous users in a group.                                                           |
| stopCurrentWorkflowStep                  | groupId: number, agentId: string                                                                                                                                    | Promise<void>                                                    | Stops the current workflow step for a group and agent.                                                        |
| sendChatMessage                         | domainId: number, wsClientId: string, chatLog: YpSimpleChatLog[], languageName: string, currentMode?: string, serverMemoryId?: string                               | Promise<{ serverMemoryId: string }>                              | Sends a chat message, handles reconnection logic, and saves chat to local storage.                            |
| startVoiceSession                       | domainId: number, wsClientId: string, currentMode: string, serverMemoryId?: string                                                                                  | Promise<void>                                                    | Starts a voice session, with reconnection logic on failure.                                                   |
| updateAssistantMemoryUserLoginStatus     | domainId: number                                                                                                                                                    | Promise<any>                                                     | Updates the assistant memory user login status for a domain.                                                  |
| getMemoryFromServer                     | domainId: number                                                                                                                                                    | Promise<{ chatLog: YpSimpleChatLog[] }>                          | Retrieves the chat memory from the server for a domain.                                                       |
| clearChatLogFromServer                  | domainId: number                                                                                                                                                    | Promise<void>                                                    | Clears the chat log from the server for a domain.                                                             |
| loadChatsFromLocalStorage               | (none)                                                                                                                                                              | SavedChat[]                                                      | Loads saved chats from local storage.                                                                         |
| clearServerMemory                       | serverMemoryId: string                                                                                                                                              | Promise<void>                                                    | Clears the server memory for a given server memory ID.                                                        |
| submitAgentConfiguration                | domainId: number, subscriptionId: string, requiredQuestionsAnswers: YpStructuredAnswer[]                                                                            | Promise<void>                                                    | Submits agent configuration answers for a domain and subscription.                                            |
| getConfigurationAnswers                 | domainId: number, subscriptionId: string                                                                                                                            | Promise<{ success: boolean; data: YpStructuredAnswer[] }>        | Retrieves configuration answers for a domain and subscription.                                                |
| saveChatToLocalStorage                  | serverMemoryId: string, chatLog: YpSimpleChatLog[]                                                                                                                  | void                                                             | Saves a chat log to local storage (private).                                                                  |
| waitForWsReconnection                   | timeout: number                                                                                                                                                     | Promise<boolean>                                                 | Waits for a WebSocket reconnection event within a given timeout (private).                                    |
| waitForWsReconnectionWithRetry          | (none)                                                                                                                                                              | Promise<void>                                                    | Retries WebSocket reconnection with increasing delays (private).                                              |

## Examples

```typescript
import { YpAssistantServerApi } from './YpAssistantServerApi.js';

const clientMemoryUuid = 'unique-client-uuid';
const api = new YpAssistantServerApi(clientMemoryUuid);

// Start next workflow step
await api.startNextWorkflowStep(123, 'agent-abc');

// Send a chat message
const chatLog = [{ message: "Hello!", sender: "user" }];
const response = await api.sendChatMessage(1, 'ws-client-1', chatLog, 'en');

// Load chats from local storage
const savedChats = api.loadChatsFromLocalStorage();

// Start a voice session
await api.startVoiceSession(1, 'ws-client-1', 'default');

// Clear server memory
await api.clearServerMemory('server-memory-id');
```
