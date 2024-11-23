// YpAgentAssistant.ts
import { YpBaseAssistantWithVoice } from "./baseAssistantWithVoice.js";
import { AgentSelectionMode } from "./modes/agentSelectionMode.js";
import { DirectConversationMode } from "./modes/agentDirectConnection.js";
import { SubscriptionManager } from "../managers/subscriptionManager.js";
export class YpAgentAssistant extends YpBaseAssistantWithVoice {
    constructor(wsClientId, wsClients, redis, voiceEnabled, domainId, memoryId) {
        super(wsClientId, wsClients, redis, voiceEnabled, domainId, memoryId);
        this.availableAgents = [];
        this.runningAgents = [];
        this.agentSelectionMode = new AgentSelectionMode(this);
        this.directConversationMode = new DirectConversationMode(this);
        this.subscriptionManager = new SubscriptionManager();
        this.on("memory-changed", this.handleMemoryChanged.bind(this));
    }
    async defineAvailableModes() {
        return [
            await this.agentSelectionMode.getMode(),
            await this.directConversationMode.getMode(),
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
        if (this.DEBUG) {
            console.log(`Sending memory changed to client: ${JSON.stringify(this.simplifiedMemory, null, 2)}`);
        }
        this.sendToClient("system", JSON.stringify(this.simplifiedMemory), "memory-changed");
    }
    get isLoggedIn() {
        return this.memory.currentUser !== undefined;
    }
    get currentAgent() {
        return this.memory.currentAgentStatus?.subscriptionPlan.AgentProduct;
    }
    get isSubscribedToCurrentAgent() {
        if (this.DEBUG) {
            console.log(`-------------------------------------------> isSubscribedToCurrentAgent: ${JSON.stringify(this.memory.currentAgentStatus, null, 2)}`);
        }
        return this.memory.currentAgentStatus?.subscription != undefined;
    }
    get hasConfiguredCurrentAgent() {
        return this.memory.currentAgentStatus?.configurationState === "configured";
    }
    get isCurrentAgentRunning() {
        return this.memory.currentAgentStatus?.activeAgentRun?.status === "running";
    }
    get isCurrentAgentActive() {
        return (this.memory.currentAgentStatus?.activeAgentRun?.status === "running" ||
            this.memory.currentAgentStatus?.activeAgentRun?.status === "ready" ||
            this.memory.currentAgentStatus?.activeAgentRun?.status ===
                "waiting_on_user");
    }
    get haveShownConfigurationWidget() {
        return this.memory.haveShownConfigurationWidget ?? false;
    }
    get haveShownLoginWidget() {
        return this.memory.haveShownLoginWidget ?? false;
    }
    get currentAgentWorkflow() {
        return this.memory.currentAgentStatus?.activeAgentRun?.workflow;
    }
    get currentAgentWorkflowCurrentStep() {
        return this.memory.currentAgentStatus?.activeAgentRun?.workflow?.steps[this.memory.currentAgentStatus?.activeAgentRun?.workflow
            ?.currentStepIndex ?? 0];
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
