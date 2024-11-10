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
        };
    }
}
