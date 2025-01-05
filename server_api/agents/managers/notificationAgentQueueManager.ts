import { Queue, QueueEvents } from "bullmq";
import { Redis, RedisOptions } from "ioredis";
import { AgentQueueManager } from "@policysynth/agents/operations/agentQueueManager.js";
import { PsAgent } from "@policysynth/agents/dbModels/agent.js";
import { PsAgentClass } from "@policysynth/agents/dbModels/agentClass.js";
import WebSocket from "ws";
import { YpAgentProductRun } from "../models/agentProductRun.js";
import models from "../../models/index.cjs";
import { YpSubscriptionPlan } from "../models/subscriptionPlan.js";
import { YpAgentProduct } from "../models/agentProduct.js";
import { YpSubscription } from "../models/subscription.js";
import { YpAgentProductBundle } from "../models/agentProductBundle.js";
import queue from "../../active-citizen/workers/queue.cjs";
const dbModels: Models = models;
const Group = dbModels.Group as GroupClass;
const User = dbModels.User as UserClass;
const Community = dbModels.Community as CommunityClass;
const Domain = dbModels.Domain as DomainClass;

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

  async sendNotification(
    agent: PsAgent,
    agentRun: YpAgentProductRun,
    action: string,
    wsClientId: string,
    status: string,
    result: any,
    agentRunId?: number,
    updatedWorkflow?: YpWorkflowConfiguration
  ) {
    console.log(
      "NotificationAgentQueueManager: Sending notification",
      agentRunId,
      updatedWorkflow
    );
    const wsClient = this.wsClients.get(wsClientId);
    if (wsClient) {
      wsClient.send(
        JSON.stringify({
          type: "updated_workflow",
          action,
          status,
          result,
          agentRunId,
          updatedWorkflow: { workflow: updatedWorkflow, status: status },
        })
      );
    } else {
      console.error(
        `NotificationAgentQueueManager: WebSocket client with ID ${wsClientId} not found`
      );
    }

    const currentWorkflowStep =
      updatedWorkflow?.steps[updatedWorkflow?.currentStepIndex];

    // Send email notification
    const subject = `${agentRun.Subscription?.Plan?.AgentProduct?.name} - ${currentWorkflowStep?.shortName} ready`;
    const content = `Next workflow step is ready: ${currentWorkflowStep?.description}`;

    const bundleId =
      agentRun.Subscription?.Plan?.AgentProduct?.AgentBundles?.[0]?.id || 1;

    await this.sendNotificationEmail(agent, subject, content, bundleId);
  }

  async sendNotificationEmail(
    agent: PsAgent,
    subject: string,
    content: string,
    bundleId: number
  ) {
    const group = (await Group.findOne({
      where: { id: agent.group_id },
      include: [
        { model: User, as: "GroupAdmins" },
        {
          model: Community,
          attributes: ["id", "name"],
          include: [
            { model: Domain, attributes: ["id", "name", "domain_name"] },
          ],
        },
      ],
    })) as YpGroupData;
    const link = `https://app.${group.Community?.Domain?.domain_name}/agent_bundle/${bundleId}?needsLogin=true`;

    if (group && group.GroupAdmins && group.GroupAdmins.length > 0) {
      const admins = group.GroupAdmins.filter((admin) => admin.email);

      const emailContent = `
        <div>
          <h1>${subject}</h1>
          <p>${content}</p>
        </div>
      `;

      const MAX_ADMIN_EMAILS = 25;

      for (let u = 0; u < Math.min(admins.length, MAX_ADMIN_EMAILS); u++) {
        queue.add(
          "send-one-email",
          {
            subject: subject,
            template: "general_user_notification",
            user: admins[u],
            domain: group.Community?.Domain,
            group: group,
            object: agent,
            header: "",
            content: emailContent,
            link: link,
          },
          { priority: "high" }
        );
      }
    } else {
      console.error("No group admins with email found");
      return;
    }
  }

  async goBackOneWorkflowStepIfNeeded(
    agentRunId: number,
    status: string,
    wsClientId: string,
    currentWorkflowStepIndex: number | undefined = undefined
  ) {
    // Get the agent run record
    const agentRun = await YpAgentProductRun.findByPk(agentRunId, {
      attributes: ["id", "workflow", "status"],
    });

    if (!agentRun || !agentRun.workflow) {
      console.error(
        `NotificationAgentQueueManager: Agent run ${agentRunId} or its workflow not found`
      );
      return;
    }

    const workflowConfig = agentRun.workflow as YpWorkflowConfiguration;
    if (
      currentWorkflowStepIndex !== undefined &&
      currentWorkflowStepIndex !== workflowConfig.currentStepIndex
    ) {
      console.error(
        "NotificationAgentQueueManager: Current workflow step index is undefined or matches the current step index, not advancing to the next step"
      );
      return;
    }

    if (currentWorkflowStepIndex === 0) {
      return;
    } else {
      let lastStatus: YpAgentProductRunStatus;
      if (
        workflowConfig.steps[workflowConfig.currentStepIndex].type ===
        "agentOps"
      ) {
        lastStatus = "waiting_on_user";
      } else {
        lastStatus = "running";
      }
      agentRun.status = lastStatus;
      workflowConfig.currentStepIndex--;
      agentRun.workflow = workflowConfig;
      agentRun.changed("workflow", true);
      agentRun.changed("status", true);
      await agentRun.save();
    }
  }

  async advanceWorkflowStepOrCompleteAgentRun(
    agentRunId: number,
    status: string,
    wsClientId: string,
    currentWorkflowStepIndex: number | undefined = undefined
  ) {
    try {
      console.log(
        "NotificationAgentQueueManager: Advancing workflow step or completing agent run",
        agentRunId,
        status
      );
      // Get the agent run record
      const agentRun = await YpAgentProductRun.findByPk(agentRunId, {
        attributes: ["id", "workflow", "status"],
      });

      if (!agentRun || !agentRun.workflow) {
        console.error(
          `NotificationAgentQueueManager: Agent run ${agentRunId} or its workflow not found`
        );
        return;
      }

      const workflowConfig = agentRun.workflow as YpWorkflowConfiguration;

      if (status === "failed") {
        // Mark the workflow as failed
        await agentRun.update({ status: "failed", completedAt: new Date() });
        return;
      }

      if (
        currentWorkflowStepIndex !== undefined &&
        currentWorkflowStepIndex !== workflowConfig.currentStepIndex
      ) {
        console.error(
          "NotificationAgentQueueManager: Current workflow step index is undefined or matches the current step index, not advancing to the next step"
        );
        return;
      }

      // Check if there are more steps
      if (workflowConfig.currentStepIndex < workflowConfig.steps.length - 1) {
        workflowConfig.currentStepIndex++;
        let nextStatus: YpAgentProductRunStatus;
        if (
          workflowConfig.steps[workflowConfig.currentStepIndex].type ===
          "agentOps"
        ) {
          nextStatus = "running";
        } else {
          nextStatus = "waiting_on_user";
        }
        agentRun.status = nextStatus;
        agentRun.workflow = workflowConfig;
        agentRun.changed("status", true);
        agentRun.changed("workflow", true);
        await agentRun.save();

        //TODO: UPDATE AGENT MEMORY, Maybe

        console.log(
          "NotificationAgentQueueManager: Updated workflow for agent run",
          agentRunId,
          status,
          workflowConfig
        );
      } else {
        // This was the last step, mark the workflow as completed
        agentRun.status = "completed";
        agentRun.changed("status", true);
        await agentRun.save();

        await agentRun.update({ status: "completed", completedAt: new Date() });
        console.log(
          "NotificationAgentQueueManager: Updated workflow for agent run",
          agentRunId,
          "to completed"
        );
      }

      return workflowConfig;
    } catch (error) {
      console.error(
        `NotificationAgentQueueManager: Error in advanceWorkflowStepOrCompleteAgentRun:`,
        error
      );
    }
  }

  async getAgentRun(agentRunId: number): Promise<YpAgentProductRun | null> {
    return await YpAgentProductRun.findOne({
      where: { id: agentRunId },
      attributes: ["id", "status", "workflow"],
      include: [
        {
          model: YpSubscription,
          as: "Subscription",
          attributes: ["id"],
          include: [
            {
              model: YpSubscriptionPlan,
              attributes: ["id", "name"],
              as: "Plan",
              include: [
                {
                  model: YpAgentProduct,
                  attributes: ["id", "name", "description"],
                  as: "AgentProduct",
                  include: [
                    {
                      model: YpAgentProductBundle,
                      attributes: ["id", "name"],
                      as: "AgentBundles",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  }

  getQueue(queueName: string): Queue {
    console.log(
      `NotificationAgentQueueManager: Getting queue for ${queueName}`
    );
    if (!this.queues.has(queueName)) {
      console.log(
        `NotificationAgentQueueManager: Creating new queue for ${queueName}`
      );
      const newQueue = new Queue(queueName, {
        connection: this.redisClient,
      });

      newQueue.on("error", (error) => {
        console.log(
          `NotificationAgentQueueManager: Error in queue ${queueName}:`,
          error
        );
      });

      newQueue.on("waiting", (jobId) => {
        console.log(`Job ${jobId} is waiting in queue ${queueName}`);
      });

      // Create QueueEvents instance for global events
      const queueEvents = new QueueEvents(queueName, {
        connection: this.redisClient,
      });

      // Add event listeners for debugging
      queueEvents.on("waiting", ({ jobId }) => {
        console.log(`Job ${jobId} is waiting in queue ${queueName}`);
      });

      queueEvents.on("active", ({ jobId, prev }) => {
        console.log(
          `Job ${jobId} is active in queue ${queueName} (prev state: ${prev})`
        );
      });

      queueEvents.on("completed", async ({ jobId, returnvalue }) => {
        console.log(
          `Job ${jobId} completed in queue ${queueName}. Result:`,
          returnvalue
        );

        try {
          console.log(
            "NotificationAgentQueueManager: Job completed in queue",
            queueName,
            jobId
          );
          // Retrieve the job instance
          const job = await newQueue.getJob(jobId);
          if (job) {
            const {
              agentId,
              type,
              wsClientId,
              agentRunId,
              currentWorkflowStepIndex,
            } = job.data;
            console.log("NotificationAgentQueueManager: Job data", job.data);

            console.log("NotificationAgentQueueManager: currentWorkflowStepIndex", currentWorkflowStepIndex);

            // Load the agent database record
            const agent = await PsAgent.findByPk(agentId, {
              include: [{ model: PsAgentClass, as: "Class" }],
            });

            const agentRun = await this.getAgentRun(agentRunId);

            if (!agentRun) {
              console.error(
                `NotificationAgentQueueManager: Agent run with ID ${agentRunId} not found.`
              );
              return;
            }

            console.log("NotificationAgentQueueManager: Agent", agent);

            let updatedWorkflow;

            if (
              agentRun.status === "running" ||
              agentRun.status === "waiting_on_user"
            ) {
              if (agentRunId) {
                updatedWorkflow =
                  await this.advanceWorkflowStepOrCompleteAgentRun(
                    agentRunId,
                    agentRun.status,
                    wsClientId,
                    currentWorkflowStepIndex
                  );
              } else {
                console.error(
                  `NotificationAgentQueueManager: Agent run ID ${agentRunId} not found.`
                );
              }
              if (agent) {
                // Send notification
                await this.sendNotification(
                  agent,
                  agentRun,
                  type,
                  wsClientId,
                  agentRun.status,
                  returnvalue,
                  agentRunId,
                  updatedWorkflow
                );
              } else {
                console.error(
                  `NotificationAgentQueueManager: Agent with ID ${agentId} not found.`
                );
              }
            } else if (agentRun.status === "stopped") {
              if (agentRunId) {
                updatedWorkflow = await this.goBackOneWorkflowStepIfNeeded(
                  agentRunId,
                  agentRun.status,
                  wsClientId,
                  currentWorkflowStepIndex
                );
              } else {
                console.error(
                  `NotificationAgentQueueManager: Agent run ID ${agentRunId} not found.`
                );
              }
            } else {
              console.error(
                `NotificationAgentQueueManager: Agent run ${agentRunId} is not completed, status ${agentRun.status} but the job completed`
              );
            }
          } else {
            console.error(
              `NotificationAgentQueueManager: Job with ID ${jobId} not found.`
            );
          }
        } catch (error) {
          console.error(
            `NotificationAgentQueueManager: Error handling job completion for job ${jobId}:`,
            error
          );
        }
      });

      queueEvents.on("failed", async ({ jobId, failedReason }) => {
        console.log(
          `Job ${jobId} failed in queue ${queueName}. Reason:`,
          failedReason
        );

        try {
          // Retrieve the job instance
          const job = await newQueue.getJob(jobId);
          if (job) {
            const { agentId, type, wsClientId, agentRunId } = job.data;
            console.log(
              "NotificationAgentQueueManager: FAILED Job data",
              job.data
            );

            // Load the agent database record
            const agent = await PsAgent.findByPk(agentId, {
              include: [{ model: PsAgentClass, as: "Class" }],
            });

            const agentRun = await this.getAgentRun(agentRunId);

            if (agent && agentRun) {
              // Send notification email
              //TODO: Fix this, the agent run should not be marked as failed if the job failed
              /*await this.sendNotification(
                agent,
                agentRun,
                type,
                wsClientId,
                "failed",
                failedReason,
                agentRunId,
                agentRun.workflow
              );*/
            } else {
              console.error(
                `NotificationAgentQueueManager: Agent with ID ${agentId} not found.`
              );
            }

            if (!agentRun) {
              console.error(
                `NotificationAgentQueueManager: Agent run with ID ${agentRunId} not found.`
              );
              return;
            }

            agentRun.workflow.steps[
              agentRun.workflow.currentStepIndex
            ].endTime = new Date();
            //TODO: Fix this, the agent run should not be marked as failed if the job failed
            //agentRun.status = "failed";
            agentRun.changed("status", true);
            agentRun.changed("workflow", true);
            await agentRun.save();
          } else {
            console.error(`Job with ID ${jobId} not found.`);
          }
        } catch (error) {
          console.error(`Error handling job failure for job ${jobId}:`, error);
        }
      });

      queueEvents.on("progress", ({ jobId, data }) => {
        console.log(
          `Job ${jobId} reported progress in queue ${queueName}:`,
          data
        );
      });

      queueEvents.on("removed", ({ jobId }) => {
        console.log(`Job ${jobId} was removed from queue ${queueName}`);
      });

      queueEvents.on("drained", () => {
        console.log(`Queue ${queueName} was drained`);
      });

      queueEvents.on("error", (error) => {
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

  async startAgentProcessingWithWsClient(
    agentId: number,
    agentRunId: number,
    wsClientId: string,
    structuredAnswersOverrides?: YpStructuredAnswer[]
  ): Promise<string | undefined> {
    console.log(
      `NotificationAgentQueueManager: Starting agent processing for agent ${agentId}`
    );
    const agent = await PsAgent.findByPk(agentId, {
      include: [{ model: PsAgentClass, as: "Class" }],
    });

    if (!agent || !agent.Class) {
      console.error(
        `NotificationAgentQueueManager: Agent or Agent Class not found for agent ${agentId}`
      );
      return undefined;
    }

    const agentRun = await this.getAgentRun(agentRunId);

    if (!agentRun) {
      console.error(
        `NotificationAgentQueueManager: Agent run with ID ${agentRunId} not found.`
      );
      return undefined;
    }

    const currentWorkflow = agentRun.workflow as YpWorkflowConfiguration;

    const queueName = agent.Class.configuration.queueName;
    const queue = this.getQueue(queueName);
    console.log(
      `NotificationAgentQueueManager: Adding start-processing job to queue ${queueName} for agent ${agentId}`
    );
    const action = "start";
    const job = await queue.add("control-message", {
      type: `${action}Agent${agent.id}`,
      agentId: agent.id,
      action: action,
      wsClientId: wsClientId,
      agentRunId: agentRunId,
      structuredAnswersOverrides: structuredAnswersOverrides,
      currentWorkflowStepIndex: currentWorkflow.currentStepIndex,
    });
    console.log(
      `NotificationAgentQueueManager: Updating agent ${agentId} status to running`
    );
    await this.updateAgentStatus(agent.id, "running");
    return job.id;
  }

  async stopAgentProcessing(
    agentId: number,
    wsClientId: string,
    agentRunId: number
  ): Promise<boolean> {
    console.log(
      `NotificationAgentQueueManager: Stopping agent processing for agent ${agentId}`
    );
    const agent = await PsAgent.findByPk(agentId, {
      include: [{ model: PsAgentClass, as: "Class" }],
    });

    if (!agent || !agent.Class) {
      throw Error(
        `NotificationAgentQueueManager: Agent or Agent Class not found for agent ${agentId}`
      );
    }

    const agentRun = await this.getAgentRun(agentRunId);

    if (!agentRun) {
      console.error(
        `NotificationAgentQueueManager: Agent run with ID ${agentRunId} not found.`
      );
      return false;
    }

    const currentWorkflow = agentRun.workflow as YpWorkflowConfiguration;

    const queueName = agent.Class.configuration.queueName;
    const queue = this.getQueue(queueName);
    const action = "stop";
    console.log(
      `NotificationAgentQueueManager: Adding stop-processing job to queue ${queueName} for agent ${agentId} ${action}`
    );
    await queue.add("control-message", {
      type: `${action}Agent${agent.id}`,
      agentId: agent.id,
      action: action,
      wsClientId: wsClientId,
      agentRunId: agentRunId,
      currentWorkflowStepIndex: currentWorkflow.currentStepIndex,
    });

    await this.updateAgentStatus(agent.id, "stopped");
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
