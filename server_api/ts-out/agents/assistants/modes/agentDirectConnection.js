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
    async getCurrentModeSystemPrompt() {
        let systemPrompt = ``; // Is filled in dynamically
        systemPrompt += await this.renderCommon();
        return systemPrompt;
    }
    async getCurrentModeTools() {
        const tools = [];
        try {
            if (this.assistant.isLoggedIn) {
                // User logged in
                console.log("Mode: agent_direct_connection_mode, User logged in");
                tools.push(this.loginTools.logout);
                if (this.assistant.isSubscribedToCurrentAgentProduct) {
                    // User is subscribed to the current agent
                    console.log("Mode: agent_direct_connection_mode, User is subscribed to the current agent");
                    tools.push(this.subscriptionTools.unsubscribeFromCurrentAgentSubscription);
                    if (this.assistant.hasConfiguredcurrentAgentProduct) {
                        // User has configured the current agent
                        console.log("Mode: agent_direct_connection_mode, User has configured the current agent");
                        if (await this.assistant.isCurrentAgentRunning()) {
                            tools.push(this.agentTools.stopCurrentAgentWorkflow);
                            tools.push(this.agentTools.deactivateAgent);
                        }
                        else {
                            if (!(await this.assistant.isCurrentAgentActive())) {
                                tools.push(this.agentTools.createNewAgentRunReadyToRunFirstWorkflowStep);
                            }
                            else {
                                const nextWorkflowStep = await this.agentTools.agentModels.getNextWorkflowStep();
                                if (nextWorkflowStep) {
                                    tools.push(await this.agentTools.startCurrentRunAgentNextWorkflowStep());
                                }
                                //TODO: Do we need this if the user looses the widget in their chat history?
                                //tools.push(this.agentTools.showAgentRunWidget);
                            }
                        }
                    }
                    else {
                        // User has not configured the current agent
                        console.log("Mode: agent_direct_connection_mode, User has not configured the current agent");
                        tools.push(this.agentTools.showConfigurationWidget);
                        if (this.assistant.haveShownConfigurationWidget) {
                            console.log("Mode: agent_direct_connection_mode, User has shown the configuration widget");
                            tools.push(this.agentTools.submitConfiguration);
                        }
                    }
                }
                else {
                    // User is not subscribed to the current agent
                    console.log("Mode: agent_direct_connection_mode, User is not subscribed to the current agent");
                    tools.push(this.subscriptionTools.subscribeToCurrentAgentPlan);
                    tools.push(this.agentTools.showAgentWorkflowOverviewWidget);
                }
            }
            else {
                // User not logged in
                console.log("Mode: agent_direct_connection_mode, User not logged in");
                tools.push(this.loginTools.showLogin("Show login widget to the user if wants to subscribe to an agent or start an agent workflow. Always show the login widget if the user asks to be logged in."));
                tools.push(this.agentTools.showAgentWorkflowOverviewWidget);
                if (this.assistant.haveShownLoginWidget) {
                    console.log("Mode: agent_direct_connection_mode, User has shown the login widget");
                    tools.push(this.loginTools.clickGoogleLoginButton);
                    tools.push(this.loginTools.clickMainLoginButton);
                }
            }
            return tools;
        }
        catch (error) {
            console.error(error);
            return [];
        }
    }
    async getMode() {
        console.log("---------------------> getMode DirectConversationMode");
        const systemPrompt = await this.getCurrentModeSystemPrompt();
        const tools = await this.getCurrentModeTools();
        return {
            name: "agent_direct_connection_mode",
            description: "Direct connection to an agent the user is subscribed to or available for purchase",
            systemPrompt: systemPrompt,
            tools: tools,
            allowedTransitions: ["agent_direct_connection_mode"],
        };
    }
}
