import { z } from "zod";
import { OpenAiResponses } from "@policysynth/agents/aiModels/openAiResponses.js";
import {
  PsAiModelSize,
  PsAiModelType,
} from "@policysynth/agents/aiModelTypes.js";
import { partitionModelInputUsage } from "@policysynth/agents/base/modelUsageAccounting.js";
import { BudgetService } from "./budget.js";
import { workflowProviderTimeoutMs } from "./runner/modelLimits.js";
import type { WorkflowStore } from "./store.js";
import { ConflictError, ValidationError } from "./services/errors.js";
import { json, tokenCost, fingerprint } from "./schemas.js";
import {
  processingModelDefinitions,
  type ModelDefinition,
} from "./modelCatalog.js";
export const modelRequestSchema = z
  .object({
    id: z.string().uuid(),
    runId: z.string().uuid(),
    recordId: z.string().min(1).max(600).optional(),
    nodeId: z.string().min(1).max(128),
    role: z.string().max(80).default("default"),
    system: z.string().max(250_000),
    input: json,
  })
  .strict();
export type ModelRequest = z.infer<typeof modelRequestSchema>;
export interface ProviderReply {
  content: string;
  tokensIn: number;
  tokensOut: number;
  cachedInTokens?: number;
  cacheWriteInTokens?: number;
  appliedServiceTier?: string;
}
export class ModelGateway {
  readonly definitions: ModelDefinition[];
  readonly budget: BudgetService;
  constructor(
    private readonly store: WorkflowStore,
    definitionJson?: string,
    private readonly generate: (
      model: ModelDefinition,
      system: string,
      input: string,
    ) => Promise<ProviderReply> = generateWithProvider,
  ) {
    this.definitions = processingModelDefinitions(definitionJson);
    this.budget = new BudgetService(store);
  }
  catalog(): YpWorkflowModel[] {
    return this.definitions.map(({ keyEnv, ...model }) => model);
  }
  async call(groupId: number, value: unknown): Promise<YpWorkflowJson> {
    const request = modelRequestSchema.parse(value);
    const run = await this.store.transact(groupId, (tx) =>
      tx.get<YpWorkflowRun>("run", request.runId),
    );
    const node = run?.graph.nodes.find((n) => n.id === request.nodeId);
    if (!run || !node) throw new ValidationError("Unknown run node");
    const modelId = node.models[request.role] ?? node.models.default;
    const model = this.definitions.find((m) => m.id === modelId);
    if (!model)
      throw new ConflictError(
        "Select a processing model with configured prices before running",
      );
    if (
      node.reasoningEffort &&
      (model.provider !== "openai" || !model.reasoning)
    )
      throw new ValidationError(
        "An explicit reasoning effort requires an OpenAI reasoning model for every selected role",
      );
    const effectiveModel = node.reasoningEffort
      ? { ...model, reasoningEffort: node.reasoningEffort }
      : model;
    if (this.generate === generateWithProvider)
      validateProviderEnvironment(model);
    const approvedModels = await this.store.transact(groupId, (tx) =>
      tx.get<YpWorkflowModel[]>("run-models", request.runId),
    );
    const publicModel = this.catalog().find((m) => m.id === model.id);
    if (
      !approvedModels ||
      fingerprint(approvedModels.find((m) => m.id === model.id) ?? null) !==
        fingerprint(publicModel)
    )
      throw new ConflictError(
        "Model pricing changed after approval; create a new estimate",
      );
    const input = JSON.stringify(request.input);
    // A conservative byte bound for text tokenization, plus role/protocol overhead.
    // No built-in tools, media, hidden context, or unbounded output are enabled.
    const inputBound = Buffer.byteLength(input + request.system, "utf8") + 1024;
    if (inputBound + model.maxOutputTokens > model.contextTokens)
      throw new ValidationError(
        "Input exceeds this model's configured context bound; split the record first",
      );
    const maximumMicros =
      tokenCost(
        inputBound,
        Math.max(
          model.inputMicrosPerMillion,
          model.cachedInputMicrosPerMillion ?? model.inputMicrosPerMillion,
          model.cacheWriteInputMicrosPerMillion ?? model.inputMicrosPerMillion,
        ),
      ) + tokenCost(model.maxOutputTokens, model.outputMicrosPerMillion);
    const { reservation, cached } = await this.budget.reserve(groupId, {
      ...request,
      maximumMicros,
      request: { ...request, model: effectiveModel },
      description: `Model ${model.id}`,
    });
    if (cached) return reservation.result ?? null;
    try {
      const reply = await this.generate(effectiveModel, request.system, input);
      const usage = partitionModelInputUsage(
        reply.tokensIn,
        reply.cachedInTokens,
        reply.cacheWriteInTokens,
      );
      const prices =
        model.inferenceType === "priority" &&
        reply.appliedServiceTier === "default"
          ? (model.standardPrices ?? model)
          : model;
      const actualMicros =
        tokenCost(usage.tokenInCount, prices.inputMicrosPerMillion) +
        tokenCost(
          usage.tokenInCachedContextCount,
          prices.cachedInputMicrosPerMillion ?? prices.inputMicrosPerMillion,
        ) +
        tokenCost(
          usage.tokenInCacheWriteCount,
          prices.cacheWriteInputMicrosPerMillion ??
            prices.inputMicrosPerMillion,
        ) +
        tokenCost(reply.tokensOut, prices.outputMicrosPerMillion);
      // Bill even when generated JSON is invalid; the package can explicitly repair it.
      const result = {
        content: reply.content,
        tokensIn: reply.tokensIn,
        tokensOut: reply.tokensOut,
        costMicros: actualMicros,
        requestedServiceTier: model.inferenceType ?? "default",
        appliedServiceTier: reply.appliedServiceTier ?? null,
      };
      await this.budget.settle(groupId, request.id, actualMicros, result);
      return result;
    } catch (error) {
      await this.budget.unknown(groupId, request.id);
      throw error;
    }
  }
}

