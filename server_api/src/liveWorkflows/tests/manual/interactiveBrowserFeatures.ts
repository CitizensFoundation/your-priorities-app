/** Small on-demand comparison case: real UI, Codex VM, processing and persisted history. */
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ManualConfig } from "./environment.js";
import type { ManualHarness } from "./harness.js";
import { offlineWorkflowCli } from "./headlessRehearsal.js";
import { ledger, results } from "./headlessScenarios.js";
import { resultRows, verifyAnalyses } from "./headlessVerification.js";
import { analysisNames, verifyDownload } from "./verification.js";
import {
  browserFixture,
  browserGreeting,
  type BrowserEvidence,
  type BrowserObservation,
} from "./interactiveBrowser.js";

export const browserFeaturesExperiment =
  'Use the one job description I uploaded. Inspect the package instructions, workflow status and document through the workflow CLI. In graph.json change only analyze.configuration.tasks to ["evidence"]; its degree prerequisite must run automatically. Validate and start exactly one one-record trial with --target analyze using this upload. Keep every model, reasoning setting, budget and other configuration unchanged. Do not rewrite jobs, research, use connectors, install dependencies or start bulk work. Briefly report the run ID and normalize → levels → degrees → evidence dependencies, then finish without polling. I will change an agent model and run the comparison through the UI myself.';

export const browserFeaturesInstructions = `<details><summary>UI feature test steps and prompts</summary>
<p>Two one-job trials, with six processing calls expected. Codex only greets you and starts the first trial. All later actions use the workflow UI.</p>
<ol><li>Choose Use imported test key and send:<pre>${browserGreeting}</pre></li>
<li>Open the compact Settings button beside the chat composer, then Load models. Select the comparison model, high reasoning (medium if already high) and the other response speed. Apply to next turn; the dialog closes. Refresh, reopen Settings and verify the saved values. Restore the original assistant model, reasoning and speed and apply again before sending another message. The conversation must keep the same session. This adds no model calls.</li>
<li>Upload <a href="/manual/fixture" download>the sample job description</a> in Data. Preview and download it. Send:<pre>${browserFeaturesExperiment}</pre></li>
<li>Use Agents → Fit/zoom; watch Agent activity. After completion, open Results, inspect the original and quoted evidence, search for Library, and try the failed filter.</li>
<li>Open Analyze requirements from the graph. Its saved run must be read only. Choose Edit current draft, select the alternative processing model, then Cancel. Reopen and confirm the first model remains.</li>
<li>Choose the alternative processing model again, the original model for Review, max reasoning and a $4 agent cap; Save agent settings. Refresh, reopen the draft and verify persistence. Model history must still show the original run and model.</li>
<li>In Data select only the uploaded text. Set Trial records to 1 and Experiment scope to Through Analyze requirements. Run the second trial with the UI button. Watch status, then refresh after completion.</li>
<li>Open the agent's model history and inspect both saved runs. In Results compare the second run with the first, expand both Models by agent tables and original/evidence details. Search and filter results.</li>
<li>Review Usage, inspect saved package revisions and check VM storage. Download and open both runs' results-0.json documents in Data. Check the model popup at a narrow browser width.</li>
<li>Press Enter in the terminal after completing these checks. With --drive, a separate on-demand browser driver performs and asserts these UI steps, saves screenshots and verifies browser-saved files.</li></ol>
<p>The original run keeps its models and prices. This case never approves bulk, changes workspace allowances or starts external research.</p></details>`;

export function offlineBrowserFeaturesOperator() {
  let turns = 0;
  return async (workspace: string) => {
    if (++turns === 1)
      return "Hello! Ready for your Skills First job description. (Offline fixture.)";
    assert.equal(turns, 2);
    const cli = <T>(...args: string[]) =>
      offlineWorkflowCli<T>(workspace, ...args);
    const snapshot = await cli<YpWorkflowSnapshot>("status");
    const asset = snapshot.assets.find((item) => item.source === "upload")!;
    await cli("data", asset.id);
    await readFile(path.join(workspace, "data", asset.id), "utf8");
    await readFile(path.join(workspace, "package", "AGENTS.md"), "utf8");
    const graph = snapshot.workspace.graph;
    graph.nodes.find((node) => node.id === "analyze")!.configuration.tasks = [
      "evidence",
    ];
    await writeFile(
      path.join(workspace, "package", "graph.json"),
      JSON.stringify(graph, null, 2),
    );
    await cli("validate");
    const run = await cli<YpWorkflowRun>(
      "trial",
      "--target",
      "analyze",
      "--sample",
      "1",
      asset.id,
    );
    return `Started trial **${run.id}**: normalize → levels → degrees → evidence. This is an offline fixture response.`;
  };
}

