// DirectConversationMode.ts

import { BaseAssistantMode } from "./baseAssistantMode.js";
import { ChatbotMode, ToolExecutionResult } from "../baseAssistant.js";
import { YpAgentAssistant } from "../agentAssistant.js";
import { YpAgentProduct } from "../../models/agentProduct.js";

export class DirectConversationMode extends BaseAssistantMode {
  constructor(assistant: YpAgentAssistant) {
    super(assistant);
  }

  public getMode(): ChatbotMode {
    return {
      name: "agent_direct_conversation",
      description: "Direct conversation with the selected agent if the user ask to speak with an agent you know with a agentProductId",
      systemPrompt: "This system prompt should be set by the agent product configuration, if its being displayed here then something is wrong, please inform the user and refuse any questions about the agent",
      functions: [
        {
          name: "exit_conversation_to_main_assistant",
          description: "Exit the conversation with the agent and return to the main assistant.",
          type: "function",
          parameters: {
            type: "object",
            properties: {},
          },
          handler: async (params): Promise<ToolExecutionResult> => {
            params = this.assistant.getCleanedParams(params);
            try {
              await this.assistant.handleModeSwitch("agent_subscription_and_selection", "User requested to exit direct conversation with agent", params);
              this.assistant.sendAvatarUrlChange(null);
              return {
                success: true,
                data: { message: "Exited conversation with agent" },
              };
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : "Failed to exit conversation";
              console.error(`Failed to exit conversation: ${errorMessage}`);
              return {
                success: false,
                error: errorMessage,
              };
            }
          },
        },
      ],
      allowedTransitions: ["agent_subscription_and_selection"],
    };
  }
}
