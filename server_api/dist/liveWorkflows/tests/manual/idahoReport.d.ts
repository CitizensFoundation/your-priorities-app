import type { UsageReservation } from "../../budget.js";
import type { ManualHarness } from "./harness.js";
/** Cost arithmetic only. Failed-record trials remain ineligible for product bulk approval. */
export declare function informationalIdahoProjection(trial: YpWorkflowRun | undefined): {
    approvalEligible: boolean;
    failedRecords: number;
    basis: string;
    fingerprint: string;
    trialRunId: string;
    sampleCount: number;
    populationCount: number;
    expectedMicros: number;
    upperMicros: number;
    notes: string[];
    evidence?: {
        coverage: number;
        attributedCostFraction: number;
        minRecordMicros: number;
        maxRecordMicros: number;
        standardDeviationMicros: number;
        recommendedSampleCount: number;
        needsMoreEvidence: boolean;
    };
    agents?: {
        nodeId: string;
        sampleMicros: number;
        expectedMicros: number;
        upperMicros: number;
    }[];
} | null;
export declare function idahoQuality(records: Record<string, unknown>[]): {
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
export declare function idahoCosts(runs: Pick<YpWorkflowRun, "id" | "mode" | "nodeIds" | "graph">[], usage: UsageReservation[], resultIds?: string[]): {
    currency: string;
    agents: {
        requests: number;
        settledMicros: number;
        reservedMicros: number;
        unresolvedRequests: number;
        modelMicros: number;
        firecrawlMicros: number;
        firecrawlCredits: number;
        firecrawlReservedCredits: number;
        tokensIn: number;
        tokensOut: number;
        runId: string;
        nodeId: string;
        agent: string;
        models: Record<string, string>;
        reasoningEffort: YpWorkflowReasoningEffort | null;
    }[];
    analysisTasks: {
        requests: number;
        settledMicros: number;
        reservedMicros: number;
        unresolvedRequests: number;
        modelMicros: number;
        firecrawlMicros: number;
        firecrawlCredits: number;
        firecrawlReservedCredits: number;
        tokensIn: number;
        tokensOut: number;
        runId: string;
        task: string;
    }[];
    totals: {
        requests: number;
        settledMicros: number;
        reservedMicros: number;
        unresolvedRequests: number;
        modelMicros: number;
        firecrawlMicros: number;
        firecrawlCredits: number;
        firecrawlReservedCredits: number;
        tokensIn: number;
        tokensOut: number;
    };
    firecrawl: {
        rows: {
            searches: number;
            scrapes: number;
            credits: number;
            reservedCredits: number;
            unknownRequests: number;
            costMicros: number;
            runId: string;
            nodeId: string;
            bindingId: string;
        }[];
        searches: number;
        scrapes: number;
        credits: number;
        reservedCredits: number;
        unknownRequests: number;
        costMicros: number;
    };
    taskNote: string;
    unmatchedAnalysisRequests: number;
    requests: {
        billing: {
            tokensIn: unknown;
            tokensOut: unknown;
            requestedServiceTier: unknown;
            appliedServiceTier: unknown;
        } | null;
        recordId?: string;
        fingerprint: string;
        createdAt: string;
        id: string;
        runId: string;
        nodeId: string;
        description: string;
        status: "reserved" | "settled" | "unknown";
        maximumMicros: number;
        actualMicros?: number;
        creditUsage?: YpWorkflowCreditUsage;
    }[];
};
export declare function saveIdahoCosts(harness: ManualHarness, output: string, resultIds?: string[]): Promise<{
    simulated: boolean;
    codex: {
        source: string;
        simulated: boolean;
        configuredModel: string;
        requestedServiceTier: "fast" | "regular";
        appliedServiceTier: null;
        pricingBasis: string;
        usageComplete: boolean;
        pricingComplete: boolean;
        turns: number;
        responses: number;
        tokens: {
            inputTokens: number;
            cachedInputTokens: number;
            cacheWriteInputTokens: number;
            outputTokens: number;
            reasoningOutputTokens: number;
            totalTokens: number;
        };
        estimatedCostMicros: number | null;
        issues: string[];
        entries: {
            sessionId: string;
            threadId: string;
            turnId: string | null;
            seq: number;
            model: string;
            requestedServiceTier: string;
            lane: string;
            tokens: {
                inputTokens: number;
                cachedInputTokens: number;
                cacheWriteInputTokens: number;
                outputTokens: number;
                reasoningOutputTokens: number;
                totalTokens: number;
            };
            cumulative: {
                inputTokens: number;
                cachedInputTokens: number;
                cacheWriteInputTokens: number;
                outputTokens: number;
                reasoningOutputTokens: number;
                totalTokens: number;
            };
            longContext: boolean;
            priceVersion: string | null;
            estimatedCostMicros: number | null;
        }[];
    };
    historicalCodex: {
        source: string;
        simulated: boolean;
        configuredModel: string;
        requestedServiceTier: "fast" | "regular";
        appliedServiceTier: null;
        pricingBasis: string;
        usageComplete: boolean;
        pricingComplete: boolean;
        turns: number;
        responses: number;
        tokens: {
            inputTokens: number;
            cachedInputTokens: number;
            cacheWriteInputTokens: number;
            outputTokens: number;
            reasoningOutputTokens: number;
            totalTokens: number;
        };
        estimatedCostMicros: number | null;
        issues: string[];
        entries: {
            sessionId: string;
            threadId: string;
            turnId: string | null;
            seq: number;
            model: string;
            requestedServiceTier: string;
            lane: string;
            tokens: {
                inputTokens: number;
                cachedInputTokens: number;
                cacheWriteInputTokens: number;
                outputTokens: number;
                reasoningOutputTokens: number;
                totalTokens: number;
            };
            cumulative: {
                inputTokens: number;
                cachedInputTokens: number;
                cacheWriteInputTokens: number;
                outputTokens: number;
                reasoningOutputTokens: number;
                totalTokens: number;
            };
            longContext: boolean;
            priceVersion: string | null;
            estimatedCostMicros: number | null;
        }[];
    } | null;
    totalCodexEstimatedMicros: number | null;
    combinedSettledAndEstimatedMicros: number | null;
    estimate: YpWorkflowEstimate | null;
    informationalProjection: {
        approvalEligible: boolean;
        failedRecords: number;
        basis: string;
        fingerprint: string;
        trialRunId: string;
        sampleCount: number;
        populationCount: number;
        expectedMicros: number;
        upperMicros: number;
        notes: string[];
        evidence?: {
            coverage: number;
            attributedCostFraction: number;
            minRecordMicros: number;
            maxRecordMicros: number;
            standardDeviationMicros: number;
            recommendedSampleCount: number;
            needsMoreEvidence: boolean;
        };
        agents?: {
            nodeId: string;
            sampleMicros: number;
            expectedMicros: number;
            upperMicros: number;
        }[];
    } | null;
    bulkApproved: boolean;
    note: string;
    currency: string;
    agents: {
        requests: number;
        settledMicros: number;
        reservedMicros: number;
        unresolvedRequests: number;
        modelMicros: number;
        firecrawlMicros: number;
        firecrawlCredits: number;
        firecrawlReservedCredits: number;
        tokensIn: number;
        tokensOut: number;
        runId: string;
        nodeId: string;
        agent: string;
        models: Record<string, string>;
        reasoningEffort: YpWorkflowReasoningEffort | null;
    }[];
    analysisTasks: {
        requests: number;
        settledMicros: number;
        reservedMicros: number;
        unresolvedRequests: number;
        modelMicros: number;
        firecrawlMicros: number;
        firecrawlCredits: number;
        firecrawlReservedCredits: number;
        tokensIn: number;
        tokensOut: number;
        runId: string;
        task: string;
    }[];
    totals: {
        requests: number;
        settledMicros: number;
        reservedMicros: number;
        unresolvedRequests: number;
        modelMicros: number;
        firecrawlMicros: number;
        firecrawlCredits: number;
        firecrawlReservedCredits: number;
        tokensIn: number;
        tokensOut: number;
    };
    firecrawl: {
        rows: {
            searches: number;
            scrapes: number;
            credits: number;
            reservedCredits: number;
            unknownRequests: number;
            costMicros: number;
            runId: string;
            nodeId: string;
            bindingId: string;
        }[];
        searches: number;
        scrapes: number;
        credits: number;
        reservedCredits: number;
        unknownRequests: number;
        costMicros: number;
    };
    taskNote: string;
    unmatchedAnalysisRequests: number;
    requests: {
        billing: {
            tokensIn: unknown;
            tokensOut: unknown;
            requestedServiceTier: unknown;
            appliedServiceTier: unknown;
        } | null;
        recordId?: string;
        fingerprint: string;
        createdAt: string;
        id: string;
        runId: string;
        nodeId: string;
        description: string;
        status: "reserved" | "settled" | "unknown";
        maximumMicros: number;
        actualMicros?: number;
        creditUsage?: YpWorkflowCreditUsage;
    }[];
}>;
/** Bound cell size and wrapped height while retaining every character, including surrogate pairs. */
export declare function workbookTextParts(value: unknown): string[];
/** The primary workbook is the production export; costs stay in a separate diagnostic file. */
export declare function writeIdahoWorkbook(output: string, records: Record<string, unknown>[], costs: Awaited<ReturnType<typeof saveIdahoCosts>>, downloadedWorkbook?: Buffer): Promise<string>;
