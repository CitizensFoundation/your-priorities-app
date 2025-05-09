import { SubscriptionModels } from "./subscriptions.js";
import { YpAgentAssistant } from "../../../../assistants/agentAssistant.js";
export declare class AgentModels {
    subscriptionModels: SubscriptionModels;
    assistant: YpAgentAssistant;
    private queueManager;
    constructor(assistant: YpAgentAssistant);
    getCurrentAgentAndWorkflow(): Promise<{
        agent: YpAgentProductAttributes;
        run: YpAgentProductRunAttributes | undefined;
    }>;
    convertToUnderscoresWithMaxLength(str: string): string;
    startCurrentWorkflowStep(agentRunId: number, structuredAnswersOverrides?: YpStructuredAnswer[]): Promise<{
        agentRun: YpAgentProductRunAttributes;
        previousStep: YpAgentRunWorkflowStep;
        currentStep: YpAgentRunWorkflowStep;
        message: string;
    }>;
    getCurrentWorkflowStep(): Promise<YpAgentRunWorkflowStep>;
    getNextWorkflowStep(): Promise<YpAgentRunWorkflowStep | undefined>;
    stopCurrentWorkflowStep(): Promise<{
        agent: YpAgentProductAttributes;
        run: YpAgentProductRunAttributes;
        message: string;
    }>;
    checkAgentStatus(): Promise<PsAgentStatus | null>;
}
