import { NotificationAgentQueueManager } from "../../../../managers/notificationAgentQueueManager.js";
import { YpAgentProductRun } from "../../../../models/agentProductRun.js";
import { SubscriptionModels } from "./subscriptions.js";
import { YpAgentAssistant } from "../../../../assistants/agentAssistant.js";
import { YpAgentProduct } from "../../../../models/agentProduct.js";
import WebSocket from "ws";
import { YpSubscription } from "../../../../models/subscription.js";

export class AgentModels {
  subscriptionModels: SubscriptionModels;
  assistant: YpAgentAssistant;
  private queueManager: NotificationAgentQueueManager;

  constructor(assistant: YpAgentAssistant) {
    this.assistant = assistant;
    this.subscriptionModels = new SubscriptionModels(assistant);
    this.queueManager = new NotificationAgentQueueManager(this.assistant.wsClients);
  }

  public async getCurrentAgent(): Promise<YpAgentProductAttributes> {
    if (!this.assistant.memory.currentAgentStatus?.subscriptionPlan.AgentProduct) {
      throw new Error("No current agent selected");
    }
    return this.assistant.memory.currentAgentStatus.subscriptionPlan.AgentProduct;
  }

  public async getCurrentSubscription(): Promise<YpSubscriptionAttributes> {
    if (!this.assistant.memory.currentAgentStatus?.subscription) {
      throw new Error("No current subscription found");
    }
    return this.assistant.memory.currentAgentStatus.subscription;
  }

  public async getCurrentSubscriptionPlan(): Promise<YpSubscriptionPlanAttributes> {
    if (!this.assistant.memory.currentAgentStatus?.subscriptionPlan) {
      throw new Error("No current subscription plan found");
    }
    return this.assistant.memory.currentAgentStatus.subscriptionPlan;
  }

  public async getCurrentAgentAndWorkflow(): Promise<{
    agent: YpAgentProductAttributes;
    run: YpAgentProductRunAttributes | undefined;
  }> {
    const agent = await this.getCurrentAgent();
    const currentRun = this.assistant.memory.currentAgentStatus?.activeAgentRun;

    if (!currentRun) {
      return {
        agent,
        run: undefined,
      };
    }

    return { agent, run: currentRun };
  }

  public async startCurrentWorkflowStep(
    agentRun: YpAgentProductRunAttributes
  ): Promise<{
    agentRun: YpAgentProductRunAttributes;
    message: string;
  }> {

    try {

      const agentRunToUpdate = await YpAgentProductRun.findByPk(agentRun.id);

      if (!agentRunToUpdate) {
        throw new Error("Agent run not found");
      }

      if (!this.assistant.memory.currentAgentStatus?.subscription) {
        throw new Error("No active subscription found for this agent");
      }

      const workflow = agentRunToUpdate.workflow;

      const totalSteps = workflow.steps.length;

      let currentStepIndex = workflow.currentStepIndex;

      const currentStep = workflow.steps[currentStepIndex];

      const isLastStep = currentStepIndex >= totalSteps - 1;

      if (currentStep.type !== "agentOps" && !isLastStep) {
        workflow.currentStepIndex++;
        currentStepIndex = workflow.currentStepIndex;
      }

      if (currentStepIndex >= totalSteps) {
        throw new Error(
          `Agent run ${agentRun.id} is already at the last step of the workflow`
        );
      }

      const agentId = currentStep.agentId;

      if (!agentId) {
        throw new Error("No agent ID found in the current step");
      }

      // Start processing with websocket client ID
      await this.queueManager.startAgentProcessingWithWsClient(
        agentId,
        agentRun.id,
        this.assistant.wsClientId
      );

      agentRunToUpdate.status = "running";

      agentRunToUpdate.changed("workflow", true);
      await agentRunToUpdate.save();

      return {
       agentRun: agentRunToUpdate,
        message: "Agent workflow started successfully",
      };

    } catch (error) {
      console.error(error);
      throw new Error("Error starting agent workflow step");
    }
  }

  public async stopAgentWorkflow(): Promise<{
    agent: YpAgentProductAttributes;
    run: YpAgentProductRunAttributes;
    message: string;
  }> {
    const agent = await this.getCurrentAgent();
    const currentRun = this.assistant.memory.currentAgentStatus?.activeAgentRun;

    if (!currentRun) {
      throw new Error("No active workflow found to stop");
    }

    // Stop processing using queue manager
    await this.queueManager.pauseAgentProcessing(agent.id);

    // Update run status
    currentRun.status = "cancelled";
    currentRun.end_time = new Date();
    await (currentRun as YpAgentProductRun).save();

    // Get current status from queue manager
    const queueStatus = await this.queueManager.getAgentStatus(agent.id);
    if (queueStatus) {
      console.log(`Current queue status for agent ${agent.id}:`, queueStatus);
    }

    return {
      agent,
      run: currentRun,
      message: "Agent workflow stopped successfully",
    };
  }

  public async checkAgentStatus(): Promise<PsAgentStatus | null> {
    const agent = await this.getCurrentAgent();
    return this.queueManager.getAgentStatus(agent.id);
  }
}