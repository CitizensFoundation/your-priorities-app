# Service: BaseAssistantTools

The `BaseAssistantTools` class provides a set of utility methods for managing and updating the state and memory of a [YpAgentAssistant](../../agentAssistant.md) instance. These tools are designed to facilitate the manipulation of agent-related data, such as subscription plans, agent product runs, and UI widget states, while ensuring that memory updates and event emissions are handled consistently.

## Constructor

### `constructor(assistant: YpAgentAssistant)`
Initializes the `BaseAssistantTools` with a reference to a `YpAgentAssistant` instance.

| Name      | Type              | Description                                 |
|-----------|-------------------|---------------------------------------------|
| assistant | YpAgentAssistant  | The assistant instance to operate on.       |

---

## Methods

### `waitTick()`

Waits for a single event loop tick. This is used to ensure that tool execution completes before memory updates are processed.

#### Parameters

_None_

#### Returns

| Type    | Description                |
|---------|----------------------------|
| Promise<void> | Resolves after a short delay. |

---

### `updateCurrentAgentProductPlan(plan, subscription, options)`

Updates the current agent's product plan and optionally emits a memory update event.

#### Parameters

| Name         | Type                                         | Description                                                                                 |
|--------------|----------------------------------------------|---------------------------------------------------------------------------------------------|
| plan         | YpSubscriptionPlanAttributes                 | The new subscription plan attributes.                                                       |
| subscription | YpSubscriptionAttributes \| null             | The current subscription attributes, or null if not present.                                |
| options      | { sendEvent: boolean } (default: { sendEvent: true }) | Options for event emission.                                                                 |

#### Returns

| Type    | Description                |
|---------|----------------------------|
| Promise<void> | Resolves when the update is complete. |

---

### `updateAgentProductRun(agentRun, options)`

Updates the current agent's active product run, saves memory, and emits relevant events.

#### Parameters

| Name      | Type                                         | Description                                                                                 |
|-----------|----------------------------------------------|---------------------------------------------------------------------------------------------|
| agentRun  | YpAgentProductRunAttributes                  | The agent product run attributes to set as active.                                          |
| options   | { sendEvent: boolean } (default: { sendEvent: true }) | Options for event emission.                                                                 |

#### Returns

| Type    | Description                |
|---------|----------------------------|
| Promise<void> | Resolves when the update is complete. |

#### Throws

- `Error`: If `currentAgentStatus` is not found in memory.

---

### `updateShownConfigurationWidget(options)`

Marks that the configuration widget has been shown, saves memory, and emits relevant events.

#### Parameters

| Name    | Type                                         | Description                                                                                 |
|---------|----------------------------------------------|---------------------------------------------------------------------------------------------|
| options | { sendEvent: boolean } (default: { sendEvent: true }) | Options for event emission.                                                                 |

#### Returns

| Type    | Description                |
|---------|----------------------------|
| Promise<void> | Resolves when the update is complete. |

---

### `updateHaveShownLoginWidget(options)`

Marks that the login widget has been shown, saves memory, and emits relevant events.

#### Parameters

| Name    | Type                                         | Description                                                                                 |
|---------|----------------------------------------------|---------------------------------------------------------------------------------------------|
| options | { sendEvent: boolean } (default: { sendEvent: true }) | Options for event emission.                                                                 |

#### Returns

| Type    | Description                |
|---------|----------------------------|
| Promise<void> | Resolves when the update is complete. |

---

### `clearCurrentAgentProduct(options)`

Clears the current agent product status from memory, saves memory, and emits relevant events.

#### Parameters

| Name    | Type                                         | Description                                                                                 |
|---------|----------------------------------------------|---------------------------------------------------------------------------------------------|
| options | { sendEvent: boolean } (default: { sendEvent: true }) | Options for event emission.                                                                 |

#### Returns

| Type    | Description                |
|---------|----------------------------|
| Promise<void> | Resolves when the update is complete. |

---

## Dependencies

- [YpAgentAssistant](../../agentAssistant.md): The main assistant class whose memory and state are manipulated by these tools.
- `YpSubscriptionPlanAttributes`, `YpSubscriptionAttributes`, `YpAgentProductRunAttributes`: Data types representing agent plans, subscriptions, and product runs. (Definitions not included in this file.)

---

## Example Usage

```typescript
import { BaseAssistantTools } from './path/to/BaseAssistantTools';
import { YpAgentAssistant } from '../../agentAssistant';

const assistant = new YpAgentAssistant(/* ... */);
const tools = new BaseAssistantTools(assistant);

await tools.updateCurrentAgentProductPlan(plan, subscription);
await tools.updateAgentProductRun(agentRun);
await tools.updateShownConfigurationWidget();
await tools.updateHaveShownLoginWidget();
await tools.clearCurrentAgentProduct();
```

---

## See Also

- [YpAgentAssistant](../../agentAssistant.md)
- [YpSubscriptionPlanAttributes](#) (define or link to the type definition)
- [YpSubscriptionAttributes](#) (define or link to the type definition)
- [YpAgentProductRunAttributes](#) (define or link to the type definition)
