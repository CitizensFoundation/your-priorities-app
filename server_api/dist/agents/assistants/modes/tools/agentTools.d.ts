import { YpAgentAssistant } from "../../agentAssistant.js";
import { BaseAssistantTools } from "./baseTools.js";
import { AgentModels } from "./models/agents.js";
export declare class AgentTools extends BaseAssistantTools {
    agentModels: AgentModels;
    constructor(assistant: YpAgentAssistant);
    get showAgentWorkflowOverviewWidget(): {
        name: string;
        description: string;
        type: string;
        parameters: {
            type: string;
            properties: YpAgentEmptyProperties;
        };
        handler: (params: YpAgentEmptyProperties) => Promise<ToolExecutionResult>;
    };
    showAgentWorkflowOverviewWidgetHandler(params: YpAgentEmptyProperties): Promise<ToolExecutionResult>;
    get showAgentRunWidget(): {
        name: string;
        description: string;
        type: string;
        parameters: {
            type: string;
            properties: YpAgentEmptyProperties;
        };
        handler: (params: YpAgentEmptyProperties) => Promise<ToolExecutionResult>;
    };
    showAgentRunWidgetHandler(params: YpAgentEmptyProperties): Promise<ToolExecutionResult>;
    get createNewAgentRunReadyToRunFirstWorkflowStep(): {
        name: string;
        description: string;
        type: string;
        parameters: {
            type: string;
            properties: YpAgentRunStartProperties;
            required: readonly ["hasVerballyConfirmedTheRun"];
        };
        handler: (params: YpAgentRunStartParams) => Promise<ToolExecutionResult>;
    };
    createNewAgentRunReadyToRunFirstWorkflowStepHandler(params: YpAgentRunStartParams): Promise<ToolExecutionResult>;
    startCurrentRunAgentNextWorkflowStep(): Promise<{
        name: string;
        description: string;
        type: string;
        parameters: {
            type: string;
            properties: YpAgentRunStartNextWorkflowStepProperties;
            required: readonly ["userHasVerballyConfirmedStartOfNextWorkflowStepWithTheAgentName"];
        };
        handler: (params: YpAgentRunStartNextWorkflowStepParams) => Promise<ToolExecutionResult>;
    }>;
    startCurrentRunAgentNextWorkflowStepHandler(params: YpAgentRunStartNextWorkflowStepParams): Promise<ToolExecutionResult>;
    get stopCurrentAgentWorkflow(): {
        name: string;
        description: string;
        type: string;
        parameters: {
            type: string;
            properties: YpAgentRunStopCurrentWorkflowStepProperties;
            required: readonly ["userHasVerballyConfirmedStopCurrentWorkflowStepWithTheAgentName"];
        };
        handler: (params: YpAgentRunStopCurrentWorkflowStepParams) => Promise<ToolExecutionResult>;
    };
    stopCurrentAgentWorkflowHandler(params: YpAgentRunStopCurrentWorkflowStepParams): Promise<ToolExecutionResult>;
    get deactivateAgent(): {
        name: string;
        description: string;
        type: string;
        parameters: {
            type: string;
            properties: YpAgentEmptyProperties;
        };
        handler: (params: YpAgentEmptyProperties) => Promise<ToolExecutionResult>;
    };
    deactivateAgentHandler(params: YpAgentEmptyProperties): Promise<ToolExecutionResult>;
    get showConfigurationWidget(): {
        name: string;
        description: string;
        type: string;
        parameters: {
            type: string;
            properties: YpAgentEmptyProperties;
        };
        handler: (params: YpAgentEmptyProperties) => Promise<ToolExecutionResult>;
    };
    showConfigurationWidgetHandler(params: YpAgentEmptyProperties): Promise<ToolExecutionResult>;
    get submitConfiguration(): {
        name: string;
        description: string;
        type: string;
        parameters: {
            type: string;
            properties: YpAgentEmptyProperties;
        };
        handler: (params: YpAgentEmptyProperties) => Promise<ToolExecutionResult>;
    };
    submitConfigurationHandler(params: YpAgentEmptyProperties): Promise<ToolExecutionResult>;
    getSimpleWorkflow(workflow: YpAgentRunWorkflowConfiguration): YpAgentRunWorkflowConfiguration;
    private renderAgentRunWidget;
}
