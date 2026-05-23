import { YpBaseAssistantWithVoice } from "./baseAssistantWithVoice.js";
import { PsAgent } from "@policysynth/agents/dbModels/agent.js";
import WebSocket from "ws";
import ioredis from "ioredis";
import { SubscriptionManager } from "../managers/subscriptionManager.js";
export declare class YpAgentAssistant extends YpBaseAssistantWithVoice {
    availableAgents: PsAgent[];
    runningAgents: PsAgent[];
    private agentSelectionMode;
    private directConversationMode;
    subscriptionManager: SubscriptionManager;
    constructor(wsClientId: string, wsClients: Map<string, WebSocket>, redis: ioredis.Redis, voiceEnabled: boolean, redisKey: string, domainId: number);
    defineAvailableModes(): Promise<AssistantChatbotMode[]>;
    get simplifiedMemory(): Partial<YpBaseAssistantMemoryData>;
    handleMemoryChanged(memory: YpBaseAssistantMemoryData): void;
    get isLoggedIn(): boolean;
    get isSubscribedToCurrentAgentProduct(): boolean;
    get hasConfiguredcurrentAgentProduct(): boolean;
    isCurrentAgentRunning(): Promise<boolean>;
    isCurrentAgentActive(): Promise<boolean>;
    get haveShownConfigurationWidget(): boolean;
    get haveShownLoginWidget(): boolean;
    getCurrentAgentWorkflow(): Promise<YpAgentRunWorkflowConfiguration | undefined>;
    getCurrentAgentWorkflowCurrentStep(): Promise<YpAgentRunWorkflowStep | undefined>;
    isCurrentAgentWaitingOnUserInput(): Promise<boolean>;
    triggerResponseIfNeeded(message: string): void;
}
