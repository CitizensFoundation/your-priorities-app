import type { UsageReservation } from "../../budget.js";
import type { ManualHarness } from "./harness.js";
export declare function verifyResumeLedger(before: UsageReservation[], after: UsageReservation[], records: number): void;
export declare function approvedBulk(harness: ManualHarness, directory: string, signal?: AbortSignal): Promise<{
    trialRunId: string;
    bulkRunId: string;
    trialRecords: number;
    bulkRecords: number;
    bulkIncludesTrialRecords: boolean;
    trialSpentMicros: number;
    bulkSpentMicros: number;
    processingCalls: number;
    codexTurns: number;
    codexCapabilities: {
        operation: string;
        status: number;
    }[];
    sourceHash: string;
    nodeIds: string[];
    estimate: YpWorkflowEstimate;
    actualToExpectedRatio: number;
    actualWithinEstimateUpper: boolean;
    approvedBudgetMicros: number;
    interruption: {
        containerId: string;
        executionId: string | undefined;
        spentMicros: number;
        checksum: string;
        records: number;
    };
    paidCallsReplayed: number;
    refusedMissingApproval: boolean;
    resumedWithSameApproval: boolean;
    downloads: {
        name: string;
        checksum: string;
        bytes: number;
    }[];
    records: number;
    tasks: string[];
}>;
