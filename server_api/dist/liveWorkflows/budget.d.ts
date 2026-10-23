import type { WorkflowStore, WorkflowTransaction } from "./store.js";
export interface UsageReservation extends YpWorkflowUsage {
    recordId?: string;
    fingerprint: string;
    result?: YpWorkflowJson;
    createdAt: string;
}
export declare class BudgetService {
    private readonly store;
    constructor(store: WorkflowStore);
    reserve(groupId: number, input: {
        id: string;
        runId: string;
        nodeId: string;
        recordId?: string;
        maximumMicros: number;
        request: unknown;
        description: string;
        creditUsage?: Omit<YpWorkflowCreditUsage, "actualCredits">;
        requestLimit?: {
            key: string;
            maximum: number;
        };
    }): Promise<{
        reservation: UsageReservation;
        cached: boolean;
    }>;
    settle(groupId: number, id: string, actualMicros: number, result: YpWorkflowJson, reconcile?: boolean): Promise<void>;
    unknown(groupId: number, id: string): Promise<void>;
    /** After restart, never resend a request which may already have been billed. */
    recover(groupId: number, now?: number): Promise<void>;
}
export declare function estimateFromTrial(trial: YpWorkflowRun, populationCount: number): YpWorkflowEstimate;
/** Progress-based projection, never used to authorize spending. Work already
 * in flight may be included in observed averages, so this errs upward. */
export declare function remainingForecast(run: YpWorkflowRun): NonNullable<YpWorkflowRun["forecast"]>;
/** Forecast only remaining work on an already-processed bulk population. The
 * evidence still comes from a fresh full trial, never a discounted reused trial. */
export declare function estimateRemainingStages(trial: YpWorkflowRun, population: number, reusedNodeIds: string[]): YpWorkflowEstimate;
export declare function requireRun(tx: WorkflowTransaction, id: string): Promise<YpWorkflowRun>;
