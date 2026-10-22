import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "csv-parse/sync";
import type { UsageReservation } from "../../budget.js";
import { selectedAgents } from "../../packages.js";
import { fixturePath, redactManualText } from "./environment.js";
import { waitFor, type ManualHarness } from "./harness.js";
import {
  verifyDownload,
  verifySkillsFirstOutput,
  type ManualJob,
} from "./verification.js";
import {
  exportRows,
  resultRows,
  verifyAdaptedResults,
  verifyMixedResults,
  verifyReviewedRewrites,
} from "./headlessVerification.js";
import type { HeadlessCase } from "./headlessCases.js";

export const mixedFixturePath = new URL(
  "fixtures/skills-first-mixed-jobs.json",
  import.meta.url,
).pathname;
export const exportFixturePath = new URL(
  "fixtures/recruitment-export.json",
  import.meta.url,
).pathname;
const step = (text: string) => console.info(`[headless] ${text}`);
const stages = ["normalize", "levels", "analyze", "rewrite", "export"];

export async function save(
  directory: string,
  name: string,
  contents: string | Buffer,
) {
  await writeFile(
    path.join(directory, name),
    typeof contents === "string" ? redactManualText(contents) : contents,
    { mode: 0o600 },
  );
}

export async function upload(
  harness: ManualHarness,
  filename: string,
  signal?: AbortSignal,
) {
  const bytes = await readFile(filename);
  const response = await fetch(
    `${harness.baseUrl}/api/live-workflows/groups/1/assets`,
    {
      method: "POST",
      headers: {
        origin: harness.baseUrl,
        "content-type": "application/json",
        "x-file-name": encodeURIComponent(path.basename(filename)),
      },
      body: bytes,
      signal: AbortSignal.any([
        AbortSignal.timeout(60_000),
        ...(signal ? [signal] : []),
      ]),
    },
  );
  assert.equal(response.status, 200, "Upload failed");
  const asset = (await response.json()) as YpWorkflowAsset;
  const original = await download(harness, asset, signal);
  assert.deepEqual(original, bytes, "Upload contents changed");
  const forbidden = await fetch(
    `${harness.baseUrl}/api/live-workflows/groups/2/assets/${asset.id}`,
    { signal: AbortSignal.timeout(15_000) },
  );
  assert.equal(forbidden.status, 403, "Upload is visible in another group");
  return { asset, raw: JSON.parse(bytes.toString()) as unknown };
}

export async function download(
  harness: ManualHarness,
  asset: YpWorkflowAsset,
  signal?: AbortSignal,
) {
  const response = await fetch(
    `${harness.baseUrl}/api/live-workflows/groups/1/assets/${asset.id}`,
    {
      signal: AbortSignal.any([
        AbortSignal.timeout(30_000),
        ...(signal ? [signal] : []),
      ]),
    },
  );
  assert.equal(response.status, 200, "Download failed");
  const bytes = Buffer.from(await response.arrayBuffer());
  verifyDownload(asset, bytes);
  return bytes;
}

async function events(harness: ManualHarness, after = 0) {
  return (
    await harness.request<{ events: YpWorkflowEvent[] }>(
      `/events?after=${after}`,
    )
  ).events;
}

