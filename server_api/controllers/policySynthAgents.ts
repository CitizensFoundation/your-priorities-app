import express from "express";
import WebSocket from "ws";
import { AgentQueueManager } from "@policysynth/agents/operations/agentQueueManager.js";
import { AgentCostManager } from "@policysynth/agents/operations/agentCostsManager.js";
import { AgentManager } from "@policysynth/agents/operations/agentManager.js";
import { AgentConnectorManager } from "@policysynth/agents/operations/agentConnectorManager.js";
import { AgentRegistryManager } from "@policysynth/agents/operations/agentRegistryManager.js";
import { PsAiModel } from "@policysynth/agents/dbModels/aiModel.js";
import auth from "../authorization.cjs";
import models from "../models/index.cjs";
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
import { sequelize as psSequelize } from "@policysynth/agents/dbModels/index.js";
import { PsAgentClassCategories } from "@policysynth/agents/agentCategories.js";

const dbModels: Models = models;
const Group = dbModels.Group as GroupClass;
const User = dbModels.User as UserClass;

const psModels: Models = {
  PsAgentClass,
  PsExternalApiUsage,
  PsModelUsage,
  PsAgentConnector,
  PsAgent,
  PsAgentAuditLog,
  PsAgentConnectorClass,
  PsAgentRegistry,
  PsAiModel,
  PsExternalApi,
};

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
  private agentQueueManager!: AgentQueueManager;
  private agentCostManager!: AgentCostManager;
  private agentManager!: AgentManager;
  private agentConnectorManager!: AgentConnectorManager;
  private agentRegistryManager!: AgentRegistryManager;

  constructor(wsClients: Map<string, WebSocket>) {
    this.wsClients = wsClients;
    this.agentQueueManager = new AgentQueueManager();
    this.agentCostManager = new AgentCostManager();
    this.agentManager = new AgentManager();
    this.agentConnectorManager = new AgentConnectorManager();
    this.agentRegistryManager = new AgentRegistryManager();

    this.initializeRoutes();
    this.initializeModels();
    this.setupAiModels();
  }

  initializeModels = async () => {
    try {
      console.log(`All Models Loaded Init`);

      // Call associate method to set up associations
      for (const modelName of Object.keys(psModels)) {
        if (psModels[modelName].associate) {
          await psModels[modelName].associate(psSequelize.models);
        }
      }

      console.log("All models initialized successfully.");
    } catch (error) {
      console.error("Error initializing models:", error);
      process.exit(1);
    }
  };

  static setupApiKeysForGroup = async (group: typeof Group) => {
    const anthropicSonnet = await PsAiModel.findOne({
      where: {
        name: "Anthropic Sonnet 3.5",
      },
    });

    const openAiGpt4 = await PsAiModel.findOne({
      where: {
        name: "GPT-4o",
      },
    });

    const openAiGpt4Mini = await PsAiModel.findOne({
      where: {
        name: "GPT-4o Mini",
      },
    });

    group.set("private_access_configuration", [
      {
        aiModelId: anthropicSonnet!.id,
        apiKey: process.env.ANTHROPIC_CLAUDE_API_KEY || "",
      },
      {
        aiModelId: openAiGpt4!.id,
        apiKey: process.env.OPENAI_API_KEY || "",
      },
      {
        aiModelId: openAiGpt4Mini!.id,
        apiKey: process.env.OPENAI_API_KEY || "",
      },
    ]);

    await group.save();
  };

  async setupAiModels() {
    setTimeout(async () => {
      console.log("Seeding test AI models");
      await this.seedTestAiModels(1);
    }, 100);
  }

  async seedTestAiModels(userId: number) {
    const testModel = await PsAiModel.findOne({
      where: {
        name: "Anthropic Sonnet 3.5",
      },
    });

    if (!testModel) {
      const anthropicSonnetConfig: PsAiModelConfiguration = {
        type: PsAiModelType.Text,
        modelSize: PsAiModelSize.Medium,
        provider: "anthropic",
        prices: {
          costInTokensPerMillion: 3,
          costOutTokensPerMillion: 15,
          currency: "USD",
        },
        maxTokensOut: 8000,
        defaultTemperature: 0.7,
        model: "claude-3-5-sonnet-20240620",
        active: true,
      };

      const anthropicSonnet = await PsAiModel.create({
        name: "Anthropic Sonnet 3.5",
        organization_id: 1,
        user_id: userId,
        configuration: anthropicSonnetConfig,
      });

      console.log("Created test AI model:", anthropicSonnet);

      const openAiGpt4oConfig: PsAiModelConfiguration = {
        type: PsAiModelType.Text,
        modelSize: PsAiModelSize.Medium,
        provider: "openai",
        prices: {
          costInTokensPerMillion: 5,
          costOutTokensPerMillion: 15,
          currency: "USD",
        },
        maxTokensOut: 4096,
        defaultTemperature: 0.7,
        model: "gpt-4o",
        active: true,
      };

      const openAiGpt4oMiniConfig: PsAiModelConfiguration = {
        type: PsAiModelType.Text,
        modelSize: PsAiModelSize.Small,
        provider: "openai",
        prices: {
          costInTokensPerMillion: 0.15,
          costOutTokensPerMillion: 0.6,
          currency: "USD",
        },
        maxTokensOut: 16000,
        defaultTemperature: 0.0,
        model: "gpt-4o-mini",
        active: true,
      };

      const openAiGpt4 = await PsAiModel.create({
        name: "GPT-4o",
        organization_id: 1,
        user_id: userId,
        configuration: openAiGpt4oConfig,
      });

      console.log("Created test AI model:", openAiGpt4);

      const openAiGpt4Mini = await PsAiModel.create({
        name: "GPT-4o Mini",
        organization_id: 1,
        user_id: userId,
        configuration: openAiGpt4oMiniConfig,
      });

      console.log("Created test AI model:", openAiGpt4Mini);

      const topLevelAgentClassConfig: PsAgentClassAttributesConfiguration = {
        category: PsAgentClassCategories.PolicySynthTopLevel,
        subCategory: "group",
        hasPublicAccess: true,
        description: "A top-level agent that coordinates other agents",
        queueName: "noqueue",
        imageUrl:
          "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/topLevelAgent.png",
        iconName: "coordinator",
        capabilities: [
          "process coordination",
          "task management",
          "result aggregation",
        ],
        questions: [],
        requestedAiModelSizes: ["large", "medium", "small"] as PsAiModelSize[],
        supportedConnectors: [],
      };

      await PsAgentClass.create({
        class_base_id: "c375c1fb-58ca-4372-a567-0e02b2c3d479",
        name: "Operations",
        version: 1,
        available: true,
        configuration: topLevelAgentClassConfig,
        user_id: userId,
      });
    } else {
      console.log("Test AI models already exist");
    }
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
  }

  getAgent = async (req: express.Request, res: express.Response) => {
    try {
      const agent = await this.agentManager.getAgent(req.params.groupId);
      res.json(agent);
    } catch (error) {
      console.error("Error in getAgent:", error);
      res.status(500).send("Internal Server Error");
    }
  };

  getAgentAiModels = async (req: express.Request, res: express.Response) => {
    try {
      const aiModels = await this.agentManager.getAgentAiModels(
        parseInt(req.params.id)
      );
      res.json(aiModels);
    } catch (error) {
      console.error("Error fetching agent AI models:", error);
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
      console.error("Error removing agent AI model:", error);
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
      console.error("Error adding agent AI model:", error);
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
        return res.status(400).send("Invalid node type");
      }

      res.json({ message: `${nodeType} configuration updated successfully` });
    } catch (error) {
      console.error(`Error updating ${nodeType} configuration:`, error);
      res.status(500).send("Internal Server Error");
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
      console.error(`Error creating ${type} connector:`, error);
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
      console.error("Error fetching active AI models:", error);
      res.status(500).send("Internal Server Error");
    }
  };

  getActiveAgentClasses = async (req: YpRequest, res: express.Response) => {
    try {
      const activeAgentClasses =
        await this.agentRegistryManager.getActiveAgentClasses(req.user.id);
      res.json(activeAgentClasses);
    } catch (error) {
      console.error("Error fetching active agent classes:", error);
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
      console.error("Error fetching active connector classes:", error);
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
      console.error("Error creating agent:", error);
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
      res.json({ message });
    } catch (error) {
      console.error(`Error ${action}ing agent:`, error);
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
      console.error("Error getting agent status:", error);
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
      console.error("Error updating agent status:", error);
      res.status(500).send("Internal Server Error");
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
      console.error("Error starting agent processing:", error);
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
      console.error("Error pausing agent processing:", error);
      res.status(500).send("Internal Server Error");
    }
  };

  getAgentCosts = async (req: express.Request, res: express.Response) => {
    try {
      const agentId = parseInt(req.params.id);
      const totalCosts = await this.agentCostManager.getAgentCosts(agentId);
      res.json(totalCosts);
    } catch (error) {
      console.error("Error calculating agent costs:", error);
      res.status(500).send("Internal Server Error");
    }
  };
}
