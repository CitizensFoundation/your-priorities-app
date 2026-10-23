import type { UsageReservation } from "../../budget.js";
import type { ManualHarness } from "./harness.js";
export declare const idahoResearchNodes: string[];
export declare const idahoResearchLimits: {
    queriesPerRound: number;
    maxPages: number;
    maxSources: number;
    maxFollowupRounds: number;
    maxDocuments: number;
    maxDocumentPages: number;
    maxDocumentChars: number;
};
export declare const idahoMaximumFirecrawlRequests = 80;
export declare const idahoMaximumCreditsPerRequest = 12;
/** Independent receipt totals for comparing test reports with the browser Usage view. */
export declare function summarizeIdahoFirecrawl(usage: UsageReservation[]): {
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
/** A second bound in addition to the production ledger. No retry or provider fallback. */
export declare function boundedIdahoFirecrawl(request?: typeof fetch): {
    firecrawlFetch: typeof fetch;
    paidRequests: () => number;
};
/** Fixture setup only: credentials go directly to the service, never through Playwright. */
export declare function prepareIdahoResearch(harness: ManualHarness, apiKey: string): Promise<{
    before: YpWorkflowFirecrawlBalance;
    creditMicros: number;
}>;
/** Follow exact citations back to this record/stage's settled retrieval, not just another model response. */
export declare function verifyIdahoResearch(records: Record<string, unknown>[], usage: UsageReservation[], runId: string): {
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
export declare function saveIdahoResearch(harness: ManualHarness, output: string, prepared: Awaited<ReturnType<typeof prepareIdahoResearch>>, records: Record<string, unknown>[], paidRequests: number): Promise<{
    after: YpWorkflowFirecrawlBalance | null;
    accountCreditDelta: number | null;
    note: string;
    before: YpWorkflowFirecrawlBalance;
    creditMicros: number;
    verification: {
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
    paidRequests: number;
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
}>;
