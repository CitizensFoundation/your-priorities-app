import express from "express";
import WebSocket from "ws";
import auth from "../../authorization.cjs";
import { TaskManager } from "../tasks/taskManager.js";
import log from "../../utils/loggerTs.js";

interface YpRequest extends express.Request {
  redisClient?: any;
  user?: any;
}

export class AgentTaskController {
  public path = "/api/agentTasks";
  public router = express.Router();
  private taskManager: TaskManager;

  constructor(wsClients: Map<string, WebSocket>) {
    this.taskManager = new TaskManager(wsClients);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/:domainId/start",
      auth.can("view domain"),
      this.startTask
    );
    this.router.post(
      "/:domainId/stop",
      auth.can("view domain"),
      this.stopTask
    );
    this.router.get(
      "/:domainId/:agentId/status",
      auth.can("view domain"),
      this.agentStatus
    );
    this.router.get(
      "/:groupId/:agentId/memory",
      auth.can("view domain"),
      this.getAgentMemory
    );
  }

  private startTask = async (req: YpRequest, res: express.Response) => {
    try {
      const { agentConfiguration, communityIdToCloneFrom, wsClientId } = req.body;
      const run = await this.taskManager.startTask(
        agentConfiguration,
        communityIdToCloneFrom,
        wsClientId
      );
      res.status(200).json({ run });
    } catch (error: any) {
      log.error("Error starting task:", error);
      res.status(500).json({ error: error.message });
    }
  };

  private stopTask = async (req: YpRequest, res: express.Response) => {
    try {
      const { agentId, agentRunId, wsClientId } = req.body;
      await this.taskManager.stopTask(agentId, agentRunId, wsClientId);
      res.sendStatus(200);
    } catch (error: any) {
      log.error("Error stopping task:", error);
      res.status(500).json({ error: error.message });
    }
  };

  private agentStatus = async (req: YpRequest, res: express.Response) => {
    try {
      const agentId = parseInt(req.params.agentId);
      const status = await this.taskManager.agentStatus(agentId);
      if (status) {
        res.json(status);
      } else {
        res.status(404).send("Agent status not found");
      }
    } catch (error: any) {
      log.error("Error fetching agent status:", error);
      res.status(500).json({ error: error.message });
    }
  };

  private getAgentMemory = async (req: YpRequest, res: express.Response) => {
    try {
      const { groupId, agentId } = req.params;
      const memory = await this.taskManager.getAgentMemory(
        groupId,
        parseInt(agentId),
        req.redisClient
      );
      if (!memory) {
        res.status(404).json({ error: "Memory not found" });
        return;
      }
      res.json(memory);
    } catch (error: any) {
      log.error("Error getting agent memory:", error);
      res.status(500).json({ error: error.message });
    }
  };
}
