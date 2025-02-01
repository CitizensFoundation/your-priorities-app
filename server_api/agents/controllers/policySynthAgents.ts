import express from "express";
import WebSocket from "ws";
import { AgentQueueManager } from "@policysynth/agents/operations/agentQueueManager.js";
import { AgentCostManager } from "@policysynth/agents/operations/agentCostsManager.js";
import { AgentManager } from "@policysynth/agents/operations/agentManager.js";
import { AgentConnectorManager } from "@policysynth/agents/operations/agentConnectorManager.js";
import { AgentRegistryManager } from "@policysynth/agents/operations/agentRegistryManager.js";
import { PsAiModel } from "@policysynth/agents/dbModels/aiModel.js";
import auth from "../../authorization.cjs";
import models from "../../models/index.cjs";
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
    const findLatestActiveModel = async (name: string) => {
      return await PsAiModel.findOne({
        where: {
          name,
          configuration: {
            active: true,
          },
        },
        order: [["created_at", "DESC"]],
      });
    };

    const anthropicSonnet = await findLatestActiveModel("Anthropic Sonnet 3.5");
    const openAiGpt4 = await findLatestActiveModel("GPT-4o");
    const openAiGpt4Mini = await findLatestActiveModel("GPT-4o Mini");
    const geminiPro = await findLatestActiveModel("Gemini 1.5 Pro 2");
    const geminiPro15Flash = await findLatestActiveModel("Gemini 1.5 Flash 2");
    const openAio1Preview = await findLatestActiveModel("o1 Preview");
    const openAio1Mini = await findLatestActiveModel("o1 Mini");
    const openAio11712 = await findLatestActiveModel("o1 24");

    const groupAccessConfig = [];

    if (anthropicSonnet && process.env.ANTHROPIC_CLAUDE_API_KEY) {
      groupAccessConfig.push({
        aiModelId: anthropicSonnet!.id,
        apiKey: process.env.ANTHROPIC_CLAUDE_API_KEY,
      });
    }

    if (openAiGpt4 && process.env.OPENAI_API_KEY) {
      groupAccessConfig.push({
        aiModelId: openAiGpt4!.id,
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    if (openAiGpt4Mini && process.env.OPENAI_API_KEY) {
      groupAccessConfig.push({
        aiModelId: openAiGpt4Mini!.id,
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    if (openAio1Preview && process.env.OPENAI_API_KEY) {
      groupAccessConfig.push({
        aiModelId: openAio1Preview!.id,
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    if (openAio1Mini && process.env.OPENAI_API_KEY) {
      groupAccessConfig.push({
        aiModelId: openAio1Mini!.id,
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    if (geminiPro && process.env.GEMINI_API_KEY) {
      groupAccessConfig.push({
        aiModelId: geminiPro!.id,
        apiKey: process.env.GEMINI_API_KEY,
      });
    }

    if (geminiPro15Flash && process.env.GEMINI_API_KEY) {
      groupAccessConfig.push({
        aiModelId: geminiPro15Flash!.id,
        apiKey: process.env.GEMINI_API_KEY,
      });
    }

    if (openAio11712 && process.env.OPENAI_API_KEY) {
      groupAccessConfig.push({
        aiModelId: openAio11712!.id,
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    group.set("private_access_configuration", groupAccessConfig);
    group.changed("private_access_configuration", true);

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

    const testOMiniModel = await PsAiModel.findOne({
      where: {
        name: "o1 Mini",
      },
    });

    if (!testOMiniModel) {
      const openAio1MiniConfig: PsAiModelConfiguration = {
        type: PsAiModelType.TextReasoning,
        modelSize: PsAiModelSize.Small,
        provider: "openai",
        prices: {
          costInTokensPerMillion: 3.0,
          costOutTokensPerMillion: 12.0,
          currency: "USD",
        },
        maxTokensOut: 32000,
        defaultTemperature: 0.0,
        model: "o1-mini",
        active: true,
      };

      const openAio1Mini = await PsAiModel.create({
        name: "o1 Mini",
        organization_id: 1,
        user_id: userId,
        configuration: openAio1MiniConfig,
      });
    } else {
      console.log("Test O models already exist");
    }

    const testOPreviewModel = await PsAiModel.findOne({
      where: {
        name: "o1 Preview",
      },
    });

    if (!testOPreviewModel) {
      const openAio1PreviewConfig: PsAiModelConfiguration = {
        type: PsAiModelType.TextReasoning,
        modelSize: PsAiModelSize.Medium,
        provider: "openai",
        prices: {
          costInTokensPerMillion: 15.0,
          costOutTokensPerMillion: 60.0,
          currency: "USD",
        },
        maxTokensOut: 32000,
        defaultTemperature: 0.0,
        model: "o1-preview",
        active: true,
      };

      const openAio1Preview = await PsAiModel.create({
        name: "o1 Preview",
        organization_id: 1,
        user_id: userId,
        configuration: openAio1PreviewConfig,
      });
    } else {
      console.log("Test O preview models already exist");
    }

    const testO1712Model = await PsAiModel.findOne({
      where: {
        name: "o1 24",
      },
    });

    if (!testO1712Model) {
      const openAio11712Config: PsAiModelConfiguration = {
        type: PsAiModelType.TextReasoning,
        modelSize: PsAiModelSize.Medium,
        provider: "openai",
        prices: {
          costInTokensPerMillion: 15.0,
          costOutTokensPerMillion: 60.0,
          currency: "USD",
        },
        maxTokensOut: 100000,
        defaultTemperature: 0.0,
        model: "o1-2024-12-17",
        active: true,
      };

      const openAio11712 = await PsAiModel.create({
        name: "o1 24",
        organization_id: 1,
        user_id: userId,
        configuration: openAio11712Config,
      });
    } else {
      console.log("Test o1 1712 models already exist");
    }

    const geminiProModel = await PsAiModel.findOne({
      where: {
        name: "Gemini 1.5 Pro 2",
      },
    });

    if (!geminiProModel) {
      const geminiProConfig: PsAiModelConfiguration = {
        type: PsAiModelType.Text,
        modelSize: PsAiModelSize.Medium,
        provider: "google",
        prices: {
          costInTokensPerMillion: 1.25,
          costOutTokensPerMillion: 5.0,
          currency: "USD",
        },
        maxTokensOut: 8192,
        defaultTemperature: 0.0,
        model: "gemini-1.5-pro-002",
        active: true,
      };

      const geminiPro = await PsAiModel.create({
        name: "Gemini 1.5 Pro 2",
        organization_id: 1,
        user_id: userId,
        configuration: geminiProConfig,
      });
    } else {
      console.log("Gemini 1.5 Pro 2 models already exist");
    }

    const geminiPro15FlashModel = await PsAiModel.findOne({
      where: {
        name: "Gemini 1.5 Flash 2",
      },
    });

    if (!geminiPro15FlashModel) {
      const geminiPro15FlashConfig: PsAiModelConfiguration = {
        type: PsAiModelType.Text,
        modelSize: PsAiModelSize.Small,
        provider: "google",
        prices: {
          costInTokensPerMillion: 0.075,
          costOutTokensPerMillion: 0.3,
          currency: "USD",
        },
        maxTokensOut: 8192,
        defaultTemperature: 0.0,
        model: "gemini-1.5-flash-002",
        active: true,
      };

      const geminiPro15Flash = await PsAiModel.create({
        name: "Gemini 1.5 Flash 2",
        organization_id: 1,
        user_id: userId,
        configuration: geminiPro15FlashConfig,
      });
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

    this.router.get(
      "/:groupId/:agentId/memory",
      auth.can("view group"),
      this.getAgentMemory
    );

    this.router.put(
      "/:groupId/:agentId/memory",
      auth.can("edit group"),
      this.replaceAgentMemory
    );

    this.router.post(
      "/:groupId/:agentId/:type(input|output)Connectors/existing",
      auth.can("edit group"),
      this.addExistingConnector
    );
  }

  replaceAgentMemory = async (req: YpRequest, res: express.Response) => {
    try {
      const { groupId, agentId } = req.params;
      const memory = req.body;

      console.log(
        `Attempting to replace memory for agent ${agentId} in group ${groupId}`
      );

      if (!memory || Object.keys(memory).length === 0) {
        console.log(`Received empty memory for agent ${agentId}`);
        return res.status(400).json({ error: "Cannot save empty memory" });
      }

      try {
        JSON.parse(JSON.stringify(memory));
      } catch (jsonError) {
        console.log(`Received invalid JSON for agent ${agentId}`);
        return res
          .status(400)
          .json({ error: "Invalid JSON format for memory" });
      }

      const memoryKey = await this.agentManager.getSubAgentMemoryKey(
        groupId,
        parseInt(agentId)
      );

      if (!memoryKey) {
        console.log(`Memory key not found for agent ${agentId}`);
        return res
          .status(404)
          .json({ error: "Memory key not found for the specified agent" });
      }

      console.log(`Memory key found: ${memoryKey}`);

      await req.redisClient.set(memoryKey, JSON.stringify(memory));

      console.log(`Memory contents replaced successfully`);

      res.json({ message: "Memory replaced successfully" });
    } catch (error) {
      console.error("Error replacing agent memory:", error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  };

  addExistingConnector = async (req: YpRequest, res: express.Response) => {
    const { groupId, agentId, type } = req.params;
    const { connectorId } = req.body;

    if (!groupId || !agentId || !connectorId) {
      return res
        .status(400)
        .send(
          "Group ID, agent ID and connector ID (input/output) are required"
        );
    }

    try {
      await this.agentConnectorManager.addExistingConnector(
        parseInt(groupId),
        parseInt(agentId),
        parseInt(connectorId),
        type as "input" | "output"
      );
      res
        .status(200)
        .json({
          message: `Existing ${connectorId} connector added successfully`,
        });
    } catch (error) {
      console.error(`Error adding existing ${connectorId} connector:`, error);
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

      console.log(
        `Attempting to get memory for agent ${agentId} in group ${groupId}`
      );

      // Get the memory key for the specified agent
      const memoryKey = await this.agentManager.getSubAgentMemoryKey(
        groupId,
        parseInt(agentId)
      );

      if (!memoryKey) {
        console.log(`Memory key not found for agent ${agentId}`);
        return res
          .status(404)
          .json({ error: "Memory key not found for the specified agent" });
      }

      console.log(`Memory key found: ${memoryKey}`);

      // Use the Redis client to get the memory contents
      const memoryContents = await req.redisClient.get(memoryKey);

      if (!memoryContents) {
        console.log(`Memory contents not found for key ${memoryKey}`);
        return res.status(404).json({ error: "Memory contents not found" });
      }

      console.log(`Memory contents retrieved successfully`);

      // Parse the memory contents (assuming it's stored as JSON)
      const parsedMemoryContents = JSON.parse(memoryContents);

      res.json(parsedMemoryContents);
    } catch (error) {
      console.error("Error retrieving agent memory:", error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
    }
  };

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

  getAgentCostsDetail = async (req: express.Request, res: express.Response) => {
    try {
      const agentId = parseInt(req.params.id);
      const costRows = await this.agentCostManager.getDetailedAgentCosts(
        agentId
      );
      res.json(costRows);
    } catch (error) {
      console.error("Error calculating agent costs detail:", error);
      res.status(500).send("Internal Server Error");
    }
  };
}
