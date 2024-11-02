import { param } from "controllers/index.cjs";
import { ToolExecutionResult } from "./baseAssistant.js";

import { YpBaseAssistant } from "./baseAssistant.js";
import { ChatbotMode } from "./baseAssistant.js";
import { YpBaseAssistantWithVoice } from "./baseAssistantWithVoice.js";
import { PsAgent } from "@policysynth/agents/dbModels/agent.js";
import { YpAgentProductRun } from "../models/agentProductRun.js";
import { YpAgentProduct } from "../models/agentProduct.js";
import { YpAgentProductBundle } from "../models/agentProductBundle.js";
import { YpSubscription } from "../models/subscription.js";
import { YpSubscriptionPlan } from "../models/subscriptionPlan.js";
import { NotificationAgentQueueManager } from "../managers/notificationAgentQueueManager.js";
import { LexRuntime } from "aws-sdk";
import { DEBUG } from "bunyan";


interface MyAgentSubscriptionStatus {
  availableAgents: Array<{
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    isRunning: boolean;
  }>;
  runningAgents: Array<{
    runId: number;
    agentId: number;
    agentName: string;
    startTime: Date;
    status: string;
    workflow: any;
    subscriptionId: number;
  }>;
  systemStatus: {
    healthy: boolean;
    lastUpdated: Date;
    error?: string;
  };
}

interface MyAgentPlanStatus {
  availablePlans: Array<{
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    currency: string;
    maxRunsPerCycle: number;
  }>;
  systemStatus: {
    healthy: boolean;
    lastUpdated: Date;
    error?: string;
  };
}

export class YpAgentAssistant extends YpBaseAssistantWithVoice {
  private currentAgentId?: number;
  private currentAgent?: PsAgent;
  private currentWorkflow?: YpWorkflowConfiguration;
  private availableAgents: PsAgent[] = [];
  private runningAgents: PsAgent[] = [];

  renderAllAgentsStatus() {
    return `<availableAgents>${JSON.stringify(
      this.availableAgents,
      null,
      2
    )}</availableAgents>
    <runningAgents>${JSON.stringify(
      this.runningAgents,
      null,
      2
    )}</runningAgents>  `;
  }

  renderCurrentWorkflowStatus() {
    return `<currentWorkflow>${JSON.stringify(
      this.currentWorkflow,
      null,
      2
    )}</currentWorkflow>`;
  }

  renderCurrentAgent() {
    return `<currentAgent>${JSON.stringify(
      this.currentAgent,
      null,
      2
    )}</currentAgent>`;
  }

  renderCommon() {
    return `<currentConversationMode>${this.memory.currentMode}</currentConversationMode>`;
  }

