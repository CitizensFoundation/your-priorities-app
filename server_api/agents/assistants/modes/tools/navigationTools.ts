// commonTools.ts

import { YpAgentAssistant } from '../../agentAssistant.js';
import { AgentModels } from './models/agents.js';
import { SubscriptionModels } from './models/subscriptions.js';
import { BaseAssistantTools } from './baseTools.js';

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
      'agent_selection_mode',
      'User requested to return to the main assistant',
      {}
    );
    return {
      success: true,
      data: { message: 'Returned to main assistant' },
    };
  }

  get connectDirectlyToAgent(){
    return {
      name: "connect_directly_to_one_of_the_agents",
      description:
        "Select an agent to work with, either one the user is subscribed to or one available for purchase to the user. The user does not need to be logged in to use this tool.",
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
      handler:
        this.connectToOneOfTheAgentsHandler.bind(this),
    };
  }

  public async connectToOneOfTheAgentsHandler(
    params: YpAgentSelectParams
  ): Promise<ToolExecutionResult> {
    params = this.assistant.getCleanedParams(
      params
    ) as YpAgentSelectParams;
    console.log(
      `handler: connect_to_one_of_the_agents: ${JSON.stringify(
        params,
        null,
        2
      )}`
    );
    try {
      const { plan, subscription } = await this.subscriptionModels.loadAgentProductPlanAndSubscription(
        params.subscriptionPlanId
      );

      if (!plan?.AgentProduct) {
        throw new Error(`Agent product with id ${params.subscriptionPlanId} not found`);
      }

      console.log(`Loading: ${plan?.AgentProduct?.name} ${subscription?.id}`)

      this.updateCurrentAgentProductPlan(plan, subscription, { sendEvent: false});

      await this.assistant.handleModeSwitch(
        "agent_direct_connection_mode",
        `Directly connected to agent: ${plan?.AgentProduct?.name}`,
        params
      );

      const html = `<div class="agent-chips"><yp-agent-chip
          isSelected
          agentProductId="${plan?.AgentProduct?.id}"
          subscriptionId="${subscription?.id}"
          agentName="${plan?.name}"
          agentDescription="${plan?.AgentProduct?.description}"
          agentImageUrl="${plan?.AgentProduct?.configuration.avatar?.imageUrl}"
        ></yp-agent-chip></div>`;

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
        error instanceof Error
          ? error.message
          : "Failed to select agent";
      console.error(`Failed to select agent: ${errorMessage}`);
      return {
        success: false,
        data: errorMessage,
        error: errorMessage,
      };
    }
  }
}
