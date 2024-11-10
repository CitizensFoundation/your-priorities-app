import { BaseAssistantMode } from "./baseAssistantMode.js";
import { YpAgentAssistant } from "../agentAssistant.js";
import { YpSubscriptionPlan } from "../../models/subscriptionPlan.js";
import { YpSubscription } from "../../models/subscription.js";
import { SubscriptionTools } from "./tools/subscriptionTools.js";
import { NavigationTools } from "./tools/navigationTools.js";
import { LoginAssistantTools } from "./tools/loginTools.js";
import { AgentTools } from "./tools/agentTools.js";

export class AgentSelectionMode extends BaseAssistantMode {
  constructor(assistant: YpAgentAssistant) {
    super(assistant);
  }

  subscriptionTools = new SubscriptionTools(this.assistant);
  navigationTools = new NavigationTools(this.assistant);
  loginTools = new LoginAssistantTools(this.assistant);

  protected getCurrentModeSystemPrompt(): string {
    let systemPrompt = `You are a general AI agent assistant. Help users select and manage AI agents.
Available tools:
- Connect directly to an agent to work with
- List available agents available for purchase
    `;

    if (this.assistant.isLoggedIn) {
      systemPrompt += `- Log out the current user
- List available agents the user is subscribed to
      `;
    } else {
      systemPrompt += "- Show login widget to the user";
      if (this.assistant.haveShownLoginWidget) {
        systemPrompt += "- Click the Google login button";
      }
    }

    systemPrompt += this.renderCommon();

    return systemPrompt;
  }

  protected getCurrentModeTools(): AssistantChatbotTool[] {
    const tools: AssistantChatbotTool[] = [
      this.navigationTools.connectDirectlyToAgent,
      this.subscriptionTools.listAllAgentsAvailableForSubscription,
    ];

    if (this.assistant.isLoggedIn) {
      tools.push(this.loginTools.logout);
      tools.push(this.subscriptionTools.listMyAgentSubscriptions);
    } else {
      tools.push(this.loginTools.showLogin);
      if (this.assistant.haveShownLoginWidget) {
        tools.push(this.loginTools.clickGoogleLoginButton);
      }
    }

    return tools;
  }

  public getMode(): AssistantChatbotMode {
    const systemPrompt = this.getCurrentModeSystemPrompt();
    const tools = this.getCurrentModeTools();

    console.log("222222------------------->", tools)

    return {
      name: "agent_selection_mode",
      description:
        "List available agents the user is subscribed to or available for purchase then connect the user to the agent selected by the user",
      systemPrompt: systemPrompt,
      tools: tools,
      allowedTransitions: ["agent_direct_connection_mode"],
    };
  }
}
