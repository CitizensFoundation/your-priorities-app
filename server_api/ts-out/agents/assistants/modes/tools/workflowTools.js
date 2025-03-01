import { BaseAssistantTools } from "./baseTools.js";
export class WorkflowTools extends BaseAssistantTools {
    constructor(assistant) {
        super(assistant);
    }
    get show_running_workflows() {
        return {
            name: "show_running_workflows",
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
        console.log(`handler: show_running_workflows: ${JSON.stringify(params, null, 2)}`);
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
            console.error(`Error in show_running_workflows: ${errorMessage}`);
            return {
                success: false,
                error: errorMessage
            };
        }
    }
    get show_all_workflows() {
        return {
            name: "show_all_workflows",
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
        console.log(`handler: show_all_workflows: ${JSON.stringify(params, null, 2)}`);
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
            console.error(`Error in show_all_workflows: ${errorMessage}`);
            return {
                success: false,
                error: errorMessage
            };
        }
    }
    get connect_to_workflow() {
        return {
            name: "connect_to_workflow",
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
        console.log(`handler: connect_to_workflow: ${JSON.stringify(params, null, 2)}`);
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
            const errorMessage = error instanceof Error ? error.message : "Error connecting to workflow";
            console.error(`Error in connect_to_workflow: ${errorMessage}`);
            return {
                success: false,
                error: errorMessage
            };
        }
    }
}
