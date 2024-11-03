import { BaseAssistantMode } from './baseAssistantMode.js';
const DEBUG = false;
export class AgentSelectionMode extends BaseAssistantMode {
    constructor(assistant) {
        super(assistant);
    }
    getMode() {
        return {
            name: 'agent_selection',
            systemPrompt: `You are an AI agent assistant. Help users select and manage their AI agents.
Available commands:
- List available agents you are subscribed to
- List available agents available for purchase
- Select an agent you are subscribed to to work with
Current system status and available agents are provided via functions.
${this.renderCommon()}
${this.renderAllAgentsStatus()}`,
            description: 'List, browse and select agents',
            functions: [
                {
                    name: 'list_my_agent_subscriptions',
                    description: 'List all agent subscriptions for the current user.',
                    type: 'function',
                    parameters: {
                        type: 'object',
                        properties: {
                            includeDetails: { type: 'boolean' },
                        },
                    },
                    handler: async (params) => {
                        params = this.assistant.getCleanedParams(params);
                        console.log(`handler: list_my_agent_subscriptions: ${JSON.stringify(params, null, 2)}`);
                        try {
                            const status = (await this.loadMyAgentSubscriptions());
                            if (DEBUG) {
                                console.log(`list_my_agent_subscriptions: ${JSON.stringify(status, null, 2)}`);
                            }
                            let agentChips = '';
                            for (const agent of status.availableAgents) {
                                agentChips += `<yp-agent-chip
                  agentProductId="${agent.agentProductId}"
                  subscriptionId="${agent.subscriptionId}"
                  agentName="${agent.name}"
                  agentDescription="${agent.description}"
                  agentImageUrl="${agent.imageUrl}"
                ></yp-agent-chip>`;
                            }
                            const html = `<div class="agent-chips">${agentChips}</div>`;
                            return {
                                success: true,
                                data: status,
                                html,
                                metadata: {
                                    timestamp: new Date().toISOString(),
                                },
                            };
                        }
                        catch (error) {
                            const errorMessage = error instanceof Error
                                ? error.message
                                : 'Failed to load agent status';
                            console.error(`Failed to load agent status: ${errorMessage}`);
                            return {
                                success: false,
                                data: errorMessage,
                                error: errorMessage,
                            };
                        }
                    },
                },
                {
                    name: 'list_all_agents_available_for_purchase',
                    description: 'List all agent subscriptions available for purchase',
                    type: 'function',
                    parameters: {
                        type: 'object',
                        properties: {
                            includeDetails: { type: 'boolean' },
                        },
                    },
                    handler: async (params) => {
                        params = this.assistant.getCleanedParams(params);
                        console.log(`handler: list_all_agents_available_for_purchase: ${JSON.stringify(params, null, 2)}`);
                        try {
                            const status = (await this.loadAllAgentPlans());
                            if (DEBUG) {
                                console.log(`list_all_agents_available_for_purchase: ${JSON.stringify(status, null, 2)}`);
                            }
                            let agentChips = '';
                            for (const agent of status.availablePlans) {
                                agentChips += `<yp-agent-chip-for-purchase
                  agentProductId="${agent.agentProductId}"
                  subscriptionPlanId="${agent.subscriptionPlanId}"
                  agentName="${agent.name}"
                  agentDescription="${agent.description}"
                  agentImageUrl="${agent.imageUrl}"
                  price="${agent.price}"
                  currency="${agent.currency}"
                  maxRunsPerCycle="${agent.maxRunsPerCycle}"
                ></yp-agent-chip-for-purchase>`;
                            }
                            const html = `<div class="agent-chips">${agentChips}</div>`;
                            return {
                                success: true,
                                data: status,
                                html,
                                metadata: {
                                    timestamp: new Date().toISOString(),
                                },
                            };
                        }
                        catch (error) {
                            const errorMessage = error instanceof Error
                                ? error.message
                                : 'Failed to load agent status';
                            console.error(`Failed to load agent status: ${errorMessage}`);
                            return {
                                success: false,
                                data: errorMessage,
                                error: errorMessage,
                            };
                        }
                    },
                },
                {
                    name: 'select_agent',
                    description: 'Select an agent to work with',
                    type: 'function',
                    parameters: {
                        type: 'object',
                        properties: {
                            agentProductId: { type: 'number' },
                        },
                        required: ['agentProductId'],
                    },
                    handler: async (params) => {
                        console.log(`handler: select_agent: ${JSON.stringify(params, null, 2)}`);
                        try {
                            let cleanedParams = typeof params === 'string' ? JSON.parse(params) : params;
                            const agent = await this.validateAndSelectAgent(cleanedParams.agentProductId);
                            const requiredQuestions = await this.getRequiredQuestions(cleanedParams.agentProductId);
                            this.currentAgentId = cleanedParams.agentProductId;
                            // If we have unanswered required questions, switch to configuration mode
                            if (requiredQuestions && requiredQuestions.length > 0) {
                                await this.assistant.handleModeSwitch('agent_configuration', 'Required questions need to be answered');
                            }
                            else {
                                await this.assistant.handleModeSwitch('agent_operations', 'Agent ready for operations');
                            }
                            const html = `<div class="agent-chips"><yp-agent-chip
                  isSelected="true"
                  agentId="${agent.id}"
                  agentName="${agent.name}"
                  agentDescription="${agent.description}"
                  agentImageUrl="${agent.imageUrl}"
                ></yp-agent-chip></div>`;
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
                                : 'Failed to select agent';
                            console.error(`Failed to select agent: ${errorMessage}`);
                            return {
                                success: false,
                                data: errorMessage,
                                error: errorMessage,
                            };
                        }
                    },
                },
            ],
            allowedTransitions: ['agent_configuration', 'agent_operations'],
        };
    }
}
