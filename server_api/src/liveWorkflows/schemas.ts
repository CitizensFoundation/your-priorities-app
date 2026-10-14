import { z } from "zod";
import { createHash } from "node:crypto";
import { workflowModelDefaults } from "./modelDefaults.js";

export const money = z.number().int().min(0).max(1_000_000_000_000);
export const reasoningEffortSchema = z.enum([
  "low",
  "medium",
  "high",
  "xhigh",
  "max",
]);
export const codexReasoningEffortSchema = z.enum([
  "none",
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
  "max",
]);
export const assistantSettingsSchema = z
  .object({
    model: z.string().trim().min(1).max(160),
    reasoningEffort: codexReasoningEffortSchema,
    serviceTier: z.enum(["regular", "fast"]),
  })
  .strict();
export const assistantSettingsUpdateSchema = z
  .object({
    settings: assistantSettingsSchema,
    expected: assistantSettingsSchema,
  })
  .strict();
export const identifier = z
  .string()
  .regex(/^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,127}$/);
export const json: z.ZodType<YpWorkflowJson> = z.lazy(() =>
  z.union([
    z.null(),
    z.boolean(),
    z.number().finite(),
    z.string(),
    z.array(json),
    z.record(z.string(), json),
  ]),
);
export const nodeSchema = z
  .object({
    id: identifier,
    kind: z.enum(["agent", "connector", "artifact"]),
    label: z.string().min(1).max(160),
    description: z.string().max(2000).optional(),
    entrypoint: z
      .string()
      .regex(/^source\/[\w./-]+\.ts$/)
      .refine((p) => !p.includes(".."), "Unsafe entrypoint")
      .optional(),
    enabled: z.boolean(),
    budgetMicros: money.positive().optional(),
    models: z.record(identifier, z.string().min(1).max(160)),
    reasoningEffort: reasoningEffortSchema.optional(),
    configuration: z.record(z.string(), json),
    position: z
      .object({ x: z.number().finite(), y: z.number().finite() })
      .strict(),
  })
  .strict();
export const graphSchema = z
  .object({
    nodes: z.array(nodeSchema).min(1).max(200),
    edges: z
      .array(
        z
          .object({
            id: identifier,
            source: identifier,
            target: identifier,
            label: z.string().max(160).optional(),
          })
          .strict(),
      )
      .max(1000),
  })
  .strict()
  .superRefine((graph, ctx) => {
    const nodes = new Map(graph.nodes.map((n) => [n.id, n]));
    if (nodes.size !== graph.nodes.length)
      ctx.addIssue({ code: "custom", message: "Duplicate node IDs" });
    if (new Set(graph.edges.map((e) => e.id)).size !== graph.edges.length)
      ctx.addIssue({ code: "custom", message: "Duplicate edge IDs" });
    for (const node of graph.nodes)
      if (node.kind === "agent" && !node.entrypoint)
        ctx.addIssue({
          code: "custom",
          message: `Missing entrypoint: ${node.id}`,
        });
    const visiting = new Set<string>(),
      visited = new Set<string>();
    const visit = (id: string): boolean => {
      if (visiting.has(id)) return false;
      if (visited.has(id)) return true;
      visiting.add(id);
      for (const edge of graph.edges.filter((e) => e.source === id))
        if (!visit(edge.target)) return false;
      visiting.delete(id);
      visited.add(id);
      return true;
    };
    for (const edge of graph.edges)
      if (!nodes.has(edge.source) || !nodes.has(edge.target))
        ctx.addIssue({
          code: "custom",
          message: "Edge references unknown node",
        });
    if (graph.nodes.some((n) => !visit(n.id)))
      ctx.addIssue({
        code: "custom",
        message: "Processing graph must be acyclic",
      });
  });
export const configSchema = z
  .object({
    packageId: identifier.refine((id) => !id.includes("..")),
    hostId: z.string().uuid(),
    codexModel: z
      .string()
      .trim()
      .min(1)
      .max(160)
      .default(workflowModelDefaults.codexModel),
    codexReasoningEffort: codexReasoningEffortSchema.default(
      workflowModelDefaults.codexReasoningEffort,
    ),
    codexServiceTier: z.enum(["regular", "fast"]).default("regular"),
    operatorIds: z.array(z.number().int().positive()).max(100),
    budgetMicros: money,
    trialBudgetMicros: money.default(5_000_000),
    quotaBytes: z
      .number()
      .int()
      .min(1)
      .max(1_000_000_000_000)
      .default(10 * 1024 ** 3),
    concurrency: z.number().int().min(1).max(16).default(2),
  })
  .strict();
export const configurationUpdateSchema = configSchema.extend({
  expectedAssistantSettings: assistantSettingsSchema.optional(),
});
export const connectorSchema = z
  .object({
    id: identifier,
    label: z.string().min(1).max(160),
    kind: z.enum([
      "your-priorities",
      "google-sheets",
      "google-docs",
      "google-drive",
      "firecrawl",
    ]),
    resourceId: z.string().max(256),
    writeEnabled: z.boolean(),
    settings: z.record(z.string(), json),
  })
  .strict();
export function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object")
    return `{${Object.entries(value)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`)
      .join(",")}}`;
  return JSON.stringify(value);
}
export function fingerprint(value: unknown): string {
  return createHash("sha256").update(canonical(value)).digest("hex");
}
export function safeMicros(value: number): number {
  return money.parse(value);
}
export function tokenCost(tokens: number, microsPerMillion: number): number {
  if (!Number.isSafeInteger(tokens) || tokens < 0)
    throw new Error("Invalid token count");
  safeMicros(microsPerMillion);
  return safeMicros(
    Number((BigInt(tokens) * BigInt(microsPerMillion) + 999_999n) / 1_000_000n),
  );
}
