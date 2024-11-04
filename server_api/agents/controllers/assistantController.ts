import express from "express";
import WebSocket from "ws";
import auth from "../../authorization.cjs";
import { YpAgentAssistant } from "../assistants/agentAssistant.js";
import { YpAgentProductBundle } from "../models/agentProductBundle.js";
import { YpAgentProductRun } from "../models/agentProductRun.js";
import { YpAgentProduct } from "../models/agentProduct.js";
import { YpAgentProductBoosterPurchase } from "../models/agentProductBoosterPurchase.js";
import { YpSubscription } from "../models/subscription.js";
import { YpSubscriptionPlan } from "../models/subscriptionPlan.js";
import { YpSubscriptionUser } from "../models/subscriptionUser.js";
import { YpDiscount } from "../models/discount.js";
import { sequelize } from "@policysynth/agents/dbModels/index.js";

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

const models: Models = {
  YpAgentProduct,
  YpAgentProductBundle,
  YpAgentProductBoosterPurchase,
  YpAgentProductRun,
  YpSubscription,
  YpSubscriptionPlan,
  YpSubscriptionUser,
  YpDiscount,
};

export class AssistantController {
  public path = "/api/assistants";
  public router = express.Router();
  public wsClients: Map<string, WebSocket>;

  constructor(wsClients: Map<string, WebSocket>) {
    this.wsClients = wsClients;
    this.initializeRoutes();
    this.initializeModels();
  }

  initializeModels = async () => {
    try {
      console.log(`All Models Loaded Init`);

      // Call associate method to set up associations
      for (const modelName of Object.keys(models)) {
        if (models[modelName].associate) {
          await models[modelName].associate(sequelize.models);
          //await models[modelName].associate(models);
        }
      }

      console.log("All agentmodels initialized successfully.");
    } catch (error) {
      console.error("Error initializing models:", error);
      process.exit(1);
    }
  };

  public initializeRoutes() {
    this.router.put(
      "/:domainId/chat",
      auth.can("view domain"),
      this.sendChatMessage.bind(this)
    );

    this.router.post(
      "/:domainId/voice",
      auth.can("view domain"),
      this.startVoiceSession.bind(this)
    );

    this.router.get(
      "/:domainId/memory",
      auth.can("view domain"),
      this.getMemory.bind(this)
    );

    this.router.delete(
      "/:domainId/chatlog",
      auth.can("view domain"),
      this.clearChatLog.bind(this)
    );
  }

  private defaultStartAgentMode = "agent_subscription_and_selection" as YpAssistantMode;

  private clearChatLog = async (req: YpRequest, res: express.Response) => {
    const memoryId = `${req.params.domainId}-${req.user.id}`;
    console.log(`Clearing chat log for memoryId: ${memoryId}`);

    try {
      const redisKey = YpAgentAssistant.getRedisKey(memoryId);
      const memory = await YpAgentAssistant.loadMemoryFromRedis(memoryId) as YpBaseAssistantMemoryData;

      if (memory) {
        memory.chatLog = [];
        memory.currentMode = this.defaultStartAgentMode;
        memory.currentAgentProductConfiguration = undefined;
        memory.currentAgentProductId = undefined;
        await req.redisClient.set(redisKey, JSON.stringify(memory));
        res.sendStatus(200);
      } else {
        console.warn(`No memory found to clear for id ${memoryId}`);
        res.sendStatus(200);
      }
    } catch (error) {
      console.error("Error clearing chat log:", error);
      res.sendStatus(500);
    }
  }

  private getMemory = async (req: YpRequest, res: express.Response) => {
    const memoryId = `${req.params.domainId}-${req.user.id}`;
    console.log(`Getting memory for memoryId: ${memoryId}`);

    let memory: YpBaseAssistantMemoryData | undefined;

    try {
      if (memoryId) {
        memory = await YpAgentAssistant.loadMemoryFromRedis(memoryId) as YpBaseAssistantMemoryData;
        if (!memory) {
          console.log(`memory not found for id ${memoryId}`)
          memory = {
            redisKey: YpAgentAssistant.getRedisKey(memoryId),
            chatLog: [],
            currentMode: this.defaultStartAgentMode,
            modeHistory: [],
            modeData: undefined
          } as YpBaseAssistantMemoryData;

          await req.redisClient.set(memory.redisKey, JSON.stringify(memory));
        }
      }
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
      return;
    }

    if (memory) {
      res.send(memory);
    } else {
      console.error(`No memory found for memoryId: ${memoryId}`);
      res.send({});
    }
  };

  private async startVoiceSession(req: YpRequest, res: express.Response) {
    try {
      const { wsClientId, currentMode } = req.body;
      const domainId = parseInt(req.params.domainId);
      const memoryId = `${domainId}-${req.user.id}`;
      console.log(`Starting chat session for client: ${wsClientId}`);

      const assistant = new YpAgentAssistant(wsClientId, this.wsClients, req.redisClient, true, currentMode, domainId, memoryId, req.user.id);

      await assistant.initialize();

      res.status(200).json({
        message: "Voice session initialized",
        wsClientId
      });
    } catch (error) {
      console.error("Error starting chat session:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  private async sendChatMessage(req: YpRequest, res: express.Response) {
    try {
      const { wsClientId, chatLog, currentMode } = req.body;
      const domainId = parseInt(req.params.domainId);
      const memoryId = `${domainId}-${req.user.id}`;
      console.log(`Starting chat session for client: ${wsClientId} with currentMode: ${currentMode}`);

      const assistant = new YpAgentAssistant(wsClientId, this.wsClients, req.redisClient, false, currentMode, domainId, memoryId, req.user.id);

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
