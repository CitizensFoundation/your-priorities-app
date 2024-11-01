// SubscriptionController.ts

import express from 'express';
import { SubscriptionManager } from '../managers/subscriptionManager.js';
import auth from '../../authorization.cjs';
import { YpSubscription } from '../models/subscription.js';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface YpRequest extends express.Request {
  ypDomain?: any;
  ypCommunity?: any;
  sso?: any;
  redisClient?: any;
  user?: any;
}

export class AgentSubscriptionController {
  public path = '/api/subscriptions';
  public router = express.Router();
  private subscriptionManager: SubscriptionManager;

  constructor() {
    this.subscriptionManager = new SubscriptionManager();
    this.initializeRoutes();
  }

  public initializeRoutes() {
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
    this.router.post('/stripe-webhook', express.raw({type: 'application/json'}), this.handleWebhook);
  }

  getPlans = async (req: YpRequest, res: express.Response) => {
    try {
      const plans = await this.subscriptionManager.getPlans();
      res.json(plans);
    } catch (error: any) {
      console.error('Error fetching plans:', error);
      res.status(500).json({ error: error.message });
    }
  };

  createSubscriptions = async (req: YpRequest, res: express.Response) => {
    try {
      const { planIds, isFreeTrialRequest } = req.body;
      const userId = req.user.id;

      // If not a free trial request, redirect to payment intent endpoint
      if (!isFreeTrialRequest) {
        return res.status(400).json({
          error: 'For paid subscriptions, please use /stripe-create-payment-intent instead'
        });
      }

      // Handle free trial subscription
      if (!planIds) {
        return res.status(400).json({
          error: 'agentProductIds and planIds are required'
        });
      }

      const result = await this.subscriptionManager.createSubscriptions(
        userId,
        planIds,
        null // No payment method needed for free trials
      );

      res.status(201).json({
        subscriptionId: result.subscriptionId,
        message: 'Free trial subscription created successfully'
      });
    } catch (error: any) {
      console.error('Error creating free trial subscription:', error);
      res.status(500).json({ error: error.message });
    }
  };

  startAgentRun = async (req: YpRequest, res: express.Response) => {
    try {
      const agentProductId = parseInt(req.body.agentProductId);
      const subscriptionId = parseInt(req.params.subscriptionId);

      const agentRun = await this.subscriptionManager.startAgentRun(agentProductId, subscriptionId);
      res.status(201).json(agentRun);
    } catch (error: any) {
      console.error('Error starting agent run:', error);
      res.status(500).json({ error: error.message });
    }
  };

  stopAgentRun = async (req: YpRequest, res: express.Response) => {
    try {
      const agentProductRunId = parseInt(req.body.agentProductRunId);

      await this.subscriptionManager.stopAgentRun(agentProductRunId);
      res.status(200).json({ message: 'Agent run stopped successfully' });
    } catch (error: any) {
      console.error('Error stopping agent run:', error);
      res.status(500).json({ error: error.message });
    }
  };

  // Additional methods

  getSubscriptions = async (req: YpRequest, res: express.Response) => {
    try {
      const userId = req.user.id;
      const subscriptions = await YpSubscription.findAll({ where: { user_id: userId } });
      res.json(subscriptions);
    } catch (error: any) {
      console.error('Error fetching subscriptions:', error);
      res.status(500).json({ error: error.message });
    }
  };

  cancelSubscription = async (req: YpRequest, res: express.Response) => {
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
    } catch (error: any) {
      console.error('Error cancelling subscription:', error);
      res.status(500).json({ error: error.message });
    }
  };

  updateSubscription = async (req: YpRequest, res: express.Response) => {
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
    } catch (error: any) {
      console.error('Error updating subscription:', error);
      res.status(500).json({ error: error.message });
    }
  };

  createPaymentIntent = async (req: YpRequest, res: express.Response) => {
    try {
      const userId = req.user.id;
      const {planIds, paymentMethodId } = req.body;

      if (!planIds || !paymentMethodId) {
        return res.status(400).json({
          error: 'planIds, and paymentMethodId are required'
        });
      }

      const result = await this.subscriptionManager.createSubscriptions(
        userId,
        planIds,
        paymentMethodId
      );

      res.status(200).json({
        clientSecret: result.clientSecret,
        subscriptionId: result.subscriptionId
      });
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ error: error.message });
    }
  };

  handleWebhook = async (req: YpRequest, res: express.Response) => {
    const sig = req.headers['stripe-signature'];

    try {
      if (!sig) {
        throw new Error('No Stripe signature found');
      }

      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          await this.subscriptionManager.handleSuccessfulPayment(paymentIntent.id);
          break;

        case 'payment_intent.payment_failed':
          const failedPayment = event.data.object as Stripe.PaymentIntent;
          // You might want to implement handling failed payments
          console.error('Payment failed:', failedPayment.id);
          break;

        // Add other event types as needed
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error);
      res.status(400).json({ error: error.message });
    }
  };
}
