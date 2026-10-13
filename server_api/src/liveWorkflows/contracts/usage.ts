import { z } from "zod";
import {
  ISODateTimeSchema,
  JsonSchema,
  ScopeRefSchema,
  UUIDSchema,
  type ISODateTime,
  type Json,
  type ScopeRef,
  type UUID,
} from "./core.js";

export const UsageLanes = ["chatgpt_plan", "openai_api", "policy_synth_api"] as const;
export type UsageLane = (typeof UsageLanes)[number];

export const UsagePricingStatuses = ["priced", "missing", "not_applicable"] as const;
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

const jsonObjectSchema = z.record(z.string(), JsonSchema);

export const UsageLaneSchema = z.enum(UsageLanes);
export const UsagePricingStatusSchema = z.enum(UsagePricingStatuses);

export const UsageTokenCountsSchema = z
  .object({
    inputTokens: z.number().nonnegative().nullable().optional(),
    cachedInputTokens: z.number().nonnegative().nullable().optional(),
    outputTokens: z.number().nonnegative().nullable().optional(),
    reasoningTokens: z.number().nonnegative().nullable().optional(),
    totalTokens: z.number().nonnegative().nullable().optional(),
  })
  .strict() satisfies z.ZodType<UsageTokenCounts>;

export const CodexUsageBillingContextSchema = z
  .object({
    lane: UsageLaneSchema,
    provider: z.string().min(1),
    model: z.string().nullable().optional(),
    serviceTier: z.string().nullable().optional(),
    inferenceType: z.string().nullable().optional(),
    threadId: z.string().nullable().optional(),
    turnId: z.string().nullable().optional(),
    capturedAt: ISODateTimeSchema,
  })
  .strict() satisfies z.ZodType<CodexUsageBillingContext>;

export const UsageCostSchema = z
  .object({
    currency: z.string().nullable().optional(),
    inputCost: z.number().nonnegative().nullable().optional(),
    cachedInputCost: z.number().nonnegative().nullable().optional(),
    outputCost: z.number().nonnegative().nullable().optional(),
    toolCost: z.number().nonnegative().nullable().optional(),
    totalCost: z.number().nonnegative().nullable().optional(),
    pricingStatus: z.string().min(1),
    pricingSource: z.string().nullable().optional(),
    configuredPrices: jsonObjectSchema.nullable().optional(),
  })
  .strict() satisfies z.ZodType<UsageCost>;

export const UsageQuotaSchema = z
  .object({
    limitId: z.string().nullable().optional(),
    limitName: z.string().nullable().optional(),
    usedPercent: z.number().nonnegative().nullable().optional(),
    windowDurationMins: z.number().nonnegative().nullable().optional(),
    resetsAt: ISODateTimeSchema.nullable().optional(),
    rateLimitReachedType: z.string().nullable().optional(),
    planType: z.string().nullable().optional(),
    credits: jsonObjectSchema.nullable().optional(),
  })
  .strict() satisfies z.ZodType<UsageQuota>;

export const UsageEventSchema = z
  .object({
    id: UUIDSchema,
    sourceType: z.string().min(1),
    sourceId: z.string().min(1),
    idempotencyKey: z.string().min(1),
    eventTs: ISODateTimeSchema,
    lane: z.string().min(1),
    provider: z.string().min(1),
    model: z.string().nullable().optional(),
    userId: z.number().int().positive().nullable().optional(),
    authProfileId: UUIDSchema.nullable().optional(),
    groupId: z.number().int().positive().nullable().optional(),
    experimentId: UUIDSchema.nullable().optional(),
    runId: UUIDSchema.nullable().optional(),
    runStepId: UUIDSchema.nullable().optional(),
    sessionId: UUIDSchema.nullable().optional(),
    modelCallId: UUIDSchema.nullable().optional(),
    psAgentId: z.number().int().positive().nullable().optional(),
    psModelId: z.number().int().positive().nullable().optional(),
    tokens: UsageTokenCountsSchema,
    cost: UsageCostSchema,
    quota: UsageQuotaSchema.nullable().optional(),
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
  })
  .strict() satisfies z.ZodType<UsageEvent>;

