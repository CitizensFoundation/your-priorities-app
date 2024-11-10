// commonTools.ts
export class CommonToolHandlers {
    constructor(assistant) {
        this.assistant = assistant;
    }
    async goBackToMainAssistant() {
        await this.assistant.handleModeSwitch('agent_subscription_and_selection', 'User requested to return to the main assistant', {});
        return {
            success: true,
            data: { message: 'Returned to main assistant' },
        };
    }
    async connectToOneOfTheAgentsHandler(params) {
        params = this.assistant.getCleanedParams(params);
        console.log(`handler: connect_to_one_of_the_agents: ${JSON.stringify(params, null, 2)}`);
        try {
            const agent = await this.validateAndSelectAgent(params.agentProductId);
            const requiredQuestions = await this.getRequiredQuestions(params.agentProductId);
            this.currentAgentId = params.agentProductId;
            // If we have unanswered required questions, switch to configuration mode
            if (requiredQuestions && requiredQuestions.length > 0) {
                await this.assistant.handleModeSwitch("agent_configuration", "Required questions need to be answered", params);
            }
            else {
                await this.assistant.handleModeSwitch("agent_operations", "Agent ready for operations", params);
            }
            const html = `<div class="agent-chips"><yp-agent-chip
          isSelected
          agentProductId="${agent.agentProductId}"
          subscriptionId="${agent.subscriptionId}"
          agentName="${agent.name}"
          agentDescription="${agent.description}"
          agentImageUrl="${agent.imageUrl}"
        ></yp-agent-chip></div>`;
            this.assistant.triggerResponseIfNeeded("Agent selected");
            return {
                success: true,
                html,
                data: {
                    agent,
                    hasRequiredQuestions: requiredQuestions && requiredQuestions.length > 0,
                },
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : "Failed to select agent";
            console.error(`Failed to select agent: ${errorMessage}`);
            return {
                success: false,
                data: errorMessage,
                error: errorMessage,
            };
        }
    }
}
