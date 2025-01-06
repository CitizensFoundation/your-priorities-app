# PsBaseWithRunningAgentObserver

A web component that observes changes to the current running agent and updates its state accordingly.

## Properties

| Name                   | Type    | Description                                      |
|------------------------|---------|--------------------------------------------------|
| currentRunningAgentId  | number \| undefined | The ID of the currently running agent. |

## Methods

| Name                  | Parameters                          | Return Type | Description                                                                 |
|-----------------------|-------------------------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback     | None                                | void        | Called when the element is added to the document's DOM. Initializes listeners. |
| disconnectedCallback  | None                                | void        | Called when the element is removed from the document's DOM. Cleans up listeners. |
| handleAgentChange     | currentRunningAgentId: number \| undefined | void        | Updates the `currentRunningAgentId` property when the agent changes.        |

## Examples

```typescript
// Example usage of the PsBaseWithRunningAgentObserver component
class MyComponent extends PsBaseWithRunningAgentObserver {
  constructor() {
    super();
    // Additional initialization if needed
  }
}

customElements.define('my-component', MyComponent);
```