import { z } from "zod";
import {
  ISODateTimeSchema,
  ScopeRefSchema,
  UUIDSchema,
  type ISODateTime,
  type ScopeRef,
  type UUID,
} from "./core.js";
import {
  GroupFinalReviewStatusSchema,
  ReviewPrioritySchema,
  type GroupFinalReviewStatus,
  type ReviewPriority,
} from "./review.js";
import {
  GroupLifecycleStatusSchema,
  type GroupLifecycleStatus,
} from "./groupLifecycle.js";
import type { ExperimentRunStatus } from "./execution.js";
import {
  UsageQuotaSnapshotSchema,
  type UsageQuotaSnapshot,
} from "./usage.js";

export const LiveScopeTypes = ["domain", "community", "group"] as const;
export type LiveScopeType = (typeof LiveScopeTypes)[number];

export const LiveDashboardRowKinds = ["group", "experiment"] as const;
export type LiveDashboardRowKind = (typeof LiveDashboardRowKinds)[number];

export const LiveDashboardRunStatuses = [
  "queued",
  "running",
  "paused",
  "failed",
] as const satisfies readonly ExperimentRunStatus[];
export type LiveDashboardRunStatus = (typeof LiveDashboardRunStatuses)[number];

export interface LiveConversationMessage {
  eventId: UUID;
  eventTs: ISODateTime;
  sessionId: UUID;
  text: string;
}

export interface LiveHumanReviewSummary {
  pendingCaseCount: number;
  highestPriority: ReviewPriority;
  oldestRequestedAt: ISODateTime;
  reviewCaseId: UUID | null;
}

export interface LiveFailureSummary {
  runId: UUID;
  runStepId: UUID | null;
  message: string;
  failedAt: ISODateTime | null;
}

export interface LiveRunBillingSummary {
  activeLane: "chatgpt_plan" | "openai_api";
  apiFallback: boolean;
  accountEmail?: string | null;
  quota: UsageQuotaSnapshot[];
}

export interface LiveDashboardRow {
  kind: LiveDashboardRowKind;
  id: string;
  groupId: number;
  groupName: string;
  experimentId?: UUID | null;
  experimentName?: string | null;
  imageUrl?: string | null;
  activeRunCount: number;
  currentRunIds: UUID[];
  currentSessionIds: UUID[];
  artifactCount: number;
  totalCost: number | null;
  wallTimeMs: number;
  currentRunStatus: LiveDashboardRunStatus;
  running: boolean;
  failure?: LiveFailureSummary | null;
  humanReview: LiveHumanReviewSummary | null;
  latestActivityAt?: ISODateTime | null;
  lastMessage?: LiveConversationMessage | null;
  billingSummaries?: LiveRunBillingSummary[];
  canManageLifecycle?: boolean;
}

export interface LiveReadyExperimentRow {
  id: string;
  groupId: number;
  groupName: string;
  imageUrl?: string | null;
  experimentId: UUID;
  experimentName: string;
  groupPlanPartId?: string | null;
  partTitle?: string | null;
  priority?: string | null;
  type?: string | null;
  dependencies: string[];
  launchable: boolean;
  blockedReason?: string | null;
}

export interface LiveHeldGroupRow {
  id: string;
  groupId: number;
  groupName: string;
  imageUrl?: string | null;
  lifecycleStatus: Extract<GroupLifecycleStatus, "on_hold">;
  lifecycleReason: string | null;
  lifecycleRevisitAt: ISODateTime | null;
  lifecycleChangedAt: ISODateTime | null;
  activeRunCount: number;
  currentRunIds: UUID[];
  currentSessionIds: UUID[];
  humanReview: LiveHumanReviewSummary | null;
  latestActivityAt?: ISODateTime | null;
  canManageLifecycle: boolean;
}

export interface LiveFinalReviewGroupRow {
  id: string;
  groupId: number;
  groupName: string;
  imageUrl?: string | null;
  status: GroupFinalReviewStatus;
}

export interface LiveScopeSnapshot {
  scope: ScopeRef;
  generatedAt: ISODateTime;
  activeCount: number;
  reviewRequiredCount: number;
  rows: LiveDashboardRow[];
  readyRows: LiveReadyExperimentRow[];
  finalReviewRows: LiveFinalReviewGroupRow[];
  heldCount?: number;
  heldRows?: LiveHeldGroupRow[];
}

export interface LiveUpdatedEventData {
  scope: ScopeRef;
  parentScopes: ScopeRef[];
  reason: string;
  updatedAt: ISODateTime;
  groupId?: number | null;
  experimentId?: UUID | null;
  runId?: UUID | null;
  runStepId?: UUID | null;
  sessionId?: UUID | null;
  artifactId?: UUID | null;
  infographicJobId?: UUID | null;
  usageEventId?: UUID | null;
}

export const LiveScopeTypeSchema = z.enum(LiveScopeTypes);
export const LiveDashboardRowKindSchema = z.enum(LiveDashboardRowKinds);
export const LiveDashboardRunStatusSchema = z.enum(LiveDashboardRunStatuses);

export const LiveConversationMessageSchema = z
  .object({
    eventId: UUIDSchema,
    eventTs: ISODateTimeSchema,
    sessionId: UUIDSchema,
    text: z.string(),
  })
  .strict() satisfies z.ZodType<LiveConversationMessage>;

export const LiveHumanReviewSummarySchema = z
  .object({
    pendingCaseCount: z.number().int().positive(),
    highestPriority: ReviewPrioritySchema,
    oldestRequestedAt: ISODateTimeSchema,
    reviewCaseId: UUIDSchema.nullable(),
  })
  .strict() satisfies z.ZodType<LiveHumanReviewSummary>;

