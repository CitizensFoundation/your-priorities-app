# Service: WebSocketsManager

The `WebSocketsManager` class manages WebSocket connections in a distributed environment. It maintains a local map of client IDs to WebSocket connections and coordinates cross-server client ownership using Redis. It also implements a heartbeat mechanism to detect and clean up stale WebSocket connections.

## Constructor

```typescript
constructor(
  wsClients: Map<string, WebSocket>,
  redisClient: RedisClientType,
  server: Server
)
```

### Parameters

| Name         | Type                        | Description                                                                 |
|--------------|-----------------------------|-----------------------------------------------------------------------------|
| wsClients    | Map<string, WebSocket>      | A map of client IDs to their WebSocket connections (local ownership).       |
| redisClient  | RedisClientType             | Redis client instance for cross-server coordination.                        |
| server       | Server                      | HTTPS server instance to attach the WebSocket server to.                    |

---

## Properties

| Name         | Type                        | Description                                                                 |
|--------------|-----------------------------|-----------------------------------------------------------------------------|
| wsClients    | Map<string, WebSocket>      | Local map of client IDs to WebSocket connections.                           |
| ws           | WebSocketServer             | The WebSocket server instance.                                              |
| redisClient  | RedisClientType             | Redis client for distributed coordination.                                  |
| pingInterval | NodeJS.Timer \| null        | Timer for the heartbeat ping/pong mechanism.                                |

---

## Methods

### listen

```typescript
async listen(): Promise<void>
```

Main entry point to start listening for WebSocket connections, initialize Redis pub/sub, and start the heartbeat mechanism.

- Listens for new WebSocket connections.
- Extracts or generates a `clientId` for each connection.
- Sets up ping/pong heartbeat for each client.
- Handles connection close and error events.
- Sends the assigned `clientId` to the client upon connection.

#### WebSocket Connection Lifecycle

- **On connection:**  
  - Extracts `clientId` from the URL query string or generates a new UUID.
  - Adds the client to `wsClients`.
  - Sets up heartbeat (`isAlive` flag).
  - Sends the `clientId` to the client.
- **On close:**  
  - Removes the client from `wsClients`.
- **On error:**  
  - Removes the client from `wsClients` and logs the error.

---

### startPingCheck (private)

```typescript
private startPingCheck(): void
```

Starts a periodic ping to all connected WebSocket clients every 30 seconds. If a client does not respond with a `pong`, the connection is considered stale and is terminated.

- Iterates over all connected clients.
- If a client's `isAlive` flag is `false`, terminates the connection.
- Otherwise, sets `isAlive` to `false` and sends a ping.
- Listens for the WebSocket server's `close` event to clear the interval.

---

## Example Usage

```typescript
import { createServer } from "https";
import { createClient } from "@redis/client";
import { WebSocketsManager } from "./WebSocketsManager";
import { WebSocket } from "ws";

const server = createServer(/* ... */);
const redisClient = createClient();
const wsClients = new Map<string, WebSocket>();

const wsManager = new WebSocketsManager(wsClients, redisClient, server);
wsManager.listen();
```

---

## Events

- **connection**: Triggered when a new WebSocket client connects.
- **close**: Triggered when a WebSocket client disconnects or the server closes.
- **error**: Triggered on WebSocket errors.

---

## Heartbeat Mechanism

- Uses a 30-second interval to ping all clients.
- Clients must respond with a `pong` to remain connected.
- Unresponsive clients are terminated to prevent resource leaks.

---

## Redis Coordination

While this class is designed to coordinate client ownership across servers using Redis, the provided code does not yet implement the cross-server logic. The `redisClient` is reserved for future or external use to ensure only one server "owns" a given `clientId` at a time.

---

## See Also

- [ws WebSocketServer documentation](https://github.com/websockets/ws)
- [@redis/client documentation](https://github.com/redis/node-redis)
- [Node.js HTTPS Server](https://nodejs.org/api/https.html#class-httpsserver)
