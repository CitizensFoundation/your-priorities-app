import { BaseAssistantMode } from "./baseAssistantMode.js";
import { SubscriptionTools } from "./tools/subscriptionTools.js";
import { NavigationTools } from "./tools/navigationTools.js";
import { LoginAssistantTools } from "./tools/loginTools.js";
export class AgentSelectionMode extends BaseAssistantMode {
    constructor(assistant) {
        super(assistant);
        this.subscriptionTools = new SubscriptionTools(this.assistant);
        this.navigationTools = new NavigationTools(this.assistant);
        this.loginTools = new LoginAssistantTools(this.assistant);
    }
    getCurrentModeSystemPrompt() {
        let systemPrompt = `You are a general AI agent assistant. Help users select and manage AI agents.
Available tools:
- Switch to a direct conversation mode with an agent
- List available agents available for purchase
    `;
        if (this.assistant.isLoggedIn) {
            systemPrompt += `- Log out the current user
- List available agents the user is subscribed to
      `;
        }
        else {
            systemPrompt += "- Show login widget to the user if the user wants to display all their subscribed agents. You do not need to log in to connect to an agent.";
            if (this.assistant.haveShownLoginWidget) {
                systemPrompt += "- Click the Google login button";
            }
        }
        systemPrompt += this.renderCommon();
        return systemPrompt;
    }
    getCurrentModeTools() {
        const tools = [
            this.subscriptionTools.listAllAgentsAvailableForSubscription,
            this.navigationTools.connectDirectlyToAgent,
        ];
        if (this.assistant.isLoggedIn) {
            tools.push(this.loginTools.logout);
            tools.push(this.subscriptionTools.listMyAgentSubscriptions);
        }
        else {
            tools.push(this.loginTools.showLogin("Show login widget to the user if the user wants to display all their subscribed agents. You do not need to log in to connect to an agent."));
            if (this.assistant.haveShownLoginWidget) {
                tools.push(this.loginTools.clickGoogleLoginButton);
            }
        }
        return tools;
    }
    getMode() {
        const systemPrompt = this.getCurrentModeSystemPrompt();
        const tools = this.getCurrentModeTools();
        return {
            name: "agent_selection_mode",
            description: "List available agents the user is subscribed to or available for purchase then connect the user to the agent selected by the user",
            systemPrompt: systemPrompt,
            tools: tools,
            allowedTransitions: ["agent_direct_connection_mode"],
        };
    }
}