  defineAvailableModes(): ChatbotMode[] {
    return [
      {
        name: "agent_selection",
        systemPrompt: `You are an AI agent assistant. Help users select and manage their AI agents.
Available commands:
- List available agents
- Check running agents
- Select an agent to work with
- Get agent status
Current system status and available agents are provided via functions.
${this.renderCommon()}
${this.renderAllAgentsStatus()}`,
        description: "List, browse and select agents",
        functions: [
          {
            name: "list_my_agent_subscriptions",
            description: "List all agent subscriptions for the current user, after completing the function say something like here you go or something similar",
            type: "function",
            parameters: {
              type: "object",
              properties: {
                includeDetails: { type: "boolean" },
              },
            },
            /*resultSchema: {
              type: "object",
              properties: {
                availableAgents: { type: "array", items: { type: "object" } },
                runningAgents: { type: "array", items: { type: "object" } },
                systemStatus: { type: "object" },
              },
            },*/
            handler: async (params): Promise<ToolExecutionResult<any>> => {
              console.log(`handler: list_my_agent_subscriptions: ${JSON.stringify(params, null, 2)}`);
              try {
                const status = await this.loadMyAgentSubscriptions() as MyAgentSubscriptionStatus;
                if (DEBUG ) {
                  console.log(`list_my_agent_subscriptions: ${JSON.stringify(status, null, 2)}`);
                }

                let agentChips = ``;
                for (const agent of status.availableAgents) {
                  agentChips += `<yp-agent-chip
                    agentId="${agent.id}"
                    agentName="${agent.name}"
                    agentDescription="${agent.description}"
                    agentImageUrl="${agent.imageUrl}"
                  ></yp-agent-chip>`;
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
                return {
                  success: false,
                  error:
                    error instanceof Error
                      ? error.message
                      : "Failed to load agent status",
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
            /*resultSchema: {
              type: "object",
              properties: {
                availableAgents: { type: "array", items: { type: "object" } },
                runningAgents: { type: "array", items: { type: "object" } },
                systemStatus: { type: "object" },
              },
            },*/
            handler: async (params): Promise<ToolExecutionResult<any>> => {
              console.log(`handler: list_all_agents_available_for_purchase: ${JSON.stringify(params, null, 2)}`);
              try {
                  const status = await this.loadAllAgentPlans() as MyAgentPlanStatus;
                if (DEBUG ) {
                  console.log(`list_all_agents_available_for_purchase: ${JSON.stringify(status, null, 2)}`);
                }

                let agentChips = ``;
                for (const agent of status.availablePlans) {
                  agentChips += `<yp-agent-chip-for-purchase
                    agentId="${agent.id}"
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
                return {
                  success: false,
                  error:
                    error instanceof Error
                      ? error.message
                      : "Failed to load agent status",
                };
              }
            },
          },
          {
            name: "select_agent",
            description: "Select an agent to work with",
            type: "function",
            parameters: {
              type: "object",
              properties: {
                agentProductId: { type: "number" },
              },
              required: ["agentProductId"],
            },
            handler: async (params): Promise<ToolExecutionResult> => {
              console.log(`handler: select_agent: ${JSON.stringify(params, null, 2)}`);
              try {
                const agent = await this.validateAndSelectAgent(params.agentProductId);
                const requiredQuestions = await this.getRequiredQuestions(
                  params.agentProductId
                );

                this.currentAgentId = params.agentProductId;

                // If we have unanswered required questions, switch to configuration mode
                if (requiredQuestions && requiredQuestions.length > 0) {
                  await this.handleModeSwitch(
                    "agent_configuration",
                    "Required questions need to be answered"
                  );
                } else {
                  await this.handleModeSwitch(
                    "agent_operations",
                    "Agent ready for operations"
                  );
                }

                return {
                  success: true,
                  data: {
                    agent,
                    hasRequiredQuestions:
                      requiredQuestions && requiredQuestions.length > 0,
                  },
                };
              } catch (error) {
                return {
                  success: false,
                  error:
                    error instanceof Error
                      ? error.message
                      : "Failed to select agent",
                };
              }
            },
          },
        ],
        allowedTransitions: ["agent_configuration", "agent_operations"],
      },

      {
        name: "agent_configuration",
        systemPrompt: `Help the user configure the selected agent by collecting required information.
Review the required questions and guide the user through answering them.
${this.renderCommon()}
${this.renderCurrentAgent()}`,
        description: "Configure agent parameters and requirements",
        functions: [
          {
            name: "show_question_form",
            description: "Display form for required questions",
            type: "function",
            parameters: {
              type: "object",
              properties: {
                agentId: { type: "number" },
              },
              required: ["agentId"],
            },
            handler: async (params): Promise<ToolExecutionResult> => {
              console.log(`handler: show_question_form: ${JSON.stringify(params, null, 2)}`);
              try {
                const questions = await this.getRequiredQuestions(
                  params.agentId
                );

                // Create HTML element for questions
                let html = questions.map(question => `
                  <yp-structured-question
                    .question="${JSON.stringify(question)}"
                  ></yp-structured-question>
                `).join('\n');

                return {
                  success: true,
                  data: {
                    questions,
                    html,
                  },
                };
              } catch (error) {
                return {
                  success: false,
                  error:
                    error instanceof Error
                      ? error.message
                      : "Failed to show questions",
                };
              }
            },
          },
        ],
        allowedTransitions: ["agent_operations"],
      },
      {
        name: "agent_operations",
        systemPrompt: `Help the user manage the selected agent's operations.
Available commands:
- Start/stop agent
- Get current status
- Handle engagement requests
- Show workflow
- Show workflow step details
Current agent status and workflow state are provided via functions.
${this.renderCommon()}
${this.renderAllAgentsStatus()}
${this.renderCurrentAgent()}
${this.renderCurrentWorkflowStatus()}`,
        description: "Manage agent operations",
        functions: [
          {
            name: "run_agent_next_workflow_step",
            description: "Run the next step in the selected agent's workflow",
            type: "function",
            parameters: {
              type: "object",
              properties: {
                configuration: { type: "object" },
              },
            },
            handler: async (params): Promise<ToolExecutionResult> => {
              try {
                if (!this.currentAgentId) {
                  throw new Error("No agent selected");
                }

                const result = await this.runAgentNextWorkflowStep(
                  this.currentAgentId,
                  params.configuration
                );
                return {
                  success: true,
                  data: result,
                };
              } catch (error) {
                return {
                  success: false,
                  error:
                    error instanceof Error
                      ? error.message
                      : "Failed to start agent",
                };
              }
            },
          },
          {
            name: "show_engagement_group",
            description: "Show group for human engagement",
            type: "function",
            parameters: {
              type: "object",
              properties: {
                groupId: { type: "number" },
              },
              required: ["groupId"],
            },
            handler: async (params): Promise<ToolExecutionResult> => {
              console.log(`handler: show_engagement_group: ${JSON.stringify(params, null, 2)}`);
              try {
                // Create HTML element for group
                const html = `<yp-group
                  .groupId="${params.groupId}"
                  .configuration="${JSON.stringify(params.configuration)}"
                ></yp-group>`;

                return {
                  success: true,
                  data: {
                    groupId: params.groupId,
                    html,
                  },
                };
              } catch (error) {
                return {
                  success: false,
                  error:
                    error instanceof Error
                      ? error.message
                      : "Failed to show group",
                };
              }
            },
          },
          {
            name: "stop_agent",
            description: "Stop the currently running agent",
            type: "function",
            parameters: {
              type: "object",
              properties: {
                reason: { type: "string" },
              },
            },
            /*resultSchema: {
              type: "object",
              properties: {
                agentId: { type: "number" },
                stopTime: { type: "string" },
                finalStatus: { type: "string" },
              },
            },*/
            handler: async (params): Promise<ToolExecutionResult> => {
              console.log(`handler: stop_agent: ${JSON.stringify(params, null, 2)}`);
              try {
                if (!this.currentAgentId) {
                  throw new Error("No agent selected");
                }

                const result = await this.stopAgent(
                  this.currentAgentId,
                  params.reason
                );
                return {
                  success: true,
                  data: {
                    agentId: this.currentAgentId,
                    stopTime: new Date().toISOString(),
                    finalStatus: result.status,
                  },
                  metadata: {
                    reason: params.reason,
                  },
                };
              } catch (error) {
                return {
                  success: false,
                  error:
                    error instanceof Error
                      ? error.message
                      : "Failed to stop agent",
                };
              }
            },
          },
          {
            name: "show_workflow",
            description: "Display the current workflow status and steps",
            type: "function",
            parameters: {
              type: "object",
              properties: {
                includeHistory: { type: "boolean" },
                showDetails: { type: "boolean" },
              },
            },
            /*resultSchema: {
              type: "object",
              properties: {
                workflow: {
                  type: "object",
                  properties: {
                    steps: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "number" },
                          name: { type: "string" },
                          status: { type: "string" },
                          type: { type: "string" },
                          completed: { type: "boolean" },
                          currentStep: { type: "boolean" },
                        },
                      },
                    },
                    currentStepId: { type: "number" },
                    progress: { type: "number" },
                  },
                },
                visualizationHtml: { type: "string" },
              },
            },*/
            handler: async (params): Promise<ToolExecutionResult> => {
              console.log(`handler: show_workflow: ${JSON.stringify(params, null, 2)}`);
              try {
                if (!this.currentAgentId) {
                  throw new Error("No agent selected");
                }

                const workflow = await this.getWorkflowStatus(
                  this.currentAgentId
                );

                // Create visualization HTML
                const html = `
                  <yp-group
                    .groupId="${workflow.steps[params.currentStepId].groupId}"
                  ></yp-group>
                `;

                return {
                  success: true,
                  data: {
                    workflow,
                    html,
                  },
                  metadata: {
                    lastUpdated: new Date().toISOString(),
                    includesHistory: params.includeHistory,
                    showingDetails: params.showDetails,
                  },
                };
              } catch (error) {
                return {
                  success: false,
                  error:
                    error instanceof Error
                      ? error.message
                      : "Failed to show workflow",
                };
              }
            },
          },

          {
            name: "get_workflow_step_details",
            description:
              "Get detailed information about a specific workflow step",
            type: "function",
            parameters: {
              type: "object",
              properties: {
                stepId: { type: "number" },
                includeArtifacts: { type: "boolean" },
              },
              required: ["stepId"],
            },
            /*resultSchema: {
              type: "object",
              properties: {
                step: {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                    name: { type: "string" },
                    type: { type: "string" },
                    status: { type: "string" },
                    startTime: { type: "string" },
                    endTime: { type: "string" },
                    duration: { type: "number" },
                    artifacts: {
                      type: "array",
                      items: { type: "object" },
                    },
                  },
                },
              },
            },*/
            handler: async (params): Promise<ToolExecutionResult> => {
              console.log(`handler: get_workflow_step_details: ${JSON.stringify(params, null, 2)}`);
              try {
                if (!this.currentAgentId) {
                  throw new Error("No agent selected");
                }

                const stepDetails = await this.getWorkflowStepDetails(
                  this.currentAgentId,
                  params.stepId,
                  params.includeArtifacts
                );

                return {
                  success: true,
                  data: {
                    step: stepDetails,
                  },
                  metadata: {
                    requestedAt: new Date().toISOString(),
                    includesArtifacts: params.includeArtifacts,
                  },
                };
              } catch (error) {
                return {
                  success: false,
                  error:
                    error instanceof Error
                      ? error.message
                      : "Failed to get step details",
                };
              }
            },
          },
        ],
        allowedTransitions: ["agent_selection"],
      },
    ];
  }

  async loadAllAgentPlans(): Promise<MyAgentPlanStatus> {
    try {
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
                as: "Bundles",
                required: false,
                attributes: {
                  exclude: ["created_at", "updated_at"],
                },
              },
            ],
          },
        ],
      });

      return {
        availablePlans: availablePlans.map((plan) => ({
          id: plan.AgentProduct?.id || 0,
          name: plan.AgentProduct?.name || plan.name,
          description: plan.AgentProduct?.description || "No description available",
          imageUrl: plan.configuration?.imageUrl || "",
          price: plan.configuration?.amount || 0,
          currency: plan.configuration?.currency || "USD",
          maxRunsPerCycle: plan.configuration?.max_runs_per_cycle || 0
        })),
        systemStatus: {
          healthy: true,
          lastUpdated: new Date(),
        },
      };
    } catch (error) {
      console.error("Error loading available subscription plans:", error);
      return {
        availablePlans: [],
        systemStatus: {
          healthy: false,
          lastUpdated: new Date(),
          error: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  }

  private async loadMyAgentSubscriptions(): Promise<MyAgentSubscriptionStatus> {
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
                as: "Bundles",
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
          id: subscription.AgentProduct.id,
          name: subscription.AgentProduct.name,
          description: subscription.AgentProduct.description,
          imageUrl: subscription.Plan.configuration.imageUrl || "",
          isRunning: runningAgents.some((run) => run.Subscription?.AgentProduct?.id === subscription.AgentProduct.id),
        })),
        runningAgents: runningAgents.map((run) => ({
          runId: run.id,
          agentId: run.Subscription?.AgentProduct?.id || 0,
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
    } catch (error) {
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

  private async validateAndSelectAgent(agentId: number): Promise<any> {
    // Implement agent validation logic
    const status = await this.loadMyAgentSubscriptions();
    const agent = status.availableAgents.find((a: any) => a.id === agentId);
    if (!agent) {
      throw new Error("Agent not found or not available");
    }
    return agent;
  }

  private async stopAgent(agentId: number, reason?: string): Promise<any> {
    // Implement agent stop logic
    // This should communicate with your backend API
    const status = await this.loadMyAgentSubscriptions();
    const runningAgent = status.runningAgents.find(
      (a: any) => a.agentId === agentId
    );

    if (!runningAgent) {
      throw new Error("Agent is not running");
    }

    // Call your backend API to stop the agent
    // This is a placeholder - implement actual API call
    const stopResult = { status: "stopped", timestamp: new Date() };

    // Update Redis status
    runningAgent.status = "cancelled";
    await this.redis.set("agent_status", JSON.stringify(status));

    return stopResult;
  }

  private async getRequiredQuestions(
    agentProductId: number
  ): Promise<YpStructuredQuestionData[]> {
    /*const status = await this.loadMyAgentSubscriptions();
    const agent = status.availableAgents.find((a: any) => a.id === agentProductId);

    if (!agent || !agent.configuration) {
      return [];
    }

    const config = agent.configuration as YpAgentProductConfiguration;
    return config.requiredStructuredQuestions || [];*/
    return [];
  }

  async runAgentNextWorkflowStep(
    agentId: number,
    agentProductRunId: number
  ): Promise<any> {
    try {
      // Get the agent product run to access the workflow
      const agentProductRun = await YpAgentProductRun.findByPk(
        agentProductRunId
      );
      if (!agentProductRun || !agentProductRun.workflow) {
        throw new Error("Agent product run or workflow not found");
      }

      // Check if there's a next step
      const nextStep =
        agentProductRun.workflow.steps[
          agentProductRun.workflow.currentStepIndex + 1
        ];
      if (!nextStep) {
        // This was the last step, mark the run as completed
        agentProductRun.status = "completed";
        agentProductRun.end_time = new Date();
        agentProductRun.duration = Math.floor(
          (agentProductRun.end_time.getTime() -
            agentProductRun.start_time.getTime()) /
            1000
        );
        await agentProductRun.save();
        return { status: "completed", message: "Workflow completed" };
      }

      // Start the next agent in the workflow
      const agentQueueManager = new NotificationAgentQueueManager(
        this.wsClients
      );
      let success = false;
      if (nextStep.agentId && this.wsClientId) {
        success = await agentQueueManager.startAgentProcessingWithWsClient(
          nextStep.agentId,
          agentProductRunId,
          this.wsClientId
        );
      }

      if (!success) {
        return {
          status: "failed",
          message: "Failed to start next workflow step",
        };
      } else {
        return {
          status: "started",
          agentId: nextStep.agentId,
          message: "Next workflow step started",
        };
      }
    } catch (error: any) {
      console.error("Error running next workflow step:", error);
      throw new Error(`Failed to run next workflow step: ${error.message}`);
    }
  }

  private async handleQuestionsSubmitted(event: {
    detail: any;
  }): Promise<void> {
    const answers = event.detail;
    if (this.currentAgentId) {
      await this.redis.set(
        `agent:${this.currentAgentId}:answers`,
        JSON.stringify(answers)
      );
      await this.handleModeSwitch(
        "agent_operations",
        "Configuration completed"
      );
    }
  }

  private async getWorkflowStatus(agentId: number): Promise<
    YpWorkflowConfiguration & {
      currentStepId: number;
      progress: number;
      steps: Array<
        YpWorkflowStep & {
          status: string;
          completed: boolean;
          currentStep: boolean;
        }
      >;
    }
  > {
    // Get workflow configuration and current status
    const configKey = `agent:${agentId}:workflow_config`;
    const statusKey = `agent:${agentId}:workflow_status`;

    const [configStr, statusStr] = await Promise.all([
      this.redis.get(configKey),
      this.redis.get(statusKey),
    ]);

    const config: YpWorkflowConfiguration = configStr
      ? JSON.parse(configStr)
      : { steps: [] };
    const status = statusStr
      ? JSON.parse(statusStr)
      : {
          currentStepId: config.steps[0]?.id,
          progress: 0,
        };

    // Enhance steps with status information
    const enhancedSteps = config.steps.map((step) => ({
      ...step,
      status:
        step.id === status.currentStepId
          ? "active"
          : step.id < status.currentStepId
          ? "completed"
          : "pending",
      completed: step.id < status.currentStepId,
      currentStep: step.id === status.currentStepId,
    }));

    return {
      ...config,
      steps: enhancedSteps,
      currentStepId: status.currentStepId,
      progress: status.progress,
    };
  }

  private async getWorkflowStepDetails(
    agentId: number,
    stepId: number,
    includeArtifacts: boolean
  ): Promise<any> {
    const key = `agent:${agentId}:step:${stepId}`;
    const detailsStr = await this.redis.get(key);
    const details = detailsStr ? JSON.parse(detailsStr) : null;

    if (!details) {
      throw new Error("Step details not found");
    }

    if (includeArtifacts) {
      const artifactsKey = `agent:${agentId}:step:${stepId}:artifacts`;
      const artifactsStr = await this.redis.get(artifactsKey);
      details.artifacts = artifactsStr ? JSON.parse(artifactsStr) : [];
    }

    return details;
  }

  private handleWorkflowStepSelected(event: any): void {
    const stepId = event.detail.stepId;
    // Handle step selection - could trigger get_workflow_step_details
    // or show specific UI components based on step type
  }
}
