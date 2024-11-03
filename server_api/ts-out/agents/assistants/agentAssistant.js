// YpAgentAssistant.ts
import { YpBaseAssistantWithVoice } from './baseAssistantWithVoice.js';
import { AgentSelectionMode } from './modes/agentSelectionMode.js';
import { AgentConfigurationMode } from './modes/agentConfigurationMode.js';
import { AgentOperationsMode } from './modes/agentOperationsMode.js';
export class YpAgentAssistant extends YpBaseAssistantWithVoice {
    constructor(wsClientId, wsClients, redis, voiceEnabled, currentMode, domainId, memoryId) {
        super(wsClientId, wsClients, redis, voiceEnabled, currentMode, domainId, memoryId);
        this.availableAgents = [];
        this.runningAgents = [];
        this.agentSelectionMode = new AgentSelectionMode(this);
        this.agentConfigurationMode = new AgentConfigurationMode(this);
        this.agentOperationsMode = new AgentOperationsMode(this);
    }
    defineAvailableModes() {
        return [
            this.agentSelectionMode.getMode(),
            this.agentConfigurationMode.getMode(),
            this.agentOperationsMode.getMode(),
        ];
    }
}
