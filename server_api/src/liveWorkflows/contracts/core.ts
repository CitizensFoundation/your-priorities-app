import { z } from "zod";

export type UUID = string;
export type ISODateTime = string;
export type ByteCount = number;
export type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };

export type ResearchGitHubSource = {
  repositoryFullName: string;
  branchName: string;
  folderPath: string;
  htmlUrl: string;
};

export const ScopeTypes = [
  "user",
  "domain",
  "community",
  "group",
  "experiment",
  "run",
  "run_step",
  "session",
  "boundary",
  "artifact",
  "dataset",
  "finding",
  "signal",
  "paper",
  "knowledge_source",
  "sweep_job",
  "knowledge_document",
  "knowledge_document_chunk",
  "knowledge_signal",
  "science_agent_run",
  "project_corpus",
  "hypothesis",
  "research_embedding",
  "embedding_job",
  "morning_brief",
  "dynamic_paper",
  "dynamic_paper_revision",
  "dynamic_paper_section",
  "dynamic_paper_claim",
  "dynamic_paper_evidence_link",
  "dynamic_paper_update",
  "evolution_program",
  "evolution_round",
  "evolution_candidate",
  "evolution_evaluation",
  "evolution_archive_cell",
  "review_case",
  "vm",
] as const;

export type ScopeType = (typeof ScopeTypes)[number];

export interface ScopeRef {
  type: ScopeType;
  id: UUID;
}

export const UUIDSchema = z.string().min(1);
export const ISODateTimeSchema = z.string().datetime({ offset: true });

export const ResearchGitHubSourceSchema = z
  .object({
    repositoryFullName: z.string().min(1),
    branchName: z.string().min(1),
    folderPath: z.string().min(1),
    htmlUrl: z.url(),
  })
  .strict() satisfies z.ZodType<ResearchGitHubSource>;

const ByteCountInputSchema = z.union([
  z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
  z.string().regex(/^\d+$/u),
]);

export const ByteCountSchema = z.codec(
  ByteCountInputSchema,
  z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
  {
    decode: (value, context) => {
      if (typeof value === "number") return value;
      const parsed = BigInt(value);
      if (parsed > BigInt(Number.MAX_SAFE_INTEGER)) {
        context.issues.push({
          code: "too_big",
          inclusive: true,
          maximum: Number.MAX_SAFE_INTEGER,
          message: "Byte count must not exceed Number.MAX_SAFE_INTEGER",
          origin: "number",
          input: value,
        });
        return z.NEVER;
      }
      return Number(parsed);
    },
    encode: (value) => value,
  }
);

export const JsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(JsonSchema),
    z.record(z.string(), JsonSchema),
  ])
);

export const ScopeTypeSchema = z.enum(ScopeTypes);

export const ScopeRefSchema = z
  .object({
    type: ScopeTypeSchema,
    id: UUIDSchema,
  })
  .strict() satisfies z.ZodType<ScopeRef>;
