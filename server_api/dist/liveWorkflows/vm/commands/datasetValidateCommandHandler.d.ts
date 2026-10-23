import { DatasetManager } from "../datasets/datasetManager.js";
import type { VmCommandHandler, VmCommandHandlerContext } from "./vmCommandRouter.js";
export declare class DatasetValidateCommandHandler implements VmCommandHandler {
    private readonly datasets;
    readonly path = "/commands/dataset.validate";
    constructor(datasets: DatasetManager);
    handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown>;
}