export async function chat(
  harness: ManualHarness,
  prompt: string,
  directory: string,
  turn: number,
  signal?: AbortSignal,
) {
  // Events are paginated. The end of the first page is not the current cursor.
  const after = (await harness.request<YpWorkflowSnapshot>("")).workspace
    .nextEvent;
  await harness.request("/chat", "POST", { text: prompt });
  const collected: YpWorkflowEvent[] = [];
  let cursor = after;
  let loggedItems = 0;
  const itemCounts = () => {
    const counts: Record<string, number> = {};
    for (const event of collected) {
      if (
        event.type !== "session.event" ||
        event.data.eventType !== "item.started"
      )
        continue;
      const kind = (event.data.payload as { item?: { type?: string } })?.item
        ?.type;
      const label = [
        "reasoning",
        "agentMessage",
        "commandExecution",
        "fileChange",
        "mcpToolCall",
        "plan",
      ].includes(kind ?? "")
        ? kind!
        : "other";
      counts[label] = (counts[label] ?? 0) + 1;
    }
    return counts;
  };
  try {
    await waitFor(
      "bounded Codex operator turn",
      async () => {
        const next = await events(harness, cursor);
        collected.push(...next);
        cursor = next.at(-1)?.seq ?? cursor;
        const failure = collected.find(
          (event) =>
            event.type === "session.event" &&
            ["session.error", "approval.requested"].includes(
              String(event.data.eventType),
            ),
        );
        if (failure) {
          const payload = failure.data.payload as {
            error?: { message?: string };
            message?: string;
          };
          throw new Error(
            `Codex turn needs attention: ${failure.data.eventType}: ${payload.error?.message ?? payload.message ?? "see turn transcript"}`,
          );
        }
        const counts = itemCounts();
        const items = Object.values(counts).reduce(
          (sum, count) => sum + count,
          0,
        );
        if (items >= loggedItems + 10) {
          step(
            `Codex turn ${turn}: ${items}/120 items (${JSON.stringify(counts)})`,
          );
          loggedItems = items;
        }
        assert.ok(items <= 120, "Codex exceeded the manual turn item limit");
        const completed = collected.find(
          (event) =>
            event.type === "session.event" &&
            event.data.eventType === "turn.completed",
        );
        if (completed) {
          const payload = completed.data.payload as {
            turn?: { status?: string };
          };
          assert.equal(
            payload.turn?.status,
            "completed",
            "Codex turn did not succeed",
          );
          return true;
        }
        return false;
      },
      1_200_000,
      signal,
    );
  } finally {
    await save(
      directory,
      `chat-${turn}-activity.json`,
      JSON.stringify(itemCounts(), null, 2),
    );
    // The transcript is deliberately small: user message plus assistant replies, no raw tool/provider payloads.
    const replies = collected
      .filter(
        (event) =>
          event.type === "session.event" &&
          event.data.eventType === "message.completed",
      )
      .map((event) =>
        String((event.data.payload as { text?: string }).text ?? ""),
      );
    await save(
      directory,
      `chat-${turn}.txt`,
      `USER\n${prompt}\n\nASSISTANT\n${replies.join("\n\n")}`,
    );
  }
  assert.ok(
    collected.some(
      (event) =>
        event.type === "session.event" &&
        event.data.eventType === "message.completed" &&
        String((event.data.payload as { text?: string }).text ?? "").trim(),
    ),
    "Codex did not reply",
  );
}

export async function waitRun(
  harness: ManualHarness,
  id?: string,
  expected = "completed",
  signal?: AbortSignal,
) {
  let prior = "";
  return waitFor(
    `run ${expected}`,
    async () => {
      const snapshot = await harness.request<YpWorkflowSnapshot>("");
      const run = id
        ? snapshot.runs.find((candidate) => candidate.id === id)
        : snapshot.runs[0];
      if (!run) return false;
      const progress = `${run.status}: ${Object.entries(run.nodeStates)
        .filter(([, value]) => value.status === "completed")
        .map(([name]) => name)
        .join(", ")}`;
      if (progress !== prior) {
        step(progress);
        prior = progress;
      }
      if (run.status === expected) return { run, snapshot };
      if (["failed", "cancelled", "paused"].includes(run.status))
        throw new Error(`Run ${run.status}: ${run.error ?? "see diagnostics"}`);
      return false;
    },
    2_700_000,
    signal,
  );
}

export async function ledger(harness: ManualHarness, run: YpWorkflowRun) {
  const usage = (await harness.request<UsageReservation[]>("/usage")).filter(
    (item) => item.runId === run.id,
  );
  assert.ok(usage.length, "No model requests were accounted for");
  assert.equal(new Set(usage.map((item) => item.id)).size, usage.length);
  assert.ok(
    usage.every((item) => item.status === "settled"),
    "Unsettled model usage remains",
  );
  assert.equal(
    usage.reduce((sum, item) => sum + (item.actualMicros ?? 0), 0),
    run.spentMicros,
  );
  assert.ok(run.spentMicros > 0 && run.spentMicros <= run.budgetMicros);
  assert.equal(run.reservedMicros, 0);
  return usage;
}

