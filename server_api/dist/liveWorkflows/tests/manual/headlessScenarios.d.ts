import type { UsageReservation } from "../../budget.js";
import { type ManualHarness } from "./harness.js";
import type { HeadlessCase } from "./headlessCases.js";
export declare const mixedFixturePath: string;
export declare const exportFixturePath: string;
export declare function save(directory: string, name: string, contents: string | Buffer): Promise<void>;
export declare function upload(harness: ManualHarness, filename: string, signal?: AbortSignal): Promise<{
    asset: YpWorkflowAsset;
    raw: unknown;
}>;
export declare function download(harness: ManualHarness, asset: YpWorkflowAsset, signal?: AbortSignal): Promise<Buffer<ArrayBuffer>>;
export declare function chat(harness: ManualHarness, prompt: string, directory: string, turn: number, signal?: AbortSignal): Promise<void>;
export declare function waitRun(harness: ManualHarness, id?: string, expected?: string, signal?: AbortSignal): Promise<{
    run: YpWorkflowRun;
    snapshot: YpWorkflowSnapshot;
}>;
export declare function ledger(harness: ManualHarness, run: YpWorkflowRun): Promise<UsageReservation[]>;
export declare function results(harness: ManualHarness, run: YpWorkflowRun, directory: string, full: boolean, signal?: AbortSignal): Promise<{
    rows: unknown[];
    downloads: {
        name: string;
        checksum: string;
        bytes: number;
    }[];
}>;
export declare function runHeadlessCase(name: HeadlessCase, harness: ManualHarness, directory: string, signal?: AbortSignal): Promise<{
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
} | {
    runId: string;
    nodeIds: string[];
    sourceHash: string;
    processingCalls: number;
    codexTurns: number;
    codexCapabilities: {
        operation: string;
        status: number;
    }[];
    downloads: {
        name: string;
        checksum: string;
        bytes: number;
    }[];
} | {
    runId: string;
    processingCalls: number;
    downloads: {
        name: string;
        checksum: string;
        bytes: number;
    }[];
    parents: number;
    records: number;
    splitChildren: number;
    unknown: number;
} | {
    runId: string;
    processingCalls: number;
    pauseResume: boolean;
    paidCallsReplayed: number;
    refusedBulkBeforeTrial: boolean;
    refusedMissingApproval: boolean;
    refusedExcessBudget: boolean;
    refusedStaleApproval: boolean;
    remainingTrialMicros: number;
    estimate: YpWorkflowEstimate;
    downloads: {
        name: string;
        checksum: string;
        bytes: number;
    }[];
}>;
