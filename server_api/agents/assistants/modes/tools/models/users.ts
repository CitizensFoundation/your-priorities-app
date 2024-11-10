import { YpAgentAssistant } from "agents/assistants/agentAssistant.js";

export class UserModels {
  assistant: YpAgentAssistant;

  constructor(assistant: YpAgentAssistant) {
    this.assistant = assistant;
  }

  public async loginUser(): Promise<void> {
    //TODO: implement actual login logic
  }

  public async logoutUser(): Promise<void> {
    //TODO: implement actual logout logic
  }
}
