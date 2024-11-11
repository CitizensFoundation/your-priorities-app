// YpAgentAssistant.ts
import { YpBaseAssistantWithVoice } from "./baseAssistantWithVoice.js";
import { AgentSelectionMode } from "./modes/agentSelectionMode.js";
import { DirectConversationMode } from "./modes/agentDirectConnection.js";
export class YpAgentAssistant extends YpBaseAssistantWithVoice {
    constructor(wsClientId, wsClients, redis, voiceEnabled, currentMode, domainId, memoryId, userId) {
        super(wsClientId, wsClients, redis, voiceEnabled, currentMode, domainId, memoryId);
        this.availableAgents = [];
        this.runningAgents = [];
        this.userId = userId;
        this.agentSelectionMode = new AgentSelectionMode(this);
        this.directConversationMode = new DirectConversationMode(this);
        this.on("memory-changed", this.handleMemoryChanged.bind(this));
    }
    defineAvailableModes() {
        return [
            this.agentSelectionMode.getMode(),
            this.directConversationMode.getMode(),
        ];
    }
    get simplifiedMemory() {
        return {
            currentMode: this.memory.currentMode,
            currentUser: this.memory.currentUser,
            haveShownConfigurationWidget: this.memory.haveShownConfigurationWidget,
            haveShownLoginWidget: this.memory.haveShownLoginWidget,
            currentAgentStatus: this.memory.currentAgentStatus,
        };
    }
    handleMemoryChanged(memory) {
        console.log(`memory changed: ${JSON.stringify(memory, null, 2)}`);
        this.sendToClient("system", JSON.stringify(this.simplifiedMemory), "memory-changed");
    }
    get isLoggedIn() {
        return this.memory.currentUser !== undefined;
    }
    get currentAgent() {
        return this.memory.currentAgentStatus?.agentProduct;
    }
    get isSubscribedToCurrentAgent() {
        return this.memory.currentAgentStatus?.subscription !== undefined;
    }
    get hasConfiguredCurrentAgent() {
        return this.memory.currentAgentStatus?.configurationState === "configured";
    }
    get isCurrentAgentRunning() {
        return (this.memory.currentAgentStatus?.agentRun?.status === "running");
    }
    get haveShownConfigurationWidget() {
        return this.memory.haveShownConfigurationWidget ?? false;
    }
    get haveShownLoginWidget() {
        return this.memory.haveShownLoginWidget ?? false;
    }
    get currentAgentWorkflow() {
        return this.memory.currentAgentStatus?.agentRun?.workflow;
    }
    get currentAgentWorkflowCurrentStep() {
        return this.memory.currentAgentStatus?.agentRun?.workflow?.steps[this.memory.currentAgentStatus?.agentRun?.workflow?.currentStepIndex ?? 0];
    }
    get isCurrentAgentWaitingOnUserInput() {
        const currentStep = this.currentAgentWorkflowCurrentStep;
        if (!currentStep) {
            return false;
        }
        return (currentStep.type === "engagmentFromInputConnector" ||
            currentStep.type === "engagmentFromOutputConnector");
    }
    triggerResponseIfNeeded(message) {
        if (this.voiceBot && this.voiceEnabled) {
            this.voiceBot.triggerResponse(message);
        }
    }
}
