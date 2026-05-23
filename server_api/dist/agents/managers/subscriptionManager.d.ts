import { YpSubscriptionPlan } from "../models/subscriptionPlan.js";
import { YpSubscription } from "../models/subscription.js";
import { YpAgentProduct } from "../models/agentProduct.js";
import { YpAgentProductRun } from "../models/agentProductRun.js";
import WebSocket from "ws";
export declare class SubscriptionManager {
    constructor();
    getPlans(): Promise<YpSubscriptionPlan[]>;
    cloneCommunityTemplate(communityTemplateId: number, toDomainId: number): Promise<any>;
    cloneCommunityWorkflowTemplate(agentProduct: YpAgentProduct, domainId: number, currentUser: UserClass): Promise<{
        workflow: YpAgentRunWorkflowConfiguration;
        requiredQuestions?: any[];
    }>;
    createSubscriptions(userId: number, planIds: number[], paymentMethodId: string | null): Promise<{
        clientSecret?: string;
        subscriptionId?: string;
        freeSubscription?: boolean;
    }>;
    handleSuccessfulPayment(paymentIntentId: string): Promise<YpSubscription[]>;
    startAgentRun(subscriptionId: number, wsClients: Map<string, WebSocket>, wsClientId: string, currentUser: UserClass): Promise<{
        agentRun: YpAgentProductRun;
        subscription: YpSubscription;
    }>;
    startFirstAgent(agentProductRun: YpAgentProductRun, wsClients: Map<string, WebSocket>, wsClientId: string): Promise<boolean>;
    stopAgentRun(agentProductRunId: number): Promise<void>;
    private calculateNextBillingDate;
    private incrementRunsUsed;
    private checkRunsLimit;
}
