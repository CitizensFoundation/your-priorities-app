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

  protected async getCurrentModeSystemPrompt(): Promise<string> {
    let systemPrompt = ``; // Is filled in dynamically

    systemPrompt += await this.renderCommon();

    return systemPrompt;
  }

  protected async getCurrentModeTools(): Promise<AssistantChatbotTool[]> {
    const tools: AssistantChatbotTool[] = [];

    try {
      if (this.assistant.isLoggedIn) {
        // User logged in
        console.log("Mode: agent_direct_connection_mode, User logged in");
        tools.push(this.loginTools.logout);
        tools.push(this.agentTools.showAgentWorkflowOverviewWidget);

        if (this.assistant.isSubscribedToCurrentAgentProduct) {

          if (this.assistant.hasConfiguredcurrentAgentProduct) {
            // User has configured the current agent
            console.log(
              "Mode: agent_direct_connection_mode, User has configured the current agent"
            );
            if (await this.assistant.isCurrentAgentRunning()) {
              tools.push(this.agentTools.stopCurrentAgentWorkflow);
              tools.push(this.agentTools.deactivateAgent);
            } else {
              if (!(await this.assistant.isCurrentAgentActive())) {
                tools.push(
                  this.agentTools.createNewAgentRunReadyToRunFirstWorkflowStep
                );
              } else {
                const nextWorkflowStep =
                  await this.agentTools.agentModels.getNextWorkflowStep();
                if (nextWorkflowStep) {
                  tools.push(
                    await this.agentTools.startCurrentRunAgentNextWorkflowStep()
                  );
                }
                //TODO: Do we need this if the user looses the widget in their chat history?
                //tools.push(this.agentTools.showAgentRunWidget);
              }
            }
          } else {
            // User has not configured the current agent
            console.log(
              "Mode: agent_direct_connection_mode, User has not configured the current agent"
            );
            tools.push(this.agentTools.showConfigurationWidget);
            if (this.assistant.haveShownConfigurationWidget) {
              console.log(
                "Mode: agent_direct_connection_mode, User has shown the configuration widget"
              );
              tools.push(this.agentTools.submitConfiguration);
            }
          }
        } else {
          // User is not subscribed to the current agent
          console.error(
            "Mode: agent_direct_connection_mode, User is not subscribed to the current agent should not happen"
          );

        }
      }

      return tools;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  public async getMode(): Promise<AssistantChatbotMode> {
    console.log("---------------------> getMode DirectConversationMode");
    const systemPrompt = await this.getCurrentModeSystemPrompt();
    const tools = await this.getCurrentModeTools();

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
