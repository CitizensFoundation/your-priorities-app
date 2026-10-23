import type { DatasetOutputNormalizeInput, DatasetOutputNormalizeResult } from "../datasets/datasetManager.js";
import type { VmCommandHandler, VmCommandHandlerContext } from "./vmCommandRouter.js";
export type DatasetOutputNormalizer = {
    normalizeHotDatasetOutput(input: DatasetOutputNormalizeInput): Promise<DatasetOutputNormalizeResult>;
    assertHotDatasetOutputReadable(input: DatasetOutputNormalizeInput): Promise<DatasetOutputNormalizeResult>;
};
export type DatasetOutputContainerNormalizer = {
    normalizeDatasetOutputInContainer(input: {
        sessionId: string;
        containerPath: string;
    }): Promise<void>;
};
export declare class DatasetOutputNormalizeCommandHandler implements VmCommandHandler {
    private readonly datasets;
    private readonly containerNormalizer?;
    readonly path = "/commands/dataset.output.normalize";
    constructor(datasets: DatasetOutputNormalizer, containerNormalizer?: DatasetOutputContainerNormalizer | undefined);
    handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown>;
}
