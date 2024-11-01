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
        this.wsClients = wsClients;
        this.initializeRoutes();
        this.initializeModels();
    }
    initializeRoutes() {
        this.router.put("/:domainId/chat", auth.can("view domain"), this.sendChatMessage.bind(this));
    }
    async sendChatMessage(req, res) {
        try {
            const { wsClientId, chatLog } = req.body;
            console.log(`Starting chat session for client: ${wsClientId}`);
            const assistant = new YpAgentAssistant(wsClientId, this.wsClients, req.redisClient);
            assistant.conversation(chatLog);
            res.status(200).json({
                message: "Chat session initialized",
                wsClientId
            });
        }
        catch (error) {
            console.error("Error starting chat session:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}
