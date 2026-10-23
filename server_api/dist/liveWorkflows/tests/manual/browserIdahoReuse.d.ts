import { type ManualHarness } from "./harness.js";
/** Real UI enables research and explicitly reuses a completed non-web trial.
 * No credential or graph mutation travels through a fixture-only route. */
export declare function driveBrowserIdahoReuse(harness: ManualHarness, sourceRunId: string, output: string, headed: boolean, signal: AbortSignal): Promise<{
    passed: boolean;
    checks: string[];
    runId: string;
    sourceRunId: string;
    reuse: {
        runId: string;
        fromNodeId: string;
        nodeIds: string[];
        historicalMicros: number;
    } | undefined;
    incrementalProcessingMicros: number;
    research: {
        passed: boolean;
        quotesVerified: number;
        issues: string[];
        known: number;
        unknown: number;
        findings: {
            recordId: string;
            name: string;
            nodeId: string;
            status: unknown;
            citations: number;
            sources: number;
            gaps: unknown[];
            review: unknown;
            limits: unknown;
        }[];
    };
    values: {
        passed: boolean;
        records: number;
        checks: number;
        rawResponses: number;
        populatedFindings: number;
        verifiedQuotes: number;
        masterColumns: number;
        missingOrChangedValues: {
            recordId: string | null;
            field: string;
            expected: unknown;
            actual: unknown;
        }[];
        excelLineEndingNormalizations: {
            recordId: string;
            field: string;
        }[];
        unknownFindings: {
            recordId: string;
            field: string;
            reason: string;
        }[];
        note: string;
    };
    bulkApproved: boolean;
}>;
