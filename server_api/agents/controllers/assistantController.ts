import express from "express";
import WebSocket from "ws";
import auth from "../../authorization.cjs";
import { YpAgentAssistant } from "../assistants/agentAssistant.js";

interface YpRequest extends express.Request {
  ypDomain?: any;
  ypCommunity?: any;
  sso?: any;
  redisClient?: any;
  user?: any;
  clientAppPath?: string;
  adminAppPath?: string;
  dirName?: string;
  useNewVersion?: boolean;
}

export class AssistantController {
  public path = "/api/assistants";
  public router = express.Router();
  public wsClients: Map<string, WebSocket>;

  constructor(wsClients: Map<string, WebSocket>) {
    this.wsClients = wsClients;
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.put(
      "/:id/chat",
      auth.can("view domain"),
      this.startChatSession
    );
  }

  private async startChatSession(req: YpRequest, res: express.Response) {
    try {
      const { wsClientId, chatLog } = req.body;
      console.log(`Starting chat session for client: ${wsClientId}`);

      // Check if client already has an active WebSocket connection
      if (this.wsClients.has(wsClientId)) {
        return res.status(400).json({ error: "Chat session already exists" });
      }

      const assistant = new YpAgentAssistant(wsClientId, this.wsClients, req.redisClient);

      assistant.conversation(chatLog);

      res.status(200).json({
        message: "Chat session initialized",
        wsClientId
      });
    } catch (error) {
      console.error("Error starting chat session:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
