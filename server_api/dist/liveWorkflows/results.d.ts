import { z } from "zod";
import type { WorkflowStore } from "./store.js";
import type { AssetService } from "./assets.js";
export declare const resultQuery: z.ZodObject<{
    offset: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    search: z.ZodDefault<z.ZodString>;
    filter: z.ZodDefault<z.ZodEnum<{
        all: "all";
        failed: "failed";
        unknown: "unknown";
        children: "children";
        parents: "parents";
    }>>;
    compare: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare function resultKey(value: Record<string, YpWorkflowJson>, index: number): string;
export declare function matchesResult(value: Record<string, YpWorkflowJson>, search: string, filter: string): boolean;
/** Read only bounded, checksum-verified JSON chunks emitted by the runner.
 * Ordinary uploaded JSON is never treated as a result, and group access is
 * checked by the controller before entering this service.
 */
export declare class ResultService {
    private readonly store;
    private readonly assets;
    constructor(store: WorkflowStore, assets: AssetService);
    private catalog;
    private rows;
    page(groupId: number, runId: string, query: unknown): Promise<YpWorkflowResultPage>;
}
