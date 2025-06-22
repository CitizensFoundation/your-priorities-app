import { NotificationAgentQueueManager } from "../managers/notificationAgentQueueManager.js";
import { AgentManager } from "@policysynth/agents/operations/agentManager.js";
import { YpAgentProductRun } from "../models/agentProductRun.js";
import WebSocket from "ws";

export class TaskManager {
  private queueManager: NotificationAgentQueueManager;
  private agentManager: AgentManager;

  constructor(wsClients: Map<string, WebSocket>) {
    this.queueManager = new NotificationAgentQueueManager(wsClients);
    this.agentManager = new AgentManager();
  }

  async startTask(
    configuration: YpAgentProductConfiguration,
    communityIdToCloneFrom: number,
    wsClientId: string
  ): Promise<YpAgentProductRun> {
    // Create a run for the provided workflow configuration
    const run = await YpAgentProductRun.create({
      subscription_id: null,
      start_time: new Date(),
      workflow: configuration.workflow,
      status: "ready",
    });

    const firstStep = configuration.workflow.steps[0];
    if (firstStep && firstStep.agentId) {
      await this.queueManager.startAgentProcessingWithWsClient(
        firstStep.agentId,
        run.id,
        wsClientId,
        configuration.structuredAnswersOverride
      );
    }

    return run;
  }

  async stopTask(
    agentId: number,
    agentRunId: number,
    wsClientId: string
  ): Promise<boolean> {
    return this.queueManager.stopAgentProcessing(agentId, wsClientId, agentRunId);
  }

  async agentStatus(agentId: number) {
    return this.queueManager.getAgentStatus(agentId);
  }

  async getAgentMemory(
    groupId: string,
    agentId: number,
    redisClient: any
  ): Promise<any> {
    const key = await this.agentManager.getSubAgentMemoryKey(groupId, agentId);
    if (!key) return null;
    const memoryContents = await redisClient.get(key);
    return memoryContents ? JSON.parse(memoryContents) : null;
  }
}
