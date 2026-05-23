import { YpWorkflowConversation } from "../models/workflowConversation.js";
export declare class WorkflowConversationManager {
    constructor();
    createWorkflowConversation(data: {
        agentProductId: number;
        userId?: number;
        configuration?: Record<string, any>;
    }): Promise<YpWorkflowConversation>;
    getWorkflowConversation(workflowConversationId: number): Promise<YpWorkflowConversation | null>;
    updateWorkflowConversation(workflowConversationId: number, updates: Record<string, any>): Promise<YpWorkflowConversation>;
    connectToWorkflowConversation(workflowConversationId: number, connectionData: Record<string, any>): Promise<YpWorkflowConversation>;
    getWorkflowConversationsForUser(userId: number): Promise<YpWorkflowConversation[]>;
    getRunningWorkflowConversationsForUser(userId: number): Promise<YpWorkflowConversation[]>;
}
