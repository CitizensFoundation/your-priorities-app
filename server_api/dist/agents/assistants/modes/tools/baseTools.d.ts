import { YpAgentAssistant } from "../../agentAssistant.js";
export declare class BaseAssistantTools {
    protected assistant: YpAgentAssistant;
    constructor(assistant: YpAgentAssistant);
    waitTick(): Promise<void>;
    updateCurrentAgentProductPlan(plan: YpSubscriptionPlanAttributes, subscription: YpSubscriptionAttributes | null, options?: {
        sendEvent: boolean;
    }): Promise<void>;
    updateAgentProductRun(agentRun: YpAgentProductRunAttributes, options?: {
        sendEvent: boolean;
    }): Promise<void>;
    updateShownConfigurationWidget(options?: {
        sendEvent: boolean;
    }): Promise<void>;
    updateHaveShownLoginWidget(options?: {
        sendEvent: boolean;
    }): Promise<void>;
    clearCurrentAgentProduct(options?: {
        sendEvent: boolean;
    }): Promise<void>;
}
