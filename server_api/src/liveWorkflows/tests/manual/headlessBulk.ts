import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import type { UsageReservation } from "../../budget.js";
import { selectedAgents } from "../../packages.js";
import type { ManualHarness } from "./harness.js";
import {
  chat,
  download,
  ledger,
  results,
  save,
  upload,
  waitRun,
} from "./headlessScenarios.js";
import { exportRows, verifyAdaptedResults } from "./headlessVerification.js";

const fixture = new URL("fixtures/recruitment-batch.json", import.meta.url)
  .pathname;

export function verifyResumeLedger(
  before: UsageReservation[],
  after: UsageReservation[],
  records: number,
) {
  assert.equal(
    before.length,
    records,
    "Checkpoint must follow one level call per job",
  );
  assert.ok(
    before.every(
      (item) => item.nodeId === "levels" && item.status === "settled",
    ),
  );
  assert.deepEqual(
    after
      .filter((item) => item.nodeId === "levels")
      .sort((a, b) => a.id.localeCompare(b.id)),
    [...before].sort((a, b) => a.id.localeCompare(b.id)),
    "Recovery changed or repeated completed paid work",
  );
  assert.equal(
    after.length,
    records * 3,
    "Expected one level, degree and evidence call per job",
  );
  assert.equal(new Set(after.map((item) => item.id)).size, after.length);
  const parents = new Set(before.map((item) => item.recordId));
  assert.equal(parents.size, records);
  for (const id of parents) {
    assert.ok(id);
    assert.equal(
      after.filter((item) => item.recordId === id && item.nodeId === "analyze")
        .length,
      2,
    );
  }
}

