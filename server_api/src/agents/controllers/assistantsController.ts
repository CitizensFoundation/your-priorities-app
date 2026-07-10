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
import { AgentQueueManager } from "@policysynth/agents/operations/agentQueueManager.js";
import { WorkflowConversationManager } from "../managers/workflowConversationManager.js";
import {
  AssistantAccessService,
  AssistantRunTransitionStatus,
  buildAssistantMemoryRedisKey,
  parsePositiveInteger,
} from "../services/assistantAccessService.js";

interface YpRequest extends express.Request<Record<string, string>> {
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
  private assistantSocketCleanupHandlers = new Map<
    string,
    { socket: WebSocket; handler: () => void }
  >();
  private agentQueueManager!: AgentQueueManager;
  private workflowConversationManager!: WorkflowConversationManager;
  private assistantAccessService!: AssistantAccessService;

  constructor(wsClients: Map<string, WebSocket>) {
    this.wsClients = wsClients;
    this.agentQueueManager = new AgentQueueManager();
    this.workflowConversationManager = new WorkflowConversationManager();
    this.assistantAccessService = new AssistantAccessService();
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

    this.router.put(
      "/:domainId/updateAssistantMemoryLoginStatus",
      auth.can("view domain"),
      auth.isLoggedInNoAnonymousCheck,
      this.updateAssistantMemoryLoginStatus.bind(this)
    );

    this.router.put(
      "/:domainId/:subscriptionId/submitAgentConfiguration",
      auth.can("view domain"),
      auth.isLoggedInNoAnonymousCheck,
      this.submitAgentConfiguration.bind(this)
    );

    this.router.get(
      "/:domainId/:subscriptionId/getConfigurationAnswers",
      auth.can("view domain"),
      auth.isLoggedInNoAnonymousCheck,
      this.getAgentConfigurationAnswers.bind(this)
    );

    this.router.get(
      "/:groupId/:runId/updatedWorkflow",
      auth.can("view group"),
      auth.isLoggedInNoAnonymousCheck,
      this.getUpdatedWorkflow.bind(this)
    );

    this.router.put(
      "/:groupId/:agentId/:runId/advanceOrStopWorkflow",
      auth.can("view group"),
      auth.isLoggedInNoAnonymousCheck,
      this.advanceOrStopCurrentWorkflowStep.bind(this)
    );

    this.router.get(
      "/:domainId/:agentId/:runId/getDocxReport",
      auth.can("view domain"),
      auth.isLoggedInNoAnonymousCheck,
      this.getDocxReport.bind(this)
    );

    this.router.get(
      "/:domainId/workflowConversations/running",
      auth.can("view domain"),
      auth.isLoggedInNoAnonymousCheck,
      this.getRunningWorkflowConversations.bind(this)
    );
    this.router.get(
      "/:domainId/workflowConversations/all",
      auth.can("view domain"),
      auth.isLoggedInNoAnonymousCheck,
      this.getAllWorkflowConversations.bind(this)
    );
    this.router.put(
      "/:domainId/workflowConversations/connect",
      auth.can("view domain"),
      auth.isLoggedInNoAnonymousCheck,
      this.connectToWorkflowConversation.bind(this)
    );
  }

  private async getLastStatusMessageFromDB(
    agentId: number
  ): Promise<string | null> {
    const status = await this.agentQueueManager.getAgentStatus(agentId);
    return status ? status.messages[status.messages.length - 1] : null;
  }

