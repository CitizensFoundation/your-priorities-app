import { z } from "zod";
import { type ISODateTime, type Json, type ScopeRef, type UUID } from "./core.js";
export declare const UsageLanes: readonly ["chatgpt_plan", "openai_api", "policy_synth_api"];
export type UsageLane = (typeof UsageLanes)[number];
export declare const UsagePricingStatuses: readonly ["priced", "missing", "not_applicable"];
export type UsagePricingStatus = (typeof UsagePricingStatuses)[number];
export interface UsageTokenCounts {
    inputTokens?: number | null;
    cachedInputTokens?: number | null;
    outputTokens?: number | null;
    reasoningTokens?: number | null;
    totalTokens?: number | null;
}
export interface CodexUsageBillingContext {
    lane: UsageLane;
    provider: string;
    model?: string | null;
    serviceTier?: string | null;
    inferenceType?: string | null;
    threadId?: string | null;
    turnId?: string | null;
    capturedAt: ISODateTime;
}
export interface UsageCost {
    currency?: string | null;
    inputCost?: number | null;
    cachedInputCost?: number | null;
    outputCost?: number | null;
    toolCost?: number | null;
    totalCost?: number | null;
    pricingStatus: UsagePricingStatus | string;
    pricingSource?: string | null;
    configuredPrices?: Record<string, Json> | null;
}
export interface UsageQuota {
    limitId?: string | null;
    limitName?: string | null;
    usedPercent?: number | null;
    windowDurationMins?: number | null;
    resetsAt?: ISODateTime | null;
    rateLimitReachedType?: string | null;
    planType?: string | null;
    credits?: Record<string, Json> | null;
}
export interface UsageEvent {
    id: UUID;
    sourceType: string;
    sourceId: string;
    idempotencyKey: string;
    eventTs: ISODateTime;
    lane: UsageLane | string;
    provider: string;
    model?: string | null;
    userId?: number | null;
    authProfileId?: UUID | null;
    groupId?: number | null;
    experimentId?: UUID | null;
    runId?: UUID | null;
    runStepId?: UUID | null;
    sessionId?: UUID | null;
    modelCallId?: UUID | null;
    psAgentId?: number | null;
    psModelId?: number | null;
    tokens: UsageTokenCounts;
    cost: UsageCost;
    quota?: UsageQuota | null;
    metadata: Record<string, Json>;
    createdAt: ISODateTime;
    updatedAt: ISODateTime;
}
export interface UsageQuotaSnapshot {
    id: UUID;
    authProfileId: UUID;
    provider: string;
    planType?: string | null;
    limitId: string;
    limitName?: string | null;
    usedPercent?: number | null;
    windowDurationMins?: number | null;
    resetsAt?: ISODateTime | null;
    rateLimitReachedType?: string | null;
    credits?: Record<string, Json> | null;
    rawSnapshot: Record<string, Json>;
    observedAt: ISODateTime;
    createdAt: ISODateTime;
    updatedAt: ISODateTime;
}
export interface UsageRollupTotals extends UsageTokenCounts {
    toolCost?: number | null;
    totalCost?: number | null;
    eventCount: number;
    modelUsageEventCount?: number;
    administrativeEventCount?: number;
    pricedEventCount: number;
    missingPricingEventCount: number;
}
export interface UsageRollup {
    id: UUID;
    rollupKey: string;
    rollupKind: string;
    bucketStart: ISODateTime;
    bucketEnd: ISODateTime;
    lane?: UsageLane | string | null;
    userId?: number | null;
    authProfileId?: UUID | null;
    groupId?: number | null;
    experimentId?: UUID | null;
    runId?: UUID | null;
    runStepId?: UUID | null;
    sessionId?: UUID | null;
    provider?: string | null;
    model?: string | null;
    psAgentId?: number | null;
    totals: UsageRollupTotals;
    metadata: Record<string, Json>;
    createdAt: ISODateTime;
    updatedAt: ISODateTime;
}
export interface UsageSummary {
    scope?: ScopeRef | null;
    generatedAt: ISODateTime;
    from?: ISODateTime | null;
    to?: ISODateTime | null;
    totals: UsageRollupTotals;
    byLane: Array<{
        lane: UsageLane | string;
        totals: UsageRollupTotals;
    }>;
    byScientist?: Array<{
        userId: number;
        totals: UsageRollupTotals;
    }>;
    bySession?: Array<{
        sessionId: UUID;
        totals: UsageRollupTotals;
    }>;
    byExperiment?: Array<{
        experimentId: UUID;
        totals: UsageRollupTotals;
    }>;
    byRun?: Array<{
        runId: UUID;
        totals: UsageRollupTotals;
    }>;
    byModel?: Array<{
        provider: string;
        model: string;
        totals: UsageRollupTotals;
    }>;
    byPsAgent?: Array<{
        psAgentId: number;
        totals: UsageRollupTotals;
    }>;
    quota: UsageQuotaSnapshot[];
}
export declare const UsageLaneSchema: z.ZodEnum<{
    chatgpt_plan: "chatgpt_plan";
    openai_api: "openai_api";
    policy_synth_api: "policy_synth_api";
}>;
export declare const UsagePricingStatusSchema: z.ZodEnum<{
    missing: "missing";
    not_applicable: "not_applicable";
    priced: "priced";
}>;
export declare const UsageTokenCountsSchema: z.ZodObject<{
    inputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    cachedInputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    outputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    reasoningTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    totalTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, z.core.$strict>;
export declare const CodexUsageBillingContextSchema: z.ZodObject<{
    lane: z.ZodEnum<{
        chatgpt_plan: "chatgpt_plan";
        openai_api: "openai_api";
        policy_synth_api: "policy_synth_api";
    }>;
    provider: z.ZodString;
    model: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    serviceTier: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    inferenceType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    threadId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    turnId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    capturedAt: z.ZodString;
}, z.core.$strict>;
export declare const UsageCostSchema: z.ZodObject<{
    currency: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    inputCost: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    cachedInputCost: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    outputCost: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    toolCost: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    totalCost: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    pricingStatus: z.ZodString;
    pricingSource: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    configuredPrices: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>;
}, z.core.$strict>;
export declare const UsageQuotaSchema: z.ZodObject<{
    limitId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    limitName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    usedPercent: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    windowDurationMins: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    resetsAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    rateLimitReachedType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    planType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    credits: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>;
}, z.core.$strict>;
export declare const UsageEventSchema: z.ZodObject<{
    id: z.ZodString;
    sourceType: z.ZodString;
    sourceId: z.ZodString;
    idempotencyKey: z.ZodString;
    eventTs: z.ZodString;
    lane: z.ZodString;
    provider: z.ZodString;
    model: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    userId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    authProfileId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    groupId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    experimentId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    runId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    runStepId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sessionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    modelCallId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    psAgentId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    psModelId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    tokens: z.ZodObject<{
        inputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        cachedInputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        outputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        reasoningTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        totalTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strict>;
    cost: z.ZodObject<{
        currency: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        inputCost: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        cachedInputCost: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        outputCost: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        toolCost: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        totalCost: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        pricingStatus: z.ZodString;
        pricingSource: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        configuredPrices: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>;
    }, z.core.$strict>;
    quota: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        limitId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        limitName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        usedPercent: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        windowDurationMins: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        resetsAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        rateLimitReachedType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        planType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        credits: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>;
    }, z.core.$strict>>>;
    metadata: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strict>;
export declare const UsageQuotaSnapshotSchema: z.ZodObject<{
    id: z.ZodString;
    authProfileId: z.ZodString;
    provider: z.ZodString;
    planType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    limitId: z.ZodString;
    limitName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    usedPercent: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    windowDurationMins: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    resetsAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    rateLimitReachedType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    credits: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>;
    rawSnapshot: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
    observedAt: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strict>;
export declare const UsageRollupTotalsSchema: z.ZodObject<{
    inputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    cachedInputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    outputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    reasoningTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    totalTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    toolCost: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    totalCost: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    eventCount: z.ZodNumber;
    modelUsageEventCount: z.ZodOptional<z.ZodNumber>;
    administrativeEventCount: z.ZodOptional<z.ZodNumber>;
    pricedEventCount: z.ZodNumber;
    missingPricingEventCount: z.ZodNumber;
}, z.core.$strict>;
export declare const UsageRollupSchema: z.ZodObject<{
    id: z.ZodString;
    rollupKey: z.ZodString;
    rollupKind: z.ZodString;
    bucketStart: z.ZodString;
    bucketEnd: z.ZodString;
    lane: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    userId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    authProfileId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    groupId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    experimentId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    runId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    runStepId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sessionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    provider: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    model: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    psAgentId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    totals: z.ZodObject<{
        inputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        cachedInputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        outputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        reasoningTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        totalTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        toolCost: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        totalCost: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        eventCount: z.ZodNumber;
        modelUsageEventCount: z.ZodOptional<z.ZodNumber>;
        administrativeEventCount: z.ZodOptional<z.ZodNumber>;
        pricedEventCount: z.ZodNumber;
        missingPricingEventCount: z.ZodNumber;
    }, z.core.$strict>;
    metadata: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strict>;
export declare const UsageSummarySchema: z.ZodObject<{
    scope: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        type: z.ZodEnum<{
            user: "user";
            domain: "domain";
            community: "community";
            group: "group";
            run: "run";
            signal: "signal";
            session: "session";
            experiment: "experiment";
            run_step: "run_step";
            boundary: "boundary";
            artifact: "artifact";
            dataset: "dataset";
            finding: "finding";
            paper: "paper";
            knowledge_source: "knowledge_source";
            sweep_job: "sweep_job";
            knowledge_document: "knowledge_document";
            knowledge_document_chunk: "knowledge_document_chunk";
            knowledge_signal: "knowledge_signal";
            science_agent_run: "science_agent_run";
            project_corpus: "project_corpus";
            hypothesis: "hypothesis";
            research_embedding: "research_embedding";
            embedding_job: "embedding_job";
            morning_brief: "morning_brief";
            dynamic_paper: "dynamic_paper";
            dynamic_paper_revision: "dynamic_paper_revision";
            dynamic_paper_section: "dynamic_paper_section";
            dynamic_paper_claim: "dynamic_paper_claim";
            dynamic_paper_evidence_link: "dynamic_paper_evidence_link";
            dynamic_paper_update: "dynamic_paper_update";
            evolution_program: "evolution_program";
            evolution_round: "evolution_round";
            evolution_candidate: "evolution_candidate";
            evolution_evaluation: "evolution_evaluation";
            evolution_archive_cell: "evolution_archive_cell";
            review_case: "review_case";
            vm: "vm";
        }>;
        id: z.ZodString;
    }, z.core.$strict>>>;
    generatedAt: z.ZodString;
    from: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    to: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    totals: z.ZodObject<{
        inputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        cachedInputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        outputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        reasoningTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        totalTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        toolCost: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        totalCost: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        eventCount: z.ZodNumber;
        modelUsageEventCount: z.ZodOptional<z.ZodNumber>;
        administrativeEventCount: z.ZodOptional<z.ZodNumber>;
        pricedEventCount: z.ZodNumber;
        missingPricingEventCount: z.ZodNumber;
    }, z.core.$strict>;
    byLane: z.ZodArray<z.ZodObject<{
        lane: z.ZodString;
        totals: z.ZodObject<{
            inputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            cachedInputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            outputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            reasoningTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            totalTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            toolCost: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            totalCost: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            eventCount: z.ZodNumber;
            modelUsageEventCount: z.ZodOptional<z.ZodNumber>;
            administrativeEventCount: z.ZodOptional<z.ZodNumber>;
            pricedEventCount: z.ZodNumber;
            missingPricingEventCount: z.ZodNumber;
        }, z.core.$strict>;
    }, z.core.$strict>>;
    byScientist: z.ZodOptional<z.ZodArray<z.ZodObject<{
        userId: z.ZodNumber;
        totals: z.ZodObject<{
            inputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            cachedInputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            outputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            reasoningTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            totalTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            toolCost: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            totalCost: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            eventCount: z.ZodNumber;
            modelUsageEventCount: z.ZodOptional<z.ZodNumber>;
            administrativeEventCount: z.ZodOptional<z.ZodNumber>;
            pricedEventCount: z.ZodNumber;
            missingPricingEventCount: z.ZodNumber;
        }, z.core.$strict>;
    }, z.core.$strict>>>;
    bySession: z.ZodOptional<z.ZodArray<z.ZodObject<{
        sessionId: z.ZodString;
        totals: z.ZodObject<{
            inputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            cachedInputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            outputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            reasoningTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            totalTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            toolCost: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            totalCost: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            eventCount: z.ZodNumber;
            modelUsageEventCount: z.ZodOptional<z.ZodNumber>;
            administrativeEventCount: z.ZodOptional<z.ZodNumber>;
            pricedEventCount: z.ZodNumber;
            missingPricingEventCount: z.ZodNumber;
        }, z.core.$strict>;
    }, z.core.$strict>>>;
    byExperiment: z.ZodOptional<z.ZodArray<z.ZodObject<{
        experimentId: z.ZodString;
        totals: z.ZodObject<{
            inputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            cachedInputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            outputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            reasoningTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            totalTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            toolCost: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            totalCost: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            eventCount: z.ZodNumber;
            modelUsageEventCount: z.ZodOptional<z.ZodNumber>;
            administrativeEventCount: z.ZodOptional<z.ZodNumber>;
            pricedEventCount: z.ZodNumber;
            missingPricingEventCount: z.ZodNumber;
        }, z.core.$strict>;
    }, z.core.$strict>>>;
    byRun: z.ZodOptional<z.ZodArray<z.ZodObject<{
        runId: z.ZodString;
        totals: z.ZodObject<{
            inputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            cachedInputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            outputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            reasoningTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            totalTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            toolCost: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            totalCost: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            eventCount: z.ZodNumber;
            modelUsageEventCount: z.ZodOptional<z.ZodNumber>;
            administrativeEventCount: z.ZodOptional<z.ZodNumber>;
            pricedEventCount: z.ZodNumber;
            missingPricingEventCount: z.ZodNumber;
        }, z.core.$strict>;
    }, z.core.$strict>>>;
    byModel: z.ZodOptional<z.ZodArray<z.ZodObject<{
        provider: z.ZodString;
        model: z.ZodString;
        totals: z.ZodObject<{
            inputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            cachedInputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            outputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            reasoningTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            totalTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            toolCost: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            totalCost: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            eventCount: z.ZodNumber;
            modelUsageEventCount: z.ZodOptional<z.ZodNumber>;
            administrativeEventCount: z.ZodOptional<z.ZodNumber>;
            pricedEventCount: z.ZodNumber;
            missingPricingEventCount: z.ZodNumber;
        }, z.core.$strict>;
    }, z.core.$strict>>>;
    byPsAgent: z.ZodOptional<z.ZodArray<z.ZodObject<{
        psAgentId: z.ZodNumber;
        totals: z.ZodObject<{
            inputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            cachedInputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            outputTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            reasoningTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            totalTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            toolCost: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            totalCost: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            eventCount: z.ZodNumber;
            modelUsageEventCount: z.ZodOptional<z.ZodNumber>;
            administrativeEventCount: z.ZodOptional<z.ZodNumber>;
            pricedEventCount: z.ZodNumber;
            missingPricingEventCount: z.ZodNumber;
        }, z.core.$strict>;
    }, z.core.$strict>>>;
    quota: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        authProfileId: z.ZodString;
        provider: z.ZodString;
        planType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        limitId: z.ZodString;
        limitName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        usedPercent: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        windowDurationMins: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        resetsAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        rateLimitReachedType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        credits: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>;
        rawSnapshot: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
        observedAt: z.ZodString;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strict>>;
}, z.core.$strict>;
