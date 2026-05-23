import { BaseAssistantTools } from "./baseTools.js";
import log from "../../../../utils/loggerTs.js";
export class WorkflowConversationTools extends BaseAssistantTools {
    constructor(assistant) {
        super(assistant);
    }
    get show_running_workflow_conversations() {
        return {
            name: "show_running_workflow_conversations",
            description: "Display running workflow conversations",
            type: "function",
            parameters: {
                type: "object",
                properties: {},
                required: []
            },
            handler: this.showRunningWorkflowsHandler.bind(this)
        };
    }
    async showRunningWorkflowsHandler(params) {
        params = this.assistant.getCleanedParams(params);
        log.info(`handler: show_running_workflows: ${JSON.stringify(params, null, 2)}`);
        try {
            const html = `<yp-workflow-widget-small running="true"></yp-workflow-widget-small>`;
            return {
                success: true,
                html,
                uniqueToken: "runningWorkflows",
                data: { message: "Running workflows displayed successfully" },
                metadata: { timestamp: new Date().toISOString() }
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error displaying running workflows";
            log.error(`Error in show_running_workflows: ${errorMessage}`);
            return {
                success: false,
                error: errorMessage
            };
        }
    }
    get show_all_workflow_conversations() {
        return {
            name: "show_all_workflow_conversations",
            description: "Display all workflow conversations",
            type: "function",
            parameters: {
                type: "object",
                properties: {},
                required: []
            },
            handler: this.showAllWorkflowsHandler.bind(this)
        };
    }
    async showAllWorkflowsHandler(params) {
        params = this.assistant.getCleanedParams(params);
        log.info(`handler: show_all_workflows: ${JSON.stringify(params, null, 2)}`);
        try {
            const html = `<yp-workflow-widget-small all="true"></yp-workflow-widget-small>`;
            return {
                success: true,
                html,
                uniqueToken: "allWorkflows",
                data: { message: "All workflows displayed successfully" },
                metadata: { timestamp: new Date().toISOString() }
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error displaying all workflows";
            log.error(`Error in show_all_workflows: ${errorMessage}`);
            return {
                success: false,
                error: errorMessage
            };
        }
    }
    get connect_to_workflow_conversation() {
        return {
            name: "connect_to_workflow_conversation",
            description: "Connect to an existing workflow conversation",
            type: "function",
            parameters: {
                type: "object",
                properties: {
                    workflowId: { type: "number" }
                },
                required: ["workflowId"]
            },
            handler: this.connectToWorkflowHandler.bind(this)
        };
    }
    async connectToWorkflowHandler(params) {
        params = this.assistant.getCleanedParams(params);
        log.info(`handler: connect_to_workflow: ${JSON.stringify(params, null, 2)}`);
        try {
            const { workflowId } = params;
            return {
                success: true,
                data: { message: `Connected to workflow ${workflowId} successfully` },
                uniqueToken: `connectWorkflow_${workflowId}`,
                metadata: { timestamp: new Date().toISOString() }
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error connecting to workflow conversation";
            log.error(`Error in connect_to_workflow_conversation: ${errorMessage}`);
            return {
                success: false,
                error: errorMessage
            };
        }
    }
}
