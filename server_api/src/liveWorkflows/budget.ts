import type { WorkflowStore, WorkflowTransaction } from "./store.js";
import { ConflictError, NotFoundError } from "./services/errors.js";
import { fingerprint, safeMicros } from "./schemas.js";

export interface UsageReservation {
  id: string;
  runId: string;
  nodeId: string;
  recordId?: string;
  fingerprint: string;
  status: "reserved" | "settled" | "unknown";
  maximumMicros: number;
  actualMicros?: number;
  result?: YpWorkflowJson;
  description: string;
  createdAt: string;
}
export class BudgetService {
  constructor(private readonly store: WorkflowStore) {}
  async reserve(
    groupId: number,
    input: {
      id: string;
      runId: string;
      nodeId: string;
      recordId?: string;
      maximumMicros: number;
      request: unknown;
      description: string;
      requestLimit?: { key: string; maximum: number };
    },
  ): Promise<{ reservation: UsageReservation; cached: boolean }> {
    safeMicros(input.maximumMicros);
    const outcome = await this.store.transact(groupId, async (tx) => {
      const hash = fingerprint(input.request);
      const existing = await tx.get<UsageReservation>("usage", input.id);
      if (existing) {
        if (
          existing.fingerprint !== hash ||
          existing.runId !== input.runId ||
          existing.nodeId !== input.nodeId
        )
          throw new ConflictError(
            "Request ID was reused with different contents",
          );
        if (existing.status !== "settled")
          throw new ConflictError(
            "Request outcome is pending or unknown; reconcile it before retrying",
            "usage_unknown",
          );
        return { reservation: existing, cached: true };
      }
      const run = await tx.get<YpWorkflowRun>("run", input.runId);
      if (!run) throw new NotFoundError("Run", input.runId);
      if (run.status !== "running")
        throw new ConflictError("Run is not running", "run_paused");
      if (!run.nodeIds.includes(input.nodeId))
        throw new ConflictError("Agent is outside this approved run");
      const state = tx.state;
      run.nodeCosts ??= {};
      const nodeCost = (run.nodeCosts[input.nodeId] ??= {
        spentMicros: 0,
        reservedMicros: 0,
        requests: 0,
      });
      const nodeLimit =
        run.nodeBudgets?.[input.nodeId] ??
        run.graph.nodes.find((n) => n.id === input.nodeId)?.budgetMicros;
      const exceeds =
        (nodeLimit !== undefined &&
          nodeCost.spentMicros +
            nodeCost.reservedMicros +
            input.maximumMicros >
            nodeLimit) ||
        run.spentMicros + run.reservedMicros + input.maximumMicros >
          run.budgetMicros ||
        state.spentMicros + state.reservedMicros + input.maximumMicros >
          state.config.budgetMicros ||
        (run.mode === "trial" &&
          state.trialSpentMicros +
            state.trialReservedMicros +
            input.maximumMicros >
            state.config.trialBudgetMicros);
      if (exceeds) {
        run.status = "paused";
        run.error =
          "The next request would exceed an agent, run, or workspace spending limit. Review the approved allowances or cancel this run.";
        await tx.put("run", run.id, run);
        await tx.emit("run.budget_paused", {
          runId: run.id,
          nextRequestMicros: input.maximumMicros,
        });
        return null;
      }
      if (input.requestLimit) {
        const key = `${run.id}:${fingerprint({ nodeId: input.nodeId, key: input.requestLimit.key })}`;
        const count = (await tx.get<number>("request-count", key)) ?? 0;
        if (count >= input.requestLimit.maximum)
          throw new ConflictError(
            "The approved document request limit has been reached",
          );
        await tx.put("request-count", key, count + 1);
      }
      run.reservedMicros += input.maximumMicros;
      nodeCost.reservedMicros += input.maximumMicros;
      nodeCost.requests++;
      state.reservedMicros += input.maximumMicros;
      if (run.mode === "trial")
        state.trialReservedMicros += input.maximumMicros;
      const reservation: UsageReservation = {
        id: input.id,
        runId: run.id,
        nodeId: input.nodeId,
        ...(input.recordId ? { recordId: input.recordId } : {}),
        maximumMicros: input.maximumMicros,
        fingerprint: hash,
        status: "reserved",
        description: input.description,
        createdAt: new Date().toISOString(),
      };
      await tx.put("run", run.id, run);
      await tx.put("usage", reservation.id, reservation);
      await tx.emit("usage.reserved", {
        runId: run.id,
        nodeId: input.nodeId,
        ...(input.recordId ? { recordId: input.recordId } : {}),
        maximumMicros: input.maximumMicros,
      });
      return { reservation, cached: false };
    });
    // Commit the pause before reporting the refused request; throwing inside the transaction rolls it back.
    if (!outcome)
      throw new ConflictError(
        "The next request would exceed a spending limit",
        "budget_exceeded",
      );
    return outcome;
  }
  async settle(
    groupId: number,
    id: string,
    actualMicros: number,
    result: YpWorkflowJson,
    reconcile = false,
  ) {
    safeMicros(actualMicros);
    return this.store.transact(groupId, async (tx) => {
      const item = await tx.get<UsageReservation>("usage", id);
      if (!item) throw new NotFoundError("Usage request", id);
      if (reconcile && item.status !== "unknown")
        throw new ConflictError(
          "Only requests with an unknown outcome can be reconciled",
        );
      if (item.status === "settled") return;
      const run = (await tx.get<YpWorkflowRun>("run", item.runId))!;
      item.status = "settled";
      item.actualMicros = actualMicros;
      item.result = result;
      run.reservedMicros -= item.maximumMicros;
      run.spentMicros += actualMicros;
      if (
        run.mode === "trial" &&
        item.recordId &&
        run.sample?.recordIds.includes(item.recordId)
      ) {
        run.recordCosts ??= {};
        run.recordCosts[item.recordId] =
          (run.recordCosts[item.recordId] ?? 0) + actualMicros;
      }
      const nodeCost = run.nodeCosts?.[item.nodeId];
      if (nodeCost) {
        nodeCost.reservedMicros -= item.maximumMicros;
        nodeCost.spentMicros += actualMicros;
      }
      tx.state.reservedMicros -= item.maximumMicros;
      tx.state.spentMicros += actualMicros;
      if (run.mode === "trial") {
        tx.state.trialReservedMicros -= item.maximumMicros;
        tx.state.trialSpentMicros += actualMicros;
      }
      if (actualMicros > item.maximumMicros) {
        run.status = "paused";
        run.error =
          "Provider exceeded its configured price bound; pricing must be reconciled";
      }
      await tx.put("run", run.id, run);
      await tx.put("usage", id, item);
      await tx.emit("usage.settled", {
        runId: run.id,
        nodeId: item.nodeId,
        actualMicros,
        requestId: id,
      });
    });
  }
  async unknown(groupId: number, id: string) {
    await this.store.transact(groupId, async (tx) => {
      const item = await tx.get<UsageReservation>("usage", id);
      if (!item || item.status === "settled") return;
      item.status = "unknown";
      await tx.put("usage", id, item);
      const run = (await tx.get<YpWorkflowRun>("run", item.runId))!;
      if (run.status === "running") run.status = "paused";
      run.error =
        "A paid request has an unknown outcome. Its reservation is retained until reconciled.";
      await tx.put("run", run.id, run);
      await tx.emit("usage.unknown", { runId: run.id, requestId: id });
    });
  }
  /** After restart, never resend a request which may already have been billed. */
  async recover(groupId: number, now = Date.now()) {
    const pending = await this.store.transact(groupId, (tx) =>
      tx.list<UsageReservation>("usage"),
    );
    // Other API processes may still be serving requests. All providers have a timeout below five minutes.
    for (const item of pending.filter(
      (i) =>
        i.status === "reserved" && now - Date.parse(i.createdAt) > 300_000,
    ))
      await this.unknown(groupId, item.id);
  }
}