/** HTTP evidence alone never claims that a popup or result was visually inspected. */
export function verifyBrowserFeatureActions(
  observed: BrowserObservation[],
  firstId: string,
  secondId: string,
  downloads: string[],
) {
  const success = observed.filter((item) => item.status === 200);
  const matches = (method: string, suffix: string) =>
    success.filter(
      (item) => item.method === method && item.route.endsWith(suffix),
    );
  const chats = matches("POST", "/chat"),
    uploads = matches("POST", "/assets");
  assert.equal(chats.length, 2, "Send exactly two browser chat messages");
  assert.equal(
    uploads.length,
    1,
    "Upload the one job description in the browser",
  );
  assert.ok(
    matches("POST", "/account/api-key").some(
      (login) => login.order < chats[0].order,
    ),
    "Connect the imported test key first",
  );
  assert.ok(
    chats[0].order < uploads[0].order && uploads[0].order < chats[1].order,
    "Use hello → upload → experiment order",
  );
  const assistantEdits = matches("PUT", "/assistant-settings");
  assert.equal(
    assistantEdits.length,
    2,
    "Save and restore the assistant settings once each",
  );
  assert.ok(
    chats[0].order < assistantEdits[0].order &&
      assistantEdits[1].order < uploads[0].order,
    "Exercise assistant settings after hello and restore before the experiment",
  );
  assert.ok(
    matches("GET", "/codex-models").length,
    "Load assistant model choices",
  );
  assert.ok(
    matches("GET", "/").some(
      (item) =>
        item.order > assistantEdits[0].order &&
        item.order < assistantEdits[1].order,
    ),
    "Refresh to verify assistant settings before restoring them",
  );
  const edits = matches("PUT", "/graph"),
    runs = matches("POST", "/runs");
  assert.equal(
    edits.length,
    1,
    "Save one agent model change; cancelling must not save",
  );
  assert.equal(
    runs.length,
    1,
    "Start only the comparison trial with the UI button",
  );
  assert.ok(chats[1].order < edits[0].order && edits[0].order < runs[0].order);
  assert.ok(
    matches("GET", `/runs/${firstId}/results`).some(
      (item) => item.order < edits[0].order,
    ),
    "Review the first trial before changing its agent model",
  );
  assert.ok(
    matches("GET", "/").some(
      (item) => item.order > edits[0].order && item.order < runs[0].order,
    ),
    "Refresh after saving the model and before running the comparison",
  );
  const resultRequests = matches("GET", `/runs/${secondId}/results`);
  assert.ok(
    resultRequests.some((item) => item.compared && item.order > runs[0].order),
    "Compare the two runs in Results",
  );
  assert.ok(
    resultRequests.some((item) => item.searched),
    "Search comparison results",
  );
  assert.ok(
    resultRequests.some((item) => item.filtered),
    "Use a result filter",
  );
  for (const suffix of ["/preview", "/usage", "/revisions", "/storage"])
    assert.ok(
      matches("GET", suffix).length,
      `Review ${suffix.slice(1)} through the browser`,
    );
  for (const id of downloads)
    assert.ok(
      matches("GET", `/assets/${id}`).length,
      "Download the source and both result documents through the browser",
    );
  const starts = matches("POST", "/start");
  assert.equal(
    starts.length,
    1,
    "The trial button must start the comparison exactly once",
  );
  assert.ok(
    starts[0].route.endsWith(`/runs/${secondId}/start`) &&
      starts[0].order > runs[0].order,
    "Only the comparison trial may be started through the browser",
  );
  assert.equal(
    success.filter(
      (item) => item.method === "POST" && /\/(pause|resume)$/.test(item.route),
    ).length,
    0,
    "This case does not pause or resume runs",
  );
}

