import { YpSubscription } from "../../../../models/subscription.js";
import { YpSubscriptionPlan } from "../../../../models/subscriptionPlan.js";
import { YpAgentProduct } from "../../../../models/agentProduct.js";
import { YpAgentProductBundle } from "../../../../models/agentProductBundle.js";
import { YpAgentProductRun } from "../../../../models/agentProductRun.js";
import { YpAgentAssistant } from "../../../../assistants/agentAssistant.js";
import { Op } from "sequelize";

export class SubscriptionModels {
  assistant: YpAgentAssistant;

  constructor(assistant: YpAgentAssistant) {
    this.assistant = assistant;
  }

  public async loadAgentSubscriptionPlans(): Promise<AssistantAgentPlanStatus> {
    try {
      const firstBundle = await YpAgentProductBundle.findOne({
        where: {
          //TODO: get working
          //domain_id: this.domainId,
        },
      });
      // Get all available subscription plans with their associated agent products
      const availablePlans = await YpSubscriptionPlan.findAll({
        where: {
          id: {
            [Op.in]: [1, 6],
          },
          //  status: 'active', // Only get active plans
        },
        attributes: ['id', 'configuration','name','description'],
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
                required: false,
                attributes: {
                  exclude: ["created_at", "updated_at"],
                },
              },
            ],
          },
        ],
      });

      console.log(
        `-----------XXXXXXXXXXXXXXXx----------_> ${JSON.stringify(
          availablePlans,
          null,
          2
        )}`
      );

      return {
        availablePlans: availablePlans.map((plan) => ({
          subscriptionPlanId: plan.id,
          type: plan.configuration?.type || "coming_soon",
          name: plan.AgentProduct?.configuration?.displayName || "No name available",
          description: plan.AgentProduct?.description || "No description available",
          imageUrl: plan.configuration?.imageUrl || "",
         // price: plan.configuration?.amount || 0,
         // currency: plan.configuration?.currency || "USD",
         // maxRunsPerCycle: plan.configuration?.max_runs_per_cycle || 0,
        })),
        availableBundle: firstBundle
          ? {
              agentBundleId: firstBundle.id,
              name: firstBundle.name,
              description: firstBundle.description || "",
              imageUrl: firstBundle.configuration?.imageUrl || "",
            }
          : "No bundle available",
        systemStatus: {
          healthy: true,
          lastUpdated: new Date(),
        },
      };
    } catch (error) {
      console.error("Error loading available subscription plans:", error);
      return {
        availablePlans: [],
        availableBundle: "No bundle available",
        systemStatus: {
          healthy: false,
          lastUpdated: new Date(),
          error: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  }

  public async loadAgentProductPlanAndSubscription(
    subscriptionPlanId: number
  ): Promise<{
    plan: YpSubscriptionPlanAttributes | null;
    subscription: YpSubscriptionAttributes | null;
  }> {
    const plan = (await YpSubscriptionPlan.findOne({
      where: {
        id: subscriptionPlanId,
      },
      include: [
        {
          model: YpAgentProduct,
          as: "AgentProduct",
        },
      ],
    })) as YpSubscriptionPlanAttributes;
    if (!plan) {
      throw new Error(`Agent product with id ${subscriptionPlanId} not found`);
    }

    let subscription: YpSubscriptionAttributes | null = null;
    if (this.assistant.memory.currentUser) {
      subscription = (await YpSubscription.findOne({
        where: {
        subscription_plan_id: subscriptionPlanId,
        status: "active",
        user_id: this.assistant.memory.currentUser?.id,
        },
        include: [
          {
            model: YpSubscriptionPlan,
          as: "Plan",
          attributes: ['id', 'configuration'],
        },
        ],
      })) as YpSubscriptionAttributes | null;
    }

    return { subscription, plan };
  }

  public async loadUserAgentSubscriptions(): Promise<AssistantAgentSubscriptionStatus> {
    try {
      // Get available agent products from user's subscriptions for their domain
      const availableSubscriptions = await YpSubscription.findAll({
        where: {
          user_id: this.assistant.memory.currentUser?.id,
          domain_id: this.assistant.domainId,
          status: "active",
        },
        include: [
          {
            model: YpSubscriptionPlan,
            as: "Plan",
            include: [
              {
                model: YpAgentProduct,
                as: "AgentProduct",
              },
            ],
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
                as: "AgentBundles",
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
            where: {
              domain_id: this.assistant.domainId,
              status: "active",
            },
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
        availableSubscriptions: availableSubscriptions,
        runningAgents: runningAgents.map((run) => ({
          runId: run.id,
          agentProductId: run.Subscription?.AgentProduct?.id || 0,
          agentRunId: run.id,
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
        availableSubscriptions: [],
        runningAgents: [],
        systemStatus: {
          healthy: false,
          lastUpdated: new Date(),
          error: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  }

  public async unsubscribeFromAgentPlan(
    subscriptionId: number
  ): Promise<UnsubscribeResult> {
    try {
      const subscription = await YpSubscription.findOne({
        where: {
          id: subscriptionId,
          user_id: this.assistant.memory.currentUser?.id,
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

      const userId = this.assistant.memory.currentUser?.id;

      subscription.status = "cancelled";
      subscription.configuration = {
        cancelledAt: new Date(),
        cancelledByUserId: userId,
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

  public async subscribeToAgentPlan(
    agentProductId: number,
    subscriptionPlanId: number,
    returnCurrentSubscription: boolean = false
  ): Promise<SubscribeResult> {
    try {
      const plan = await YpSubscriptionPlan.findOne({
        where: {
          id: subscriptionPlanId,
        },
        include: [
          {
            model: YpAgentProduct,
            as: "AgentProduct",
          },
        ],
      });

      if (!plan) {
        return {
          success: false,
          error: "Subscription plan not found",
        };
      }

      const userId = this.assistant.memory.currentUser?.id;

      if (!userId) {
        return {
          success: false,
          error: "User not found",
        };
      }

      const existingSubscription = await YpSubscription.findOne({
        where: {
          subscription_plan_id: subscriptionPlanId,
          user_id: userId,
        },
      });

      if (returnCurrentSubscription && existingSubscription) {
        return {
          success: true,
          plan: plan as YpSubscriptionPlanAttributes,
          subscription: existingSubscription as YpSubscriptionAttributes,
        };
      } else if (existingSubscription) {
        return {
          success: false,
          error: "User already subscribed to this plan",
        };
      }

      console.log(`-------> subscribing to agent plan ${subscriptionPlanId} for user ${userId}`);

      const subscription = await YpSubscription.create({
        subscription_plan_id: subscriptionPlanId,
        agent_product_id: agentProductId,
        user_id: userId,
        domain_id: this.assistant.domainId,
        next_billing_date: new Date(),
        status: "active",
        start_date: new Date(),
        configuration: plan.configuration,
      });

      return {
        success: true,
        plan: plan as YpSubscriptionPlanAttributes,
        subscription: subscription as YpSubscriptionAttributes,
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
