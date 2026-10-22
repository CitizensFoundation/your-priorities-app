import { DockerRuntimeManager, type DockerImageEnsureResult } from "../docker/dockerRuntimeManager.js";
import type { VmCommandHandler, VmCommandHandlerContext } from "./vmCommandRouter.js";

export interface RuntimeImageEnsurer {
  ensureImage(image?: string): Promise<DockerImageEnsureResult>;
}

export class RuntimeEnsureImageCommandHandler implements VmCommandHandler {
  readonly path = "/commands/runtime.ensure_image";

  constructor(private readonly dockerRuntime: RuntimeImageEnsurer = new DockerRuntimeManager()) {}

  async handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown> {
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

function runtimeEnsureImageRequest(body: unknown): string | undefined {
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export class VmCommandValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VmCommandValidationError";
  }
}
