import type { WorkspaceManager } from "../workspace/workspaceManager.js";
import type { VmCommandHandler, VmCommandHandlerContext } from "./vmCommandRouter.js";
export declare class WorkspacePrepareCommandHandler implements VmCommandHandler {
    private readonly workspaceManager;
    readonly path = "/commands/workspace.prepare";
    constructor(workspaceManager: WorkspaceManager);
    handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown>;
}
