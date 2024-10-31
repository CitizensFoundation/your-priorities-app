import { YpBaseAssistant } from "./baseAssistant.js";
export class YpAgentAssistant extends YpBaseAssistant {
    defineAvailableModes() {
        return [
            {
                name: "agent_selection",
                systemPrompt: `You are an AI agent assistant. Help users select and manage their AI agents.
Available commands:
- List available agents
- Check running agents
- Select an agent to work with
- Get agent status
Current system status and available agents are provided via functions.`,
                description: "Browse and select available agents",
                functions: [
                    {
                        name: "get_agent_status",
                        description: "Get status of all available and running agents",
                        parameters: {
                            type: "object",
                            properties: {
                                includeDetails: { type: "boolean" },
                            },
                        },
                        resultSchema: {
                            type: "object",
                            properties: {
                                availableAgents: { type: "array", items: { type: "object" } },
                                runningAgents: { type: "array", items: { type: "object" } },
                                systemStatus: { type: "object" },
                            },
                        },
                        handler: async () => {
                            try {
                                const status = await this.loadAgentStatus();
                                return {
                                    success: true,
                                    data: status,
                                    metadata: {
                                        timestamp: new Date().toISOString(),
                                    },
                                };
                            }
                            catch (error) {
                                return {
                                    success: false,
                                    error: error instanceof Error
                                        ? error.message
                                        : "Failed to load agent status",
                                };
                            }
                        },
                    },
                    {
                        name: "select_agent",
                        description: "Select an agent to work with",
                        parameters: {
                            type: "object",
                            properties: {
                                agentId: { type: "number" },
                            },
                            required: ["agentId"],
                        },
                        handler: async (params) => {
                            try {
                                const agent = await this.validateAndSelectAgent(params.agentId);
                                const requiredQuestions = await this.getRequiredQuestions(params.agentId);
                                this.currentAgentId = params.agentId;
                                // If we have unanswered required questions, switch to configuration mode
                                if (requiredQuestions && requiredQuestions.length > 0) {
                                    await this.handleModeSwitch("agent_configuration", "Required questions need to be answered");
                                }
                                else {
                                    await this.handleModeSwitch("agent_operations", "Agent ready for operations");
                                }
                                return {
                                    success: true,
                                    data: {
                                        agent,
                                        hasRequiredQuestions: requiredQuestions && requiredQuestions.length > 0,
                                    },
                                };
                            }
                            catch (error) {
                                return {
                                    success: false,
                                    error: error instanceof Error
                                        ? error.message
                                        : "Failed to select agent",
                                };
                            }
                        },
                    },
                ],
                allowedTransitions: ["agent_configuration", "agent_operations"],
            },
            {
                name: "agent_configuration",
                systemPrompt: `Help the user configure the selected agent by collecting required information.
Review the required questions and guide the user through answering them.`,
                description: "Configure agent parameters and requirements",
                functions: [
                    {
                        name: "show_question_form",
                        description: "Display form for required questions",
                        parameters: {
                            type: "object",
                            properties: {
                                agentId: { type: "number" },
                            },
                            required: ["agentId"],
                        },
                        handler: async (params) => {
                            try {
                                const questions = await this.getRequiredQuestions(params.agentId);
                                // Create HTML element for questions
                                const formHtml = `<yp-structured-questions
                  .questions="${JSON.stringify(questions)}"
                  @questions-submitted="${this.handleQuestionsSubmitted}"
                ></yp-structured-questions>`;
                                return {
                                    success: true,
                                    data: {
                                        questions,
                                        formHtml,
                                    },
                                };
                            }
                            catch (error) {
                                return {
                                    success: false,
                                    error: error instanceof Error
                                        ? error.message
                                        : "Failed to show questions",
                                };
                            }
                        },
                    },
                ],
                allowedTransitions: ["agent_operations"],
            },
            {
                name: "agent_operations",
                systemPrompt: `Help the user manage the selected agent's operations.
Available commands:
- Start/stop agent
- Get current status
- Handle engagement requests
Current agent status and workflow state are provided via functions.`,
                description: "Manage agent operations",
                functions: [
                    {
                        name: "start_agent",
                        description: "Start the selected agent",
                        parameters: {
                            type: "object",
                            properties: {
                                configuration: { type: "object" },
                            },
                        },
                        handler: async (params) => {
                            try {
                                if (!this.currentAgentId) {
                                    throw new Error("No agent selected");
                                }
                                const result = await this.startAgent(this.currentAgentId, params.configuration);
                                return {
                                    success: true,
                                    data: result,
                                };
                            }
                            catch (error) {
                                return {
                                    success: false,
                                    error: error instanceof Error
                                        ? error.message
                                        : "Failed to start agent",
                                };
                            }
                        },
                    },
                    {
                        name: "show_engagement_group",
                        description: "Show group for human engagement",
                        parameters: {
                            type: "object",
                            properties: {
                                groupId: { type: "number" },
                                configuration: { type: "object" },
                            },
                            required: ["groupId"],
                        },
                        handler: async (params) => {
                            try {
                                // Create HTML element for group
                                const groupHtml = `<yp-group
                  .groupId="${params.groupId}"
                  .configuration="${JSON.stringify(params.configuration)}"
                ></yp-group>`;
                                return {
                                    success: true,
                                    data: {
                                        groupId: params.groupId,
                                        groupHtml,
                                    },
                                };
                            }
                            catch (error) {
                                return {
                                    success: false,
                                    error: error instanceof Error
                                        ? error.message
                                        : "Failed to show group",
                                };
                            }
                        },
                    },
                ],
                allowedTransitions: ["agent_selection"],
            },
        ];
    }
    async loadAgentStatus() {
        // Implement Redis loading logic
        const status = await this.redis.get("agent_status");
        return status
            ? JSON.parse(status)
            : {
                availableAgents: [],
                runningAgents: [],
                systemStatus: {
                    healthy: true,
                    lastUpdated: new Date(),
                },
            };
    }
    async validateAndSelectAgent(agentId) {
        // Implement agent validation logic
        const status = await this.loadAgentStatus();
        const agent = status.availableAgents.find((a) => a.id === agentId);
        if (!agent) {
            throw new Error("Agent not found or not available");
        }
        return agent;
    }
    async getRequiredQuestions(agentId) {
        // Implement required questions loading logic
        const key = `agent:${agentId}:required_questions`;
        const questions = await this.redis.get(key);
        return questions ? JSON.parse(questions) : [];
    }
    async startAgent(agentId, configuration) {
        // Implement agent start logic
        // You'll need to implement this based on your backend API
        return { status: "started", agentId };
    }
    async handleQuestionsSubmitted(event) {
        const answers = event.detail;
        if (this.currentAgentId) {
            await this.redis.set(`agent:${this.currentAgentId}:answers`, JSON.stringify(answers));
            await this.handleModeSwitch("agent_operations", "Configuration completed");
        }
    }
}
