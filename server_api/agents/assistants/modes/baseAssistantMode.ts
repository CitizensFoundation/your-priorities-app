// baseAssistantMode.ts

import { YpAgentAssistant } from "../agentAssistant.js";

export class BaseAssistantMode {
  protected assistant: YpAgentAssistant;

  constructor(assistant: YpAgentAssistant) {
    this.assistant = assistant;
  }

  protected get memory() {
    return this.assistant.memory;
  }

  renderSimplifiedWorkflowStep(step: YpWorkflowStep | undefined) {
    if (!step) {
      return "";
    }
    return `<${step.type}>${step.name}: ${step.description}</${step.type}>`;
  }

  renderSimplifiedWorkflow(workflow: YpWorkflowConfiguration) {
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

  protected renderCommon() {
    if (!this.memory.currentMode) {
      return "";
    }
    console.log(
      `renderCommon: currentConversationMode ${this.memory.currentMode}`
    );
    let modeInfo = `<currentConversationMode>${this.memory.currentMode}</currentConversationMode>\n`;
    if (this.assistant.currentAgent) {
      modeInfo += `<currentAgent>${this.assistant.currentAgent.name}</currentAgent>\n`;
    }
    if (this.assistant.isCurrentAgentActive) {
      modeInfo += `<currentAgentRunStatus>${this.renderSimplifiedAgentRun(
        this.assistant.memory.currentAgentStatus?.activeAgentRun
      )}</currentAgentRunStatus>\n`;
      modeInfo += `<currentWorkflowStep>${this.renderSimplifiedWorkflowStep(
        this.assistant.currentAgentWorkflow?.steps[
          this.assistant.currentAgentWorkflow?.currentStepIndex
        ]
      )}</currentWorkflowStep>\n`;
      if (
        this.assistant.currentAgentWorkflow?.currentStepIndex != undefined &&
        this.assistant.currentAgentWorkflow?.currentStepIndex + 1 <
          this.assistant.currentAgentWorkflow?.steps.length
      ) {
        modeInfo += `<nextWorkflowStep>${JSON.stringify(
          this.assistant.currentAgentWorkflow?.steps[
            this.assistant.currentAgentWorkflow?.currentStepIndex + 1
          ],
          null,
          2
        )}</nextWorkflowStep>`;
      } else {
        modeInfo += `<nextWorkflowStep>none</nextWorkflowStep>\n`;
      }
    }

    console.log(`modeInfo: ${modeInfo}`);
  }
}
