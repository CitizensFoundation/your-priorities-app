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
import queue from "../../services/workers/queue.cjs";
import { EmailTemplateRenderer } from "./emailTemplateRenderer.js";
import log from "../../utils/loggerTs.js";
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
    log.info("NotificationAgentQueueManager: Initializing");
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
    updatedWorkflow?: YpAgentRunWorkflowConfiguration
  ) {
    log.info(
      "NotificationAgentQueueManager: Sending notification",
      agentRunId,
      updatedWorkflow
    );
    const wsClient = this.wsClients.get(wsClientId);
    if (wsClient) {
      const currentWorkflowStep =
        updatedWorkflow?.steps[updatedWorkflow?.currentStepIndex];
      wsClient.send(
        JSON.stringify({
          type: "updated_workflow",
          action,
          status,
          result,
          agentRunId,
          updatedWorkflow: {
            workflow: updatedWorkflow,
            status: status,
            currentWorkflowStep,
          },
        })
      );
    } else {
      log.error(
        `NotificationAgentQueueManager: WebSocket client with ID ${wsClientId} not found`
      );
    }

    if (updatedWorkflow) {
      await this.sendNotificationEmail(agent, agentRun, updatedWorkflow);
    } else {
      log.error("NotificationAgentQueueManager: No updated workflow found");
    }
  }

  async sendNotificationEmail(
    agent: PsAgent,
    agentRun: YpAgentProductRun,
    updatedWorkflow: YpAgentRunWorkflowConfiguration
  ) {
    // Send email notification
    const subject = `${agentRun.Subscription?.Plan?.AgentProduct?.name} - ${
      updatedWorkflow?.steps[updatedWorkflow?.currentStepIndex]?.shortName
    } ready`;

    const bundleId =
      agentRun.Subscription?.Plan?.AgentProduct?.AgentBundles?.[0]?.id || 1;

    const currentWorkflowStep =
      updatedWorkflow?.steps[updatedWorkflow?.currentStepIndex];

    const userId = agentRun.Subscription?.user_id;

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
      let admins = group.GroupAdmins.filter((admin) => admin.email);

      const emailContent = EmailTemplateRenderer.renderEmail(
        "",
        "",
        agentRun.Subscription?.Plan?.AgentProduct?.name || "",
        updatedWorkflow,
        link,
        "https://evoly.ai/is/amplifier/img/amplifier-logo.png",
        "https://evoly.ai/is/amplifier/img/evoly-bw-logo.png",
        "https://evoly.ai/",
        "© 2024 Evoly ehf, Vegmuli 8, 108, Reykjavik, Iceland"
      );

      const MAX_ADMIN_EMAILS = 25;

      // Deduplicate admins using Set
      admins = Array.from(new Set(admins.map((admin) => admin.email)))
        .map((email) => admins.find((admin) => admin.email === email))
        .filter((admin): admin is (typeof admins)[0] => admin !== undefined);

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
            skipHeaderAndFooter: true,
          },
          { priority: "high" }
        );
      }
    } else {
      log.error("No group admins with email found");
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
      log.error(
        `NotificationAgentQueueManager: Agent run ${agentRunId} or its workflow not found`
      );
      return;
    }

    const workflowConfig = agentRun.workflow as YpAgentRunWorkflowConfiguration;
    if (
      currentWorkflowStepIndex !== undefined &&
      currentWorkflowStepIndex !== workflowConfig.currentStepIndex
    ) {
      log.error(
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
      log.info(
        "NotificationAgentQueueManager: Advancing workflow step or completing agent run",
        agentRunId,
        status
      );
      // Get the agent run record
      const agentRun = await YpAgentProductRun.findByPk(agentRunId, {
        attributes: ["id", "workflow", "status"],
        include: [
          {
            model: YpSubscription,
            as: "Subscription",
            attributes: ["id", "user_id"],
          },
        ],
      });

      if (!agentRun || !agentRun.workflow) {
        log.error(
          `NotificationAgentQueueManager: Agent run ${agentRunId} or its workflow not found`
        );
        return;
      }

      const workflowConfig = agentRun.workflow as YpAgentRunWorkflowConfiguration;

      if (status === "failed") {
        // Mark the workflow as failed
        await agentRun.update({ status: "failed", completedAt: new Date() });
        return;
      }

      if (
        currentWorkflowStepIndex !== undefined &&
        currentWorkflowStepIndex !== workflowConfig.currentStepIndex
      ) {
        log.error(
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

        log.info(
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
        log.info(
          "NotificationAgentQueueManager: Updated workflow for agent run",
          agentRunId,
          "to completed"
        );
      }

      return workflowConfig;
    } catch (error) {
      log.error(
        `NotificationAgentQueueManager: Error in advanceWorkflowStepOrCompleteAgentRun:`,
        error
      );
    }
  }

  static async getAgentRun(
    agentRunId: number
  ): Promise<YpAgentProductRun | null> {
    return await YpAgentProductRun.findOne({
      where: { id: agentRunId },
      attributes: ["id", "status", "workflow"],
      include: [
        {
          model: YpSubscription,
          as: "Subscription",
          attributes: ["id", "user_id"],
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
    log.info(
      `NotificationAgentQueueManager: Getting queue for ${queueName}`
    );
    if (!this.queues.has(queueName)) {
      log.info(
        `NotificationAgentQueueManager: Creating new queue for ${queueName}`
      );
      const newQueue = new Queue(queueName, {
        connection: this.redisClient,
      });

      newQueue.on("error", (error) => {
        log.info(
          `NotificationAgentQueueManager: Error in queue ${queueName}:`,
          error
        );
      });

      newQueue.on("waiting", (jobId) => {
        log.info(`Job ${jobId} is waiting in queue ${queueName}`);
      });

      // Create QueueEvents instance for global events
      const queueEvents = new QueueEvents(queueName, {
        connection: this.redisClient,
      });

      // Add event listeners for debugging
      queueEvents.on("waiting", ({ jobId }) => {
        log.info(`Job ${jobId} is waiting in queue ${queueName}`);
      });

      queueEvents.on("active", ({ jobId, prev }) => {
        log.info(
          `Job ${jobId} is active in queue ${queueName} (prev state: ${prev})`
        );
      });

      queueEvents.on("completed", async ({ jobId, returnvalue }) => {
        log.info(
          `Job ${jobId} completed in queue ${queueName}. Result:`,
          returnvalue
        );

        try {
          log.info(
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
            log.info("NotificationAgentQueueManager: Job data", job.data);

            log.info(
              "NotificationAgentQueueManager: currentWorkflowStepIndex",
              currentWorkflowStepIndex
            );

            // Load the agent database record
            const agent = await PsAgent.findByPk(agentId, {
              include: [{ model: PsAgentClass, as: "Class" }],
            });

            const agentRun = await NotificationAgentQueueManager.getAgentRun(
              agentRunId
            );

            if (!agentRun) {
              log.error(
                `NotificationAgentQueueManager: Agent run with ID ${agentRunId} not found.`
              );
              return;
            }

            log.info("NotificationAgentQueueManager: Agent", agent);

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
                log.error(
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
                log.error(
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
                log.error(
                  `NotificationAgentQueueManager: Agent run ID ${agentRunId} not found.`
                );
              }
            } else {
              log.error(
                `NotificationAgentQueueManager: Agent run ${agentRunId} is not completed, status ${agentRun.status} but the job completed`
              );
            }
          } else {
            log.error(
              `NotificationAgentQueueManager: Job with ID ${jobId} not found.`
            );
          }
        } catch (error) {
          log.error(
            `NotificationAgentQueueManager: Error handling job completion for job ${jobId}:`,
            error
          );
        }
      });

      queueEvents.on("failed", async ({ jobId, failedReason }) => {
        log.info(
          `Job ${jobId} failed in queue ${queueName}. Reason:`,
          failedReason
        );

        try {
          // Retrieve the job instance
          const job = await newQueue.getJob(jobId);
          if (job) {
            const { agentId, type, wsClientId, agentRunId } = job.data;
            log.info(
              "NotificationAgentQueueManager: FAILED Job data",
              job.data
            );

            // Load the agent database record
            const agent = await PsAgent.findByPk(agentId, {
              include: [{ model: PsAgentClass, as: "Class" }],
            });

            const agentRun = await NotificationAgentQueueManager.getAgentRun(
              agentRunId
            );

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
              log.error(
                `NotificationAgentQueueManager: Agent with ID ${agentId} not found.`
              );
            }

            if (!agentRun) {
              log.error(
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
            log.error(`Job with ID ${jobId} not found.`);
          }
        } catch (error) {
          log.error(`Error handling job failure for job ${jobId}:`, error);
        }
      });

      queueEvents.on("progress", ({ jobId, data }) => {
        log.info(
          `Job ${jobId} reported progress in queue ${queueName}:`,
          data
        );
      });

      queueEvents.on("removed", ({ jobId }) => {
        log.info(`Job ${jobId} was removed from queue ${queueName}`);
      });

      queueEvents.on("drained", () => {
        log.info(`Queue ${queueName} was drained`);
      });

      queueEvents.on("error", (error) => {
        log.info(`Error in queue ${queueName}:`, error);
      });

      this.queues.set(queueName, newQueue);
    }
    return this.queues.get(queueName)!;
  }

  async controlAgent(agentId: number, action: string): Promise<string> {
    log.info(
      `AgentQueueManager: Controlling agent ${agentId} with action ${action}`
    );
    const agent = await PsAgent.findByPk(agentId, {
      include: [{ model: PsAgentClass, as: "Class" }],
    });

    if (!agent || !agent.Class) {
      log.error(
        `AgentQueueManager: Agent or Agent Class not found for agent ${agentId}`
      );
      throw new Error("Agent or Agent Class not found");
    }

    const queueName = agent.Class.configuration.queueName;
    if (!queueName) {
      log.error(
        `AgentQueueManager: Queue name not defined for agent class ${agent.Class.id}`
      );
      throw new Error("Queue name not defined for this agent class");
    }

    const queue = this.getQueue(queueName);

    log.info(
      `AgentQueueManager: Adding ${action} job to queue ${queueName} for agent ${agentId}`
    );
    await queue.add(`${action}Agent`, { agentId, action });

    const message = `${
      action.charAt(0).toUpperCase() + action.slice(1)
    } request for agent ${agentId} queued in ${queueName}`;
    log.info(`AgentQueueManager: ${message}`);
    return message;
  }

  async startAgentProcessingWithWsClient(
    agentId: number,
    agentRunId: number,
    wsClientId: string,
    structuredAnswersOverrides?: YpStructuredAnswer[]
  ): Promise<string | undefined> {
    log.info(
      `NotificationAgentQueueManager: Starting agent processing for agent ${agentId}`
    );
    const agent = await PsAgent.findByPk(agentId, {
      include: [{ model: PsAgentClass, as: "Class" }],
    });

    if (!agent || !agent.Class) {
      log.error(
        `NotificationAgentQueueManager: Agent or Agent Class not found for agent ${agentId}`
      );
      return undefined;
    }

    const agentRun = await NotificationAgentQueueManager.getAgentRun(
      agentRunId
    );

    if (!agentRun) {
      log.error(
        `NotificationAgentQueueManager: Agent run with ID ${agentRunId} not found.`
      );
      return undefined;
    }

    const currentWorkflow = agentRun.workflow as YpAgentRunWorkflowConfiguration;

    const queueName = agent.Class.configuration.queueName;
    const queue = this.getQueue(queueName);
    log.info(
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
    log.info(
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
    log.info(
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

    const agentRun = await NotificationAgentQueueManager.getAgentRun(
      agentRunId
    );

    if (!agentRun) {
      log.error(
        `NotificationAgentQueueManager: Agent run with ID ${agentRunId} not found.`
      );
      return false;
    }

    const currentWorkflow = agentRun.workflow as YpAgentRunWorkflowConfiguration;

    const queueName = agent.Class.configuration.queueName;
    const queue = this.getQueue(queueName);
    const action = "stop";
    log.info(
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
