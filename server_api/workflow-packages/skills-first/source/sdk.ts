import type { SkillsFirstJobDescription } from "./memoryTypes.js";
/** The runner supplies this capability interface. Packages never receive credentials. */
export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [key: string]: Json };
export interface WorkflowContext {
  nodeId: string;
  mode: "trial" | "bulk";
  configuration: Record<string, Json>;
  model(key: string, system: string, input: Json, role?: string): Promise<Json>;
  connector(
    key: string,
    binding: string,
    operation: string,
    input: Record<string, Json>,
  ): Promise<Json>;
  progress(
    processed: number,
    total: number,
    child?: string,
    failedRecords?: number,
    message?: string,
  ): Promise<void>;
  checkpoint(key: string, value: Json): Promise<void>;
  restore(key: string): Promise<Json | undefined>;
  artifact(name: string, content: string, contentType: string): Promise<void>;
  withRecord?<T>(id: string, work: () => Promise<T>): Promise<T>;
  cancelled(): Promise<boolean>;
}
export interface Job extends Partial<SkillsFirstJobDescription> {
  id: string;
  agentId?: string | number | null;
  name: string;
  text: string;
  originalText?: string;
  parentId?: string;
  parentName?: string;
  level?: { name: string; index: number; count: number };
  source: string;
  jurisdiction: string;
  status: "pending" | "complete" | "unknown";
  analysis: Record<string, Json>;
  citations: { url: string; quote: string; retrievedAt: string }[];
  rewrittenText?: string;
  errors: string[];
  metadata?: Record<string, Json>;
}
export type Agent = (context: WorkflowContext, input: Json) => Promise<Json>;
export class RecordError extends Error {
  readonly code = "record_invalid";
  /** Only explicitly supplied, already validated findings survive a failed task. */
  constructor(
    message: string,
    readonly partialJob?: Job,
  ) {
    super(message);
  }
}
export function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
export function object(value: Json): Record<string, Json> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new RecordError("Expected an object");
  return value;
}
export function jobs(value: Json): Job[] {
  if (!Array.isArray(value)) throw new Error("Expected a job array");
  for (const row of value) {
    const item = object(row);
    if (
      typeof item.id !== "string" ||
      typeof item.text !== "string" ||
      typeof item.name !== "string" ||
      !Array.isArray(item.citations) ||
      !Array.isArray(item.errors)
    )
      throw new Error("Invalid normalized job");
  }
  return value as unknown as Job[];
}
export function asJson(value: unknown): Json {
  return JSON.parse(JSON.stringify(value)) as Json;
}
/** Keep lineage in artifacts, but never expose sibling qualifications to a child agent. */
export function promptJob(job: Job) {
  const {
    id,
    name,
    text,
    source,
    jurisdiction,
    status,
    analysis,
    citations,
    errors,
    parentId,
    level,
    titleCode,
    variant,
    cscRevised,
    rewrittenText,
  } = job;
  // A whitelist also excludes arbitrary original CSV columns carried on legacy records.
  return {
    id,
    name,
    text,
    source,
    jurisdiction,
    status,
    analysis,
    citations,
    errors,
    parentId,
    level,
    titleCode,
    variant,
    cscRevised,
    rewrittenText,
  };
}
export function boundedInteger(
  value: Json | undefined,
  fallback: number,
  min: number,
  max: number,
): number {
  if (value === undefined) return fallback;
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < min ||
    value > max
  )
    throw new Error(
      `Configuration must be an integer between ${min} and ${max}`,
    );
  return value;
}

/** Per-record checkpoints and stable request keys make resume deterministic. */
export async function processJobs(
  context: WorkflowContext,
  input: Json,
  process: (job: Job) => Promise<Job>,
): Promise<Json> {
  const items = jobs(input);
  const output: Job[] = new Array(items.length);
  const concurrency = Math.max(
    1,
    Math.min(8, Number(context.configuration.concurrency ?? 2)),
  );
  let cursor = 0,
    complete = 0,
    failedRecords = 0;
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, async () => {
      while (cursor < items.length) {
        const index = cursor++;
        const item = items[index];
        if (await context.cancelled())
          throw new Error("Run is paused or cancelled");
        const checkpoint = await context.restore(item.id);
        if (checkpoint) output[index] = checkpoint as unknown as Job;
        else {
          await context.progress(
            complete,
            items.length,
            undefined,
            failedRecords,
            `Processing ${item.name}`,
          );
          try {
            output[index] = item.errors.length
              ? structuredClone(item)
              : context.withRecord
                ? await context.withRecord(item.parentId ?? item.id, () =>
                    process(structuredClone(item)),
                  )
                : await process(structuredClone(item));
          } catch (error) {
            // Provider/network/budget errors must pause the run, never become
            // successful records. Only explicit data-validation failures are isolated.
            if (
              !(error instanceof Error) ||
              (error as Error & { code?: string }).code !== "record_invalid"
            )
              throw error;
            const partial = (error as RecordError).partialJob;
            if (partial && partial.id !== item.id)
              throw new Error("Partial analysis changed the record identity");
            output[index] = structuredClone(partial ?? item);
            output[index].status = "unknown";
            output[index].errors.push(`${context.nodeId}: ${error.message}`);
          }
          await context.checkpoint(item.id, asJson(output[index]));
        }
        if (output[index].errors.length) failedRecords++;
        await context.progress(
          ++complete,
          items.length,
          undefined,
          failedRecords,
          `${checkpoint ? "Restored saved result for" : output[index].errors.length ? "Needs review:" : "Processed"} ${item.name}`,
        );
      }
    }),
  );
  return asJson(output);
}
