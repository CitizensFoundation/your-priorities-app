import { YpAgentAssistant } from "../../agentAssistant.js";
import { BaseAssistantTools } from "./baseTools.js";
export declare class WorkflowConversationTools extends BaseAssistantTools {
    constructor(assistant: YpAgentAssistant);
    get show_running_workflow_conversations(): {
        name: string;
        description: string;
        type: string;
        parameters: {
            type: string;
            properties: YpAgentEmptyProperties;
            required: readonly [];
        };
        handler: (params: {}) => Promise<ToolExecutionResult>;
    };
    showRunningWorkflowsHandler(params: {}): Promise<ToolExecutionResult>;
    get show_all_workflow_conversations(): {
        name: string;
        description: string;
        type: string;
        parameters: {
            type: string;
            properties: YpAgentEmptyProperties;
            required: readonly [];
        };
        handler: (params: {}) => Promise<ToolExecutionResult>;
    };
    showAllWorkflowsHandler(params: {}): Promise<ToolExecutionResult>;
    get connect_to_workflow_conversation(): {
        name: string;
        description: string;
        type: string;
        parameters: {
            type: string;
            properties: {
                workflowId: {
                    type: string;
                };
            };
            required: readonly ["workflowId"];
        };
        handler: (params: {
            workflowId: number;
        }) => Promise<ToolExecutionResult>;
    };
    connectToWorkflowHandler(params: {
        workflowId: number;
    }): Promise<ToolExecutionResult>;
}