export async function approvedBulk(
  harness: ManualHarness,
  directory: string,
  signal?: AbortSignal,
) {
  const milestone = async (
    phase: string,
    details: Record<string, unknown> = {},
  ) => {
    console.info(`[headless] approved-bulk: ${phase}`);
    await save(
      directory,
      "progress.json",
      JSON.stringify(
        { phase, at: new Date().toISOString(), ...details },
        null,
        2,
      ),
    );
  };
  const { asset, raw } = await upload(harness, fixture, signal);
  const input = exportRows.parse(raw);
  assert.equal(input.length, 10);
  const initial = await harness.request<{ hash: string }>(
    "/validate",
    "POST",
    {},
  );
  await milestone("uploaded ten jobs");
  await chat(
    harness,
    `I uploaded ${asset.name} (asset ${asset.id}), ten fictional job descriptions in an unfamiliar recruitment export. Inspect the raw data and package instructions through the workflow CLI. Create a deterministic TypeScript adapter agent named adapt-import before normalize. Preserve imported record IDs, source, titles, jurisdiction, and every duty, mandatory requirement and preference verbatim. Export the adapted input via context.artifact as adapted-jobs.json. Update graph.json with its dependencies and description, then validate. Select only evidence in analyze.configuration.tasks; the package must include its degree prerequisite. Start exactly one two-record trial with --target analyze using this asset and existing model selections. Keep rewriting, research and connectors off. Report the run ID, then finish without polling. The human admin will inspect the estimate and approve a later bulk run; do not start or approve bulk work, change budgets, install dependencies or use provider credentials.`,
    directory,
    1,
    signal,
  );
  const { run: trial, snapshot: trialSnapshot } = await waitRun(
    harness,
    undefined,
    "completed",
    signal,
  );
  assert.equal(trialSnapshot.runs.length, 1);
  assert.equal(trial.mode, "trial");
  assert.equal(trial.inputCount, 2);
  assert.deepEqual(trial.assetIds, [asset.id]);
  assert.equal(trial.targetNodeId, "analyze");
  assert.deepEqual(trial.nodeIds, [
    "adapt-import",
    "normalize",
    "levels",
    "analyze",
  ]);
  assert.deepEqual(selectedAgents(trial.graph, "analyze"), trial.nodeIds);
  assert.deepEqual(
    trial.graph.nodes.find((node) => node.id === "analyze")!.configuration
      .tasks,
    ["evidence"],
  );
  assert.notEqual(trial.sourceHash, initial.hash);
  assert.equal(trial.sample?.populationCount, 10);
  assert.equal(trial.sample?.recordIds.length, 2);
  for (const operation of ["status", "data", "validate", "trial"])
    assert.ok(
      harness.codexCalls.some(
        (call) => call.operation === operation && call.status === 200,
      ),
    );
  assert.equal(
    harness.codexCalls.filter(
      (call) => call.operation === "trial" && call.status === 200,
    ).length,
    1,
  );
  const trialDirectory = path.join(directory, "trial");
  await mkdir(trialDirectory);
  const trialResults = await results(
    harness,
    trial,
    trialDirectory,
    false,
    signal,
  );
  verifyAdaptedResults(
    raw,
    asset.id,
    trialResults.rows,
    trial.sample!.recordIds,
  );
  const trialUsage = await ledger(harness, trial);
  assert.equal(trialUsage.length, 6);
  const revision = await harness.request<{ files: Record<string, string> }>(
    `/revisions/${trial.sourceHash}`,
  );
  const adapter = trial.graph.nodes.find((node) => node.id === "adapt-import")!;
  assert.ok(adapter.entrypoint && revision.files[adapter.entrypoint]);
  await save(directory, "adapter.ts", revision.files[adapter.entrypoint]);
  await save(directory, "graph.json", JSON.stringify(trial.graph, null, 2));
  const bulk = await harness.request<YpWorkflowRun>("/runs", "POST", {
    mode: "bulk",
    assetIds: [asset.id],
    targetNodeId: "analyze",
  });
  assert.equal(bulk.status, "awaiting_approval");
  assert.equal(bulk.inputCount, 10); // Bulk currently includes the trial sample; no implicit reuse.
  assert.equal(bulk.fingerprint, trial.fingerprint);
  assert.equal(bulk.sourceHash, trial.sourceHash);
  assert.equal(bulk.estimate?.trialRunId, trial.id);
  assert.ok(
    bulk.estimate &&
      bulk.estimate.expectedMicros > 0 &&
      bulk.estimate.upperMicros >= bulk.estimate.expectedMicros,
  );
  await assert.rejects(
    harness.request(`/runs/${bulk.id}/start`, "POST", {}),
    /\(400\)/,
  );
  const beforeApproval = await harness.request<YpWorkflowSnapshot>("");
  assert.equal(beforeApproval.workspace.spentMicros, trial.spentMicros);
  assert.equal(beforeApproval.workspace.reservedMicros, 0);
  assert.equal(
    beforeApproval.runs.find((run) => run.id === bulk.id)!.status,
    "awaiting_approval",
  );
  const approvedBudgetMicros =
    beforeApproval.workspace.config.budgetMicros - trial.spentMicros;
  assert.ok(
    approvedBudgetMicros >= bulk.estimate.upperMicros,
    "Estimate exceeds the existing manual allowance; do not auto-increase it",
  );
  await milestone("estimated; admin approving batch", {
    trialRunId: trial.id,
    trialSpentMicros: trial.spentMicros,
    bulkRunId: bulk.id,
    estimate: bulk.estimate,
    approvedBudgetMicros,
  });
  harness.armCheckpoint(bulk.id, "levels");
  // Use the real group-admin HTTP route. The Codex VM has no bulk-approval capability.
  await harness.request(`/runs/${bulk.id}/start`, "POST", {
    budgetMicros: approvedBudgetMicros,
  });
  const interruption = await harness.interruptAtCheckpoint(
    bulk.id,
    "levels",
    signal,
  );
  const { run: paused } = await waitRun(harness, bulk.id, "paused", signal);
  assert.ok(paused.approvedAt);
  assert.ok(paused.error);
  assert.equal(paused.budgetMicros, approvedBudgetMicros);
  assert.equal(paused.spentMicros, interruption.spentMicros);
  const beforeResume = await ledger(harness, paused);
  assert.equal(beforeResume.length, 10);
  assert.ok(beforeResume.every((item) => item.nodeId === "levels"));
  const callOffset = harness.processingCalls.length;
  await milestone("processing container killed after durable checkpoint", {
    bulkRunId: bulk.id,
    interruption,
  });
  await harness.request(`/runs/${bulk.id}/resume`, "POST", {});
  const { run: completed, snapshot } = await waitRun(
    harness,
    bulk.id,
    "completed",
    signal,
  );
  assert.notEqual(completed.executionId, interruption.executionId);
  assert.equal(completed.sourceHash, trial.sourceHash);
  assert.equal(completed.budgetMicros, approvedBudgetMicros);
  for (const id of completed.nodeIds)
    assert.equal(completed.nodeStates[id]?.status, "completed");
  assert.deepEqual(await harness.checkpoint(bulk.id, "levels"), {
    checksum: interruption.checksum,
    records: 10,
  });
  const bulkUsage = await ledger(harness, completed);
  verifyResumeLedger(beforeResume, bulkUsage, 10);
  const resumedCalls = harness.processingCalls
    .slice(callOffset)
    .filter((call) => call.runId === bulk.id);
  assert.equal(resumedCalls.length, 20);
  assert.ok(
    resumedCalls.every(
      (call) => call.nodeId === "analyze" && call.status === 200,
    ),
    "Resume sent a model request for already completed work",
  );
  const bulkDirectory = path.join(directory, "bulk");
  await mkdir(bulkDirectory);
  const bulkResults = await results(
    harness,
    completed,
    bulkDirectory,
    false,
    signal,
  );
  const acceptance = verifyAdaptedResults(raw, asset.id, bulkResults.rows);
  for (const row of bulkResults.rows as {
    id: string;
    source: string;
    jurisdiction: string;
  }[]) {
    assert.equal(row.source, asset.id, "Source provenance changed");
    assert.equal(row.jurisdiction, "New Jersey, USA");
  }
  // Trial and bulk each export their own standard-format input. Do not pick an arbitrary asset by suffix.
  const adapted = snapshot.assets.filter(
    (item) =>
      item.source === "artifact" && item.name.endsWith("adapted-jobs.json"),
  );
  assert.equal(adapted.length, 2);
  for (const candidate of adapted) {
    const bytes = await download(harness, candidate, signal);
    const normalized = JSON.parse(bytes.toString()) as {
      id: string;
      name: string;
      text: string;
    }[];
    const folder = normalized.length === 10 ? bulkDirectory : trialDirectory;
    assert.ok(normalized.length === 2 || normalized.length === 10);
    const rows = (
      normalized.length === 10 ? bulkResults.rows : trialResults.rows
    ) as typeof normalized;
    assert.deepEqual(
      new Set(normalized.map((row) => row.id)),
      new Set(rows.map((row) => row.id)),
    );
    for (const row of rows) {
      const standard = normalized.find((item) => item.id === row.id)!;
      assert.equal(standard.name, row.name);
      assert.equal(standard.text.trim(), row.text);
    }
    await save(folder, "adapted-jobs.json", bytes);
  }
  const summaryOffset = harness.codexCalls.length;
  await chat(
    harness,
    `Check current workflow status once. Summarize the completed trial and bulk run ${bulk.id}, estimated versus actual processing cost, remaining allowance and downloads. Mention that bulk included all ten jobs and the two trial records were charged separately. Do not change files or budgets, start another run or make processing calls.`,
    directory,
    2,
    signal,
  );
  assert.ok(
    harness.codexCalls
      .slice(summaryOffset)
      .some((call) => call.operation === "status" && call.status === 200),
  );
  const final = await harness.request<YpWorkflowSnapshot>("");
  assert.equal(final.runs.length, 2);
  assert.equal(
    final.workspace.spentMicros,
    trial.spentMicros + completed.spentMicros,
  );
  assert.equal(final.workspace.reservedMicros, 0);
  assert.equal(final.workspace.activeRunId, null);
  assert.equal(
    harness.processingCalls.length,
    36,
    "Unexpected processing requests, including replays",
  );
  const report = {
    ...acceptance,
    trialRunId: trial.id,
    bulkRunId: bulk.id,
    trialRecords: 2,
    bulkRecords: 10,
    bulkIncludesTrialRecords: true,
    trialSpentMicros: trial.spentMicros,
    bulkSpentMicros: completed.spentMicros,
    processingCalls: trialUsage.length + bulkUsage.length,
    codexTurns: 2,
    codexCapabilities: harness.codexCalls,
    sourceHash: completed.sourceHash,
    nodeIds: completed.nodeIds,
    estimate: bulk.estimate,
    actualToExpectedRatio: completed.spentMicros / bulk.estimate.expectedMicros,
    actualWithinEstimateUpper:
      completed.spentMicros <= bulk.estimate.upperMicros,
    approvedBudgetMicros,
    interruption,
    paidCallsReplayed: 0,
    refusedMissingApproval: true,
    resumedWithSameApproval: true,
    downloads: [...trialResults.downloads, ...bulkResults.downloads],
  };
  await milestone("completed", report);
  return report;
}
