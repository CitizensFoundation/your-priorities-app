import { YpAgentAssistant } from "../../../agentAssistant.js";
export declare class SubscriptionModels {
    assistant: YpAgentAssistant;
    constructor(assistant: YpAgentAssistant);
    loadAgentSubscriptionPlans(): Promise<AssistantAgentPlanStatus>;
    loadAgentProductPlanAndSubscription(subscriptionPlanId: number): Promise<{
        plan: YpSubscriptionPlanAttributes | null;
        subscription: YpSubscriptionAttributes | null;
    }>;
    loadUserAgentSubscriptions(): Promise<AssistantAgentSubscriptionStatus>;
    unsubscribeFromAgentPlan(subscriptionId: number): Promise<UnsubscribeResult>;
    subscribeToAgentPlan(agentProductId: number, subscriptionPlanId: number, returnCurrentSubscription?: boolean): Promise<SubscribeResult>;
}
