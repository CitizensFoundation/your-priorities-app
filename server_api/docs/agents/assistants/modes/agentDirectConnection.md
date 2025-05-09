# Class: DirectConversationMode

Implements a conversational mode for direct interaction with an agent in the assistant system. This mode is used when a user is directly connected to an agent they are subscribed to or can purchase. It manages the available tools and system prompt based on the user's authentication, subscription, and agent configuration status.

**Extends:** [BaseAssistantMode](./baseAssistantMode.md)

## Constructor

```typescript
constructor(assistant: YpAgentAssistant)
```
Creates a new instance of `DirectConversationMode`.

### Parameters

| Name      | Type                | Description                                 |
|-----------|---------------------|---------------------------------------------|
| assistant | YpAgentAssistant    | The assistant instance for the current user.|

---

## Properties

| Name              | Type                        | Description                                               |
|-------------------|-----------------------------|-----------------------------------------------------------|
| subscriptionTools | SubscriptionTools           | Tools for managing agent product subscriptions.           |
| navigationTools   | NavigationTools             | Tools for navigation-related actions.                     |
| loginTools        | LoginAssistantTools         | Tools for login/logout and authentication actions.        |
| agentTools        | AgentTools                  | Tools for agent workflow and configuration management.    |

---

## Methods

### protected async getCurrentModeSystemPrompt()

Generates the system prompt for the current mode, including any common prompt content.

#### Returns

- `Promise<string>`: The system prompt string for the current mode.

---

### protected async getCurrentModeTools()

Determines and returns the set of tools available to the user in the current mode, based on their login, subscription, and agent configuration status.

#### Returns

- `Promise<AssistantChatbotTool[]>`: An array of tools available in the current mode.

#### Logic Overview

- If the user is logged in:
  - Adds logout and workflow overview tools.
  - If subscribed to the current agent product:
    - If the agent is configured:
      - If the agent is running: adds stop and deactivate tools.
      - If not running:
        - If not active: adds tool to create a new agent run.
        - If active: adds tool to start the next workflow step.
    - If not configured: adds configuration widget and, if shown, the submit configuration tool.
  - If not subscribed: logs an error (should not happen).
- Returns the determined tools or an empty array on error.

---

### public async getMode()

Returns the current assistant mode object, including its name, description, system prompt, available tools, and allowed transitions.

#### Returns

- `Promise<AssistantChatbotMode>`: The mode object for direct agent connection.

#### Example Return Value

```json
{
  "name": "agent_direct_connection_mode",
  "description": "Direct connection to an agent the user is subscribed to or available for purchase",
  "systemPrompt": "<dynamically generated prompt>",
  "tools": [/* array of AssistantChatbotTool */],
  "allowedTransitions": ["agent_direct_connection_mode"]
}
```

---

## Dependencies

- [BaseAssistantMode](./baseAssistantMode.md): Base class for assistant modes.
- [YpAgentAssistant](../agentAssistant.md): The main assistant class for agent interaction.
- [YpAgentProduct](../../models/agentProduct.md): Model representing an agent product.
- [SubscriptionTools](./tools/subscriptionTools.md): Tools for subscription management.
- [NavigationTools](./tools/navigationTools.md): Tools for navigation actions.
- [LoginAssistantTools](./tools/loginTools.md): Tools for login/logout actions.
- [AgentTools](./tools/agentTools.md): Tools for agent workflow and configuration.

---

## Related Types

- `AssistantChatbotTool`: Represents a tool/action available to the assistant (imported or globally defined).
- `AssistantChatbotMode`: Represents the structure of a mode object (imported or globally defined).

---

## Usage Example

```typescript
import { DirectConversationMode } from './DirectConversationMode';
import { YpAgentAssistant } from '../agentAssistant';

const assistant = new YpAgentAssistant(/* ...params */);
const mode = new DirectConversationMode(assistant);

const modeInfo = await mode.getMode();
console.log(modeInfo.name); // "agent_direct_connection_mode"
```

---

## See Also

- [BaseAssistantMode](./baseAssistantMode.md)
- [YpAgentAssistant](../agentAssistant.md)
- [SubscriptionTools](./tools/subscriptionTools.md)
- [NavigationTools](./tools/navigationTools.md)
- [LoginAssistantTools](./tools/loginTools.md)
- [AgentTools](./tools/agentTools.md)
- [YpAgentProduct](../../models/agentProduct.md)