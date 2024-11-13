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
        let systemPrompt = `You are the main AI agent assistant. Help users select AI agents to subscribe to or connect to. Use your tools when needed.`;
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
            tools.push(this.loginTools.showLogin("Show login widget to the user if they ask to be logged in or if they ask specfically to list all of their subscribed agents. You do not need to log in to connect to an agent."));
            if (this.assistant.haveShownLoginWidget) {
                tools.push(this.loginTools.clickGoogleLoginButton);
            }
        }
        return tools;
    }
    getMode() {
        console.log("---------------------> getMode AgentSelectionMode");
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
