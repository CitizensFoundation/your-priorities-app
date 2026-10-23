import { z } from "zod";
import { ISODateTimeSchema, ScopeRefSchema, UUIDSchema, } from "./core.js";
import { GroupFinalReviewStatusSchema, ReviewPrioritySchema, } from "./review.js";
import { GroupLifecycleStatusSchema, } from "./groupLifecycle.js";
import { UsageQuotaSnapshotSchema, } from "./usage.js";
export const LiveScopeTypes = ["domain", "community", "group"];
export const LiveDashboardRowKinds = ["group", "experiment"];
export const LiveDashboardRunStatuses = [
    "queued",
    "running",
    "paused",
    "failed",
];
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
    .strict();
export const LiveHumanReviewSummarySchema = z
    .object({
    pendingCaseCount: z.number().int().positive(),
    highestPriority: ReviewPrioritySchema,
    oldestRequestedAt: ISODateTimeSchema,
    reviewCaseId: UUIDSchema.nullable(),
})
    .strict();
export const LiveFailureSummarySchema = z
    .object({
    runId: UUIDSchema,
    runStepId: UUIDSchema.nullable(),
    message: z.string().min(1),
    failedAt: ISODateTimeSchema.nullable(),
})
    .strict();
export const LiveRunBillingSummarySchema = z
    .object({
    activeLane: z.enum(["chatgpt_plan", "openai_api"]),
    apiFallback: z.boolean(),
    accountEmail: z.string().email().nullable().optional(),
    quota: UsageQuotaSnapshotSchema.array(),
})
    .strict();
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
    .strict();
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
    .strict();
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
    .strict();
export const LiveFinalReviewGroupRowSchema = z
    .object({
    id: z.string().min(1),
    groupId: z.number().int().positive(),
    groupName: z.string(),
    imageUrl: z.string().nullable().optional(),
    status: GroupFinalReviewStatusSchema,
})
    .strict();
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
    .strict();
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
    .strict();
