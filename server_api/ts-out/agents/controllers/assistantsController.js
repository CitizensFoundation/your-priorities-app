import express from "express";
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
const models = {
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
    constructor(wsClients) {
        this.path = "/api/assistants";
        this.router = express.Router();
        this.chatAssistantInstances = new Map();
        this.voiceAssistantInstances = new Map();
        this.initializeModels = async () => {
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
            }
            catch (error) {
                console.error("Error initializing models:", error);
                process.exit(1);
            }
        };
        this.getDocxReport = async (req, res) => {
            try {
                const { agentId } = req.params;
                let lastStatusMessage = await this.getLastStatusMessageFromDB(parseInt(agentId));
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
                const docxBuffer = (await HTMLtoDOCX(htmlContent));
                console.debug(`docxBuffer: ${docxBuffer.length}`);
                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
                res.setHeader("Content-disposition", 'attachment; filename="converted.docx"');
                return res.send(docxBuffer);
            }
            catch (error) {
                console.error("Error converting Markdown to DOCX:", error);
                return res.status(500).send("Server error");
            }
        };
        this.advanceOrStopCurrentWorkflowStep = async (req, res) => {
            const { groupId, agentId, runId } = req.params;
            const { status, wsClientId } = req.body;
            try {
                const notificationManager = new NotificationAgentQueueManager(this.wsClients);
                await notificationManager.advanceWorkflowStepOrCompleteAgentRun(parseInt(runId), status, wsClientId);
                res.sendStatus(200);
            }
            catch (error) {
                console.error("Error advancing or stopping workflow:", error);
                res.sendStatus(500);
            }
        };
        this.startNextWorkflowStep = async (req, res) => {
            const { groupId, agentId } = req.params;
            try {
                //await this.agentQueueManager.startNextWorkflowStep(parseInt(agentId), parseInt(groupId));
                res.sendStatus(200);
            }
            catch (error) {
                console.error("Error starting next workflow step:", error);
                res.sendStatus(500);
            }
        };
        this.stopCurrentWorkflowStep = async (req, res) => {
            const { groupId, agentId } = req.params;
            try {
                //await this.agentQueueManager.stopCurrentWorkflowStep(parseInt(agentId), parseInt(groupId));
                res.sendStatus(200);
            }
            catch (error) {
                console.error("Error stopping current workflow step:", error);
                res.sendStatus(500);
            }
        };
        this.getAgentConfigurationAnswers = async (req, res) => {
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
                const answers = subscription.configuration?.requiredQuestionsAnswered || [];
                return res.status(200).json({
                    success: true,
                    data: answers,
                });
            }
            catch (error) {
                console.error("Error retrieving subscription agent configuration:", error);
                return res.status(500).json({ error: error.message });
            }
        };
        this.getUpdatedWorkflow = async (req, res) => {
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
            }
            catch (error) {
                console.error("Error getting updated workflow:", error);
                res.sendStatus(500);
            }
        };
        this.startWorkflowAgent = async (req, res) => {
            const { groupId, agentId, wsClientId } = req.params;
            try {
                const notificationManager = new NotificationAgentQueueManager(this.wsClients);
                await notificationManager.startAgentProcessingWithWsClient(parseInt(agentId), parseInt(groupId), wsClientId);
                res.sendStatus(200);
            }
            catch (error) {
                console.error("Error starting agent:", error);
                res.sendStatus(500);
            }
        };
        this.submitAgentConfiguration = async (req, res) => {
            console.log(`submitAgentConfiguration: ${JSON.stringify(req.body, null, 2)}`);
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
                subscription.configuration.requiredQuestionsAnswered =
                    requiredQuestionsAnswers;
                subscription.changed("configuration", true);
                await subscription.save();
            }
            catch (error) {
                console.error("Error saving subscription:", error);
                res.sendStatus(500);
                return;
            }
            res.sendStatus(200);
        };
        this.updateAssistantMemoryLoginStatus = async (req, res) => {
            if (!req.user) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            try {
                const memory = await this.loadMemoryWithOwnership(req, res);
                if (!memory)
                    return; // already 401/403 if not allowed
                // Now memory is either newly created or already owned by this user (or still guest if you didn't upgrade)
                memory.currentUser = req.user;
                await req.redisClient.set(memory.redisKey, JSON.stringify(memory));
                res.sendStatus(200);
            }
            catch (error) {
                console.error("Error updating login status:", error);
                res.sendStatus(500);
            }
        };
        this.defaultStartAgentMode = "agent_selection_mode";
        this.clearChatLog = async (req, res) => {
            try {
                const memory = await this.loadMemoryWithOwnership(req, res);
                if (!memory)
                    return; // loadMemoryWithOwnership has already sent 401/403 if needed
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
                }
                else {
                    console.warn("No user found to clear runs for");
                }
                res.sendStatus(200);
            }
            catch (error) {
                console.error("Error clearing chat log:", error);
                res.sendStatus(500);
            }
        };
        this.getMemory = async (req, res) => {
            const memory = await this.loadMemoryWithOwnership(req, res);
            if (!memory)
                return;
            console.log(`Getting memory at key: ${memory.redisKey}`);
            return res.json(memory);
        };
        // New API endpoints for workflow management
        this.getRunningWorkflowConversations = async (req, res) => {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            try {
                const workflows = await this.workflowConversationManager.getRunningWorkflowConversationsForUser(req.user.id);
                res.status(200).json({
                    success: true,
                    data: { workflows },
                    message: "Running workflows retrieved successfully",
                });
            }
            catch (error) {
                console.error("Error retrieving running workflows:", error);
                res.status(500).json({ error: error.message });
            }
        };
        this.getAllWorkflowConversations = async (req, res) => {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            try {
                const workflows = await this.workflowConversationManager.getWorkflowConversationsForUser(req.user.id);
                res.status(200).json({
                    success: true,
                    data: { workflows },
                    message: "All workflows retrieved successfully",
                });
            }
            catch (error) {
                console.error("Error retrieving all workflows:", error);
                res.status(500).json({ error: error.message });
            }
        };
        this.connectToWorkflowConversation = async (req, res) => {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            try {
                const { workflowConversationId, connectionData } = req.body;
                const updatedWorkflowConversation = await this.workflowConversationManager.connectToWorkflowConversation(workflowConversationId, connectionData || {});
                res.status(200).json({
                    success: true,
                    data: updatedWorkflowConversation,
                    message: `Connected to workflow conversation ${workflowConversationId} successfully`,
                });
            }
            catch (error) {
                console.error("Error connecting to workflow conversation:", error);
                res.status(500).json({ error: error.message });
            }
        };
        this.wsClients = wsClients;
        this.agentQueueManager = new AgentQueueManager();
        this.workflowConversationManager = new WorkflowConversationManager();
        this.initializeRoutes();
        this.initializeModels();
    }
    initializeRoutes() {
        this.router.put("/:domainId/chat", auth.can("view domain"), this.sendChatMessage.bind(this));
        this.router.post("/:domainId/voice", auth.can("view domain"), this.startVoiceSession.bind(this));
        this.router.get("/:domainId/memory", auth.can("view domain"), this.getMemory.bind(this));
        this.router.delete("/:domainId/chatlog", auth.can("view domain"), this.clearChatLog.bind(this));
        //TODO: Add auth for below
        this.router.put("/:domainId/updateAssistantMemoryLoginStatus", this.updateAssistantMemoryLoginStatus.bind(this));
        this.router.put("/:domainId/:subscriptionId/submitAgentConfiguration", this.submitAgentConfiguration.bind(this));
        this.router.get("/:domainId/:subscriptionId/getConfigurationAnswers", this.getAgentConfigurationAnswers.bind(this));
        this.router.put("/:groupId/:agentId/startWorkflowAgent", this.startWorkflowAgent.bind(this));
        this.router.get("/:groupId/:runId/updatedWorkflow", this.getUpdatedWorkflow.bind(this));
        this.router.post("/:groupId/:agentId/startNextWorkflowStep", this.startNextWorkflowStep.bind(this));
        this.router.post("/:groupId/:agentId/stopCurrentWorkflowStep", this.stopCurrentWorkflowStep.bind(this));
        this.router.put("/:groupId/:agentId/:runId/advanceOrStopWorkflow", this.advanceOrStopCurrentWorkflowStep.bind(this));
        this.router.get("/:groupId/:agentId/getDocxReport", auth.can("view domain"), this.getDocxReport.bind(this));
        this.router.get("/:domainId/workflowConversations/running", auth.can("view domain"), this.getRunningWorkflowConversations.bind(this));
        this.router.get("/:domainId/workflowConversations/all", auth.can("view domain"), this.getAllWorkflowConversations.bind(this));
        this.router.put("/:domainId/workflowConversations/connect", auth.can("view domain"), this.connectToWorkflowConversation.bind(this));
    }
    async getLastStatusMessageFromDB(agentId) {
        const status = await this.agentQueueManager.getAgentStatus(agentId);
        return status ? status.messages[status.messages.length - 1] : null;
    }
    getMemoryRedisKey(req) {
        const userIdentifier = req.body.clientMemoryUuid || req.query.clientMemoryUuid;
        return `assistant:${ /*req.params.domainId*/1}:${userIdentifier}`;
    }
    async loadMemoryWithOwnership(req, res) {
        // Get the calling function name from the stack trace
        const stackTrace = new Error().stack;
        const callerLine = stackTrace?.split("\n")[2]; // First line is Error, second is current function, third is caller
        const callerMatch = callerLine?.match(/at\s+(.*)\s+\(/);
        const caller = callerMatch ? callerMatch[1] : "unknown";
        console.debug(`loadMemoryWithOwnership called by: ${caller}`);
        console.debug(`loadMemoryWithOwnership: ${JSON.stringify(req.body, null, 2)}`);
        const redisKey = this.getMemoryRedisKey(req);
        console.debug(`loadMemoryWithOwnership: redisKey: ${redisKey}`);
        try {
            const rawMemory = await req.redisClient.get(redisKey);
            let memory = rawMemory
                ? JSON.parse(rawMemory)
                : null;
            // If no memory, create new
            if (!memory) {
                console.debug(`loadMemoryWithOwnership: creating new memory`);
                memory = {
                    redisKey,
                    chatLog: [],
                    completeChatLog: [],
                    currentMode: this.defaultStartAgentMode,
                    modeHistory: [],
                    modeData: undefined,
                    ownerUserId: null,
                };
                if (req.user) {
                    console.debug(`loadMemoryWithOwnership: setting ownerUserId to ${req.user.id}`);
                    memory.ownerUserId = req.user.id;
                }
                else {
                    console.debug(`loadMemoryWithOwnership: no user in request`);
                }
                await req.redisClient.set(redisKey, JSON.stringify(memory));
                const rawAfterSet = await req.redisClient.get(redisKey);
                console.log("loadMemoryWithOwnership: After set, raw in Redis is:", rawAfterSet);
                console.debug(`loadMemoryWithOwnership: returning new memory`);
                return memory;
            }
            else {
                console.debug(`loadMemoryWithOwnership: memory already exists`);
                console.debug(`loadMemoryWithOwnership: memory: ${JSON.stringify(memory, null, 2)}`);
            }
            // If memory is owned by someone
            if (memory.ownerUserId !== null) {
                console.debug(`loadMemoryWithOwnership: memory is owned by ${memory.ownerUserId}`);
                if (!req.user) {
                    console.debug(`loadMemoryWithOwnership: no user in request`);
                    res.status(401).json({ error: "Unauthorized" });
                    return;
                }
                else {
                    console.debug(`loadMemoryWithOwnership: user in request`);
                }
                if (memory.ownerUserId !== req.user.id) {
                    console.debug(`loadMemoryWithOwnership: ownerUserId does not match ${memory.ownerUserId} !== ${req.user.id}`);
                    res.status(403).json({ error: "Forbidden" });
                    return;
                }
                else {
                    console.debug(`loadMemoryWithOwnership: ownerUserId matches ${memory.ownerUserId} === ${req.user.id}`);
                }
                // Same user => fine
                return memory;
            }
            else {
                // memory is guest
                if (req.user) {
                    // optionally upgrade
                    memory.ownerUserId = req.user.id;
                    await req.redisClient.set(redisKey, JSON.stringify(memory));
                    console.debug(`loadMemoryWithOwnership: returning memory with ownerUserId ${memory.ownerUserId}`);
                }
                else {
                    console.debug(`loadMemoryWithOwnership: returning memory with ownerUserId null`);
                }
                return memory;
            }
        }
        catch (error) {
            console.error("Error loading memory:", error);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
    }
    async startVoiceSession(req, res) {
        try {
            const { wsClientId, currentMode } = req.body;
            const memory = await this.loadMemoryWithOwnership(req, res);
            if (!memory)
                return;
            console.log(`Starting chat session for client: ${wsClientId}`);
            let oldVoiceAssistant = this.voiceAssistantInstances.get("voiceAssistant");
            if (oldVoiceAssistant) {
                oldVoiceAssistant.destroy();
                this.voiceAssistantInstances.delete("voiceAssistant");
            }
            let oldChatAssistant = this.chatAssistantInstances.get("mainAssistant");
            if (oldChatAssistant) {
                oldChatAssistant.destroy();
                this.chatAssistantInstances.delete("mainAssistant");
            }
            const assistant = new YpAgentAssistant(wsClientId, this.wsClients, req.redisClient, true, memory.redisKey, parseInt(req.params.domainId));
            this.voiceAssistantInstances.set("voiceAssistant", assistant);
            await assistant.initialize();
            res.status(200).json({
                message: "Voice session initialized",
                wsClientId,
            });
        }
        catch (error) {
            console.error("Error starting voice session:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    async sendChatMessage(req, res) {
        try {
            const memory = await this.loadMemoryWithOwnership(req, res);
            if (!memory)
                return; // ends early if 401/403
            const { wsClientId, chatLog, currentMode } = req.body;
            const oldVoiceAssistant = this.voiceAssistantInstances.get("voiceAssistant");
            if (oldVoiceAssistant) {
                oldVoiceAssistant.destroy();
                this.voiceAssistantInstances.delete("voiceAssistant");
            }
            const oldAssistant = this.chatAssistantInstances.get("mainAssistant");
            if (oldAssistant) {
                oldAssistant.destroy();
                this.chatAssistantInstances.delete("mainAssistant");
            }
            const assistant = new YpAgentAssistant(wsClientId, this.wsClients, req.redisClient, false, memory.redisKey, parseInt(req.params.domainId));
            this.chatAssistantInstances.set("mainAssistant", assistant);
            assistant.conversation(chatLog);
            res.status(200).json({
                message: "Chat session initialized",
                wsClientId,
            });
        }
        catch (error) {
            console.error("Error starting chat session:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}
