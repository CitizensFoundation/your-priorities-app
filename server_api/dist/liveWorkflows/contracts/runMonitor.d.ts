import { z } from "zod";
import { type ISODateTime, type Json, type UUID } from "./core.js";
export declare const RunMonitorPulseKinds: readonly ["message", "command", "file", "item", "lifecycle", "alert", "system"];
export type RunMonitorPulseKind = (typeof RunMonitorPulseKinds)[number];
export declare const RunMonitorActivityStates: readonly ["working", "waiting-chief", "waiting-human", "paused", "terminal"];
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
export declare const RunMonitorPulseSchema: z.ZodObject<{
    at: z.ZodString;
    kind: z.ZodEnum<{
        message: "message";
        command: "command";
        file: "file";
        system: "system";
        item: "item";
        lifecycle: "lifecycle";
        alert: "alert";
    }>;
    magnitude: z.ZodNumber;
    count: z.ZodNumber;
}, z.core.$strict>;
export declare const RunMonitorUpdateSchema: z.ZodObject<{
    runId: z.ZodString;
    emittedAt: z.ZodString;
    resources: z.ZodOptional<z.ZodObject<{
        sampledAt: z.ZodString;
        hosts: z.ZodArray<z.ZodObject<{
            vmHostId: z.ZodString;
            telemetry: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
            containers: z.ZodArray<z.ZodObject<{
                containerName: z.ZodString;
                sessionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                cpuPercent: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                memoryBytes: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                memoryLimitBytes: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                memoryPercent: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strict>>;
        }, z.core.$strict>>;
    }, z.core.$strict>>;
    activity: z.ZodOptional<z.ZodObject<{
        windowStartedAt: z.ZodString;
        windowEndedAt: z.ZodString;
        pulses: z.ZodArray<z.ZodObject<{
            at: z.ZodString;
            kind: z.ZodEnum<{
                message: "message";
                command: "command";
                file: "file";
                system: "system";
                item: "item";
                lifecycle: "lifecycle";
                alert: "alert";
            }>;
            magnitude: z.ZodNumber;
            count: z.ZodNumber;
        }, z.core.$strict>>;
        state: z.ZodOptional<z.ZodEnum<{
            paused: "paused";
            working: "working";
            "waiting-chief": "waiting-chief";
            "waiting-human": "waiting-human";
            terminal: "terminal";
        }>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare function runMonitorPulseMagnitude(sizeChars: number): number;
/**
 * Collapses run-wide and per-session activity into the single state rendered
 * by heartbeat surfaces. Human attention remains urgent, while active work
 * wins over a concurrent Chief review so a busy run is not shown as waiting.
 */
export declare function aggregateRunMonitorActivityState(input: RunMonitorActivityAggregateInput): RunMonitorActivityState | undefined;
export declare function runMonitorPulseKind(messageType: string, eventType?: string | null): RunMonitorPulseKind | undefined;
export declare function runMonitorActivityState(input: {
    messageType: string;
    eventType?: string | null;
    status?: string | null;
}): RunMonitorActivityState | undefined;