export function estimateFromTrial(
  trial: YpWorkflowRun,
  populationCount: number,
): YpWorkflowEstimate {
  if (
    trial.mode !== "trial" ||
    trial.status !== "completed" ||
    trial.inputCount < 1 ||
    trial.reservedMicros
  )
    throw new ConflictError(
      "A completed and reconciled trial is required",
    );
  const expectedMicros = safeMicros(
    Math.ceil((trial.spentMicros * populationCount) / trial.inputCount),
  );
  const ids = trial.sample?.recordIds ?? [];
  const attributed = ids.reduce(
    (sum, id) => sum + (trial.recordCosts?.[id] ?? 0),
    0,
  );
  const coverage = Math.min(1, trial.inputCount / populationCount);
  const attributedCostFraction = trial.spentMicros
    ? attributed / trial.spentMicros
    : 1;
  const overhead = ids.length
    ? Math.max(0, trial.spentMicros - attributed) / ids.length
    : 0;
  const costs = ids.map((id) => (trial.recordCosts?.[id] ?? 0) + overhead);
  const mean = trial.spentMicros / trial.inputCount;
  const variance =
    costs.length > 1
      ? costs.reduce((sum, cost) => sum + (cost - mean) ** 2, 0) /
        (costs.length - 1)
      : 0;
  const deviation = Math.sqrt(variance);
  const needsMoreEvidence =
    coverage < 1 &&
    (ids.length < 5 ||
      attributedCostFraction < 0.95 ||
      deviation > mean * 0.5);
  const recommendedSampleCount = Math.min(
    populationCount,
    20,
    Math.max(
      5,
      trial.inputCount,
      needsMoreEvidence ? trial.inputCount * 2 : trial.inputCount,
    ),
  );
  const upperMicros = safeMicros(
    Math.ceil(
      Math.max(
        expectedMicros * 2,
        (mean + deviation * 2) * populationCount,
      ),
    ),
  );
  return {
    fingerprint: trial.fingerprint,
    trialRunId: trial.id,
    sampleCount: trial.inputCount,
    populationCount,
    expectedMicros,
    upperMicros,
    evidence: {
      coverage,
      attributedCostFraction,
      minRecordMicros: Math.floor(
        costs.length ? Math.min(...costs) : mean,
      ),
      maxRecordMicros: Math.ceil(costs.length ? Math.max(...costs) : mean),
      standardDeviationMicros: Math.ceil(deviation),
      recommendedSampleCount,
      needsMoreEvidence,
    },
    ...(trial.nodeCosts
      ? {
          agents: trial.nodeIds.map((nodeId) => {
            const sampleMicros =
              trial.nodeCosts?.[nodeId]?.spentMicros ?? 0;
            const expectedMicros = safeMicros(
              Math.ceil(
                (sampleMicros * populationCount) / trial.inputCount,
              ),
            );
            return {
              nodeId,
              sampleMicros,
              expectedMicros,
              upperMicros: safeMicros(expectedMicros * 2),
            };
          }),
        }
      : {}),
    notes: [
      "Stratified sample by input length; web fanout and retries can vary.",
      ...(needsMoreEvidence
        ? [
            recommendedSampleCount > trial.inputCount
              ? `Run a larger trial of ${recommendedSampleCount} parent records before committing a large allowance.`
              : "Variation or unattributed costs remain high at the trial size limit. Inspect expensive records and use a smaller bulk allowance.",
          ]
        : []),
      ...(ids.length
        ? [
            `Observed parent-record cost range ${Math.floor(Math.min(...costs))}–${Math.ceil(Math.max(...costs))} microdollars; unattributed costs are spread evenly.`,
          ]
        : [
            "This older trial has no per-record cost attribution; variation cannot be measured.",
          ]),
      "The upper estimate is a conservative projection, not a statistical guarantee. The approved dollar cap is enforced separately.",
    ],
  };
}

