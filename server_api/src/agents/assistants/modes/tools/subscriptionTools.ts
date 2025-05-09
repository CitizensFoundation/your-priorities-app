// commonTools.ts

import { YpAgentAssistant } from "../../agentAssistant.js";
import { SubscriptionModels } from "./models/subscriptions.js";
import { BaseAssistantTools } from "./baseTools.js";

export class SubscriptionTools extends BaseAssistantTools {
  subscriptionModels: SubscriptionModels;

  constructor(assistant: YpAgentAssistant) {
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
        properties: {} as YpAgentEmptyProperties,
      },
      handler: this.listMyAgentSubscriptionsHandler.bind(this),
    };
  }

  public async listMyAgentSubscriptionsHandler(
    params: YpAgentEmptyProperties
  ): Promise<ToolExecutionResult> {
    params = this.assistant.getCleanedParams(params) as YpAgentEmptyProperties;
    console.log(
      `handler: list_my_agent_subscriptions: ${JSON.stringify(params, null, 2)}`
    );
    try {
      const status = await this.subscriptionModels.loadUserAgentSubscriptions();
      if (this.assistant.DEBUG) {
        console.log(
          `list_my_agent_subscriptions: ${JSON.stringify(status, null, 2)}`
        );
      }

      let agentChips = "";
      for (const subscription of status.availableSubscriptions) {
        agentChips += `<div class="agent-chips"><yp-agent-chip-for-purchase
          isSubscribed="${true}"
          type="${subscription.Plan?.configuration.type}"
          agentProductId="${subscription.Plan?.AgentProduct?.id}"
          subscriptionPlanId="${subscription.Plan?.id}"
          agentName="${subscription.Plan?.AgentProduct?.name}"
          agentDescription="${subscription.Plan?.AgentProduct?.description}"
          agentImageUrl="${
            subscription.Plan?.AgentProduct?.configuration.avatar?.imageUrl
          }"
          price="${subscription.Plan?.configuration.amount}"
          currency="${subscription.Plan?.configuration.currency}"
          maxRunsPerCycle="${
            subscription.Plan?.configuration.max_runs_per_cycle
          }"
        ></yp-agent-chip-for-purchase></div>`;
      }
      let html;

      if (status.availableSubscriptions.length > 0) {
        html = `<div class="agent-chips">${agentChips}</div>`;
      } else {
        this.assistant.triggerResponseIfNeeded(
          "The user is not subscribed to any agents, offer to show available agents for purchase"
        );
      }

      return {
        success: true,
        data: status,
        html,
        metadata: {
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load agent status";
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
        properties: {} as YpAgentEmptyProperties,
      },
      handler: this.listAllAgentsAvailableForSubscriptionHandler.bind(this),
    };
  }

  public async listAllAgentsAvailableForSubscriptionHandler(
    params: YpAgentEmptyProperties
  ): Promise<ToolExecutionResult> {
    params = this.assistant.getCleanedParams(params) as YpAgentEmptyProperties;

    console.log(
      `handler: list_all_agents_available_for_purchase: ${JSON.stringify(
        params,
        null,
        2
      )}`
    );
    try {
      const status = await this.subscriptionModels.loadAgentSubscriptionPlans();
      if (this.assistant.DEBUG) {
        console.log(
          `list_all_agents_available_for_purchase: ${JSON.stringify(
            status,
            null,
            2
          )}`
        );
      }

      let agentChips = "";
      function planTypePriority(type: string): number {
        switch (type) {
          case "coming_soon":
            return 0;
          case "paid":
            return 1;
          case "free_trial":
            return 2;
          default:
            return 999;
        }
      }

      // 2) Custom sort function
      const sortedPlans = [...status.availablePlans].sort((a, b) => {
        // Compare by type priority first
        const typeComparison =
          planTypePriority(a.type) - planTypePriority(b.type);
        if (typeComparison !== 0) {
          // If types differ, that decides the order
          return typeComparison;
        }
        // If both are the same type and it's "paid", sort by price descending
        if (b.price && a.price && a.type === "paid" && b.type === "paid") {
          return b.price - a.price;
        }
        // Otherwise keep them in the same order if they're not "paid"
        return 0;
      });

      for (const agent of sortedPlans) {
        agentChips += `<yp-agent-chip-for-purchase
          subscriptionPlanId="${agent.subscriptionPlanId}"
          type="${agent.type}"
          agentName="${agent.name}"
          agentDescription="${agent.description}"
          agentImageUrl="${agent.imageUrl}"
        ></yp-agent-chip-for-purchase>`;
      }
      const html = `<div class="agent-chips">${agentChips}</div>`;
      return {
        success: true,
        data: {
          messageToAssistant:
            "You have shown the user the available agents for purchase with a UI widget, now the user needs to choose which one to connect to then subscribe to",
          status,
        },
        html,
        metadata: {
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load agent status";
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
      description:
        "Subscribe to the current agent plan. User must confirm subscription with the agent name before proceeding. The user needs to subscribe to the agent before it can be used so make sure to offer it to the user.",
      type: "function",
      parameters: {
        type: "object",
        properties: {
          useHasVerballyConfirmedSubscribeWithTheAgentName: {
            type: "boolean",
          },
        } as YpAgentSubscribeProperties,
        required: [
          "useHasVerballyConfirmedSubscribeWithTheAgentName",
        ] as const satisfies readonly (keyof YpAgentSubscribeProperties)[],
      },
      handler: this.subscribeToCurrentAgentPlanHandler.bind(this),
    };
  }

  public async subscribeToCurrentAgentPlanHandler(
    params: YpAgentSubscribeParams
  ): Promise<ToolExecutionResult> {
    params = this.assistant.getCleanedParams(params) as YpAgentSubscribeParams;
    console.log(
      `handler: subscribe_to_current_agent_plan: ${JSON.stringify(
        params,
        null,
        2
      )}`
    );
    try {
      if (!params.useHasVerballyConfirmedSubscribeWithTheAgentName) {
        return {
          success: false,
          error:
            "User must confirm subscription with the agent name before proceeding",
        };
      }

      console.log(
        `-------> ${JSON.stringify(
          this.assistant.memory.currentAgentStatus,
          null,
          2
        )}`
      );

      const subscriptionPlan =
        await this.assistant.getCurrentSubscriptionPlan();

      if (!subscriptionPlan) {
        throw new Error("No subscription plan found");
      }

      if (!subscriptionPlan) {
        return {
          success: false,
          data: "No current agent selected",
          error: "No current agent selected",
        };
      }

      const result = await this.subscriptionModels.subscribeToAgentPlan(
        subscriptionPlan.AgentProduct!.id,
        subscriptionPlan.id
      );

      if (!result.success || !result.subscription || !result.plan) {
        return {
          success: false,
          error: result.error || "Failed to subscribe to agent plan",
        };
      }

      await this.updateCurrentAgentProductPlan(
        result.plan!,
        result.subscription
      );

      let html;
      if (result.plan?.AgentProduct) {
        html = `<div class="agent-chips"><yp-agent-chip-for-purchase
          isSubscribed="${true}"
          agentProductId="${result.plan.AgentProduct!.id}"
          subscriptionPlanId="${result.plan.id}"
          agentName="${result.plan.AgentProduct!.configuration.displayName}"
          agentDescription="${result.plan.AgentProduct!.description}"
          agentImageUrl="${
            result.plan.AgentProduct!.configuration.avatar?.imageUrl
          }"
          price="${result.plan.configuration.amount}"
          currency="${result.plan.configuration.currency}"
          maxRunsPerCycle="${result.plan.configuration.max_runs_per_cycle}"
        ></yp-agent-chip-for-purchase></div>`;
      }

      this.assistant.emit(
        "update-ai-model-session",
        "Successfully subscribed to agent plan, now offer to show the configuration input tool/widget to configure the agent"
      );

      return {
        success: true,
        html,
        data: {
          message:
            "Successfully subscribed to agent plan, now offer to show the configuration input tool/widget to configure the agent",
          subscription: result.subscription,
          subscriptionPlan: result.plan,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to subscribe to agent";
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
      description:
        "Unsubscribe from an existing agent subscription the user is subscribed to. User must verbally confirm unsubscription with the agent name before proceeding.",
      type: "function",
      parameters: {
        type: "object",
        properties: {
          useHasVerballyConfirmedUnsubscribeWithTheAgentName: {
            type: "boolean",
          },
        } as YpAgentUnsubscribeProperties,
        required: [
          "useHasVerballyConfirmedUnsubscribeWithTheAgentName",
        ] as const satisfies readonly (keyof YpAgentUnsubscribeProperties)[],
      },
      handler: this.unsubscribeFromCurrentAgentSubscriptionHandler.bind(this),
    };
  }

  public async unsubscribeFromCurrentAgentSubscriptionHandler(
    params: YpAgentUnsubscribeParams
  ): Promise<ToolExecutionResult> {
    params = this.assistant.getCleanedParams(
      params
    ) as YpAgentUnsubscribeParams;
    console.log(
      `handler: unsubscribe_from_current_agent_subscription: ${JSON.stringify(
        params,
        null,
        2
      )}`
    );
    try {
      if (!params.useHasVerballyConfirmedUnsubscribeWithTheAgentName) {
        return {
          success: false,
          error:
            "User must verbally confirm unsubscription with the agent name before proceeding",
        };
      }

      const subscriptionPlan =
        await this.assistant.getCurrentSubscriptionPlan();

      if (!subscriptionPlan) {
        return {
          success: false,
          data: "No current agent selected",
          error: "No current agent selected",
        };
      }

      const { plan, subscription } =
        await this.subscriptionModels.loadAgentProductPlanAndSubscription(
          subscriptionPlan.id
        );

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

      const result = await this.subscriptionModels.unsubscribeFromAgentPlan(
        subscription.id
      );

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

      this.assistant.emit(
        "update-ai-model-session",
        "Successfully unsubscribed from agent subscription"
      );

      return {
        success: true,
        html,
        data: {
          message: "Successfully unsubscribed from agent subscription",
          subscriptionId: result.subscriptionId,
          subscriptionPlan: plan,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
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
