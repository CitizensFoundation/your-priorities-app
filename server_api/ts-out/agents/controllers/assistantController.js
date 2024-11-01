import express from "express";
import auth from "../../authorization.cjs";
import { YpAgentAssistant } from "../assistants/agentAssistant.js";
export class AssistantController {
    constructor(wsClients) {
        this.path = "/api/assistants";
        this.router = express.Router();
        this.wsClients = wsClients;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.put("/:id/chat", auth.can("view domain"), this.startChatSession);
    }
    async startChatSession(req, res) {
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
        }
        catch (error) {
            console.error("Error starting chat session:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}
