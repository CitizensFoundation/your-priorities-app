// baseAssistantMode.ts

import { PsAgent } from '@policysynth/agents/dbModels/agent.js';
import { YpBaseAssistantWithVoice } from '../baseAssistantWithVoice.js';
import { YpSubscriptionPlan } from '../../models/subscriptionPlan.js';
import { YpAgentProductRun } from '../../models/agentProductRun.js';
import { YpAgentProduct } from '../../models/agentProduct.js';
import { YpAgentProductBundle } from '../../models/agentProductBundle.js';
import { YpSubscription } from '../../models/subscription.js';
import { NotificationAgentQueueManager } from '../../managers/notificationAgentQueueManager.js';
import { YpAgentAssistant } from '../agentAssistant.js';


interface MyAgentSubscriptionStatus {
  availableAgents: Array<{
    agentProductId: number;
    subscriptionId: number;
    name: string;
    description: string;
    imageUrl: string;
    isRunning: boolean;
  }>;
  runningAgents: Array<{
    runId: number;
    agentProductId: number;
    agentRunId: number;
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
    agentProductId: number;
    subscriptionPlanId: number;
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

export class BaseAssistantMode {
  protected assistant: YpAgentAssistant;

  constructor(assistant: YpAgentAssistant) {
    this.assistant = assistant;
  }

  protected get memory() {
    return this.assistant.memory;
  }

  protected get redis() {
    return this.assistant.redis;
  }

  protected get currentAgentId() {
    return this.assistant.currentAgentId;
  }

  protected set currentAgentId(value: number | undefined) {
    this.assistant.currentAgentId = value;
  }

  protected get currentAgent() {
    return this.assistant.currentAgent;
  }

  protected set currentAgent(value: PsAgent | undefined) {
    this.assistant.currentAgent = value;
  }

  protected get currentWorkflow() {
    return this.assistant.currentWorkflow;
  }

  protected set currentWorkflow(value: any) {
    this.assistant.currentWorkflow = value;
  }

  protected get availableAgents() {
    return this.assistant.availableAgents;
  }

  protected set availableAgents(value: PsAgent[]) {
    this.assistant.availableAgents = value;
  }

  protected get runningAgents() {
    return this.assistant.runningAgents;
  }

  protected set runningAgents(value: PsAgent[]) {
    this.assistant.runningAgents = value;
  }

  protected renderAllAgentsStatus() {
    if (this.availableAgents?.length === 0 && this.runningAgents?.length === 0) {
      return '';
    }
    return `<availableAgents>${JSON.stringify(
      this.availableAgents,
      null,
      2
    )}</availableAgents>
<runningAgents>${JSON.stringify(
      this.runningAgents,
      null,
      2
    )}</runningAgents>`;
  }

  protected renderCurrentWorkflowStatus() {
    if (!this.currentWorkflow) {
      return '';
    }
    return `<currentWorkflow>${JSON.stringify(
      this.currentWorkflow,
      null,
      2
    )}</currentWorkflow>`;
  }

  protected renderCurrentAgent() {
    if (!this.currentAgent) {
      return '';
    }
    return `<currentAgent>${JSON.stringify(
      this.currentAgent,
      null,
      2
    )}</currentAgent>`;
  }

  protected renderCommon() {
    if (!this.memory.currentMode) {
      return '';
    }
    console.log(`renderCommon: currentConversationMode ${this.memory.currentMode}`);
    return `<currentConversationMode>${this.memory.currentMode}</currentConversationMode>`;
  }

  protected async loadAllAgentPlans(): Promise<MyAgentPlanStatus> {
    try {
      // Get all available subscription plans with their associated agent products
      const availablePlans = await YpSubscriptionPlan.findAll({
        where: {
          //  status: 'active', // Only get active plans
        },
        include: [
          {
            model: YpAgentProduct,
            as: 'AgentProduct',
            attributes: {
              exclude: ['created_at', 'updated_at'],
            },
            include: [
              {
                model: YpAgentProductBundle,
                as: 'Bundles',
                required: false,
                attributes: {
                  exclude: ['created_at', 'updated_at'],
                },
              },
            ],
          },
        ],
      });

      return {
        availablePlans: availablePlans.map((plan) => ({
          agentProductId: plan.AgentProduct?.id || 0,
          subscriptionPlanId: plan.id,
          name: plan.AgentProduct?.name || plan.name,
          description:
            plan.AgentProduct?.description || 'No description available',
          imageUrl: plan.configuration?.imageUrl || '',
          price: plan.configuration?.amount || 0,
          currency: plan.configuration?.currency || 'USD',
          maxRunsPerCycle: plan.configuration?.max_runs_per_cycle || 0,
        })),
        systemStatus: {
          healthy: true,
          lastUpdated: new Date(),
        },
      };
    } catch (error) {
      console.error('Error loading available subscription plans:', error);
      return {
        availablePlans: [],
        systemStatus: {
          healthy: false,
          lastUpdated: new Date(),
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  protected async loadMyAgentSubscriptions(): Promise<MyAgentSubscriptionStatus> {
    try {
      // Get available agent products from user's subscriptions for their domain
      const availableAgents = await YpSubscription.findAll({
        where: {
          //domain_id: this.domainId, //TODO: get working
          status: 'active', // Only get active subscriptions
        },
        include: [
          {
            model: YpSubscriptionPlan,
            as: 'Plan',
          },
          {
            model: YpAgentProduct,
            as: 'AgentProduct',
            attributes: {
              exclude: ['created_at', 'updated_at'],
            },
            include: [
              {
                model: YpAgentProductBundle,
                as: 'Bundles',
                required: false,
                attributes: {
                  exclude: ['created_at', 'updated_at'],
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
          status: 'running',
        },
        include: [
          {
            model: YpSubscription,
            as: 'Subscription',
            //where: {
            //  domain_id: this.domainId
            //},
            include: [
              {
                model: YpAgentProduct,
                as: 'AgentProduct',
              },
              {
                model: YpSubscriptionPlan,
                as: 'Plan',
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
          imageUrl: subscription.Plan.configuration.imageUrl || '',
          isRunning: runningAgents.some(
            (run) =>
              run.Subscription?.AgentProduct?.id ===
              subscription.AgentProduct.id
          ),
        })),
        runningAgents: runningAgents.map((run) => ({
          runId: run.id,
          agentProductId: run.Subscription?.AgentProduct?.id || 0,
          agentRunId: run.id,
          agentName: run.Subscription?.AgentProduct?.name || '',
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
      console.error('Error loading agent status:', error);
      return {
        availableAgents: [],
        runningAgents: [],
        systemStatus: {
          healthy: false,
          lastUpdated: new Date(),
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  protected async validateAndSelectAgent(agentId: number): Promise<any> {
    // Implement agent validation logic
    const status = await this.loadMyAgentSubscriptions();
    const agent = status.availableAgents.find((a) => a.agentProductId === agentId);
    if (!agent) {
      throw new Error(
        `The user's agent with agentProductId ${agentId} not found or not available in ${JSON.stringify(
          status.availableAgents,
          null,
          2
        )}`
      );
    }
    return agent;
  }

  protected async stopAgent(agentId: number, reason?: string): Promise<any> {
    // Implement agent stop logic
    // This should communicate with your backend API
    const status = await this.loadMyAgentSubscriptions();
    const runningAgent = status.runningAgents.find(
      (a: any) => a.agentId === agentId
    );

    if (!runningAgent) {
      throw new Error('Agent is not running');
    }

    // Call your backend API to stop the agent
    // This is a placeholder - implement actual API call
    const stopResult = { status: 'stopped', timestamp: new Date() };

    // Update Redis status
    runningAgent.status = 'cancelled';
    await this.redis.set('agent_status', JSON.stringify(status));

    return stopResult;
  }

  protected async getRequiredQuestions(
    agentProductId: number
  ): Promise<any[]> {
    // Implement logic to get required questions
    return [];
  }

  protected async runAgentNextWorkflowStep(
    agentId: number,
    agentProductRunId: number
  ): Promise<any> {
    try {
      // Get the agent product run to access the workflow
      const agentProductRun = await YpAgentProductRun.findByPk(
        agentProductRunId
      );
      if (!agentProductRun || !agentProductRun.workflow) {
        throw new Error('Agent product run or workflow not found');
      }

      // Check if there's a next step
      const nextStep =
        agentProductRun.workflow.steps[
          agentProductRun.workflow.currentStepIndex + 1
        ];
      if (!nextStep) {
        // This was the last step, mark the run as completed
        agentProductRun.status = 'completed';
        agentProductRun.end_time = new Date();
        agentProductRun.duration = Math.floor(
          (agentProductRun.end_time.getTime() -
            agentProductRun.start_time.getTime()) /
            1000
        );
        await agentProductRun.save();
        return { status: 'completed', message: 'Workflow completed' };
      }

      // Start the next agent in the workflow
      const agentQueueManager = new NotificationAgentQueueManager(
        this.assistant.wsClients
      );
      let success = false;
      if (nextStep.agentId && this.assistant.wsClientId) {
        success = await agentQueueManager.startAgentProcessingWithWsClient(
          nextStep.agentId,
          agentProductRunId,
          this.assistant.wsClientId
        );
      }

      if (!success) {
        return {
          status: 'failed',
          message: 'Failed to start next workflow step',
        };
      } else {
        return {
          status: 'started',
          agentId: nextStep.agentId,
          message: 'Next workflow step started',
        };
      }
    } catch (error: any) {
      console.error('Error running next workflow step:', error);
      throw new Error(`Failed to run next workflow step: ${error.message}`);
    }
  }

  protected async handleQuestionsSubmitted(event: { detail: any }): Promise<void> {
    const answers = event.detail;
    if (this.currentAgentId) {
      await this.redis.set(
        `agent:${this.currentAgentId}:answers`,
        JSON.stringify(answers)
      );
      await this.assistant.handleModeSwitch(
        'agent_operations',
        'Configuration completed'
      );
    }
  }

  protected async getWorkflowStatus(agentId: number): Promise<any> {
    // Get workflow configuration and current status
    const configKey = `agent:${agentId}:workflow_config`;
    const statusKey = `agent:${agentId}:workflow_status`;

    const [configStr, statusStr] = await Promise.all([
      this.redis.get(configKey),
      this.redis.get(statusKey),
    ]);

    const config: any = configStr
      ? JSON.parse(configStr)
      : { steps: [] };
    const status = statusStr
      ? JSON.parse(statusStr)
      : {
          currentStepId: config.steps[0]?.id,
          progress: 0,
        };

    // Enhance steps with status information
    const enhancedSteps = config.steps.map((step: any) => ({
      ...step,
      status:
        step.id === status.currentStepId
          ? 'active'
          : step.id < status.currentStepId
          ? 'completed'
          : 'pending',
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

  protected async getWorkflowStepDetails(
    agentId: number,
    stepId: number,
    includeArtifacts: boolean
  ): Promise<any> {
    const key = `agent:${agentId}:step:${stepId}`;
    const detailsStr = await this.redis.get(key);
    const details = detailsStr ? JSON.parse(detailsStr) : null;

    if (!details) {
      throw new Error('Step details not found');
    }

    if (includeArtifacts) {
      const artifactsKey = `agent:${agentId}:step:${stepId}:artifacts`;
      const artifactsStr = await this.redis.get(artifactsKey);
      details.artifacts = artifactsStr ? JSON.parse(artifactsStr) : [];
    }

    return details;
  }

  protected handleWorkflowStepSelected(event: any): void {
    const stepId = event.detail.stepId;
    // Handle step selection - could trigger get_workflow_step_details
    // or show specific UI components based on step type
  }
}