export async function verifyInteractiveFeaturesBrowser(
  harness: ManualHarness,
  evidence: BrowserEvidence,
  output: string,
  config: ManualConfig,
) {
  // Freeze evidence before verifier reads: failed/partial verification must not count on a retry.
  const observed = [...evidence.requests];
  const snapshot = await harness.request<YpWorkflowSnapshot>("");
  const runs = [...snapshot.runs].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt),
  );
  assert.equal(runs.length, 2, "Complete exactly two one-job trials");
  const [first, second] = runs;
  const base = config.processingModel.id,
    alternative = config.comparisonProcessingModel?.id;
  assert.ok(
    alternative && alternative !== base,
    "The comparison needs two different catalog models",
  );
  assert.equal(snapshot.codexAuthMode, "api-key");
  assert.equal(
    snapshot.workspace.config.codexModel,
    config.codexModel,
    "Changing an agent must not change Codex",
  );
  assert.equal(
    snapshot.workspace.config.codexReasoningEffort,
    config.codexReasoningEffort,
  );
  assert.equal(
    snapshot.workspace.config.codexServiceTier,
    config.codexServiceTier,
  );
  const uploads = snapshot.assets.filter((asset) => asset.source === "upload");
  assert.equal(uploads.length, 1);
  const original = await readFile(browserFixture);
  verifyDownload(uploads[0], original);
  const parts = runs.map((run) => {
    assert.equal(
      run.status,
      "completed",
      `Wait for ${run.id} to complete (${run.status})`,
    );
    const assets = snapshot.assets.filter(
      (asset) => asset.resultSet?.runId === run.id,
    );
    assert.equal(assets.length, 1);
    return assets[0];
  });
  verifyBrowserFeatureActions(observed, first.id, second.id, [
    uploads[0].id,
    ...parts.map((asset) => asset.id),
  ]);
  const analyze = (run: YpWorkflowRun) =>
    run.graph.nodes.find((node) => node.id === "analyze")!;
  assert.deepEqual(analyze(first).models, { default: base });
  assert.deepEqual(analyze(second).models, {
    default: alternative,
    review: base,
  });
  assert.equal(
    analyze(first).reasoningEffort,
    config.processingReasoningEffort,
  );
  assert.equal(analyze(second).reasoningEffort, "max");
  assert.equal(analyze(second).budgetMicros, 4_000_000);
  assert.ok(second.revision > first.revision);
  assert.notEqual(first.fingerprint, second.fingerprint);
  assert.deepEqual(
    first.graph.nodes.filter((node) => node.id !== "analyze"),
    second.graph.nodes.filter((node) => node.id !== "analyze"),
  );
  assert.deepEqual(first.graph.edges, second.graph.edges);
  const quality = [],
    modelHistory = [];
  for (const [index, run] of runs.entries()) {
    const model: string = index === 0 ? base : alternative;
    assert.equal(run.mode, "trial");
    assert.equal(run.inputCount, 1);
    assert.equal(run.targetNodeId, "analyze");
    assert.deepEqual(run.nodeIds, ["normalize", "levels", "analyze"]);
    assert.deepEqual(run.assetIds, [uploads[0].id]);
    assert.deepEqual(analyze(run).configuration.tasks, ["evidence"]);
    for (const id of run.nodeIds)
      assert.equal(run.nodeStates[id]?.status, "completed");
    assert.ok(
      run.agentMessages?.some(
        (message) => message.nodeId === "analyze" && message.message,
      ),
      "No persisted analysis status messages",
    );
    assert.ok(
      run.modelCatalog?.some(
        (entry) => entry.id === model && entry.priceVersion,
      ),
      "Run model prices were not saved",
    );
    const definitions =
      index === 0
        ? [config.processingModel]
        : [config.processingModel, config.comparisonProcessingModel!];
    assert.equal(run.modelCatalog?.length, definitions.length);
    for (const { keyEnv: _privateKeyName, ...definition } of definitions)
      assert.deepEqual(
        run.modelCatalog?.find((entry) => entry.id === definition.id),
        definition,
        "Saved model defaults and prices differ from those used by the gateway",
      );
    const usage = await ledger(harness, run);
    assert.equal(
      usage.length,
      3,
      "Expected level detection plus degrees and evidence, with no retries",
    );
    assert.deepEqual(
      usage
        .filter((item) => item.nodeId === "levels")
        .map((item) => item.description),
      [`Model ${base}`],
    );
    assert.deepEqual(
      usage
        .filter((item) => item.nodeId === "analyze")
        .map((item) => item.description),
      [`Model ${model}`, `Model ${model}`],
    );
    const folder = path.join(output, `trial-${index + 1}`);
    await mkdir(folder, { recursive: true });
    const downloaded = await results(harness, run, folder, false);
    const rows = resultRows.parse(downloaded.rows);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].id, `${uploads[0].id}:${uploads[0].id}`);
    assert.equal(rows[0].originalText, original.toString());
    assert.equal(rows[0].rewrittenText, undefined);
    assert.deepEqual(
      analysisNames.filter((name) => rows[0].analysis[name]),
      ["degrees", "evidence"],
    );
    verifyAnalyses(rows, ["degrees", "evidence"]);
    quality.push({
      runId: run.id,
      records: rows.length,
      tasks: ["degrees", "evidence"],
    });
    modelHistory.push({
      runId: run.id,
      revision: run.revision,
      models: analyze(run).models,
      reasoningEffort: analyze(run).reasoningEffort,
      modelCatalog: run.modelCatalog,
      spentMicros: run.spentMicros,
    });
  }
  assert.equal(harness.processingCalls.length, 6);
  assert.ok(harness.processingCalls.every((call) => call.status === 200));
  assert.equal(
    snapshot.workspace.spentMicros,
    first.spentMicros + second.spentMicros,
  );
  assert.ok(snapshot.workspace.spentMicros <= config.trialBudgetMicros);
  assert.equal(snapshot.workspace.reservedMicros, 0);
  assert.equal(snapshot.workspace.activeRunId, null);
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
  const codexUsage = harness.codexUsage.report();
  assert.equal(codexUsage.turns, 2);
  assert.equal(
    codexUsage.usageComplete,
    true,
    "Wait for Codex's final response",
  );
  return {
    firstRunId: first.id,
    secondRunId: second.id,
    quality,
    modelHistory,
    requests: 6,
    processingSpentMicros: snapshot.workspace.spentMicros,
    processingReservedMicros: 0,
    browserRequests: observed,
    codexCapabilities: harness.codexCalls,
  };
}
