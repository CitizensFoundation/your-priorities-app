import { z } from "zod";
import { type ISODateTime, type ScopeRef, type UUID } from "./core.js";
import { type GroupFinalReviewStatus, type ReviewPriority } from "./review.js";
import { type GroupLifecycleStatus } from "./groupLifecycle.js";
import { type UsageQuotaSnapshot } from "./usage.js";
export declare const LiveScopeTypes: readonly ["domain", "community", "group"];
export type LiveScopeType = (typeof LiveScopeTypes)[number];
export declare const LiveDashboardRowKinds: readonly ["group", "experiment"];
export type LiveDashboardRowKind = (typeof LiveDashboardRowKinds)[number];
export declare const LiveDashboardRunStatuses: readonly ["queued", "running", "paused", "failed"];
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
export declare const LiveScopeTypeSchema: z.ZodEnum<{
    domain: "domain";
    community: "community";
    group: "group";
}>;
export declare const LiveDashboardRowKindSchema: z.ZodEnum<{
    group: "group";
    experiment: "experiment";
}>;
export declare const LiveDashboardRunStatusSchema: z.ZodEnum<{
    failed: "failed";
    paused: "paused";
    running: "running";
    queued: "queued";
}>;
export declare const LiveConversationMessageSchema: z.ZodObject<{
    eventId: z.ZodString;
    eventTs: z.ZodString;
    sessionId: z.ZodString;
    text: z.ZodString;
}, z.core.$strict>;
export declare const LiveHumanReviewSummarySchema: z.ZodObject<{
    pendingCaseCount: z.ZodNumber;
    highestPriority: z.ZodEnum<{
        critical: "critical";
        high: "high";
        low: "low";
        normal: "normal";
    }>;
    oldestRequestedAt: z.ZodString;
    reviewCaseId: z.ZodNullable<z.ZodString>;
}, z.core.$strict>;
export declare const LiveFailureSummarySchema: z.ZodObject<{
    runId: z.ZodString;
    runStepId: z.ZodNullable<z.ZodString>;
    message: z.ZodString;
    failedAt: z.ZodNullable<z.ZodString>;
}, z.core.$strict>;
export declare const LiveRunBillingSummarySchema: z.ZodObject<{
    activeLane: z.ZodEnum<{
        chatgpt_plan: "chatgpt_plan";
        openai_api: "openai_api";
    }>;
    apiFallback: z.ZodBoolean;
    accountEmail: z.ZodOptional<z.ZodNullable<z.ZodString>>;
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
        credits: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodType<import("./core.js").Json, unknown, z.core.$ZodTypeInternals<import("./core.js").Json, unknown>>>>>;
        rawSnapshot: z.ZodRecord<z.ZodString, z.ZodType<import("./core.js").Json, unknown, z.core.$ZodTypeInternals<import("./core.js").Json, unknown>>>;
        observedAt: z.ZodString;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const LiveDashboardRowSchema: z.ZodObject<{
    kind: z.ZodEnum<{
        group: "group";
        experiment: "experiment";
    }>;
    id: z.ZodString;
    groupId: z.ZodNumber;
    groupName: z.ZodString;
    experimentId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    experimentName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    imageUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    activeRunCount: z.ZodNumber;
    currentRunIds: z.ZodArray<z.ZodString>;
    currentSessionIds: z.ZodArray<z.ZodString>;
    artifactCount: z.ZodNumber;
    totalCost: z.ZodNullable<z.ZodNumber>;
    wallTimeMs: z.ZodNumber;
    currentRunStatus: z.ZodEnum<{
        failed: "failed";
        paused: "paused";
        running: "running";
        queued: "queued";
    }>;
    running: z.ZodBoolean;
    failure: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        runId: z.ZodString;
        runStepId: z.ZodNullable<z.ZodString>;
        message: z.ZodString;
        failedAt: z.ZodNullable<z.ZodString>;
    }, z.core.$strict>>>>;
    humanReview: z.ZodNullable<z.ZodObject<{
        pendingCaseCount: z.ZodNumber;
        highestPriority: z.ZodEnum<{
            critical: "critical";
            high: "high";
            low: "low";
            normal: "normal";
        }>;
        oldestRequestedAt: z.ZodString;
        reviewCaseId: z.ZodNullable<z.ZodString>;
    }, z.core.$strict>>;
    latestActivityAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    lastMessage: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        eventId: z.ZodString;
        eventTs: z.ZodString;
        sessionId: z.ZodString;
        text: z.ZodString;
    }, z.core.$strict>>>;
    billingSummaries: z.ZodOptional<z.ZodArray<z.ZodObject<{
        activeLane: z.ZodEnum<{
            chatgpt_plan: "chatgpt_plan";
            openai_api: "openai_api";
        }>;
        apiFallback: z.ZodBoolean;
        accountEmail: z.ZodOptional<z.ZodNullable<z.ZodString>>;
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
            credits: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodType<import("./core.js").Json, unknown, z.core.$ZodTypeInternals<import("./core.js").Json, unknown>>>>>;
            rawSnapshot: z.ZodRecord<z.ZodString, z.ZodType<import("./core.js").Json, unknown, z.core.$ZodTypeInternals<import("./core.js").Json, unknown>>>;
            observedAt: z.ZodString;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
        }, z.core.$strict>>;
    }, z.core.$strict>>>;
    canManageLifecycle: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const LiveReadyExperimentRowSchema: z.ZodObject<{
    id: z.ZodString;
    groupId: z.ZodNumber;
    groupName: z.ZodString;
    imageUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    experimentId: z.ZodString;
    experimentName: z.ZodString;
    groupPlanPartId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    partTitle: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    priority: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    type: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    dependencies: z.ZodArray<z.ZodString>;
    launchable: z.ZodBoolean;
    blockedReason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strict>;
export declare const LiveHeldGroupRowSchema: z.ZodObject<{
    id: z.ZodString;
    groupId: z.ZodNumber;
    groupName: z.ZodString;
    imageUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    lifecycleStatus: z.ZodEnum<{
        on_hold: "on_hold";
    }>;
    lifecycleReason: z.ZodNullable<z.ZodString>;
    lifecycleRevisitAt: z.ZodNullable<z.ZodString>;
    lifecycleChangedAt: z.ZodNullable<z.ZodString>;
    activeRunCount: z.ZodNumber;
    currentRunIds: z.ZodArray<z.ZodString>;
    currentSessionIds: z.ZodArray<z.ZodString>;
    humanReview: z.ZodNullable<z.ZodObject<{
        pendingCaseCount: z.ZodNumber;
        highestPriority: z.ZodEnum<{
            critical: "critical";
            high: "high";
            low: "low";
            normal: "normal";
        }>;
        oldestRequestedAt: z.ZodString;
        reviewCaseId: z.ZodNullable<z.ZodString>;
    }, z.core.$strict>>;
    latestActivityAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    canManageLifecycle: z.ZodBoolean;
}, z.core.$strict>;
export declare const LiveFinalReviewGroupRowSchema: z.ZodObject<{
    id: z.ZodString;
    groupId: z.ZodNumber;
    groupName: z.ZodString;
    imageUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    status: z.ZodEnum<{
        ready: "ready";
        failed: "failed";
        completed: "completed";
        queued: "queued";
        stale: "stale";
        reviewing: "reviewing";
        needs_configuration: "needs_configuration";
        not_ready: "not_ready";
        council: "council";
        distilling: "distilling";
        needs_attention: "needs_attention";
    }>;
}, z.core.$strict>;
export declare const LiveScopeSnapshotSchema: z.ZodObject<{
    scope: z.ZodObject<{
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
    }, z.core.$strict>;
    generatedAt: z.ZodString;
    activeCount: z.ZodNumber;
    reviewRequiredCount: z.ZodNumber;
    rows: z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<{
            group: "group";
            experiment: "experiment";
        }>;
        id: z.ZodString;
        groupId: z.ZodNumber;
        groupName: z.ZodString;
        experimentId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        experimentName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        imageUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        activeRunCount: z.ZodNumber;
        currentRunIds: z.ZodArray<z.ZodString>;
        currentSessionIds: z.ZodArray<z.ZodString>;
        artifactCount: z.ZodNumber;
        totalCost: z.ZodNullable<z.ZodNumber>;
        wallTimeMs: z.ZodNumber;
        currentRunStatus: z.ZodEnum<{
            failed: "failed";
            paused: "paused";
            running: "running";
            queued: "queued";
        }>;
        running: z.ZodBoolean;
        failure: z.ZodDefault<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            runId: z.ZodString;
            runStepId: z.ZodNullable<z.ZodString>;
            message: z.ZodString;
            failedAt: z.ZodNullable<z.ZodString>;
        }, z.core.$strict>>>>;
        humanReview: z.ZodNullable<z.ZodObject<{
            pendingCaseCount: z.ZodNumber;
            highestPriority: z.ZodEnum<{
                critical: "critical";
                high: "high";
                low: "low";
                normal: "normal";
            }>;
            oldestRequestedAt: z.ZodString;
            reviewCaseId: z.ZodNullable<z.ZodString>;
        }, z.core.$strict>>;
        latestActivityAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        lastMessage: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            eventId: z.ZodString;
            eventTs: z.ZodString;
            sessionId: z.ZodString;
            text: z.ZodString;
        }, z.core.$strict>>>;
        billingSummaries: z.ZodOptional<z.ZodArray<z.ZodObject<{
            activeLane: z.ZodEnum<{
                chatgpt_plan: "chatgpt_plan";
                openai_api: "openai_api";
            }>;
            apiFallback: z.ZodBoolean;
            accountEmail: z.ZodOptional<z.ZodNullable<z.ZodString>>;
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
                credits: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodType<import("./core.js").Json, unknown, z.core.$ZodTypeInternals<import("./core.js").Json, unknown>>>>>;
                rawSnapshot: z.ZodRecord<z.ZodString, z.ZodType<import("./core.js").Json, unknown, z.core.$ZodTypeInternals<import("./core.js").Json, unknown>>>;
                observedAt: z.ZodString;
                createdAt: z.ZodString;
                updatedAt: z.ZodString;
            }, z.core.$strict>>;
        }, z.core.$strict>>>;
        canManageLifecycle: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    readyRows: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        groupId: z.ZodNumber;
        groupName: z.ZodString;
        imageUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        experimentId: z.ZodString;
        experimentName: z.ZodString;
        groupPlanPartId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        partTitle: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        priority: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        type: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        dependencies: z.ZodArray<z.ZodString>;
        launchable: z.ZodBoolean;
        blockedReason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strict>>;
    finalReviewRows: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        groupId: z.ZodNumber;
        groupName: z.ZodString;
        imageUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        status: z.ZodEnum<{
            ready: "ready";
            failed: "failed";
            completed: "completed";
            queued: "queued";
            stale: "stale";
            reviewing: "reviewing";
            needs_configuration: "needs_configuration";
            not_ready: "not_ready";
            council: "council";
            distilling: "distilling";
            needs_attention: "needs_attention";
        }>;
    }, z.core.$strict>>;
    heldCount: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    heldRows: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        groupId: z.ZodNumber;
        groupName: z.ZodString;
        imageUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        lifecycleStatus: z.ZodEnum<{
            on_hold: "on_hold";
        }>;
        lifecycleReason: z.ZodNullable<z.ZodString>;
        lifecycleRevisitAt: z.ZodNullable<z.ZodString>;
        lifecycleChangedAt: z.ZodNullable<z.ZodString>;
        activeRunCount: z.ZodNumber;
        currentRunIds: z.ZodArray<z.ZodString>;
        currentSessionIds: z.ZodArray<z.ZodString>;
        humanReview: z.ZodNullable<z.ZodObject<{
            pendingCaseCount: z.ZodNumber;
            highestPriority: z.ZodEnum<{
                critical: "critical";
                high: "high";
                low: "low";
                normal: "normal";
            }>;
            oldestRequestedAt: z.ZodString;
            reviewCaseId: z.ZodNullable<z.ZodString>;
        }, z.core.$strict>>;
        latestActivityAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        canManageLifecycle: z.ZodBoolean;
    }, z.core.$strict>>>>;
}, z.core.$strict>;
export declare const LiveUpdatedEventDataSchema: z.ZodObject<{
    scope: z.ZodObject<{
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
    }, z.core.$strict>;
    parentScopes: z.ZodArray<z.ZodObject<{
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
    }, z.core.$strict>>;
    reason: z.ZodString;
    updatedAt: z.ZodString;
    groupId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    experimentId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    runId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    runStepId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sessionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    artifactId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    infographicJobId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    usageEventId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strict>;
