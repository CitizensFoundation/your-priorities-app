import { CodexAdapter, type CodexAdapterOptions } from "../../vm/codex/codexAdapter.js";
/** Manual tests only: two user turns in a disposable VM. Processing still uses the budget gateway. */
export declare class ManualOperatorAdapter extends CodexAdapter {
    private readonly serviceTier;
    private turns;
    constructor(options: CodexAdapterOptions, serviceTier?: "regular" | "fast");
    startSession(...args: Parameters<CodexAdapter["startSession"]>): Promise<import("../../vm/codex/codexAdapter.js").CodexSessionStartResult>;
    startTurn(...args: Parameters<CodexAdapter["startTurn"]>): Promise<import("../../contracts/protocol.js").VmSessionCommandAckPayload>;
    steerTurn(..._args: Parameters<CodexAdapter["steerTurn"]>): ReturnType<CodexAdapter["steerTurn"]>;
}
