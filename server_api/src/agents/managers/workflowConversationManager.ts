import { YpWorkflowConversation } from "../models/workflowConversation.js";

export class WorkflowConversationManager {
  constructor() {}

  async createWorkflowConversation(data: {
    agentProductId: number;
    userId?: number;
    configuration?: Record<string, any>;
  }): Promise<YpWorkflowConversation> {
    try {
      const workflow = await (YpWorkflowConversation as any).create({
        agentProductId: data.agentProductId,
        userId: data.userId || null,
        configuration: data.configuration || {},
      });
      return workflow;
    } catch (error: any) {
      throw new Error(`Error creating workflow conversation: ${error.message}`);
    }
  }

  async getWorkflowConversation(
    workflowConversationId: number
  ): Promise<YpWorkflowConversation | null> {
    try {
      const workflowConversation = await (
        YpWorkflowConversation as any
      ).findByPk(workflowConversationId);
      return workflowConversation;
    } catch (error: any) {
      throw new Error(
        `Error retrieving workflow conversation: ${error.message}`
      );
    }
  }

  async updateWorkflowConversation(
    workflowConversationId: number,
    updates: Record<string, any>
  ): Promise<YpWorkflowConversation> {
    try {
      const workflowConversation = await (
        YpWorkflowConversation as any
      ).findByPk(workflowConversationId);
      if (!workflowConversation) {
        throw new Error("Workflow conversation not found");
      }
      Object.assign(workflowConversation, updates);
      await workflowConversation.save();
      return workflowConversation;
    } catch (error: any) {
      throw new Error(`Error updating workflow conversation: ${error.message}`);
    }
  }

  async connectToWorkflowConversation(
    workflowConversationId: number,
    connectionData: Record<string, any>
  ): Promise<YpWorkflowConversation> {
    try {
      const workflowConversation = await (
        YpWorkflowConversation as any
      ).findByPk(workflowConversationId);
      if (!workflowConversation) {
        throw new Error("Workflow conversation not found");
      }
      workflowConversation.configuration = {
        ...workflowConversation.configuration,
        ...connectionData,
      };
      await workflowConversation.save();
      return workflowConversation;
    } catch (error: any) {
      throw new Error(`Error connecting to workflow: ${error.message}`);
    }
  }

  async getWorkflowConversationsForUser(
    userId: number
  ): Promise<YpWorkflowConversation[]> {
    try {
      const workflowConversations = await (
        YpWorkflowConversation as any
      ).findAll({ where: { userId } });
      return workflowConversations;
    } catch (error: any) {
      throw new Error(
        `Error retrieving workflow conversations for user ${userId}: ${error.message}`
      );
    }
  }

  async getRunningWorkflowConversationsForUser(
    userId: number
  ): Promise<YpWorkflowConversation[]> {
    try {
      const allWorkflowConversations =
        await this.getWorkflowConversationsForUser(userId);
      const runningWorkflowConversations = allWorkflowConversations.filter(
        (workflowConversation: YpWorkflowConversation) => {
          return (
            workflowConversation.configuration &&
            workflowConversation.configuration.running === true
          );
        }
      );
      return runningWorkflowConversations;
    } catch (error: any) {
      throw new Error(
        `Error retrieving running workflows for user ${userId}: ${error.message}`
      );
    }
  }
}
