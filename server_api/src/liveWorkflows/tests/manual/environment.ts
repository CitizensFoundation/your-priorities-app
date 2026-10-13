import { constants } from "node:fs";
import { open, readFile } from "node:fs/promises";
import { parseEnv } from "node:util";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { z } from "zod";
import { workflowModelDefaults } from "../../modelDefaults.js";
import { workflowModelOutputTokens } from "../../runner/modelLimits.js";
import { reasoningEffortSchema } from "../../schemas.js";
import {
  processingModelDefinitions,
  builtinProcessingModels,
  type ModelDefinition,
} from "../../modelCatalog.js";

export const apiRoot = fileURLToPath(new URL("../../../../", import.meta.url));
export const fixturePath = fileURLToPath(
  new URL("fixtures/skills-first-jobs.json", import.meta.url),
);
export const importFile = path.resolve(apiRoot, "../.envForImportOnly");
export const manualKeyName = "YP_WORKFLOW_MANUAL_OPENAI_KEY";

/** Called only after explicit live opt-in. Never source shell code or import DB/host settings. */
export async function importManualKey(
  filename: string,
  env: NodeJS.ProcessEnv = process.env,
) {
  const supplied = env[manualKeyName] || env.OPENAI_API_KEY;
  if (supplied) {
    env[manualKeyName] = supplied;
    return;
  }
  let contents: string;
  try {
    const file = await open(
      filename,
      constants.O_RDONLY | constants.O_NOFOLLOW,
    );
    try {
      const info = await file.stat();
      if (!info.isFile() || info.size > 64 * 1024) throw new Error();
      contents = await file.readFile("utf8");
    } finally {
      await file.close();
    }
  } catch {
    throw new Error(
      "Cannot import the manual credentials file (expected a regular file of at most 64 KiB).",
    );
  }
  let values: NodeJS.Dict<string>;
  try {
    values = parseEnv(contents);
  } catch {
    throw new Error(
      "The manual credentials file must contain dotenv assignments.",
    );
  }
  const key = values.OPENAI_API_KEY || values.PS_AGENT_OVERRIDE_OPENAI_API_KEY;
  if (!key?.trim())
    throw new Error(
      "The import file needs OPENAI_API_KEY (or PS_AGENT_OVERRIDE_OPENAI_API_KEY).",
    );
  env[manualKeyName] = key;
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
    codexReasoningEffort: reasoningEffortSchema.default(
      workflowModelDefaults.codexReasoningEffort,
    ),
    processingReasoningEffort: reasoningEffortSchema.default(
      workflowModelDefaults.processingReasoningEffort,
    ),
    // A smoke test must never become an expensive production batch by accident.
    trialBudgetMicros: z
      .number()
      .int()
      .min(100_000)
      .max(5_000_000)
      .default(2_000_000),
  })
  .strict();
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

export function resolveManualConfig(
  value: unknown,
  definitions = processingModelDefinitions(),
): ManualConfig {
  const config = manualConfigSchema.parse(value);
  const catalog =
    config.processingServiceTier === "fast"
      ? builtinProcessingModels("fast")
      : definitions;
  const resolve = (id: string) => {
    const model = catalog.find((entry) => entry.id === id);
    if (
      !model ||
      model.provider !== "openai" ||
      model.inputMicrosPerMillion <= 0 ||
      model.outputMicrosPerMillion <= 0 ||
      model.maxOutputTokens < 1024 ||
      model.contextTokens < 32768
    )
      throw new Error(
        "Select an OpenAI processing model with positive prices from the backend model catalog.",
      );
    return {
      ...model,
      keyEnv: manualKeyName,
      maxOutputTokens: Math.min(
        model.maxOutputTokens,
        workflowModelOutputTokens,
      ),
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
export async function readManualConfig(
  filename: string,
): Promise<ManualConfig> {
  try {
    return resolveManualConfig(JSON.parse(await readFile(filename, "utf8")));
  } catch {
    throw new Error(
      "Manual config is missing or invalid: choose a Codex model, an OpenAI processing model from the backend catalog, and a trial cap of $0.10–$5. See manual/config.example.json.",
    );
  }
}

export function requireLiveOptIn(env: NodeJS.ProcessEnv) {
  if (env.YP_WORKFLOW_MANUAL_LIVE !== "1")
    throw new Error(
      "Paid tests require both --live and YP_WORKFLOW_MANUAL_LIVE=1.",
    );
}

export function redactManualText(
  text: string,
  env: NodeJS.ProcessEnv = process.env,
) {
  for (const key of [
    env[manualKeyName],
    env.OPENAI_API_KEY,
    env.PS_AGENT_OVERRIDE_OPENAI_API_KEY,
  ])
    if (key) text = text.replaceAll(key, "[credential redacted]");
  return text.replace(/sk-[A-Za-z0-9_-]{8,}/g, "[credential redacted]");
}
