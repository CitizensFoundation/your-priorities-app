import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { offlineWorkflowCli } from "./headlessRehearsal.js";
import {
  idahoHeaders,
  idahoSample,
  idahoText,
  type IdahoRow,
} from "./idahoData.js";
import { analysisNames } from "./verification.js";
import {
  resultRows,
  verifyAnalyses,
  verifyReviewedRewrites,
} from "./headlessVerification.js";
import type { BrowserObservation } from "./interactiveBrowser.js";

export const idahoStages = [
  "adapt-import",
  "normalize",
  "levels",
  "analyze",
  "rewrite",
  "compare",
  "compare-license",
  "export",
];
export const idahoExperiment =
  "Please process everything using these agents: Normalize records, Split and verify job levels, Analyze requirements, Rewrite and validate, Compare datasets, Compare license and education, Export results.";

export const idahoInstructions = `<details><summary>Idaho trial and estimate</summary><p>Upload idaho-first-100.csv in Data first. Then use the imported test key and send the experiment below. The trial samples five source records across input lengths, including both extremes. All non-web stages run; missing comparison evidence stays unknown. Review Results, download the artifacts, and estimate the whole 100-record run. Do not approve bulk spending.</p><pre>${idahoExperiment}</pre></details>`;

/** Scripted operator is only used by the offline rehearsal; live Codex writes its own adapter. */
export function offlineIdahoOperator() {
  return async (workspace: string) => {
    const cli = <T>(...args: string[]) =>
      offlineWorkflowCli<T>(workspace, ...args);
    const snapshot = await cli<YpWorkflowSnapshot>("status");
    const asset = snapshot.assets.find((item) => item.source === "upload")!;
    await cli("data", asset.id);
    await readFile(path.join(workspace, "data", asset.id));
    const root = path.join(workspace, "package");
    await writeFile(
      path.join(root, "source/adaptIdaho.ts"),
      `import { asJson, object, type Agent } from "./sdk.js";
export const run: Agent = async (context, input) => {
  if (!Array.isArray(input)) throw new Error("Expected CSV rows");
  const keys = ${JSON.stringify(idahoHeaders)};
  const rows = input.map(value => { const row = object(value); return {
    ...row, name: row["Class Title"], jurisdiction: "Idaho, USA",
    metadata: Object.fromEntries(keys.map(key => [key, row[key] ?? ""])),
    text: keys.map(key => key + ": " + String(row[key] ?? "")).join("\\n\\n")
  }; });
  await context.artifact("adapted-jobs.json", JSON.stringify(rows), "application/json");
  await context.progress(rows.length, rows.length);
  return asJson(rows);
};\n`,
    );
    const graph = snapshot.workspace.graph;
    for (const node of graph.nodes) {
      if (node.kind === "agent") node.enabled = idahoStages.includes(node.id);
      if (node.id === "normalize")
        node.configuration.jurisdiction = "Idaho, USA";
      if (node.id === "analyze") delete node.configuration.tasks;
    }
    graph.nodes.push({
      id: "adapt-import",
      kind: "agent",
      label: "Adapt Idaho CSV",
      description:
        "Preserve all eight Idaho fields and runner provenance before normalization; no model calls.",
      entrypoint: "source/adaptIdaho.ts",
      enabled: true,
      models: {},
      configuration: {},
      position: { x: 40, y: 90 },
    });
    for (const edge of graph.edges)
      if (edge.target === "normalize") edge.target = "adapt-import";
    graph.edges.push({
      id: "idaho-normalize",
      source: "adapt-import",
      target: "normalize",
    });
    await writeFile(
      path.join(root, "graph.json"),
      JSON.stringify(graph, null, 2),
    );
    await cli("validate");
    const run = await cli<YpWorkflowRun>(
      "trial",
      "--sample",
      String(idahoSample),
      asset.id,
    );
    return `Offline rehearsal: Idaho trial ${run.id} started through ${idahoStages.join(" → ")}. All seven analysis tasks are included; reference comparisons will remain unknown. No bulk work approved.`;
  };
}

