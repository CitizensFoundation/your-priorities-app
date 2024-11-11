// DirectConversationMode.ts

import { BaseAssistantMode } from "./baseAssistantMode.js";
import { YpAgentAssistant } from "../agentAssistant.js";
import { YpAgentProduct } from "../../models/agentProduct.js";
import { SubscriptionTools } from "./tools/subscriptionTools.js";
import { NavigationTools } from "./tools/navigationTools.js";
import { LoginAssistantTools } from "./tools/loginTools.js";
import { AgentTools } from "./tools/agentTools.js";

export class DirectConversationMode extends BaseAssistantMode {
  constructor(assistant: YpAgentAssistant) {
    super(assistant);
  }

  subscriptionTools = new SubscriptionTools(this.assistant);
  navigationTools = new NavigationTools(this.assistant);
  loginTools = new LoginAssistantTools(this.assistant);
  agentTools = new AgentTools(this.assistant);

  protected getCurrentModeSystemPrompt(): string {
    let systemPrompt = `Available tools:
- Switch back to the main assistant to work with other agents
`;

    if (this.assistant.isLoggedIn) {
      systemPrompt += `- Log out the current user and switch to the main assistant
  `;
    } else {
      systemPrompt += "- Show login widget to the user if wants to subscribe to an agent, start an agent workflow or any other action that requires the user to be logged in.";
      if (this.assistant.haveShownLoginWidget) {
        systemPrompt += "- Click the Google login button";
        systemPrompt += "- Click the main login button";
      }
    }

    if (this.assistant.isSubscribedToCurrentAgent) {
      if (this.assistant.hasConfiguredCurrentAgent) {
        systemPrompt += `- Show agent workflow widget`;
        if (this.assistant.isCurrentAgentRunning) {
          systemPrompt += `- Stop the current agent workflow`;
        } else {
          systemPrompt += `- Start an agent workflow with the current agent`;
        }
        if (this.assistant.isCurrentAgentWaitingOnUserInput) {
          systemPrompt += `- Show current agent input widget`;
        }
      } else {
        systemPrompt += `- Show configuration widget for the current agent before the user can start an agent workflow`;
        if (this.assistant.haveShownConfigurationWidget) {
          systemPrompt += `- Submit the configuration`;
        }
      }
    } else {
      systemPrompt += `- Subscribe to the current agent before the user can start an agent workflow`;
    }

    systemPrompt += this.renderCommon();

    return systemPrompt;
  }

  protected getCurrentModeTools(): AssistantChatbotTool[] {
    const tools: AssistantChatbotTool[] = [
    ];

    if (this.assistant.isLoggedIn) {
      tools.push(this.loginTools.logout);
    } else {
      tools.push(this.loginTools.showLogin("Show login widget to the user if wants to subscribe to an agent or start an agent workflow"));
      if (this.assistant.haveShownLoginWidget) {
        tools.push(this.loginTools.clickGoogleLoginButton);
        tools.push(this.loginTools.clickMainLoginButton);
      }
    }

    if (this.assistant.isSubscribedToCurrentAgent) {
      if (this.assistant.hasConfiguredCurrentAgent) {
        tools.push(this.agentTools.showAgentWorkflowWidget);
        if (this.assistant.isCurrentAgentRunning) {
          tools.push(this.agentTools.stopCurrentAgentWorkflow);
        } else {
          tools.push(this.agentTools.startCurrentAgentWorkflow);
        }
      } else {
        tools.push(this.agentTools.showConfigurationWidget);
        if (this.assistant.haveShownConfigurationWidget) {
          tools.push(this.agentTools.submitConfiguration);
        }
      }
    } else {
      tools.push(this.subscriptionTools.subscribeToCurrentAgentPlan);
    }
    return tools;
  }

  public getMode(): AssistantChatbotMode {
    const systemPrompt = this.getCurrentModeSystemPrompt();
    const tools = this.getCurrentModeTools();

    return {
      name: "agent_direct_connection_mode",
      description:
        "Direct connection to an agent the user is subscribed to or available for purchase",
      systemPrompt: systemPrompt,
      tools: tools,
      allowedTransitions: ["agent_direct_connection_mode"],
    };
  }
}
