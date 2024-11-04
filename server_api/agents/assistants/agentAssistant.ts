// YpAgentAssistant.ts

import { YpBaseAssistantWithVoice } from './baseAssistantWithVoice.js';
import { AgentSelectionMode } from './modes/agentSelectionMode.js';
import { AgentConfigurationMode } from './modes/agentConfigurationMode.js';
import { AgentOperationsMode } from './modes/agentOperationsMode.js';
import { ChatbotMode } from './baseAssistant.js';
import { PsAgent } from '@policysynth/agents/dbModels/agent.js';
import WebSocket from 'ws';
import ioredis from "ioredis";
import { DirectConversationMode } from './modes/directConversationMode.js';

export class YpAgentAssistant extends YpBaseAssistantWithVoice {
  public currentAgentId?: number;
  public currentAgent?: PsAgent;
  public currentWorkflow?: any;
  public availableAgents: PsAgent[] = [];
  public runningAgents: PsAgent[] = [];

  public userId: number;
  private agentSelectionMode: AgentSelectionMode;
  private agentConfigurationMode: AgentConfigurationMode;
  private agentOperationsMode: AgentOperationsMode;
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
      memoryId,
    );
    this.userId = userId;
    this.agentSelectionMode = new AgentSelectionMode(this);
    this.agentConfigurationMode = new AgentConfigurationMode(this);
    this.agentOperationsMode = new AgentOperationsMode(this);
    this.directConversationMode = new DirectConversationMode(this);
  }

  defineAvailableModes(): ChatbotMode[] {
    return [
      this.agentSelectionMode.getMode(),
      this.agentConfigurationMode.getMode(),
      this.agentOperationsMode.getMode(),
      this.directConversationMode.getMode(),
    ];
  }

  triggerResponseIfNeeded(message: string): void {
    if (this.voiceBot && this.voiceEnabled) {
      this.voiceBot.triggerResponse(message);
    }
  }

  // Other methods as needed
}
