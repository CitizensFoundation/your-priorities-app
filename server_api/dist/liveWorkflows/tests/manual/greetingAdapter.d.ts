import { CodexAdapter, type CodexAdapterOptions } from "../../vm/codex/codexAdapter.js";
/** This smoke case permits one small greeting, not an open-ended paid chat session. */
export declare class ManualGreetingAdapter extends CodexAdapter {
    private readonly serviceTier;
    private greeted;
    constructor(options: CodexAdapterOptions, serviceTier?: "regular" | "fast");
    startSession(...args: Parameters<CodexAdapter["startSession"]>): Promise<import("../../vm/codex/codexAdapter.js").CodexSessionStartResult>;
    startTurn(...args: Parameters<CodexAdapter["startTurn"]>): Promise<import("../../contracts/protocol.js").VmSessionCommandAckPayload>;
    steerTurn(..._args: Parameters<CodexAdapter["steerTurn"]>): ReturnType<CodexAdapter["steerTurn"]>;
}
