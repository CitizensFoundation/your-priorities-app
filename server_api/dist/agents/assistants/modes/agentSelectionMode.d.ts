import { BaseAssistantMode } from "./baseAssistantMode.js";
import { YpAgentAssistant } from "../agentAssistant.js";
import { NavigationTools } from "./tools/navigationTools.js";
import { LoginAssistantTools } from "./tools/loginTools.js";
export declare class AgentSelectionMode extends BaseAssistantMode {
    constructor(assistant: YpAgentAssistant);
    navigationTools: NavigationTools;
    loginTools: LoginAssistantTools;
    protected getCurrentModeSystemPrompt(): Promise<string>;
    protected getCurrentModeTools(): Promise<AssistantChatbotTool[]>;
    getMode(): Promise<AssistantChatbotMode>;
}
