// DirectConversationMode.ts
import { BaseAssistantMode } from "./baseAssistantMode.js";
export class DirectConversationMode extends BaseAssistantMode {
    constructor(assistant) {
        super(assistant);
    }
    getMode() {
        return {
            name: "agent_direct_conversation",
            description: "Direct conversation with any agent the user is subscribed to or available for purchase",
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
                    handler: async (params) => {
                        params = this.assistant.getCleanedParams(params);
                        try {
                            await this.assistant.handleModeSwitch("agent_subscription_and_selection", "User requested to exit direct conversation with agent", params);
                            this.assistant.sendAvatarUrlChange(null);
                            return {
                                success: true,
                                data: { message: "The user has been returned to the main assistant and exited the direct conversation with the agent" },
                            };
                        }
                        catch (error) {
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
