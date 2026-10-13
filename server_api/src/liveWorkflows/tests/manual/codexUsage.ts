import { writeFile, rename } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { openAiGpt6Models } from "../../../agents/managers/openAiGpt6Models.js";
import { fingerprint } from "../../schemas.js";
import type { VmSessionEventPayload } from "../../contracts/index.js";
import { redactManualText, type ManualConfig } from "./environment.js";

const count = z.number().int().nonnegative().safe();
const tokenCounts = z.object({
  inputTokens: count,
  cachedInputTokens: count,
  cacheWriteInputTokens: count.default(0),
  outputTokens: count,
  reasoningOutputTokens: count,
  totalTokens: count,
});
type Tokens = z.infer<typeof tokenCounts>;
const zero = (): Tokens => ({
  inputTokens: 0,
  cachedInputTokens: 0,
  cacheWriteInputTokens: 0,
  outputTokens: 0,
  reasoningOutputTokens: 0,
  totalTokens: 0,
});
const keys = Object.keys(zero()) as (keyof Tokens)[];
const metric = z.object({
  tokenUsage: z.object({ total: tokenCounts, last: tokenCounts }),
  billingContext: z.object({
    model: z.string().min(1),
    serviceTier: z
      .enum(["regular", "fast", "priority", "flex"])
      .nullable()
      .optional(),
    lane: z.enum(["openai_api", "chatgpt_plan"]),
  }),
});

/** API cost estimate from fresh manual threads. Reasoning is already part of outputTokens. */
export class ManualCodexUsage {
  private readonly seen = new Set<string>();
  private readonly threads = new Map<string, Tokens>();
  private readonly turns = new Map<
    string,
    { completed: boolean; metrics: number }
  >();
  private readonly issues = new Set<string>();
  private readonly entries: {
    sessionId: string;
    threadId: string;
    turnId: string | null;
    seq: number;
    model: string;
    requestedServiceTier: string;
    lane: string;
    tokens: Tokens;
    cumulative: Tokens;
    longContext: boolean;
    priceVersion: string | null;
    estimatedCostMicros: number | null;
  }[] = [];
  private writing = Promise.resolve();
  constructor(
    private readonly config: ManualConfig,
    private readonly mode: "offline" | "api-key" | "chatgpt",
    private readonly directory?: string,
  ) {}

