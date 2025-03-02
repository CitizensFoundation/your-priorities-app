// commonTools.ts

import { YpAgentAssistant } from "../../agentAssistant.js";
import { AgentModels } from "./models/agents.js";
import { SubscriptionModels } from "./models/subscriptions.js";
import { BaseAssistantTools } from "./baseTools.js";

export class NavigationTools extends BaseAssistantTools {
  protected agentModels: AgentModels;
  protected subscriptionModels: SubscriptionModels;

  constructor(assistant: YpAgentAssistant) {
    super(assistant);
    this.agentModels = new AgentModels(assistant);
    this.subscriptionModels = new SubscriptionModels(assistant);
  }

  public async goBackToMainAssistant(): Promise<ToolExecutionResult> {
    await this.assistant.handleModeSwitch(
      "agent_selection_mode",
      "User requested to return to the main assistant",
      {}
    );
    return {
      success: true,
      data: { message: "Returned to main assistant" },
    };
  }

  get connectDirectlyToAgent() {
    return {
      name: "connect_directly_to_one_of_the_agents",
      description:
        "Select an agent to work with. The user needs to be logged in to use this tool.",
      type: "function",
      parameters: {
        type: "object",
        properties: {
          subscriptionPlanId: { type: "number" },
        } as YpAgentSelectProperties,
        required: [
          "subscriptionPlanId",
        ] as const satisfies readonly (keyof YpAgentSelectProperties)[],
      },
      handler: this.connectToOneOfTheAgentsHandler.bind(this),
    };
  }

  public async connectToOneOfTheAgentsHandler(
    params: YpAgentSelectParams
  ): Promise<ToolExecutionResult> {
    params = this.assistant.getCleanedParams(params) as YpAgentSelectParams;
    console.log(
      `handler: connect_to_one_of_the_agents: ${JSON.stringify(
        params,
        null,
        2
      )}`
    );
    try {
      let { plan, subscription } =
        await this.subscriptionModels.loadAgentProductPlanAndSubscription(
          params.subscriptionPlanId
        );

      if (!plan?.AgentProduct) {
        throw new Error(
          `Agent product with id ${params.subscriptionPlanId} not found`
        );
      }


      const result = await this.subscriptionModels.subscribeToAgentPlan(
        plan.AgentProduct!.id,
        plan.id,
        true
      );

      if (!result.success || !result.subscription || !result.plan) {
        return {
          success: false,
          error: result.error || "Failed to subscribe to agent plan",
        };
      }

      plan = result.plan;
      subscription = result.subscription;

      console.log(`Loading: ${plan?.AgentProduct?.name} ${subscription?.id}`);

      await this.updateCurrentAgentProductPlan(plan, subscription);

      await this.assistant.handleModeSwitch(
        "agent_direct_connection_mode",
        `Directly connected to agent: ${plan?.AgentProduct?.name}`,
        params
      );

      const html = `<div class="agent-chips"><yp-agent-chip-simple
          isSelected
          isSubscribed="1"
          agentProductId="${plan?.AgentProduct?.id}"
          subscriptionId="${subscription?.id}"
          agentName="${plan?.name}"
          agentDescription="${plan?.AgentProduct?.description}"
          agentImageUrl="${plan?.AgentProduct?.configuration.avatar?.imageUrl}"
        ></yp-agent-chip-simple></div>`;

      if (plan?.AgentProduct?.configuration.avatar?.imageUrl) {
        this.assistant.sendAvatarUrlChange(
          plan?.AgentProduct?.configuration.avatar?.imageUrl,
          plan?.AgentProduct?.name
        );
      }

      this.assistant.triggerResponseIfNeeded("Agent selected");

      return {
        success: true,
        html,
        data: {
          selectedAgentInformation: JSON.stringify(
            this.assistant.memory.currentAgentStatus,
            null,
            2
          ),
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to select agent";
      console.error(`Failed to select agent: ${errorMessage}`);
      return {
        success: false,
        data: errorMessage,
        error: errorMessage,
      };
    }
  }

  get listAllAgentsAvailableForConnection() {
    return {
      name: "list_all_agents_available_for_connection",
      description: "List all agent workflows available connecting to",
      type: "function",
      parameters: {
        type: "object",
        properties: {} as YpAgentEmptyProperties,
      },
      handler: this.listAllAgentsAvailableForConnectionsHandler.bind(this),
    };
  }

  public async listAllAgentsAvailableForConnectionsHandler(
    params: YpAgentEmptyProperties
  ): Promise<ToolExecutionResult> {
    params = this.assistant.getCleanedParams(params) as YpAgentEmptyProperties;

    console.log(
      `handler: list_all_agents_available_for_connections: ${JSON.stringify(
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
        agentChips += `<yp-agent-chip-simple
          subscriptionPlanId="${agent.subscriptionPlanId}"
          type="${agent.type}"
          agentName="${agent.name}"
          agentDescription="${agent.description}"
          agentImageUrl="${agent.imageUrl}"
        ></yp-agent-chip-simple>`;
      }
      const html = `<div class="agent-chips">${agentChips}</div>`;
      return {
        success: true,
        data: {
          messageToAssistant:
            "You have shown the user the available agents for connection with a UI widget, now the user needs to choose which one to connect to",
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
}
