import { type DockerImageEnsureResult } from "../docker/dockerRuntimeManager.js";
import type { VmCommandHandler, VmCommandHandlerContext } from "./vmCommandRouter.js";
export interface RuntimeImageEnsurer {
    ensureImage(image?: string): Promise<DockerImageEnsureResult>;
}
export declare class RuntimeEnsureImageCommandHandler implements VmCommandHandler {
    private readonly dockerRuntime;
    readonly path = "/commands/runtime.ensure_image";
    constructor(dockerRuntime?: RuntimeImageEnsurer);
    handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown>;
}
export declare class VmCommandValidationError extends Error {
    constructor(message: string);
}
