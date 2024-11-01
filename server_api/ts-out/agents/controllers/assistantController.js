import express from "express";
import { YpAgentAssistant } from "agents/assistants/agentAssistant.js";
export class AssistantController {
    constructor(wsClients) {
        this.path = "/api/assistant";
        this.router = express.Router();
        this.wsClients = wsClients;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/:groupId/chat", 
        //  auth.can("view group"),
        this.startChatSession);
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
