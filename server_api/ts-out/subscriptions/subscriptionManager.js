// SubscriptionManager.ts
import { YpSubscriptionPlan } from './models/subscriptionPlan.js';
import { YpSubscription } from './models/subscription.js';
import { YpAgentProduct } from './models/agentProduct.js';
import { YpAgentProductRun } from './models/agentProductRun.js';
import Stripe from 'stripe';
import { YpAgentProductBundle } from './models/agentProductBundle.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-09-30.acacia',
});
export class SubscriptionManager {
    constructor() {
        // Initialize if necessary
    }
    // Get available subscription plans
    async getPlans() {
        try {
            const plans = await YpSubscriptionPlan.findAll({
                attributes: {
                    exclude: ['created_at', 'updated_at']
                },
                include: [
                    {
                        model: YpAgentProduct,
                        as: 'AgentProduct',
                        attributes: {
                            exclude: ['created_at', 'updated_at']
                        },
                        include: [{
                                model: YpAgentProductBundle,
                                as: 'Bundles',
                                attributes: {
                                    exclude: ['created_at', 'updated_at']
                                }
                            }]
                    }
                ],
            });
            return plans;
        }
        catch (error) {
            throw new Error(`Error fetching subscription plans: ${error.message}`);
        }
    }
    // Create subscriptions for a user
    async createSubscriptions(userId, agentProductIds, planIds, paymentMethodId) {
        try {
            if (agentProductIds.length !== planIds.length) {
                throw new Error('agentProductIds and planIds arrays must be of the same length');
            }
            let totalAmount = 0;
            const currency = 'usd';
            // Calculate total amount to charge
            for (let i = 0; i < planIds.length; i++) {
                const plan = await YpSubscriptionPlan.findByPk(planIds[i]);
                if (!plan) {
                    throw new Error(`Subscription plan with ID ${planIds[i]} not found`);
                }
                totalAmount += Number(plan.amount) * 100;
            }
            // Create a PaymentIntent with Stripe
            const paymentIntent = await stripe.paymentIntents.create({
                amount: totalAmount,
                currency: currency,
                payment_method: paymentMethodId,
                confirmation_method: 'manual',
                confirm: false,
                payment_method_types: ['card'],
                description: 'Subscription Purchase',
                metadata: {
                    userId: userId.toString(),
                    agentProductIds: agentProductIds.join(','),
                    planIds: planIds.join(','),
                },
            });
            // Return the client secret for frontend confirmation
            return {
                clientSecret: paymentIntent.client_secret,
                subscriptionId: paymentIntent.id
            };
        }
        catch (error) {
            if (error instanceof Stripe.errors.StripeCardError) {
                throw new Error(`Payment failed: ${error.message}`);
            }
            else if (error instanceof Stripe.errors.StripeInvalidRequestError) {
                throw new Error(`Invalid payment request: ${error.message}`);
            }
            else {
                throw new Error(`Error creating subscriptions: ${error.message}`);
            }
        }
    }
    // Add a new method to handle successful payments
    async handleSuccessfulPayment(paymentIntentId) {
        try {
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
            if (paymentIntent.status !== 'succeeded') {
                throw new Error('Payment not successful');
            }
            const userId = Number(paymentIntent.metadata.userId);
            const agentProductIds = paymentIntent.metadata.agentProductIds.split(',').map(Number);
            const planIds = paymentIntent.metadata.planIds.split(',').map(Number);
            const subscriptions = [];
            // Create subscriptions after successful payment
            for (let i = 0; i < agentProductIds.length; i++) {
                const nextBillingDate = await this.calculateNextBillingDate(planIds[i]);
                const subscription = await YpSubscription.create({
                    user_id: userId,
                    agent_product_id: agentProductIds[i],
                    plan_id: planIds[i],
                    start_date: new Date(),
                    next_billing_date: nextBillingDate,
                    status: 'active',
                    payment_method: 'stripe',
                    transaction_id: paymentIntentId,
                });
                subscriptions.push(subscription);
            }
            return subscriptions;
        }
        catch (error) {
            throw new Error(`Error processing successful payment: ${error.message}`);
        }
    }
    // Start an agent run
    async startAgentRun(agentProductId, subscriptionId) {
        try {
            // Check if the subscription is active
            const subscription = await YpSubscription.findByPk(subscriptionId);
            if (!subscription || subscription.status !== 'active') {
                throw new Error('Subscription is not active');
            }
            // Check if the agent product matches the subscription
            if (subscription.agent_product_id !== agentProductId) {
                throw new Error('Agent product does not match the subscription');
            }
            // Check runs limit
            await this.checkRunsLimit(subscription);
            // Create a new agent product run
            const agentProductRun = await YpAgentProductRun.create({
                agent_product_id: agentProductId,
                start_time: new Date(),
                status: 'running',
            });
            // Update runs used
            await this.incrementRunsUsed(subscription);
            return agentProductRun;
        }
        catch (error) {
            throw new Error(`Error starting agent run: ${error.message}`);
        }
    }
    // Stop an agent run
    async stopAgentRun(agentProductRunId) {
        try {
            const agentProductRun = await YpAgentProductRun.findByPk(agentProductRunId);
            if (!agentProductRun || agentProductRun.status !== 'running') {
                throw new Error('Agent run is not running');
            }
            agentProductRun.end_time = new Date();
            agentProductRun.status = 'completed';
            agentProductRun.duration = Math.floor((agentProductRun.end_time.getTime() - agentProductRun.start_time.getTime()) / 1000); // Duration in seconds
            await agentProductRun.save();
        }
        catch (error) {
            throw new Error(`Error stopping agent run: ${error.message}`);
        }
    }
    // Additional helper methods
    async calculateNextBillingDate(planId) {
        const plan = await YpSubscriptionPlan.findByPk(planId);
        if (!plan) {
            throw new Error('Subscription plan not found');
        }
        const nextBillingDate = new Date();
        switch (plan.billing_cycle) {
            case 'monthly':
                nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
                break;
            case 'yearly':
                nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
                break;
            case 'weekly':
                nextBillingDate.setDate(nextBillingDate.getDate() + 7);
                break;
            default:
                throw new Error('Invalid billing cycle');
        }
        return nextBillingDate;
    }
    async incrementRunsUsed(subscription) {
        // Increment runs used in the subscription
        // Also check if runs limit is reached
        const plan = await YpSubscriptionPlan.findByPk(subscription.plan_id);
        if (!plan) {
            throw new Error('Subscription plan not found');
        }
        // For simplicity, we can assume runs_used is stored in subscription metadata
        let runsUsed = subscription.metadata?.runs_used || 0;
        runsUsed += 1;
        if (runsUsed > plan.max_runs_per_cycle) {
            throw new Error('Maximum runs per cycle exceeded');
        }
        subscription.metadata = { ...subscription.metadata, runs_used: runsUsed };
        await subscription.save();
    }
    async checkRunsLimit(subscription) {
        const plan = await YpSubscriptionPlan.findByPk(subscription.plan_id);
        if (!plan) {
            throw new Error('Subscription plan not found');
        }
        const runsUsed = subscription.metadata?.runs_used || 0;
        if (runsUsed >= plan.max_runs_per_cycle) {
            throw new Error('Maximum runs per cycle reached');
        }
    }
}
