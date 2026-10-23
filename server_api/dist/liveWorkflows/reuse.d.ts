import { z } from "zod";
import type { PackageSnapshot } from "./packages.js";
import type { WorkflowTransaction } from "./store.js";
export declare const reuseRequest: z.ZodObject<{
    runId: z.ZodString;
    fromNodeId: z.ZodString;
}, z.core.$strict>;
export declare function stageFingerprints(snapshot: PackageSnapshot, options: {
    assets: YpWorkflowAsset[];
    models: YpWorkflowModel[];
    connectors: unknown;
    concurrency: number;
}): Record<string, string>;
/** Borrow only within the same mode and population. Bulk reuse additionally needs
 * a fresh matching trial for its estimate and explicit approval in the service. */
export declare function planReuse(tx: WorkflowTransaction, run: YpWorkflowRun, value: unknown): Promise<void>;
