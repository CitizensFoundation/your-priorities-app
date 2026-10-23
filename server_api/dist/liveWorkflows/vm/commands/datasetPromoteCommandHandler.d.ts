import { DatasetManager } from "../datasets/datasetManager.js";
import type { VmCommandHandler, VmCommandHandlerContext } from "./vmCommandRouter.js";
export declare class DatasetPromoteCommandHandler implements VmCommandHandler {
    private readonly datasets;
    private readonly workspaceRoot;
    readonly path = "/commands/dataset.promote";
    constructor(datasets: DatasetManager, workspaceRoot: string);
    handle(body: unknown, context: VmCommandHandlerContext): Promise<unknown>;
}
