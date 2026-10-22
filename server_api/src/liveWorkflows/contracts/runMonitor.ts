import { z } from "zod";
import {
  ISODateTimeSchema,
  JsonSchema,
  UUIDSchema,
  type ISODateTime,
  type Json,
  type UUID,
} from "./core.js";
import { isExperimentRunTerminalStatus } from "./execution.js";
import { isHumanReviewCaseTerminalStatus } from "./review.js";
import { isAgentSessionTerminalStatus } from "./session.js";

export const RunMonitorPulseKinds = [
  "message",
  "command",
  "file",
  "item",
  "lifecycle",
  "alert",
  "system",
] as const;
export type RunMonitorPulseKind = (typeof RunMonitorPulseKinds)[number];

export const RunMonitorActivityStates = [
  "working",
  "waiting-chief",
  "waiting-human",
  "paused",
  "terminal",
] as const;
export type RunMonitorActivityState = (typeof RunMonitorActivityStates)[number];

export interface RunMonitorActivityAggregateInput {
  runState?: RunMonitorActivityState;
  ambientState?: RunMonitorActivityState;
  sessionStates?: ReadonlyArray<RunMonitorActivityState | undefined>;
}

export interface RunMonitorPulse {
  at: ISODateTime;
  kind: RunMonitorPulseKind;
  magnitude: number;
  count: number;
}

export interface RunMonitorContainerSnapshot {
  containerName: string;
  sessionId?: string | null;
  cpuPercent?: number | null;
  memoryBytes?: number | null;
  memoryLimitBytes?: number | null;
  memoryPercent?: number | null;
}

export interface RunMonitorHostSnapshot {
  vmHostId: UUID;
  telemetry: Record<string, Json>;
  containers: RunMonitorContainerSnapshot[];
}

export interface RunMonitorResourceFrame {
  sampledAt: ISODateTime;
  hosts: RunMonitorHostSnapshot[];
}

export interface RunMonitorActivityFrame {
  windowStartedAt: ISODateTime;
  windowEndedAt: ISODateTime;
  pulses: RunMonitorPulse[];
  state?: RunMonitorActivityState;
}

export interface RunMonitorUpdate {
  runId: UUID;
  emittedAt: ISODateTime;
  resources?: RunMonitorResourceFrame;
  activity?: RunMonitorActivityFrame;
}

export const RunMonitorPulseSchema = z.object({
  at: ISODateTimeSchema,
  kind: z.enum(RunMonitorPulseKinds),
  magnitude: z.number().min(0).max(1),
  count: z.number().int().positive(),
}).strict() satisfies z.ZodType<RunMonitorPulse>;

export const RunMonitorUpdateSchema = z.object({
  runId: UUIDSchema,
  emittedAt: ISODateTimeSchema,
  resources: z.object({
    sampledAt: ISODateTimeSchema,
    hosts: z.array(z.object({
      vmHostId: UUIDSchema,
      telemetry: z.record(z.string(), JsonSchema),
      containers: z.array(z.object({
        containerName: z.string().min(1),
        sessionId: z.string().nullable().optional(),
        cpuPercent: z.number().nullable().optional(),
        memoryBytes: z.number().nullable().optional(),
        memoryLimitBytes: z.number().nullable().optional(),
        memoryPercent: z.number().nullable().optional(),
      }).strict()),
    }).strict()),
  }).strict().optional(),
  activity: z.object({
    windowStartedAt: ISODateTimeSchema,
    windowEndedAt: ISODateTimeSchema,
    pulses: z.array(RunMonitorPulseSchema),
    state: z.enum(RunMonitorActivityStates).optional(),
  }).strict().optional(),
}).strict() satisfies z.ZodType<RunMonitorUpdate>;

const MagnitudeMinLog = 2;
const MagnitudeMaxLog = 4.3;
const MagnitudeFloor = 0.12;

