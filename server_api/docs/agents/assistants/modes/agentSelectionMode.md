# Class: AgentSelectionMode

The `AgentSelectionMode` class extends [BaseAssistantMode](./baseAssistantMode.md) and represents a specific assistant mode for helping users select and connect to available AI agent workflows. It manages the system prompt and available tools based on the user's authentication state, and provides the configuration for the "agent selection" mode in the assistant.

## Extends

- [BaseAssistantMode](./baseAssistantMode.md)

## Constructor

### new AgentSelectionMode(assistant: YpAgentAssistant)

Creates a new instance of `AgentSelectionMode`.

| Name      | Type                | Description                                 |
|-----------|---------------------|---------------------------------------------|
| assistant | YpAgentAssistant    | The assistant instance this mode operates on.|

## Properties

| Name            | Type                        | Description                                                                 |
|-----------------|-----------------------------|-----------------------------------------------------------------------------|
| navigationTools | NavigationTools             | Instance of navigation tools for agent selection and connection.            |
| loginTools      | LoginAssistantTools         | Instance of login tools for authentication-related actions.                 |

## Methods

### protected async getCurrentModeSystemPrompt(): Promise<string>

Generates the system prompt for the current mode, including a description and any common prompt additions.

#### Returns

- `Promise<string>`: The system prompt string for the agent selection mode.

---

### protected async getCurrentModeTools(): Promise<AssistantChatbotTool[]>

Determines the set of tools available in the current mode, based on the user's authentication state.

#### Returns

- `Promise<AssistantChatbotTool[]>`: An array of tools available to the assistant in this mode.

#### Tool Selection Logic

- Always includes: `navigationTools.listAllAgentsAvailableForConnection`
- If the user is logged in:
  - Adds `navigationTools.connectDirectlyToAgent`
  - Adds `loginTools.logout`
- If the user is not logged in:
  - Adds `loginTools.showLogin` (with a custom message)
  - If the login widget has been shown:
    - Adds `loginTools.clickMainLoginButton`
    - Adds `loginTools.clickGoogleLoginButton`

---

### public async getMode(): Promise<AssistantChatbotMode>

Returns the configuration object for the "agent selection" mode, including its name, description, system prompt, available tools, and allowed transitions.

#### Returns

- `Promise<AssistantChatbotMode>`: The mode configuration object.

#### Example Return Value

```json
{
  "name": "agent_selection_mode",
  "description": "List available agents the user can connect to then connect the user to the agent selected by the user",
  "systemPrompt": "You are the main AI agent assistant. Help users select AI agent workflows to connect to. Use your tools when needed. ...",
  "tools": [/* array of AssistantChatbotTool */],
  "allowedTransitions": ["agent_direct_connection_mode"]
}
```

---

## Dependencies

- [BaseAssistantMode](./baseAssistantMode.md): The base class for assistant modes.
- [YpAgentAssistant](../agentAssistant.md): The main assistant class instance.
- [NavigationTools](./tools/navigationTools.md): Provides navigation-related tools for agent selection and connection.
- [LoginAssistantTools](./tools/loginTools.md): Provides login and authentication-related tools.
- [SubscriptionTools](./tools/subscriptionTools.md): Imported but not used in this file.

## Related Types

- `AssistantChatbotTool`: Represents a tool/action the assistant can use (imported from context).
- `AssistantChatbotMode`: The configuration object for an assistant mode (imported from context).

---

## See Also

- [BaseAssistantMode](./baseAssistantMode.md)
- [YpAgentAssistant](../agentAssistant.md)
- [NavigationTools](./tools/navigationTools.md)
- [LoginAssistantTools](./tools/loginTools.md)
- [AssistantChatbotMode](./types.md) (if defined elsewhere)
- [AssistantChatbotTool](./types.md) (if defined elsewhere)

---

## Example Usage

```typescript
import { AgentSelectionMode } from './agentSelectionMode.js';
import { YpAgentAssistant } from '../agentAssistant.js';

const assistant = new YpAgentAssistant(/* ... */);
const agentSelectionMode = new AgentSelectionMode(assistant);

const modeConfig = await agentSelectionMode.getMode();
// Use modeConfig to configure the assistant's behavior
```

---

## Notes

- This class is designed to be used as part of a larger assistant framework, where different modes control the assistant's behavior and available actions.
- The logic for tool selection is dynamic and depends on the user's authentication state and UI interactions (e.g., whether the login widget has been shown).
- The class relies on several external modules for its tools and base functionality.