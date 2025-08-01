// SubscriptionController.ts
import express from "express";
import { SubscriptionManager } from "../managers/subscriptionManager.js";
import auth from "../../authorization.cjs";
import { YpSubscription } from "../models/subscription.js";
import Stripe from "stripe";
import log from "../../utils/loggerTs.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export class AgentSubscriptionController {
    constructor(wsClients) {
        this.path = "/api/subscriptions";
        this.router = express.Router();
        this.getAgentConfigurationAnswers = async (req, res) => {
            try {
                if (req.user) {
                    const subscriptionId = parseInt(req.params.subscriptionId);
                    // Make sure the user can only fetch their own subscription
                    const subscription = await YpSubscription.findOne({
                        where: {
                            id: subscriptionId,
                            user_id: req.user?.id
                        },
                    });
                    if (!subscription) {
                        res.status(404).json({ error: "Subscription not found" });
                        return;
                    }
                    // Extract the requiredQuestionsAnswered from subscription.configuration
                    const answers = subscription.configuration?.requiredQuestionsAnswered || [];
                    res.status(200).json({
                        success: true,
                        data: answers,
                    });
                    return;
                }
                else {
                    res.status(401).json({ error: "Unauthorized" });
                    return;
                }
            }
            catch (error) {
                log.error("Error retrieving subscription agent configuration:", error);
                res.status(500).json({ error: error.message });
            }
        };
        this.updateAgentConfiguration = async (req, res) => {
            try {
                const subscriptionId = parseInt(req.params.subscriptionId);
                const requiredQuestionsAnswered = req.body.requiredQuestionsAnswered;
                if (!requiredQuestionsAnswered) {
                    res.status(400).json({ error: "requiredQuestionsAnswered is required" });
                    return;
                }
                const subscription = await YpSubscription.findOne({
                    where: { id: subscriptionId, user_id: req.user.id }
                });
                if (!subscription) {
                    res.status(404).json({ error: "Subscription not found" });
                    return;
                }
                subscription.configuration.requiredQuestionsAnswered = JSON.parse(requiredQuestionsAnswered);
                subscription.changed('configuration', true);
                await subscription.save();
                res.status(200);
            }
            catch (error) {
                log.error("Error updating agent configuration:", error);
                res.status(500).json({ error: error.message });
            }
        };
        this.getPlans = async (req, res) => {
            try {
                const plans = await this.subscriptionManager.getPlans();
                res.json(plans);
            }
            catch (error) {
                log.error("Error fetching plans:", error);
                res.status(500).json({ error: error.message });
            }
        };
        this.createSubscriptions = async (req, res) => {
            try {
                const { planIds, isFreeTrialRequest } = req.body;
                const userId = req.user.id;
                // If not a free trial request, redirect to payment intent endpoint
                if (!isFreeTrialRequest) {
                    res.status(400).json({
                        error: "For paid subscriptions, please use /stripe-create-payment-intent instead",
                    });
                }
                // Handle free trial subscription
                if (!planIds) {
                    res.status(400).json({
                        error: "agentProductIds and planIds are required",
                    });
                }
                const result = await this.subscriptionManager.createSubscriptions(userId, planIds, null // No payment method needed for free trials
                );
                res.status(201).json({
                    subscriptionId: result.subscriptionId,
                    message: "Free trial subscription created successfully",
                });
            }
            catch (error) {
                log.error("Error creating free trial subscription:", error);
                res.status(500).json({ error: error.message });
            }
        };
        this.startAgentRun = async (req, res) => {
            try {
                const agentProductId = parseInt(req.body.agentProductId);
                const subscriptionId = parseInt(req.params.subscriptionId);
                const wsClientId = req.body.wsClientId;
                const { agentRun, subscription } = await this.subscriptionManager.startAgentRun(subscriptionId, this.wsClients, wsClientId, req.user);
                res.status(201).json({ agentRun, subscription });
            }
            catch (error) {
                log.error("Error starting agent run:", error);
                res.status(500).json({ error: error.message });
            }
        };
        this.stopAgentRun = async (req, res) => {
            try {
                const agentProductRunId = parseInt(req.body.agentProductRunId);
                await this.subscriptionManager.stopAgentRun(agentProductRunId);
                res.status(200).json({ message: "Agent run stopped successfully" });
            }
            catch (error) {
                log.error("Error stopping agent run:", error);
                res.status(500).json({ error: error.message });
            }
        };
        // Additional methods
        this.getSubscriptions = async (req, res) => {
            try {
                const userId = req.user.id;
                const subscriptions = await YpSubscription.findAll({
                    where: { user_id: userId },
                });
                res.json(subscriptions);
            }
            catch (error) {
                log.error("Error fetching subscriptions:", error);
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
                    res.status(404).json({ error: "Subscription not found" });
                    return;
                }
                subscription.status = "cancelled";
                await subscription.save();
                res.status(200).json({ message: "Subscription cancelled successfully" });
            }
            catch (error) {
                log.error("Error cancelling subscription:", error);
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
                    res.status(404).json({ error: "Subscription not found" });
                    return;
                }
                // Apply updates (validate as necessary)
                Object.assign(subscription, updates);
                await subscription.save();
                res.status(200).json(subscription);
            }
            catch (error) {
                log.error("Error updating subscription:", error);
                res.status(500).json({ error: error.message });
            }
        };
        this.createPaymentIntent = async (req, res) => {
            try {
                const userId = req.user.id;
                const { planIds, paymentMethodId } = req.body;
                if (!planIds || !paymentMethodId) {
                    res.status(400).json({
                        error: "planIds, and paymentMethodId are required",
                    });
                    return;
                }
                const result = await this.subscriptionManager.createSubscriptions(userId, planIds, paymentMethodId);
                res.status(200).json({
                    clientSecret: result.clientSecret,
                    subscriptionId: result.subscriptionId,
                });
                return;
            }
            catch (error) {
                log.error("Error creating payment intent:", error);
                res.status(500).json({ error: error.message });
            }
        };
        this.handleWebhook = async (req, res) => {
            const sig = req.headers["stripe-signature"];
            try {
                if (!sig) {
                    throw new Error("No Stripe signature found");
                }
                const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
                switch (event.type) {
                    case "payment_intent.succeeded":
                        const paymentIntent = event.data.object;
                        await this.subscriptionManager.handleSuccessfulPayment(paymentIntent.id);
                        break;
                    case "payment_intent.payment_failed":
                        const failedPayment = event.data.object;
                        // You might want to implement handling failed payments
                        log.error("Payment failed:", failedPayment.id);
                        break;
                    // Add other event types as needed
                }
                res.json({ received: true });
            }
            catch (error) {
                log.error("Webhook error:", error);
                res.status(400).json({ error: error.message });
            }
        };
        this.subscriptionManager = new SubscriptionManager();
        this.wsClients = wsClients;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/plans", this.getPlans);
        this.router.post("/", this.createSubscriptions);
        this.router.post("/:subscriptionId/start", this.startAgentRun);
        this.router.post("/:subscriptionId/stop", this.stopAgentRun);
        // Additional routes
        this.router.get("/", auth.can("view subscriptions"), this.getSubscriptions);
        this.router.delete("/:subscriptionId", this.cancelSubscription);
        this.router.put("/:subscriptionId", this.updateSubscription);
        this.router.put("/:subscriptionId/updateAgentConfiguration", this.updateAgentConfiguration);
        this.router.get("/:subscriptionId/getConfigurationAnswers", this.getAgentConfigurationAnswers);
        // Add new payment-related routes
        this.router.post("/stripe-create-payment-intent", this.createPaymentIntent);
        this.router.post("/stripe-webhook", express.raw({ type: "application/json" }), this.handleWebhook);
    }
    initializeRoutesSecure() {
        this.router.get("/plans", auth.can("view subscriptions"), this.getPlans);
        this.router.post("/", auth.can("create subscriptions"), this.createSubscriptions);
        this.router.put("/:subscriptionId/updateAgentConfiguration", auth.can("edit subscriptions"), this.updateAgentConfiguration);
        this.router.get("/:subscriptionId/getConfigurationAnswers", auth.can("view subscriptions"), this.getAgentConfigurationAnswers);
        this.router.post("/:subscriptionId/start", auth.can("edit subscriptions"), this.startAgentRun);
        this.router.post("/:subscriptionId/stop", auth.can("edit subscriptions"), this.stopAgentRun);
        // Additional routes
        this.router.get("/", auth.can("view subscriptions"), this.getSubscriptions);
        this.router.delete("/:subscriptionId", auth.can("edit subscriptions"), this.cancelSubscription);
        this.router.put("/:subscriptionId", auth.can("edit subscriptions"), this.updateSubscription);
        // Add new payment-related routes
        this.router.post("/stripe-create-payment-intent", auth.can("create subscriptions"), this.createPaymentIntent);
        this.router.post("/stripe-webhook", express.raw({ type: "application/json" }), this.handleWebhook);
    }
}
