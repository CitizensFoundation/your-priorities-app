import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { selectedAgents } from "../../packages.js";
import type { ManualHarness } from "./harness.js";
import {
  BrowserEvidence,
  browserGreeting,
  verifyBrowserActions,
} from "./interactiveBrowser.js";
import { browserBatchCheckpointBanner } from "./browserBatchCheckpoint.js";
import { download, ledger, results, save } from "./headlessScenarios.js";
import { resultRows, verifyAdaptedResults } from "./headlessVerification.js";
import { verifyResumeLedger } from "./headlessBulk.js";
import { verifyDownload } from "./verification.js";

export const browserBulkFixture = fileURLToPath(
  new URL("fixtures/recruitment-batch.json", import.meta.url),
);
export const browserBulkExperiment =
  "I uploaded ten fictional job descriptions in an unfamiliar recruitment export. Inspect the raw data and package instructions through the workflow CLI. Create a deterministic TypeScript adapter agent named adapt-import before normalize. Preserve imported record IDs, source, titles, jurisdiction, and every duty, mandatory requirement and preference verbatim. Export the adapted input via context.artifact as adapted-jobs.json. Update graph.json with its dependencies, description and clear diagram positions, then validate. Select only evidence in analyze.configuration.tasks; the package must include its degree prerequisite. Start exactly one two-record trial with --target analyze using this asset and existing model selections and reasoning effort. Keep rewriting, research and connectors off. Report the run ID and dependencies, then finish without polling. I will review the trial, estimate and approve bulk processing in the browser. Do not start or approve bulk work, change budgets, install dependencies or use provider credentials.";

export const browserBulkInstructions = `<details><summary>Ten-job browser test steps and prompts</summary>
<p>Use the real workflow controls below. Your Priorities membership is a fixture; live mode uses the server's imported API key. Only two Codex turns are allowed.</p>
<ol><li>Choose Use imported test key, then send:<pre>${browserGreeting}</pre></li>
<li>Use Data → Upload files to upload <a href="/manual/fixture" download>the ten-job recruitment export</a>.</li>
<li>Send:<pre>${browserBulkExperiment}</pre></li>
<li>Inspect the adapter, its upstream/downstream links and the analysis prerequisites in Agents. After the trial completes, review Results and open the original/evidence details. Download and open its adapted-jobs.json and results-0.json from Data.</li>
<li>Select only the original recruitment-batch.json input in Data. Choose the experiment scope through the analysis agent, then Estimate full run. Review the two-record sample, ten-record estimate and per-agent costs. Bulk includes all ten jobs; the trial records are charged separately. Enter a cap within the remaining workspace allowance and approve the saved revision.</li>
<li>Wait for the checkpoint notice below. Click pause in the workflow UI, then refresh this page. Inspect the saved Codex replies, graph, progress and spending. Use Approve allowance and resume without increasing the cap.</li>
<li>Wait for completion. Review and search batch Results (for example Library), inspect quoted evidence and unknown findings, and compare trial/batch costs in Usage. Download and open the batch's adapted-jobs.json and results-0.json from Data.</li>
<li>Press Enter in the terminal to verify and finish. Ctrl+C cleans up an incomplete test.</li></ol>
<p>The test holds processing after the durable levels checkpoint so there is time to click pause. It does not approve, pause or resume anything automatically. This tests browser refresh and acknowledged pause/resume, not a host crash or an in-flight provider failure.</p></details>${browserBatchCheckpointBanner}`;

