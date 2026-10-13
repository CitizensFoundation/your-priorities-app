import path from "node:path";
import {
  YP_LIVE_WORKFLOW_VM_PROTOCOL,
  type ArtifactCollectResponsePayload,
  VmArtifactCollectCommandEnvelopeSchema,
  VmArtifactCollectedResponseEnvelopeSchema,
} from "../../contracts/index.js";
import { ArtifactCollector } from "../artifacts/artifactCollector.js";
import type { VmCommandHandler, VmCommandHandlerContext } from "./vmCommandRouter.js";

export type ArtifactCollectionRunner = Pick<ArtifactCollector, "collect">;

export type ArtifactOutputContainerNormalizer = {
  normalizeArtifactOutputInContainer(input: { sessionId: string }): Promise<boolean>;
  makeArtifactDirectoryWritableInContainer(input: {
    sessionId: string;
    containerPath: string;
  }): Promise<boolean>;
};

const ContainerArtifactsPath = "/artifacts";
const DurableSkippedArtifactTempPrefix = ".yp-live-workflow-skipped-artifact-";

export class ArtifactCollectCommandHandler implements VmCommandHandler {
  readonly path = "/commands/artifact.collect";

  constructor(
    private readonly artifacts: ArtifactCollectionRunner = new ArtifactCollector(),
    private readonly containerNormalizer?: ArtifactOutputContainerNormalizer
  ) {}

  async handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown> {
    const envelope = VmArtifactCollectCommandEnvelopeSchema.parse(body);
    let collected: ArtifactCollectResponsePayload;

    try {
      collected = await this.artifacts.collect(envelope.data);
    } catch (error) {
      if (!isPermissionError(error) || !this.containerNormalizer) {
        throw error;
      }

      const normalized = await this.containerNormalizer.normalizeArtifactOutputInContainer({
        sessionId: envelope.data.sessionId,
      });
      if (!normalized) {
        throw error;
      }

      try {
        collected = await this.artifacts.collect(envelope.data);
      } catch (retryError) {
        const containerPath = durableSkippedArtifactParentContainerPath(
          retryError,
          envelope.data.artifactsPath
        );
        if (!isPermissionError(retryError) || !containerPath) {
          throw retryError;
        }

        const writable = await this.containerNormalizer.makeArtifactDirectoryWritableInContainer({
          sessionId: envelope.data.sessionId,
          containerPath,
        });
        if (!writable) {
          throw retryError;
        }

        collected = await this.artifacts.collect(envelope.data);
      }
    }

    return VmArtifactCollectedResponseEnvelopeSchema.parse({
      ok: true,
      protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
      messageType: "artifact.ready",
      commandId: envelope.commandId,
      ts: context.now().toISOString(),
      data: collected,
    });
  }
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

function durableSkippedArtifactParentContainerPath(
  error: unknown,
  artifactsPath: string
): string | null {
  if (!error || typeof error !== "object") {
    return null;
  }

  const failedPath = (error as NodeJS.ErrnoException).path;
  if (typeof failedPath !== "string") {
    return null;
  }

  const filename = path.basename(failedPath);
  if (!filename.startsWith(DurableSkippedArtifactTempPrefix) || !filename.endsWith(".tmp")) {
    return null;
  }

  const rootPath = path.resolve(artifactsPath);
  const parentPath = path.dirname(path.resolve(failedPath));
  const relativeParentPath = path.relative(rootPath, parentPath);
  if (
    relativeParentPath.startsWith("..") ||
    path.isAbsolute(relativeParentPath)
  ) {
    return null;
  }

  if (!relativeParentPath) {
    return ContainerArtifactsPath;
  }

  const containerRelativePath = relativeParentPath
    .split(path.sep)
    .filter(Boolean)
    .join("/");
  return `${ContainerArtifactsPath}/${containerRelativePath}`;
}
