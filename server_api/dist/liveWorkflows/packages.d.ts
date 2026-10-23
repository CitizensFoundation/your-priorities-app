import { z } from "zod";
export declare const sourceFilesSchema: z.ZodRecord<z.ZodString, z.ZodString>;
export interface PackageSnapshot {
    files: Record<string, string>;
    graph: YpWorkflowGraph;
    hash: string;
    runtimeImage?: string;
}
export declare function readPackage(root: string): Promise<PackageSnapshot>;
export declare function validatePackage(value: unknown): PackageSnapshot;
/** Apply defaults only at workspace creation, preserving explicit package choices. */
export declare function withDefaultAgentModel(snapshot: PackageSnapshot, modelId: string): PackageSnapshot;
/** A targeted experiment includes every upstream dependency of its chosen agent. */
export declare function selectedAgents(graph: YpWorkflowGraph, targetNodeId?: string): string[];
export declare function skillsFirstPackage(): Promise<PackageSnapshot>;
export declare function loadPackage(id: string): Promise<PackageSnapshot>;
export declare function packageCatalog(): Promise<{
    id: string;
    name: string;
    version: string;
}[]>;
