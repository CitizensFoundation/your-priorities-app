import { z } from "zod";
import {
  ISODateTimeSchema,
  JsonSchema,
  UUIDSchema,
  type ISODateTime,
  type Json,
  type UUID,
} from "./core.js";

export const AgentSessionKinds = ["codex_app_server"] as const;

export type AgentSessionKind = (typeof AgentSessionKinds)[number];

export const AgentSessionStatuses = [
  "starting",
  "active",
  "waiting_on_review",
  "waiting_on_human",
  "paused",
  "completed",
  "failed",
  "interrupted",
  "archived",
] as const;

export type AgentSessionStatus = (typeof AgentSessionStatuses)[number];

export const AgentSessionTerminalStatuses = ["completed", "failed", "interrupted", "archived"] as const;
export type AgentSessionTerminalStatus = (typeof AgentSessionTerminalStatuses)[number];

const AgentSessionTerminalStatusSet: ReadonlySet<string> = new Set(AgentSessionTerminalStatuses);

export function isAgentSessionTerminalStatus(value: unknown): value is AgentSessionTerminalStatus {
  return typeof value === "string" && AgentSessionTerminalStatusSet.has(value);
}

export const SessionTurnStartActorTypes = ["user", "system", "chief_scientist"] as const;
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

export const AgentSessionKindSchema = z.enum(AgentSessionKinds);
export const AgentSessionStatusSchema = z.enum(AgentSessionStatuses);
export const SessionTurnStartOwnershipSchema = z
  .object({
    actorType: z.enum(SessionTurnStartActorTypes),
    claimedAt: ISODateTimeSchema,
    commandId: z.string().min(1),
    source: z.string().min(1),
  })
  .strict() satisfies z.ZodType<SessionTurnStartOwnership>;

export const AgentSessionRefSchema = z
  .object({
    id: UUIDSchema,
    runId: UUIDSchema,
    runStepId: UUIDSchema,
    kind: AgentSessionKindSchema,
    status: AgentSessionStatusSchema,
    vmHostId: UUIDSchema,
    workspaceId: UUIDSchema,
    threadId: z.string().optional(),
    activeTurnId: z.string().optional(),
    turnStartClaim: SessionTurnStartOwnershipSchema.nullable().optional(),
    turnStartOwner: SessionTurnStartOwnershipSchema.nullable().optional(),
    runtimeSnapshot: z.record(z.string(), JsonSchema).nullable().optional(),
    startedAt: ISODateTimeSchema,
    endedAt: ISODateTimeSchema.nullable().optional(),
    updatedAt: ISODateTimeSchema,
  })
  .strict() satisfies z.ZodType<AgentSessionRef>;

export const CodexPlanStepSchema = z
  .object({
    step: z.string().min(1),
    status: z.enum(["pending", "inProgress", "completed"]),
  })
  .strict() satisfies z.ZodType<CodexPlanStep>;

export const CodexDiffSummarySchema = z
  .object({
    filesChanged: z.number().int().nonnegative(),
    insertions: z.number().int().nonnegative().optional(),
    deletions: z.number().int().nonnegative().optional(),
    paths: z.array(z.string()).optional(),
  })
  .strict() satisfies z.ZodType<CodexDiffSummary>;
