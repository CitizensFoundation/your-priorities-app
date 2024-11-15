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
    if (!this.assistant.memory.currentAgentStatus?.agentProduct) {
      throw new Error("No current agent selected");
    }
    return this.assistant.memory.currentAgentStatus.agentProduct;
  }

  public async getCurrentSubscription(): Promise<YpSubscriptionAttributes> {
    if (!this.assistant.memory.currentAgentStatus?.subscription) {
      throw new Error("No current subscription found");
    }
    return this.assistant.memory.currentAgentStatus.subscription;
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

  public async startAgentWorkflow(): Promise<{
    agent: YpAgentProductAttributes;
    run: YpAgentProductRunAttributes;
    message: string;
  }> {
    const agent = await this.getCurrentAgent();

    if (!this.assistant.memory.currentAgentStatus?.subscription) {
      throw new Error("No active subscription found for this agent");
    }

    // Create new run
    const newRun = await YpAgentProductRun.create({
      subscription_id: this.assistant.memory.currentAgentStatus.subscription.id,
      start_time: new Date(),
      status: "running",
      workflow: agent.configuration.workflow,
    }) as YpAgentProductRunAttributes;

    // Get or create a websocket client ID for this session
    const wsClientId = this.assistant.memory?.redisKey || `client_${Date.now()}`;

    // Start processing with websocket client ID
    await this.queueManager.startAgentProcessingWithWsClient(
      agent.id,
      newRun.id,
      wsClientId
    );

    return {
      agent,
      run: newRun,
      message: "Agent workflow started successfully",
    };
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