export async function results(
  harness: ManualHarness,
  run: YpWorkflowRun,
  directory: string,
  full: boolean,
  signal?: AbortSignal,
) {
  const snapshot = await harness.request<YpWorkflowSnapshot>("");
  const parts = snapshot.assets
    .filter((asset) => asset.resultSet?.runId === run.id)
    .sort((a, b) => a.resultSet!.part - b.resultSet!.part);
  assert.ok(parts.length, "No persisted result set");
  const rows: unknown[] = [];
  for (const [index, asset] of parts.entries()) {
    const bytes = await download(harness, asset, signal);
    rows.push(...JSON.parse(bytes.toString()));
    await save(directory, `results-${index}.json`, bytes);
  }
  const page = await harness.request<YpWorkflowResultPage>(
    `/runs/${run.id}/results?limit=20`,
  );
  assert.equal(page.total, rows.length);
  assert.equal(page.available, true);
  const downloads = parts.map((asset) => ({
    name: asset.name,
    checksum: asset.checksum,
    bytes: asset.bytes,
  }));
  if (full)
    for (const name of [
      "skills-first.json",
      "skills-first.csv",
      "skills-first.md",
      "skills-first.xlsx",
    ]) {
      // Each scenario has one completed full run in a fresh workspace.
      const asset = snapshot.assets.find(
        (candidate) =>
          candidate.source === "artifact" && candidate.name.endsWith(name),
      );
      assert.ok(asset, `Missing ${name}`);
      const bytes = await download(harness, asset, signal);
      await save(directory, name, bytes);
      if (name.endsWith(".json"))
        assert.deepEqual(JSON.parse(bytes.toString()).jobDescriptions, rows);
      if (name.endsWith(".csv"))
        assert.equal(
          parse(bytes, { columns: true, from_line: 2 }).length,
          rows.length,
        );
      downloads.push({
        name: asset.name,
        checksum: asset.checksum,
        bytes: asset.bytes,
      });
    }
  return { rows, downloads };
}

function basicJobs(raw: unknown, asset: YpWorkflowAsset) {
  return (raw as ManualJob[]).map((job) => ({
    ...job,
    id: `${asset.id}:${job.id}`,
  }));
}

