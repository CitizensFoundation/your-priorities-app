// YpAgentAssistant.ts
import { YpBaseAssistantWithVoice } from "./baseAssistantWithVoice.js";
import { AgentSelectionMode } from "./modes/agentSelectionMode.js";
import { DirectConversationMode } from "./modes/agentDirectConnection.js";
import { SubscriptionManager } from "../managers/subscriptionManager.js";
import log from "../../utils/loggerTs.js";
export class YpAgentAssistant extends YpBaseAssistantWithVoice {
    constructor(wsClientId, wsClients, redis, voiceEnabled, redisKey, domainId) {
        super(wsClientId, wsClients, redis, voiceEnabled, redisKey, domainId);
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
            log.info(`Sending memory changed to client: ${JSON.stringify(this.simplifiedMemory, null, 2)}`);
        }
        this.sendToClient("system", JSON.stringify(this.simplifiedMemory), "memory-changed");
    }
    get isLoggedIn() {
        return this.memory.currentUser !== undefined;
    }
    get isSubscribedToCurrentAgentProduct() {
        if (this.DEBUG) {
            log.info(`-------------------------------------------> isSubscribedToCurrentAgent: ${JSON.stringify(this.memory.currentAgentStatus, null, 2)}`);
        }
        return this.memory.currentAgentStatus?.subscriptionId != undefined;
    }
    get hasConfiguredcurrentAgentProduct() {
        log.info(`configuration: ${this.redisKey}: ${JSON.stringify(this.memory.currentAgentStatus, null, 2)}`);
        return this.memory.currentAgentStatus?.configurationState === "configured";
    }
    async isCurrentAgentRunning() {
        const agentRun = await this.getCurrentAgentRun();
        return agentRun?.status === "running";
    }
    async isCurrentAgentActive() {
        const agentRun = await this.getCurrentAgentRun();
        return (agentRun?.status === "running" ||
            agentRun?.status === "ready" ||
            agentRun?.status === "stopped" ||
            agentRun?.status === "waiting_on_user");
    }
    get haveShownConfigurationWidget() {
        return this.memory.haveShownConfigurationWidget ?? false;
    }
    get haveShownLoginWidget() {
        return this.memory.haveShownLoginWidget ?? false;
    }
    async getCurrentAgentWorkflow() {
        const agentRun = await this.getCurrentAgentRun();
        return agentRun?.workflow;
    }
    async getCurrentAgentWorkflowCurrentStep() {
        const agentRun = await this.getCurrentAgentRun();
        return agentRun?.workflow?.steps[agentRun?.workflow?.currentStepIndex ?? 0];
    }
    async isCurrentAgentWaitingOnUserInput() {
        const currentStep = await this.getCurrentAgentWorkflowCurrentStep();
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
