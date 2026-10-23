import { constants } from "node:fs";
import { open, readFile } from "node:fs/promises";
import { parseEnv } from "node:util";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { z } from "zod";
import { workflowModelDefaults } from "../../modelDefaults.js";
import { workflowModelOutputTokens } from "../../runner/modelLimits.js";
import { reasoningEffortSchema } from "../../schemas.js";
import { processingModelDefinitions, builtinProcessingModels, } from "../../modelCatalog.js";
export const apiRoot = fileURLToPath(new URL("../../../../", import.meta.url));
export const fixturePath = fileURLToPath(new URL("fixtures/skills-first-jobs.json", import.meta.url));
export const importFile = path.resolve(apiRoot, "../.envForImportOnly");
export const manualKeyName = "YP_WORKFLOW_MANUAL_OPENAI_KEY";
export const manualFirecrawlKeyName = "YP_WORKFLOW_MANUAL_FIRECRAWL_KEY";
/** Called only after explicit live opt-in. Never source shell code or import DB/host settings. */
export async function importManualKey(filename, env = process.env) {
    const supplied = env[manualKeyName] || env.OPENAI_API_KEY;
    if (supplied) {
        env[manualKeyName] = supplied;
        return;
    }
    const values = await readManualCredentialAssignments(filename);
    const key = values.OPENAI_API_KEY || values.PS_AGENT_OVERRIDE_OPENAI_API_KEY;
    if (!key?.trim())
        throw new Error("The import file needs OPENAI_API_KEY (or PS_AGENT_OVERRIDE_OPENAI_API_KEY).");
    env[manualKeyName] = key;
}
/** Imports only Firecrawl; no unrelated values are installed or returned. */
export async function importManualFirecrawlKey(filename, env = process.env) {
    const supplied = env[manualFirecrawlKeyName] || env.FIRECRAWL_API_KEY;
    if (supplied) {
        env[manualFirecrawlKeyName] = supplied;
        return;
    }
    const values = await readManualCredentialAssignments(filename);
    if (!values.FIRECRAWL_API_KEY?.trim())
        throw new Error("The import file needs FIRECRAWL_API_KEY.");
    env[manualFirecrawlKeyName] = values.FIRECRAWL_API_KEY;
}
async function readManualCredentialAssignments(filename) {
    let contents;
    try {
        const file = await open(filename, constants.O_RDONLY | constants.O_NOFOLLOW);
        try {
            const info = await file.stat();
            if (!info.isFile() || info.size > 64 * 1024)
                throw new Error();
            contents = await file.readFile("utf8");
        }
        finally {
            await file.close();
        }
    }
    catch {
        throw new Error("Cannot import the manual credentials file (expected a regular file of at most 64 KiB).");
    }
    let values;
    try {
        values = parseEnv(contents);
    }
    catch {
        throw new Error("The manual credentials file must contain dotenv assignments.");
    }
    return values;
}
const configured = z
    .string()
    .min(1)
    .refine((value) => !value.startsWith("SET_"));
export const manualConfigSchema = z
    .object({
    codexModel: configured.default(workflowModelDefaults.codexModel),
    processingModel: configured.default(workflowModelDefaults.processingModel),
    comparisonProcessingModel: configured.optional(),
    codexServiceTier: z.enum(["regular", "fast"]).default("regular"),
    processingServiceTier: z.enum(["regular", "fast"]).default("regular"),
    codexReasoningEffort: reasoningEffortSchema.default(workflowModelDefaults.codexReasoningEffort),
    processingReasoningEffort: reasoningEffortSchema.default(workflowModelDefaults.processingReasoningEffort),
    // A smoke test must never become an expensive production batch by accident.
    trialBudgetMicros: z
        .number()
        .int()
        .min(100000)
        .max(5000000)
        .default(2000000),
})
    .strict();
export function resolveManualConfig(value, definitions = processingModelDefinitions()) {
    const config = manualConfigSchema.parse(value);
    const catalog = config.processingServiceTier === "fast"
        ? builtinProcessingModels("fast")
        : definitions;
    const resolve = (id) => {
        const model = catalog.find((entry) => entry.id === id);
        if (!model ||
            model.provider !== "openai" ||
            model.inputMicrosPerMillion <= 0 ||
            model.outputMicrosPerMillion <= 0 ||
            model.maxOutputTokens < 1024 ||
            model.contextTokens < 32768)
            throw new Error("Select an OpenAI processing model with positive prices from the backend model catalog.");
        return {
            ...model,
            keyEnv: manualKeyName,
            maxOutputTokens: Math.min(model.maxOutputTokens, workflowModelOutputTokens),
        };
    };
    const { comparisonProcessingModel, ...base } = config;
    if (comparisonProcessingModel === config.processingModel)
        throw new Error("Choose two different processing models for comparison");
    return {
        ...base,
        processingModel: resolve(config.processingModel),
        ...(comparisonProcessingModel
            ? { comparisonProcessingModel: resolve(comparisonProcessingModel) }
            : {}),
    };
}
export async function readManualConfig(filename) {
    try {
        return resolveManualConfig(JSON.parse(await readFile(filename, "utf8")));
    }
    catch {
        throw new Error("Manual config is missing or invalid: choose a Codex model, an OpenAI processing model from the backend catalog, and a trial cap of $0.10–$5. See manual/config.example.json.");
    }
}
export function requireLiveOptIn(env) {
    if (env.YP_WORKFLOW_MANUAL_LIVE !== "1")
        throw new Error("Paid tests require both --live and YP_WORKFLOW_MANUAL_LIVE=1.");
}
export function redactManualText(text, env = process.env) {
    for (const key of [
        env[manualKeyName],
        env.OPENAI_API_KEY,
        env.PS_AGENT_OVERRIDE_OPENAI_API_KEY,
        env[manualFirecrawlKeyName],
        env.FIRECRAWL_API_KEY,
    ])
        if (key)
            text = text.replaceAll(key, "[credential redacted]");
    return text.replace(/\b(?:sk|fc)-[A-Za-z0-9_-]{8,}/g, "[credential redacted]");
}
