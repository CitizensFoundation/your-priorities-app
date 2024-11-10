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
      handler:
        this.listMyAgentSubscriptionsHandler.bind(
          this
        ),
    };
  }

  public async listMyAgentSubscriptionsHandler(
    params: YpAgentEmptyProperties
  ): Promise<ToolExecutionResult> {
      params = this.assistant.getCleanedParams(
        params
      ) as YpAgentEmptyProperties;
      console.log(
        `handler: list_my_agent_subscriptions: ${JSON.stringify(
          params,
          null,
          2
        )}`
      );
      try {
        const status = await this.subscriptionModels.loadUserAgentSubscriptions();
        if (this.assistant.DEBUG) {
          console.log(
            `list_my_agent_subscriptions: ${JSON.stringify(status, null, 2)}`
          );
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
          error instanceof Error
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

  get listAllAgentsAvailableForSubscription() {
    return {
      name: "list_all_agents_available_for_subscription",
      description: "List all agent subscriptions available for purchase",
      type: "function",
      parameters: {
        type: "object",
        properties: {} as YpAgentEmptyProperties,
      },
      handler:
        this.listAllAgentsAvailableForSubscriptionHandler.bind(
          this
        ),
    };
  }

  public async listAllAgentsAvailableForSubscriptionHandler(
    params: YpAgentEmptyProperties
  ): Promise<ToolExecutionResult> {
    params = this.assistant.getCleanedParams(
      params
    ) as YpAgentEmptyProperties;

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
    } catch (error) {
      const errorMessage =
        error instanceof Error
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


  get subscribeToCurrentAgentPlan() {
    return {
      name: "subscribe_to_current_agent_plan",
      description:
        "Subscribe to the current agent plan. User must confirm subscription with the agent name before proceeding.",
      type: "function",
      parameters: {
        type: "object",
        properties: {
          agentProductId: { type: "number" },
          subscriptionPlanId: { type: "number" },
          useHasVerballyConfirmedSubscribeWithTheAgentName: {
            type: "boolean",
          },
        } as YpAgentSubscribeProperties,
        required: [
          "agentProductId",
          "subscriptionPlanId",
          "useHasVerballyConfirmedSubscribeWithTheAgentName",
        ] as const satisfies readonly (keyof YpAgentSubscribeProperties)[],
      },
      handler:
        this.subscribeToCurrentAgentPlanHandler.bind(
          this
        ),
    };
  }

  public async subscribeToCurrentAgentPlanHandler(
    params: YpAgentSubscribeParams
  ): Promise<ToolExecutionResult> {
    params = this.assistant.getCleanedParams(
      params
    ) as YpAgentSubscribeParams;
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

      const result = await this.subscriptionModels.subscribeToAgentPlan(
        params.agentProductId,
        params.subscriptionPlanId
      );

      if (!result.success) {
        return {
          success: false,
          error: result.error,
        };
      }

      const agentPlans = await this.subscriptionModels.loadAgentSubscriptionPlans();

      const agent = agentPlans.availablePlans.find(
        (a) => a.subscriptionPlanId === result.subscriptionPlanId
      );

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

      this.assistant.triggerResponseIfNeeded(
        "Successfully subscribed to agent plan"
      );

      return {
        success: true,
        html,
        data: {
          message: "Successfully subscribed to agent plan",
          subscriptionId: result.subscriptionId,
          agentProduct: agent,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to subscribe to agent";
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
      description: "Unsubscribe from an existing agent subscription",
      type: "function",
      parameters: {
        type: "object",
        properties: {
          agentProductId: { type: "number" },
          subscriptionId: { type: "number" },
          useHasVerballyConfirmedUnsubscribeWithTheAgentName: {
            type: "boolean",
          },
        } as YpAgentUnsubscribeProperties,
        required: [
          "agentProductId",
          "subscriptionId",
          "useHasVerballyConfirmedUnsubscribeWithTheAgentName",
        ] as const satisfies readonly (keyof YpAgentUnsubscribeProperties)[],
      },
      handler:
        this.unsubscribeFromCurrentAgentSubscriptionHandler.bind(
          this
        ),
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

      const { agent, subscription } = await this.subscriptionModels.loadAgentProductAndSubscription(
        params.agentProductId
      );

      const result = await this.subscriptionModels.unsubscribeFromAgentPlan(
        params.subscriptionId
      );

      if (!result.success) {
        return {
          success: false,
          error: result.error,
        };
      }

      const html = `<div class="agent-chips"><yp-agent-chip
        isUnsubscribed="${true}"
        agentProductId="${agent.id}"
        subscriptionId="${params.subscriptionId}"
        agentName="${agent.name}"
        agentDescription="${agent.description}"
        agentImageUrl="${agent.configuration.avatar?.imageUrl}"
    ></yp-agent-chip></div>`;

      this.assistant.triggerResponseIfNeeded(
        "Successfully unsubscribed from agent subscription"
      );

      return {
        success: true,
        html,
        data: {
          message: "Successfully unsubscribed from agent subscription",
          subscriptionId: result.subscriptionId,
          agentProduct: agent,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to unsubscribe from agent";
      console.error(
        `Failed to unsubscribe from agent: ${errorMessage}`
      );
      return {
        success: false,
        error: errorMessage,
      };
    }
  }


}
