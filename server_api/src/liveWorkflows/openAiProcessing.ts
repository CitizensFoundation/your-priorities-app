import OpenAI from "openai";
import { z } from "zod";
import { getOpenAiCacheWriteInTokens } from "@policysynth/agents/aiModels/openAiUsage.js";
import type { ModelDefinition } from "./modelCatalog.js";
import type { ProviderReply } from "./modelGateway.js";
import { workflowProviderTimeoutMs } from "./runner/modelLimits.js";

const count = z.number().int().nonnegative().safe();
const responseSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["completed", "incomplete", "failed", "cancelled"]),
  incomplete_details: z.object({ reason: z.string() }).nullable().optional(),
  service_tier: z.string().nullable().optional(),
  usage: z.object({
    input_tokens: count,
    output_tokens: count,
    input_tokens_details: z
      .object({
        cached_tokens: count.optional(),
        cache_write_tokens: count.optional(),
      })
      .optional(),
  }),
  output: z.array(
    z.object({
      type: z.string(),
      phase: z.string().nullable().optional(),
      content: z
        .array(z.object({ type: z.string(), text: z.string().optional() }))
        .optional(),
    }),
  ),
});

/** Terminal responses can be billable without a usable answer. Never discard their receipt. */
export function openAiProcessingReply(value: unknown): ProviderReply {
  const response = responseSchema.parse(value);
  const messages = response.output.filter((item) => item.type === "message");
  const finals = messages.filter((item) => item.phase === "final_answer");
  const selected = finals.length
    ? finals
    : messages.filter((item) => item.phase !== "commentary");
  const content = selected
    .flatMap((item) =>
      (item.content ?? [])
        .filter((part) => part.type === "output_text")
        .map((part) => part.text ?? ""),
    )
    .join("\n\n");
  const reason = response.incomplete_details?.reason;
  return {
    content,
    tokensIn: response.usage.input_tokens,
    tokensOut: response.usage.output_tokens,
    cachedInTokens: response.usage.input_tokens_details?.cached_tokens ?? 0,
    cacheWriteInTokens: getOpenAiCacheWriteInTokens(response.usage),
    providerResponseId: response.id,
    ...(response.service_tier
      ? { appliedServiceTier: response.service_tier }
      : {}),
    ...(response.status !== "completed"
      ? {
          incompleteReason:
            reason === "max_output_tokens" || reason === "content_filter"
              ? reason
              : response.status,
        }
      : {}),
  };
}

/** The bounded host gateway needs the raw receipt before higher-level helpers reject incomplete output. */
export async function generateOpenAiProcessing(
  model: ModelDefinition,
  apiKey: string,
  system: string,
  input: string,
) {
  const client = new OpenAI({
    apiKey,
    baseURL: "https://api.openai.com/v1",
    maxRetries: 0,
    timeout: workflowProviderTimeoutMs,
  });
  const response = await client.responses.create({
    model: model.id,
    store: false,
    stream: false,
    input: [
      { role: "system", content: system },
      { role: "user", content: input },
    ],
    max_output_tokens: model.maxOutputTokens,
    ...(model.reasoning
      ? { reasoning: { effort: model.reasoningEffort ?? "max" } }
      : {}),
    service_tier: model.inferenceType ?? "default",
  });
  return openAiProcessingReply(response);
}
