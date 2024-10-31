// createAgentProductsAndPlans.ts
import { sequelize } from "@policysynth/agents/dbModels/sequelize.js";
import { YpAgentProduct } from '../agentProduct.js';
import { YpSubscriptionPlan } from '../subscriptionPlan.js';
import { YpSubscriptionUser } from '../subscriptionUser.js';
import { Group } from '@policysynth/agents/dbModels/ypGroup.js';
async function createAgentProductsAndPlans() {
    try {
        // Connect to the database
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        // Define the user and domain (assuming they exist or create them)
        const userId = 850;
        const domainId = 1790;
        // Check if user exists
        const user = await YpSubscriptionUser.findByPk(userId);
        if (!user) {
            throw new Error(`User with ID ${userId} does not exist.`);
        }
        const agentProductsData = [
            {
                name: 'Competition Agent Free Trial',
                description: 'Analyzes competitor strategies and market positions.',
                groupId: 33810,
                configuration: {},
                status: {
                    currentStatus: 'active',
                },
                subscriptionPlan: {
                    name: 'Competition Agent Free Trial',
                    description: 'Free trial for the Competition Agent.',
                    configuration: {
                        type: 'free',
                        amount: 0.0,
                        currency: 'USD',
                        billing_cycle: 'monthly',
                        max_runs_per_cycle: 1,
                        booster_runs: 0,
                        booster_price: 0.0,
                        booster_currency: 'USD',
                    }
                },
            },
            {
                name: 'Competition Agent',
                description: 'Analyzes competitor strategies and market positions.',
                groupId: 33811,
                configuration: {},
                status: {
                    currentStatus: 'active',
                },
                subscriptionPlan: {
                    name: 'Competition Agent Plan',
                    description: 'Competition Agent Plan',
                    configuration: {
                        type: 'paid',
                        amount: 150.0,
                        currency: 'USD',
                        billing_cycle: 'monthly',
                        max_runs_per_cycle: 1,
                        booster_runs: 4,
                        booster_price: 120.0,
                        booster_currency: 'USD',
                    }
                },
            },
            {
                name: 'Lead Generation Agent',
                description: 'Generates leads and potential client contacts.',
                groupId: 2,
                configuration: {},
                status: {},
                subscriptionPlan: {
                    name: 'Lead Generation Agent Plan',
                    description: 'Monthly plan for the Lead Generation Agent.',
                    type: 'paid',
                    amount: 150.00,
                    currency: 'USD',
                    billing_cycle: 'monthly',
                    max_runs_per_cycle: 2,
                    booster_runs_available: 4,
                    booster_price: 120.0,
                    booster_currency: 'USD',
                },
            },
            {
                name: 'Production Innovation Agent',
                description: 'Produces innovative ideas for production processes.',
                groupId: 33812,
                configuration: {},
                status: {},
                subscriptionPlan: {
                    name: 'Production Innovation Agent Plan',
                    description: 'Monthly plan for the Production Innovation Agent.',
                    configuration: {
                        type: 'paid',
                        amount: 150.00,
                        currency: 'USD',
                        billing_cycle: 'monthly',
                        max_runs_per_cycle: 2,
                        booster_runs: 4,
                        booster_price: 120.0,
                        booster_currency: 'USD',
                    }
                },
            },
            {
                name: 'Marketing Ops Agent',
                description: 'Optimizes marketing operations and campaign strategies.',
                groupId: 33813,
                configuration: {},
                status: {},
                subscriptionPlan: {
                    name: 'Marketing Ops Agent Plan',
                    description: 'Monthly plan for the Marketing Ops Agent.',
                    configuration: {
                        type: 'paid',
                        amount: 350.00,
                        currency: 'USD',
                        billing_cycle: 'monthly',
                        max_runs_per_cycle: 4,
                        booster_runs: 10,
                        booster_price: 250.0,
                        booster_currency: 'USD',
                    }
                },
            },
            {
                name: 'Funding Agent',
                description: 'Identifies and analyzes funding opportunities and investment strategies.',
                groupId: 33814,
                configuration: {},
                status: {},
                subscriptionPlan: {
                    name: 'Funding Agent Plan',
                    description: 'Monthly plan for the Funding Agent.',
                    configuration: {
                        type: 'paid',
                        amount: 150.00,
                        currency: 'USD',
                        billing_cycle: 'monthly',
                        max_runs_per_cycle: 2,
                        booster_runs: 4,
                        booster_price: 120.0,
                        booster_currency: 'USD',
                    }
                },
            },
        ];
        // Create Agent Products and their Subscription Plans
        for (const agentData of agentProductsData) {
            // Check if the group exists; if not, create it
            let group = await Group.findOne({ where: { id: agentData.groupId } });
            if (!group) {
                throw new Error(`Group with ID ${agentData.groupId} does not exist.`);
            }
            // Create the Agent Product
            const agentProduct = await YpAgentProduct.create({
                user_id: userId,
                group_id: group.id,
                domain_id: domainId,
                configuration: agentData.configuration,
                status: agentData.status,
                runs_used: 0,
                extra_runs_purchased: 0,
            });
            console.log(`Created Agent Product: ${agentData.name} (ID: ${agentProduct.id})`);
            // Create the Subscription Plan associated with this Agent Product
            const planData = agentData.subscriptionPlan;
            const subscriptionPlan = await YpSubscriptionPlan.create({
                agent_product_id: agentProduct.id,
                type: planData.type,
                name: planData.name,
                description: planData.description,
                amount: planData.amount,
                currency: planData.currency,
                billing_cycle: planData.billing_cycle,
                max_runs_per_cycle: planData.max_runs_per_cycle,
                booster_runs: planData.configuration?.booster_runs,
                booster_price: planData.configuration?.booster_price,
                booster_currency: planData.configuration?.booster_currency,
            });
            console.log(`Created Subscription Plan: ${planData.name} (ID: ${subscriptionPlan.id})`);
        }
        console.log('All Agent Products and Subscription Plans have been created.');
    }
    catch (error) {
        console.error('Error creating Agent Products and Subscription Plans:', error);
    }
    finally {
        // Close the database connection
        await sequelize.close();
    }
}
createAgentProductsAndPlans();