async function codexTrial(
  harness: ManualHarness,
  directory: string,
  adapt: boolean,
  signal?: AbortSignal,
) {
  const { asset, raw } = await upload(
    harness,
    adapt ? exportFixturePath : fixturePath,
    signal,
  );
  const before = await harness.request<{ hash: string }>(
    "/validate",
    "POST",
    {},
  );
  const prompt = adapt
    ? `I uploaded ${asset.name} (asset ${asset.id}), an unfamiliar recruitment export. Inspect the raw data and package instructions through the workflow CLI. Convert its nested vacancy cards into standard Skills First jobs with a deterministic TypeScript adapter agent named adapt-import before normalize. Keep imported IDs and source, titles, all duties, mandatory requirements and preferences verbatim, and map the jurisdiction. Do not edit the upload. Save adapted-jobs.json through context.artifact for download. Update graph.json with the adapter and its dependencies/description, then validate. For the first experiment select only evidence review in analyze.configuration.tasks; let the package include its degree-analysis prerequisite. Start exactly one two-record trial with --target analyze using this asset. Preserve the existing model selections. Keep research, rewriting and external connectors off for this targeted run. Explain the format conversion and dependency order, report the run ID, then finish your turn without polling. Do not install dependencies, use provider credentials, change budgets or approve bulk work.`
    : `I uploaded ${asset.name} (asset ${asset.id}). Inspect the package instructions, workflow status and the uploaded job descriptions through the workflow CLI. Validate the existing package and start exactly one two-record Skills First trial for this asset using the existing graph and model selections. Tell me what will run and the run ID, then finish your turn without polling. Keep the package unchanged. Do not install dependencies, use provider credentials, change budgets, approve bulk work or enable external connectors.`;
  await chat(harness, prompt, directory, 1, signal);
  const { run, snapshot } = await waitRun(
    harness,
    undefined,
    "completed",
    signal,
  );
  assert.equal(snapshot.runs.length, 1, "Codex must launch exactly one trial");
  assert.equal(run.mode, "trial");
  assert.deepEqual(run.assetIds, [asset.id]);
  assert.equal(run.inputCount, 2);
  for (const operation of ["status", "data", "validate", "trial"])
    assert.ok(
      harness.codexCalls.some(
        (call) => call.operation === operation && call.status === 200,
      ),
      `Codex did not use ${operation}`,
    );
  assert.equal(
    harness.codexCalls.filter(
      (call) => call.operation === "trial" && call.status === 200,
    ).length,
    1,
  );
  const downloaded = await results(harness, run, directory, !adapt, signal);
  let acceptance: Record<string, unknown>;
  if (adapt) {
    assert.notEqual(
      run.sourceHash,
      before.hash,
      "Codex did not create a new package revision",
    );
    assert.deepEqual(
      new Set(run.nodeIds),
      new Set(["adapt-import", "normalize", "levels", "analyze"]),
    );
    assert.deepEqual(
      new Set(selectedAgents(run.graph, "analyze")),
      new Set(run.nodeIds),
    );
    assert.deepEqual(
      run.graph.nodes.find((node) => node.id === "analyze")!.configuration
        .tasks,
      ["evidence"],
    );
    assert.equal(run.targetNodeId, "analyze");
    assert.equal(
      run.nodeIds[0],
      "adapt-import",
      "Approval order must follow dependencies, not graph array order",
    );
    assert.equal(
      run.sample?.recordIds.length,
      2,
      "Adapter must not lose trial sample attribution",
    );
    assert.deepEqual(
      new Set(Object.keys(run.recordCosts ?? {})),
      new Set(run.sample.recordIds),
    );
    const revision = await harness.request<{ files: Record<string, string> }>(
      `/revisions/${run.sourceHash}`,
    );
    const adapter = run.graph.nodes.find((node) => node.id === "adapt-import")!;
    assert.ok(
      adapter.entrypoint && revision.files[adapter.entrypoint],
      "Adapter source missing from immutable revision",
    );
    await save(directory, "adapter.ts", revision.files[adapter.entrypoint]);
    await save(directory, "graph.json", JSON.stringify(run.graph, null, 2));
    const standard = snapshot.assets.find(
      (candidate) =>
        candidate.source === "artifact" &&
        candidate.name.endsWith("adapted-jobs.json"),
    );
    assert.ok(
      standard,
      "Codex adapter did not export standard input for inspection",
    );
    const bytes = await download(harness, standard, signal);
    await save(directory, "adapted-jobs.json", bytes);
    const normalized = JSON.parse(bytes.toString()) as ManualJob[];
    assert.equal(normalized.length, exportRows.parse(raw).length);
    const finalRows = resultRows.parse(downloaded.rows);
    for (const row of finalRows) {
      const input = normalized.find((candidate) => candidate.id === row.id);
      assert.ok(
        input && input.name === row.name && input.text.trim() === row.text,
        "Downloadable standard input differs from the analyzed record",
      );
    }
    acceptance = verifyAdaptedResults(raw, asset.id, downloaded.rows);
  } else {
    assert.equal(run.sourceHash, before.hash);
    assert.deepEqual(run.nodeIds, stages);
    acceptance = verifySkillsFirstOutput(
      basicJobs(raw, asset),
      downloaded.rows,
    );
    verifyReviewedRewrites(resultRows.parse(downloaded.rows));
  }
  for (const id of run.nodeIds)
    assert.equal(run.nodeStates[id]?.status, "completed");
  const usage = await ledger(harness, run);
  if (adapt) {
    assert.deepEqual(
      new Set(usage.map((item) => item.nodeId)),
      new Set(["levels", "analyze"]),
    );
    assert.equal(
      usage.filter((item) => item.nodeId === "analyze").length,
      4,
      "Evidence + degrees require two calls for each of the two records",
    );
  }
  const summaryCallOffset = harness.codexCalls.length;
  await chat(
    harness,
    "Check the workflow status once and summarize this completed trial, its actual processing cost, remaining allowance and available downloads. Do not start another run, change files, or make processing calls.",
    directory,
    2,
    signal,
  );
  assert.ok(
    harness.codexCalls
      .slice(summaryCallOffset)
      .some((call) => call.operation === "status" && call.status === 200),
    "Codex did not inspect current status for its summary",
  );
  const final = await harness.request<YpWorkflowSnapshot>("");
  assert.equal(final.runs.length, 1, "The summary started another trial");
  assert.equal(final.workspace.spentMicros, run.spentMicros);
  return {
    ...acceptance,
    runId: run.id,
    nodeIds: run.nodeIds,
    sourceHash: run.sourceHash,
    processingCalls: usage.length,
    codexTurns: 2,
    codexCapabilities: harness.codexCalls,
    downloads: downloaded.downloads,
  };
}