/** Policy Synth's application-wide overrides must not change an approved billing identity. */
export function validateProviderEnvironment(
  model: ModelDefinition,
  env: NodeJS.ProcessEnv = process.env,
) {
  if (!env[model.keyEnv])
    throw new ConflictError(
      `Processing credential is not configured for ${model.provider}`,
    );
  if (model.provider !== "openai") return;
  if (
    (env.AZURE_OPENAI_KEY && env.AZURE_ENDPOINT && env.AZURE_DEPLOYMENT_NAME) ||
    (env.PS_AGENT_OVERRIDE_OPENAI_API_KEY &&
      env.PS_AGENT_OVERRIDE_OPENAI_API_KEY !== env[model.keyEnv]) ||
    env.OPENAI_BASE_URL ||
    env.OPENAI_ENFORCE_EU_REGION === "true"
  )
    throw new ConflictError(
      "Global OpenAI transport or credential overrides conflict with workflow pricing. Run the workflow API with its configured provider credentials and endpoint.",
    );
}

async function generateWithProvider(
  model: ModelDefinition,
  system: string,
  input: string,
): Promise<ProviderReply> {
  const apiKey = process.env[model.keyEnv];
  if (!apiKey)
    throw new Error(
      `Processing credential is not configured for ${model.provider}`,
    );
  if (model.provider === "openai") {
    const client = new OpenAiResponses({
      apiKey,
      modelName: model.id,
      maxTokensOut: model.maxOutputTokens,
      maxContextTokens: model.contextTokens,
      reasoningEffort: model.reasoningEffort,
      inferenceType: model.inferenceType,
      modelType: model.reasoning
        ? PsAiModelType.TextReasoning
        : PsAiModelType.Text,
      modelSize: PsAiModelSize.Medium,
      prices: {
        costInTokensPerMillion: model.inputMicrosPerMillion / 1e6,
        costOutTokensPerMillion: model.outputMicrosPerMillion / 1e6,
        costInCachedContextTokensPerMillion:
          (model.cachedInputMicrosPerMillion ?? model.inputMicrosPerMillion) /
          1e6,
        cacheWriteInputCostMultiplier: model.inputMicrosPerMillion
          ? (model.cacheWriteInputMicrosPerMillion ??
              model.inputMicrosPerMillion) / model.inputMicrosPerMillion
          : 1,
        currency: "USD",
      },
      accountingVersion: 2,
    });
    const reply = await client.generate(
      [
        { role: "system", message: system },
        { role: "user", message: input },
      ],
      false,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      { timeoutMs: workflowProviderTimeoutMs, store: false },
    );
    const tier = reply.usageItemData?.providerMetadata?.appliedServiceTier;
    return {
      ...reply,
      ...(typeof tier === "string" ? { appliedServiceTier: tier } : {}),
    };
  }
  // Single HTTP attempts: SDK automatic retries would bypass individual reservations.
  if (model.provider === "anthropic") {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: AbortSignal.timeout(180_000),
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: model.id,
        max_tokens: model.maxOutputTokens,
        system,
        messages: [{ role: "user", content: input }],
      }),
    });
    if (!response.ok)
      throw new Error(`Anthropic request failed (${response.status})`);
    const reply = z
      .object({
        content: z.array(
          z.object({ type: z.string(), text: z.string().optional() }),
        ),
        usage: z.object({
          input_tokens: z.number().int(),
          output_tokens: z.number().int(),
        }),
      })
      .parse(await response.json());
    return {
      content: reply.content.map((c) => c.text ?? "").join(""),
      tokensIn: reply.usage.input_tokens,
      tokensOut: reply.usage.output_tokens,
    };
  }
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model.id)}:generateContent`,
    {
      method: "POST",
      signal: AbortSignal.timeout(180_000),
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: input }] }],
        generationConfig: {
          maxOutputTokens: model.maxOutputTokens,
          responseMimeType: "application/json",
        },
      }),
    },
  );
  if (!response.ok)
    throw new Error(`Google model request failed (${response.status})`);
  const reply = z
    .object({
      candidates: z.array(
        z.object({
          content: z.object({
            parts: z.array(z.object({ text: z.string().optional() })),
          }),
        }),
      ),
      usageMetadata: z.object({
        promptTokenCount: z.number().int(),
        candidatesTokenCount: z.number().int(),
        thoughtsTokenCount: z.number().int().optional(),
        cachedContentTokenCount: z.number().int().optional(),
      }),
    })
    .parse(await response.json());
  return {
    content:
      reply.candidates[0]?.content.parts.map((p) => p.text ?? "").join("") ??
      "",
    tokensIn: reply.usageMetadata.promptTokenCount,
    tokensOut:
      reply.usageMetadata.candidatesTokenCount +
      (reply.usageMetadata.thoughtsTokenCount ?? 0),
    cachedInTokens: reply.usageMetadata.cachedContentTokenCount,
  };
}
