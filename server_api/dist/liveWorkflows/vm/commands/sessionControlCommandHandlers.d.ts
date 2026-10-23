import type { CodexAdapter } from "../codex/codexAdapter.js";
import type { DockerRuntimeManager } from "../docker/dockerRuntimeManager.js";
import type { AuxTerminalBridge } from "../terminal/auxTerminalBridge.js";
import type { VmCommandHandler, VmCommandHandlerContext } from "./vmCommandRouter.js";
export declare class SessionResumeCommandHandler implements VmCommandHandler {
    private readonly codex;
    readonly path = "/commands/session.resume";
    constructor(codex: CodexAdapter);
    handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown>;
}
export declare class SessionPauseCommandHandler implements VmCommandHandler {
    private readonly codex;
    readonly path = "/commands/session.pause";
    constructor(codex: CodexAdapter);
    handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown>;
}
export declare class SessionThreadForkCommandHandler implements VmCommandHandler {
    private readonly codex;
    readonly path = "/commands/session.thread.fork";
    constructor(codex: CodexAdapter);
    handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown>;
}
export declare class SessionTurnStartCommandHandler implements VmCommandHandler {
    private readonly codex;
    readonly path = "/commands/session.turn.start";
    constructor(codex: CodexAdapter);
    handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown>;
}
export declare class SessionTurnSteerCommandHandler implements VmCommandHandler {
    private readonly codex;
    readonly path = "/commands/session.turn.steer";
    constructor(codex: CodexAdapter);
    handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown>;
}
export declare class SessionInjectItemsCommandHandler implements VmCommandHandler {
    private readonly codex;
    readonly path = "/commands/session.inject_items";
    constructor(codex: CodexAdapter);
    handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown>;
}
export declare class SessionInterruptCommandHandler implements VmCommandHandler {
    private readonly codex;
    readonly path = "/commands/session.interrupt";
    constructor(codex: CodexAdapter);
    handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown>;
}
export declare class SessionApprovalRespondCommandHandler implements VmCommandHandler {
    private readonly codex;
    readonly path = "/commands/session.approval.respond";
    constructor(codex: CodexAdapter);
    handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown>;
}
export declare class SessionReviewStartCommandHandler implements VmCommandHandler {
    private readonly codex;
    readonly path = "/commands/session.review.start";
    constructor(codex: CodexAdapter);
    handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown>;
}
export declare class SessionTerminateCommandHandler implements VmCommandHandler {
    private readonly codex;
    private readonly dockerRuntime;
    private readonly auxTerminalBridge;
    readonly path = "/commands/session.terminate";
    constructor(codex: CodexAdapter, dockerRuntime: DockerRuntimeManager, auxTerminalBridge: AuxTerminalBridge);
    handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown>;
}
export declare class WorkspaceArchiveCommandHandler implements VmCommandHandler {
    private readonly codex;
    private readonly dockerRuntime;
    private readonly auxTerminalBridge;
    readonly path = "/commands/workspace.archive";
    constructor(codex: CodexAdapter, dockerRuntime: DockerRuntimeManager, auxTerminalBridge: AuxTerminalBridge);
    handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown>;
}
