import { YpAgentAssistant } from "agents/assistants/agentAssistant.js";

export class BaseAssistantTools {
  protected assistant: YpAgentAssistant;

  constructor(assistant: YpAgentAssistant) {
    this.assistant = assistant;
  }

  //TODO: Look into this but it's here as we want the tool execution to finish before we update the memory
  async waitTick() {
    await new Promise((resolve) => setTimeout(resolve, 1));
  }

  async updateCurrentAgentProduct(
    agentProduct: YpAgentProductAttributes,
    subscription: YpSubscriptionAttributes | null,
    options: { sendEvent: boolean } = { sendEvent: true }
  ) {
    const requiredStructuredQuestions = subscription?.Plan?.configuration.requiredStructuredQuestions;
    const requiredStructuredAnswers = subscription?.configuration?.requiredQuestionsAnswered;
    this.assistant.memory.currentAgentStatus = {
      agentProduct: agentProduct,
      subscription: subscription,
      subscriptionState: subscription ? "subscribed" : "unsubscribed",
      configurationState:
        (requiredStructuredAnswers && requiredStructuredQuestions) &&
        requiredStructuredAnswers.length ==
          requiredStructuredQuestions.length
          ? "configured"
          : "not_configured",
    };

    await this.assistant.saveMemory();

    await this.waitTick();

    // Emit memory update event
    if (options.sendEvent) {
      this.assistant.emit("memory-changed", this.assistant.memory);
    }
    //TODO: Do we need this?
    //this.assistant.emit("update-ai-model-session", "Updated agent product");
  }

  async updateAgentProductRun(
    agentRun: YpAgentProductRunAttributes,
    options: { sendEvent: boolean } = { sendEvent: true }
  ) {
    if (!this.assistant.memory.currentAgentStatus) {
      throw new Error("No current agent status found");
    }

    this.assistant.memory.currentAgentStatus.agentRun = agentRun;
    await this.assistant.saveMemory();

    await this.waitTick();

    if (options.sendEvent) {
      this.assistant.emit("memory-changed", this.assistant.memory);
    }

    this.assistant.emit("update-ai-model-session", "Updated agent product run");
  }

  async updateShownConfigurationWidget(
    options: { sendEvent: boolean } = { sendEvent: true }
  ) {
    this.assistant.memory.haveShownConfigurationWidget = true;
    await this.assistant.saveMemory();

    await this.waitTick();

    if (options.sendEvent) {
      this.assistant.emit("memory-changed", this.assistant.memory);
    }

    this.assistant.emit(
      "update-ai-model-session",
      "Shown configuration widget"
    );
  }

  async updateHaveShownLoginWidget(
    options: { sendEvent: boolean } = { sendEvent: true }
  ) {
    this.assistant.memory.haveShownLoginWidget = true;
    await this.assistant.saveMemory();

    await this.waitTick();

    if (options.sendEvent) {
      this.assistant.emit("memory-changed", this.assistant.memory);
    }

    this.assistant.emit("update-ai-model-session", "Shown login widget");
  }

  async clearCurrentAgentProduct(
    options: { sendEvent: boolean } = { sendEvent: true }
  ) {
    this.assistant.memory.currentAgentStatus = undefined;
    await this.assistant.saveMemory();

    await this.waitTick();

    if (options.sendEvent) {
      this.assistant.emit("memory-changed", this.assistant.memory);
    }

    this.assistant.emit(
      "update-ai-model-session",
      "Cleared current agent product"
    );
  }
}
