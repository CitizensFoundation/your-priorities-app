import { YpWorkflowConversation } from "../models/workflowConversation.js";
export class WorkflowConversationManager {
    constructor() { }
    async createWorkflowConversation(data) {
        try {
            const workflow = await YpWorkflowConversation.create({
                agentProductId: data.agentProductId,
                userId: data.userId || null,
                configuration: data.configuration || {},
            });
            return workflow;
        }
        catch (error) {
            throw new Error(`Error creating workflow conversation: ${error.message}`);
        }
    }
    async getWorkflowConversation(workflowConversationId) {
        try {
            const workflowConversation = await YpWorkflowConversation.findByPk(workflowConversationId);
            return workflowConversation;
        }
        catch (error) {
            throw new Error(`Error retrieving workflow conversation: ${error.message}`);
        }
    }
    async updateWorkflowConversation(workflowConversationId, updates) {
        try {
            const workflowConversation = await YpWorkflowConversation.findByPk(workflowConversationId);
            if (!workflowConversation) {
                throw new Error("Workflow conversation not found");
            }
            Object.assign(workflowConversation, updates);
            await workflowConversation.save();
            return workflowConversation;
        }
        catch (error) {
            throw new Error(`Error updating workflow conversation: ${error.message}`);
        }
    }
    async connectToWorkflowConversation(workflowConversationId, connectionData) {
        try {
            const workflowConversation = await YpWorkflowConversation.findByPk(workflowConversationId);
            if (!workflowConversation) {
                throw new Error("Workflow conversation not found");
            }
            workflowConversation.configuration = {
                ...workflowConversation.configuration,
                ...connectionData,
            };
            await workflowConversation.save();
            return workflowConversation;
        }
        catch (error) {
            throw new Error(`Error connecting to workflow: ${error.message}`);
        }
    }
    async getWorkflowConversationsForUser(userId) {
        try {
            const workflowConversations = await YpWorkflowConversation.findAll({ where: { userId } });
            return workflowConversations;
        }
        catch (error) {
            throw new Error(`Error retrieving workflow conversations for user ${userId}: ${error.message}`);
        }
    }
    async getRunningWorkflowConversationsForUser(userId) {
        try {
            const allWorkflowConversations = await this.getWorkflowConversationsForUser(userId);
            const runningWorkflowConversations = allWorkflowConversations.filter((workflowConversation) => {
                return (workflowConversation.configuration &&
                    workflowConversation.configuration.running === true);
            });
            return runningWorkflowConversations;
        }
        catch (error) {
            throw new Error(`Error retrieving running workflows for user ${userId}: ${error.message}`);
        }
    }
}
