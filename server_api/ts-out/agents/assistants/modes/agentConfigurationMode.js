// agentConfigurationMode.ts
import { BaseAssistantMode } from './baseAssistantMode.js';
export class AgentConfigurationMode extends BaseAssistantMode {
    constructor(assistant) {
        super(assistant);
    }
    getMode() {
        return {
            name: 'agent_configuration',
            systemPrompt: `Help the user configure the selected agent by collecting required information.
Review the required questions and guide the user through answering them.
${this.renderCommon()}
${this.renderCurrentAgent()}`,
            description: 'Configure agent parameters and requirements',
            functions: [
                {
                    name: 'show_question_form',
                    description: 'Display form for required questions',
                    type: 'function',
                    parameters: {
                        type: 'object',
                        properties: {
                            agentProductId: { type: 'number' },
                        },
                        required: ['agentProductId'],
                    },
                    handler: async (params) => {
                        params = this.assistant.getCleanedParams(params);
                        console.log(`handler: show_question_form: ${JSON.stringify(params, null, 2)}`);
                        try {
                            const questions = await this.getRequiredQuestions(params.agentProductId);
                            // Create HTML element for questions
                            let html = questions
                                .map((question) => `
                <yp-structured-question
                  .question="${JSON.stringify(question)}"
                ></yp-structured-question>
              `)
                                .join('\n');
                            return {
                                success: true,
                                data: questions,
                                html,
                            };
                        }
                        catch (error) {
                            const errorMessage = error instanceof Error
                                ? error.message
                                : 'Failed to show questions';
                            console.error(`Failed to show questions: ${errorMessage}`);
                            return {
                                success: false,
                                data: errorMessage,
                                error: errorMessage,
                            };
                        }
                    },
                },
            ],
            allowedTransitions: ['agent_operations'],
        };
    }
}
