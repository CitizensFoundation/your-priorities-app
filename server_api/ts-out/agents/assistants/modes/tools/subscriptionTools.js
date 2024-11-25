// commonTools.ts
import { SubscriptionModels } from "./models/subscriptions.js";
import { BaseAssistantTools } from "./baseTools.js";
export class SubscriptionTools extends BaseAssistantTools {
    constructor(assistant) {
        super(assistant);
        this.subscriptionModels = new SubscriptionModels(assistant);
    }
    get listMyAgentSubscriptions() {
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
            const status = await this.subscriptionModels.loadUserAgentSubscriptions();
            if (this.assistant.DEBUG) {
                console.log(`list_my_agent_subscriptions: ${JSON.stringify(status, null, 2)}`);
            }
            let agentChips = "";
            for (const subscription of status.availableSubscriptions) {
                agentChips += `<div class="agent-chips"><yp-agent-chip-for-purchase
          isSubscribed="${true}"
          agentProductId="${subscription.Plan?.AgentProduct?.id}"
          subscriptionPlanId="${subscription.Plan?.id}"
          agentName="${subscription.Plan?.AgentProduct?.name}"
          agentDescription="${subscription.Plan?.AgentProduct?.description}"
          agentImageUrl="${subscription.Plan?.AgentProduct?.configuration.avatar?.imageUrl}"
          price="${subscription.Plan?.configuration.amount}"
          currency="${subscription.Plan?.configuration.currency}"
          maxRunsPerCycle="${subscription.Plan?.configuration.max_runs_per_cycle}"
        ></yp-agent-chip-for-purchase></div>`;
            }
            let html;
            if (status.availableSubscriptions.length > 0) {
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
            const errorMessage = error instanceof Error ? error.message : "Failed to load agent status";
            console.error(`Failed to load agent status: ${errorMessage}`);
            return {
                success: false,
                data: errorMessage,
                error: errorMessage,
            };
        }
    }
    get listAllAgentsAvailableForSubscription() {
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
            const status = await this.subscriptionModels.loadAgentSubscriptionPlans();
            if (this.assistant.DEBUG) {
                console.log(`list_all_agents_available_for_purchase: ${JSON.stringify(status, null, 2)}`);
            }
            let agentChips = "";
            for (const agent of status.availablePlans) {
                agentChips += `<yp-agent-chip-for-purchase
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
            const errorMessage = error instanceof Error ? error.message : "Failed to load agent status";
            console.error(`Failed to load agent status: ${errorMessage}`);
            return {
                success: false,
                data: errorMessage,
                error: errorMessage,
            };
        }
    }
    get subscribeToCurrentAgentPlan() {
        return {
            name: "subscribe_to_current_agent_plan",
            description: "Subscribe to the current agent plan. User must confirm subscription with the agent name before proceeding.",
            type: "function",
            parameters: {
                type: "object",
                properties: {
                    useHasVerballyConfirmedSubscribeWithTheAgentName: {
                        type: "boolean",
                    },
                },
                required: [
                    "useHasVerballyConfirmedSubscribeWithTheAgentName",
                ],
            },
            handler: this.subscribeToCurrentAgentPlanHandler.bind(this),
        };
    }
    async subscribeToCurrentAgentPlanHandler(params) {
        params = this.assistant.getCleanedParams(params);
        console.log(`handler: subscribe_to_current_agent_plan: ${JSON.stringify(params, null, 2)}`);
        try {
            if (!params.useHasVerballyConfirmedSubscribeWithTheAgentName) {
                return {
                    success: false,
                    error: "User must confirm subscription with the agent name before proceeding",
                };
            }
            console.log(`-------> ${JSON.stringify(this.assistant.memory.currentAgentStatus, null, 2)}`);
            if (!this.assistant.memory.currentAgentStatus ||
                !this.assistant.memory.currentAgentStatus.subscriptionPlan) {
                return {
                    success: false,
                    data: "No current agent selected",
                    error: "No current agent selected",
                };
            }
            const result = await this.subscriptionModels.subscribeToAgentPlan(this.assistant.memory.currentAgentStatus?.subscriptionPlan.AgentProduct
                .id, this.assistant.memory.currentAgentStatus?.subscriptionPlan.id);
            if (!result.success || !result.subscription || !result.plan) {
                return {
                    success: false,
                    error: result.error || "Failed to subscribe to agent plan",
                };
            }
            await this.updateCurrentAgentProductPlan(result.plan, result.subscription);
            let html;
            if (result.plan?.AgentProduct) {
                html = `<div class="agent-chips"><yp-agent-chip-for-purchase
          isSubscribed="${true}"
          agentProductId="${result.plan.AgentProduct.id}"
          subscriptionPlanId="${result.plan.id}"
          agentName="${result.plan.AgentProduct.name}"
          agentDescription="${result.plan.AgentProduct.description}"
          agentImageUrl="${result.plan.AgentProduct.configuration.avatar?.imageUrl}"
          price="${result.plan.configuration.amount}"
          currency="${result.plan.configuration.currency}"
          maxRunsPerCycle="${result.plan.configuration.max_runs_per_cycle}"
        ></yp-agent-chip-for-purchase></div>`;
            }
            this.assistant.emit("update-ai-model-session", "Successfully subscribed to agent plan, now offer to start and show the configuration tool/widget");
            return {
                success: true,
                html,
                data: {
                    message: "Successfully subscribed to agent plan, now the user can configure the agent",
                    subscription: result.subscription,
                    subscriptionPlan: result.plan,
                },
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to subscribe to agent";
            console.error(`Failed to subscribe to agent: ${errorMessage}`);
            return {
                success: false,
                error: errorMessage,
            };
        }
    }
    get unsubscribeFromCurrentAgentSubscription() {
        return {
            name: "unsubscribe_from_current_agent_subscription",
            description: "Unsubscribe from an existing agent subscription the user is subscribed to. User must verbally confirm unsubscription with the agent name before proceeding.",
            type: "function",
            parameters: {
                type: "object",
                properties: {
                    useHasVerballyConfirmedUnsubscribeWithTheAgentName: {
                        type: "boolean",
                    },
                },
                required: [
                    "useHasVerballyConfirmedUnsubscribeWithTheAgentName",
                ],
            },
            handler: this.unsubscribeFromCurrentAgentSubscriptionHandler.bind(this),
        };
    }
    async unsubscribeFromCurrentAgentSubscriptionHandler(params) {
        params = this.assistant.getCleanedParams(params);
        console.log(`handler: unsubscribe_from_current_agent_subscription: ${JSON.stringify(params, null, 2)}`);
        try {
            if (!params.useHasVerballyConfirmedUnsubscribeWithTheAgentName) {
                return {
                    success: false,
                    error: "User must verbally confirm unsubscription with the agent name before proceeding",
                };
            }
            if (!this.assistant.memory.currentAgentStatus ||
                !this.assistant.memory.currentAgentStatus.subscriptionPlan) {
                return {
                    success: false,
                    data: "No current agent selected",
                    error: "No current agent selected",
                };
            }
            const { plan, subscription } = await this.subscriptionModels.loadAgentProductPlanAndSubscription(this.assistant.memory.currentAgentStatus.subscriptionPlan.id);
            if (!subscription) {
                return {
                    success: false,
                    data: "No subscription found",
                    error: "No subscription found",
                };
            }
            if (!plan) {
                return {
                    success: false,
                    data: "No subscription plan found",
                    error: "No subscription plan found",
                };
            }
            const result = await this.subscriptionModels.unsubscribeFromAgentPlan(subscription.id);
            if (!result.success) {
                return {
                    success: false,
                    error: result.error,
                };
            }
            await this.updateCurrentAgentProductPlan(plan, subscription);
            const html = `<div class="agent-chips"><yp-agent-chip
        isUnsubscribed="${true}"
        agentProductId="${plan.AgentProduct?.id}"
        subscriptionId="${subscription.id}"
        agentName="${plan.AgentProduct?.name}"
        agentDescription="${plan.AgentProduct?.description}"
        agentImageUrl="${plan.AgentProduct?.configuration.avatar?.imageUrl}"
    ></yp-agent-chip></div>`;
            this.assistant.emit("update-ai-model-session", "Successfully unsubscribed from agent subscription");
            return {
                success: true,
                html,
                data: {
                    message: "Successfully unsubscribed from agent subscription",
                    subscriptionId: result.subscriptionId,
                    subscriptionPlan: plan,
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
}
