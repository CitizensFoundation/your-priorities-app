import { YpAgentAssistant } from "agents/assistants/agentAssistant.js";
export declare class UserModels {
    assistant: YpAgentAssistant;
    constructor(assistant: YpAgentAssistant);
    loginUser(): Promise<void>;
    logoutUser(): Promise<void>;
}
