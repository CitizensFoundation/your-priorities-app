import { z } from "zod";
export declare const processingModelSchema: z.ZodObject<{
    inferenceType: z.ZodOptional<z.ZodEnum<{
        priority: "priority";
    }>>;
    standardPrices: z.ZodOptional<z.ZodObject<{
        inputMicrosPerMillion: z.ZodNumber;
        outputMicrosPerMillion: z.ZodNumber;
        cachedInputMicrosPerMillion: z.ZodOptional<z.ZodNumber>;
        cacheWriteInputMicrosPerMillion: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    maxOutputTokens: z.ZodNumber;
    contextTokens: z.ZodNumber;
    priceVersion: z.ZodString;
    keyEnv: z.ZodString;
    inputMicrosPerMillion: z.ZodNumber;
    outputMicrosPerMillion: z.ZodNumber;
    cachedInputMicrosPerMillion: z.ZodOptional<z.ZodNumber>;
    cacheWriteInputMicrosPerMillion: z.ZodOptional<z.ZodNumber>;
    id: z.ZodString;
    label: z.ZodString;
    provider: z.ZodEnum<{
        openai: "openai";
        anthropic: "anthropic";
        google: "google";
    }>;
    reasoning: z.ZodOptional<z.ZodBoolean>;
    reasoningEffort: z.ZodOptional<z.ZodEnum<{
        max: "max";
        high: "high";
        medium: "medium";
        low: "low";
        xhigh: "xhigh";
    }>>;
}, z.core.$strip>;
export type ModelDefinition = z.infer<typeof processingModelSchema>;
/** Use exactly the prices NewAiModelSetup seeds, without opening the application DB. */
export declare function builtinProcessingModels(tier?: "regular" | "fast"): ModelDefinition[];
export declare function processingModelDefinitions(definitionJson?: string | undefined): ModelDefinition[];
