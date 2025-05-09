import { BaseAssistantMode } from "./baseAssistantMode.js";
import { YpAgentAssistant } from "../agentAssistant.js";
import { SubscriptionTools } from "./tools/subscriptionTools.js";
import { NavigationTools } from "./tools/navigationTools.js";
import { LoginAssistantTools } from "./tools/loginTools.js";
import { AgentTools } from "./tools/agentTools.js";
export declare class DirectConversationMode extends BaseAssistantMode {
    constructor(assistant: YpAgentAssistant);
    subscriptionTools: SubscriptionTools;
    navigationTools: NavigationTools;
    loginTools: LoginAssistantTools;
    agentTools: AgentTools;
    protected getCurrentModeSystemPrompt(): Promise<string>;
    protected getCurrentModeTools(): Promise<AssistantChatbotTool[]>;
    getMode(): Promise<AssistantChatbotMode>;
}
