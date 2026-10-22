import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { z } from "zod";
import type { WorkflowStore } from "./store.js";
import type { AssetService } from "./assets.js";
import { requireRun } from "./budget.js";
import { ConflictError, ValidationError } from "./services/errors.js";

export const resultQuery = z.object({
  offset: z.coerce.number().int().min(0).max(1_000_000).default(0),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  search: z.string().max(200).default(""),
  filter: z
    .enum(["all", "failed", "unknown", "children", "parents"])
    .default("all"),
  compare: z.string().uuid().optional(),
});

export function resultKey(
  value: Record<string, YpWorkflowJson>,
  index: number,
) {
  return typeof value.id === "string" ? `id:${value.id}` : `row:${index}`;
}
export function matchesResult(
  value: Record<string, YpWorkflowJson>,
  search: string,
  filter: string,
) {
  const errors = Array.isArray(value.errors) && value.errors.length > 0;
  const match =
    filter === "failed"
      ? errors
      : filter === "unknown"
        ? value.status === "unknown"
        : filter === "children"
          ? typeof value.parentId === "string"
          : filter === "parents"
            ? !value.parentId
            : true;
  return (
    match &&
    (!search ||
      JSON.stringify(value).toLowerCase().includes(search.toLowerCase()))
  );
}

/** Read only bounded, checksum-verified JSON chunks emitted by the runner.
 * Ordinary uploaded JSON is never treated as a result, and group access is
 * checked by the controller before entering this service.
 */
export class ResultService {
  constructor(
    private readonly store: WorkflowStore,
    private readonly assets: AssetService,
  ) {}
  private async catalog(groupId: number, runId: string) {
    return this.store.transact(groupId, async (tx) => {
      await requireRun(tx, runId);
      return (await tx.list<YpWorkflowAsset>("asset"))
        .filter(
          (a) => a.source === "artifact" && a.resultSet?.runId === runId,
        )
        .sort((a, b) => a.resultSet!.part - b.resultSet!.part);
    });
  }
  private async *rows(groupId: number, assets: YpWorkflowAsset[]) {
    let index = 0;
    // Individual chunks are at most 1 MiB. Scan sequentially to bound memory.
    for (const asset of assets) {
      if (asset.bytes > 1_048_576)
        throw new ValidationError("Result chunk is too large");
      const content = await readFile(this.assets.path(groupId, asset.id));
      if (
        createHash("sha256").update(content).digest("hex") !==
        asset.checksum
      )
        throw new ConflictError("Result checksum changed");
      const values = z
        .array(z.record(z.string(), z.unknown()))
        .max(100)
        .parse(JSON.parse(content.toString()));
      for (const value of values) {
        const row = value as Record<string, YpWorkflowJson>;
        yield { key: resultKey(row, index++), value: row };
      }
    }
  }
  async page(
    groupId: number,
    runId: string,
    query: unknown,
  ): Promise<YpWorkflowResultPage> {
    const q = resultQuery.parse(query);
    const assets = await this.catalog(groupId, runId);
    const comparison = q.compare
      ? await this.catalog(groupId, q.compare)
      : [];
    let total = 0;
    const rows: YpWorkflowResultPage["rows"] = [];
    for await (const row of this.rows(groupId, assets)) {
      if (!matchesResult(row.value, q.search, q.filter)) continue;
      if (total >= q.offset && rows.length < q.limit) rows.push(row);
      total++;
    }
    if (comparison.length) {
      const wanted = new Map(rows.map((row) => [row.key, row]));
      for await (const row of this.rows(groupId, comparison)) {
        const match = wanted.get(row.key);
        if (match) match.comparison = row.value;
      }
    }
    return {
      rows,
      total,
      offset: q.offset,
      limit: q.limit,
      available: assets.length > 0,
      comparisonAvailable: comparison.length > 0,
    };
  }
}