export const LiveFailureSummarySchema = z
  .object({
    runId: UUIDSchema,
    runStepId: UUIDSchema.nullable(),
    message: z.string().min(1),
    failedAt: ISODateTimeSchema.nullable(),
  })
  .strict() satisfies z.ZodType<LiveFailureSummary>;

export const LiveRunBillingSummarySchema = z
  .object({
    activeLane: z.enum(["chatgpt_plan", "openai_api"]),
    apiFallback: z.boolean(),
    accountEmail: z.string().email().nullable().optional(),
    quota: UsageQuotaSnapshotSchema.array(),
  })
  .strict() satisfies z.ZodType<LiveRunBillingSummary>;

export const LiveDashboardRowSchema = z
  .object({
    kind: LiveDashboardRowKindSchema,
    id: z.string().min(1),
    groupId: z.number().int().positive(),
    groupName: z.string(),
    experimentId: UUIDSchema.nullable().optional(),
    experimentName: z.string().nullable().optional(),
    imageUrl: z.string().nullable().optional(),
    activeRunCount: z.number().int().nonnegative(),
    currentRunIds: UUIDSchema.array(),
    currentSessionIds: UUIDSchema.array(),
    artifactCount: z.number().int().nonnegative(),
    totalCost: z.number().nonnegative().nullable(),
    wallTimeMs: z.number().nonnegative(),
    currentRunStatus: LiveDashboardRunStatusSchema,
    running: z.boolean(),
    failure: LiveFailureSummarySchema.nullable().optional().default(null),
    humanReview: LiveHumanReviewSummarySchema.nullable(),
    latestActivityAt: ISODateTimeSchema.nullable().optional(),
    lastMessage: LiveConversationMessageSchema.nullable().optional(),
    billingSummaries: LiveRunBillingSummarySchema.array().optional(),
    canManageLifecycle: z.boolean().optional(),
  })
  .strict() satisfies z.ZodType<LiveDashboardRow>;

export const LiveReadyExperimentRowSchema = z
  .object({
    id: z.string().min(1),
    groupId: z.number().int().positive(),
    groupName: z.string(),
    imageUrl: z.string().nullable().optional(),
    experimentId: UUIDSchema,
    experimentName: z.string(),
    groupPlanPartId: z.string().nullable().optional(),
    partTitle: z.string().nullable().optional(),
    priority: z.string().nullable().optional(),
    type: z.string().nullable().optional(),
    dependencies: z.string().array(),
    launchable: z.boolean(),
    blockedReason: z.string().nullable().optional(),
  })
  .strict() satisfies z.ZodType<LiveReadyExperimentRow>;

export const LiveHeldGroupRowSchema = z
  .object({
    id: z.string().min(1),
    groupId: z.number().int().positive(),
    groupName: z.string(),
    imageUrl: z.string().nullable().optional(),
    lifecycleStatus: GroupLifecycleStatusSchema.extract(["on_hold"]),
    lifecycleReason: z.string().nullable(),
    lifecycleRevisitAt: ISODateTimeSchema.nullable(),
    lifecycleChangedAt: ISODateTimeSchema.nullable(),
    activeRunCount: z.number().int().nonnegative(),
    currentRunIds: UUIDSchema.array(),
    currentSessionIds: UUIDSchema.array(),
    humanReview: LiveHumanReviewSummarySchema.nullable(),
    latestActivityAt: ISODateTimeSchema.nullable().optional(),
    canManageLifecycle: z.boolean(),
  })
  .strict() satisfies z.ZodType<LiveHeldGroupRow>;

export const LiveFinalReviewGroupRowSchema = z
  .object({
    id: z.string().min(1),
    groupId: z.number().int().positive(),
    groupName: z.string(),
    imageUrl: z.string().nullable().optional(),
    status: GroupFinalReviewStatusSchema,
  })
  .strict() satisfies z.ZodType<LiveFinalReviewGroupRow>;

export const LiveScopeSnapshotSchema = z
  .object({
    scope: ScopeRefSchema,
    generatedAt: ISODateTimeSchema,
    activeCount: z.number().int().nonnegative(),
    reviewRequiredCount: z.number().int().nonnegative(),
    rows: LiveDashboardRowSchema.array(),
    readyRows: LiveReadyExperimentRowSchema.array(),
    finalReviewRows: LiveFinalReviewGroupRowSchema.array(),
    heldCount: z.number().int().nonnegative().optional().default(0),
    heldRows: LiveHeldGroupRowSchema.array().optional().default([]),
  })
  .strict() satisfies z.ZodType<LiveScopeSnapshot>;

export const LiveUpdatedEventDataSchema = z
  .object({
    scope: ScopeRefSchema,
    parentScopes: ScopeRefSchema.array(),
    reason: z.string().min(1),
    updatedAt: ISODateTimeSchema,
    groupId: z.number().int().positive().nullable().optional(),
    experimentId: UUIDSchema.nullable().optional(),
    runId: UUIDSchema.nullable().optional(),
    runStepId: UUIDSchema.nullable().optional(),
    sessionId: UUIDSchema.nullable().optional(),
    artifactId: UUIDSchema.nullable().optional(),
    infographicJobId: UUIDSchema.nullable().optional(),
    usageEventId: UUIDSchema.nullable().optional(),
  })
  .strict() satisfies z.ZodType<LiveUpdatedEventData>;
