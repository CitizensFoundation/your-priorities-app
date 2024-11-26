// SubscriptionManager.ts

import { YpSubscriptionPlan } from "../models/subscriptionPlan.js";
import { YpSubscription } from "../models/subscription.js";
import { YpAgentProduct } from "../models/agentProduct.js";
import { YpAgentProductRun } from "../models/agentProductRun.js";
import { sequelize } from "@policysynth/agents/dbModels/sequelize.js";

import { copyCommunity, copyGroup } from "../../utils/copy_utils.cjs";

import Stripe from "stripe";
import { YpAgentProductBundle } from "../models/agentProductBundle.js";
import { PsAgentConnector } from "@policysynth/agents/dbModels/agentConnector.js";
import { PsAgent } from "@policysynth/agents/dbModels/agent.js";
import { PsAgentClass, PsAiModel } from "@policysynth/agents/dbModels/index.js";
import { NotificationAgentQueueManager } from "./notificationAgentQueueManager.js";
import WebSocket from "ws";
import models from "../../models/index.cjs";

const dbModels: Models = models;
const YpGroup = dbModels.Group as GroupClass;

export class SubscriptionManager {
  constructor() {
    // Initialize if necessary
  }

  // Get available subscription plans
  async getPlans(): Promise<YpSubscriptionPlan[]> {
    try {
      const plans = await YpSubscriptionPlan.findAll({
        attributes: {
          exclude: ["created_at", "updated_at"],
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
                as: "AgentBundles",
                attributes: {
                  exclude: ["created_at", "updated_at"],
                },
              },
            ],
          },
        ],
      });
      return plans;
    } catch (error: any) {
      throw new Error(`Error fetching subscription plans: ${error.message}`);
    }
  }

  async cloneCommunityTemplate(
    communityTemplateId: number,
    toDomainId: number
  ): Promise<any> {
    console.log("cloneCommunityTemplate", communityTemplateId, toDomainId);
    return new Promise((resolve, reject) => {
      copyCommunity(
        communityTemplateId,
        toDomainId,
        {
          copyGroups: true,
          copyPosts: false,
          copyPoints: false,
          skipUsers: true,
          recountGroupPosts: true,
          skipEndorsementQualitiesAndRatings: true,
          resetEndorsementCounters: true,
          skipActivities: true,
        },
        null,
        (error: any, newCommunity: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(newCommunity);
          }
        }
      );
    });
  }

  async cloneCommunityWorkflowTemplate(
    agentProduct: YpAgentProduct,
    domainId: number,
    currentUser: UserClass
  ): Promise<{ workflow: YpWorkflowConfiguration; requiredQuestions?: any[] }> {
    console.log("cloneCommunityWorkflowTemplate", agentProduct, domainId);
    let newCommunity = await this.cloneCommunityTemplate(
      /*agentProduct.configuration.templateWorkflowCommunityId*/ 10054  /*11*/,
      domainId
    );

    console.log("newCommunity", newCommunity);

    const groups = await YpGroup.findAll({
      where: {
        community_id: newCommunity.id
      }
    }) as GroupClass[];

    console.log("groups", groups);

    // Find the workflow group
    const workflowGroup = groups.find(
      (group: any) => group.configuration.groupType == 3
    );

    if (!workflowGroup) {
      throw new Error("Workflow group not found");
    }

    // Get the top level agent ID from the workflow group configuration
    const topLevelAgentId = workflowGroup.configuration.agents?.topLevelAgentId;
    if (!topLevelAgentId) {
      throw new Error(
        "Top level agent ID not found in workflow group configuration"
      );
    }

    /*for (const group of groups) {
      const hasAdmin = await group.hasGroupAdmins(currentUser);
      if (!hasAdmin) {
        await group.addGroupAdmins(currentUser);
        console.log("Added current user as group admin", currentUser.id);
      } else {
        console.log("Group already has the user as admin", currentUser.id);
      }
    }*/

    // Create a map of old group IDs to new group IDs
    const groupIdMap = newCommunity.groupMapping;

    console.log("groupIdMap", groupIdMap);

    // Get the original top level agent and all its sub-agents
    const originalTopLevelAgent = await PsAgent.findByPk(topLevelAgentId, {
      include: [
        {
          model: PsAgentClass,
          as: "Class",
          attributes: {
            exclude: ["created_at", "updated_at"],
          },
        },
        {
          model: PsAgent,
          as: "SubAgents",
          include: [
            {
              model: PsAgentClass,
              as: "Class",
              attributes: {
                exclude: ["created_at", "updated_at"],
              },
            },
            {
              model: PsAiModel,
              as: "AiModels",
            },
            {
              model: PsAgentConnector,
              as: "InputConnectors",
            },
            {
              model: PsAgentConnector,
              as: "OutputConnectors",
            },
          ],
        },
      ],
    });

    if (!originalTopLevelAgent) {
      throw new Error("Original top level agent not found");
    }

    // Create a map to store agentClassUuid to new agent ID mappings
    const agentUuidMap = new Map<string, number>();
    const { uuid, user_id, class_id, configuration } = originalTopLevelAgent;

    // Clone the top level agent and store its mapping
    const clonedTopLevelAgent = await PsAgent.create({
      user_id,
      class_id,
      configuration,
      group_id: workflowGroup.id,
      parent_agent_id: undefined
    });

    console.log("clonedTopLevelAgent", clonedTopLevelAgent);

    if (originalTopLevelAgent.Class?.class_base_id) {
      console.log("Setting agentUuidMap", originalTopLevelAgent.Class.class_base_id, clonedTopLevelAgent.id);
      agentUuidMap.set(
        originalTopLevelAgent.Class.class_base_id,
        clonedTopLevelAgent.id
      );
    }

    const agentInputConnectorGroupsIds = new Map<number, number>();
    const agentOutputConnectorGroupsIds = new Map<number, number>();

    // Clone sub-agents and their connectors
    for (const subAgent of originalTopLevelAgent.SubAgents ?? []) {
      const { uuid, user_id, class_id, configuration } = subAgent;

      const clonedSubAgent = await PsAgent.create({
        user_id,
        class_id,
        configuration,
        group_id: workflowGroup.id,
        parent_agent_id: clonedTopLevelAgent.id,
      });

      // Store the mapping of agentClassUuid to new agent ID
      if (subAgent.Class?.class_base_id) {
        agentUuidMap.set(subAgent.Class.class_base_id, clonedSubAgent.id);
      }

      console.log("agentUuidMap", agentUuidMap);

      const subAgentAiModels = await subAgent.getAiModels();
      if (subAgentAiModels && subAgentAiModels.length > 0) {
        await clonedSubAgent.setAiModels(subAgentAiModels);
      }

      // Clone input connectors and update group IDs
      for (const connector of (subAgent.InputConnectors ??
        []) as PsAgentConnector[]) {
        const connectorConfig = { ...connector.configuration };

        console.log("connectorConfig", connectorConfig);

        // Update the group ID if it exists in the map
        if (
          connectorConfig.groupId &&
          groupIdMap.has(connectorConfig.groupId)
        ) {
          connectorConfig.groupId = groupIdMap.get(connectorConfig.groupId);
          agentInputConnectorGroupsIds.set(clonedSubAgent.id, connectorConfig.groupId);
        }

        const { user_id, group_id, configuration, class_id } = connector;

        const clonedConnector = await PsAgentConnector.create({
          user_id: clonedSubAgent.user_id,
          group_id: workflowGroup.id,
          class_id,
          configuration: connectorConfig,
        });

        await sequelize.models.AgentInputConnectors.create({
          agent_id: clonedSubAgent.id,
          connector_id: clonedConnector.id,
        });
      }

      // Clone output connectors and update group IDs
      for (const connector of (subAgent.OutputConnectors ??
        []) as PsAgentConnector[]) {
        const connectorConfig = { ...connector.configuration };

        console.log("connectorConfig", connectorConfig);

        // Update the group ID if it exists in the map
        if (
          connectorConfig.groupId &&
          groupIdMap.has(connectorConfig.groupId)
        ) {
          connectorConfig.groupId = groupIdMap.get(connectorConfig.groupId);
          agentOutputConnectorGroupsIds.set(clonedSubAgent.id, connectorConfig.groupId);
        }

        const { user_id, group_id, configuration, class_id } = connector;

        const clonedConnector = await PsAgentConnector.create({
          user_id: clonedSubAgent.user_id,
          group_id: workflowGroup.id,
          class_id,
          configuration: connectorConfig,
        });

        await sequelize.models.AgentOutputConnectors.create({
          agent_id: clonedSubAgent.id,
          connector_id: clonedConnector.id,
        });
      }
    }

    // Update the workflow group configuration
    workflowGroup.configuration.agents!.topLevelAgentId = clonedTopLevelAgent.id;
    await (workflowGroup as GroupClass).save();

    if (agentProduct.configuration.structuredAnswersOverride) {
      for (const override of agentProduct.configuration
        .structuredAnswersOverride) {
        // Apply overrides to all agents in the workflow
        for (const agent of [
          ...(originalTopLevelAgent.SubAgents ?? []),
          originalTopLevelAgent,
        ]) {
          console.log("update answers for agent", agent);
          if (agent.configuration?.answers) {
            const answerIndex = agent.configuration.answers.findIndex(
              (a: any) => a.uniqueId === override.uniqueId
            );
            if (answerIndex !== -1) {
              console.log("update answers for agent", agent.configuration.answers[answerIndex], override);
              agent.configuration.answers[answerIndex] = {
                ...agent.configuration.answers[answerIndex],
                ...override,
              };
            }
          }
        }
      }
    }

    // Update workflow steps with new agent IDs
    const updatedWorkflow = { ...agentProduct.configuration.workflow };
    updatedWorkflow.steps = agentProduct.configuration.workflow.steps.map(
      (step) => {
        const newStep = { ...step };
        if (step.agentClassUuid && agentUuidMap.has(step.agentClassUuid)) {
          newStep.agentId = agentUuidMap.get(step.agentClassUuid);
        }

        if (newStep.type === "engagmentFromInputConnector" && newStep.agentId) {
          newStep.groupId = agentInputConnectorGroupsIds.get(newStep.agentId);
        } else if (newStep.type === "engagmentFromOutputConnector" && newStep.agentId) {
          newStep.groupId = agentOutputConnectorGroupsIds.get(newStep.agentId);
        }
        return newStep;
      }
    );

    updatedWorkflow.workflowGroupId = workflowGroup.id;

    console.log("updatedWorkflow", updatedWorkflow);

    return {
      workflow: updatedWorkflow,
      requiredQuestions: agentProduct.configuration.requiredStructuredQuestions,
    };
  }

  // Create subscriptions for a user
  async createSubscriptions(
    userId: number,
    planIds: number[],
    paymentMethodId: string | null
  ): Promise<{ clientSecret?: string; subscriptionId?: string; freeSubscription?: boolean }> {
    try {


      let totalAmount = 0;
      const currency = "usd";

      // Calculate total amount to charge
      for (let i = 0; i < planIds.length; i++) {
        const plan = await YpSubscriptionPlan.findByPk(planIds[i]);
        if (!plan) {
          throw new Error(`Subscription plan with ID ${planIds[i]} not found`);
        }
        totalAmount += Number(plan.configuration.amount) * 100;
      }

      // If total amount is 0, return early indicating free subscription
      if (totalAmount === 0) {
        return { freeSubscription: true };
      }

      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2024-09-30.acacia",
      });

      // Create a PaymentIntent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount,
        currency: currency,
        payment_method: paymentMethodId ?? undefined,
        confirmation_method: "manual",
        confirm: false,
        payment_method_types: ["card"],
        description: "Subscription Purchase",
        metadata: {
          userId: userId.toString(),
          planIds: planIds.join(","),
        },
      });

      // Return the client secret for frontend confirmation
      return {
        clientSecret: paymentIntent.client_secret!,
        subscriptionId: paymentIntent.id,
      };
    } catch (error: any) {
      if (error instanceof Stripe.errors.StripeCardError) {
        throw new Error(`Payment failed: ${error.message}`);
      } else if (error instanceof Stripe.errors.StripeInvalidRequestError) {
        throw new Error(`Invalid payment request: ${error.message}`);
      } else {
        throw new Error(`Error creating subscriptions: ${error.message}`);
      }
    }
  }

  // Add a new method to handle successful payments
  async handleSuccessfulPayment(
    paymentIntentId: string
  ): Promise<YpSubscription[]> {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2024-09-30.acacia",
      });

      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      if (paymentIntent.status !== "succeeded") {
        throw new Error("Payment not successful");
      }

      const userId = Number(paymentIntent.metadata.userId);
      const agentProductIds = paymentIntent.metadata.agentProductIds
        .split(",")
        .map(Number);
      const planIds = paymentIntent.metadata.planIds.split(",").map(Number);

      const subscriptions: YpSubscription[] = [];

      // Create subscriptions after successful payment
      for (let i = 0; i < agentProductIds.length; i++) {
        const nextBillingDate = await this.calculateNextBillingDate(planIds[i]);

        const subscription = await YpSubscription.create({
          user_id: userId,
          agent_product_id: agentProductIds[i],
          subscription_plan_id: planIds[i],
          start_date: new Date(),
          next_billing_date: nextBillingDate,
          status: "active",
          payment_method: "stripe",
          transaction_id: paymentIntentId,
        });

        subscriptions.push(subscription);
      }

      return subscriptions;
    } catch (error: any) {
      throw new Error(`Error processing successful payment: ${error.message}`);
    }
  }

  // Start an agent run
  async startAgentRun(
    subscriptionId: number,
    wsClients: Map<string, WebSocket>,
    wsClientId: string,
    currentUser: UserClass
  ): Promise<{ agentRun: YpAgentProductRun, subscription: YpSubscription }> {
    try {
      // Check if the subscription is active
      const subscription = await YpSubscription.findByPk(subscriptionId, {
        attributes: {
          exclude: ["created_at", "updated_at"],
        },
        include: [
          {
            model: YpSubscriptionPlan,
            as: "Plan",
            attributes: {
              exclude: ["created_at", "updated_at"],
            },
          },
          {
            model: YpAgentProduct,
            as: "AgentProduct",
            attributes: {
              exclude: ["created_at", "updated_at"],
            },
          },
        ],
      });

      if (!subscription || subscription.status !== "active") {
        throw new Error("Subscription is not active");
      }

      // Check runs limit
      //TODO: Activate this again !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
      //await this.checkRunsLimit(subscription);

      const workflowAndRequiredQuestions = await this.cloneCommunityWorkflowTemplate(
        subscription.AgentProduct,
        subscription.domain_id,
        currentUser
      );

      // Create a new agent product run
      const agentRun = await YpAgentProductRun.create({
        subscription_id: subscription.id,
        start_time: new Date(),
        workflow: workflowAndRequiredQuestions.workflow,
        status: "ready",
      });

      // Update runs used
      await this.incrementRunsUsed(subscription);

      return { agentRun, subscription };
    } catch (error: any) {
      throw new Error(`Error starting agent run: ${error.message}`);
    }

  }

  async startFirstAgent(
    agentProductRun: YpAgentProductRun,
    wsClients: Map<string, WebSocket>,
    wsClientId: string
  ): Promise<boolean> {
    const workflow = agentProductRun.workflow;
    if (!workflow) {
      throw new Error("Workflow not found");
    }
    const firstStep = workflow.steps[0];
    const agentId = firstStep.agentId;
    if (!agentId) {
      throw new Error("Agent ID not found in the first step");
    }

    const agentQueueManager = new NotificationAgentQueueManager(wsClients);

    try {
      const success = await agentQueueManager.startAgentProcessingWithWsClient(
        agentId,
        agentProductRun.id,
        wsClientId
      );
      if (success) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error starting agent processing:", error);
      return false;
    }
  }

  // Stop an agent run
  async stopAgentRun(agentProductRunId: number): Promise<void> {
    try {
      const agentProductRun = await YpAgentProductRun.findByPk(
        agentProductRunId
      );
      if (!agentProductRun || agentProductRun.status !== "running") {
        throw new Error("Agent run is not running");
      }

      agentProductRun.end_time = new Date();
      agentProductRun.status = "completed";
      agentProductRun.duration = Math.floor(
        (agentProductRun.end_time.getTime() -
          agentProductRun.start_time.getTime()) /
          1000
      ); // Duration in seconds

      await agentProductRun.save();
    } catch (error: any) {
      throw new Error(`Error stopping agent run: ${error.message}`);
    }
  }

  // Additional helper methods

  private async calculateNextBillingDate(planId: number): Promise<Date> {
    const plan = await YpSubscriptionPlan.findByPk(planId);
    if (!plan) {
      throw new Error("Subscription plan not found");
    }

    const nextBillingDate = new Date();
    switch (plan.configuration.billing_cycle) {
      case "monthly":
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
        break;
      case "yearly":
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
        break;
      case "weekly":
        nextBillingDate.setDate(nextBillingDate.getDate() + 7);
        break;
      default:
        throw new Error("Invalid billing cycle");
    }
    return nextBillingDate;
  }

  private async incrementRunsUsed(subscription: YpSubscription): Promise<void> {
    // Increment runs used in the subscription
    // Also check if runs limit is reached
    const plan = await YpSubscriptionPlan.findByPk(subscription.subscription_plan_id);
    if (!plan) {
      throw new Error("Subscription plan not found");
    }

    // For simplicity, we can assume runs_used is stored in subscription metadata
    let runsUsed = subscription.metadata?.runs_used || 0;
    runsUsed += 1;

    if (runsUsed > plan.configuration.max_runs_per_cycle) {
      console.error("Maximum runs per cycle exceeded");
      //TODO: Look into activating this again !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
      //throw new Error("Maximum runs per cycle exceeded");
    }

    subscription.metadata = { ...subscription.metadata, runs_used: runsUsed };
    await subscription.save();
  }

  private async checkRunsLimit(subscription: YpSubscription): Promise<void> {
    const plan = await YpSubscriptionPlan.findByPk(subscription.subscription_plan_id);
    if (!plan) {
      throw new Error("Subscription plan not found");
    }

    const runsUsed = subscription.metadata?.runs_used || 0;

    if (runsUsed >= plan.configuration.max_runs_per_cycle) {
      throw new Error("Maximum runs per cycle reached");
    }
  }
}
