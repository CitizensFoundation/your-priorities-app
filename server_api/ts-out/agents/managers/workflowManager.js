import { YpWorkflow } from "../models/workflow.js";
export class WorkflowManager {
    constructor() { }
    async createWorkflow(data) {
        try {
            const workflow = await YpWorkflow.create({
                agentProductId: data.agentProductId,
                userId: data.userId || null,
                configuration: data.configuration || {},
            });
            return workflow;
        }
        catch (error) {
            throw new Error(`Error creating workflow: ${error.message}`);
        }
    }
    async getWorkflow(workflowId) {
        try {
            const workflow = await YpWorkflow.findByPk(workflowId);
            return workflow;
        }
        catch (error) {
            throw new Error(`Error retrieving workflow: ${error.message}`);
        }
    }
    async updateWorkflow(workflowId, updates) {
        try {
            const workflow = await YpWorkflow.findByPk(workflowId);
            if (!workflow) {
                throw new Error("Workflow not found");
            }
            Object.assign(workflow, updates);
            await workflow.save();
            return workflow;
        }
        catch (error) {
            throw new Error(`Error updating workflow: ${error.message}`);
        }
    }
    async connectToWorkflow(workflowId, connectionData) {
        try {
            const workflow = await YpWorkflow.findByPk(workflowId);
            if (!workflow) {
                throw new Error("Workflow not found");
            }
            workflow.configuration = { ...workflow.configuration, ...connectionData };
            await workflow.save();
            return workflow;
        }
        catch (error) {
            throw new Error(`Error connecting to workflow: ${error.message}`);
        }
    }
    async getWorkflowsForUser(userId) {
        try {
            const workflows = await YpWorkflow.findAll({ where: { userId } });
            return workflows;
        }
        catch (error) {
            throw new Error(`Error retrieving workflows for user ${userId}: ${error.message}`);
        }
    }
    async getRunningWorkflowsForUser(userId) {
        try {
            const allWorkflows = await this.getWorkflowsForUser(userId);
            const runningWorkflows = allWorkflows.filter((workflow) => {
                return (workflow.configuration &&
                    workflow.configuration.running === true);
            });
            return runningWorkflows;
        }
        catch (error) {
            throw new Error(`Error retrieving running workflows for user ${userId}: ${error.message}`);
        }
    }
}