  private getDocxReport = async (
    req: YpRequest,
    res: express.Response
  ): Promise<void> => {
    try {
      const domainId = parsePositiveInteger(req.params.domainId);
      const agentId = parsePositiveInteger(req.params.agentId);
      const runId = parsePositiveInteger(req.params.runId);
      if (!domainId || !agentId || !runId) {
        res.status(400).json({ error: "Invalid request parameters" });
        return;
      }

      const agentRun = await this.assistantAccessService.getOwnedRun({
        userId: req.user.id,
        runId,
        domainId,
        agentId,
      });
      if (!agentRun) {
        res.sendStatus(404);
        return;
      }

      const lastStatusMessage = await this.getLastStatusMessageFromDB(agentId);

      if (!lastStatusMessage) {
        res.status(404).send("No status message found.");
        return;
      }

      const regex = /<markdownReport>([\s\S]*?)<\/markdownReport>/i;
      const match = lastStatusMessage ? lastStatusMessage.match(regex) : null;

      log.debug(`match: ${JSON.stringify(match, null, 2)}`);

      if (!match || match.length < 2) {
        log.error("No <markdownReport>...</markdownReport> content found.");
        res
          .status(400)
          .send("No <markdownReport>...</markdownReport> content found.");
        return;
      }

      const markdownContent = match[1];

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
    const groupId = parsePositiveInteger(req.params.groupId);
    const agentId = parsePositiveInteger(req.params.agentId);
    const runId = parsePositiveInteger(req.params.runId);
    const expectedCurrentStepIndex = Number(req.body.currentWorkflowStepIndex);
    const status = req.body.status as AssistantRunTransitionStatus;

    if (
      !groupId ||
      !agentId ||
      !runId ||
      !Number.isSafeInteger(expectedCurrentStepIndex) ||
      expectedCurrentStepIndex < 0 ||
      (status !== "completed" && status !== "failed")
    ) {
      res.status(400).json({ error: "Invalid workflow transition request" });
      return;
    }

    try {
      const result = await this.assistantAccessService.transitionOwnedRun({
        userId: req.user.id,
        runId,
        groupId,
        agentId,
        expectedCurrentStepIndex,
        status,
      });
      if (result.outcome === "not_found") {
        res.sendStatus(404);
        return;
      }
      if (result.outcome === "conflict") {
        res.status(409).json({ error: "Workflow step has already changed" });
        return;
      }
      res.status(200).json({
        workflow: result.workflow,
        status: result.status,
      });
    } catch (error) {
      log.error("Error advancing or stopping workflow:", error);
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

      const domainId = parsePositiveInteger(req.params.domainId);
      const subscriptionId = parsePositiveInteger(req.params.subscriptionId);
      if (!domainId || !subscriptionId) {
        res.status(400).json({ error: "Invalid request parameters" });
        return;
      }

      const subscription =
        await this.assistantAccessService.getOwnedSubscription(
          req.user.id,
          subscriptionId,
          domainId
        );

      if (!subscription) {
        res.status(404).json({ error: "Subscription not found" });
        return;
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
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const groupId = parsePositiveInteger(req.params.groupId);
      const runId = parsePositiveInteger(req.params.runId);
      if (!groupId || !runId) {
        res.status(400).json({ error: "Invalid request parameters" });
        return;
      }

      const agentRun = await this.assistantAccessService.getOwnedRun({
        userId,
        runId,
        groupId,
      });
      if (!agentRun) {
        res.sendStatus(404);
        return;
      }
      res.send({ workflow: agentRun.workflow, status: agentRun.status });
    } catch (error) {
      log.error("Error getting updated workflow:", error);
      res.sendStatus(500);
    }
  };

  private submitAgentConfiguration: RequestHandler<Record<string, string>> = async (
    req: YpRequest,
    res: express.Response
  ): Promise<void> => {
    log.info(
      `submitAgentConfiguration: ${JSON.stringify(req.body, null, 2)}`
    );

    const { requiredQuestionsAnswers } = req.body;
    const domainId = parsePositiveInteger(req.params.domainId);
    const subscriptionId = parsePositiveInteger(req.params.subscriptionId);
    if (
      !domainId ||
      !subscriptionId ||
      !Array.isArray(requiredQuestionsAnswers)
    ) {
      res.status(400).json({ error: "Invalid configuration request" });
      return;
    }

    try {
      const subscription =
        await this.assistantAccessService.getOwnedSubscription(
          req.user.id,
          subscriptionId,
          domainId
        );

      if (!subscription) {
        res.sendStatus(404);
        return;
      }
      subscription.configuration = {
        ...(subscription.configuration || {}),
        requiredQuestionsAnswered: requiredQuestionsAnswers,
      };
      subscription.changed("configuration", true);

      await subscription.save();
    } catch (error) {
      log.error("Error saving subscription:", error);
      res.sendStatus(500);
      return;
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

  private getMemoryRedisKey(req: YpRequest): string | null {
    const userIdentifier =
      req.body?.clientMemoryUuid || req.query.clientMemoryUuid;
    return buildAssistantMemoryRedisKey(req.params.domainId, userIdentifier);
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
    if (!redisKey) {
      res.status(400).json({ error: "Invalid assistant memory request" });
      return;
    }
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

  private cleanupAssistantForMemory(
    memoryKey: string,
    expectedAssistant?: YpAgentAssistant
  ): void {
    const currentChatAssistant = this.chatAssistantInstances.get(memoryKey);
    const currentVoiceAssistant = this.voiceAssistantInstances.get(memoryKey);
    if (
      expectedAssistant &&
      currentChatAssistant !== expectedAssistant &&
      currentVoiceAssistant !== expectedAssistant
    ) {
      return;
    }

    const cleanupRegistration =
      this.assistantSocketCleanupHandlers.get(memoryKey);
    if (cleanupRegistration) {
      cleanupRegistration.socket.removeListener(
        "close",
        cleanupRegistration.handler
      );
      cleanupRegistration.socket.removeListener(
        "error",
        cleanupRegistration.handler
      );
      this.assistantSocketCleanupHandlers.delete(memoryKey);
    }

    const assistants = new Set([
      currentChatAssistant,
      currentVoiceAssistant,
    ]);
    this.chatAssistantInstances.delete(memoryKey);
    this.voiceAssistantInstances.delete(memoryKey);

    for (const assistant of assistants) {
      if (assistant) {
        try {
          assistant.destroy();
        } catch (error) {
          log.error("Error cleaning up assistant instance:", error);
        }
      }
    }
  }

  private registerAssistantSocketCleanup(
    memoryKey: string,
    socket: WebSocket
  ): void {
    const oldRegistration = this.assistantSocketCleanupHandlers.get(memoryKey);
    if (oldRegistration) {
      oldRegistration.socket.removeListener("close", oldRegistration.handler);
      oldRegistration.socket.removeListener("error", oldRegistration.handler);
    }

    const handler = () => this.cleanupAssistantForMemory(memoryKey);
    this.assistantSocketCleanupHandlers.set(memoryKey, { socket, handler });
    socket.once("close", handler);
    socket.once("error", handler);
  }

  private async startVoiceSession(req: YpRequest, res: express.Response) {
    let assistantMemoryKey: string | undefined;
    let assistantInstance: YpAgentAssistant | undefined;
    try {
      const { wsClientId, currentMode } = req.body;
      const memory = await this.loadMemoryWithOwnership(req, res);
      if (!memory) return;
      const socket =
        typeof wsClientId === "string"
          ? this.wsClients.get(wsClientId)
          : undefined;
      if (!socket) {
        res.status(400).json({ error: "Invalid WebSocket client" });
        return;
      }
      assistantMemoryKey = memory.redisKey;
      log.info(`Starting chat session for client: ${wsClientId}`);

      this.cleanupAssistantForMemory(memory.redisKey);

      const assistant = new YpAgentAssistant(
        wsClientId,
        this.wsClients,
        req.redisClient,
        true,
        memory.redisKey,
        parseInt(req.params.domainId)
      );
      assistantInstance = assistant;

      this.voiceAssistantInstances.set(memory.redisKey, assistant);
      this.registerAssistantSocketCleanup(memory.redisKey, socket);

      await assistant.initialize();

      res.status(200).json({
        message: "Voice session initialized",
        wsClientId,
      });
    } catch (error) {
      if (assistantMemoryKey) {
        this.cleanupAssistantForMemory(assistantMemoryKey, assistantInstance);
      }
      log.error("Error starting voice session:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  private async sendChatMessage(req: YpRequest, res: express.Response) {
    let assistantMemoryKey: string | undefined;
    let assistantInstance: YpAgentAssistant | undefined;
    try {
      const memory = await this.loadMemoryWithOwnership(req, res);
      if (!memory) return; // ends early if 401/403

      const { wsClientId, chatLog, currentMode } = req.body;
      const socket =
        typeof wsClientId === "string"
          ? this.wsClients.get(wsClientId)
          : undefined;
      if (!socket) {
        res.status(400).json({ error: "Invalid WebSocket client" });
        return;
      }
      assistantMemoryKey = memory.redisKey;

      this.cleanupAssistantForMemory(memory.redisKey);

      const assistant = new YpAgentAssistant(
        wsClientId,
        this.wsClients,
        req.redisClient,
        false,
        memory.redisKey,
        parseInt(req.params.domainId)
      );
      assistantInstance = assistant;

      this.chatAssistantInstances.set(memory.redisKey, assistant);
      this.registerAssistantSocketCleanup(memory.redisKey, socket);

      void assistant.conversation(chatLog).catch((error) => {
        log.error("Error initializing chat assistant:", error);
        this.cleanupAssistantForMemory(memory.redisKey, assistant);
      });

      res.status(200).json({
        message: "Chat session initialized",
        wsClientId,
      });
    } catch (error) {
      if (assistantMemoryKey) {
        this.cleanupAssistantForMemory(assistantMemoryKey, assistantInstance);
      }
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
      const parsedWorkflowConversationId = parsePositiveInteger(
        workflowConversationId
      );
      if (
        !parsedWorkflowConversationId ||
        (connectionData !== undefined &&
          (typeof connectionData !== "object" ||
            connectionData === null ||
            Array.isArray(connectionData)))
      ) {
        res.status(400).json({ error: "Invalid workflow connection request" });
        return;
      }
      const updatedWorkflowConversation =
        await this.workflowConversationManager.connectToWorkflowConversation(
          parsedWorkflowConversationId,
          req.user.id,
          connectionData || {}
        );
      if (!updatedWorkflowConversation) {
        res.sendStatus(404);
        return;
      }
      res.status(200).json({
        success: true,
        data: updatedWorkflowConversation,
        message: `Connected to workflow conversation ${parsedWorkflowConversationId} successfully`,
      });
    } catch (error: any) {
      log.error("Error connecting to workflow conversation:", error);
      res.status(500).json({ error: error.message });
    }
  };
}
