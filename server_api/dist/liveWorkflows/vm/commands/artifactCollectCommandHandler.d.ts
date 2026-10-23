import { ArtifactCollector } from "../artifacts/artifactCollector.js";
import type { VmCommandHandler, VmCommandHandlerContext } from "./vmCommandRouter.js";
export type ArtifactCollectionRunner = Pick<ArtifactCollector, "collect">;
export type ArtifactOutputContainerNormalizer = {
    normalizeArtifactOutputInContainer(input: {
        sessionId: string;
    }): Promise<boolean>;
    makeArtifactDirectoryWritableInContainer(input: {
        sessionId: string;
        containerPath: string;
    }): Promise<boolean>;
};
export declare class ArtifactCollectCommandHandler implements VmCommandHandler {
    private readonly artifacts;
    private readonly containerNormalizer?;
    readonly path = "/commands/artifact.collect";
    constructor(artifacts?: ArtifactCollectionRunner, containerNormalizer?: ArtifactOutputContainerNormalizer | undefined);
    handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown>;
}