export function runMonitorPulseMagnitude(sizeChars: number): number {
  if (!Number.isFinite(sizeChars) || sizeChars <= 0) {
    return MagnitudeFloor;
  }

  const ratio = (Math.log10(sizeChars) - MagnitudeMinLog) / (MagnitudeMaxLog - MagnitudeMinLog);
  return Math.min(1, MagnitudeFloor + (1 - MagnitudeFloor) * Math.max(0, ratio));
}

/**
 * Collapses run-wide and per-session activity into the single state rendered
 * by heartbeat surfaces. Human attention remains urgent, while active work
 * wins over a concurrent Chief review so a busy run is not shown as waiting.
 */
export function aggregateRunMonitorActivityState(
  input: RunMonitorActivityAggregateInput
): RunMonitorActivityState | undefined {
  if (input.runState === "terminal" || input.runState === "paused") {
    return input.runState;
  }

  const states = [input.ambientState, ...(input.sessionStates ?? [])];
  if (states.includes("waiting-human")) return "waiting-human";
  if (states.includes("working")) return "working";
  if (states.includes("waiting-chief")) return "waiting-chief";
  if (states.includes("paused")) return "paused";
  if (states.includes("terminal")) return "terminal";
  return input.runState;
}

export function runMonitorPulseKind(messageType: string, eventType?: string | null): RunMonitorPulseKind | undefined {
  if (messageType === "session.snapshot") {
    return undefined;
  }

  const type = messageType === "session.event" && eventType ? eventType : messageType;

  if (type === "message.completed" || type === "message.delta" || type === "session.stream.delta") return "message";
  if (type.startsWith("command.")) return "command";
  if (type.startsWith("file.") || type === "turn.diff.updated" || type === "artifact.ready") return "file";
  if (type.startsWith("item.")) return "item";
  if (
    type.startsWith("turn.") ||
    type.startsWith("thread.") ||
    type.startsWith("codex.input.") ||
    type.startsWith("review.") ||
    type.startsWith("chief_scientist.") ||
    type.startsWith("run.") ||
    type.startsWith("workflow.") ||
    type.endsWith("_job.updated") ||
    type === "session.status.changed" ||
    type === "session.step_boundary.created"
  ) return "lifecycle";
  if (
    type === "session.error" ||
    type.startsWith("approval.") ||
    type.startsWith("session.approval.") ||
    type.startsWith("human_case.") ||
    type.startsWith("usage.routing.")
  ) return "alert";
  return "system";
}

export function runMonitorActivityState(input: {
  messageType: string;
  eventType?: string | null;
  status?: string | null;
}): RunMonitorActivityState | undefined {
  const status = input.status?.trim().toLowerCase() ?? "";

  if (input.messageType === "run.status.changed") {
    if (isExperimentRunTerminalStatus(status)) return "terminal";
    return status === "paused" ? "paused" : undefined;
  }

  if (input.messageType === "session.status.changed") {
    if (isAgentSessionTerminalStatus(status)) return "terminal";
    if (status === "waiting_on_human") return "waiting-human";
    if (status === "waiting_on_review") return "waiting-chief";
    if (status === "paused") return "paused";
    if (status === "starting" || status === "active") return "working";
    return undefined;
  }

  if (input.messageType === "human_case.created") return "waiting-human";
  if (input.messageType === "human_case.updated") {
    return isHumanReviewCaseTerminalStatus(status) ? "waiting-chief" : "waiting-human";
  }
  if (input.messageType === "chief_scientist.decision.applied") return "working";
  if (input.messageType === "session.stream.delta") return "working";
  if (input.messageType !== "session.event") return undefined;

  if (["turn.completed", "session.error", "approval.requested"].includes(input.eventType ?? "")) {
    return "waiting-chief";
  }
  if ([
    "turn.started",
    "turn.plan.updated",
    "turn.diff.updated",
    "codex.input.started",
    "codex.input.steered",
    "message.completed",
    "message.delta",
    "command.output.delta",
    "command.terminal.input",
    "file.output.delta",
    "item.started",
    "item.completed",
    "approval.resolved",
  ].includes(input.eventType ?? "")) return "working";
  return undefined;
}
