import { Queue, QueueEvents } from "bullmq";
import { Redis, RedisOptions } from "ioredis";
import { AgentQueueManager } from "@policysynth/agents/operations/agentQueueManager.js";
import { PsAgent } from "@policysynth/agents/dbModels/agent.js";
import { PsAgentClass } from "@policysynth/agents/dbModels/agentClass.js";
import WebSocket from "ws";

export class NotificationAgentQueueManager extends AgentQueueManager {
  redisClient!: Redis;
  queues: Map<string, Queue>;
  wsClients: Map<string, WebSocket>;

  constructor(wsClients: Map<string, WebSocket>) {
    super();
    console.log("NotificationAgentQueueManager: Initializing");
    this.initializeRedis();
    this.queues = new Map();
    this.wsClients = wsClients;
  }

  async sendNotification(agent: PsAgent, action: string, wsClientId: string, status: string, result: any) {
    const wsClient = this.wsClients.get(wsClientId);
    if (wsClient) {
      wsClient.send(JSON.stringify({ action, status, result }));
    }
  }

  getQueue(queueName: string): Queue {
    console.log(`NotificationAgentQueueManager: Getting queue for ${queueName}`);
    if (!this.queues.has(queueName)) {
      console.log(`NotificationAgentQueueManager: Creating new queue for ${queueName}`);
      const newQueue = new Queue(queueName, {
        connection: this.redisClient,
      });

      newQueue.on("error", (error) => {
        console.log(`NotificationAgentQueueManager: Error in queue ${queueName}:`, error);
      });

      newQueue.on("waiting", (jobId) => {
        console.log(`Job ${jobId} is waiting in queue ${queueName}`);
      });

      // Create QueueEvents instance for global events
      const queueEvents = new QueueEvents(queueName, {
        connection: this.redisClient,
      });

      // Add event listeners for debugging
      queueEvents.on('waiting', ({ jobId }) => {
        console.log(`Job ${jobId} is waiting in queue ${queueName}`);
      });

      queueEvents.on('active', ({ jobId, prev }) => {
        console.log(`Job ${jobId} is active in queue ${queueName} (prev state: ${prev})`);
      });

      queueEvents.on('completed', async ({ jobId, returnvalue }) => {
        console.log(`Job ${jobId} completed in queue ${queueName}. Result:`, returnvalue);

        try {
          // Retrieve the job instance
          const job = await newQueue.getJob(jobId);
          if (job) {
            const { agentId, type, wsClientId } = job.data;

            // Load the agent database record
            const agent = await PsAgent.findByPk(agentId, {
              include: [{ model: PsAgentClass, as: "Class" }],
            });

            if (agent) {
              // Send notification email
              await this.sendNotification(agent, type, wsClientId, 'completed', returnvalue);
            } else {
              console.error(`NotificationAgentQueueManager: Agent with ID ${agentId} not found.`);
            }
          } else {
            console.error(`NotificationAgentQueueManager: Job with ID ${jobId} not found.`);
          }
        } catch (error) {
          console.error(`NotificationAgentQueueManager: Error handling job completion for job ${jobId}:`, error);
        }
      });

      queueEvents.on('failed', async ({ jobId, failedReason }) => {
        console.log(`Job ${jobId} failed in queue ${queueName}. Reason:`, failedReason);

        try {
          // Retrieve the job instance
          const job = await newQueue.getJob(jobId);
          if (job) {
            const { agentId, type, wsClientId } = job.data;

            // Load the agent database record
            const agent = await PsAgent.findByPk(agentId, {
              include: [{ model: PsAgentClass, as: "Class" }],
            });

            if (agent) {
              // Send notification email
              await this.sendNotification(agent, type, wsClientId, 'failed', failedReason);
            } else {
              console.error(`NotificationAgentQueueManager: Agent with ID ${agentId} not found.`);
            }
          } else {
            console.error(`Job with ID ${jobId} not found.`);
          }
        } catch (error) {
          console.error(`Error handling job failure for job ${jobId}:`, error);
        }
      });

      queueEvents.on('progress', ({ jobId, data }) => {
        console.log(`Job ${jobId} reported progress in queue ${queueName}:`, data);
      });

      queueEvents.on('removed', ({ jobId }) => {
        console.log(`Job ${jobId} was removed from queue ${queueName}`);
      });

      queueEvents.on('drained', () => {
        console.log(`Queue ${queueName} was drained`);
      });

      queueEvents.on('error', (error) => {
        console.log(`Error in queue ${queueName}:`, error);
      });

      this.queues.set(queueName, newQueue);
    }
    return this.queues.get(queueName)!;
  }

