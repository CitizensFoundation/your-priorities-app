# PsStreamingAIResponse

The `PsStreamingAIResponse` class is responsible for managing a WebSocket connection to a server, handling incoming messages, and updating a target container with streaming data. It extends the `YpCodeBase` class.

## Properties

| Name            | Type                                      | Description                                                                 |
|-----------------|-------------------------------------------|-----------------------------------------------------------------------------|
| wsClientId      | string                                    | The client ID received from the server upon WebSocket connection.           |
| targetContainer | HTMLElement \| HTMLInputElement \| undefined | The HTML element where streaming data will be displayed.                    |
| caller          | YpBaseElement                             | The calling element that will handle events emitted by this class.          |
| api             | PsServerApi                               | An instance of `PsServerApi` for server communication.                      |
| ws              | WebSocket                                 | The WebSocket instance used for server communication.                       |
| isActive        | boolean                                   | Indicates whether the WebSocket connection is active.                       |

## Methods

| Name       | Parameters                                                                 | Return Type | Description                                                                 |
|------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| constructor| caller: YpBaseElement, targetContainer?: HTMLElement \| HTMLInputElement   | void        | Initializes a new instance of the `PsStreamingAIResponse` class.            |
| close      | none                                                                       | void        | Closes the WebSocket connection and sets `isActive` to false.               |
| connect    | none                                                                       | Promise<string> | Establishes a WebSocket connection and returns a promise that resolves with the client ID. |
| onWsOpen   | event: Event, resolve: (wsClientId: string) => void                        | void        | Handles the WebSocket open event and resolves the promise with the client ID. |
| onMessage  | event: MessageEvent                                                        | void        | Handles incoming WebSocket messages and updates the target container.       |

## Examples

```typescript
// Example usage of the PsStreamingAIResponse class
const callerElement = new YpBaseElement();
const targetElement = document.getElementById('output');
const streamingResponse = new PsStreamingAIResponse(callerElement, targetElement);

streamingResponse.connect().then(clientId => {
  console.log('Connected with client ID:', clientId);
});

// To close the connection
streamingResponse.close();
```