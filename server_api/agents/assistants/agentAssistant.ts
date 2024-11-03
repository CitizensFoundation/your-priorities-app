// YpAgentAssistant.ts

import { YpBaseAssistantWithVoice } from './baseAssistantWithVoice.js';
import { AgentSelectionMode } from './modes/agentSelectionMode.js';
import { AgentConfigurationMode } from './modes/agentConfigurationMode.js';
import { AgentOperationsMode } from './modes/agentOperationsMode.js';
import { ChatbotMode } from './baseAssistant.js';
import { PsAgent } from '@policysynth/agents/dbModels/agent.js';
import WebSocket from 'ws';
import ioredis from "ioredis";

export class YpAgentAssistant extends YpBaseAssistantWithVoice {
  public currentAgentId?: number;
  public currentAgent?: PsAgent;
  public currentWorkflow?: any;
  public availableAgents: PsAgent[] = [];
  public runningAgents: PsAgent[] = [];

  private agentSelectionMode: AgentSelectionMode;
  private agentConfigurationMode: AgentConfigurationMode;
  private agentOperationsMode: AgentOperationsMode;

  constructor(
    wsClientId: string,
    wsClients: Map<string, WebSocket>,
    redis: ioredis.Redis,
    voiceEnabled: boolean,
    currentMode: YpAssistantMode,
    domainId: number,
    memoryId: string
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
    this.agentSelectionMode = new AgentSelectionMode(this);
    this.agentConfigurationMode = new AgentConfigurationMode(this);
    this.agentOperationsMode = new AgentOperationsMode(this);
  }

  defineAvailableModes(): ChatbotMode[] {
    return [
      this.agentSelectionMode.getMode(),
      this.agentConfigurationMode.getMode(),
      this.agentOperationsMode.getMode(),
    ];
  }

  // Other methods as needed
}
