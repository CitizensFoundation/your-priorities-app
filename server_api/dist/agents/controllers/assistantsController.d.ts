import express from "express";
import WebSocket from "ws";
import { YpAgentAssistant } from "../assistants/agentAssistant.js";
interface YpRequest extends express.Request<Record<string, string>> {
    ypDomain?: any;
    ypCommunity?: any;
    sso?: any;
    redisClient?: any;
    user?: any;
    clientAppPath?: string;
    adminAppPath?: string;
    dirName?: string;
    useNewVersion?: boolean;
}
export declare class AssistantController {
    path: string;
    router: import("express-serve-static-core").Router;
    wsClients: Map<string, WebSocket>;
    chatAssistantInstances: Map<string, YpAgentAssistant>;
    voiceAssistantInstances: Map<string, YpAgentAssistant>;
    private assistantSocketCleanupHandlers;
    private agentQueueManager;
    private workflowConversationManager;
    private assistantAccessService;
    constructor(wsClients: Map<string, WebSocket>);
    initializeModels: () => Promise<void>;
    initializeRoutes(): void;
    private getLastStatusMessageFromDB;
    private getDocxReport;
    private advanceOrStopCurrentWorkflowStep;
    getAgentConfigurationAnswers: (req: YpRequest, res: express.Response) => Promise<void>;
    private getUpdatedWorkflow;
    private submitAgentConfiguration;
    private updateAssistantMemoryLoginStatus;
    private defaultStartAgentMode;
    private getMemoryRedisKey;
    private loadMemoryWithOwnership;
    private clearChatLog;
    private getMemory;
    private cleanupAssistantForMemory;
    private registerAssistantSocketCleanup;
    private startVoiceSession;
    private sendChatMessage;
    private getRunningWorkflowConversations;
    private getAllWorkflowConversations;
    private connectToWorkflowConversation;
}
export {};
