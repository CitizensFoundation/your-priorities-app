import { YpSubscription } from "../../../../models/subscription.js";
import { YpSubscriptionPlan } from "../../../../models/subscriptionPlan.js";
import { YpAgentProduct } from "../../../../models/agentProduct.js";
import { YpAgentProductBundle } from "../../../../models/agentProductBundle.js";
import { YpAgentProductRun } from "../../../../models/agentProductRun.js";
export class SubscriptionModels {
    constructor(assistant) {
        this.assistant = assistant;
    }
    async loadAgentSubscriptionPlans() {
        try {
            const firstBundle = await YpAgentProductBundle.findOne({
                where: {
                //TODO: get working
                //domain_id: this.domainId,
                },
            });
            // Get all available subscription plans with their associated agent products
            const availablePlans = await YpSubscriptionPlan.findAll({
                where: {
                //  status: 'active', // Only get active plans
                },
                include: [
                    {
                        model: YpAgentProduct,
                        as: "AgentProduct",
                        attributes: {
                            exclude: ["created_at", "updated_at"],
                        },
                        include: [
                            {
                                model: YpAgentProductBundle,
                                as: "AgentBundles",
                                required: false,
                                attributes: {
                                    exclude: ["created_at", "updated_at"],
                                },
                            },
                        ],
                    },
                ],
            });
            console.log(`-----------XXXXXXXXXXXXXXXx----------_> ${JSON.stringify(availablePlans, null, 2)}`);
            return {
                availablePlans: availablePlans.map((plan) => ({
                    agentProductId: plan.AgentProduct?.id || 0,
                    subscriptionPlanId: plan.id,
                    name: plan.AgentProduct?.name || plan.name,
                    description: plan.AgentProduct?.description || "No description available",
                    imageUrl: plan.configuration?.imageUrl || "",
                    price: plan.configuration?.amount || 0,
                    currency: plan.configuration?.currency || "USD",
                    maxRunsPerCycle: plan.configuration?.max_runs_per_cycle || 0,
                })),
                availableBundle: firstBundle
                    ? {
                        agentBundleId: firstBundle.id,
                        name: firstBundle.name,
                        description: firstBundle.description || "",
                        imageUrl: firstBundle.configuration?.imageUrl || "",
                    }
                    : "No bundle available",
                systemStatus: {
                    healthy: true,
                    lastUpdated: new Date(),
                },
            };
        }
        catch (error) {
            console.error("Error loading available subscription plans:", error);
            return {
                availablePlans: [],
                availableBundle: "No bundle available",
                systemStatus: {
                    healthy: false,
                    lastUpdated: new Date(),
                    error: error instanceof Error ? error.message : "Unknown error",
                },
            };
        }
    }
    async loadAgentProductAndSubscription(agentProductId) {
        const agent = (await YpAgentProduct.findByPk(agentProductId));
        if (!agent) {
            throw new Error(`Agent product with id ${agentProductId} not found`);
        }
        const subscription = (await YpSubscription.findOne({
            where: {
                agent_product_id: agentProductId,
            },
        }));
        return { agent, subscription };
    }
    async loadUserAgentSubscriptions() {
        try {
            // Get available agent products from user's subscriptions for their domain
            const availableAgents = await YpSubscription.findAll({
                where: {
                    //domain_id: this.domainId, //TODO: get working
                    status: "active", // Only get active subscriptions
                },
                include: [
                    {
                        model: YpSubscriptionPlan,
                        as: "Plan",
                    },
                    {
                        model: YpAgentProduct,
                        as: "AgentProduct",
                        attributes: {
                            exclude: ["created_at", "updated_at"],
                        },
                        include: [
                            {
                                model: YpAgentProductBundle,
                                as: "AgentBundles",
                                required: false,
                                attributes: {
                                    exclude: ["created_at", "updated_at"],
                                },
                            },
                        ],
                    },
                ],
            });
            // Get currently running agents for the domain
            const runningAgents = await YpAgentProductRun.findAll({
                where: {
                    //domain_id: this.domainId, //TODO: get working
                    status: "running",
                },
                include: [
                    {
                        model: YpSubscription,
                        as: "Subscription",
                        //where: {
                        //  domain_id: this.domainId
                        //},
                        include: [
                            {
                                model: YpAgentProduct,
                                as: "AgentProduct",
                            },
                            {
                                model: YpSubscriptionPlan,
                                as: "Plan",
                            },
                        ],
                    },
                ],
            });
            return {
                availableAgents: availableAgents.map((subscription) => ({
                    agentProductId: subscription.AgentProduct.id,
                    subscriptionId: subscription.id,
                    name: subscription.AgentProduct.name,
                    description: subscription.AgentProduct.description,
                    imageUrl: subscription.Plan.configuration.imageUrl || "",
                    isRunning: runningAgents.some((run) => run.Subscription?.AgentProduct?.id ===
                        subscription.AgentProduct.id),
                })),
                runningAgents: runningAgents.map((run) => ({
                    runId: run.id,
                    agentProductId: run.Subscription?.AgentProduct?.id || 0,
                    agentRunId: run.id,
                    agentName: run.Subscription?.AgentProduct?.name || "",
                    startTime: run.start_time,
                    status: run.status,
                    workflow: run.workflow,
                    subscriptionId: run.subscription_id,
                })),
                systemStatus: {
                    healthy: true,
                    lastUpdated: new Date(),
                },
            };
        }
        catch (error) {
            console.error("Error loading agent status:", error);
            return {
                availableAgents: [],
                runningAgents: [],
                systemStatus: {
                    healthy: false,
                    lastUpdated: new Date(),
                    error: error instanceof Error ? error.message : "Unknown error",
                },
            };
        }
    }
    async unsubscribeFromAgentPlan(subscriptionId) {
        try {
            const subscription = await YpSubscription.findOne({
                where: {
                    id: subscriptionId,
                    domain_id: this.assistant.domainId,
                    status: "active",
                },
            });
            if (!subscription) {
                return {
                    success: false,
                    error: "Subscription not found or already inactive",
                };
            }
            subscription.status = "cancelled";
            subscription.configuration = {
                cancelledAt: new Date(),
                cancelledByUserId: this.assistant.userId,
            };
            subscription.end_date = new Date();
            subscription.changed("configuration", true);
            await subscription.save();
            return {
                success: true,
                subscriptionId: subscription.id,
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : "Failed to unsubscribe from agent plan";
            console.error(`Database error in unsubscribeFromAgentPlan: ${errorMessage}`);
            return {
                success: false,
                error: errorMessage,
            };
        }
    }
    async subscribeToAgentPlan(agentProductId, subscriptionPlanId) {
        try {
            const plan = await YpSubscriptionPlan.findByPk(subscriptionPlanId);
            if (!plan) {
                return {
                    success: false,
                    error: "Subscription plan not found",
                };
            }
            const subscription = await YpSubscription.create({
                subscription_plan_id: subscriptionPlanId,
                agent_product_id: agentProductId,
                user_id: this.assistant.userId,
                domain_id: this.assistant.domainId,
                next_billing_date: new Date(),
                status: "active",
                start_date: new Date(),
                configuration: plan.configuration,
            });
            return {
                success: true,
                subscriptionId: subscription.id,
                subscriptionPlanId: subscriptionPlanId,
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : "Failed to subscribe to agent plan";
            console.error(`Database error in subscribeToAgentPlan: ${errorMessage}`);
            return {
                success: false,
                error: errorMessage,
            };
        }
    }
}
