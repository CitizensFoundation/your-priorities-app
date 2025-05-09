import { YpAgentAssistant } from "../../agentAssistant.js";
import { AgentModels } from "./models/agents.js";
import { SubscriptionModels } from "./models/subscriptions.js";
import { BaseAssistantTools } from "./baseTools.js";
export declare class NavigationTools extends BaseAssistantTools {
    protected agentModels: AgentModels;
    protected subscriptionModels: SubscriptionModels;
    constructor(assistant: YpAgentAssistant);
    goBackToMainAssistant(): Promise<ToolExecutionResult>;
    get connectDirectlyToAgent(): {
        name: string;
        description: string;
        type: string;
        parameters: {
            type: string;
            properties: YpAgentSelectProperties;
            required: readonly ["subscriptionPlanId"];
        };
        handler: (params: YpAgentSelectParams) => Promise<ToolExecutionResult>;
    };
    connectToOneOfTheAgentsHandler(params: YpAgentSelectParams): Promise<ToolExecutionResult>;
    get listAllAgentsAvailableForConnection(): {
        name: string;
        description: string;
        type: string;
        parameters: {
            type: string;
            properties: YpAgentEmptyProperties;
        };
        handler: (params: YpAgentEmptyProperties) => Promise<ToolExecutionResult>;
    };
    listAllAgentsAvailableForConnectionsHandler(params: YpAgentEmptyProperties): Promise<ToolExecutionResult>;
}
