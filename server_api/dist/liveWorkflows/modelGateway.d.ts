import { z } from "zod";
import { BudgetService } from "./budget.js";
import type { WorkflowStore } from "./store.js";
import { type ModelDefinition } from "./modelCatalog.js";
export declare const modelRequestSchema: z.ZodObject<{
    id: z.ZodString;
    runId: z.ZodString;
    recordId: z.ZodOptional<z.ZodString>;
    nodeId: z.ZodString;
    role: z.ZodDefault<z.ZodString>;
    system: z.ZodString;
    input: z.ZodType<YpWorkflowJson, unknown, z.core.$ZodTypeInternals<YpWorkflowJson, unknown>>;
}, z.core.$strict>;
export type ModelRequest = z.infer<typeof modelRequestSchema>;
export interface ProviderReply {
    content: string;
    tokensIn: number;
    tokensOut: number;
    cachedInTokens?: number;
    cacheWriteInTokens?: number;
    appliedServiceTier?: string;
    providerResponseId?: string;
    incompleteReason?: string;
}
export declare class ModelGateway {
    private readonly store;
    private readonly generate;
    readonly definitions: ModelDefinition[];
    readonly budget: BudgetService;
    constructor(store: WorkflowStore, definitionJson?: string, generate?: (model: ModelDefinition, system: string, input: string) => Promise<ProviderReply>);
    catalog(): YpWorkflowModel[];
    call(groupId: number, value: unknown): Promise<YpWorkflowJson>;
}
/** Policy Synth's application-wide overrides must not change an approved billing identity. */
export declare function validateProviderEnvironment(model: ModelDefinition, env?: NodeJS.ProcessEnv): void;
