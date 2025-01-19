// createAgentProductsAndPlans.ts

import { sequelize } from "@policysynth/agents/dbModels/sequelize.js";
import { YpAgentProduct } from "../agentProduct.js";
import { YpSubscriptionPlan } from "../subscriptionPlan.js";
import { YpSubscriptionUser } from "../subscriptionUser.js";
import { Group } from "@policysynth/agents/dbModels/ypGroup.js";
import { YpSubscription } from "../subscription.js";
import { YpAgentProductBundle } from "../agentProductBundle.js";

async function createAgentProductsAndPlans() {
  let transaction;
  try {
    // Connect to the database
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // Start transaction
    transaction = await sequelize.transaction();

    // Define the user and domain (assuming they exist or create them)
    const userId = 1;
    const organizationId = 1;

    // Check if user exists
    const user = await YpSubscriptionUser.findByPk(userId, { transaction });
    if (!user) {
      throw new Error(`User with ID ${userId} does not exist.`);
    }

    const agentBundle = {
      id: 1,
      name: "Evoly Amplifier Agent Bundle",
      description: `The Amplifier Agent Bundle includes: Competition Agent, Lead Generation Agent, Production Innovation Agent, Marketing Ops Agent and Funding Agent.
      Evoly Cloud is a platform to revolutionize business outcomes in every department of your company.
      Evoly integrates AI agents with people, workflows, and data and enables multi-agent workflows.
      With Evoly Cloud, your staff and AI agents collaborate seamlessly to achieve optimal efficiency and innovative results.
      Evoly Cloud offers ready-to-use AI agents as well as empowering your business to create custom-made AI agents.`,
      configuration: {
        imageUrl: "https://assets.evoly.ai/dl/7a651ab3d224f105ab5c543b89634b90--retina-1.png",
      },
    } as YpAgentProductBundleAttributes;

    const competitionAgentWorkflow: YpWorkflowConfiguration = {
      currentStepIndex: 0,
      steps: [
        {
          name: "Competitor Analysis Wide Search",
          shortName: "Wide Search",
          description:
            "Wide search for competitor strategies and market positions.",
          shortDescription: "Wide search for competitor strategies and market positions.",
          agentClassUuid: "a1b2c3d4-e5f6-c7c8-a9c0-c1225354f516",
          type: "agentOps",
          stepBackgroundColor: "#ffdc2f",
          stepTextColor: "#211e1c"
        },
        {
          name: "Competitor Analysis Human Prioritization",
          shortName: "Human Prioritization",
          description: "Human prioritization of the wide search results.",
          shortDescription: "Human prioritization of the wide search results.",
          agentClassUuid: "a1b2c3d4-e5f6-c7c8-a9c0-c1225354f516",
          type: "engagmentFromOutputConnector",
          stepBackgroundColor: "#e74c3c",
          stepTextColor: "#ffffff",
        },
        {
          name: "Competitor Analysis Detailed Search",
          shortName: "Detailed Search",
          description:
            "Detailed search for competitor strategies and market positions.",
          shortDescription: "Detailed search for competitor strategies and market positions.",
          agentClassUuid: "c6e99ac4-e5f6-c7c1-a1c0-c1ab53c4ff16",
          type: "agentOps",
          stepBackgroundColor: "#1e90ff",
          stepTextColor: "#ffffff",
        },
        {
          name: "Competitor Analysis Detailed Search Human Prioritization",
          shortName: "Detailed Search Human Prioritization",
          description: "Human prioritization of the detailed search results.",
          shortDescription: "Human prioritization of the detailed search results.",
          agentClassUuid: "c6e99ac4-e5f6-c7c1-a1c0-c1ab53c4ff16",
          type: "engagmentFromOutputConnector",
          stepBackgroundColor: "#2ecc71",
          stepTextColor: "#ffffff",
        },
        {
          name: "Competitors Report",
          shortName: "Competitors Report",
          description:
            "Report on the state of the market based on the competitors analysis.",
          shortDescription: "Report on the state of the market based on the competitors analysis.",
          agentClassUuid: "1cf3af64-a5f6-a7c1-91c1-51fb13c72f1a",
          type: "agentOps",
          stepBackgroundColor: "#d486da",
          stepTextColor: "#ffffff",
        },
      ],
    };

    const fundingAgentWorkflow: YpWorkflowConfiguration = {
      currentStepIndex: 0,
      steps: [
        {
          name: "Funding Agent Wide Search",
          shortName: "Wide Search",
          description:
            "Wide search for investors and funding opportunities.",
          shortDescription: "Wide search for investors and funding opportunities.",
          agentClassUuid: "a1b2c3d4-e5f6-c7c8-a9c0-c1225354f516",
          type: "agentOps",
          stepBackgroundColor: "#ffdc2f",
          stepTextColor: "#211e1c"
        },
        {
          name: "Funding Agent Human Prioritization",
          shortName: "Human Prioritization",
          description: "Human prioritization of the wide search results.",
          shortDescription: "Human prioritization of the wide search results.",
          agentClassUuid: "a1b2c3d4-e5f6-c7c8-a9c0-c1225354f516",
          type: "engagmentFromOutputConnector",
          stepBackgroundColor: "#e74c3c",
          stepTextColor: "#ffffff",
        },
        {
          name: "Funding Agent Detailed Search",
          shortName: "Detailed Search",
          description:
            "Detailed search for investors and funding opportunities.",
          shortDescription: "Detailed search for investors and funding opportunities.",
          agentClassUuid: "b36ffca6-7363-44be-bd55-40661210cf24",
          type: "agentOps",
          stepBackgroundColor: "#1e90ff",
          stepTextColor: "#ffffff",
        },
        {
          name: "Funding Agent Detailed Search Human Prioritization",
          shortName: "Detailed Search Human Prioritization",
          description: "Human prioritization of the detailed search results.",
          shortDescription: "Human prioritization of the detailed search results.",
          agentClassUuid: "b36ffca6-7363-44be-bd55-40661210cf24",
          type: "engagmentFromOutputConnector",
          stepBackgroundColor: "#2ecc71",
          stepTextColor: "#ffffff",
        },
        {
          name: "Funding Agent Report",
          shortName: "Funding Agent Report",
          description:
            "Report on investors and funding opportunities.",
          shortDescription: "Report on investors and funding opportunities.",
          agentClassUuid: "1bbf8f86-0ffc-4356-aaa1-9cea04b78ec4",
          type: "agentOps",
          stepBackgroundColor: "#d486da",
          stepTextColor: "#ffffff",
        },
      ],
    };

    const agentProductsData = [
      {
        name: "Competitor Agent Free Trial",
        description: "Analyzes competitor strategies and market positions.",
        configuration: {
          workflow: competitionAgentWorkflow,
          templateWorkflowCommunityId: 63,
        } as YpAgentProductConfiguration,
        status: {
          currentStatus: "active",
        },
        subscriptionPlan: {
          name: "Competitor Agent Free Trial",
          description: "Free trial for the Competitor Agent.",
          agent_product_id: 1,
          configuration: {
            type: "free" as YpSubscriptionPlanType,
            amount: 0.0,
            currency: "USD",
            billing_cycle: "monthly" as YpSubscriptionBillingCycle,
            max_runs_per_cycle: 1,
            boosters: [
              {
                name: "Regular Booster",
                description: "Regular booster for the Competitor Agent.",
                runs_available: 30,
                price: 90.0,
                currency: "USD",
                structuredAnswersOverride: [],
              },
              {
                name: "Mega Booster",
                description: "Mega booster for the Competitor Agent.",
                runs_available: 10,
                price: 250.0,
                currency: "USD",
                structuredAnswersOverride: [
                  {
                    uniqueId: "maxCompetitorsToAnalyze",
                    value: 30,
                  },
                  {
                    uniqueId: "numberOfSearchQueries",
                    value: 50,
                  },
                ],
              },
              {
                name: "Ultra Booster",
                description: "Ultra booster for the Competitor Agent.",
                runs_available: 1,
                price: 520.0,
                currency: "USD",
                structuredAnswersOverride: [
                  {
                    uniqueId: "maxCompetitorsToAnalyze",
                    value: 100,
                  },
                  {
                    uniqueId: "numberOfSearchQueries",
                    value: 100,
                  },
                ],
              },
            ],
            structuredAnswersOverride: [
              {
                uniqueId: "maxCompetitorsToAnalyze",
                value: 30,
              },
              {
                uniqueId: "numberOfSearchQueries",
                value: 50,
              },
            ],
            requiredStructuredQuestions: [
              {
                uniqueId: "businessDescription",
                type: "textAreaLong",
                description: "Detailed description of the business, this is critical for the agent to understand the business and provide accurate results.",
                value: "",
                maxLength: 7500,
                required: true,
                rows: 5,
                charCounter: true,
                text: "Business Description",
              },
            ],
            imageUrl: "https://assets.evoly.ai/dl/754a1e727d768b1107826c1deb67b6ac--retina-1.png",
          } as YpSubscriptionPlanConfiguration,
        } as YpSubscriptionPlanAttributes,
      },
      {
        name: "Competitor Agent",
        description: "Analyzes competitor strategies and market positions.",
        groupId: 11,
        configuration: {
          workflow: competitionAgentWorkflow,
          templateWorkflowCommunityId: 63,
        } as YpAgentProductConfiguration,
        status: {
          currentStatus: "active",
        },
        subscriptionPlan: {
          name: "Competitor Agent Plan",
          description: "Competitor Agent Plan",
          configuration: {
            type: "paid" as YpSubscriptionPlanType,
            amount: 150.0,
            currency: "USD",
            billing_cycle: "monthly" as YpSubscriptionBillingCycle,
            max_runs_per_cycle: 1,
            boosters: [
              {
                name: "Regular Booster",
                description: "Regular booster for the Competitor Agent.",
                runs_available: 30,
                price: 90.0,
                currency: "USD",
                structuredAnswersOverride: [],
              },
              {
                name: "Mega Booster",
                description: "Mega booster for the Competitor Agent.",
                runs_available: 10,
                price: 250.0,
                currency: "USD",
                structuredAnswersOverride: [
                  {
                    uniqueId: "maxCompetitorsToAnalyze",
                    value: 30,
                  },
                  {
                    uniqueId: "numberOfSearchQueries",
                    value: 50,
                  },
                ],
              },
              {
                name: "Ultra Booster",
                description: "Ultra booster for the Competitor Agent.",
                runs_available: 1,
                price: 520.0,
                currency: "USD",
                structuredAnswersOverride: [
                  {
                    uniqueId: "maxCompetitorsToAnalyze",
                    value: 100,
                  },
                  {
                    uniqueId: "numberOfSearchQueries",
                    value: 100,
                  },
                ],
              },
            ],
            structuredAnswersOverride: [],
            requiredStructuredQuestions: [],
            imageUrl: "https://assets.evoly.ai/dl/754a1e727d768b1107826c1deb67b6ac--retina-1.png",
          } as YpSubscriptionPlanConfiguration,
        } as YpSubscriptionPlanAttributes,
      },
      {
        name: "Lead Generation Agent",
        description: "Generates leads and potential client contacts.",
        groupId: 2,
        configuration: {
          workflow: {},
          templateWorkflowCommunityId: 12,
        } as YpAgentProductConfiguration,
        status: {},
        subscriptionPlan: {
          name: "Lead Generation Agent Plan",
          description: "Monthly plan for the Lead Generation Agent.",
          configuration: {
            type: "paid" as YpSubscriptionPlanType,
            amount: 150.0,
            currency: "USD",
            billing_cycle: "monthly" as YpSubscriptionBillingCycle,
            max_runs_per_cycle: 2,
            boosters: [],
            structuredAnswersOverride: [],
            requiredStructuredQuestions: [],
            imageUrl: "https://assets.evoly.ai/dl/f86bf2c221801b4c56d71b098c36ef54--retina-1.png",
          } as YpSubscriptionPlanConfiguration,
        } as YpSubscriptionPlanAttributes,
      },
      {
        name: "Production Innovation Agent",
        description: "Produces innovative ideas for production processes.",
        groupId: 33812,
        configuration: {
          workflow: {},
          templateWorkflowCommunityId: 13,
        } as YpAgentProductConfiguration,
        status: {},
        subscriptionPlan: {
          name: "Production Innovation Agent Plan",
          description: "Monthly plan for the Production Innovation Agent.",
          configuration: {
            type: "paid" as YpSubscriptionPlanType,
            amount: 150.0,
            currency: "USD",
            billing_cycle: "monthly" as YpSubscriptionBillingCycle,
            max_runs_per_cycle: 2,
            boosters: [],
            structuredAnswersOverride: [],
            requiredStructuredQuestions: [],
            imageUrl: "https://assets.evoly.ai/dl/1d91f5bfb69446f57c678a4a3e873d35--retina-1.png",
          } as YpSubscriptionPlanConfiguration,
        } as YpSubscriptionPlanAttributes,
      },
      {
        name: "Marketing Ops Agent",
        description: "Optimizes marketing operations and campaign strategies.",
        groupId: 33813,
        configuration: {
          workflow: {},
          templateWorkflowCommunityId: 14,
        } as YpAgentProductConfiguration,
        status: {},
        subscriptionPlan: {
          name: "Marketing Ops Agent Plan",
          description: "Monthly plan for the Marketing Ops Agent.",
          configuration: {
            type: "paid" as YpSubscriptionPlanType,
            amount: 350.0,
            currency: "USD",
            billing_cycle: "monthly" as YpSubscriptionBillingCycle,
            max_runs_per_cycle: 4,
            boosters: [],
            structuredAnswersOverride: [],
            requiredStructuredQuestions: [],
            imageUrl: "https://assets.evoly.ai/dl/6f8757bfb637206ddae009597aa4ab6d--retina-1.png",
          } as YpSubscriptionPlanConfiguration,
        } as YpSubscriptionPlanAttributes,
      },
      {
        name: "Funding Agent",
        description:
          "Identifies and analyzes funding opportunities and investment strategies.",
        groupId: 33814,
        configuration: {
          workflow: fundingAgentWorkflow,
          templateWorkflowCommunityId: 10175,
        } as YpAgentProductConfiguration,
        status: {},
        subscriptionPlan: {
          name: "Funding Agent Plan",
          description: "Monthly plan for the Funding Agent.",
          configuration: {
            type: "paid" as YpSubscriptionPlanType,
            amount: 150.0,
            currency: "USD",
            billing_cycle: "monthly" as YpSubscriptionBillingCycle,
            max_runs_per_cycle: 2,
            booster_runs_available: 4,
            boosters: [],
            structuredAnswersOverride: [],
            requiredStructuredQuestions: [],
            imageUrl: "https://assets.evoly.ai/dl/f80b64c1ab385e6f3ec0d3f552f38801--retina-1.png",
          } as YpSubscriptionPlanConfiguration,
        } as YpSubscriptionPlanAttributes,
      },
    ];

    // Create agentBundle
    const createdAgentBundle = await YpAgentProductBundle.create({
      name: agentBundle.name,
      description: agentBundle.description,
      configuration: agentBundle.configuration,
      status: {},
    }, { transaction });

    // Create Agent Products and their Subscription Plans
    for (const agentData of agentProductsData) {
      // Create the Agent Product
      const agentProduct = await YpAgentProduct.create({
        user_id: userId,
        domain_id: organizationId,
        name: agentData.name,
        description: agentData.description,
        configuration: agentData.configuration,
        agent_bundle_id: createdAgentBundle.id,
        status: agentData.status,
        runs_used: 0,
        extra_runs_purchased: 0,
      }, { transaction });

      console.log(
        `Created Agent Product: ${agentData.name} (ID: ${agentProduct.id})`
      );

      // Create the Subscription Plan associated with this Agent Product
      const planData = agentData.subscriptionPlan;
      const subscriptionPlan = await YpSubscriptionPlan.create({
        agent_product_id: agentProduct.id,
        name: planData.name,
        description: planData.description,
        configuration: planData.configuration,
      } as Omit<YpSubscriptionPlanAttributes, 'id' | 'uuid' | 'created_at' | 'updated_at'>,
      { transaction });

      // Create a subscription for the free trial plan
      if (planData.configuration.type === "free") {
        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        const subscription = await YpSubscription.create({
          user_id: userId,
          domain_id: organizationId,
          agent_product_id: agentProduct.id,
          subscription_plan_id: subscriptionPlan.id,
          start_date: now,
          end_date: thirtyDaysFromNow,
          next_billing_date: thirtyDaysFromNow,
          status: "active",
          configuration: {
            runs_remaining: planData.configuration.max_runs_per_cycle,
          },
        } as Omit<YpSubscriptionAttributes, 'id' | 'uuid' | 'created_at' | 'updated_at'>,
        { transaction });

        console.log(`Created Free Trial Subscription (ID: ${subscription.id})`);
      }

      console.log(
        `Created Subscription Plan: ${planData.name} (ID: ${subscriptionPlan.id})`
      );
    }

    // Commit the transaction
    await transaction.commit();
    console.log("All Agent Products and Subscription Plans have been created.");
  } catch (error) {
    // Rollback the transaction if there's an error
    if (transaction) await transaction.rollback();
    console.error(
      "Error creating Agent Products and Subscription Plans:",
      error
    );
    throw error; // Re-throw the error to handle it at a higher level if needed
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

createAgentProductsAndPlans();
