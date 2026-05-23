import { YpAgentAssistant } from "../../agentAssistant.js";
import { SubscriptionModels } from "./models/subscriptions.js";
import { BaseAssistantTools } from "./baseTools.js";
export declare class SubscriptionTools extends BaseAssistantTools {
    subscriptionModels: SubscriptionModels;
    constructor(assistant: YpAgentAssistant);
    get listMyAgentSubscriptions(): {
        name: string;
        description: string;
        type: string;
        parameters: {
            type: string;
            properties: YpAgentEmptyProperties;
        };
        handler: (params: YpAgentEmptyProperties) => Promise<ToolExecutionResult>;
    };
    listMyAgentSubscriptionsHandler(params: YpAgentEmptyProperties): Promise<ToolExecutionResult>;
    get listAllAgentsAvailableForSubscription(): {
        name: string;
        description: string;
        type: string;
        parameters: {
            type: string;
            properties: YpAgentEmptyProperties;
        };
        handler: (params: YpAgentEmptyProperties) => Promise<ToolExecutionResult>;
    };
    listAllAgentsAvailableForSubscriptionHandler(params: YpAgentEmptyProperties): Promise<ToolExecutionResult>;
    get subscribeToCurrentAgentPlan(): {
        name: string;
        description: string;
        type: string;
        parameters: {
            type: string;
            properties: YpAgentSubscribeProperties;
            required: readonly ["useHasVerballyConfirmedSubscribeWithTheAgentName"];
        };
        handler: (params: YpAgentSubscribeParams) => Promise<ToolExecutionResult>;
    };
    subscribeToCurrentAgentPlanHandler(params: YpAgentSubscribeParams): Promise<ToolExecutionResult>;
    get unsubscribeFromCurrentAgentSubscription(): {
        name: string;
        description: string;
        type: string;
        parameters: {
            type: string;
            properties: YpAgentUnsubscribeProperties;
            required: readonly ["useHasVerballyConfirmedUnsubscribeWithTheAgentName"];
        };
        handler: (params: YpAgentUnsubscribeParams) => Promise<ToolExecutionResult>;
    };
    unsubscribeFromCurrentAgentSubscriptionHandler(params: YpAgentUnsubscribeParams): Promise<ToolExecutionResult>;
}
