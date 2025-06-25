import express from "express";
import WebSocket from "ws";
import { AgentQueueManager } from "@policysynth/agents/operations/agentQueueManager.js";
import { AgentCostManager } from "@policysynth/agents/operations/agentCostsManager.js";
import { AgentManager } from "@policysynth/agents/operations/agentManager.js";
import { AgentConnectorManager } from "@policysynth/agents/operations/agentConnectorManager.js";
import { AgentRegistryManager } from "@policysynth/agents/operations/agentRegistryManager.js";
import { PsAiModel } from "@policysynth/agents/dbModels/aiModel.js";
import auth from "../../authorization.cjs";
import log from "../../utils/loggerTs.js";

import {
  PsAiModelSize,
  PsAiModelType,
} from "@policysynth/agents/aiModelTypes.js";
import { PsAgentClass } from "@policysynth/agents/dbModels/agentClass.js";
import { PsAgent } from "@policysynth/agents/dbModels/agent.js";
import { PsAgentAuditLog } from "@policysynth/agents/dbModels/agentAuditLog.js";
import { PsAgentConnector } from "@policysynth/agents/dbModels/agentConnector.js";
import { PsAgentConnectorClass } from "@policysynth/agents/dbModels/agentConnectorClass.js";
import { PsAgentRegistry } from "@policysynth/agents/dbModels/agentRegistry.js";
import { PsExternalApiUsage } from "@policysynth/agents/dbModels/externalApiUsage.js";
import { PsExternalApi } from "@policysynth/agents/dbModels/externalApis.js";
import { PsModelUsage } from "@policysynth/agents/dbModels/modelUsage.js";
import { PsAgentClassCategories } from "@policysynth/agents/agentCategories.js";
import { NewAiModelSetup } from "../managers/newAiModelSetup.js";
import { domainIncludes } from "../../services/engine/moderation/get_moderation_items.cjs";

interface YpRequest extends express.Request {
  ypDomain?: any;
  ypCommunity?: any;
  sso?: any;
  redisClient?: any;
  user?: any;
}

export class PolicySynthAgentsController {
  public path = "/api/agents";
  public router = express.Router();
  public wsClients: Map<string, WebSocket>;
  private agentQueueManager: AgentQueueManager;
  private agentCostManager: AgentCostManager;
  private agentManager: AgentManager;
  private agentConnectorManager: AgentConnectorManager;
  private agentRegistryManager: AgentRegistryManager;

  constructor(wsClients: Map<string, WebSocket>) {
    this.wsClients = wsClients;
    this.agentQueueManager = new AgentQueueManager();
    this.agentCostManager = new AgentCostManager();
    this.agentManager = new AgentManager();
    this.agentConnectorManager = new AgentConnectorManager();
    this.agentRegistryManager = new AgentRegistryManager();

    this.initializeRoutes();

    // Call our separated model setup methods.
    NewAiModelSetup.initializeModels();
    // Using a hardcoded userId (1) for seeding test AI models.
    NewAiModelSetup.setupAiModels(1);
  }

  /**
   * A proxy for setting up API keys for a group.
   * @param group The group instance to configure
   */
  public static async setupApiKeysForGroup(group: any): Promise<void> {
    return NewAiModelSetup.setupApiKeysForGroup(group);
  }

