import express, { RequestHandler } from "express";
import WebSocket from "ws";
import { marked } from "marked";
import HTMLtoDOCX from "html-to-docx";
import log from "../../utils/loggerTs.js";
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
      log.info(`All Models Loaded Init`);

      // Call associate method to set up associations
      for (const modelName of Object.keys(models)) {
        if (models[modelName].associate) {
          await models[modelName].associate(sequelize.models);
          //await models[modelName].associate(models);
        }
      }

      log.info("All agentmodels initialized successfully.");
    } catch (error) {
      log.error("Error initializing models:", error);
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

  private getDocxReport = async (req: YpRequest, res: express.Response): Promise<void> => {
    try {
      const { agentId } = req.params;

      let lastStatusMessage = await this.getLastStatusMessageFromDB(
        parseInt(agentId)
      );

      if (!lastStatusMessage) {
        res.status(404).send("No status message found.");
      }

      const regex = /<markdownReport>([\s\S]*?)<\/markdownReport>/i;
      const match = lastStatusMessage ? lastStatusMessage.match(regex) : null;

      log.debug(`match: ${JSON.stringify(match, null, 2)}`);

      if (!match || match.length < 2) {
        log.error("No <markdownReport>...</markdownReport> content found.");
        res
          .status(400)
          .send("No <markdownReport>...</markdownReport> content found.");
      }

      const markdownContent = match ? match[1] : null ;

      if (!markdownContent) {
        log.error("No markdown content found.");
        res.status(400).send("No markdown content found.");
        return;
      }

      const htmlContent = await marked(markdownContent);

      const docxBuffer = (await HTMLtoDOCX(htmlContent)) as Buffer;

      log.debug(`docxBuffer: ${docxBuffer.length}`);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      res.setHeader(
        "Content-disposition",
        'attachment; filename="converted.docx"'
      );

      res.send(docxBuffer);
    } catch (error) {
      log.error("Error converting Markdown to DOCX:", error);
      res.status(500).send("Server error");
    }
  };

  private advanceOrStopCurrentWorkflowStep = async (
    req: YpRequest,
    res: express.Response
  ): Promise<void> => {
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
      log.error("Error advancing or stopping workflow:", error);
      res.sendStatus(500);
    }
  };

  private startNextWorkflowStep = async (
    req: YpRequest,
    res: express.Response
  ): Promise<void> => {
    const { groupId, agentId } = req.params;

    try {
      //await this.agentQueueManager.startNextWorkflowStep(parseInt(agentId), parseInt(groupId));
      res.sendStatus(200);
    } catch (error) {
      log.error("Error starting next workflow step:", error);
      res.sendStatus(500);
    }
  };

  private stopCurrentWorkflowStep = async (
    req: YpRequest,
    res: express.Response
  ): Promise<void> => {
    const { groupId, agentId } = req.params;
    try {
      //await this.agentQueueManager.stopCurrentWorkflowStep(parseInt(agentId), parseInt(groupId));
      res.sendStatus(200);
    } catch (error) {
      log.error("Error stopping current workflow step:", error);
      res.sendStatus(500);
    }
  };

  public getAgentConfigurationAnswers = async (
    req: YpRequest,
    res: express.Response
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
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
        res.status(404).json({ error: "Subscription not found" });
      }

      // Extract the requiredQuestionsAnswered from subscription.configuration
      const answers =
        subscription?.configuration?.requiredQuestionsAnswered || [];

      res.status(200).json({
        success: true,
        data: answers,
      });
    } catch (error: any) {
      log.error(
        "Error retrieving subscription agent configuration:",
        error
      );
      res.status(500).json({ error: error.message });
    }
  };

  private getUpdatedWorkflow = async (
    req: YpRequest,
    res: express.Response
  ): Promise<void> => {
    const { runId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
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
      log.error("Error getting updated workflow:", error);
      res.sendStatus(500);
    }
  };

  private startWorkflowAgent = async (
    req: YpRequest,
    res: express.Response
  ): Promise<void> => {
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
      log.error("Error starting agent:", error);
      res.sendStatus(500);
    }
  };

  private submitAgentConfiguration: RequestHandler = async (
    req: YpRequest,
    res: express.Response
  ): Promise<void> => {
    log.info(
      `submitAgentConfiguration: ${JSON.stringify(req.body, null, 2)}`
    );

    const { requiredQuestionsAnswers } = req.body;

    const subscriptionId = parseInt(req.params.subscriptionId);

    try {
      const memoryId = this.getMemoryRedisKey(req);

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
      log.error("Error saving subscription:", error);
      res.sendStatus(500);
    }

    res.sendStatus(200);
  };

  private updateAssistantMemoryLoginStatus = async (
    req: YpRequest,
    res: express.Response
  ): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    try {
      const memory = await this.loadMemoryWithOwnership(req, res);
      if (!memory) return; // already 401/403 if not allowed

      // Now memory is either newly created or already owned by this user (or still guest if you didn't upgrade)
      memory!.currentUser = req.user;
      await req.redisClient.set(memory!.redisKey, JSON.stringify(memory));

      res.sendStatus(200);
    } catch (error) {
      log.error("Error updating login status:", error);
      res.sendStatus(500);
    }
  };

  private defaultStartAgentMode: YpAssistantMode = "agent_selection_mode";

  private getMemoryRedisKey(req: YpRequest) {
    const userIdentifier =
      req.body.clientMemoryUuid || req.query.clientMemoryUuid;
    return `assistant:${/*req.params.domainId*/ 1}:${userIdentifier}`;
  }

  private async loadMemoryWithOwnership(
    req: YpRequest,
    res: express.Response
  ): Promise<YpBaseAssistantMemoryData | undefined> {
    // Get the calling function name from the stack trace
    const stackTrace = new Error().stack;
    const callerLine = stackTrace?.split("\n")[2]; // First line is Error, second is current function, third is caller
    const callerMatch = callerLine?.match(/at\s+(.*)\s+\(/);
    const caller = callerMatch ? callerMatch[1] : "unknown";
    log.debug(`loadMemoryWithOwnership called by: ${caller}`);
    log.debug(
      `loadMemoryWithOwnership: ${JSON.stringify(req.body, null, 2)}`
    );
    const redisKey = this.getMemoryRedisKey(req);
    log.debug(`loadMemoryWithOwnership: redisKey: ${redisKey}`);

    try {
      const rawMemory = await req.redisClient.get(redisKey);
      let memory: YpBaseAssistantMemoryData | null = rawMemory
        ? JSON.parse(rawMemory)
        : null;

      // If no memory, create new
      if (!memory) {
        log.debug(`loadMemoryWithOwnership: creating new memory`);
        memory = {
          redisKey,
          chatLog: [],
          completeChatLog: [],
          currentMode: this.defaultStartAgentMode,
          modeHistory: [],
          modeData: undefined,
          ownerUserId: null,
        } as YpBaseAssistantMemoryData;
        if (req.user) {
          log.debug(
            `loadMemoryWithOwnership: setting ownerUserId to ${req.user.id}`
          );
          memory.ownerUserId = req.user.id;
        } else {
          log.debug(`loadMemoryWithOwnership: no user in request`);
        }
        await req.redisClient.set(redisKey, JSON.stringify(memory));
        const rawAfterSet = await req.redisClient.get(redisKey);
        log.info(
          "loadMemoryWithOwnership: After set, raw in Redis is:",
          rawAfterSet
        );
        log.debug(`loadMemoryWithOwnership: returning new memory`);
        return memory;
      } else {
        log.debug(`loadMemoryWithOwnership: memory already exists`);
        log.debug(
          `loadMemoryWithOwnership: memory: ${JSON.stringify(memory, null, 2)}`
        );
      }

      // If memory is owned by someone
      if (memory.ownerUserId !== null) {
        log.debug(
          `loadMemoryWithOwnership: memory is owned by ${memory.ownerUserId}`
        );
        if (!req.user) {
          log.debug(`loadMemoryWithOwnership: no user in request`);
          res.status(401).json({ error: "Unauthorized" });
          return;
        } else {
          log.debug(`loadMemoryWithOwnership: user in request`);
        }
        if (memory.ownerUserId !== req.user.id) {
          log.debug(
            `loadMemoryWithOwnership: ownerUserId does not match ${memory.ownerUserId} !== ${req.user.id}`
          );
          res.status(403).json({ error: "Forbidden" });
          return;
        } else {
          log.debug(
            `loadMemoryWithOwnership: ownerUserId matches ${memory.ownerUserId} === ${req.user.id}`
          );
        }
        // Same user => fine
        return memory;
      } else {
        // memory is guest
        if (req.user) {
          // optionally upgrade
          memory.ownerUserId = req.user.id;
          await req.redisClient.set(redisKey, JSON.stringify(memory));
          log.debug(
            `loadMemoryWithOwnership: returning memory with ownerUserId ${memory.ownerUserId}`
          );
        } else {
          log.debug(
            `loadMemoryWithOwnership: returning memory with ownerUserId null`
          );
        }
        return memory;
      }
    } catch (error: any) {
      log.error("Error loading memory:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
  }

  private clearChatLog = async (req: YpRequest, res: express.Response) => {
    try {
      const memory = await this.loadMemoryWithOwnership(req, res);
      if (!memory) return; // loadMemoryWithOwnership has already sent 401/403 if needed

      // Now we know this request is allowed to see/modify the memory
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

      if (!req.user && memory.ownerUserId === null) {
        memory.currentUser = undefined;
      }

      await req.redisClient.set(memory.redisKey, JSON.stringify(memory));

      if (req.user) {
        //TODO: REMOVE THIS when we have multi workflows
        await YpSubscription.destroy({
          where: {
            user_id: req.user?.id,
          },
        });
      } else {
        log.warn("No user found to clear runs for");
      }

      res.sendStatus(200);
    } catch (error) {
      log.error("Error clearing chat log:", error);
      res.sendStatus(500);
    }
  };

  private getMemory = async (req: YpRequest, res: express.Response) => {
    const memory = await this.loadMemoryWithOwnership(req, res);
    if (!memory) return;
    log.info(`Getting memory at key: ${memory.redisKey}`);

    res.json(memory);
  };

  private async startVoiceSession(req: YpRequest, res: express.Response) {
    try {
      const { wsClientId, currentMode } = req.body;
      const memory = await this.loadMemoryWithOwnership(req, res);
      if (!memory) return;
      log.info(`Starting chat session for client: ${wsClientId}`);

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
        memory.redisKey,
        parseInt(req.params.domainId)
      );

      this.voiceAssistantInstances.set("voiceAssistant", assistant);

      await assistant.initialize();

      res.status(200).json({
        message: "Voice session initialized",
        wsClientId,
      });
    } catch (error) {
      log.error("Error starting voice session:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  private async sendChatMessage(req: YpRequest, res: express.Response) {
    try {
      const memory = await this.loadMemoryWithOwnership(req, res);
      if (!memory) return; // ends early if 401/403

      const { wsClientId, chatLog, currentMode } = req.body;

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
        memory.redisKey,
        parseInt(req.params.domainId)
      );

      this.chatAssistantInstances.set("mainAssistant", assistant);

      assistant.conversation(chatLog);

      res.status(200).json({
        message: "Chat session initialized",
        wsClientId,
      });
    } catch (error) {
      log.error("Error starting chat session:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // New API endpoints for workflow management

  private getRunningWorkflowConversations = async (
    req: YpRequest,
    res: express.Response
  ): Promise<void> => {
    if (!req.user || !req.user.id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
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
      log.error("Error retrieving running workflows:", error);
      res.status(500).json({ error: error.message });
    }
  };

  private getAllWorkflowConversations = async (
    req: YpRequest,
    res: express.Response
  ): Promise<void> => {
    if (!req.user || !req.user.id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
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
      log.error("Error retrieving all workflows:", error);
      res.status(500).json({ error: error.message });
    }
  };

  private connectToWorkflowConversation = async (
    req: YpRequest,
    res: express.Response
  ): Promise<void> => {
    if (!req.user || !req.user.id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
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
      log.error("Error connecting to workflow conversation:", error);
      res.status(500).json({ error: error.message });
    }
  };
}
