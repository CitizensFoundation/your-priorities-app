import { z } from "zod";
import { openAiGpt6Models } from "../agents/managers/openAiGpt6Models.js";
import { fingerprint, money, reasoningEffortSchema } from "./schemas.js";
import { workflowModelDefaults } from "./modelDefaults.js";
import { workflowModelOutputTokens } from "./runner/modelLimits.js";
const modelPrices = z.object({
    inputMicrosPerMillion: money,
    outputMicrosPerMillion: money,
    cachedInputMicrosPerMillion: money.optional(),
    cacheWriteInputMicrosPerMillion: money.optional(),
});
export const processingModelSchema = z
    .object({
    id: z.string().min(1),
    label: z.string(),
    provider: z.enum(["openai", "anthropic", "google"]),
    reasoning: z.boolean().optional(),
    reasoningEffort: reasoningEffortSchema.optional(),
    ...modelPrices.shape,
    inferenceType: z.enum(["priority"]).optional(),
    // A priority request may be served and billed at the standard tier.
    standardPrices: modelPrices.optional(),
    maxOutputTokens: z.number().int().min(256).max(128000),
    contextTokens: z.number().int().min(1024).max(2000000),
    priceVersion: z.string().min(1),
    keyEnv: z.string().regex(/^[A-Z][A-Z0-9_]+$/),
})
    .superRefine((model, context) => {
    if (model.inferenceType &&
        (model.provider !== "openai" || !model.standardPrices))
        context.addIssue({
            code: "custom",
            message: "Priority models require OpenAI routing and standard fallback prices",
        });
    if (model.standardPrices)
        for (const key of Object.keys(modelPrices.shape)) {
            if ((model.standardPrices[key] ??
                model.standardPrices.inputMicrosPerMillion) >
                (model[key] ?? model.inputMicrosPerMillion))
                context.addIssue({
                    code: "custom",
                    message: "Standard fallback prices must fit the priority reservation",
                });
        }
});
/** Use exactly the prices NewAiModelSetup seeds, without opening the application DB. */
export function builtinProcessingModels(tier = "regular") {
    const configurations = openAiGpt6Models();
    const pricesFor = (prices) => {
        const micros = (dollars) => Math.ceil(dollars * 1e6);
        return {
            inputMicrosPerMillion: micros(prices.costInTokensPerMillion),
            outputMicrosPerMillion: micros(prices.costOutTokensPerMillion),
            cachedInputMicrosPerMillion: micros(prices.costInCachedContextTokensPerMillion),
            cacheWriteInputMicrosPerMillion: micros(prices.costInTokensPerMillion * prices.cacheWriteInputCostMultiplier),
        };
    };
    return configurations
        .filter(({ configuration }) => tier === "fast"
        ? configuration.inferenceType === "priority"
        : !configuration.inferenceType)
        .map(({ name, configuration }) => {
        const prices = configuration.prices;
        const apiModel = configuration.apiModel ?? configuration.model;
        const standard = configurations.find(({ configuration: entry }) => entry.model === apiModel && !entry.inferenceType);
        return processingModelSchema.parse({
            id: apiModel,
            label: name,
            provider: configuration.provider,
            reasoning: true,
            reasoningEffort: workflowModelDefaults.processingReasoningEffort,
            ...pricesFor(prices),
            ...(tier === "fast"
                ? {
                    inferenceType: "priority",
                    standardPrices: pricesFor(standard.configuration.prices),
                }
                : {}),
            // The output allowance includes reasoning tokens as well as the final JSON.
            maxOutputTokens: Math.min(configuration.maxTokensOut, workflowModelOutputTokens),
            // Keep every request within the ordinary price band. Larger records must split.
            contextTokens: Math.min(configuration.maxContextTokens, prices.longContextTokenThreshold - 1),
            priceVersion: `new-ai-model-setup:${fingerprint(configuration)}`,
            keyEnv: "OPENAI_API_KEY",
        });
    });
}
export function processingModelDefinitions(definitionJson = process.env.YP_LIVE_WORKFLOW_MODELS) {
    const definitions = z
        .array(processingModelSchema)
        .parse(definitionJson === undefined
        ? builtinProcessingModels()
        : JSON.parse(definitionJson));
    if (new Set(definitions.map((model) => model.id)).size !== definitions.length)
        throw new Error("Processing model IDs must be unique");
    return definitions;
}
