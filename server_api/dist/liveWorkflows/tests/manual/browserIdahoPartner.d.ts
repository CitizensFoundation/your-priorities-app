import type { ManualConfig } from "./environment.js";
import { type ManualHarness } from "./harness.js";
import { type PartnerData } from "./idahoPartner.js";
import type { BrowserEvidence } from "./interactiveBrowser.js";
export declare function driveBrowserIdahoPartner(harness: ManualHarness, config: ManualConfig, data: PartnerData, evidence: BrowserEvidence, output: string, headed: boolean, signal: AbortSignal): Promise<{
    checks: string[];
    downloads: {
        id: string;
        name: string;
        path: string;
        checksum: string;
    }[];
    trialRunId: string;
    quality: {
        records: number;
        analyzed: number;
        acceptedRewrites: number;
        needsReview: number;
        researchChecks: number;
        unresolvedResearchChecks: number;
        recordsWithResearchGaps: number;
        note: string;
        rows: {
            id: string;
            name: string;
            errors: unknown;
            allSevenAnalysesPresent: boolean;
            rewriteAccepted: boolean;
            feedback: string | null;
            failedChecks: {
                name: string;
                passed: boolean;
                reason?: string;
            }[];
            researchChecks: number;
            unresolvedResearchChecks: number;
        }[];
    };
    valueVerification: {
        passed: boolean;
        missingOrChangedValues: {
            recordId: string | null;
            field: string;
            expected: unknown;
            actual: unknown;
        }[];
        parts: {
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
        }[];
        delivery: {
            parts: {
                stem: string;
                records: number;
                checksums: Record<string, string>;
            }[];
            note: string;
            recovered?: {
                stage: string;
                method: string;
            } | undefined;
            consolidated: boolean;
        };
        records: number;
        checks: number;
        rawResponses: number;
        populatedFindings: number;
        verifiedQuotes: number;
        masterColumns: number;
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
    actualProcessingMicros: number;
    codexEstimatedMicros: number | null;
    realBrowser: string;
}>;