export function verifyIdahoActions(
  observed: BrowserObservation[],
  downloads: string[],
) {
  const successful = observed.filter((item) => item.status === 200);
  const posts = successful.filter((item) => item.method === "POST");
  const uploads = posts.filter((item) => item.route.endsWith("/assets"));
  assert.equal(uploads.length, 1, "Upload exactly one CSV through the browser");
  assert.equal(
    posts[0],
    uploads[0],
    "CSV upload must be the first browser mutation",
  );
  assert.equal(posts.filter((item) => item.route.endsWith("/chat")).length, 1);
  assert.equal(
    posts.filter((item) => item.route.endsWith("/account/api-key")).length,
    1,
  );
  assert.equal(
    posts.filter((item) => item.route.endsWith("/runs")).length,
    1,
    "Estimate exactly one bulk run",
  );
  assert.ok(
    !posts.some((item) => /\/runs\/[^/]+\/(start|resume)$/.test(item.route)),
    "Never approve or resume bulk in this trial-only case",
  );
  assert.ok(
    successful.some(
      (item) => item.method === "GET" && item.route.endsWith("/results"),
    ),
    "Review results through the browser",
  );
  for (const id of downloads)
    assert.ok(
      successful.some(
        (item) => item.method === "GET" && item.route.endsWith(`/assets/${id}`),
      ),
      "Download every output through the browser",
    );
}

export function verifyIdahoResults(
  source: IdahoRow[],
  assetId: string,
  sampled: string[],
  adapted: unknown,
  output: unknown,
) {
  assert.ok(Array.isArray(adapted));
  assert.equal(adapted.length, idahoSample);
  assert.equal(sampled.length, idahoSample);
  assert.equal(new Set(sampled).size, idahoSample);
  assert.deepEqual(new Set(adapted.map((row) => row.id)), new Set(sampled));
  const expected = new Map(
    source.map((row, index) => [`${assetId}:${index + 1}`, row]),
  );
  for (const row of adapted) {
    const original = expected.get(row.id);
    assert.ok(original, "Adapter selected a record outside the first 100");
    assert.equal(row.name, original["Class Title"]);
    assert.equal(
      row.text,
      idahoText(original),
      "Adapter changed an Idaho source field",
    );
    assert.equal(row.source, assetId);
    assert.equal(row.jurisdiction, "Idaho, USA");
    assert.deepEqual(
      row.metadata,
      original,
      "Adapter lost original column metadata",
    );
  }
  assert.ok(Array.isArray(output));
  for (const row of output) {
    assert.equal(row.source, assetId, "Result lost upload provenance");
    const original = expected.get(row.parentId ?? row.id);
    assert.ok(original, "Unexpected result identity");
    assert.equal(
      row.titleCode,
      original["Class Code"],
      "Result lost the source title code",
    );
    assert.deepEqual(
      row.metadata,
      original,
      "Result lost original column metadata",
    );
    assert.equal(
      row.jurisdiction,
      "Idaho, USA",
      "Result used the wrong jurisdiction",
    );
  }
  const rows = resultRows.parse(output);
  assert.deepEqual(
    new Set(rows.map((row) => row.parentId ?? row.id)),
    new Set(sampled),
    "Missing sampled parent or unexpected result",
  );
  for (const row of rows) {
    assert.equal(
      row.parentName ?? row.name,
      expected.get(row.parentId ?? row.id)!["Class Title"],
    );
    assert.equal(
      row.originalText,
      idahoText(expected.get(row.parentId ?? row.id)!),
    );
    for (const stage of ["compare", "compare-license"]) {
      const comparison = row.analysis[stage] as {
        status?: string;
        missingEvidence?: unknown[];
      };
      assert.equal(
        comparison?.status,
        "unknown",
        "Missing reference evidence must stay unknown",
      );
      assert.ok(comparison.missingEvidence?.length);
    }
  }
  verifyAnalyses(rows, analysisNames);
  verifyReviewedRewrites(rows);
  return {
    sampledParents: sampled.length,
    outputRecords: rows.length,
    unknown: rows.filter((row) => row.status === "unknown").length,
    allSevenAnalyses: true,
    reviewedRewrites: true,
  };
}
