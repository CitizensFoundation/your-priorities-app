import { BaseAssistantMode } from './baseAssistantMode.js';
import { ToolExecutionResult } from '../baseAssistant.js';
import { ChatbotMode } from '../baseAssistant.js';
import { YpAgentAssistant } from '../agentAssistant.js';

export class AgentOperationsMode extends BaseAssistantMode {
  constructor(assistant: YpAgentAssistant) {
    super(assistant);
  }

  public getMode(): ChatbotMode {
    return {
      name: 'agent_operations',
      description: 'Manage the selected agentProduct operations',
      systemPrompt: `You are the Agent Operations Assistant. Help the user manage the selected agent's operations.
Available commands:
- Start/stop agent
- Get current status
- Handle engagement requests
- Show workflow
- Show workflow step details
Current agent status and workflow state are provided via functions.
${this.renderCommon()}
${this.renderAllAgentsStatus()}
${this.renderCurrentAgent()}
${this.renderCurrentWorkflowStatus()}`,

      functions: [
        {
          name: 'run_agent_next_workflow_step',
          description: "Run the next step in the selected agent's workflow",
          type: 'function',
          parameters: {
            type: 'object',
            properties: {
              agentProductId: { type: 'number' },
            },
            required: ['agentProductId'],
          },
          handler: async (params): Promise<ToolExecutionResult> => {
            params = this.assistant.getCleanedParams(params);

            try {
              if (!this.currentAgentId) {
                throw new Error('No agent selected');
              }

              const result = await this.runAgentNextWorkflowStep(
                this.currentAgentId,
                params.configuration
              );
              return {
                success: true,
                data: result,
              };
            } catch (error) {
              const errorMessage =
                error instanceof Error
                  ? error.message
                  : 'Failed to start agent';
              console.error(
                `Failed to start agent: ${errorMessage}`
              );
              return {
                success: false,
                data: errorMessage,
                error: errorMessage,
              };
            }
          },
        },
        {
          name: 'show_engagement_group',
          description: 'Show group for human engagement',
          type: 'function',
          parameters: {
            type: 'object',
            properties: {
              groupId: { type: 'number' },
            },
            required: ['groupId'],
          },
          handler: async (params): Promise<ToolExecutionResult> => {
            params = this.assistant.getCleanedParams(params);

            console.log(
              `handler: show_engagement_group: ${JSON.stringify(
                params,
                null,
                2
              )}`
            );
            try {
              // Create HTML element for group
              const html = `<div class="group-container"><yp-group
                .groupId="${params.groupId}"
                .configuration="${JSON.stringify(params.configuration)}"
              ></yp-group></div>`;

              return {
                success: true,
                html,
                data: {
                  groupId: params.groupId,
                },
              };
            } catch (error) {
              const errorMessage =
                error instanceof Error
                  ? error.message
                  : 'Failed to show group';
              console.error(
                `Failed to show group: ${errorMessage}`
              );
              return {
                success: false,
                data: errorMessage,
                error: errorMessage,
              };
            }
          },
        },
        {
          name: 'stop_agent',
          description: 'Stop the currently running agent',
          type: 'function',
          parameters: {
            type: 'object',
            properties: {
              reason: { type: 'string' },
            },
          },
          handler: async (params): Promise<ToolExecutionResult> => {
            params = this.assistant.getCleanedParams(params);

            console.log(
              `handler: stop_agent: ${JSON.stringify(params, null, 2)}`
            );
            try {
              if (!this.currentAgentId) {
                throw new Error('No agent selected');
              }

              const result = await this.stopAgent(
                this.currentAgentId,
                params.reason
              );
              return {
                success: true,
                data: {
                  agentId: this.currentAgentId,
                  stopTime: new Date().toISOString(),
                  finalStatus: result.status,
                },
                metadata: {
                  reason: params.reason,
                },
              };
            } catch (error) {
              const errorMessage =
                error instanceof Error
                  ? error.message
                  : 'Failed to stop agent';
              console.error(
                `Failed to stop agent: ${errorMessage}`
              );
              return {
                success: false,
                data: errorMessage,
                error: errorMessage,
              };
            }
          },
        },
        {
          name: 'show_workflow_for_selected_agent',
          description: 'Display the workflow for the selected agent',
          type: 'function',
          parameters: {
            type: 'object',
            properties: {
              agentProductId: { type: 'number' },
            },
            required: ['agentProductId'],
          },
          handler: async (params): Promise<ToolExecutionResult> => {
            params = this.assistant.getCleanedParams(params);

            console.log(
              `handler: show_workflow: ${JSON.stringify(params, null, 2)}`
            );
            try {
              if (!params.agentProductId) {
                throw new Error('No agent selected');
              }

              const workflow = await this.getWorkflowStatus(
                params.agentProductId
              );

              // Create visualization HTML
              const html = `<div class="group-container"><yp-group
                  minimizeWorkflow="${true}"
                  collectionId="43"
                ></yp-group></div>`;

              return {
                success: true,
                html,
                data: { workFlowFound: true, workFlowDisplayed: true },
                metadata: {
                  lastUpdated: new Date().toISOString(),
                  includesHistory: params.includeHistory,
                  showingDetails: params.showDetails,
                },
              };
            } catch (error) {
              const errorMessage =
                error instanceof Error
                  ? error.message
                  : 'Failed to show workflow';
              console.error(
                `Failed to show workflow: ${errorMessage}`
              );
              return {
                success: false,
                data: errorMessage,
                error: errorMessage,
              };
            }
          },
        },
        {
          name: 'get_workflow_step_details',
          description:
            'Get detailed information about a specific workflow step',
          type: 'function',
          parameters: {
            type: 'object',
            properties: {
              stepId: { type: 'number' },
              includeArtifacts: { type: 'boolean' },
            },
            required: ['stepId'],
          },
          handler: async (params): Promise<ToolExecutionResult> => {
            console.log(
              `handler: get_workflow_step_details: ${JSON.stringify(
                params,
                null,
                2
              )}`
            );
            try {
              if (!this.currentAgentId) {
                throw new Error('No agent selected');
              }

              const stepDetails = await this.getWorkflowStepDetails(
                this.currentAgentId,
                params.stepId,
                params.includeArtifacts
              );

              return {
                success: true,
                data: {
                  step: stepDetails,
                },
                metadata: {
                  requestedAt: new Date().toISOString(),
                  includesArtifacts: params.includeArtifacts,
                },
              };
            } catch (error) {
              const errorMessage =
                error instanceof Error
                  ? error.message
                  : 'Failed to get step details';
              console.error(
                `Failed to get step details: ${errorMessage}`
              );
              return {
                success: false,
                data: errorMessage,
                error: errorMessage,
              };
            }
          },
        },
      ],
      allowedTransitions: ['agent_subscription_and_selection','agent_direct_conversation'],
    };
  }
}