  async controlAgent(agentId: number, action: string): Promise<string> {
    console.log(
      `AgentQueueManager: Controlling agent ${agentId} with action ${action}`
    );
    const agent = await PsAgent.findByPk(agentId, {
      include: [{ model: PsAgentClass, as: "Class" }],
    });

    if (!agent || !agent.Class) {
      console.error(
        `AgentQueueManager: Agent or Agent Class not found for agent ${agentId}`
      );
      throw new Error("Agent or Agent Class not found");
    }

    const queueName = agent.Class.configuration.queueName;
    if (!queueName) {
      console.error(
        `AgentQueueManager: Queue name not defined for agent class ${agent.Class.id}`
      );
      throw new Error("Queue name not defined for this agent class");
    }

    const queue = this.getQueue(queueName);

    console.log(
      `AgentQueueManager: Adding ${action} job to queue ${queueName} for agent ${agentId}`
    );
    await queue.add(`${action}Agent`, { agentId, action });

    const message = `${
      action.charAt(0).toUpperCase() + action.slice(1)
    } request for agent ${agentId} queued in ${queueName}`;
    console.log(`AgentQueueManager: ${message}`);
    return message;
  }

  async startAgentProcessing(agentId: number): Promise<boolean> {
    console.log(
      `AgentQueueManager: Starting agent processing for agent ${agentId}`
    );
    const agent = await PsAgent.findByPk(agentId, {
      include: [{ model: PsAgentClass, as: "Class" }],
    });

    if (!agent || !agent.Class) {
      console.error(
        `AgentQueueManager: Agent or Agent Class not found for agent ${agentId}`
      );
      return false;
    }

    const queueName = agent.Class.configuration.queueName;
    const queue = this.getQueue(queueName);
    console.log(
      `AgentQueueManager: Adding start-processing job to queue ${queueName} for agent ${agentId}`
    );
    await queue.add("control-message", {
      type: "start-processing",
      agentId: agent.id,
    });
    console.log(
      `AgentQueueManager: Updating agent ${agentId} status to running`
    );
    await this.updateAgentStatus(agent.id, "running");
    return true;
  }

  async pauseAgentProcessing(agentId: number): Promise<boolean> {
    const agent = await PsAgent.findByPk(agentId, {
      include: [{ model: PsAgentClass, as: "Class" }],
    });
    if (!agent || !agent.Class) return false;

    const queueName = agent.Class.configuration.queueName;
    const queue = this.getQueue(queueName);
    await queue.add("control-message", {
      type: "pause-processing",
      agentId: agent.id,
    });
    await this.updateAgentStatus(agent.id, "paused");
    return true;
  }

  async getAgentStatus(agentId: number): Promise<PsAgentStatus | null> {
    const agent = await PsAgent.findByPk(agentId, {
      include: [{ model: PsAgentClass, as: "Class" }],
    });

    if (agent) {
      const statusDataString = await this.redisClient.get(agent.redisStatusKey);
      if (statusDataString) {
        const statusData: PsAgentStatus = JSON.parse(statusDataString);
        return statusData;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  async updateAgentStatus(
    agentId: number,
    state: PsAgentStatus["state"],
    progress?: number,
    message?: string,
    details?: Record<string, any>
  ): Promise<boolean> {
    const agent = await PsAgent.findByPk(agentId, {
      include: [{ model: PsAgentClass, as: "Class" }],
    });

    if (agent) {
      const statusDataString = await this.redisClient.get(agent.redisStatusKey);
      if (statusDataString) {
        const statusData: PsAgentStatus = JSON.parse(statusDataString);
        statusData.state = state;
        statusData.lastUpdated = Date.now();
        if (progress !== undefined) statusData.progress = progress;
        if (message) statusData.messages.push(message);
        if (details)
          statusData.details = {
            ...statusData.details,
            ...details,
          };
        await this.redisClient.set(
          agent.redisStatusKey,
          JSON.stringify(statusData)
        );
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
