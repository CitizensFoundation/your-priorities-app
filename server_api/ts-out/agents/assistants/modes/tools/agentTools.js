import { BaseAssistantTools } from "./baseTools.js";
import { AgentModels } from "./models/agents.js";
export class AgentTools extends BaseAssistantTools {
    constructor(assistant) {
        super(assistant);
        this.agentModels = new AgentModels(assistant);
    }
    get showAgentWorkflowOverviewWidget() {
        return {
            name: "show_agent_workflow_overview_widget",
            description: "Show the workflow widget overview for the current agent.",
            type: "function",
            parameters: {
                type: "object",
                properties: {},
            },
            handler: this.showAgentWorkflowOverviewWidgetHandler.bind(this),
        };
    }
    async showAgentWorkflowOverviewWidgetHandler(params) {
        try {
            const { agent, run } = await this.agentModels.getCurrentAgentAndWorkflow();
            const workflowJson = JSON.stringify(agent.configuration.workflow);
            const base64Workflow = btoa(workflowJson);
            const html = `<yp-agent-workflow-widget
        agentProductId="${agent.id}"
        runId="${run?.id}"
        agentName="${agent.name}"
        agentDescription="${agent.description}"
        workflow="${base64Workflow}"
        workflowStatus="${run?.status || "not_started"}"
      ></yp-agent-workflow-widget>`;
            return {
                success: true,
                html,
                data: { agent, run, workflowJson },
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : "Failed to show workflow widget";
            console.error(errorMessage);
            return {
                success: false,
                error: errorMessage,
            };
        }
    }
    get showAgentRunWidget() {
        return {
            name: "show_agent_run_widget",
            description: "Show the agent run widget for the current agent run",
            type: "function",
            parameters: {
                type: "object",
                properties: {},
            },
            handler: this.showAgentRunWidgetHandler.bind(this),
        };
    }
    async showAgentRunWidgetHandler(params) {
        try {
            const { agent, run } = await this.agentModels.getCurrentAgentAndWorkflow();
            if (!this.assistant.memory.currentAgentStatus?.activeAgentRun) {
                return {
                    success: false,
                    error: "No active agent run found",
                };
            }
            const html = this.renderAgentRunWidget(agent, this.assistant.memory.currentAgentStatus.activeAgentRun);
            //TODO: Create a unique identifer so we can make sure to only have one widget showing at the same time on the client but also in the
            // chatLog history that we only have the latest html and json so not to confuse the model
            return {
                success: true,
                html,
                data: {
                    agent,
                    run,
                    subscription: this.assistant.memory.currentAgentStatus?.subscription,
                },
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : "Failed to show agent run widget";
            console.error(errorMessage);
            return {
                success: false,
                error: errorMessage,
            };
        }
    }
    get startNewAgentRun() {
        return {
            name: "start_new_agent_run",
            description: "Start an new agent run and get a confirmation from the user and add to the hasVerballyConfirmedTheRun property",
            type: "function",
            parameters: {
                type: "object",
                properties: {
                    hasVerballyConfirmedTheRun: {
                        type: "boolean",
                    },
                },
                required: [
                    "hasVerballyConfirmedTheRun",
                ],
            },
            handler: this.startNewAgentRunHandler.bind(this),
        };
    }
    async startNewAgentRunHandler(params) {
        params = this.assistant.getCleanedParams(params);
        if (!params.hasVerballyConfirmedTheRun) {
            return {
                success: false,
                error: "User did not verbally confirm starting the new run",
            };
        }
        if (!this.assistant.memory.currentAgentStatus?.subscription) {
            return {
                success: false,
                error: "No subscription found",
            };
        }
        try {
            const { agentRun, subscription } = await this.assistant.subscriptionManager.startAgentRun(this.assistant.memory.currentAgentStatus.subscription.id, this.assistant.wsClients, this.assistant.wsClientId);
            await this.updateAgentProductRun(agentRun);
            const html = this.renderAgentRunWidget(subscription.AgentProduct, agentRun);
            return {
                success: true,
                html,
                data: { agentRun, subscription },
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to start run";
            console.error(errorMessage);
            return {
                success: false,
                error: errorMessage,
            };
        }
    }
    get startCurrentRunAgentNextWorkflowStep() {
        return {
            name: "start_current_agent_run_next_workflow_step",
            description: "Start the next workflow step for the current agent run",
            type: "function",
            parameters: {
                type: "object",
                properties: {
                    useHasVerballyConfirmedStartOfNextWorkflowStepWithTheAgentName: {
                        type: "boolean",
                    },
                },
                required: [
                    "useHasVerballyConfirmedStartOfNextWorkflowStepWithTheAgentName",
                ],
            },
            handler: this.startCurrentRunAgentNextWorkflowStepHandler.bind(this),
        };
    }
    async startCurrentRunAgentNextWorkflowStepHandler(params) {
        params = this.assistant.getCleanedParams(params);
        if (!params.useHasVerballyConfirmedStartOfNextWorkflowStepWithTheAgentName) {
            return {
                success: false,
                error: "User did not confirm starting the next workflow step with the agent name",
            };
        }
        try {
            const result = await this.agentModels.startAgentWorkflow();
            await this.updateAgentProductRun(result.run);
            const html = this.renderAgentRunWidget(result.agent, result.run);
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
                properties: {
                    useHasVerballyConfirmedStopCurrentWorkflowStepWithTheAgentName: {
                        type: "boolean",
                    },
                },
                required: [
                    "useHasVerballyConfirmedStopCurrentWorkflowStepWithTheAgentName",
                ],
            },
            handler: this.stopCurrentAgentWorkflowHandler.bind(this),
        };
    }
    async stopCurrentAgentWorkflowHandler(params) {
        params = this.assistant.getCleanedParams(params);
        if (!params.useHasVerballyConfirmedStopCurrentWorkflowStepWithTheAgentName) {
            return {
                success: false,
                error: "User did not confirm stopping the current workflow step with the agent name",
            };
        }
        try {
            const result = await this.agentModels.stopAgentWorkflow();
            const html = this.renderAgentRunWidget(result.agent, result.run);
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
            description: "Show the configuration widget for the current agent, this is needed before running the agent workflow",
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
            const subscription = await this.agentModels.getCurrentSubscription();
            const html = `<yp-agent-configuration-widget
        domainId="${this.assistant.domainId}"
        agentProductId="${agent.id}"
        agentName="${agent.name}"
        subscriptionId="${subscription.id}"
        agentImageUrl="${agent.configuration.avatar?.imageUrl}"
        requiredQuestions='${JSON.stringify(subscription?.Plan?.configuration.requiredStructuredQuestions)}'
        requiredQuestionsAnswered='${JSON.stringify(subscription?.configuration?.requiredQuestionsAnswered ?? [])}'
      ></yp-agent-configuration-widget>`;
            await this.updateShownConfigurationWidget();
            return {
                success: true,
                html,
                data: {
                    agent,
                    subscription,
                },
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : "Failed to show configuration widget";
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
            description: "Sends an event to the webapp to click on the submit button for the user for the configuration of the current agent, this will submit the configuration to the agent",
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
            const errorMessage = error instanceof Error
                ? error.message
                : "Failed to submit configuration";
            console.error(errorMessage);
            return {
                success: false,
                error: errorMessage,
            };
        }
    }
    renderAgentRunWidget(agent, run) {
        const subscription = this.assistant.memory.currentAgentStatus?.subscription;
        const workflowBase64 = btoa(JSON.stringify(run.workflow));
        return `<yp-agent-run-widget
        agentProductId="${agent.id}"
        runId="${run.id}"
        wsClientId="${this.assistant.wsClientId}"
        agentName="${agent.name}"
        agentImageUrl="${agent.configuration.avatar?.imageUrl}"
        workflow="${workflowBase64}"
        runStatus="${run.status}"
        maxRunsPerCycle="${subscription?.Plan?.configuration.max_runs_per_cycle}"
      ></yp-agent-run-widget>`;
    }
}
