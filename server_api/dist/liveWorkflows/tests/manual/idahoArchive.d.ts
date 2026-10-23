import type { ManualHarness } from "./harness.js";
import type { UsageReservation } from "../../budget.js";
import { type PackageSnapshot } from "../../packages.js";
export interface IdahoArchive {
    version: 1;
    run: YpWorkflowRun;
    assets: YpWorkflowAsset[];
    source: PackageSnapshot;
    usage: UsageReservation[];
    codexUsage: ReturnType<ManualHarness["codexUsage"]["report"]>;
    recovery?: {
        method: string;
        originalSourceHash: string;
    };
}
/** Retain all paid-run stage bytes and source before the disposable VM/DB closes.
 * Credentials, accounts, sessions and sealed connector records are never exported. */
export declare function archiveIdahoRun(harness: ManualHarness, run: YpWorkflowRun, directory: string): Promise<void>;
/** Trusted, local fixture restoration only, into a newly created disposable group.
 * Historical run IDs/costs stay intact and count against the new session's cap. */
export declare function restoreIdahoBaseline(harness: ManualHarness, directory: string): Promise<{
    trialRunId: string;
    restoredFrom: string;
    historicalProcessingMicros: number;
    historicalCodexUsage: {
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
    recovery: {
        method: string;
        originalSourceHash: string;
    } | null;
}>;
