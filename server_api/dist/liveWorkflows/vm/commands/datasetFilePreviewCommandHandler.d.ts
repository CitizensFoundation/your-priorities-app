import type { DatasetManager } from "../datasets/datasetManager.js";
import type { VmCommandHandler, VmCommandHandlerContext } from "./vmCommandRouter.js";
export declare class DatasetFilePreviewCommandHandler implements VmCommandHandler {
    private readonly datasets;
    readonly path = "/commands/dataset.file.preview";
    constructor(datasets: DatasetManager);
    handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown>;
}
