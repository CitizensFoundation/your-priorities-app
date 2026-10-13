import path from "node:path";
import {
  YP_LIVE_WORKFLOW_VM_PROTOCOL,
  VmDatasetOutputNormalizeCommandEnvelopeSchema,
  VmDatasetOutputNormalizedResponseEnvelopeSchema,
} from "../../contracts/index.js";
import type {
  DatasetOutputNormalizeInput,
  DatasetOutputNormalizeResult,
} from "../datasets/datasetManager.js";
import { VmCommandValidationError } from "./runtimeEnsureImageCommandHandler.js";
import type { VmCommandHandler, VmCommandHandlerContext } from "./vmCommandRouter.js";

export type DatasetOutputNormalizer = {
  normalizeHotDatasetOutput(input: DatasetOutputNormalizeInput): Promise<DatasetOutputNormalizeResult>;
  assertHotDatasetOutputReadable(input: DatasetOutputNormalizeInput): Promise<DatasetOutputNormalizeResult>;
};

export type DatasetOutputContainerNormalizer = {
  normalizeDatasetOutputInContainer(input: { sessionId: string; containerPath: string }): Promise<void>;
};

const ContainerDatasetOutputPath = "/dataset-output";

export class DatasetOutputNormalizeCommandHandler implements VmCommandHandler {
  readonly path = "/commands/dataset.output.normalize";

  constructor(
    private readonly datasets: DatasetOutputNormalizer,
    private readonly containerNormalizer?: DatasetOutputContainerNormalizer
  ) {}

  async handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown> {
    const envelope = VmDatasetOutputNormalizeCommandEnvelopeSchema.parse(body);
    const sourcePath = path.resolve(envelope.data.sourcePath);
    const allowedSourceRootPath = path.resolve(envelope.data.allowedSourceRootPath);

    if (!isPathInside(allowedSourceRootPath, sourcePath)) {
      throw new VmCommandValidationError("Dataset source path must stay inside the allowed dataset output root");
    }

    const input = { sourcePath, allowedSourceRootPath };
    let normalized: DatasetOutputNormalizeResult;
    let mode: "host" | "container_fallback" = "host";

    try {
      normalized = await this.datasets.normalizeHotDatasetOutput(input);
    } catch (error) {
      if (!isPermissionError(error) || !this.containerNormalizer || !envelope.data.sessionId) {
        throw error;
      }

      await this.containerNormalizer.normalizeDatasetOutputInContainer({
        sessionId: envelope.data.sessionId,
        containerPath: containerPathForDatasetOutput(sourcePath, allowedSourceRootPath),
      });
      normalized = await this.datasets.assertHotDatasetOutputReadable(input);
      mode = "container_fallback";
    }

    const normalizedAt = context.now().toISOString();

    return VmDatasetOutputNormalizedResponseEnvelopeSchema.parse({
      ok: true,
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "dataset.output.normalized",
      commandId: envelope.commandId,
      ts: normalizedAt,
      data: {
        ok: true,
        commandId: envelope.commandId,
        workspaceId: envelope.data.workspaceId,
        vmHostId: envelope.data.vmHostId,
        sourcePath: normalized.sourcePath,
        normalizedAt,
        mode,
        fileCount: normalized.fileCount,
        directoryCount: normalized.directoryCount,
        metadata: envelope.data.metadata ?? {},
      },
    });
  }
}

function containerPathForDatasetOutput(sourcePath: string, allowedSourceRootPath: string): string {
  const relative = path.relative(path.resolve(allowedSourceRootPath), path.resolve(sourcePath));

  if (relative === "") {
    return ContainerDatasetOutputPath;
  }

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new VmCommandValidationError("Dataset source path must stay inside the allowed dataset output root");
  }

  return `${ContainerDatasetOutputPath}/${relative.split(path.sep).filter(Boolean).join("/")}`;
}

function isPathInside(basePath: string, targetPath: string): boolean {
  const relative = path.relative(path.resolve(basePath), path.resolve(targetPath));
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function isPermissionError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const code = (error as NodeJS.ErrnoException).code;
  if (code === "EACCES" || code === "EPERM") {
    return true;
  }

  const message = error instanceof Error ? error.message : "";
  return /\b(?:EACCES|EPERM|permission denied)\b/iu.test(message);
}
