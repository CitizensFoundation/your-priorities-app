import { BaseAssistantTools } from "./baseTools.js";
import { AgentModels } from "./models/agents.js";
export class AgentTools extends BaseAssistantTools {
    constructor(assistant) {
        super(assistant);
        this.agentModels = new AgentModels(assistant);
    }
    get showAgentWorkflowWidget() {
        return {
            name: "show_agent_workflow_widget",
            description: "Show the workflow widget for the current agent",
            type: "function",
            parameters: {
                type: "object",
                properties: {},
            },
            handler: this.showAgentWorkflowWidgetHandler.bind(this),
        };
    }
    async showAgentWorkflowWidgetHandler(params) {
        try {
            const { agent, run } = await this.agentModels.getCurrentAgentAndWorkflow();
            if (run) {
                const html = `<yp-agent-workflow-widget
        agentProductId="${agent.id}"
        runId="${run.id}"
        agentName="${agent.name}"
        agentDescription="${agent.description}"
        workflowStatus="${run.status || 'not_started'}"
      ></yp-agent-workflow-widget>`;
                return {
                    success: true,
                    html,
                    data: { agent, run },
                };
            }
            else {
                return {
                    success: false,
                    error: "No current agent workflow found",
                };
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to show workflow widget";
            console.error(errorMessage);
            return {
                success: false,
                error: errorMessage,
            };
        }
    }
    get startCurrentAgentWorkflow() {
        return {
            name: "start_current_agent_workflow",
            description: "Start the workflow for the current agent",
            type: "function",
            parameters: {
                type: "object",
                properties: {},
            },
            handler: this.startCurrentAgentWorkflowHandler.bind(this),
        };
    }
    async startCurrentAgentWorkflowHandler(params) {
        try {
            const result = await this.agentModels.startAgentWorkflow();
            await this.updateAgentProductRun(result.run);
            const html = `<yp-agent-workflow-widget
        agentProductId="${result.agent.id}"
        workflowId="${result.run.id}"
        agentName="${result.agent.name}"
        workflowStatus="running"
        showProgress="true"
      ></yp-agent-workflow-widget>`;
            return {
                success: true,
                html,
                data: result,
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to start workflow";
            console.error(errorMessage);
            return {
                success: false,
                error: errorMessage,
            };
        }
    }
    get stopCurrentAgentWorkflow() {
        return {
            name: "stop_current_agent_workflow",
            description: "Stop the currently running agent workflow",
            type: "function",
            parameters: {
                type: "object",
                properties: {},
            },
            handler: this.stopCurrentAgentWorkflowHandler.bind(this),
        };
    }
    async stopCurrentAgentWorkflowHandler(params) {
        try {
            const result = await this.agentModels.stopAgentWorkflow();
            const html = `<yp-agent-workflow-widget
        agentProductId="${result.agent.id}"
        runId="${result.run.id}"
        agentName="${result.agent.name}"
        workflowStatus="stopped"
      ></yp-agent-workflow-widget>`;
            return {
                success: true,
                html,
                data: result,
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to stop workflow";
            console.error(errorMessage);
            return {
                success: false,
                error: errorMessage,
            };
        }
    }
    get showConfigurationWidget() {
        return {
            name: "show_configuration_widget",
            description: "Show the configuration widget for the current agent",
            type: "function",
            parameters: {
                type: "object",
                properties: {},
            },
            handler: this.showConfigurationWidgetHandler.bind(this),
        };
    }
    async showConfigurationWidgetHandler(params) {
        try {
            const agent = await this.agentModels.getCurrentAgent();
            const html = `<yp-agent-configuration-widget
        agentProductId="${agent.id}"
        agentName="${agent.name}"
        requiredQuestions='${JSON.stringify(agent.configuration.requiredStructuredQuestions)}'
      ></yp-agent-configuration-widget>`;
            await this.updateShownConfigurationWidget();
            return {
                success: true,
                html,
                data: { agent },
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to show configuration widget";
            console.error(errorMessage);
            return {
                success: false,
                error: errorMessage,
            };
        }
    }
    get submitConfiguration() {
        return {
            name: "submit_configuration",
            description: "Submit the configuration for the current agent",
            type: "function",
            parameters: {
                type: "object",
                properties: {},
            },
            handler: this.submitConfigurationHandler.bind(this),
        };
    }
    async submitConfigurationHandler(params) {
        try {
            const clientEvent = {
                name: "ui_click",
                details: "submit-agent-configuration",
            };
            return {
                success: true,
                clientEvents: [clientEvent],
                data: { message: "Web app asked to submit configuration" },
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to submit configuration";
            console.error(errorMessage);
            return {
                success: false,
                error: errorMessage,
            };
        }
    }
}
