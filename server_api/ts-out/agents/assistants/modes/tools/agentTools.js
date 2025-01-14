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
            const workflowJson = JSON.stringify(this.getSimpleWorkflow(agent.configuration.workflow));
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
            const agentRun = await this.assistant.getCurrentAgentRun();
            if (!agentRun) {
                return {
                    success: false,
                    error: "No active agent run found",
                };
            }
            const html = await this.renderAgentRunWidget(agent, agentRun);
            //TODO: Create a unique identifer so we can make sure to only have one widget showing at the same time on the client but also in the
            // chatLog history that we only have the latest html and json so not to confuse the model
            const subscription = await this.assistant.getCurrentSubscription();
            return {
                success: true,
                html,
                uniqueToken: "agentRunWidget",
                data: {
                    agent,
                    run,
                    subscription,
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
    get createNewAgentRunReadyToRunFirstWorkflowStep() {
        return {
            name: "create_new_agent_run_ready_to_run_first_workflow_step",
            description: "Create a new agent run ready to run the first workflow step. Get a confirmation from the user and set the hasVerballyConfirmedTheRun property to true after the user confirms",
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
            handler: this.createNewAgentRunReadyToRunFirstWorkflowStepHandler.bind(this),
        };
    }
    async createNewAgentRunReadyToRunFirstWorkflowStepHandler(params) {
        params = this.assistant.getCleanedParams(params);
        if (!params.hasVerballyConfirmedTheRun) {
            return {
                success: false,
                error: "User did not verbally confirm starting the new run",
            };
        }
        if (!this.assistant.memory.currentAgentStatus?.subscriptionId) {
            return {
                success: false,
                error: "No subscription found",
            };
        }
        try {
            const { agentRun, subscription } = await this.assistant.subscriptionManager.startAgentRun(this.assistant.memory.currentAgentStatus.subscriptionId, this.assistant.wsClients, this.assistant.wsClientId, 
            //TODO: Fix this type casting
            this.assistant.memory.currentUser);
            await this.updateAgentProductRun(agentRun);
            const html = await this.renderAgentRunWidget(subscription.AgentProduct, agentRun);
            const message = "You've created new agent run ready to run the first workflow step, out of many. It will not start automatically, the user needs to start it verbally.";
            this.assistant.emit("update-ai-model-session", message);
            return {
                success: true,
                html,
                uniqueToken: "agentRunWidget",
                data: {
                    message,
                    agentRun,
                    subscription,
                },
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
    async startCurrentRunAgentNextWorkflowStep() {
        const nextWorkflowStep = await this.agentModels.getNextWorkflowStep();
        if (!nextWorkflowStep) {
            throw new Error("No next workflow step found");
        }
        return {
            name: `start_next_workflow_step_for_${this.agentModels.convertToUnderscoresWithMaxLength(nextWorkflowStep.name)}`,
            description: `Start the next workflow step for this current agent run. ${nextWorkflowStep.description}`,
            type: "function",
            parameters: {
                type: "object",
                properties: {
                    userHasVerballyConfirmedStartOfNextWorkflowStepWithTheAgentName: {
                        type: "boolean",
                    },
                },
                required: [
                    "userHasVerballyConfirmedStartOfNextWorkflowStepWithTheAgentName",
                ],
            },
            handler: this.startCurrentRunAgentNextWorkflowStepHandler.bind(this),
        };
    }
    async startCurrentRunAgentNextWorkflowStepHandler(params) {
        params = this.assistant.getCleanedParams(params);
        if (!params.userHasVerballyConfirmedStartOfNextWorkflowStepWithTheAgentName) {
            return {
                success: false,
                error: "User did not confirm starting the next workflow step with the agent name",
            };
        }
        const agentRun = await this.assistant.getCurrentAgentRun();
        if (!agentRun) {
            return {
                success: false,
                error: "No active agent run found",
            };
        }
        try {
            const structuredAnswersOverrides = [];
            const subscription = await this.assistant.getCurrentSubscription();
            const subscriptionPlan = await this.assistant.getCurrentSubscriptionPlan();
            if (!subscriptionPlan) {
                throw new Error("No subscription plan found");
            }
            if (subscription &&
                subscription.configuration?.requiredQuestionsAnswered) {
                structuredAnswersOverrides.push(...subscription.configuration.requiredQuestionsAnswered);
            }
            if (subscriptionPlan &&
                subscriptionPlan.AgentProduct?.configuration.structuredAnswersOverride) {
                structuredAnswersOverrides.push(...subscriptionPlan.AgentProduct.configuration
                    .structuredAnswersOverride);
            }
            const result = await this.agentModels.startCurrentWorkflowStep(agentRun.id, structuredAnswersOverrides);
            await this.updateAgentProductRun(result.agentRun);
            const html = await this.renderAgentRunWidget(subscriptionPlan.AgentProduct, result.agentRun);
            this.assistant.emit("update-ai-model-session", "You have started the next workflow step for the current agent run, let the user know you will email them a notification when the task is completed or if a problem occurs.");
            setTimeout(() => {
                /*this.assistant.triggerResponseIfNeeded(
                  "Offer the user to deactivate yourself as long running agents are in progress."
                );*/
            }, 25000);
            return {
                success: true,
                html,
                uniqueToken: "agentRunWidget",
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
            name: "stop_current_agent_workflow_step",
            description: "Stop the currently running agent workflow step",
            type: "function",
            parameters: {
                type: "object",
                properties: {
                    userHasVerballyConfirmedStopCurrentWorkflowStepWithTheAgentName: {
                        type: "boolean",
                    },
                },
                required: [
                    "userHasVerballyConfirmedStopCurrentWorkflowStepWithTheAgentName",
                ],
            },
            handler: this.stopCurrentAgentWorkflowHandler.bind(this),
        };
    }
    async stopCurrentAgentWorkflowHandler(params) {
        params = this.assistant.getCleanedParams(params);
        if (!params.userHasVerballyConfirmedStopCurrentWorkflowStepWithTheAgentName) {
            return {
                success: false,
                error: "User did not confirm stopping the current workflow step with the agent name",
            };
        }
        try {
            const result = await this.agentModels.stopCurrentWorkflowStep();
            const html = await this.renderAgentRunWidget(result.agent, result.run);
            await this.updateAgentProductRun(result.run);
            this.assistant.emit("update-ai-model-session", "We have stopped the current workflow step for the current agent run");
            return {
                success: true,
                html,
                uniqueToken: "agentRunWidget",
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
    get deactivateAgent() {
        return {
            name: "deactivate_yourself_until_later",
            description: "Deactivate yourself after long running task has started, then you will be reactivated automatically when the task is completed or if a problem occurs",
            type: "function",
            parameters: {
                type: "object",
                properties: {},
            },
            handler: this.deactivateAgentHandler.bind(this),
        };
    }
    async deactivateAgentHandler(params) {
        try {
            //await this.agentModels.deactivateAgent();
            return {
                success: true,
                data: { message: "Deactivated the current agent" },
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to deactivate agent";
            console.error(errorMessage);
            return {
                success: false,
                error: errorMessage,
            };
        }
    }
    get showConfigurationWidget() {
        return {
            name: "show_configuration_widget_if_needed_or_user_asks_to_show_it",
            description: "Show the configuration widget for the current agent. The user needs to fill out the configuration before running the agent workflow to make sure to offer it to the user.",
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
            const agent = await this.assistant.getCurrentAgentProduct();
            const subscription = await this.assistant.getCurrentSubscription();
            const subscriptionPlan = await this.assistant.getCurrentSubscriptionPlan();
            if (!agent || !subscription || !subscriptionPlan) {
                throw new Error("No agent, subscription or subscription plan found");
            }
            const html = `<yp-agent-configuration-widget
        domainId="${this.assistant.domainId}"
        agentProductId="${agent.id}"
        agentName="${agent.name}"
        subscriptionId="${subscription.id}"
        agentImageUrl="${agent.configuration.avatar?.imageUrl}"
        requiredQuestions='${JSON.stringify(subscriptionPlan.configuration.requiredStructuredQuestions)}'
        requiredQuestionsAnswered='${JSON.stringify(subscription?.configuration?.requiredQuestionsAnswered ?? [])}'
      ></yp-agent-configuration-widget>`;
            await this.updateShownConfigurationWidget();
            this.assistant.emit("update-ai-model-session", "You've shown the configuration widget to the user");
            return {
                success: true,
                html,
                uniqueToken: "agentConfigurationWidget",
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
            description: "Submit the configuration for the current agent by clicking the submit button for the user",
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
                data: {
                    message: "Submitted configuration for the current agent successfully now offer the user to start the agent workflow run",
                },
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
    getSimpleWorkflow(workflow) {
        const workflowCopy = JSON.parse(JSON.stringify(workflow));
        if (workflowCopy.steps) {
            workflowCopy.steps.forEach((step) => {
                step.emailInstructions = "";
            });
        }
        return workflowCopy;
    }
    async renderAgentRunWidget(agent, run) {
        const subscription = await this.assistant.getCurrentSubscription();
        const workflowCopy = this.getSimpleWorkflow(run.workflow);
        const workflowBase64 = btoa(JSON.stringify(workflowCopy));
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
