// baseAssistantMode.ts
import log from "../../../utils/loggerTs.js";
import { YpAgentAssistant } from "../agentAssistant.js";

export class BaseAssistantMode {
  protected assistant: YpAgentAssistant;

  constructor(assistant: YpAgentAssistant) {
    this.assistant = assistant;
  }

  protected get memory() {
    return this.assistant.memory;
  }

  renderSimplifiedWorkflowStep(step: YpAgentRunWorkflowStep | undefined) {
    if (!step) {
      return "";
    }
    return `<${step.type}>${step.name}: ${step.description}</${step.type}>`;
  }

  renderSimplifiedWorkflow(workflow: YpAgentRunWorkflowConfiguration) {
    let workflowInfo = "";
    for (let step of workflow.steps) {
      workflowInfo += this.renderSimplifiedWorkflowStep(step);
    }
    workflowInfo += `<currentStepIndex>${workflow.currentStepIndex}</currentStepIndex>`;
    return workflowInfo;
  }

  renderSimplifiedAgentRun(agentRun: YpAgentProductRunAttributes | undefined) {
    if (!agentRun) {
      return "";
    }
    return `Status: ${agentRun.status}, Started: ${agentRun.start_time}, Workflow: ${this.renderSimplifiedWorkflow(agentRun.workflow)}`;
  }

  async renderCommon() {
    if (!this.memory.currentMode) {
      return "";
    }
    log.info(
      `renderCommon: currentConversationMode ${this.memory.currentMode}`
    );
    let modeInfo = `<currentConversationMode>${this.memory.currentMode}</currentConversationMode>\n`;
    const currentAgentProduct = await this.assistant.getCurrentAgentProduct();

    const currentAgentWorkflow = await this.assistant.getCurrentAgentWorkflow();

    if (currentAgentProduct) {
      modeInfo += `<currentAgent>${currentAgentProduct.name}</currentAgent>\n`;
    }
    if (await this.assistant.isCurrentAgentActive()) {
      modeInfo += `<currentAgentRunStatus>${this.renderSimplifiedAgentRun(
        await this.assistant.getCurrentAgentRun()
      )}</currentAgentRunStatus>\n`;
      modeInfo += `<currentWorkflowStep>${this.renderSimplifiedWorkflowStep(
        currentAgentWorkflow?.steps[
          currentAgentWorkflow?.currentStepIndex
        ]
      )}</currentWorkflowStep>\n`;
      if (
        currentAgentWorkflow?.currentStepIndex != undefined &&
        currentAgentWorkflow?.currentStepIndex + 1 <
          currentAgentWorkflow?.steps.length
      ) {
        modeInfo += `<nextWorkflowStep>${JSON.stringify(
          currentAgentWorkflow?.steps[
            currentAgentWorkflow?.currentStepIndex + 1
          ],
          null,
          2
        )}</nextWorkflowStep>`;
      } else {
        modeInfo += `<nextWorkflowStep>none</nextWorkflowStep>\n`;
      }
    }

    log.info(`modeInfo: ${modeInfo}`);
  }
}
