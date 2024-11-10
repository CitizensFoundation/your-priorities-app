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

  protected renderCommon() {
    if (!this.memory.currentMode) {
      return "";
    }
    console.log(
      `renderCommon: currentConversationMode ${this.memory.currentMode}`
    );
    return `<currentConversationMode>${this.memory.currentMode}</currentConversationMode>`;
  }

}
