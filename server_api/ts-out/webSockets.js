import { WebSocketServer, WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";
/**
 * WebSocketsManager:
 *  - Maintains a Map of clientId -> WebSocket for local ownership
 *  - Coordinates cross-server ownership (clientId -> serverId) via Redis,
 *    so that only one server "owns" a given clientId at a time.
 */
export class WebSocketsManager {
    constructor(wsClients, redisClient, server) {
        // Ping/pong heartbeat interval
        this.pingInterval = null;
        // Configuration for Redis reconnection attempts
        this.maxRedisReconnectAttempts = 5;
        this.redisReconnectDelay = 2000; // milliseconds
        this.wsClients = wsClients;
        this.redisClient = redisClient;
        this.ws = new WebSocketServer({ server });
        // You could also read this from environment or a hostname if preferred
        this.serverId =
            process.env.NODE_ENV === "development"
                ? "dev-server"
                : `server-${Math.random()}`;
        console.log("WebSockets: Starting WebSocketsManager on serverId:", this.serverId);
    }
    /**
     * Main entry point to start listening for connections
     * and initialize Redis pub/sub, heartbeat, etc.
     */
    async listen() {
        // Setup Redis pub/sub with reconnection logic
        await this.setupPubSub();
        // Start periodic ping/pong for WS clients
        this.startPingCheck();
        // Convert to async so we can 'await' inside
        this.ws.on("connection", async (ws, req) => {
            // 1) Extract ?clientId= from the URL or generate a new one
            const url = new URL(req.url ?? "", "http://dummy");
            let clientId = url.searchParams.get("clientId") || "";
            if (!clientId) {
                clientId = uuidv4();
            }
            // 2) Attempt to claim ownership of this clientId in Redis
            const claimed = await this.tryClaimClientId(clientId);
            if (!claimed) {
                // Another server owns it—ask that server to release
                await this.requestReleaseClientId(clientId);
                // Optionally, you might wait or forcibly overwrite after some delay
                console.log(`WebSockets: Server ${this.serverId} could not claim clientId ${clientId} immediately.`);
            }
            else {
                console.log(`WebSockets: Server ${this.serverId} claimed clientId ${clientId}.`);
            }
            // 3) Locally, if there's already a socket for that ID on *this* server, terminate it
            const oldSocket = this.wsClients.get(clientId);
            if (oldSocket && oldSocket.readyState === WebSocket.OPEN) {
                oldSocket.terminate();
            }
            // 4) Store this new WebSocket in the map
            this.wsClients.set(clientId, ws);
            // 5) Mark it as alive for ping/pong
            ws.isAlive = true;
            ws.on("pong", () => {
                ws.isAlive = true;
            });
            console.log(`WebSockets: New WebSocket connection on serverId ${this.serverId}: clientId ${clientId}`);
            // 6) Send the final clientId back to the client
            ws.send(JSON.stringify({ clientId }));
            // 7) Server-level message listener
            ws.on("message", (messageData) => {
                // If for some reason we *no longer* own this clientId, publish to Redis
                // so that whichever server DOES own it can handle the message on a higher level in the code that adds their own .on("message")
                if (!this.wsClients.has(clientId)) {
                    let parsedMessage;
                    try {
                        parsedMessage = JSON.parse(messageData.toString());
                    }
                    catch (err) {
                        console.log(`WebSockets: Received non-JSON message from client ${clientId}:`, messageData.toString());
                        parsedMessage = messageData.toString();
                    }
                    const messageToSend = JSON.stringify({
                        clientId,
                        action: "directMessage",
                        data: parsedMessage,
                    });
                    this.pub
                        ?.publish("ypWebsocketChannel", messageToSend)
                        .then((reply) => {
                        console.log(`WebSockets: Message published to ypWebsocketChannel: ${reply}`);
                    })
                        .catch((err) => {
                        console.error("WebSockets: Error publishing to Redis:", err);
                    });
                }
                else {
                    // Otherwise, we handle it locally or pass it on
                    // Typically you'd have local server logic here,
                    // or forward it to some local "chatbot" logic, etc.
                    /*console.log(
                      `WebSockets: Local server ${this.serverId} handling message from clientId ${clientId}`
                    );*/
                }
            });
            // 8) Clean up on close/error
            ws.on("close", async () => {
                // If we still own the clientId, remove it from local map
                this.wsClients.delete(clientId);
                console.log(`WebSockets: WebSocket closed: clientId ${clientId} on server ${this.serverId}`);
                // Optionally, we can remove ownership from Redis if the user disconnected
                // But you may only want to do that after some time, or not at all,
                // depending on whether you expect reconnections with the same clientId.
                const currentOwner = await this.redisClient.get(`clientOwner:${clientId}`);
                if (currentOwner === this.serverId) {
                    // We are the legitimate owner, so free the key
                    await this.redisClient.del(`clientOwner:${clientId}`);
                    console.log(`WebSockets: Server ${this.serverId} removed ownership for clientId ${clientId} from Redis.`);
                }
            });
            ws.on("error", (err) => {
                this.wsClients.delete(clientId);
                console.error(`WebSockets: WebSocket error with clientId ${clientId}:`, err);
            });
        });
    }
    // -------------------------------
    // 1) TRY CLAIMING CLIENT OWNERSHIP
    // -------------------------------
    async tryClaimClientId(clientId) {
        const currentOwner = await this.redisClient.get(`clientOwner:${clientId}`);
        if (currentOwner === this.serverId) {
            // Update expiration if necessary
            await this.redisClient.set(`clientOwner:${clientId}`, this.serverId, {
                XX: true,
                EX: 24 * 60 * 60,
            });
            return true;
        }
        // Use SETNX approach
        // NX => only set if key does NOT exist
        // EX => optional expiry; you can set a day, etc. so it doesn't last forever
        const result = await this.redisClient.set(`clientOwner:${clientId}`, this.serverId, {
            NX: true, // Set only if it doesn't exist
            EX: 24 * 60 * 60, // e.g. 24h, or omit if you prefer no expiry
        });
        if (result === "OK") {
            // We successfully claimed
            return true;
        }
        else {
            // Another server owns it
            const currentOwner = await this.redisClient.get(`clientOwner:${clientId}`);
            console.log(`WebSockets: Unable to claim clientId ${clientId}, already owned by ${currentOwner}`);
            return false;
        }
    }
    // -------------------------------
    // 2) REQUEST RELEASE FROM OLD OWNER
    // -------------------------------
    async requestReleaseClientId(clientId) {
        const currentOwner = await this.redisClient.get(`clientOwner:${clientId}`);
        if (!currentOwner)
            return; // No one actually owns it, maybe it expired?
        if (currentOwner === this.serverId) {
            // We ironically already own it (possibly race condition?), just return
            return;
        }
        console.log(`WebSockets: Requesting server ${currentOwner} to release clientId ${clientId}`);
        const msg = {
            action: "releaseClientId",
            clientId,
            fromServer: this.serverId,
            oldOwner: currentOwner,
        };
        await this.pub?.publish("ypControlChannel", JSON.stringify(msg));
    }
    // -------------------------------
    // 3) SETUP REDIS PUB/SUB + CONTROL CHANNEL
    // -------------------------------
    async setupPubSub() {
        this.pub = this.redisClient.duplicate();
        this.sub = this.redisClient.duplicate();
        // Listen for errors and attempt to reconnect when needed
        this.pub.on("error", (err) => {
            console.error("WebSockets: Publisher Redis client error:", err);
            this.handleRedisError(this.pub);
        });
        this.sub.on("error", (err) => {
            console.error("WebSockets: Subscriber Redis client error:", err);
            this.handleRedisError(this.sub);
        });
        // Connect with retry logic
        await Promise.all([
            this.connectRedisClient(this.pub, "Publisher"),
            this.connectRedisClient(this.sub, "Subscriber"),
        ]);
        // 3a) Subscribe to the primary channel for direct messages
        this.sub.subscribe("ypWebsocketChannel", (message, channel) => {
            try {
                const parsed = JSON.parse(message);
                const { clientId, action, data } = parsed;
                console.log(`WebSockets: Received from Redis on ${channel}: ${JSON.stringify(parsed)}`);
                switch (action) {
                    case "directMessage":
                        // If we own this clientId, forward to local WebSocket
                        const ws = this.wsClients.get(clientId);
                        if (ws) {
                            try {
                                ws.send(JSON.stringify(data));
                            }
                            catch (err) {
                                console.error(`WebSockets: Error sending direct message to ${clientId}:`, err);
                            }
                        }
                        else {
                            // We apparently don't have that client
                            console.warn(`WebSockets: No WebSocket found locally for clientId ${clientId}`);
                            this.wsClients.delete(clientId);
                        }
                        break;
                    default:
                        console.warn(`WebSockets: Unknown action '${action}' received from Redis.`);
                }
            }
            catch (err) {
                console.error("WebSockets: Error handling Redis message:", err);
            }
        });
        // 3b) Subscribe to the control channel for ownership requests
        this.sub.subscribe("ypControlChannel", async (message, channel) => {
            try {
                const parsed = JSON.parse(message);
                const { action, clientId, oldOwner, fromServer } = parsed;
                if (action === "releaseClientId") {
                    // Check if *we* are actually the old owner
                    const currentOwner = await this.redisClient.get(`clientOwner:${clientId}`);
                    if (currentOwner === this.serverId && this.serverId === oldOwner) {
                        // We own this client, so let's release it
                        console.log(`WebSockets: Server ${this.serverId} is releasing clientId ${clientId} (requested by ${fromServer}).`);
                        // Close local WebSocket if still open
                        const ws = this.wsClients.get(clientId);
                        if (ws && ws.readyState === WebSocket.OPEN) {
                            ws.close(1000, "Another server claimed ownership");
                            this.wsClients.delete(clientId);
                        }
                        // Remove ownership from Redis
                        await this.redisClient.del(`clientOwner:${clientId}`);
                        console.log(`WebSockets: Server ${this.serverId} removed ownership for clientId ${clientId}.`);
                    }
                    else {
                        // We don't own it or the ownership mismatch
                        // Possibly ignore or log
                        console.log(`WebSockets: releaseClientId ignored by ${this.serverId}. currentOwner=${currentOwner}, oldOwner=${oldOwner}`);
                    }
                }
            }
            catch (err) {
                console.error("WebSockets: Error handling control message:", err);
            }
        });
    }
    /**
     * Attempt to connect a Redis client with a few retries.
     */
    async connectRedisClient(client, clientName) {
        let attempts = 0;
        while (attempts < this.maxRedisReconnectAttempts) {
            try {
                attempts++;
                await client.connect();
                console.log(`WebSockets: ${clientName} connected successfully.`);
                return;
            }
            catch (err) {
                console.error(`WebSockets: ${clientName} connection attempt ${attempts} failed:`, err);
                await new Promise((resolve) => setTimeout(resolve, this.redisReconnectDelay));
            }
        }
        throw new Error(`WebSockets: ${clientName} failed to connect after ${this.maxRedisReconnectAttempts} attempts`);
    }
    /**
     * Handle Redis errors by attempting to reconnect the client.
     */
    async handleRedisError(client) {
        try {
            client.disconnect();
        }
        catch (err) {
            console.error("WebSockets: Error disconnecting Redis client during error handling:", err);
        }
        // Attempt to reconnect
        try {
            await this.connectRedisClient(client, "Redis Client");
        }
        catch (err) {
            console.error("WebSockets: Failed to reconnect Redis client:", err);
        }
    }
    /**
     * Ping all clients every 30 seconds. If a client does not respond with 'pong',
     * we assume it's a stale connection and terminate it.
     */
    startPingCheck() {
        console.log("WebSockets: Starting ping check");
        this.pingInterval = setInterval(() => {
            if (this.ws.clients.size > 0) {
                console.log(`WebSockets: Pinging clients ${this.ws.clients.size}`);
                this.ws.clients.forEach((socket) => {
                    const wsAny = socket;
                    if (wsAny.isAlive === false) {
                        console.log("WebSockets: Terminating unresponsive client");
                        return socket.terminate();
                    }
                    wsAny.isAlive = false;
                    socket.ping();
                });
            }
        }, 30000);
        // If the server closes the entire WebSocketServer
        this.ws.on("close", () => {
            console.log("WebSockets: WebSocket closed");
            if (this.pingInterval) {
                clearInterval(this.pingInterval);
            }
        });
    }
    /**
     * Gracefully shut down the Redis pub/sub clients.
     */
    async shutdownPubSub() {
        try {
            console.log("WebSockets: Shutting down Redis pub/sub");
            if (this.pub) {
                await this.pub.disconnect();
                console.log("WebSockets: Publisher disconnected gracefully.");
            }
            if (this.sub) {
                await this.sub.disconnect();
                console.log("WebSockets: Subscriber disconnected gracefully.");
            }
        }
        catch (err) {
            console.error("WebSockets: Error during Redis pub/sub shutdown:", err);
        }
    }
}