/** Progress-based projection, never used to authorize spending. Work already
 * in flight may be included in observed averages, so this errs upward. */
export function remainingForecast(
  run: YpWorkflowRun,
): NonNullable<YpWorkflowRun["forecast"]> {
  let remaining = 0;
  if (!["completed", "cancelled", "failed"].includes(run.status)) {
    for (const nodeId of run.nodeIds) {
      const progress = run.nodeStates[nodeId];
      if (progress?.status === "completed") continue;
      const spent = run.nodeCosts?.[nodeId]?.spentMicros ?? 0;
      const baseline =
        run.estimate?.agents?.find((a) => a.nodeId === nodeId)
          ?.expectedMicros ?? 0;
      const observed = progress?.processed
        ? (spent * progress.total) / progress.processed
        : 0;
      remaining += Math.max(0, Math.max(baseline, observed) - spent);
    }
  }
  remaining = Math.ceil(Math.max(remaining, run.reservedMicros));
  const total = run.spentMicros + remaining;
  return {
    remainingMicros:
      total > Number.MAX_SAFE_INTEGER
        ? Number.MAX_SAFE_INTEGER - run.spentMicros
        : remaining,
    totalMicros: Math.min(Number.MAX_SAFE_INTEGER, total),
    exceedsAllowance: total > run.budgetMicros,
    basis:
      "Higher of trial projection and observed agent progress; includes outstanding reservations. Not a spending authorization.",
  };
}

export async function requireRun(
  tx: WorkflowTransaction,
  id: string,
): Promise<YpWorkflowRun> {
  const run = await tx.get<YpWorkflowRun>("run", id);
  if (!run) throw new NotFoundError("Run", id);
  return run;
}
