import { z } from "zod";
import { type ModelDefinition } from "../../modelCatalog.js";
export declare const apiRoot: string;
export declare const fixturePath: string;
export declare const importFile: string;
export declare const manualKeyName = "YP_WORKFLOW_MANUAL_OPENAI_KEY";
export declare const manualFirecrawlKeyName = "YP_WORKFLOW_MANUAL_FIRECRAWL_KEY";
/** Called only after explicit live opt-in. Never source shell code or import DB/host settings. */
export declare function importManualKey(filename: string, env?: NodeJS.ProcessEnv): Promise<void>;
/** Imports only Firecrawl; no unrelated values are installed or returned. */
export declare function importManualFirecrawlKey(filename: string, env?: NodeJS.ProcessEnv): Promise<void>;
export declare const manualConfigSchema: z.ZodObject<{
    codexModel: z.ZodDefault<z.ZodString>;
    processingModel: z.ZodDefault<z.ZodString>;
    comparisonProcessingModel: z.ZodOptional<z.ZodString>;
    codexServiceTier: z.ZodDefault<z.ZodEnum<{
        fast: "fast";
        regular: "regular";
    }>>;
    processingServiceTier: z.ZodDefault<z.ZodEnum<{
        fast: "fast";
        regular: "regular";
    }>>;
    codexReasoningEffort: z.ZodDefault<z.ZodEnum<{
        max: "max";
        high: "high";
        medium: "medium";
        low: "low";
        xhigh: "xhigh";
    }>>;
    processingReasoningEffort: z.ZodDefault<z.ZodEnum<{
        max: "max";
        high: "high";
        medium: "medium";
        low: "low";
        xhigh: "xhigh";
    }>>;
    trialBudgetMicros: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>;
export interface ManualConfig {
    codexModel: string;
    codexServiceTier: "regular" | "fast";
    processingServiceTier: "regular" | "fast";
    codexReasoningEffort: YpWorkflowReasoningEffort;
    processingReasoningEffort: YpWorkflowReasoningEffort;
    processingModel: ModelDefinition;
    comparisonProcessingModel?: ModelDefinition;
    trialBudgetMicros: number;
}
export declare function resolveManualConfig(value: unknown, definitions?: {
    maxOutputTokens: number;
    contextTokens: number;
    priceVersion: string;
    keyEnv: string;
    inputMicrosPerMillion: number;
    outputMicrosPerMillion: number;
    id: string;
    label: string;
    provider: "openai" | "anthropic" | "google";
    inferenceType?: "priority" | undefined;
    standardPrices?: {
        inputMicrosPerMillion: number;
        outputMicrosPerMillion: number;
        cachedInputMicrosPerMillion?: number | undefined;
        cacheWriteInputMicrosPerMillion?: number | undefined;
    } | undefined;
    cachedInputMicrosPerMillion?: number | undefined;
    cacheWriteInputMicrosPerMillion?: number | undefined;
    reasoning?: boolean | undefined;
    reasoningEffort?: "max" | "high" | "medium" | "low" | "xhigh" | undefined;
}[]): ManualConfig;
export declare function readManualConfig(filename: string): Promise<ManualConfig>;
export declare function requireLiveOptIn(env: NodeJS.ProcessEnv): void;
export declare function redactManualText(text: string, env?: NodeJS.ProcessEnv): string;
