import express from "express";
import WebSocket from "ws";
import { marked } from "marked";
import HTMLtoDOCX from "html-to-docx";

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
import { NotificationAgentQueueManager } from "../managers/notificationAgentQueueManager.js";
import { AgentQueueManager } from "@policysynth/agents/operations/agentQueueManager.js";
import { WorkflowConversationManager } from "../managers/workflowConversationManager.js";

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
  public chatAssistantInstances = new Map<string, YpAgentAssistant>();
  public voiceAssistantInstances = new Map<string, YpAgentAssistant>();
  private agentQueueManager!: AgentQueueManager;
  private workflowConversationManager!: WorkflowConversationManager;

  constructor(wsClients: Map<string, WebSocket>) {
    this.wsClients = wsClients;
    this.agentQueueManager = new AgentQueueManager();
    this.workflowConversationManager = new WorkflowConversationManager();
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

    //TODO: Add auth for below

    this.router.put(
      "/:domainId/updateAssistantMemoryLoginStatus",
      this.updateAssistantMemoryLoginStatus.bind(this)
    );

    this.router.put(
      "/:domainId/:subscriptionId/submitAgentConfiguration",
      this.submitAgentConfiguration.bind(this)
    );

    this.router.get(
      "/:domainId/:subscriptionId/getConfigurationAnswers",
      this.getAgentConfigurationAnswers.bind(this)
    );

    this.router.put(
      "/:groupId/:agentId/startWorkflowAgent",
      this.startWorkflowAgent.bind(this)
    );

    this.router.get(
      "/:groupId/:runId/updatedWorkflow",
      this.getUpdatedWorkflow.bind(this)
    );

    this.router.post(
      "/:groupId/:agentId/startNextWorkflowStep",
      this.startNextWorkflowStep.bind(this)
    );

    this.router.post(
      "/:groupId/:agentId/stopCurrentWorkflowStep",
      this.stopCurrentWorkflowStep.bind(this)
    );

    this.router.put(
      "/:groupId/:agentId/:runId/advanceOrStopWorkflow",
      this.advanceOrStopCurrentWorkflowStep.bind(this)
    );

    this.router.get(
      "/:groupId/:agentId/getDocxReport",
      auth.can("view domain"),
      this.getDocxReport.bind(this)
    );

    this.router.get(
      "/:domainId/workflowConversations/running",
      auth.can("view domain"),
      this.getRunningWorkflowConversations.bind(this)
    );
    this.router.get(
      "/:domainId/workflowConversations/all",
      auth.can("view domain"),
      this.getAllWorkflowConversations.bind(this)
    );
    this.router.put(
      "/:domainId/workflowConversations/connect",
      auth.can("view domain"),
      this.connectToWorkflowConversation.bind(this)
    );
  }

  private async getLastStatusMessageFromDB(
    agentId: number
  ): Promise<string | null> {
    const status = await this.agentQueueManager.getAgentStatus(agentId);
    return status ? status.messages[status.messages.length - 1] : null;
  }

  private getDocxReport = async (req: YpRequest, res: express.Response) => {
    try {
      const { agentId } = req.params;

      let lastStatusMessage = await this.getLastStatusMessageFromDB(
        parseInt(agentId)
      );

      if (!lastStatusMessage) {
        return res.status(404).send("No status message found.");
      }

      const regex = /<markdownReport>([\s\S]*?)<\/markdownReport>/i;
      const match = lastStatusMessage.match(regex);

      console.debug(`match: ${JSON.stringify(match, null, 2)}`);

      if (!match || match.length < 2) {
        console.error("No <markdownReport>...</markdownReport> content found.");
        return res
          .status(400)
          .send("No <markdownReport>...</markdownReport> content found.");
      }

      const markdownContent = match[1];

      const htmlContent = await marked(markdownContent);

      const docxBuffer = (await HTMLtoDOCX(htmlContent)) as Buffer;

      console.debug(`docxBuffer: ${docxBuffer.length}`);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      res.setHeader(
        "Content-disposition",
        'attachment; filename="converted.docx"'
      );

      return res.send(docxBuffer);
    } catch (error) {
      console.error("Error converting Markdown to DOCX:", error);
      return res.status(500).send("Server error");
    }
  };

  private advanceOrStopCurrentWorkflowStep = async (
    req: YpRequest,
    res: express.Response
  ) => {
    const { groupId, agentId, runId } = req.params;
    const { status, wsClientId } = req.body;

    try {
      const notificationManager = new NotificationAgentQueueManager(
        this.wsClients
      );

      await notificationManager.advanceWorkflowStepOrCompleteAgentRun(
        parseInt(runId),
        status,
        wsClientId
      );
      res.sendStatus(200);
    } catch (error) {
      console.error("Error advancing or stopping workflow:", error);
      res.sendStatus(500);
    }
  };

  private startNextWorkflowStep = async (
    req: YpRequest,
    res: express.Response
  ) => {
    const { groupId, agentId } = req.params;

    try {
      //await this.agentQueueManager.startNextWorkflowStep(parseInt(agentId), parseInt(groupId));
      res.sendStatus(200);
    } catch (error) {
      console.error("Error starting next workflow step:", error);
      res.sendStatus(500);
    }
  };

  private stopCurrentWorkflowStep = async (
    req: YpRequest,
    res: express.Response
  ) => {
    const { groupId, agentId } = req.params;
    try {
      //await this.agentQueueManager.stopCurrentWorkflowStep(parseInt(agentId), parseInt(groupId));
      res.sendStatus(200);
    } catch (error) {
      console.error("Error stopping current workflow step:", error);
      res.sendStatus(500);
    }
  };

  public getAgentConfigurationAnswers = async (
    req: YpRequest,
    res: express.Response
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const subscriptionId = parseInt(req.params.subscriptionId);

      // Make sure the user can only fetch their own subscription
      const subscription = await YpSubscription.findOne({
        where: {
          id: subscriptionId,
          user_id: req.user.id,
        },
      });

      if (!subscription) {
        return res.status(404).json({ error: "Subscription not found" });
      }

      // Extract the requiredQuestionsAnswered from subscription.configuration
      const answers =
        subscription.configuration?.requiredQuestionsAnswered || [];

      return res.status(200).json({
        success: true,
        data: answers,
      });
    } catch (error: any) {
      console.error(
        "Error retrieving subscription agent configuration:",
        error
      );
      return res.status(500).json({ error: error.message });
    }
  };

  private getUpdatedWorkflow = async (
    req: YpRequest,
    res: express.Response
  ) => {
    const { runId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const agentRun = await YpAgentProductRun.findOne({
        where: {
          id: runId,
        },
        attributes: ["workflow", "status"],
        include: [
          {
            model: YpSubscription,
            as: "Subscription",
            attributes: ["id"],
            where: {
              user_id: userId,
            },
            required: true,
          },
        ],
      });
      res.send({ workflow: agentRun?.workflow, status: agentRun?.status });
    } catch (error) {
      console.error("Error getting updated workflow:", error);
      res.sendStatus(500);
    }
  };

  private startWorkflowAgent = async (
    req: YpRequest,
    res: express.Response
  ) => {
    const { groupId, agentId, wsClientId } = req.params;

    try {
      const notificationManager = new NotificationAgentQueueManager(
        this.wsClients
      );
      await notificationManager.startAgentProcessingWithWsClient(
        parseInt(agentId),
        parseInt(groupId),
        wsClientId
      );
      res.sendStatus(200);
    } catch (error: any) {
      console.error("Error starting agent:", error);
      res.sendStatus(500);
    }
  };

  private submitAgentConfiguration = async (
    req: YpRequest,
    res: express.Response
  ) => {
    console.log(
      `submitAgentConfiguration: ${JSON.stringify(req.body, null, 2)}`
    );

    const { requiredQuestionsAnswers } = req.body;

    const subscriptionId = parseInt(req.params.subscriptionId);

    try {
      const memoryId = this.getMemoryUserId(req);

      // Get subscription
      const subscription = await YpSubscription.findOne({
        where: {
          id: subscriptionId,
          user_id: req.user?.id, //TODO: Move to move this access check to the group level
        },
      });

      if (!subscription) {
        res.sendStatus(404);
        return;
      }
      subscription.configuration!.requiredQuestionsAnswered =
        requiredQuestionsAnswers;
      subscription.changed("configuration", true);

      await subscription.save();
    } catch (error) {
      console.error("Error saving subscription:", error);
      res.sendStatus(500);
      return;
    }

    res.sendStatus(200);
  };

  private updateAssistantMemoryLoginStatus = async (
    req: YpRequest,
    res: express.Response
  ) => {
    if (req.user && req.params.domainId) {
      try {
        let memoryId = this.getMemoryUserId(req);
        let redisKey = YpAgentAssistant.getRedisKey(memoryId);
        console.log(
          `Starting to update login status for memoryId: ${memoryId} with user: ${req.user?.name}`
        );
        let memory = (await YpAgentAssistant.loadMemoryFromRedis(
          memoryId
        )) as YpBaseAssistantMemoryData;
        if (memory) {
          memory.currentUser = req.user;
          await req.redisClient.set(redisKey, JSON.stringify(memory));

          //TODO: Check if needed, wait for 300ms to make sure redis is saved
          await new Promise((resolve) => setTimeout(resolve, 300));
          console.log(
            `Updated login status for memoryId: ${memoryId} with user: ${req.user?.name}`
          );
        } else {
          console.error(
            `No memory found to update login status for id ${memoryId}`
          );
        }
        res.sendStatus(200);
      } catch (error) {
        console.error("Error updating login status:", error);
        res.sendStatus(500);
      }
    } else {
      res.sendStatus(401);
    }
  };

  private defaultStartAgentMode: YpAssistantMode = "agent_selection_mode";

  private getMemoryUserId = (req: YpRequest) => {
    const userIdentifier =
      req.body.clientMemoryUuid || req.query.clientMemoryUuid;
    if (!userIdentifier) {
      throw new Error("No user identifier found");
    }
    return `${req.params.domainId}-${userIdentifier}`;
  };

  private clearChatLog = async (req: YpRequest, res: express.Response) => {
    try {
      const memoryId = this.getMemoryUserId(req);
      console.log(`Clearing chat log for memoryId: ${memoryId}`);
      const redisKey = YpAgentAssistant.getRedisKey(memoryId);
      const memory = (await YpAgentAssistant.loadMemoryFromRedis(
        memoryId
      )) as YpBaseAssistantMemoryData;

      if (memory) {
        if (!memory.allChatLogs) {
          memory.allChatLogs = [];
        }
        if (memory.chatLog) {
          memory.allChatLogs = [...memory.allChatLogs, ...memory.chatLog];
        }
        memory.chatLog = [];
        memory.currentMode = this.defaultStartAgentMode;
        memory.haveShownConfigurationWidget = false;
        memory.haveShownLoginWidget = false;
        memory.currentAgentStatus = undefined;
        if (!req.user) {
          memory.currentUser = undefined;
        }
        await req.redisClient.set(redisKey, JSON.stringify(memory));

        if (req.user) {
          //TODO: REMOVE THIS !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
          await YpSubscription.destroy({
            where: {
              user_id: req.user?.id,
            },
          });
        } else {
          console.warn("No user found to clear runs for");
        }
        res.sendStatus(200);
      } else {
        console.warn(`No memory found to clear for id ${memoryId}`);
        res.sendStatus(200);
      }
    } catch (error) {
      console.error("Error clearing chat log:", error);
      res.sendStatus(500);
    }
  };

  private getMemory = async (req: YpRequest, res: express.Response) => {
    let memory: YpBaseAssistantMemoryData | undefined;
    let memoryId: string | undefined;

    try {
      memoryId = this.getMemoryUserId(req);
      console.log(`Getting memory for memoryId: ${memoryId}`);
      if (memoryId) {
        memory = (await YpAgentAssistant.loadMemoryFromRedis(
          memoryId
        )) as YpBaseAssistantMemoryData;
        if (!memory) {
          console.log(`memory not found for id ${memoryId}`);
          memory = {
            redisKey: YpAgentAssistant.getRedisKey(memoryId),
            chatLog: [],
            currentMode: this.defaultStartAgentMode,
            modeHistory: [],
            modeData: undefined,
          } as YpBaseAssistantMemoryData;

          await req.redisClient.set(memory.redisKey, JSON.stringify(memory));
        } else {
          if (req.user && !memory.currentUser) {
            memory.currentUser = req.user;
          } else if (!req.user && memory.currentUser) {
            memory.currentUser = undefined;
          }

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
      const memoryId = this.getMemoryUserId(req);
      console.log(`Starting chat session for client: ${wsClientId}`);

      let oldVoiceAssistant =
        this.voiceAssistantInstances.get("voiceAssistant");

      if (oldVoiceAssistant) {
        oldVoiceAssistant.destroy();
        this.voiceAssistantInstances.delete("voiceAssistant");
      }

      let oldChatAssistant = this.chatAssistantInstances.get("mainAssistant");

      if (oldChatAssistant) {
        oldChatAssistant.destroy();
        this.chatAssistantInstances.delete("mainAssistant");
      }

      const assistant = new YpAgentAssistant(
        wsClientId,
        this.wsClients,
        req.redisClient,
        true,
        parseInt(req.params.domainId),
        memoryId
      );

      this.voiceAssistantInstances.set("voiceAssistant", assistant);

      await assistant.initialize();

      res.status(200).json({
        message: "Voice session initialized",
        wsClientId,
      });
    } catch (error) {
      console.error("Error starting voice session:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  private async sendChatMessage(req: YpRequest, res: express.Response) {
    try {
      const { wsClientId, chatLog, currentMode } = req.body;
      const memoryId = this.getMemoryUserId(req);
      console.log(
        `Starting chat session for client: ${wsClientId} with currentMode: ${currentMode}`
      );

      const oldVoiceAssistant =
        this.voiceAssistantInstances.get("voiceAssistant");

      if (oldVoiceAssistant) {
        oldVoiceAssistant.destroy();
        this.voiceAssistantInstances.delete("voiceAssistant");
      }

      const oldAssistant = this.chatAssistantInstances.get("mainAssistant");

      if (oldAssistant) {
        oldAssistant.destroy();
        this.chatAssistantInstances.delete("mainAssistant");
      }

      const assistant = new YpAgentAssistant(
        wsClientId,
        this.wsClients,
        req.redisClient,
        false,
        parseInt(req.params.domainId),
        memoryId
      );

      this.chatAssistantInstances.set("mainAssistant", assistant);

      assistant.conversation(chatLog);

      res.status(200).json({
        message: "Chat session initialized",
        wsClientId,
      });
    } catch (error) {
      console.error("Error starting chat session:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // New API endpoints for workflow management

  private getRunningWorkflowConversations = async (
    req: YpRequest,
    res: express.Response
  ) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const workflows =
        await this.workflowConversationManager.getRunningWorkflowConversationsForUser(
          req.user.id
        );
      res.status(200).json({
        success: true,
        data: { workflows },
        message: "Running workflows retrieved successfully",
      });
    } catch (error: any) {
      console.error("Error retrieving running workflows:", error);
      res.status(500).json({ error: error.message });
    }
  };

  private getAllWorkflowConversations = async (req: YpRequest, res: express.Response) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const workflows =
        await this.workflowConversationManager.getWorkflowConversationsForUser(
          req.user.id
        );
      res.status(200).json({
        success: true,
        data: { workflows },
        message: "All workflows retrieved successfully",
      });
    } catch (error: any) {
      console.error("Error retrieving all workflows:", error);
      res.status(500).json({ error: error.message });
    }
  };

  private connectToWorkflowConversation = async (req: YpRequest, res: express.Response) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { workflowConversationId, connectionData } = req.body;
      const updatedWorkflowConversation =
        await this.workflowConversationManager.connectToWorkflowConversation(
          workflowConversationId,
          connectionData || {}
        );
      res.status(200).json({
        success: true,
        data: updatedWorkflowConversation,
        message: `Connected to workflow conversation ${workflowConversationId} successfully`,
      });
    } catch (error: any) {
      console.error("Error connecting to workflow conversation:", error);
      res.status(500).json({ error: error.message });
    }
  };
}
