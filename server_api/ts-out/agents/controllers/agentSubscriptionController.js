// SubscriptionController.ts
import express from 'express';
import { SubscriptionManager } from '../managers/subscriptionManager.js';
import auth from '../../authorization.cjs';
import { YpSubscription } from '../models/subscription.js';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export class AgentSubscriptionController {
    constructor() {
        this.path = '/api/subscriptions';
        this.router = express.Router();
        this.getPlans = async (req, res) => {
            try {
                const plans = await this.subscriptionManager.getPlans();
                res.json(plans);
            }
            catch (error) {
                console.error('Error fetching plans:', error);
                res.status(500).json({ error: error.message });
            }
        };
        this.createSubscriptions = async (req, res) => {
            res.status(400).json({
                error: 'This endpoint is deprecated. Please use /create-payment-intent instead'
            });
        };
        this.startAgentRun = async (req, res) => {
            try {
                const agentProductId = parseInt(req.body.agentProductId);
                const subscriptionId = parseInt(req.params.subscriptionId);
                const agentRun = await this.subscriptionManager.startAgentRun(agentProductId, subscriptionId);
                res.status(201).json(agentRun);
            }
            catch (error) {
                console.error('Error starting agent run:', error);
                res.status(500).json({ error: error.message });
            }
        };
        this.stopAgentRun = async (req, res) => {
            try {
                const agentProductRunId = parseInt(req.body.agentProductRunId);
                await this.subscriptionManager.stopAgentRun(agentProductRunId);
                res.status(200).json({ message: 'Agent run stopped successfully' });
            }
            catch (error) {
                console.error('Error stopping agent run:', error);
                res.status(500).json({ error: error.message });
            }
        };
        // Additional methods
        this.getSubscriptions = async (req, res) => {
            try {
                const userId = req.user.id;
                const subscriptions = await YpSubscription.findAll({ where: { user_id: userId } });
                res.json(subscriptions);
            }
            catch (error) {
                console.error('Error fetching subscriptions:', error);
                res.status(500).json({ error: error.message });
            }
        };
        this.cancelSubscription = async (req, res) => {
            try {
                const subscriptionId = parseInt(req.params.subscriptionId);
                const userId = req.user.id;
                const subscription = await YpSubscription.findOne({
                    where: { id: subscriptionId, user_id: userId },
                });
                if (!subscription) {
                    return res.status(404).json({ error: 'Subscription not found' });
                }
                subscription.status = 'cancelled';
                await subscription.save();
                res.status(200).json({ message: 'Subscription cancelled successfully' });
            }
            catch (error) {
                console.error('Error cancelling subscription:', error);
                res.status(500).json({ error: error.message });
            }
        };
        this.updateSubscription = async (req, res) => {
            try {
                const subscriptionId = parseInt(req.params.subscriptionId);
                const userId = req.user.id;
                const updates = req.body;
                const subscription = await YpSubscription.findOne({
                    where: { id: subscriptionId, user_id: userId },
                });
                if (!subscription) {
                    return res.status(404).json({ error: 'Subscription not found' });
                }
                // Apply updates (validate as necessary)
                Object.assign(subscription, updates);
                await subscription.save();
                res.status(200).json(subscription);
            }
            catch (error) {
                console.error('Error updating subscription:', error);
                res.status(500).json({ error: error.message });
            }
        };
        this.createPaymentIntent = async (req, res) => {
            try {
                const userId = req.user.id;
                const { agentProductIds, planIds, paymentMethodId } = req.body;
                if (!agentProductIds || !planIds || !paymentMethodId) {
                    return res.status(400).json({
                        error: 'agentProductIds, planIds, and paymentMethodId are required'
                    });
                }
                const result = await this.subscriptionManager.createSubscriptions(userId, agentProductIds, planIds, paymentMethodId);
                res.status(200).json({
                    clientSecret: result.clientSecret,
                    subscriptionId: result.subscriptionId
                });
            }
            catch (error) {
                console.error('Error creating payment intent:', error);
                res.status(500).json({ error: error.message });
            }
        };
        this.handleWebhook = async (req, res) => {
            const sig = req.headers['stripe-signature'];
            try {
                if (!sig) {
                    throw new Error('No Stripe signature found');
                }
                const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
                switch (event.type) {
                    case 'payment_intent.succeeded':
                        const paymentIntent = event.data.object;
                        await this.subscriptionManager.handleSuccessfulPayment(paymentIntent.id);
                        break;
                    case 'payment_intent.payment_failed':
                        const failedPayment = event.data.object;
                        // You might want to implement handling failed payments
                        console.error('Payment failed:', failedPayment.id);
                        break;
                    // Add other event types as needed
                }
                res.json({ received: true });
            }
            catch (error) {
                console.error('Webhook error:', error);
                res.status(400).json({ error: error.message });
            }
        };
        this.subscriptionManager = new SubscriptionManager();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/plans', auth.can('view subscriptions'), this.getPlans);
        this.router.post('/', auth.can('create subscriptions'), this.createSubscriptions);
        this.router.post('/:subscriptionId/start', auth.can('edit subscriptions'), this.startAgentRun);
        this.router.post('/:subscriptionId/stop', auth.can('edit subscriptions'), this.stopAgentRun);
        // Additional routes
        this.router.get('/', auth.can('view subscriptions'), this.getSubscriptions);
        this.router.delete('/:subscriptionId', auth.can('edit subscriptions'), this.cancelSubscription);
        this.router.put('/:subscriptionId', auth.can('edit subscriptions'), this.updateSubscription);
        // Add new payment-related routes
        this.router.post('/stripe-create-payment-intent', auth.can('create subscriptions'), this.createPaymentIntent);
        this.router.post('/stripe-webhook', express.raw({ type: 'application/json' }), this.handleWebhook);
    }
}
