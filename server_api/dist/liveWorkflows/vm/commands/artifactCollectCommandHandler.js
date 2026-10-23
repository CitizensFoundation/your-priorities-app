import path from "node:path";
import { YP_LIVE_WORKFLOW_VM_PROTOCOL, VmArtifactCollectCommandEnvelopeSchema, VmArtifactCollectedResponseEnvelopeSchema, } from "../../contracts/index.js";
import { ArtifactCollector } from "../artifacts/artifactCollector.js";
const ContainerArtifactsPath = "/artifacts";
const DurableSkippedArtifactTempPrefix = ".yp-live-workflow-skipped-artifact-";
export class ArtifactCollectCommandHandler {
    constructor(artifacts = new ArtifactCollector(), containerNormalizer) {
        this.artifacts = artifacts;
        this.containerNormalizer = containerNormalizer;
        this.path = "/commands/artifact.collect";
    }
    async handle(body, context) {
        const envelope = VmArtifactCollectCommandEnvelopeSchema.parse(body);
        let collected;
        try {
            collected = await this.artifacts.collect(envelope.data);
        }
        catch (error) {
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
            }
            catch (retryError) {
                const containerPath = durableSkippedArtifactParentContainerPath(retryError, envelope.data.artifactsPath);
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
function isPermissionError(error) {
    if (!error || typeof error !== "object") {
        return false;
    }
    const code = error.code;
    if (code === "EACCES" || code === "EPERM") {
        return true;
    }
    const message = error instanceof Error ? error.message : "";
    return /\b(?:EACCES|EPERM|permission denied)\b/iu.test(message);
}
function durableSkippedArtifactParentContainerPath(error, artifactsPath) {
    if (!error || typeof error !== "object") {
        return null;
    }
    const failedPath = error.path;
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
    if (relativeParentPath.startsWith("..") ||
        path.isAbsolute(relativeParentPath)) {
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
