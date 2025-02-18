import { Server } from "https";
import { RedisClientType } from "@redis/client";
import { WebSocketServer, WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";

export class WebSocketsManager {
  wsClients: Map<string, WebSocket>;
  ws: WebSocketServer;
  redisClient: RedisClientType;

  constructor(wsClients: Map<string, WebSocket>, redisClient: RedisClientType, server: Server) {
    this.wsClients = wsClients;
    this.redisClient = redisClient;
    this.ws = new WebSocketServer({ server: server });

  }

  async listen() {
    const [pub, sub] = await this.setupPubSub();

    this.ws.on("connection", (ws: WebSocket) => {
      const clientId = uuidv4();
      this.wsClients.set(clientId, ws);

      console.log(`New WebSocket connection: clientId ${clientId}`);

      ws.send(JSON.stringify({ clientId: clientId }));

      ws.on("message", (message: any) => {
        let parsedMessage;
        try {
          parsedMessage = JSON.parse(message);
        } catch (e) {
          console.log(
            `Received non-JSON message from client ${clientId}:`,
            message
          );
          parsedMessage = message;
        }

        if (parsedMessage && parsedMessage.type === "heartbeat") {
          console.log(`Received heartbeat from client ${clientId}`);
          ws.send(JSON.stringify({ type: "heartbeat_ack" }));
        } else if (!this.wsClients.has(clientId)) {
          const messageToSend = JSON.stringify({
            clientId,
            action: "directMessage",
            data: parsedMessage,
          });

          pub
            .publish("ypWebsocketChannel", messageToSend)
            .then((reply) => {
              console.log(`Message published to ypWebsocketChannel: ${reply}`);
            })
            .catch((err) => {
              console.error(
                `Error publishing to Redis channel ypWebsocketChannel:`,
                err
              );
            });
        }
      });

      ws.on("close", () => {
        this.wsClients.delete(clientId);
        console.log(`WebSocket connection closed: clientId ${clientId}`);
      });

      ws.on("error", (err) => {
        this.wsClients.delete(clientId);
        console.error(`WebSocket error with clientId ${clientId}:`, err);
      });
    });
  }

  async setupPubSub() {
    const pub = this.redisClient.duplicate();
    const sub = this.redisClient.duplicate();

    pub.on("error", (err) => {
      console.error("Publisher Redis client error:", err);
    });

    pub.on("connect", () => {
      console.log("Publisher Redis client is connected");
    });

    pub.on("reconnecting", () => {
      console.log("Publisher Redis client is reconnecting");
    });

    sub.on("error", (err) => {
      console.error("Subscriber Redis client error:", err);
    });

    sub.on("connect", () => {
      console.log("Subscriber Redis client is connected");
    });

    sub.on("reconnecting", () => {
      console.log("Subscriber Redis client is reconnecting");
    });

    try {
      await Promise.all([pub.connect(), sub.connect()]);
    } catch (err) {
      console.error("Error connecting to Redis:", err);
    }

    sub.subscribe("ypWebsocketChannel", (message, channel) => {
      try {
        const parsedMessage = JSON.parse(message);
        const { clientId, action, data } = parsedMessage;

        console.log(`Received message from Redis: ${message} at ${channel}`);

        switch (action) {
          case "broadcast":
            this.wsClients.forEach((ws, id) => {
              try {
                ws.send(JSON.stringify(data));
              } catch (err) {
                console.error(
                  `Error sending broadcast message to client ${id}:`,
                  err
                );
              }
            });
            break;
          case "directMessage":
            const ws = this.wsClients.get(clientId);
            if (ws) {
              try {
                ws.send(JSON.stringify(data));
              } catch (err) {
                console.error(
                  `Error sending direct message to client ${clientId}:`,
                  err
                );
              }
            } else {
              console.warn(`No WebSocket found for clientId ${clientId}`);
              this.wsClients.delete(clientId);
            }
            break;
        }
      } catch (e) {
        console.error("Error handling message from Redis:", e);
      }
    });

    return [pub, sub];
  }
}