async function mixedRecords(
  harness: ManualHarness,
  directory: string,
  signal?: AbortSignal,
) {
  const { asset, raw } = await upload(harness, mixedFixturePath, signal);
  const draft = await harness.request<YpWorkflowRun>("/runs", "POST", {
    mode: "trial",
    assetIds: [asset.id],
    sampleCount: 3,
  });
  await harness.request(`/runs/${draft.id}/start`, "POST", {});
  const { run } = await waitRun(harness, draft.id, "completed", signal);
  assert.deepEqual(run.nodeIds, stages);
  const downloaded = await results(harness, run, directory, true, signal);
  const acceptance = verifyMixedResults(basicJobs(raw, asset), downloaded.rows);
  assert.equal(run.nodeStates.levels.outputCount, 4);
  const usage = await ledger(harness, run);
  const parentIds = new Set(basicJobs(raw, asset).map((job) => job.id));
  assert.ok(
    usage.every((item) => item.recordId && parentIds.has(item.recordId)),
    "Child costs must be attributed to their original job",
  );
  return {
    ...acceptance,
    runId: run.id,
    processingCalls: usage.length,
    downloads: downloaded.downloads,
  };
}

async function runControls(
  harness: ManualHarness,
  directory: string,
  signal?: AbortSignal,
) {
  const { asset, raw } = await upload(harness, fixturePath, signal);
  const initial = (await harness.request<YpWorkflowSnapshot>("")).workspace;
  // Force a deterministic pause between paid stages; never interrupt an in-flight provider call.
  initial.graph.nodes.find((node) => node.id === "analyze")!.budgetMicros = 1;
  await harness.request("/graph", "PUT", {
    graph: initial.graph,
    revision: initial.revision,
  });
  await assert.rejects(
    harness.request("/runs", "POST", { mode: "bulk", assetIds: [asset.id] }),
    /successful trial/,
  );
  const draft = await harness.request<YpWorkflowRun>("/runs", "POST", {
    mode: "trial",
    assetIds: [asset.id],
    sampleCount: 1,
  });
  await harness.request(`/runs/${draft.id}/start`, "POST", {});
  const paused = await waitRun(harness, draft.id, "paused", signal);
  assert.match(paused.run.error ?? "", /spending limit/);
  const priorUsage = await ledger(harness, paused.run);
  assert.equal(priorUsage.length, 1);
  assert.equal(priorUsage[0].nodeId, "levels");
  await assert.rejects(
    harness.request(`/runs/${draft.id}/resume`, "POST", {
      budgetMicros: initial.config.budgetMicros + 1,
    }),
    /allowance/,
  );
  await harness.request(`/runs/${draft.id}/resume`, "POST", {
    nodeBudgets: { analyze: draft.budgetMicros },
  });
  const { run } = await waitRun(harness, draft.id, "completed", signal);
  const usage = await ledger(harness, run);
  assert.deepEqual(
    usage.filter((item) => item.nodeId === "levels"),
    priorUsage,
    "Resume repeated or replaced paid level analysis",
  );
  const downloaded = await results(harness, run, directory, true, signal);
  const sampled = basicJobs(raw, asset).filter((job) =>
    run.sample?.recordIds.includes(job.id),
  );
  assert.equal(sampled.length, 1);
  verifySkillsFirstOutput(sampled, downloaded.rows);
  verifyReviewedRewrites(resultRows.parse(downloaded.rows));
  const bulk = await harness.request<YpWorkflowRun>("/runs", "POST", {
    mode: "bulk",
    assetIds: [asset.id],
  });
  assert.equal(bulk.status, "awaiting_approval");
  assert.equal(bulk.estimate?.trialRunId, run.id);
  assert.ok(
    bulk.estimate &&
      bulk.estimate.expectedMicros > 0 &&
      bulk.estimate.upperMicros >= bulk.estimate.expectedMicros,
  );
  await assert.rejects(
    harness.request(`/runs/${bulk.id}/start`, "POST", {}),
    /\(400\)/,
  );
  await assert.rejects(
    harness.request(`/runs/${bulk.id}/start`, "POST", {
      budgetMicros: initial.config.budgetMicros + 1,
    }),
    /allowance/,
  );
  const current = (await harness.request<YpWorkflowSnapshot>("")).workspace;
  current.graph.nodes.find(
    (node) => node.id === "analyze",
  )!.configuration.tasks = ["evidence"];
  await harness.request("/graph", "PUT", {
    graph: current.graph,
    revision: current.revision,
  });
  await assert.rejects(
    harness.request(`/runs/${bulk.id}/start`, "POST", {
      budgetMicros: Math.max(1, draft.budgetMicros - run.spentMicros),
    }),
    /changed; create a new trial/,
  );
  await assert.rejects(
    harness.request("/runs", "POST", { mode: "bulk", assetIds: [asset.id] }),
    /successful trial/,
  );
  const final = await harness.request<YpWorkflowSnapshot>("");
  assert.equal(
    final.workspace.spentMicros,
    run.spentMicros,
    "Rejected approvals incurred cost",
  );
  assert.equal(
    final.runs.find((candidate) => candidate.id === bulk.id)!.status,
    "awaiting_approval",
  );
  const nextTrial = await harness.request<YpWorkflowRun>("/runs", "POST", {
    mode: "trial",
    assetIds: [asset.id],
    sampleCount: 1,
  });
  assert.equal(
    nextTrial.budgetMicros,
    initial.config.trialBudgetMicros - run.spentMicros,
    "Trial allowance reset after a run",
  );
  return {
    runId: run.id,
    processingCalls: usage.length,
    pauseResume: true,
    paidCallsReplayed: 0,
    refusedBulkBeforeTrial: true,
    refusedMissingApproval: true,
    refusedExcessBudget: true,
    refusedStaleApproval: true,
    remainingTrialMicros: nextTrial.budgetMicros,
    estimate: bulk.estimate,
    downloads: downloaded.downloads,
  };
}

export async function runHeadlessCase(
  name: HeadlessCase,
  harness: ManualHarness,
  directory: string,
  signal?: AbortSignal,
) {
  await mkdir(directory, { recursive: true, mode: 0o700 });
  signal?.throwIfAborted();
  step(name);
  switch (name) {
    case "codex-trial":
      return codexTrial(harness, directory, false, signal);
    case "adapt-format":
      return codexTrial(harness, directory, true, signal);
    case "mixed-records":
      return mixedRecords(harness, directory, signal);
    case "run-controls":
      return runControls(harness, directory, signal);
    case "approved-bulk":
      return (await import("./headlessBulk.js")).approvedBulk(
        harness,
        directory,
        signal,
      );
  }
}
