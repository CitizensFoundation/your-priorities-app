import path from "node:path";
import { promises as fs } from "node:fs";
import {
  YP_LIVE_WORKFLOW_VM_PROTOCOL,
  VmDatasetPromoteCommandEnvelopeSchema,
  VmDatasetPromotedResponseEnvelopeSchema,
} from "../../contracts/index.js";
import { DatasetManager } from "../datasets/datasetManager.js";
import { VmCommandValidationError } from "./runtimeEnsureImageCommandHandler.js";
import type { VmCommandHandler, VmCommandHandlerContext } from "./vmCommandRouter.js";

export class DatasetPromoteCommandHandler implements VmCommandHandler {
  readonly path = "/commands/dataset.promote";

  constructor(
    private readonly datasets: DatasetManager,
    private readonly workspaceRoot: string
  ) {}

  async handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown> {
    const envelope = VmDatasetPromoteCommandEnvelopeSchema.parse(body);
    const sourcePath = path.resolve(envelope.data.sourcePath);
    const allowedSourceRootPath = path.resolve(envelope.data.allowedSourceRootPath);
    const vmWorkspaceRoot = path.resolve(this.workspaceRoot);

    if (!isPathInside(vmWorkspaceRoot, allowedSourceRootPath)) {
      throw new VmCommandValidationError("Dataset source root must stay inside the VM workspace root");
    }

    if (!isPathInside(allowedSourceRootPath, sourcePath)) {
      throw new VmCommandValidationError("Dataset source path must stay inside the owning workspace root");
    }

    await assertRealPathInside(
      vmWorkspaceRoot,
      allowedSourceRootPath,
      "Dataset source root must stay inside the VM workspace root"
    );
    await assertRealPathInside(
      allowedSourceRootPath,
      sourcePath,
      "Dataset source path must stay inside the owning workspace root"
    );
    await assertNoSymlinkAncestors(vmWorkspaceRoot, sourcePath);

    const promoted = await this.datasets.promoteWorkspaceDataset({
      datasetVersionId: envelope.data.datasetVersionId,
      sourcePath,
      manifestChecksumSha256: envelope.data.manifestChecksumSha256 ?? null,
    });

    return VmDatasetPromotedResponseEnvelopeSchema.parse({
      ok: true,
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "dataset.promoted",
      commandId: envelope.commandId,
      ts: context.now().toISOString(),
      data: {
        ok: true,
        commandId: envelope.commandId,
        workspaceId: envelope.data.workspaceId,
        vmHostId: envelope.data.vmHostId,
        datasetVersionId: envelope.data.datasetVersionId,
        hotPath: promoted.hotPath,
        uri: promoted.uri,
        sourcePath: promoted.sourcePath,
        promotedAt: context.now().toISOString(),
        sizeBytes: promoted.sizeBytes,
        mountedFiles: promoted.mountedFiles,
        mountedFileCount: promoted.mountedFileCount,
        mountedFilesTruncated: promoted.mountedFilesTruncated,
        metadata: {
          sourceUri: promoted.sourceUri,
          ...(envelope.data.metadata ?? {}),
        },
      },
    });
  }
}

async function assertRealPathInside(
  basePath: string,
  targetPath: string,
  message: string
): Promise<void> {
  try {
    const [baseRealPath, targetRealPath] = await Promise.all([
      fs.realpath(basePath),
      fs.realpath(targetPath),
    ]);

    if (isPathInside(baseRealPath, targetRealPath)) {
      return;
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  throw new VmCommandValidationError(message);
}

async function assertNoSymlinkAncestors(basePath: string, targetPath: string): Promise<void> {
  const relative = path.relative(path.resolve(basePath), path.resolve(targetPath));
  if (relative === "" || relative.startsWith("..") || path.isAbsolute(relative)) {
    return;
  }

  const segments = relative.split(path.sep).filter(Boolean);
  let currentPath = path.resolve(basePath);

  for (let index = 0; index < segments.length - 1; index += 1) {
    currentPath = path.join(currentPath, segments[index]);
    const stat = await fs.lstat(currentPath);

    if (stat.isSymbolicLink()) {
      throw new VmCommandValidationError("Dataset source path must not use symlinked directories inside the owning workspace root");
    }
  }
}

function isPathInside(basePath: string, targetPath: string): boolean {
  const relative = path.relative(path.resolve(basePath), path.resolve(targetPath));
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}
