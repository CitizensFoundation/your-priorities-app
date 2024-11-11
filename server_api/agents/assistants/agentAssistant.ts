// YpAgentAssistant.ts

import { YpBaseAssistantWithVoice } from "./baseAssistantWithVoice.js";
import { AgentSelectionMode } from "./modes/agentSelectionMode.js";
import { PsAgent } from "@policysynth/agents/dbModels/agent.js";
import WebSocket from "ws";
import ioredis from "ioredis";
import { DirectConversationMode } from "./modes/agentDirectConnection.js";

export class YpAgentAssistant extends YpBaseAssistantWithVoice {
  public availableAgents: PsAgent[] = [];
  public runningAgents: PsAgent[] = [];

  public userId: number;
  private agentSelectionMode: AgentSelectionMode;
  private directConversationMode: DirectConversationMode;

  constructor(
    wsClientId: string,
    wsClients: Map<string, WebSocket>,
    redis: ioredis.Redis,
    voiceEnabled: boolean,
    currentMode: YpAssistantMode,
    domainId: number,
    memoryId: string,
    userId: number
  ) {
    super(
      wsClientId,
      wsClients,
      redis,
      voiceEnabled,
      currentMode,
      domainId,
      memoryId
    );
    this.userId = userId;
    this.agentSelectionMode = new AgentSelectionMode(this);
    this.directConversationMode = new DirectConversationMode(this);
    this.on("memory-changed", this.handleMemoryChanged.bind(this));
  }

  defineAvailableModes(): AssistantChatbotMode[] {
    return [
      this.agentSelectionMode.getMode(),
      this.directConversationMode.getMode(),
    ];
  }

  get simplifiedMemory(): Partial<YpBaseAssistantMemoryData> {
    return {
      currentMode: this.memory.currentMode,
      currentUser: this.memory.currentUser,
      haveShownConfigurationWidget: this.memory.haveShownConfigurationWidget,
      haveShownLoginWidget: this.memory.haveShownLoginWidget,
      currentAgentStatus: this.memory.currentAgentStatus,
    } as Partial<YpBaseAssistantMemoryData>;
  }

  handleMemoryChanged(memory: YpBaseAssistantMemoryData) {
    console.log(`memory changed: ${JSON.stringify(memory, null, 2)}`);
    this.sendToClient(
      "system",
      JSON.stringify(this.simplifiedMemory),
      "memory-changed"
    );
  }

  get isLoggedIn(): boolean {
    return this.memory.currentUser !== undefined;
  }

  get currentAgent(): YpAgentProductAttributes | undefined {
    return this.memory.currentAgentStatus?.agentProduct;
  }

  get isSubscribedToCurrentAgent(): boolean {
    return this.memory.currentAgentStatus?.subscription !== undefined;
  }

  get hasConfiguredCurrentAgent(): boolean {
    return this.memory.currentAgentStatus?.configurationState === "configured";
  }

  get isCurrentAgentRunning(): boolean {
    return (
      this.memory.currentAgentStatus?.agentRun?.status === "running"
    );
  }

  get haveShownConfigurationWidget(): boolean {
    return this.memory.haveShownConfigurationWidget ?? false;
  }

  get haveShownLoginWidget(): boolean {
    return this.memory.haveShownLoginWidget ?? false;
  }

  get currentAgentWorkflow(): YpWorkflowConfiguration | undefined {
    return this.memory.currentAgentStatus?.agentRun?.workflow;
  }

  get currentAgentWorkflowCurrentStep(): YpWorkflowStep | undefined {
    return this.memory.currentAgentStatus?.agentRun?.workflow?.steps[
      this.memory.currentAgentStatus?.agentRun?.workflow?.currentStepIndex ?? 0
    ];
  }

  get isCurrentAgentWaitingOnUserInput(): boolean {
    const currentStep = this.currentAgentWorkflowCurrentStep;

    if (!currentStep) {
      return false;
    }

    return (
      currentStep.type === "engagmentFromInputConnector" ||
      currentStep.type === "engagmentFromOutputConnector"
    );
  }

  triggerResponseIfNeeded(message: string): void {
    if (this.voiceBot && this.voiceEnabled) {
      this.voiceBot.triggerResponse(message);
    }
  }

}
