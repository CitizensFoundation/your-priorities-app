import { DockerRuntimeManager } from "../docker/dockerRuntimeManager.js";
export class RuntimeEnsureImageCommandHandler {
    constructor(dockerRuntime = new DockerRuntimeManager()) {
        this.dockerRuntime = dockerRuntime;
        this.path = "/commands/runtime.ensure_image";
    }
    async handle(body, context) {
        const image = runtimeEnsureImageRequest(body);
        const result = await this.dockerRuntime.ensureImage(image);
        return {
            ok: true,
            command: "runtime.ensure_image",
            ts: context.now().toISOString(),
            ...result,
        };
    }
}
function runtimeEnsureImageRequest(body) {
    const record = isRecord(body) ? body : {};
    const data = isRecord(record.data) ? record.data : record;
    const image = data.image;
    if (image === undefined || image === null) {
        return undefined;
    }
    if (typeof image !== "string" || image.trim().length === 0) {
        throw new VmCommandValidationError("runtime.ensure_image image must be a non-empty string when provided");
    }
    return image.trim();
}
function isRecord(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
export class VmCommandValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "VmCommandValidationError";
    }
}
