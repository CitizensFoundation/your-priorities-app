// DirectConversationMode.ts
import { BaseAssistantMode } from "./baseAssistantMode.js";
import { SubscriptionTools } from "./tools/subscriptionTools.js";
import { NavigationTools } from "./tools/navigationTools.js";
import { LoginAssistantTools } from "./tools/loginTools.js";
import { AgentTools } from "./tools/agentTools.js";
export class DirectConversationMode extends BaseAssistantMode {
    constructor(assistant) {
        super(assistant);
        this.subscriptionTools = new SubscriptionTools(this.assistant);
        this.navigationTools = new NavigationTools(this.assistant);
        this.loginTools = new LoginAssistantTools(this.assistant);
        this.agentTools = new AgentTools(this.assistant);
    }
    getCurrentModeSystemPrompt() {
        let systemPrompt = ``; // Is filled in dynamically
        systemPrompt += this.renderCommon();
        return systemPrompt;
    }
    getCurrentModeTools() {
        const tools = [];
        if (this.assistant.isLoggedIn) {
            // User logged in
            tools.push(this.loginTools.logout);
            if (this.assistant.isSubscribedToCurrentAgent) {
                // User is subscribed to the current agent
                if (this.assistant.hasConfiguredCurrentAgent) {
                    // User has configured the current agent
                    tools.push(this.agentTools.showAgentWorkflowWidget);
                    if (this.assistant.isCurrentAgentRunning) {
                        tools.push(this.agentTools.stopCurrentAgentWorkflow);
                    }
                    else {
                        tools.push(this.agentTools.startCurrentAgentWorkflow);
                    }
                }
                else {
                    // User has not configured the current agent
                    tools.push(this.agentTools.showConfigurationWidget);
                    if (this.assistant.haveShownConfigurationWidget) {
                        tools.push(this.agentTools.submitConfiguration);
                    }
                }
            }
            else {
                // User is not subscribed to the current agent
                tools.push(this.subscriptionTools.subscribeToCurrentAgentPlan);
            }
        }
        else {
            // User not logged in
            tools.push(this.loginTools.showLogin("Show login widget to the user if wants to subscribe to an agent or start an agent workflow"));
            if (this.assistant.haveShownLoginWidget) {
                tools.push(this.loginTools.clickGoogleLoginButton);
                tools.push(this.loginTools.clickMainLoginButton);
            }
        }
        return tools;
    }
    getMode() {
        const systemPrompt = this.getCurrentModeSystemPrompt();
        const tools = this.getCurrentModeTools();
        return {
            name: "agent_direct_connection_mode",
            description: "Direct connection to an agent the user is subscribed to or available for purchase",
            systemPrompt: systemPrompt,
            tools: tools,
            allowedTransitions: ["agent_direct_connection_mode"],
        };
    }
}
