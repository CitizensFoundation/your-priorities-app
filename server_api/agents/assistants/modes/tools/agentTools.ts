import { YpAgentAssistant } from "../../agentAssistant.js";
import { BaseAssistantTools } from "./baseTools.js";
import { AgentModels } from "./models/agents.js";

export class AgentTools extends BaseAssistantTools {
  agentModels: AgentModels;

  constructor(assistant: YpAgentAssistant) {
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
        properties: {} as YpAgentEmptyProperties,
      },
      handler: this.showAgentWorkflowOverviewWidgetHandler.bind(this),
    };
  }

  public async showAgentWorkflowOverviewWidgetHandler(
    params: YpAgentEmptyProperties
  ): Promise<ToolExecutionResult> {
    try {
      const { agent, run } =
        await this.agentModels.getCurrentAgentAndWorkflow();
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
    } catch (error) {
      const errorMessage =
        error instanceof Error
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
        properties: {} as YpAgentEmptyProperties,
      },
      handler: this.showAgentRunWidgetHandler.bind(this),
    };
  }

  public async showAgentRunWidgetHandler(
    params: YpAgentEmptyProperties
  ): Promise<ToolExecutionResult> {
    try {
      const { agent, run } =
        await this.agentModels.getCurrentAgentAndWorkflow();
      if (!this.assistant.memory.currentAgentStatus?.activeAgentRun) {
        return {
          success: false,
          error: "No active agent run found",
        };
      }

      const html = this.renderAgentRunWidget(
        agent,
        this.assistant.memory.currentAgentStatus.activeAgentRun
      );

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
    } catch (error) {
      const errorMessage =
        error instanceof Error
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
      description:
        "Create a new agent run ready to run the first workflow step. Get a confirmation from the user and set the hasVerballyConfirmedTheRun property to true after the user confirms",
      type: "function",
      parameters: {
        type: "object",
        properties: {
          hasVerballyConfirmedTheRun: {
            type: "boolean",
          },
        } as YpAgentRunStartProperties,
        required: [
          "hasVerballyConfirmedTheRun",
        ] as const satisfies readonly (keyof YpAgentRunStartParams)[],
      },
      handler:
        this.createNewAgentRunReadyToRunFirstWorkflowStepHandler.bind(this),
    };
  }

  public async createNewAgentRunReadyToRunFirstWorkflowStepHandler(
    params: YpAgentRunStartParams
  ): Promise<ToolExecutionResult> {
    params = this.assistant.getCleanedParams(params) as YpAgentRunStartParams;

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
      const { agentRun, subscription } =
        await this.assistant.subscriptionManager.startAgentRun(
          this.assistant.memory.currentAgentStatus.subscription.id,
          this.assistant.wsClients,
          this.assistant.wsClientId
        );

      await this.updateAgentProductRun(agentRun);

      const html = this.renderAgentRunWidget(
        subscription.AgentProduct,
        agentRun
      );

      this.assistant.emit(
        "update-ai-model-session",
        "Created new agent run ready to run the first workflow step. It will not start automatically, the user needs to start it verbally"
      );

      return {
        success: true,
        html,
        data: {
          message:
            "Created new agent run ready to run the first workflow step. It will not start automatically, the user needs to start it verbally",
          agentRun,
          subscription,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to start run";
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
        } as YpAgentRunStartNextWorkflowStepProperties,
        required: [
          "useHasVerballyConfirmedStartOfNextWorkflowStepWithTheAgentName",
        ] as const satisfies readonly (keyof YpAgentRunStartNextWorkflowStepParams)[],
      },
      handler: this.startCurrentRunAgentNextWorkflowStepHandler.bind(this),
    };
  }

  public async startCurrentRunAgentNextWorkflowStepHandler(
    params: YpAgentRunStartNextWorkflowStepParams
  ): Promise<ToolExecutionResult> {
    params = this.assistant.getCleanedParams(
      params
    ) as YpAgentRunStartNextWorkflowStepParams;

    if (
      !params.useHasVerballyConfirmedStartOfNextWorkflowStepWithTheAgentName
    ) {
      return {
        success: false,
        error:
          "User did not confirm starting the next workflow step with the agent name",
      };
    }

    try {
      const result = await this.agentModels.startAgentWorkflow();

      await this.updateAgentProductRun(result.run);

      const html = this.renderAgentRunWidget(result.agent, result.run);

      this.assistant.emit(
        "update-ai-model-session",
        "Started the next workflow step for the current agent run"
      );

      return {
        success: true,
        html,
        data: result,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to start workflow";
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
        } as YpAgentRunStopCurrentWorkflowStepProperties,
        required: [
          "useHasVerballyConfirmedStopCurrentWorkflowStepWithTheAgentName",
        ] as const satisfies readonly (keyof YpAgentRunStopCurrentWorkflowStepParams)[],
      },
      handler: this.stopCurrentAgentWorkflowHandler.bind(this),
    };
  }

  public async stopCurrentAgentWorkflowHandler(
    params: YpAgentRunStopCurrentWorkflowStepParams
  ): Promise<ToolExecutionResult> {
    params = this.assistant.getCleanedParams(
      params
    ) as YpAgentRunStopCurrentWorkflowStepParams;

    if (
      !params.useHasVerballyConfirmedStopCurrentWorkflowStepWithTheAgentName
    ) {
      return {
        success: false,
        error:
          "User did not confirm stopping the current workflow step with the agent name",
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
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to stop workflow";
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
      description:
        "Show the configuration widget for the current agent, this is needed before running the agent workflow",
      type: "function",
      parameters: {
        type: "object",
        properties: {} as YpAgentEmptyProperties,
      },
      handler: this.showConfigurationWidgetHandler.bind(this),
    };
  }

  public async showConfigurationWidgetHandler(
    params: YpAgentEmptyProperties
  ): Promise<ToolExecutionResult> {
    try {
      const agent = await this.agentModels.getCurrentAgent();
      const subscription = await this.agentModels.getCurrentSubscription();
      const html = `<yp-agent-configuration-widget
        domainId="${this.assistant.domainId}"
        agentProductId="${agent.id}"
        agentName="${agent.name}"
        subscriptionId="${subscription.id}"
        agentImageUrl="${agent.configuration.avatar?.imageUrl}"
        requiredQuestions='${JSON.stringify(
          subscription?.Plan?.configuration.requiredStructuredQuestions
        )}'
        requiredQuestionsAnswered='${JSON.stringify(
          subscription?.configuration?.requiredQuestionsAnswered ?? []
        )}'
      ></yp-agent-configuration-widget>`;

      await this.updateShownConfigurationWidget();

      this.assistant.emit(
        "update-ai-model-session",
        "You've shown the configuration widget to the user"
      );

      return {
        success: true,
        html,
        data: {
          agent,
          subscription,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
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
      description:
        "Sends an event to the webapp to click on the submit button for the user for the configuration of the current agent, this will submit the configuration to the agent",
      type: "function",
      parameters: {
        type: "object",
        properties: {} as YpAgentEmptyProperties,
      },
      handler: this.submitConfigurationHandler.bind(this),
    };
  }

  public async submitConfigurationHandler(
    params: YpAgentEmptyProperties
  ): Promise<ToolExecutionResult> {
    try {
      const clientEvent: ToolClientEventUiClick = {
        name: "ui_click",
        details: "submit-agent-configuration",
      };

      return {
        success: true,
        clientEvents: [clientEvent],
        data: { message: "Web app asked to submit configuration" },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to submit configuration";
      console.error(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  private renderAgentRunWidget(
    agent: YpAgentProductAttributes,
    run: YpAgentProductRunAttributes
  ) {
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
