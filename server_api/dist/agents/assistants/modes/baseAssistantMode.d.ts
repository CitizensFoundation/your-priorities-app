import { YpAgentAssistant } from "../agentAssistant.js";
export declare class BaseAssistantMode {
    protected assistant: YpAgentAssistant;
    constructor(assistant: YpAgentAssistant);
    protected get memory(): YpBaseAssistantMemoryData;
    renderSimplifiedWorkflowStep(step: YpAgentRunWorkflowStep | undefined): string;
    renderSimplifiedWorkflow(workflow: YpAgentRunWorkflowConfiguration): string;
    renderSimplifiedAgentRun(agentRun: YpAgentProductRunAttributes | undefined): string;
    renderCommon(): Promise<"" | undefined>;
}
