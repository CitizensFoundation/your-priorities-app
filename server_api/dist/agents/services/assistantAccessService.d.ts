import { LOCK, Transaction } from "sequelize";
import { YpAgentProductRun } from "../models/agentProductRun.js";
import { YpSubscription } from "../models/subscription.js";
export type AssistantRunTransitionStatus = "completed" | "failed";
export type AssistantRunTransitionResult = {
    outcome: "not_found";
} | {
    outcome: "conflict";
} | {
    outcome: "updated";
    workflow: YpAgentRunWorkflowConfiguration;
    status: YpAgentProductRunStatus;
};
interface OwnedRunOptions {
    userId: number;
    runId: number;
    domainId?: number;
    groupId?: number;
    agentId?: number;
    requireCurrentAgent?: boolean;
    transaction?: Transaction;
    lock?: LOCK;
}
interface TransitionOwnedRunOptions extends Omit<OwnedRunOptions, "requireCurrentAgent" | "transaction" | "lock"> {
    groupId: number;
    agentId: number;
    expectedCurrentStepIndex: number;
    status: AssistantRunTransitionStatus;
}
export declare const parsePositiveInteger: (value: unknown) => number | null;
export declare const isUuid: (value: unknown) => value is string;
export declare const buildAssistantMemoryRedisKey: (domainValue: unknown, clientMemoryUuid: unknown) => string | null;
export declare class AssistantAccessService {
    getOwnedSubscription(userId: number, subscriptionId: number, domainId: number): Promise<YpSubscription | null>;
    getOwnedRun(options: OwnedRunOptions): Promise<YpAgentProductRun | null>;
    transitionOwnedRun(options: TransitionOwnedRunOptions): Promise<AssistantRunTransitionResult>;
}
export {};
