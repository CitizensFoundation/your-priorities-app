import express from "express";
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
            const { agentProductId, subscriptionId, requiredQuestionsAnswers } = req.body;
            try {
                const memoryId = this.getMemoryUserId(req);
                // Get subscription
                const subscription = await YpSubscription.findOne({
                    where: {
                        id: subscriptionId,
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
            if (req.user && req.params.domainId) {
                try {
                    let memoryId = this.getMemoryUserId(req);
                    let redisKey = YpAgentAssistant.getRedisKey(memoryId);
                    console.log(`Starting to update login status for memoryId: ${memoryId} with user: ${req.user?.name}`);
                    let memory = (await YpAgentAssistant.loadMemoryFromRedis(memoryId));
                    if (memory) {
                        memory.currentUser = req.user;
                        await req.redisClient.set(redisKey, JSON.stringify(memory));
                        console.log(`Updated login status for memoryId: ${memoryId} with user: ${req.user?.name}`);
                    }
                    else {
                        console.error(`No memory found to update login status for id ${memoryId}`);
                    }
                    res.sendStatus(200);
                }
                catch (error) {
                    console.error("Error updating login status:", error);
                    res.sendStatus(500);
                }
            }
            else {
                res.sendStatus(401);
            }
        };
        this.defaultStartAgentMode = "agent_selection_mode";
        this.getMemoryUserId = (req) => {
            const userIdentifier = req.body.clientMemoryUuid || req.query.clientMemoryUuid;
            if (!userIdentifier) {
                throw new Error("No user identifier found");
            }
            return `${req.params.domainId}-${userIdentifier}`;
        };
        this.clearChatLog = async (req, res) => {
            try {
                const memoryId = this.getMemoryUserId(req);
                console.log(`Clearing chat log for memoryId: ${memoryId}`);
                const redisKey = YpAgentAssistant.getRedisKey(memoryId);
                const memory = (await YpAgentAssistant.loadMemoryFromRedis(memoryId));
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
                    res.sendStatus(200);
                }
                else {
                    console.warn(`No memory found to clear for id ${memoryId}`);
                    res.sendStatus(200);
                }
            }
            catch (error) {
                console.error("Error clearing chat log:", error);
                res.sendStatus(500);
            }
        };
        this.getMemory = async (req, res) => {
            let memory;
            let memoryId;
            try {
                memoryId = this.getMemoryUserId(req);
                console.log(`Getting memory for memoryId: ${memoryId}`);
                if (memoryId) {
                    memory = (await YpAgentAssistant.loadMemoryFromRedis(memoryId));
                    if (!memory) {
                        console.log(`memory not found for id ${memoryId}`);
                        memory = {
                            redisKey: YpAgentAssistant.getRedisKey(memoryId),
                            chatLog: [],
                            currentMode: this.defaultStartAgentMode,
                            modeHistory: [],
                            modeData: undefined,
                        };
                        await req.redisClient.set(memory.redisKey, JSON.stringify(memory));
                    }
                    else {
                        if (req.user && !memory.currentUser) {
                            memory.currentUser = req.user;
                            await req.redisClient.set(memory.redisKey, JSON.stringify(memory));
                        }
                        else if (!req.user && memory.currentUser) {
                            memory.currentUser = undefined;
                            await req.redisClient.set(memory.redisKey, JSON.stringify(memory));
                        }
                    }
                }
            }
            catch (error) {
                console.log(error);
                res.sendStatus(500);
                return;
            }
            if (memory) {
                res.send(memory);
            }
            else {
                console.error(`No memory found for memoryId: ${memoryId}`);
                res.send({});
            }
        };
        this.wsClients = wsClients;
        this.initializeRoutes();
        this.initializeModels();
    }
    initializeRoutes() {
        this.router.put("/:domainId/chat", auth.can("view domain"), this.sendChatMessage.bind(this));
        this.router.post("/:domainId/voice", auth.can("view domain"), this.startVoiceSession.bind(this));
        this.router.get("/:domainId/memory", auth.can("view domain"), this.getMemory.bind(this));
        this.router.delete("/:domainId/chatlog", auth.can("view domain"), this.clearChatLog.bind(this));
        this.router.put("/:domainId/updateAssistantMemoryLoginStatus", this.updateAssistantMemoryLoginStatus.bind(this));
        this.router.put("/:domainId/submitAgentConfiguration", this.submitAgentConfiguration.bind(this));
        this.router.put("/:groupId/:agentId/startWorkflowAgent", this.startWorkflowAgent.bind(this));
    }
    async startVoiceSession(req, res) {
        try {
            const { wsClientId, currentMode } = req.body;
            const memoryId = this.getMemoryUserId(req);
            console.log(`Starting chat session for client: ${wsClientId}`);
            const assistant = new YpAgentAssistant(wsClientId, this.wsClients, req.redisClient, true, parseInt(req.params.domainId), memoryId);
            await assistant.initialize();
            res.status(200).json({
                message: "Voice session initialized",
                wsClientId,
            });
        }
        catch (error) {
            console.error("Error starting chat session:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    async sendChatMessage(req, res) {
        try {
            const { wsClientId, chatLog, currentMode } = req.body;
            const memoryId = this.getMemoryUserId(req);
            console.log(`Starting chat session for client: ${wsClientId} with currentMode: ${currentMode}`);
            const assistant = new YpAgentAssistant(wsClientId, this.wsClients, req.redisClient, false, parseInt(req.params.domainId), memoryId);
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
