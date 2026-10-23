import { z } from "zod";
import { ISODateTimeSchema, JsonSchema, UUIDSchema, } from "./core.js";
export const AgentSessionKinds = ["codex_app_server"];
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
];
export const AgentSessionTerminalStatuses = ["completed", "failed", "interrupted", "archived"];
const AgentSessionTerminalStatusSet = new Set(AgentSessionTerminalStatuses);
export function isAgentSessionTerminalStatus(value) {
    return typeof value === "string" && AgentSessionTerminalStatusSet.has(value);
}
export const SessionTurnStartActorTypes = ["user", "system", "chief_scientist"];
export const AgentSessionKindSchema = z.enum(AgentSessionKinds);
export const AgentSessionStatusSchema = z.enum(AgentSessionStatuses);
export const SessionTurnStartOwnershipSchema = z
    .object({
    actorType: z.enum(SessionTurnStartActorTypes),
    claimedAt: ISODateTimeSchema,
    commandId: z.string().min(1),
    source: z.string().min(1),
})
    .strict();
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
    .strict();
export const CodexPlanStepSchema = z
    .object({
    step: z.string().min(1),
    status: z.enum(["pending", "inProgress", "completed"]),
})
    .strict();
export const CodexDiffSummarySchema = z
    .object({
    filesChanged: z.number().int().nonnegative(),
    insertions: z.number().int().nonnegative().optional(),
    deletions: z.number().int().nonnegative().optional(),
    paths: z.array(z.string()).optional(),
})
    .strict();
