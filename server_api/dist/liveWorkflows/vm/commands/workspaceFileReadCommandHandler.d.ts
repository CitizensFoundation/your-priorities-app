import type { DockerRuntimeManager } from "../docker/dockerRuntimeManager.js";
import type { VmCommandHandler, VmCommandHandlerContext } from "./vmCommandRouter.js";
export declare class WorkspaceFileReadCommandHandler implements VmCommandHandler {
    private readonly dockerRuntime;
    readonly path = "/commands/workspace.file.read";
    constructor(dockerRuntime: DockerRuntimeManager);
    handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown>;
}
