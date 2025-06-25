import express from "express";
import auth from "../../authorization.cjs";
import { TaskManager } from "../tasks/taskManager.js";
import log from "../../utils/loggerTs.js";
export class AgentTaskController {
    constructor(wsClients) {
        this.path = "/api/agentTasks";
        this.router = express.Router();
        this.startTask = async (req, res) => {
            try {
                const { communityIdToClone } = req.body;
                const domainId = parseInt(req.params.domainId);
                const agentId = await this.taskManager.startTask(communityIdToClone, domainId, req.user);
                res.status(200).json({ agentId });
            }
            catch (error) {
                log.error("Error starting task:", error);
                res.status(500).json({ error: error.message });
            }
        };
        this.stopTask = async (req, res) => {
            try {
                const { agentId, agentRunId, wsClientId } = req.body;
                await this.taskManager.stopTask(agentId, agentRunId, wsClientId);
                res.sendStatus(200);
            }
            catch (error) {
                log.error("Error stopping task:", error);
                res.status(500).json({ error: error.message });
            }
        };
        this.agentStatus = async (req, res) => {
            try {
                const agentId = parseInt(req.params.agentId);
                const status = await this.taskManager.agentStatus(agentId);
                if (status) {
                    res.json(status);
                }
                else {
                    res.status(404).send("Agent status not found");
                }
            }
            catch (error) {
                log.error("Error fetching agent status:", error);
                res.status(500).json({ error: error.message });
            }
        };
        this.getAgentMemory = async (req, res) => {
            try {
                const { groupId, agentId } = req.params;
                const memory = await this.taskManager.getAgentMemory(groupId, parseInt(agentId), req.redisClient);
                if (!memory) {
                    res.status(404).json({ error: "Memory not found" });
                    return;
                }
                res.json(memory);
            }
            catch (error) {
                log.error("Error getting agent memory:", error);
                res.status(500).json({ error: error.message });
            }
        };
        this.taskManager = new TaskManager(wsClients);
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/:domainId/start", auth.can("view domain"), this.startTask);
        this.router.post("/:domainId/stop", auth.can("view domain"), this.stopTask);
        this.router.get("/:domainId/:agentId/status", auth.can("view domain"), this.agentStatus);
        this.router.get("/:groupId/:agentId/memory", auth.can("view domain"), this.getAgentMemory);
    }
}
