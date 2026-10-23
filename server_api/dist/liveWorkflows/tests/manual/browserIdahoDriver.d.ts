import type { ManualConfig } from "./environment.js";
import { type ManualHarness } from "./harness.js";
import { type prepareIdahoData } from "./idahoData.js";
import type { BrowserEvidence } from "./interactiveBrowser.js";
export declare function driveBrowserIdaho(harness: ManualHarness, config: ManualConfig, data: Awaited<ReturnType<typeof prepareIdahoData>>, evidence: BrowserEvidence, output: string, headed: boolean, signal: AbortSignal, research?: boolean): Promise<{
    checks: string[];
    downloads: {
        id: string;
        name: string;
        path: string;
        checksum: string;
    }[];
    trialRunId: string;
    estimatedRunId: string;
    quality: {
        sampledParents: number;
        outputRecords: number;
        unknown: number;
        allSevenAnalyses: boolean;
        reviewedRewrites: boolean;
    };
    valueVerification: {
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
    researchVerification: {
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
    } | undefined;
    trialRecords: number;
    population: number;
    bulkApproved: boolean;
    workbook: string;
    estimate: YpWorkflowEstimate;
    actualProcessingMicros: number;
    codexEstimatedMicros: number | null;
    realBrowser: string;
}>;
