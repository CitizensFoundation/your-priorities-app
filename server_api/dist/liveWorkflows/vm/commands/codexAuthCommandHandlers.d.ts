import type { CodexAdapter } from "../codex/codexAdapter.js";
import type { WorkspaceManager } from "../workspace/workspaceManager.js";
import type { VmCommandHandler, VmCommandHandlerContext } from "./vmCommandRouter.js";
export declare class CodexAuthLoginStartCommandHandler implements VmCommandHandler {
    private readonly codex;
    private readonly workspaces;
    readonly path = "/commands/codex.auth.login.start";
    constructor(codex: CodexAdapter, workspaces: WorkspaceManager);
    handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown>;
    private validateAuthRoot;
}
export declare class CodexAuthLoginCompleteCommandHandler implements VmCommandHandler {
    private readonly codex;
    readonly path = "/commands/codex.auth.login.complete";
    constructor(codex: CodexAdapter);
    handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown>;
}
export declare class CodexAuthLoginCancelCommandHandler implements VmCommandHandler {
    private readonly codex;
    readonly path = "/commands/codex.auth.login.cancel";
    constructor(codex: CodexAdapter);
    handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown>;
}
