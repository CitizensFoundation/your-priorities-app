import { Server } from "https";
import { IncomingMessage, Server as HttpServer } from "http";
import { RedisClientType } from "@redis/client";
import { WebSocketServer, WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";
import log from "./utils/loggerTs.js";

/**
 * WebSocketsManager:
 *  - Maintains a Map of clientId -> WebSocket for local ownership
 *  - Coordinates cross-server ownership (clientId -> serverId) via Redis,
 *    so that only one server "owns" a given clientId at a time.
 */
export class WebSocketsManager {
  wsClients: Map<string, WebSocket>;
  ws: WebSocketServer;
  redisClient: RedisClientType;

  // Ping/pong heartbeat interval
  private pingInterval: NodeJS.Timer | null = null;

  constructor(
    wsClients: Map<string, WebSocket>,
    redisClient: RedisClientType,
    server: HttpServer
  ) {
    this.wsClients = wsClients;
    this.redisClient = redisClient;
    this.ws = new WebSocketServer({ server });
  }

  /**
   * Main entry point to start listening for connections
   * and initialize Redis pub/sub, heartbeat, etc.
   */
  async listen() {
    // Start periodic ping/pong for WS clients
    this.startPingCheck();

    // Convert to async so we can 'await' inside
    this.ws.on("connection", async (ws: WebSocket, req: IncomingMessage) => {
      // 1) Extract ?clientId= from the URL or generate a new one
      const url = new URL(req.url ?? "", "http://dummy");
      let clientId = url.searchParams.get("clientId") || "";
      if (!clientId) {
        clientId = uuidv4();
      }

      this.wsClients.set(clientId, ws);

      (ws as any).isAlive = true;
      ws.on("pong", () => {
        (ws as any).isAlive = true;
      });

      log.info(
        `WebSockets: New WebSocket connection: clientId ${clientId}`
      );

      ws.send(JSON.stringify({ clientId }));

      ws.on("close", async () => {
        this.wsClients.delete(clientId);
        log.info(
          `WebSockets: WebSocket closed: clientId ${clientId}`
        );
      });

      ws.on("error", (err) => {
        this.wsClients.delete(clientId);
        log.error(
          `WebSockets: WebSocket error with clientId ${clientId}:`,
          err
        );
      });
    });
  }

  /**
   * Ping all clients every 30 seconds. If a client does not respond with 'pong',
   * we assume it's a stale connection and terminate it.
   */
  private startPingCheck() {
    log.info("WebSockets: Starting ping check");
    this.pingInterval = setInterval(() => {
      if (this.ws.clients.size > 0) {
        log.info(`WebSockets: Pinging clients ${this.ws.clients.size}`);
        this.ws.clients.forEach((socket) => {
          const wsAny = socket as any;
        if (wsAny.isAlive === false) {
          log.info("WebSockets: Terminating unresponsive client");
          return socket.terminate();
        }
        wsAny.isAlive = false;
          socket.ping();
        });
      }
    }, 30000);

    // If the server closes the entire WebSocketServer
    this.ws.on("close", () => {
      log.info("WebSockets: WebSocket closed");
      if (this.pingInterval) {
        clearInterval(this.pingInterval as NodeJS.Timeout);
      }
    });
  }
}
