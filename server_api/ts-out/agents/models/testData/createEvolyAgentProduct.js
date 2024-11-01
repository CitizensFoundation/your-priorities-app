// createAgentProductsAndPlans.ts
import { sequelize } from "@policysynth/agents/dbModels/sequelize.js";
import { YpAgentProduct } from "../agentProduct.js";
import { YpSubscriptionPlan } from "../subscriptionPlan.js";
import { YpSubscriptionUser } from "../subscriptionUser.js";
import { YpSubscription } from "../subscription.js";
import { YpAgentProductBundle } from "../agentProductBundle.js";
async function createAgentProductsAndPlans() {
    try {
        // Connect to the database
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
        // Define the user and domain (assuming they exist or create them)
        const userId = 850;
        const organizationId = 1790;
        // Check if user exists
        const user = await YpSubscriptionUser.findByPk(userId);
        if (!user) {
            throw new Error(`User with ID ${userId} does not exist.`);
        }
        const agentBundle = {
            id: 1,
            name: "Amplifier Agent Bundle",
            description: "Bundle for the Amplifier Agent.",
            configuration: {
                imageUrl: "https://via.placeholder.com/150",
            },
        };
        const competitionAgentWorkflow = {
            steps: [
                {
                    id: 1,
                    name: "Competition Analysis Wide Search",
                    description: "Wide search for competitor strategies and market positions.",
                    agentClassUuid: "a1b2c3d4-e5f6-c7c8-a9c0-c1225354f516",
                    type: "agentOps",
                },
                {
                    id: 2,
                    name: "Competition Analysis Human Prioritization",
                    description: "Human prioritization of the wide search results.",
                    agentClassUuid: "a1b2c3d4-e5f6-c7c8-a9c0-c1225354f516",
                    type: "engagmentFromOutputConnector",
                },
                {
                    id: 3,
                    name: "Competition Analysis Detailed Search",
                    description: "Detailed search for competitor strategies and market positions.",
                    agentClassUuid: "c6e99ac4-e5f6-c7c1-a1c0-c1ab53c4ff16",
                    type: "agentOps",
                },
                {
                    id: 4,
                    name: "Competition Analysis Detailed Search Human Prioritization",
                    description: "Human prioritization of the detailed search results.",
                    agentClassUuid: "c6e99ac4-e5f6-c7c1-a1c0-c1ab53c4ff16",
                    type: "engagmentFromOutputConnector",
                },
                {
                    id: 5,
                    name: "State of the Market Report",
                    description: "Report on the state of the market based on the competition analysis.",
                    agentClassUuid: "1cf3af64-a5f6-a7c1-91c1-51fb13c72f1a",
                    type: "agentOps",
                },
            ],
        };
        const agentProductsData = [
            {
                name: "Competition Agent Free Trial",
                description: "Analyzes competitor strategies and market positions.",
                configuration: {
                    workflow: competitionAgentWorkflow,
                    templateWorkflowCommunityId: 33810,
                },
                status: {
                    currentStatus: "active",
                },
                subscriptionPlan: {
                    name: "Competition Agent Free Trial",
                    description: "Free trial for the Competition Agent.",
                    agent_product_id: 1,
                    configuration: {
                        type: "free",
                        amount: 0.0,
                        currency: "USD",
                        billing_cycle: "monthly",
                        max_runs_per_cycle: 1,
                        boosters: [
                            {
                                name: "Regular Booster",
                                description: "Regular booster for the Competition Agent.",
                                runs_available: 30,
                                price: 90.0,
                                currency: "USD",
                                structuredAnswersOverride: [],
                            },
                            {
                                name: "Mega Booster",
                                description: "Mega booster for the Competition Agent.",
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
                                description: "Ultra booster for the Competition Agent.",
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
                                type: "textArea",
                                value: "",
                                maxLength: 5000,
                                required: true,
                                rows: 5,
                                charCounter: true,
                                text: "Business Description",
                            },
                        ],
                        imageUrl: "https://via.placeholder.com/150",
                    },
                },
            },
            {
                name: "Competition Agent",
                description: "Analyzes competitor strategies and market positions.",
                groupId: 33811,
                configuration: {
                    workflow: competitionAgentWorkflow,
                    templateWorkflowCommunityId: 33810,
                },
                status: {
                    currentStatus: "active",
                },
                subscriptionPlan: {
                    name: "Competition Agent Plan",
                    description: "Competition Agent Plan",
                    configuration: {
                        type: "paid",
                        amount: 150.0,
                        currency: "USD",
                        billing_cycle: "monthly",
                        max_runs_per_cycle: 1,
                        boosters: [
                            {
                                name: "Regular Booster",
                                description: "Regular booster for the Competition Agent.",
                                runs_available: 30,
                                price: 90.0,
                                currency: "USD",
                                structuredAnswersOverride: [],
                            },
                            {
                                name: "Mega Booster",
                                description: "Mega booster for the Competition Agent.",
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
                                description: "Ultra booster for the Competition Agent.",
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
                        imageUrl: "https://via.placeholder.com/150",
                    },
                },
            },
            {
                name: "Lead Generation Agent",
                description: "Generates leads and potential client contacts.",
                groupId: 2,
                configuration: {},
                status: {},
                subscriptionPlan: {
                    name: "Lead Generation Agent Plan",
                    description: "Monthly plan for the Lead Generation Agent.",
                    configuration: {
                        type: "paid",
                        amount: 150.0,
                        currency: "USD",
                        billing_cycle: "monthly",
                        max_runs_per_cycle: 2,
                        boosters: [],
                        structuredAnswersOverride: [],
                        requiredStructuredQuestions: [],
                        imageUrl: "https://via.placeholder.com/150",
                    },
                },
            },
            {
                name: "Production Innovation Agent",
                description: "Produces innovative ideas for production processes.",
                groupId: 33812,
                configuration: {},
                status: {},
                subscriptionPlan: {
                    name: "Production Innovation Agent Plan",
                    description: "Monthly plan for the Production Innovation Agent.",
                    configuration: {
                        type: "paid",
                        amount: 150.0,
                        currency: "USD",
                        billing_cycle: "monthly",
                        max_runs_per_cycle: 2,
                        boosters: [],
                        structuredAnswersOverride: [],
                        requiredStructuredQuestions: [],
                        imageUrl: "https://via.placeholder.com/150",
                    },
                },
            },
            {
                name: "Marketing Ops Agent",
                description: "Optimizes marketing operations and campaign strategies.",
                groupId: 33813,
                configuration: {},
                status: {},
                subscriptionPlan: {
                    name: "Marketing Ops Agent Plan",
                    description: "Monthly plan for the Marketing Ops Agent.",
                    configuration: {
                        type: "paid",
                        amount: 350.0,
                        currency: "USD",
                        billing_cycle: "monthly",
                        max_runs_per_cycle: 4,
                        boosters: [],
                        structuredAnswersOverride: [],
                        requiredStructuredQuestions: [],
                        imageUrl: "https://via.placeholder.com/150",
                    },
                },
            },
            {
                name: "Funding Agent",
                description: "Identifies and analyzes funding opportunities and investment strategies.",
                groupId: 33814,
                configuration: {},
                status: {},
                subscriptionPlan: {
                    name: "Funding Agent Plan",
                    description: "Monthly plan for the Funding Agent.",
                    configuration: {
                        type: "paid",
                        amount: 150.0,
                        currency: "USD",
                        billing_cycle: "monthly",
                        max_runs_per_cycle: 2,
                        booster_runs_available: 4,
                        boosters: [],
                        structuredAnswersOverride: [],
                        requiredStructuredQuestions: [],
                        imageUrl: "https://via.placeholder.com/150",
                    },
                },
            },
        ];
        // Create agentBundle
        const createdAgentBundle = await YpAgentProductBundle.create({
            name: agentBundle.name,
            description: agentBundle.description,
            configuration: agentBundle.configuration,
            status: {},
        });
        // Create Agent Products and their Subscription Plans
        for (const agentData of agentProductsData) {
            // Create the Agent Product
            const agentProduct = await YpAgentProduct.create({
                user_id: userId,
                domain_id: organizationId,
                configuration: agentData.configuration,
                agent_bundle_id: createdAgentBundle.id,
                status: agentData.status,
                runs_used: 0,
                extra_runs_purchased: 0,
            });
            console.log(`Created Agent Product: ${agentData.name} (ID: ${agentProduct.id})`);
            // Create the Subscription Plan associated with this Agent Product
            const planData = agentData.subscriptionPlan;
            const subscriptionPlan = await YpSubscriptionPlan.create({
                agent_product_id: agentProduct.id,
                name: planData.name,
                description: planData.description,
                configuration: planData.configuration,
            });
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
                });
                console.log(`Created Free Trial Subscription (ID: ${subscription.id})`);
            }
            console.log(`Created Subscription Plan: ${planData.name} (ID: ${subscriptionPlan.id})`);
        }
        console.log("All Agent Products and Subscription Plans have been created.");
    }
    catch (error) {
        console.error("Error creating Agent Products and Subscription Plans:", error);
    }
    finally {
        // Close the database connection
        await sequelize.close();
    }
}
createAgentProductsAndPlans();
