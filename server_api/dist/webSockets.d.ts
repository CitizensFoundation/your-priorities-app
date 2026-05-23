import { Server as HttpServer } from "http";
import { RedisClientType } from "@redis/client";
import { WebSocketServer, WebSocket } from "ws";
/**
 * WebSocketsManager:
 *  - Maintains a Map of clientId -> WebSocket for local ownership
 *  - Coordinates cross-server ownership (clientId -> serverId) via Redis,
 *    so that only one server "owns" a given clientId at a time.
 */
export declare class WebSocketsManager {
    wsClients: Map<string, WebSocket>;
    ws: WebSocketServer;
    redisClient: RedisClientType;
    private pingInterval;
    constructor(wsClients: Map<string, WebSocket>, redisClient: RedisClientType, server: HttpServer);
    /**
     * Main entry point to start listening for connections
     * and initialize Redis pub/sub, heartbeat, etc.
     */
    listen(): Promise<void>;
    /**
     * Ping all clients every 30 seconds. If a client does not respond with 'pong',
     * we assume it's a stale connection and terminate it.
     */
    private startPingCheck;
}
