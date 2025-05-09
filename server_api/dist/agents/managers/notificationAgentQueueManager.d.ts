import { Queue } from "bullmq";
import { Redis } from "ioredis";
import { AgentQueueManager } from "@policysynth/agents/operations/agentQueueManager.js";
import { PsAgent } from "@policysynth/agents/dbModels/agent.js";
import WebSocket from "ws";
import { YpAgentProductRun } from "../models/agentProductRun.js";
export declare class NotificationAgentQueueManager extends AgentQueueManager {
    redisClient: Redis;
    queues: Map<string, Queue>;
    wsClients: Map<string, WebSocket>;
    constructor(wsClients: Map<string, WebSocket>);
    sendNotification(agent: PsAgent, agentRun: YpAgentProductRun, action: string, wsClientId: string, status: string, result: any, agentRunId?: number, updatedWorkflow?: YpAgentRunWorkflowConfiguration): Promise<void>;
    sendNotificationEmail(agent: PsAgent, agentRun: YpAgentProductRun, updatedWorkflow: YpAgentRunWorkflowConfiguration): Promise<void>;
    goBackOneWorkflowStepIfNeeded(agentRunId: number, status: string, wsClientId: string, currentWorkflowStepIndex?: number | undefined): Promise<void>;
    advanceWorkflowStepOrCompleteAgentRun(agentRunId: number, status: string, wsClientId: string, currentWorkflowStepIndex?: number | undefined): Promise<YpAgentRunWorkflowConfiguration | undefined>;
    static getAgentRun(agentRunId: number): Promise<YpAgentProductRun | null>;
    getQueue(queueName: string): Queue;
    controlAgent(agentId: number, action: string): Promise<string>;
    startAgentProcessingWithWsClient(agentId: number, agentRunId: number, wsClientId: string, structuredAnswersOverrides?: YpStructuredAnswer[]): Promise<string | undefined>;
    stopAgentProcessing(agentId: number, wsClientId: string, agentRunId: number): Promise<boolean>;
    getAgentStatus(agentId: number): Promise<PsAgentStatus | null>;
    updateAgentStatus(agentId: number, state: PsAgentStatus["state"], progress?: number, message?: string, details?: Record<string, any>): Promise<boolean>;
}
