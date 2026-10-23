import { type Json, type VmCodexUserInput, type VmSessionStartPayload } from "../../contracts/index.js";
export declare function threadParams(payload: VmSessionStartPayload, overrides?: {
    threadId?: string;
    cwd?: string;
    persistExtendedHistory?: boolean;
}): Record<string, Json>;
export declare function threadResumeParams(payload: VmSessionStartPayload, options: {
    threadId: string;
    persistExtendedHistory?: boolean;
    replayRuntimeConfig?: boolean;
}, overrides?: Record<string, Json> | undefined): Record<string, Json>;
export declare function threadForkParams(payload: VmSessionStartPayload, options: {
    threadId: string;
    cwd?: string;
    persistExtendedHistory?: boolean;
}, overrides?: Record<string, Json> | undefined): Record<string, Json>;
export declare function turnParams(payload: VmSessionStartPayload, overrides?: {
    cwd?: string;
    resolvedNetworkMode?: string | null;
}): Record<string, Json>;
export declare function turnStartParams(payload: VmSessionStartPayload, input: VmCodexUserInput[], overrides: Record<string, Json> | undefined, options?: {
    cwd?: string;
    resolvedNetworkMode?: string | null;
}): Record<string, Json>;
export declare function turnStartOverrides(overrides: Record<string, Json> | undefined): Record<string, Json>;
export declare function codexUserInputs(input: VmCodexUserInput[]): Record<string, Json>[];
export declare function extractThreadId(value: unknown): string | null;
export declare function extractTurnId(value: unknown): string | null;
export declare function extractReviewThreadId(value: unknown): string | null;
