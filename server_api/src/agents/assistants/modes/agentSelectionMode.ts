import { BaseAssistantMode } from "./baseAssistantMode.js";
import { YpAgentAssistant } from "../agentAssistant.js";
import { SubscriptionTools } from "./tools/subscriptionTools.js";
import { NavigationTools } from "./tools/navigationTools.js";
import { LoginAssistantTools } from "./tools/loginTools.js";

import log from "../../../utils/loggerTs.js";

export class AgentSelectionMode extends BaseAssistantMode {
  constructor(assistant: YpAgentAssistant) {
    super(assistant);
  }

  navigationTools = new NavigationTools(this.assistant);
  loginTools = new LoginAssistantTools(this.assistant);

  protected async getCurrentModeSystemPrompt(): Promise<string> {
    let systemPrompt = `You are the main AI agent assistant. Help users select AI agent workflows to connect to. Use your tools when needed.`;

    systemPrompt += await this.renderCommon();

    return systemPrompt;
  }

  protected async getCurrentModeTools(): Promise<AssistantChatbotTool[]> {
    const tools: AssistantChatbotTool[] = [
      this.navigationTools.listAllAgentsAvailableForConnection,
    ];

    if (this.assistant.isLoggedIn) {
      tools.push(this.navigationTools.connectDirectlyToAgent);
      tools.push(this.loginTools.logout);
    } else {
      tools.push(
        this.loginTools.showLogin(
          "Show login widget to the user when needed. You do need to log in to connect to an agent. When you have logged in the connect directly to agent tool will be available."
        )
      );
      if (this.assistant.haveShownLoginWidget) {
        tools.push(this.loginTools.clickMainLoginButton);
        tools.push(this.loginTools.clickGoogleLoginButton);
      }
    }

    return tools;
  }

  public async getMode(): Promise<AssistantChatbotMode> {
    log.info("---------------------> getMode AgentSelectionMode");
    const systemPrompt = await this.getCurrentModeSystemPrompt();
    const tools = await this.getCurrentModeTools();

    return {
      name: "agent_selection_mode",
      description:
        "List available agents the user can connect to then connect the user to the agent selected by the user",
      systemPrompt: systemPrompt,
      tools: tools,
      allowedTransitions: ["agent_direct_connection_mode"],
    };
  }
}
