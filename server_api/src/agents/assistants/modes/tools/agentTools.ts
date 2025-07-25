import e from "express";
import { YpAgentAssistant } from "../../agentAssistant.js";
import { BaseAssistantTools } from "./baseTools.js";
import { AgentModels } from "./models/agents.js";

import log from "../../../../utils/loggerTs.js";

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

      log.info("--------------------> agent", agent);

      const workflowJson = JSON.stringify(
        this.getSimpleWorkflow(agent.configuration.workflow)
      );

      const base64Workflow = btoa(workflowJson);

      const html = `<yp-agent-workflow-widget
        agentProductId="${agent.id}"
        runId="${run?.id}"
        agentName="${agent.name}"
        agentDescription="${agent.description}"
        workflow="${base64Workflow}"
        workflowStatus="${run?.status || "not_started"}"
      ></yp-agent-workflow-widget>`;

      let message;
      if (!this.assistant.isSubscribedToCurrentAgentProduct) {
        if (this.assistant.isLoggedIn) {
          message =
            "Inform the user that the next step is to subscribe to the agent plan to start the workflow. Offer the user to explain the workflow to them first.";
        } else {
          message =
            "Inform the user that the next step is to login, then subscribe to the agent plan to start the workflow. You can also offer the user to explain the workflow to them first.";
        }
      } else {
        message =
          "Inform the user that the next step is to start the workflow. You can also ffer the user to explain the workflow to them first.";
      }

      this.assistant.emit("update-ai-model-session", message);

      return {
        success: true,
        html,
        data: { message, agent, run, workflowJson },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to show workflow widget";
      log.error(errorMessage);
      log.error("--------------------_> ", error);
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
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to show agent run widget";
      log.error(errorMessage);
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

    if (!this.assistant.memory.currentAgentStatus?.subscriptionId) {
      return {
        success: false,
        error: "No subscription found",
      };
    }

    try {
      const { agentRun, subscription } =
        await this.assistant.subscriptionManager.startAgentRun(
          this.assistant.memory.currentAgentStatus.subscriptionId,
          this.assistant.wsClients,
          this.assistant.wsClientId,
          //TODO: Fix this type casting
          this.assistant.memory.currentUser as unknown as UserClass
        );

      await this.updateAgentProductRun(agentRun);

      const html = await this.renderAgentRunWidget(
        subscription.AgentProduct,
        agentRun
      );

      const message =
        "You've created new agent run ready to run the first workflow step, out of many. It will not start automatically, the user needs to start it verbally.";

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
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to start run";
      log.error(errorMessage);
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
      name: `start_next_workflow_step_for_${this.agentModels.convertToUnderscoresWithMaxLength(
        nextWorkflowStep.name
      )}`,
      description: `Start the next workflow step for this current agent run. ${nextWorkflowStep.description}`,
      type: "function",
      parameters: {
        type: "object",
        properties: {
          userHasVerballyConfirmedStartOfNextWorkflowStepWithTheAgentName: {
            type: "boolean",
          },
        } as YpAgentRunStartNextWorkflowStepProperties,
        required: [
          "userHasVerballyConfirmedStartOfNextWorkflowStepWithTheAgentName",
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
      !params.userHasVerballyConfirmedStartOfNextWorkflowStepWithTheAgentName
    ) {
      return {
        success: false,
        error:
          "User did not confirm starting the next workflow step with the agent name",
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
      const structuredAnswersOverrides: YpStructuredAnswer[] = [];

      const subscription = await this.assistant.getCurrentSubscription();

      const subscriptionPlan =
        await this.assistant.getCurrentSubscriptionPlan();

      if (!subscriptionPlan) {
        throw new Error("No subscription plan found");
      }

      if (
        subscription &&
        subscription.configuration?.requiredQuestionsAnswered
      ) {
        structuredAnswersOverrides.push(
          ...subscription.configuration!.requiredQuestionsAnswered!
        );
      }

      if (
        subscriptionPlan &&
        subscriptionPlan.AgentProduct?.configuration.structuredAnswersOverride
      ) {
        structuredAnswersOverrides.push(
          ...subscriptionPlan.AgentProduct!.configuration
            .structuredAnswersOverride!
        );
      }

      const result = await this.agentModels.startCurrentWorkflowStep(
        agentRun.id,
        structuredAnswersOverrides
      );

      await this.updateAgentProductRun(result.agentRun);

      const html = await this.renderAgentRunWidget(
        subscriptionPlan.AgentProduct!,
        result.agentRun
      );

      this.assistant.emit(
        "update-ai-model-session",
        "You have started the next workflow step for the current agent run, let the user know you will email them a notification when the task is completed or if a problem occurs."
      );

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
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to start workflow";
      log.error(errorMessage);
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
        } as YpAgentRunStopCurrentWorkflowStepProperties,
        required: [
          "userHasVerballyConfirmedStopCurrentWorkflowStepWithTheAgentName",
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
      !params.userHasVerballyConfirmedStopCurrentWorkflowStepWithTheAgentName
    ) {
      return {
        success: false,
        error:
          "User did not confirm stopping the current workflow step with the agent name",
      };
    }

    try {
      const result = await this.agentModels.stopCurrentWorkflowStep();

      const html = await this.renderAgentRunWidget(result.agent, result.run);

      await this.updateAgentProductRun(result.run);

      this.assistant.emit(
        "update-ai-model-session",
        "We have stopped the current workflow step for the current agent run"
      );

      return {
        success: true,
        html,
        uniqueToken: "agentRunWidget",
        data: result,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to stop workflow";
      log.error(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  get deactivateAgent() {
    return {
      name: "deactivate_yourself_until_later",
      description:
        "Deactivate yourself after long running task has started, then you will be reactivated automatically when the task is completed or if a problem occurs",
      type: "function",
      parameters: {
        type: "object",
        properties: {} as YpAgentEmptyProperties,
      },
      handler: this.deactivateAgentHandler.bind(this),
    };
  }

  public async deactivateAgentHandler(
    params: YpAgentEmptyProperties
  ): Promise<ToolExecutionResult> {
    try {
      //await this.agentModels.deactivateAgent();
      return {
        success: true,
        data: { message: "Deactivated the current agent" },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to deactivate agent";
      log.error(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  get showConfigurationWidget() {
    return {
      name: "show_configuration_widget_if_needed_or_user_asks_to_show_it",
      description:
        "Show the configuration widget for the current agent. The user needs to fill out the configuration before running the agent workflow to make sure to offer it to the user. \
        The user can not provide you with the configuration verbally or through chat, the user must provide the configuration through the configuration widget.",
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
      const agent = await this.assistant.getCurrentAgentProduct();
      const subscription = await this.assistant.getCurrentSubscription();
      const subscriptionPlan =
        await this.assistant.getCurrentSubscriptionPlan();

      if (!agent || !subscription || !subscriptionPlan) {
        throw new Error("No agent, subscription or subscription plan found");
      }

      const html = `<yp-agent-configuration-widget
        domainId="${this.assistant.domainId}"
        agentProductId="${agent.id}"
        agentName="${agent.name}"
        subscriptionId="${subscription.id}"
        agentImageUrl="${agent.configuration.avatar?.imageUrl}"
        requiredQuestions='${JSON.stringify(
          subscriptionPlan.configuration.requiredStructuredQuestions
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
        uniqueToken: "agentConfigurationWidget",
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
      log.error(errorMessage);
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
        "Submit the configuration for the current agent by clicking the submit button for the user. The only way for the user to provide the configuration is through the configuration widget.",
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
        data: {
          message:
            "Submitted configuration for the current agent successfully now offer the user to start the agent workflow run",
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to submit configuration";
      log.error(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  getSimpleWorkflow(workflow: YpAgentRunWorkflowConfiguration) {
    const workflowCopy = JSON.parse(
      JSON.stringify(workflow)
    ) as YpAgentRunWorkflowConfiguration;
    if (workflowCopy.steps) {
      workflowCopy.steps.forEach((step: YpAgentRunWorkflowStep) => {
        step.emailInstructions = "";
      });
    }
    return workflowCopy;
  }

  private async renderAgentRunWidget(
    agent: YpAgentProductAttributes,
    run: YpAgentProductRunAttributes
  ) {
    const subscription = await this.assistant.getCurrentSubscription();
    const workflowCopy = this.getSimpleWorkflow(
      run.workflow
    ) as YpAgentRunWorkflowConfiguration;

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
