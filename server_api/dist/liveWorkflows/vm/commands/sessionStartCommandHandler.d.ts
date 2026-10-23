import { type VmSessionEventPayload } from "../../contracts/index.js";
import type { CodexAdapter } from "../codex/codexAdapter.js";
import type { WorkspaceManager } from "../workspace/workspaceManager.js";
import type { VmCommandHandler, VmCommandHandlerContext } from "./vmCommandRouter.js";
export interface VmSessionEventSink {
    publishSessionEvent(event: VmSessionEventPayload): Promise<void>;
}
export declare class SessionStartCommandHandler implements VmCommandHandler {
    private readonly codex;
    private readonly workspaces;
    private readonly sessionEvents;
    readonly path = "/commands/session.start";
    constructor(codex: CodexAdapter, workspaces: WorkspaceManager, sessionEvents?: VmSessionEventSink);
    handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown>;
    private publishSessionEvent;
}