export async function verifyInteractiveBulkBrowser(
  harness: ManualHarness,
  evidence: BrowserEvidence,
  output: string,
  mode: "api-key" | "chatgpt" | "offline",
) {
  // The verifier's own downloads and result requests cannot count as browser actions.
  const observed = [...evidence.requests];
  const snapshot = await harness.request<YpWorkflowSnapshot>("");
  assert.equal(
    snapshot.codexAuthMode,
    mode === "chatgpt" ? "chatgpt" : "api-key",
  );
  assert.equal(
    snapshot.runs.length,
    2,
    "Complete exactly one trial and one approved batch",
  );
  const trial = snapshot.runs.find((run) => run.mode === "trial")!;
  const bulk = snapshot.runs.find((run) => run.mode === "bulk")!;
  assert.ok(trial && bulk);
  assert.equal(trial.status, "completed", "Wait for the trial to finish");
  assert.equal(
    bulk.status,
    "completed",
    `Wait for the batch to finish (currently ${bulk.status})`,
  );
  assert.equal(trial.inputCount, 2);
  assert.equal(bulk.inputCount, 10);
  assert.equal(trial.sample?.populationCount, 10);
  const uploads = snapshot.assets.filter((asset) => asset.source === "upload");
  assert.equal(uploads.length, 1);
  const original = await readFile(browserBulkFixture);
  verifyDownload(uploads[0], original);
  const raw: unknown = JSON.parse(original.toString());
  assert.equal(trial.sourceHash, bulk.sourceHash);
  assert.equal(trial.fingerprint, bulk.fingerprint);
  for (const run of [trial, bulk]) {
    assert.deepEqual(run.assetIds, [uploads[0].id]);
    assert.equal(run.targetNodeId, "analyze");
    assert.deepEqual(run.nodeIds, [
      "adapt-import",
      "normalize",
      "levels",
      "analyze",
    ]);
    assert.deepEqual(selectedAgents(run.graph, "analyze"), run.nodeIds);
    assert.deepEqual(
      run.graph.nodes.find((node) => node.id === "analyze")!.configuration
        .tasks,
      ["evidence"],
    );
    for (const id of run.nodeIds)
      assert.equal(run.nodeStates[id]?.status, "completed");
  }
  const exported = [trial, bulk].flatMap((run) => {
    const inputs = snapshot.assets.find(
      (asset) => asset.name === `${run.id}-adapted-jobs.json`,
    );
    assert.ok(
      inputs,
      "Codex's adapter must export standard input records for both runs",
    );
    const parts = snapshot.assets.filter(
      (asset) => asset.resultSet?.runId === run.id,
    );
    assert.equal(
      parts.length,
      1,
      "Expected one result document for this small batch",
    );
    return [inputs, ...parts];
  });
  verifyBrowserActions(
    observed,
    exported.map((asset) => asset.id),
    mode,
    { trialId: trial.id, bulkId: bulk.id },
  );

  const control = harness.browserBatch;
  assert.ok(
    control?.beforeApproval &&
      control.beforePause &&
      control.afterReload &&
      control.beforeResume,
    "Pause at the checkpoint, refresh the page, then resume through the browser",
  );
  assert.ok(control.pauseSucceeded && control.resumeSucceeded);
  assert.equal(control.runId, bulk.id);
  assert.equal(control.beforeApproval.run.status, "awaiting_approval");
  assert.equal(
    control.beforeApproval.usage.length,
    0,
    "Bulk incurred charges before approval",
  );
  assert.equal(control.beforeApproval.run.spentMicros, 0);
  assert.equal(control.beforeApproval.run.reservedMicros, 0);
  assert.equal(control.beforePause.run.reservedMicros, 0);
  assert.equal(control.afterReload.run.status, "paused");
  assert.equal(control.beforeResume.run.status, "paused");
  assert.deepEqual(control.afterReload.usage, control.beforePause.usage);
  assert.deepEqual(control.beforeResume.usage, control.beforePause.usage);
  assert.equal(
    control.afterReload.run.spentMicros,
    control.beforePause.run.spentMicros,
  );
  assert.equal(
    control.afterReload.run.executionId,
    control.beforePause.run.executionId,
  );
  assert.notEqual(bulk.executionId, control.beforePause.run.executionId);
  for (const state of [
    control.beforePause,
    control.afterReload,
    control.beforeResume,
  ]) {
    assert.equal(state.run.sourceHash, bulk.sourceHash);
    assert.equal(state.run.approvedAt, bulk.approvedAt);
    assert.equal(state.run.budgetMicros, bulk.budgetMicros);
  }
  assert.deepEqual(
    await harness.checkpoint(bulk.id, "levels"),
    control.beforePause.checkpoint,
  );
  const trialUsage = await ledger(harness, trial),
    bulkUsage = await ledger(harness, bulk);
  assert.equal(trialUsage.length, 6);
  verifyResumeLedger(control.beforePause.usage, bulkUsage, 10);
  assert.notEqual(control.resumedCallOffset, undefined);
  const resumedCalls = harness.processingCalls
    .slice(control.resumedCallOffset)
    .filter((call) => call.runId === bulk.id);
  assert.equal(
    resumedCalls.length,
    20,
    "Expected only degree/evidence requests after resuming",
  );
  assert.ok(
    resumedCalls.every(
      (call) => call.nodeId === "analyze" && call.status === 200,
    ),
  );
  assert.equal(
    harness.processingCalls.length,
    36,
    "Unexpected or replayed model requests",
  );
  assert.equal(
    snapshot.workspace.spentMicros,
    trial.spentMicros + bulk.spentMicros,
  );
  assert.equal(snapshot.workspace.reservedMicros, 0);
  assert.equal(snapshot.workspace.activeRunId, null);
  assert.ok(
    snapshot.workspace.spentMicros <= snapshot.workspace.config.budgetMicros,
  );
  assert.ok(bulk.estimate && bulk.estimate.expectedMicros > 0);
  assert.equal(bulk.estimate.trialRunId, trial.id);
  assert.ok(bulk.estimate.upperMicros <= bulk.budgetMicros);
  assert.ok(bulk.approvedAt);
  assert.ok(Date.parse(trial.completedAt!) <= Date.parse(bulk.approvedAt));

  const revision = await harness.request<{ files: Record<string, string> }>(
    `/revisions/${bulk.sourceHash}`,
  );
  const adapter = bulk.graph.nodes.find((node) => node.id === "adapt-import")!;
  assert.ok(
    adapter.description &&
      adapter.entrypoint &&
      revision.files[adapter.entrypoint],
  );
  await save(output, "adapter.ts", revision.files[adapter.entrypoint]);
  await save(output, "graph.json", JSON.stringify(bulk.graph, null, 2));
  const quality = [];
  for (const run of [trial, bulk]) {
    const folder = path.join(output, run.mode);
    await mkdir(folder, { recursive: true });
    const result = await results(harness, run, folder, false);
    quality.push({
      mode: run.mode,
      ...verifyAdaptedResults(
        raw,
        uploads[0].id,
        result.rows,
        run.mode === "trial" ? trial.sample!.recordIds : undefined,
      ),
    });
    const rows = resultRows.parse(result.rows);
    const input = exported.find(
      (asset) => asset.name === `${run.id}-adapted-jobs.json`,
    )!;
    const bytes = await download(harness, input);
    const standard = JSON.parse(bytes.toString()) as {
      id: string;
      name: string;
      text: string;
      source: string;
      jurisdiction: string;
    }[];
    assert.equal(standard.length, run.inputCount);
    assert.deepEqual(
      new Set(standard.map((row) => row.id)),
      new Set(rows.map((row) => row.id)),
    );
    for (const row of rows) {
      const normalized = standard.find((item) => item.id === row.id)!;
      assert.equal(normalized.name, row.name);
      assert.equal(normalized.text.trim(), row.text);
      assert.equal(normalized.source, uploads[0].id);
      assert.equal(normalized.jurisdiction, "New Jersey, USA");
    }
    await save(folder, "adapted-jobs.json", bytes);
  }
  const usage = harness.codexUsage.report();
  assert.equal(usage.turns, 2);
  assert.equal(usage.usageComplete, true, "Wait for Codex's final reply");
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
  return {
    trialRunId: trial.id,
    bulkRunId: bulk.id,
    trialRecords: 2,
    bulkRecords: 10,
    bulkIncludesTrialRecords: true,
    quality,
    trialSpentMicros: trial.spentMicros,
    bulkSpentMicros: bulk.spentMicros,
    processingSpentMicros: snapshot.workspace.spentMicros,
    processingReservedMicros: 0,
    requests: trialUsage.length + bulkUsage.length,
    sourceHash: bulk.sourceHash,
    runtimeImage: bulk.runtimeImage,
    estimate: bulk.estimate,
    actualToExpectedRatio: bulk.spentMicros / bulk.estimate.expectedMicros,
    actualWithinEstimateUpper: bulk.spentMicros <= bulk.estimate.upperMicros,
    approvedBudgetMicros: bulk.budgetMicros,
    paidCallsReplayed: 0,
    pauseAndReloadVerified: true,
    resumedWithSameApproval: true,
    checkpoint: control.beforePause.checkpoint,
    codexCapabilities: harness.codexCalls,
    browserRequests: observed,
    downloads: exported.map(({ id, name, bytes, checksum }) => ({
      id,
      name,
      bytes,
      checksum,
    })),
    apiKeyLoginVerified: mode === "api-key",
    chatgptLoginVerified: mode === "chatgpt",
    browserOperatorConfirmedReview: true,
    downloadEvidence:
      "HTTP deliveries observed before verification; saved-file review confirmed by the browser operator when finishing.",
  };
}