  public initializeRoutes() {
    this.router.get("/:groupId", auth.can("view group"), this.getAgent);
    this.router.put(
      "/:groupId/:agentId/:nodeType/:nodeId/configuration",
      auth.can("edit group"),
      this.updateNodeConfiguration
    );

    this.router.post(
      "/:groupId/:id/control",
      auth.can("edit group"),
      this.controlAgent
    );
    this.router.get(
      "/:groupId/:id/status",
      auth.can("view group"),
      this.getAgentStatus
    );
    this.router.get(
      "/:groupId/:id/costs",
      auth.can("view group"),
      this.getAgentCosts
    );
    this.router.get(
      "/:groupId/:id/costs/detail",
      auth.can("view group"),
      this.getAgentCostsDetail
    );
    this.router.get(
      "/:groupId/registry/agentClasses",
      auth.can("view group"),
      this.getActiveAgentClasses
    );
    this.router.get(
      "/:groupId/registry/connectorClasses",
      auth.can("view group"),
      this.getActiveConnectorClasses
    );
    this.router.get(
      "/:groupId/registry/aiModels",
      auth.can("view group"),
      this.getActiveAiModels
    );
    this.router.post("/:groupId", auth.can("edit group"), this.createAgent);
    this.router.post(
      "/:groupId/:agentId/outputConnectors",
      auth.can("edit group"),
      this.createOutputConnector
    );
    this.router.post(
      "/:groupId/:agentId/inputConnectors",
      auth.can("edit group"),
      this.createInputConnector
    );
    this.router.put(
      "/:groupId/:nodeId/:nodeType/configuration",
      auth.can("edit group"),
      this.updateNodeConfiguration
    );
    this.router.get(
      "/:groupId/:id/ai-models",
      auth.can("view group"),
      this.getAgentAiModels
    );
    this.router.delete(
      "/:groupId/:agentId/ai-models/:modelId",
      auth.can("edit group"),
      this.removeAgentAiModel
    );
    this.router.post(
      "/:groupId/:agentId/ai-models",
      auth.can("edit group"),
      this.addAgentAiModel
    );
    this.router.put(
      "/:groupId/:agentId/memory",
      auth.can("edit group"),
      this.replaceAgentMemory
    );
    this.router.get(
      "/:groupId/:agentId/memory",
      auth.can("edit group"),
      this.getAgentMemory
    );
    this.router.post(
      "/:groupId/:agentId/inputConnectors/existing",
      auth.can("edit group"),
      this.addExistingConnector
    );
    this.router.post(
      "/:groupId/:agentId/outputConnectors/existing",
      auth.can("edit group"),
      this.addExistingConnector
    );

    this.router.delete(
      "/:groupId/:agentId",
      auth.can("edit group"),
      this.deleteAgent
    );
  }

