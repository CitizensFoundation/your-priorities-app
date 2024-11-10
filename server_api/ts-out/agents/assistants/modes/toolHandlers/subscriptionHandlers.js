// commonTools.ts
import { YpSubscription } from "agents/models/subscription.js";
import { YpSubscriptionPlan } from "agents/models/subscriptionPlan.js";
import { YpAgentProduct } from "agents/models/agentProduct.js";
import { YpAgentProductBundle } from "agents/models/agentProductBundle.js";
import { YpAgentProductRun } from "agents/models/agentProductRun.js";
export class SubscriptionToolHandlers {
    constructor(assistant) {
        this.assistant = assistant;
    }
    get listMyAgentSubscriptionsTool() {
        return {
            name: "list_my_agent_subscriptions",
            description: "List all agent subscriptions for the current user.",
            type: "function",
            parameters: {
                type: "object",
                properties: {},
            },
            handler: this.listMyAgentSubscriptionsHandler.bind(this),
        };
    }
    async listMyAgentSubscriptionsHandler(params) {
        params = this.assistant.getCleanedParams(params);
        console.log(`handler: list_my_agent_subscriptions: ${JSON.stringify(params, null, 2)}`);
        try {
            const status = await this.loadMyAgentSubscriptions();
            if (this.assistant.DEBUG) {
                console.log(`list_my_agent_subscriptions: ${JSON.stringify(status, null, 2)}`);
            }
            let agentChips = "";
            for (const agent of status.availableAgents) {
                agentChips += `<yp-agent-chip
                  agentProductId="${agent.agentProductId}"
                  subscriptionId="${agent.subscriptionId}"
                  agentName="${agent.name}"
                  agentDescription="${agent.description}"
                  agentImageUrl="${agent.imageUrl}"
                ></yp-agent-chip>`;
            }
            let html;
            if (status.availableAgents.length > 0) {
                html = `<div class="agent-chips">${agentChips}</div>`;
            }
            else {
                this.assistant.triggerResponseIfNeeded("The user is not subscribed to any agents, offer to show available agents for purchase");
            }
            return {
                success: true,
                data: status,
                html,
                metadata: {
                    timestamp: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : "Failed to load agent status";
            console.error(`Failed to load agent status: ${errorMessage}`);
            return {
                success: false,
                data: errorMessage,
                error: errorMessage,
            };
        }
    }
    get listAllAgentsAvailableForSubscriptionTool() {
        return {
            name: "list_all_agents_available_for_subscription",
            description: "List all agent subscriptions available for purchase",
            type: "function",
            parameters: {
                type: "object",
                properties: {},
            },
            handler: this.listAllAgentsAvailableForSubscriptionHandler.bind(this),
        };
    }
    async listAllAgentsAvailableForSubscriptionHandler(params) {
        params = this.assistant.getCleanedParams(params);
        console.log(`handler: list_all_agents_available_for_purchase: ${JSON.stringify(params, null, 2)}`);
        try {
            const status = await this.loadAllAgentPlans();
            if (this.assistant.DEBUG) {
                console.log(`list_all_agents_available_for_purchase: ${JSON.stringify(status, null, 2)}`);
            }
            let agentChips = "";
            for (const agent of status.availablePlans) {
                agentChips += `<yp-agent-chip-for-purchase
          agentProductId="${agent.agentProductId}"
          subscriptionPlanId="${agent.subscriptionPlanId}"
          agentName="${agent.name}"
          agentDescription="${agent.description}"
          agentImageUrl="${agent.imageUrl}"
          price="${agent.price}"
          currency="${agent.currency}"
          maxRunsPerCycle="${agent.maxRunsPerCycle}"
        ></yp-agent-chip-for-purchase>`;
            }
            const html = `<div class="agent-chips">${agentChips}</div>`;
            return {
                success: true,
                data: status,
                html,
                metadata: {
                    timestamp: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : "Failed to load agent status";
            console.error(`Failed to load agent status: ${errorMessage}`);
            return {
                success: false,
                data: errorMessage,
                error: errorMessage,
            };
        }
    }
    async subscribeToOneOfTheAvailableAgentPlansHandler(params) {
        params = this.assistant.getCleanedParams(params);
        console.log(`handler: subscribe_to_one_of_the_available_agent_plans: ${JSON.stringify(params, null, 2)}`);
        try {
            if (!params.useHasVerballyConfirmedSubscribeWithTheAgentName) {
                return {
                    success: false,
                    error: "User must confirm subscription with the agent name before proceeding",
                };
            }
            const result = await this.subscribeToAgentPlan(params.agentProductId, params.subscriptionPlanId);
            if (!result.success) {
                return {
                    success: false,
                    error: result.error,
                };
            }
            const agentPlans = await this.loadAllAgentPlans();
            const agent = agentPlans.availablePlans.find((a) => a.subscriptionPlanId === result.subscriptionPlanId);
            let html;
            if (agent) {
                html = `<div class="agent-chips"><yp-agent-chip-for-purchase
          isSubscribed="${true}"
          agentProductId="${agent.agentProductId}"
          subscriptionPlanId="${result.subscriptionPlanId}"
          agentName="${agent.name}"
          agentDescription="${agent.description}"
          agentImageUrl="${agent.imageUrl}"
          price="${agent.price}"
          currency="${agent.currency}"
          maxRunsPerCycle="${agent.maxRunsPerCycle}"
        ></yp-agent-chip-for-purchase></div>`;
            }
            this.assistant.triggerResponseIfNeeded("Successfully subscribed to agent plan");
            return {
                success: true,
                html,
                data: {
                    message: "Successfully subscribed to agent plan",
                    subscriptionId: result.subscriptionId,
                },
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : "Failed to subscribe to agent";
            console.error(`Failed to subscribe to agent: ${errorMessage}`);
            return {
                success: false,
                error: errorMessage,
            };
        }
    }
    async unsubscribeFromOneOfMySubscribedAgentsHandler(params) {
        params = this.assistant.getCleanedParams(params);
        console.log(`handler: unsubscribe_from_one_of_my_subscribed_agents: ${JSON.stringify(params, null, 2)}`);
        try {
            if (!params.useHasVerballyConfirmedUnsubscribeWithTheAgentName) {
                return {
                    success: false,
                    error: "User must verbally confirm unsubscription with the agent name before proceeding",
                };
            }
            const agent = await this.validateAndSelectAgent(params.agentProductId);
            const result = await this.unsubscribeFromAgentPlan(params.subscriptionId);
            if (!result.success) {
                return {
                    success: false,
                    error: result.error,
                };
            }
            const html = `<div class="agent-chips"><yp-agent-chip
        isUnsubscribed="${true}"
        agentProductId="${agent.agentProductId}"
        subscriptionId="${params.subscriptionId}"
        agentName="${agent.name}"
        agentDescription="${agent.description}"
        agentImageUrl="${agent.imageUrl}"
    ></yp-agent-chip></div>`;
            this.assistant.triggerResponseIfNeeded("Successfully unsubscribed from agent subscription");
            return {
                success: true,
                html,
                data: {
                    message: "Successfully unsubscribed from agent subscription",
                    subscriptionId: result.subscriptionId,
                },
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : "Failed to unsubscribe from agent";
            console.error(`Failed to unsubscribe from agent: ${errorMessage}`);
            return {
                success: false,
                error: errorMessage,
            };
        }
    }
    async loadAllAgentPlans() {
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
    async loadMyAgentSubscriptions() {
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
