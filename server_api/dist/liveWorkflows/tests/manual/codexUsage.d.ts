import { z } from "zod";
import type { VmSessionEventPayload } from "../../contracts/index.js";
import { type ManualConfig } from "./environment.js";
declare const tokenCounts: z.ZodObject<{
    inputTokens: z.ZodNumber;
    cachedInputTokens: z.ZodNumber;
    cacheWriteInputTokens: z.ZodDefault<z.ZodNumber>;
    outputTokens: z.ZodNumber;
    reasoningOutputTokens: z.ZodNumber;
    totalTokens: z.ZodNumber;
}, z.core.$strip>;
type Tokens = z.infer<typeof tokenCounts>;
/** API cost estimate from fresh manual threads. Reasoning is already part of outputTokens. */
export declare class ManualCodexUsage {
    private readonly config;
    private readonly mode;
    private readonly directory?;
    private readonly seen;
    private readonly threads;
    private readonly turns;
    private readonly issues;
    private readonly entries;
    private writing;
    constructor(config: ManualConfig, mode: "offline" | "api-key" | "chatgpt", directory?: string | undefined);
    record(event: VmSessionEventPayload): Promise<void>;
    report(): {
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
            tokens: Tokens;
            cumulative: Tokens;
            longContext: boolean;
            priceVersion: string | null;
            estimatedCostMicros: number | null;
        }[];
    };
    flush(): Promise<void>;
}
export {};