  replaceAgentMemory = async (req: YpRequest, res: express.Response) => {
    try {
      const { groupId, agentId } = req.params;
      const memory = req.body;

      log.info(
        `Attempting to replace memory for agent ${agentId} in group ${groupId}`
      );

      if (!memory || Object.keys(memory).length === 0) {
        log.info(`Received empty memory for agent ${agentId}`);
        res.status(400).json({ error: "Cannot save empty memory" });
        return;
      }

      try {
        JSON.parse(JSON.stringify(memory));
      } catch (jsonError) {
        log.info(`Received invalid JSON for agent ${agentId}`);
        res.status(400).json({ error: "Invalid JSON format for memory" });
        return;
      }

      const memoryKey = await this.agentManager.getSubAgentMemoryKey(
        groupId,
        parseInt(agentId)
      );

      if (!memoryKey) {
        log.info(`Memory key not found for agent ${agentId}`);
        res
          .status(404)
          .json({ error: "Memory key not found for the specified agent" });
        return;
      }

      log.info(`Memory key found: ${memoryKey}`);

      await req.redisClient.set(memoryKey, JSON.stringify(memory));

      log.info(`Memory contents replaced successfully`);

      res.json({ message: "Memory replaced successfully" });
    } catch (error) {
      log.error("Error replacing agent memory:", error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
      return;
    }
  };

  addExistingConnector = async (req: YpRequest, res: express.Response) => {
    const { groupId, agentId } = req.params;
    const { connectorId } = req.body;

    let type: "input" | "output";
    if (req.path.includes("/inputConnectors/")) {
      type = "input";
    } else if (req.path.includes("/outputConnectors/")) {
      type = "output";
    } else {
      // This case should ideally not be reached if routes are set up correctly
      res.status(400).send("Could not determine connector type from path");
      return;
    }

    if (!groupId || !agentId || !connectorId) {
      res
        .status(400)
        .send(
          "Group ID, agent ID and connector ID (input/output) are required"
        );
      return;
    }

    try {
      await this.agentConnectorManager.addExistingConnector(
        parseInt(groupId),
        parseInt(agentId),
        parseInt(connectorId),
        type
      );
      res.status(200).json({
        message: `Existing ${connectorId} connector added successfully`,
      });
    } catch (error) {
      log.error(`Error adding existing ${connectorId} connector:`, error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  };

  getAgentMemory = async (req: YpRequest, res: express.Response) => {
    try {
      const { groupId, agentId } = req.params;
      log.info(
        `Attempting to get memory for agent ${agentId} in group ${groupId}`
      );

      const memoryKey = await this.agentManager.getSubAgentMemoryKey(
        groupId,
        parseInt(agentId)
      );

      if (!memoryKey) {
        log.info(`Memory key not found for agent ${agentId}`);
        res
          .status(404)
          .json({ error: "Memory key not found for the specified agent" });
        return;
      }

      log.info(`Memory key found: ${memoryKey}`);

      const memoryContents = await req.redisClient.get(memoryKey);

      if (!memoryContents) {
        log.info(`Memory contents not found for key ${memoryKey}`);
        res.status(404).json({ error: "Memory contents not found" });
        return;
      }

      log.info(`Memory contents retrieved successfully`);

      const parsedMemoryContents = JSON.parse(memoryContents);

      res.json(parsedMemoryContents);
    } catch (error) {
      log.error("Error retrieving agent memory:", error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
      return;
    }
  };

  getAgent = async (req: express.Request, res: express.Response) => {
    try {
      const agent = await this.agentManager.getAgent(req.params.groupId);
      res.json(agent);
    } catch (error) {
      log.error("Error in getAgent:", error);
      res.status(500).send("Internal Server Error");
      return;
    }
  };

  getAgentAiModels = async (req: express.Request, res: express.Response) => {
    try {
      const aiModels = await this.agentManager.getAgentAiModels(
        parseInt(req.params.id)
      );
      res.json(aiModels);
    } catch (error) {
      log.error("Error fetching agent AI models:", error);
      res.status(500).send("Internal Server Error");
    }
  };

  removeAgentAiModel = async (req: express.Request, res: express.Response) => {
    try {
      await this.agentManager.removeAgentAiModel(
        parseInt(req.params.agentId),
        parseInt(req.params.modelId)
      );
      res.json({ message: "AI model removed successfully" });
    } catch (error) {
      log.error("Error removing agent AI model:", error);
      res.status(500).send("Internal Server Error");
    }
  };

  addAgentAiModel = async (req: express.Request, res: express.Response) => {
    try {
      const { modelId, size } = req.body;
      await this.agentManager.addAgentAiModel(
        parseInt(req.params.agentId),
        modelId,
        size
      );
      res.status(201).json({ message: "AI model added successfully" });
    } catch (error) {
      log.error("Error adding agent AI model:", error);
      res.status(500).send("Internal Server Error");
    }
  };

  updateNodeConfiguration = async (
    req: express.Request,
    res: express.Response
  ) => {
    const nodeType = req.params.nodeType as "agent" | "connector";
    const nodeId = parseInt(req.params.nodeId);
    const updatedConfig = req.body;

    try {
      if (nodeType === "agent") {
        await this.agentManager.updateAgentConfiguration(nodeId, updatedConfig);
      } else if (nodeType === "connector") {
        await this.agentConnectorManager.updateConnectorConfiguration(
          nodeId,
          updatedConfig
        );
      } else {
        res.status(400).send("Invalid node type");
        return;
      }

      res.json({ message: `${nodeType} configuration updated successfully` });
    } catch (error) {
      log.error(`Error updating ${nodeType} configuration:`, error);
      res.status(500).send("Internal Server Error");
      return;
    }
  };

  createInputConnector = async (
    req: express.Request,
    res: express.Response
  ) => {
    this.createConnector(req, res, "input");
  };

  createOutputConnector = async (
    req: express.Request,
    res: express.Response
  ) => {
    this.createConnector(req, res, "output");
  };

  createConnector = async (
    req: YpRequest,
    res: express.Response,
    type: "input" | "output"
  ) => {
    const { agentId } = req.params;
    const { connectorClassId, name } = req.body;

    if (!agentId || !connectorClassId || !name || !type) {
      return res
        .status(400)
        .send(
          "Agent ID, connector class ID, name, and type (input/output) are required"
        );
    }

    try {
      const createdConnector = await this.agentConnectorManager.createConnector(
        parseInt(agentId),
        connectorClassId,
        req.user.id,
        name,
        type
      );
      res.status(201).json(createdConnector);
    } catch (error) {
      log.error(`Error creating ${type} connector:`, error);
      res.status(500).send("Internal Server Error");
    }
  };

  getActiveAiModels = async (req: express.Request, res: express.Response) => {
    try {
      const activeAiModels = await PsAiModel.findAll({
        where: { "configuration.active": true },
      });

      res.json(activeAiModels);
    } catch (error) {
      log.error("Error fetching active AI models:", error);
      res.status(500).send("Internal Server Error");
    }
  };

  getActiveAgentClasses = async (req: YpRequest, res: express.Response) => {
    try {
      const activeAgentClasses =
        await this.agentRegistryManager.getActiveAgentClasses(req.user.id);
      res.json(activeAgentClasses);
    } catch (error) {
      log.error("Error fetching active agent classes:", error);
      if (error instanceof Error) {
        res.status(500).send(`Internal Server Error: ${error.message}`);
      } else {
        res.status(500).send("Internal Server Error");
      }
    }
  };

  getActiveConnectorClasses = async (req: YpRequest, res: express.Response) => {
    try {
      const activeConnectorClasses =
        await this.agentRegistryManager.getActiveConnectorClasses(req.user.id);
      res.json(activeConnectorClasses);
    } catch (error) {
      log.error("Error fetching active connector classes:", error);
      res.status(500).send("Internal Server Error");
    }
  };

  createAgent = async (req: YpRequest, res: express.Response) => {
    const { name, agentClassId, aiModels, parentAgentId } = req.body;

    try {
      const createdAgent = await this.agentManager.createAgent(
        name,
        agentClassId,
        aiModels,
        parseInt(req.params.groupId),
        req.user.id,
        parentAgentId
      );
      res.status(201).json(createdAgent);
    } catch (error) {
      log.error("Error creating agent:", error);
      if (error instanceof Error) {
        res.status(400).send(error.message);
      } else {
        res.status(500).send("Internal Server Error");
      }
    }
  };

  controlAgent = async (req: express.Request, res: express.Response) => {
    const agentId = parseInt(req.params.id);
    const action = req.body.action;

    try {
      const message = await this.agentQueueManager.controlAgent(
        agentId,
        action
      );
      if (action === "start") {
        await this.agentQueueManager.clearAgentStatusMessages(agentId);
        log.debug(`Cleared status messages for agent ${agentId}`);
      }
      res.json({ message });
    } catch (error) {
      log.error(`Error ${action}ing agent:`, error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  };

  getAgentStatus = async (req: express.Request, res: express.Response) => {
    const agentId = parseInt(req.params.id);

    try {
      const status = await this.agentQueueManager.getAgentStatus(agentId);
      if (status) {
        res.json(status);
      } else {
        res.status(404).send("Agent status not found");
      }
    } catch (error) {
      log.error("Error getting agent status:", error);
      res.status(500).send("Internal Server Error");
    }
  };

  updateAgentStatus = async (req: express.Request, res: express.Response) => {
    const agentId = parseInt(req.params.id);
    const { state, details } = req.body;

    try {
      const success = await this.agentQueueManager.updateAgentStatus(
        agentId,
        state,
        details
      );
      if (success) {
        res.json({ message: "Agent status updated successfully" });
      } else {
        res.status(404).send("Agent not found");
      }
    } catch (error) {
      log.error("Error updating agent status:", error);
      res.status(500).send("Internal Server Error");
    }
  };

  private async recursiveDeleteAgent(agentId: number): Promise<void> {
    const agent = await PsAgent.findByPk(agentId, {
      include: [{ model: PsAgent, as: "SubAgents" }],
    });
    if (!agent) return;
    if (agent.SubAgents) {
      for (const sub of agent.SubAgents) {
        await this.recursiveDeleteAgent(sub.id);
      }
    }
    await agent.destroy();
  }

  deleteAgent = async (req: YpRequest, res: express.Response) => {
    try {
      const agentId = parseInt(req.params.agentId);
      await this.recursiveDeleteAgent(agentId);
      res.json({ message: "Agent deleted" });
    } catch (error) {
      log.error("Error deleting agent:", error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  };

  startAgentProcessing = async (
    req: express.Request,
    res: express.Response
  ) => {
    const agentId = parseInt(req.params.id);

    try {
      const success = await this.agentQueueManager.startAgentProcessing(
        agentId
      );
      if (success) {
        res.json({ message: "Agent processing started successfully" });
      } else {
        res.status(404).send("Agent not found");
      }
    } catch (error) {
      log.error("Error starting agent processing:", error);
      res.status(500).send("Internal Server Error");
    }
  };

  pauseAgentProcessing = async (
    req: express.Request,
    res: express.Response
  ) => {
    const agentId = parseInt(req.params.id);

    try {
      const success = await this.agentQueueManager.pauseAgentProcessing(
        agentId
      );
      if (success) {
        res.json({ message: "Agent processing paused successfully" });
      } else {
        res.status(404).send("Agent not found");
      }
    } catch (error) {
      log.error("Error pausing agent processing:", error);
      res.status(500).send("Internal Server Error");
    }
  };

  getAgentCosts = async (req: express.Request, res: express.Response) => {
    try {
      const agentId = parseInt(req.params.id);
      const totalCosts = await this.agentCostManager.getAgentCosts(agentId);
      res.json(totalCosts);
    } catch (error) {
      log.error("Error calculating agent costs:", error);
      res.status(500).send("Internal Server Error");
    }
  };

  getAgentCostsDetail = async (req: express.Request, res: express.Response) => {
    try {
      const agentId = parseInt(req.params.id);
      const costRows = await this.agentCostManager.getDetailedAgentCosts(
        agentId
      );
      res.json(costRows);
    } catch (error) {
      log.error("Error calculating agent costs detail:", error);
      res.status(500).send("Internal Server Error");
    }
  };
}
