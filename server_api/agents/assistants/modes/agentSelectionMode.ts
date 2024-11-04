import { BaseAssistantMode } from "./baseAssistantMode.js";
import { YpAgentAssistant } from "../agentAssistant.js";
import { ChatbotMode, ToolExecutionResult } from "../baseAssistant.js";
import { YpSubscriptionPlan } from "../../models/subscriptionPlan.js";
import { YpSubscription } from "../../models/subscription.js";

const DEBUG = true;

interface UnsubscribeResult {
  success: boolean;
  error?: string;
  subscriptionId?: number;
}

interface SubscribeResult {
  success: boolean;
  error?: string;
  subscriptionId?: number;
  subscriptionPlanId?: number;
}

export class AgentSelectionMode extends BaseAssistantMode {
  constructor(assistant: YpAgentAssistant) {
    super(assistant);
  }

  public getMode(): ChatbotMode {
    return {
      name: "agent_subscription_and_selection",
      description: "List, purchase and select agentProducts you are subscribed to or available for purchase.",
      systemPrompt: `You are an AI agent assistant. Help users select and manage their AI agents.
Available commands:
- List available agents you are subscribed to
- List available agents available for purchase
- Select an agent you are subscribed to to work with
Current system status and available agents are provided via functions.
${this.renderCommon()}
${this.renderAllAgentsStatus()}`,
      functions: [
        {
          name: "list_my_agent_subscriptions",
          description: "List all agent subscriptions for the current user.",
          type: "function",
          parameters: {
            type: "object",
            properties: {
              includeDetails: { type: "boolean" },
            },
          },
          handler: async (params): Promise<ToolExecutionResult<any>> => {
            params = this.assistant.getCleanedParams(params);
            console.log(
              `handler: list_my_agent_subscriptions: ${JSON.stringify(
                params,
                null,
                2
              )}`
            );
            try {
              const status = await this.loadMyAgentSubscriptions();
              if (DEBUG) {
                console.log(
                  `list_my_agent_subscriptions: ${JSON.stringify(
                    status,
                    null,
                    2
                  )}`
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
          },
        },
        {
          name: "list_all_agents_available_for_purchase",
          description: "List all agent subscriptions available for purchase",
          type: "function",
          parameters: {
            type: "object",
            properties: {
              includeDetails: { type: "boolean" },
            },
          },
          handler: async (params): Promise<ToolExecutionResult<any>> => {
            params = this.assistant.getCleanedParams(params);

            console.log(
              `handler: list_all_agents_available_for_purchase: ${JSON.stringify(
                params,
                null,
                2
              )}`
            );
            try {
              const status = await this.loadAllAgentPlans();
              if (DEBUG) {
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
          },
        },
        {
          name: "unsubscribe_from_one_of_my_subscribed_agents",
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
            },
            required: [
              "agentProductId",
              "subscriptionId",
              "useHasVerballyConfirmedUnsubscribeWithTheAgentName",
            ],
          },
          handler: async (params): Promise<ToolExecutionResult> => {
            console.log(
              `handler: unsubscribe_from_one_of_my_subscribed_agents: ${JSON.stringify(
                params,
                null,
                2
              )}`
            );
            try {
              let cleanedParams =
                typeof params === "string" ? JSON.parse(params) : params;

              if (
                !cleanedParams.useHasVerballyConfirmedUnsubscribeWithTheAgentName
              ) {
                return {
                  success: false,
                  error:
                    "User must verbally confirm unsubscription with the agent name before proceeding",
                };
              }

              const agent = await this.validateAndSelectAgent(
                cleanedParams.agentProductId
              );

              const result = await this.unsubscribeFromAgentPlan(
                cleanedParams.subscriptionId
              );

              if (!result.success) {
                return {
                  success: false,
                  error: result.error,
                };
              }

              const html = `<div class="agent-chips"><yp-agent-chip
                isUnsubscribed="${true}"
                agentProductId="${agent.agentProductId}"
                subscriptionId="${cleanedParams.subscriptionId}"
                agentName="${agent.name}"
                agentDescription="${agent.description}"
                agentImageUrl="${agent.imageUrl}"
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
          },
        },
        {
          name: "subscribe_to_one_of_the_available_agent_plans",
          description:
            "Subscribe to a new agent subscription plan. User must confirm subscription with the agent name before proceeding.",
          type: "function",
          parameters: {
            type: "object",
            properties: {
              agentProductId: { type: "number" },
              subscriptionPlanId: { type: "number" },
              useHasVerballyConfirmedSubscribeWithTheAgentName: {
                type: "boolean",
              },
            },
            required: [
              "agentProductId",
              "subscriptionPlanId",
              "useHasVerballyConfirmedSubscribeWithTheAgentName",
            ],
          },
          handler: async (params): Promise<ToolExecutionResult> => {
            console.log(
              `handler: subscribe_to_one_of_the_available_agent_plans: ${JSON.stringify(
                params,
                null,
                2
              )}`
            );
            try {
              let cleanedParams =
                typeof params === "string" ? JSON.parse(params) : params;

              if (
                !cleanedParams.useHasVerballyConfirmedSubscribeWithTheAgentName
              ) {
                return {
                  success: false,
                  error:
                    "User must confirm subscription with the agent name before proceeding",
                };
              }


              const result = await this.subscribeToAgentPlan(
                cleanedParams.agentProductId,
                cleanedParams.subscriptionPlanId
              );

              if (!result.success) {
                return {
                  success: false,
                  error: result.error,
                };
              }

              const agentPlans = await this.loadAllAgentPlans();

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
          },
        },
        {
          name: "select_one_of_my_subscribed_agents",
          description: "Select an agent you are subscribed to to work with",
          type: "function",
          parameters: {
            type: "object",
            properties: {
              agentProductId: { type: "number" },
            },
            required: ["agentProductId"],
          },
          handler: async (params): Promise<ToolExecutionResult> => {
            console.log(
              `handler: select_one_of_my_subscribed_agents: ${JSON.stringify(
                params,
                null,
                2
              )}`
            );
            try {
              let cleanedParams =
                typeof params === "string" ? JSON.parse(params) : params;

              const agent = await this.validateAndSelectAgent(
                cleanedParams.agentProductId
              );

              const requiredQuestions = await this.getRequiredQuestions(
                cleanedParams.agentProductId
              );

              this.currentAgentId = cleanedParams.agentProductId;

              // If we have unanswered required questions, switch to configuration mode
              if (requiredQuestions && requiredQuestions.length > 0) {
                await this.assistant.handleModeSwitch(
                  "agent_configuration",
                  "Required questions need to be answered",
                  cleanedParams
                );
              } else {
                await this.assistant.handleModeSwitch(
                  "agent_operations",
                  "Agent ready for operations",
                  cleanedParams
                );
              }

              const html = `<div class="agent-chips"><yp-agent-chip
                  isSelected
                  agentProductId="${agent.agentProductId}"
                  subscriptionId="${agent.subscriptionId}"
                  agentName="${agent.name}"
                  agentDescription="${agent.description}"
                  agentImageUrl="${agent.imageUrl}"
                ></yp-agent-chip></div>`;

              this.assistant.triggerResponseIfNeeded("Agent selected");

              return {
                success: true,
                html,
                data: {
                  agent,
                  hasRequiredQuestions:
                    requiredQuestions && requiredQuestions.length > 0,
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
          },
        },
      ],
      allowedTransitions: ["agent_configuration", "agent_operations"],
    };
  }

  private async unsubscribeFromAgentPlan(
    subscriptionId: number
  ): Promise<UnsubscribeResult> {
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
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to unsubscribe from agent plan";
      console.error(
        `Database error in unsubscribeFromAgentPlan: ${errorMessage}`
      );
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  private async subscribeToAgentPlan(
    agentProductId: number,
    subscriptionPlanId: number
  ): Promise<SubscribeResult> {
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
    } catch (error) {
      const errorMessage =
        error instanceof Error
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
