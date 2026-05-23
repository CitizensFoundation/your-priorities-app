import { YpAgentAssistant } from "../../agentAssistant.js";
import { BaseAssistantTools } from "./baseTools.js";
export declare class LoginAssistantTools extends BaseAssistantTools {
    constructor(assistant: YpAgentAssistant);
    showLogin(description: string): {
        name: string;
        description: string;
        type: string;
        parameters: {
            type: string;
            properties: YpAgentEmptyProperties;
            required: readonly [];
        };
        handler: (params: {}) => Promise<ToolExecutionResult>;
    };
    showLoginHandler(params: {}): Promise<ToolExecutionResult>;
    get clickMainLoginButton(): {
        name: string;
        description: string;
        type: string;
        parameters: {
            type: string;
            properties: YpAgentEmptyProperties;
        };
        handler: (params: {}) => Promise<ToolExecutionResult>;
    };
    clickMainLoginButtonHandler(params: {}): Promise<ToolExecutionResult>;
    get clickGoogleLoginButton(): {
        name: string;
        description: string;
        type: string;
        parameters: {
            type: string;
            properties: YpAgentEmptyProperties;
        };
        handler: (params: {}) => Promise<ToolExecutionResult>;
    };
    clickGoogleLoginButtonHandler(params: {}): Promise<ToolExecutionResult>;
    get logout(): {
        name: string;
        description: string;
        type: string;
        parameters: {
            type: string;
            properties: YpAssistantLogoutProperties;
            required: readonly ["confirmLogout"];
        };
        handler: (params: YpAssistantLogoutParams) => Promise<ToolExecutionResult>;
    };
    logoutHandler(params: YpAssistantLogoutParams): Promise<ToolExecutionResult>;
}