  async record(event: VmSessionEventPayload) {
    if (
      !["metrics.updated", "turn.started", "turn.completed"].includes(
        event.eventType,
      )
    )
      return;
    const eventKey = `${event.sessionId}:${event.vmEventStreamId ?? "default"}:${event.seq}`;
    if (this.seen.has(eventKey)) return;
    this.seen.add(eventKey);
    const turnKey = event.codexTurnId
      ? `${event.sessionId}:${event.codexTurnId}`
      : undefined;
    if (turnKey && !this.turns.has(turnKey))
      this.turns.set(turnKey, { completed: false, metrics: 0 });
    if (event.eventType === "turn.completed" && turnKey)
      this.turns.get(turnKey)!.completed = true;
    if (event.eventType === "metrics.updated") {
      const parsed = metric.safeParse(event.payload);
      if (!parsed.success || !event.codexThreadId) {
        this.issues.add(
          "A Codex usage event could not be interpreted; usage may be incomplete.",
        );
      } else {
        const { tokenUsage, billingContext } = parsed.data;
        const threadKey = `${event.sessionId}:${event.codexThreadId}`;
        const previous = this.threads.get(threadKey) ?? zero();
        const delta = Object.fromEntries(
          keys.map((key) => [key, tokenUsage.total[key] - previous[key]]),
        ) as Tokens;
        if (keys.some((key) => delta[key] < 0)) {
          this.issues.add(
            "A thread's cumulative usage moved backwards; refusing to silently reset its cost.",
          );
        } else if (delta.totalTokens > 0) {
          this.threads.set(threadKey, tokenUsage.total);
          if (turnKey) this.turns.get(turnKey)!.metrics++;
          if (
            delta.cachedInputTokens + delta.cacheWriteInputTokens >
              delta.inputTokens ||
            delta.reasoningOutputTokens > delta.outputTokens
          ) {
            this.issues.add(
              "Codex token partitions are inconsistent; the cost estimate requires review.",
            );
          }
          // Each cumulative increment must identify one response to price long contexts correctly.
          if (keys.some((key) => delta[key] !== tokenUsage.last[key])) {
            this.issues.add(
              "A cumulative usage increment differs from the last response; per-response pricing may be incomplete.",
            );
          }
          const tier = billingContext.serviceTier ?? "regular";
          const inferenceType = ["fast", "priority"].includes(tier)
            ? "priority"
            : tier === "flex"
              ? "flex"
              : undefined;
          const definition = openAiGpt6Models().find(
            ({ configuration }) =>
              (configuration.apiModel ?? configuration.model) ===
                billingContext.model &&
              configuration.inferenceType === inferenceType,
          )?.configuration;
          const prices =
            this.mode === "offline"
              ? {
                  costInTokensPerMillion: 0.1,
                  costInCachedContextTokensPerMillion: 0.01,
                  cacheWriteInputCostMultiplier: 1.25,
                  costOutTokensPerMillion: 0.5,
                  longContextTokenThreshold: 272_000,
                  longContextCostInTokensPerMillion: 0.2,
                  longContextCostInCachedContextTokensPerMillion: 0.02,
                  longContextCostOutTokensPerMillion: 0.75,
                }
              : definition?.prices;
          const longContext =
            tokenUsage.last.inputTokens >
            (prices?.longContextTokenThreshold ?? Infinity);
          const inputRate = longContext
            ? prices?.longContextCostInTokensPerMillion
            : prices?.costInTokensPerMillion;
          const cacheRate = longContext
            ? prices?.longContextCostInCachedContextTokensPerMillion
            : prices?.costInCachedContextTokensPerMillion;
          const outputRate = longContext
            ? prices?.longContextCostOutTokensPerMillion
            : prices?.costOutTokensPerMillion;
          // USD per million tokens × tokens = microdollars. Cache writes/read hits are subsets of input.
          const cost =
            inputRate !== undefined &&
            cacheRate !== undefined &&
            outputRate !== undefined
              ? Math.ceil(
                  Math.max(
                    0,
                    delta.inputTokens -
                      delta.cachedInputTokens -
                      delta.cacheWriteInputTokens,
                  ) *
                    inputRate +
                    delta.cachedInputTokens * cacheRate +
                    delta.cacheWriteInputTokens *
                      inputRate *
                      (prices?.cacheWriteInputCostMultiplier ?? 1) +
                    delta.outputTokens * outputRate,
                )
              : null;
          this.entries.push({
            sessionId: event.sessionId,
            threadId: event.codexThreadId,
            turnId: event.codexTurnId ?? null,
            seq: event.seq,
            model: billingContext.model,
            requestedServiceTier: tier,
            lane: billingContext.lane,
            tokens: delta,
            cumulative: tokenUsage.total,
            longContext,
            priceVersion:
              this.mode === "offline"
                ? "fixture-only"
                : definition
                  ? `new-ai-model-setup:${fingerprint(definition)}`
                  : null,
            estimatedCostMicros:
              billingContext.lane === "openai_api" ? cost : null,
          });
        }
      }
    }
    await this.flush();
  }

  report() {
    const tokens = zero();
    for (const entry of this.entries)
      for (const key of keys) tokens[key] += entry.tokens[key];
    const usageComplete =
      this.issues.size === 0 &&
      [...this.turns.values()].every(
        (turn) => turn.completed && turn.metrics > 0,
      );
    const pricingComplete = this.entries.every(
      (entry) => entry.estimatedCostMicros !== null,
    );
    return {
      source: "codex-app-server thread/tokenUsage/updated",
      simulated: this.mode === "offline",
      configuredModel: this.config.codexModel,
      requestedServiceTier: this.config.codexServiceTier,
      appliedServiceTier: null,
      pricingBasis:
        "Estimate at the requested tier; app-server usage events do not expose the provider's applied tier. Reasoning is included in output, and cache reads/writes are included in input.",
      usageComplete,
      pricingComplete,
      turns: this.turns.size,
      responses: this.entries.length,
      tokens,
      estimatedCostMicros: pricingComplete
        ? this.entries.reduce(
            (sum, entry) => sum + entry.estimatedCostMicros!,
            0,
          )
        : null,
      issues: [...this.issues],
      entries: this.entries,
    };
  }

  flush() {
    if (!this.directory) return this.writing;
    const report = redactManualText(JSON.stringify(this.report(), null, 2));
    const filename = path.join(this.directory, "codex-usage.json");
    this.writing = this.writing.then(async () => {
      await writeFile(`${filename}.tmp`, report, { mode: 0o600 });
      await rename(`${filename}.tmp`, filename);
    });
    return this.writing;
  }
}
