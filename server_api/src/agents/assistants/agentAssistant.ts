// YpAgentAssistant.ts

import { YpBaseAssistantWithVoice } from "./baseAssistantWithVoice.js";
import { AgentSelectionMode } from "./modes/agentSelectionMode.js";
import { PsAgent } from "@policysynth/agents/dbModels/agent.js";
import WebSocket from "ws";
import ioredis from "ioredis";
import { DirectConversationMode } from "./modes/agentDirectConnection.js";
import { SubscriptionManager } from "../managers/subscriptionManager.js";
import { YpSubscriptionPlan } from "../models/subscriptionPlan.js";
import { YpAgentProductRun } from "../models/agentProductRun.js";
import { YpSubscription } from "../models/subscription.js";
import { YpAgentProduct } from "../models/agentProduct.js";

export class YpAgentAssistant extends YpBaseAssistantWithVoice {
  public availableAgents: PsAgent[] = [];
  public runningAgents: PsAgent[] = [];

  private agentSelectionMode: AgentSelectionMode;
  private directConversationMode: DirectConversationMode;

  public subscriptionManager: SubscriptionManager;

  constructor(
    wsClientId: string,
    wsClients: Map<string, WebSocket>,
    redis: ioredis.Redis,
    voiceEnabled: boolean,
    redisKey: string,
    domainId: number
  ) {
    super(wsClientId, wsClients, redis, voiceEnabled, redisKey, domainId);
    this.agentSelectionMode = new AgentSelectionMode(this);
    this.directConversationMode = new DirectConversationMode(this);
    this.subscriptionManager = new SubscriptionManager();
    this.on("memory-changed", this.handleMemoryChanged.bind(this));
  }

  async defineAvailableModes(): Promise<AssistantChatbotMode[]> {
    return [
      await this.agentSelectionMode.getMode(),
      await this.directConversationMode.getMode(),
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
    if (this.DEBUG) {
      console.log(
        `Sending memory changed to client: ${JSON.stringify(
          this.simplifiedMemory,
          null,
          2
        )}`
      );
    }
    this.sendToClient(
      "system",
      JSON.stringify(this.simplifiedMemory),
      "memory-changed"
    );
  }

  get isLoggedIn(): boolean {
    return this.memory.currentUser !== undefined;
  }

  get isSubscribedToCurrentAgentProduct(): boolean {
    if (this.DEBUG) {
      console.log(
        `-------------------------------------------> isSubscribedToCurrentAgent: ${JSON.stringify(
          this.memory.currentAgentStatus,
          null,
          2
        )}`
      );
    }
    return this.memory.currentAgentStatus?.subscriptionId != undefined;
  }

  get hasConfiguredcurrentAgentProduct(): boolean {
    console.log(`configuration: ${this.redisKey}: ${JSON.stringify(this.memory.currentAgentStatus, null, 2)}`);
    return this.memory.currentAgentStatus?.configurationState === "configured";
  }

  async isCurrentAgentRunning(): Promise<boolean> {
    const agentRun = await this.getCurrentAgentRun();
    return agentRun?.status === "running";
  }

  async isCurrentAgentActive(): Promise<boolean> {
    const agentRun = await this.getCurrentAgentRun();
    return (
      agentRun?.status === "running" ||
      agentRun?.status === "ready" ||
      agentRun?.status === "stopped" ||
      agentRun?.status === "waiting_on_user"
    );
  }

  get haveShownConfigurationWidget(): boolean {
    return this.memory.haveShownConfigurationWidget ?? false;
  }

  get haveShownLoginWidget(): boolean {
    return this.memory.haveShownLoginWidget ?? false;
  }

  async getCurrentAgentWorkflow(): Promise<
    YpAgentRunWorkflowConfiguration | undefined
  > {
    const agentRun = await this.getCurrentAgentRun();
    return agentRun?.workflow;
  }

  async getCurrentAgentWorkflowCurrentStep(): Promise<
    YpAgentRunWorkflowStep | undefined
  > {
    const agentRun = await this.getCurrentAgentRun();
    return agentRun?.workflow?.steps[agentRun?.workflow?.currentStepIndex ?? 0];
  }

  async isCurrentAgentWaitingOnUserInput(): Promise<boolean> {
    const currentStep = await this.getCurrentAgentWorkflowCurrentStep();

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
