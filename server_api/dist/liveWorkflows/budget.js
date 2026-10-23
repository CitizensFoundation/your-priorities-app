import { ConflictError, NotFoundError } from "./services/errors.js";
import { fingerprint, safeMicros } from "./schemas.js";
import { workflowSocketTimeoutMs } from "./runner/modelLimits.js";
export class BudgetService {
    constructor(store) {
        this.store = store;
    }
    async reserve(groupId, input) {
        safeMicros(input.maximumMicros);
        const outcome = await this.store.transact(groupId, async (tx) => {
            var _a, _b, _c;
            const hash = fingerprint(input.request);
            const existing = await tx.get("usage", input.id);
            if (existing) {
                if (existing.fingerprint !== hash ||
                    existing.runId !== input.runId ||
                    existing.nodeId !== input.nodeId)
                    throw new ConflictError("Request ID was reused with different contents");
                if (existing.status !== "settled")
                    throw new ConflictError("Request outcome is pending or unknown; reconcile it before retrying", "usage_unknown");
                return { reservation: existing, cached: true };
            }
            const run = await tx.get("run", input.runId);
            if (!run)
                throw new NotFoundError("Run", input.runId);
            if (run.status !== "running")
                throw new ConflictError("Run is not running", "run_paused");
            if (!run.nodeIds.includes(input.nodeId))
                throw new ConflictError("Agent is outside this approved run");
            const state = tx.state;
            run.nodeCosts ?? (run.nodeCosts = {});
            const nodeCost = ((_a = run.nodeCosts)[_b = input.nodeId] ?? (_a[_b] = {
                spentMicros: 0,
                reservedMicros: 0,
                requests: 0,
            }));
            const nodeLimit = run.nodeBudgets?.[input.nodeId] ??
                run.graph.nodes.find((n) => n.id === input.nodeId)?.budgetMicros;
            const recordLimit = run.nodeRecordBudgets?.[input.nodeId] ??
                run.graph.nodes.find((n) => n.id === input.nodeId)?.recordBudgetMicros;
            if (recordLimit !== undefined && !input.recordId)
                throw new ConflictError("This agent requires parent-record attribution for its spending cap");
            if (run.reuse?.nodeIds.includes(input.nodeId))
                throw new ConflictError("Reused stages cannot issue new paid requests");
            const recordKey = input.recordId
                ? fingerprint([input.nodeId, input.recordId])
                : undefined;
            const recordCost = recordKey
                ? ((_c = (run.recordNodeCosts ?? (run.recordNodeCosts = {})))[recordKey] ?? (_c[recordKey] = {
                    spentMicros: 0,
                    reservedMicros: 0,
                    requests: 0,
                }))
                : undefined;
            const exceeds = (recordLimit !== undefined &&
                recordCost.spentMicros +
                    recordCost.reservedMicros +
                    input.maximumMicros >
                    recordLimit) ||
                (nodeLimit !== undefined &&
                    nodeCost.spentMicros + nodeCost.reservedMicros + input.maximumMicros >
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
                    "The next request would exceed a parent-record, agent, run, or workspace spending limit. Review the approved allowances or cancel this run.";
                await tx.put("run", run.id, run);
                await tx.emit("run.budget_paused", {
                    runId: run.id,
                    nextRequestMicros: input.maximumMicros,
                });
                return null;
            }
            if (input.requestLimit) {
                const key = `${run.id}:${fingerprint({ nodeId: input.nodeId, key: input.requestLimit.key })}`;
                const count = (await tx.get("request-count", key)) ?? 0;
                if (count >= input.requestLimit.maximum)
                    throw new ConflictError("The approved document request limit has been reached");
                await tx.put("request-count", key, count + 1);
            }
            run.reservedMicros += input.maximumMicros;
            nodeCost.reservedMicros += input.maximumMicros;
            nodeCost.requests++;
            if (recordCost) {
                recordCost.reservedMicros += input.maximumMicros;
                recordCost.requests++;
            }
            state.reservedMicros += input.maximumMicros;
            if (run.mode === "trial")
                state.trialReservedMicros += input.maximumMicros;
            const reservation = {
                id: input.id,
                runId: run.id,
                nodeId: input.nodeId,
                ...(input.recordId ? { recordId: input.recordId } : {}),
                maximumMicros: input.maximumMicros,
                fingerprint: hash,
                status: "reserved",
                description: input.description,
                createdAt: new Date().toISOString(),
                ...(input.creditUsage ? { creditUsage: { ...input.creditUsage } } : {}),
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
            throw new ConflictError("The next request would exceed a spending limit", "budget_exceeded");
        return outcome;
    }
    async settle(groupId, id, actualMicros, result, reconcile = false) {
        safeMicros(actualMicros);
        return this.store.transact(groupId, async (tx) => {
            const item = await tx.get("usage", id);
            if (!item)
                throw new NotFoundError("Usage request", id);
            if (reconcile && item.status !== "unknown")
                throw new ConflictError("Only requests with an unknown outcome can be reconciled");
            if (item.status === "settled")
                return;
            if (item.creditUsage) {
                const credits = result && typeof result === "object" && !Array.isArray(result)
                    ? result.creditsUsed
                    : undefined;
                if (typeof credits !== "number" ||
                    !Number.isSafeInteger(credits) ||
                    credits < 0 ||
                    credits * item.creditUsage.creditMicros !== actualMicros)
                    throw new ConflictError("Firecrawl settlement requires verified creditsUsed matching the frozen credit price");
                item.creditUsage.actualCredits = credits;
            }
            const run = (await tx.get("run", item.runId));
            item.status = "settled";
            item.actualMicros = actualMicros;
            item.result = result;
            run.reservedMicros -= item.maximumMicros;
            run.spentMicros += actualMicros;
            if (run.mode === "trial" &&
                item.recordId &&
                run.sample?.recordIds.includes(item.recordId)) {
                run.recordCosts ?? (run.recordCosts = {});
                run.recordCosts[item.recordId] =
                    (run.recordCosts[item.recordId] ?? 0) + actualMicros;
            }
            const nodeCost = run.nodeCosts?.[item.nodeId];
            const recordCost = item.recordId
                ? run.recordNodeCosts?.[fingerprint([item.nodeId, item.recordId])]
                : undefined;
            if (recordCost) {
                recordCost.reservedMicros -= item.maximumMicros;
                recordCost.spentMicros += actualMicros;
            }
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
    async unknown(groupId, id) {
        await this.store.transact(groupId, async (tx) => {
            const item = await tx.get("usage", id);
            if (!item || item.status === "settled")
                return;
            item.status = "unknown";
            await tx.put("usage", id, item);
            const run = (await tx.get("run", item.runId));
            if (run.status === "running")
                run.status = "paused";
            run.error =
                "A paid request has an unknown outcome. Its reservation is retained until reconciled.";
            await tx.put("run", run.id, run);
            await tx.emit("usage.unknown", { runId: run.id, requestId: id });
        });
    }
    /** After restart, never resend a request which may already have been billed. */
    async recover(groupId, now = Date.now()) {
        const pending = await this.store.transact(groupId, (tx) => tx.list("usage"));
        // Another API process may still be serving a long reasoning request.
        // Allow the provider, gateway and settlement grace periods before recovery.
        for (const item of pending.filter((i) => i.status === "reserved" &&
            now - Date.parse(i.createdAt) > workflowSocketTimeoutMs))
            await this.unknown(groupId, item.id);
    }
}
export function estimateFromTrial(trial, populationCount) {
    if (trial.mode !== "trial" ||
        trial.reuse ||
        trial.status !== "completed" ||
        trial.inputCount < 1 ||
        trial.reservedMicros)
        throw new ConflictError("A completed and reconciled trial is required");
    const expectedMicros = safeMicros(Math.ceil((trial.spentMicros * populationCount) / trial.inputCount));
    const ids = trial.sample?.recordIds ?? [];
    const attributed = ids.reduce((sum, id) => sum + (trial.recordCosts?.[id] ?? 0), 0);
    const coverage = Math.min(1, trial.inputCount / populationCount);
    const attributedCostFraction = trial.spentMicros
        ? attributed / trial.spentMicros
        : 1;
    const overhead = ids.length
        ? Math.max(0, trial.spentMicros - attributed) / ids.length
        : 0;
    const costs = ids.map((id) => (trial.recordCosts?.[id] ?? 0) + overhead);
    const mean = trial.spentMicros / trial.inputCount;
    const variance = costs.length > 1
        ? costs.reduce((sum, cost) => sum + (cost - mean) ** 2, 0) /
            (costs.length - 1)
        : 0;
    const deviation = Math.sqrt(variance);
    const needsMoreEvidence = coverage < 1 &&
        (ids.length < 5 || attributedCostFraction < 0.95 || deviation > mean * 0.5);
    const recommendedSampleCount = Math.min(populationCount, 20, Math.max(5, trial.inputCount, needsMoreEvidence ? trial.inputCount * 2 : trial.inputCount));
    const upperMicros = safeMicros(Math.ceil(Math.max(expectedMicros * 2, (mean + deviation * 2) * populationCount)));
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
            minRecordMicros: Math.floor(costs.length ? Math.min(...costs) : mean),
            maxRecordMicros: Math.ceil(costs.length ? Math.max(...costs) : mean),
            standardDeviationMicros: Math.ceil(deviation),
            recommendedSampleCount,
            needsMoreEvidence,
        },
        ...(trial.nodeCosts
            ? {
                agents: trial.nodeIds.map((nodeId) => {
                    const sampleMicros = trial.nodeCosts?.[nodeId]?.spentMicros ?? 0;
                    const expectedMicros = safeMicros(Math.ceil((sampleMicros * populationCount) / trial.inputCount));
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
export function remainingForecast(run) {
    let remaining = 0;
    if (!["completed", "cancelled", "failed"].includes(run.status)) {
        for (const nodeId of run.nodeIds) {
            const progress = run.nodeStates[nodeId];
            if (progress?.status === "completed")
                continue;
            const spent = run.nodeCosts?.[nodeId]?.spentMicros ?? 0;
            const baseline = run.estimate?.agents?.find((a) => a.nodeId === nodeId)
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
        remainingMicros: total > Number.MAX_SAFE_INTEGER
            ? Number.MAX_SAFE_INTEGER - run.spentMicros
            : remaining,
        totalMicros: Math.min(Number.MAX_SAFE_INTEGER, total),
        exceedsAllowance: total > run.budgetMicros,
        basis: "Higher of trial projection and observed agent progress; includes outstanding reservations. Not a spending authorization.",
    };
}
/** Forecast only remaining work on an already-processed bulk population. The
 * evidence still comes from a fresh full trial, never a discounted reused trial. */
export function estimateRemainingStages(trial, population, reusedNodeIds) {
    if (trial.reuse)
        throw new ConflictError("A fresh complete trial is required for a bulk rerun estimate");
    const remaining = trial.nodeIds.filter((id) => !reusedNodeIds.includes(id));
    if (!trial.nodeCosts)
        throw new ConflictError("Per-agent trial costs are required to estimate a bulk rerun");
    const evidence = structuredClone(trial);
    evidence.nodeIds = remaining;
    evidence.nodeCosts = Object.fromEntries(remaining.map((id) => [
        id,
        trial.nodeCosts[id] ?? {
            spentMicros: 0,
            reservedMicros: 0,
            requests: 0,
        },
    ]));
    evidence.spentMicros = Object.values(evidence.nodeCosts).reduce((sum, cost) => sum + cost.spentMicros, 0);
    evidence.recordCosts = Object.fromEntries((trial.sample?.recordIds ?? []).map((recordId) => [
        recordId,
        remaining.reduce((sum, nodeId) => sum +
            (trial.recordNodeCosts?.[fingerprint([nodeId, recordId])]
                ?.spentMicros ?? 0), 0),
    ]));
    const estimate = estimateFromTrial(evidence, population);
    estimate.notes.unshift(`Incremental estimate for the same previously processed inputs. Reuses ${reusedNodeIds.join(", ")}; historical costs remain on the original run. Based on fresh full trial ${trial.id}.`);
    return estimate;
}
export async function requireRun(tx, id) {
    const run = await tx.get("run", id);
    if (!run)
        throw new NotFoundError("Run", id);
    return run;
}
