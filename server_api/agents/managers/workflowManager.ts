import { YpWorkflow } from "../models/workflow.js";

export class WorkflowManager {
  constructor() {}

  async createWorkflow(data: {
    agentProductId: number;
    userId?: number;
    configuration?: Record<string, any>;
  }): Promise<YpWorkflow> {
    try {
      const workflow = await (YpWorkflow as any).create({
        agentProductId: data.agentProductId,
        userId: data.userId || null,
        configuration: data.configuration || {},
      });
      return workflow;
    } catch (error: any) {
      throw new Error(`Error creating workflow: ${error.message}`);
    }
  }

  async getWorkflow(workflowId: number): Promise<YpWorkflow | null> {
    try {
      const workflow = await (YpWorkflow as any).findByPk(workflowId);
      return workflow;
    } catch (error: any) {
      throw new Error(`Error retrieving workflow: ${error.message}`);
    }
  }

  async updateWorkflow(
    workflowId: number,
    updates: Record<string, any>
  ): Promise<YpWorkflow> {
    try {
      const workflow = await (YpWorkflow as any).findByPk(workflowId);
      if (!workflow) {
        throw new Error("Workflow not found");
      }
      Object.assign(workflow, updates);
      await workflow.save();
      return workflow;
    } catch (error: any) {
      throw new Error(`Error updating workflow: ${error.message}`);
    }
  }

  async connectToWorkflow(
    workflowId: number,
    connectionData: Record<string, any>
  ): Promise<YpWorkflow> {
    try {
      const workflow = await (YpWorkflow as any).findByPk(workflowId);
      if (!workflow) {
        throw new Error("Workflow not found");
      }
      workflow.configuration = { ...workflow.configuration, ...connectionData };
      await workflow.save();
      return workflow;
    } catch (error: any) {
      throw new Error(`Error connecting to workflow: ${error.message}`);
    }
  }

  async getWorkflowsForUser(userId: number): Promise<YpWorkflow[]> {
    try {
      const workflows = await (YpWorkflow as any).findAll({ where: { userId } });
      return workflows;
    } catch (error: any) {
      throw new Error(
        `Error retrieving workflows for user ${userId}: ${error.message}`
      );
    }
  }

  async getRunningWorkflowsForUser(userId: number): Promise<YpWorkflow[]> {
    try {
      const allWorkflows = await this.getWorkflowsForUser(userId);
      const runningWorkflows = allWorkflows.filter((workflow: YpWorkflow) => {
        return (
          workflow.configuration &&
          workflow.configuration.running === true
        );
      });
      return runningWorkflows;
    } catch (error: any) {
      throw new Error(
        `Error retrieving running workflows for user ${userId}: ${error.message}`
      );
    }
  }
}