export const UsageQuotaSnapshotSchema = z
  .object({
    id: UUIDSchema,
    authProfileId: UUIDSchema,
    provider: z.string().min(1),
    planType: z.string().nullable().optional(),
    limitId: z.string().min(1),
    limitName: z.string().nullable().optional(),
    usedPercent: z.number().nonnegative().nullable().optional(),
    windowDurationMins: z.number().nonnegative().nullable().optional(),
    resetsAt: ISODateTimeSchema.nullable().optional(),
    rateLimitReachedType: z.string().nullable().optional(),
    credits: jsonObjectSchema.nullable().optional(),
    rawSnapshot: jsonObjectSchema,
    observedAt: ISODateTimeSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
  })
  .strict() satisfies z.ZodType<UsageQuotaSnapshot>;

export const UsageRollupTotalsSchema = UsageTokenCountsSchema.extend({
  toolCost: z.number().nonnegative().nullable().optional(),
  totalCost: z.number().nonnegative().nullable().optional(),
  eventCount: z.number().int().nonnegative(),
  modelUsageEventCount: z.number().int().nonnegative().optional(),
  administrativeEventCount: z.number().int().nonnegative().optional(),
  pricedEventCount: z.number().int().nonnegative(),
  missingPricingEventCount: z.number().int().nonnegative(),
}) satisfies z.ZodType<UsageRollupTotals>;

export const UsageRollupSchema = z
  .object({
    id: UUIDSchema,
    rollupKey: z.string().min(1),
    rollupKind: z.string().min(1),
    bucketStart: ISODateTimeSchema,
    bucketEnd: ISODateTimeSchema,
    lane: z.string().nullable().optional(),
    userId: z.number().int().positive().nullable().optional(),
    authProfileId: UUIDSchema.nullable().optional(),
    groupId: z.number().int().positive().nullable().optional(),
    experimentId: UUIDSchema.nullable().optional(),
    runId: UUIDSchema.nullable().optional(),
    runStepId: UUIDSchema.nullable().optional(),
    sessionId: UUIDSchema.nullable().optional(),
    provider: z.string().nullable().optional(),
    model: z.string().nullable().optional(),
    psAgentId: z.number().int().positive().nullable().optional(),
    totals: UsageRollupTotalsSchema,
    metadata: jsonObjectSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
  })
  .strict() satisfies z.ZodType<UsageRollup>;

export const UsageSummarySchema = z
  .object({
    scope: ScopeRefSchema.nullable().optional(),
    generatedAt: ISODateTimeSchema,
    from: ISODateTimeSchema.nullable().optional(),
    to: ISODateTimeSchema.nullable().optional(),
    totals: UsageRollupTotalsSchema,
    byLane: z.array(z.object({
      lane: z.string().min(1),
      totals: UsageRollupTotalsSchema,
    }).strict()),
    byScientist: z.array(z.object({
      userId: z.number().int().positive(),
      totals: UsageRollupTotalsSchema,
    }).strict()).optional(),
    bySession: z.array(z.object({
      sessionId: UUIDSchema,
      totals: UsageRollupTotalsSchema,
    }).strict()).optional(),
    byExperiment: z.array(z.object({
      experimentId: UUIDSchema,
      totals: UsageRollupTotalsSchema,
    }).strict()).optional(),
    byRun: z.array(z.object({
      runId: UUIDSchema,
      totals: UsageRollupTotalsSchema,
    }).strict()).optional(),
    byModel: z.array(z.object({
      provider: z.string().min(1),
      model: z.string().min(1),
      totals: UsageRollupTotalsSchema,
    }).strict()).optional(),
    byPsAgent: z.array(z.object({
      psAgentId: z.number().int().positive(),
      totals: UsageRollupTotalsSchema,
    }).strict()).optional(),
    quota: z.array(UsageQuotaSnapshotSchema),
  })
  .strict() satisfies z.ZodType<UsageSummary>;
