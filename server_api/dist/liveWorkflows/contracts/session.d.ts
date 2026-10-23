import { z } from "zod";
import { type ISODateTime, type Json, type UUID } from "./core.js";
export declare const AgentSessionKinds: readonly ["codex_app_server"];
export type AgentSessionKind = (typeof AgentSessionKinds)[number];
export declare const AgentSessionStatuses: readonly ["starting", "active", "waiting_on_review", "waiting_on_human", "paused", "completed", "failed", "interrupted", "archived"];
export type AgentSessionStatus = (typeof AgentSessionStatuses)[number];
export declare const AgentSessionTerminalStatuses: readonly ["completed", "failed", "interrupted", "archived"];
export type AgentSessionTerminalStatus = (typeof AgentSessionTerminalStatuses)[number];
export declare function isAgentSessionTerminalStatus(value: unknown): value is AgentSessionTerminalStatus;
export declare const SessionTurnStartActorTypes: readonly ["user", "system", "chief_scientist"];
export type SessionTurnStartActorType = (typeof SessionTurnStartActorTypes)[number];
export interface SessionTurnStartOwnership {
    actorType: SessionTurnStartActorType;
    claimedAt: ISODateTime;
    commandId: string;
    source: string;
}
export interface AgentSessionRef {
    id: UUID;
    runId: UUID;
    runStepId: UUID;
    kind: AgentSessionKind;
    status: AgentSessionStatus;
    vmHostId: UUID;
    workspaceId: UUID;
    threadId?: string;
    activeTurnId?: string;
    turnStartClaim?: SessionTurnStartOwnership | null;
    turnStartOwner?: SessionTurnStartOwnership | null;
    runtimeSnapshot?: Record<string, Json> | null;
    startedAt: ISODateTime;
    endedAt?: ISODateTime | null;
    updatedAt: ISODateTime;
}
export interface CodexPlanStep {
    step: string;
    status: "pending" | "inProgress" | "completed";
}
export interface CodexDiffSummary {
    filesChanged: number;
    insertions?: number;
    deletions?: number;
    paths?: string[];
}
export declare const AgentSessionKindSchema: z.ZodEnum<{
    codex_app_server: "codex_app_server";
}>;
export declare const AgentSessionStatusSchema: z.ZodEnum<{
    active: "active";
    failed: "failed";
    completed: "completed";
    paused: "paused";
    archived: "archived";
    starting: "starting";
    waiting_on_review: "waiting_on_review";
    waiting_on_human: "waiting_on_human";
    interrupted: "interrupted";
}>;
export declare const SessionTurnStartOwnershipSchema: z.ZodObject<{
    actorType: z.ZodEnum<{
        user: "user";
        system: "system";
        chief_scientist: "chief_scientist";
    }>;
    claimedAt: z.ZodString;
    commandId: z.ZodString;
    source: z.ZodString;
}, z.core.$strict>;
export declare const AgentSessionRefSchema: z.ZodObject<{
    id: z.ZodString;
    runId: z.ZodString;
    runStepId: z.ZodString;
    kind: z.ZodEnum<{
        codex_app_server: "codex_app_server";
    }>;
    status: z.ZodEnum<{
        active: "active";
        failed: "failed";
        completed: "completed";
        paused: "paused";
        archived: "archived";
        starting: "starting";
        waiting_on_review: "waiting_on_review";
        waiting_on_human: "waiting_on_human";
        interrupted: "interrupted";
    }>;
    vmHostId: z.ZodString;
    workspaceId: z.ZodString;
    threadId: z.ZodOptional<z.ZodString>;
    activeTurnId: z.ZodOptional<z.ZodString>;
    turnStartClaim: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        actorType: z.ZodEnum<{
            user: "user";
            system: "system";
            chief_scientist: "chief_scientist";
        }>;
        claimedAt: z.ZodString;
        commandId: z.ZodString;
        source: z.ZodString;
    }, z.core.$strict>>>;
    turnStartOwner: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        actorType: z.ZodEnum<{
            user: "user";
            system: "system";
            chief_scientist: "chief_scientist";
        }>;
        claimedAt: z.ZodString;
        commandId: z.ZodString;
        source: z.ZodString;
    }, z.core.$strict>>>;
    runtimeSnapshot: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>;
    startedAt: z.ZodString;
    endedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updatedAt: z.ZodString;
}, z.core.$strict>;
export declare const CodexPlanStepSchema: z.ZodObject<{
    step: z.ZodString;
    status: z.ZodEnum<{
        completed: "completed";
        pending: "pending";
        inProgress: "inProgress";
    }>;
}, z.core.$strict>;
export declare const CodexDiffSummarySchema: z.ZodObject<{
    filesChanged: z.ZodNumber;
    insertions: z.ZodOptional<z.ZodNumber>;
    deletions: z.ZodOptional<z.ZodNumber>;
    paths: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>;
