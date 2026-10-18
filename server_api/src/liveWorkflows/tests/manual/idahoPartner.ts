import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "csv-parse/sync";
import {
  idahoHeaders,
  idahoSource,
  idahoText,
  sha256,
  type IdahoRow,
} from "./idahoData.js";
import {
  idahoResearchExperiment,
  idahoResearchStages,
} from "./interactiveBrowserIdaho.js";
import { offlineWorkflowCli } from "./headlessRehearsal.js";
import { analysisNames } from "./verification.js";
import type { ManualHarness } from "./harness.js";
import type { BrowserObservation } from "./interactiveBrowser.js";

export const partnerRecords = 10;
export const partnerFirecrawlLimit = 160;
export const partnerExperiment = idahoResearchExperiment.replace(
  "Please process everything",
  "Please process all 10 uploaded records in one trial",
);
export const partnerInstructions = `<details><summary>First ten Idaho records — all agents</summary><p>Upload idaho-first-10.csv first, connect the imported test key, and send the request below. Both Firecrawl research agents run. Processing has a cumulative $5 cap; Codex is reported separately. No bulk run is requested. Missing source, reference or legal evidence stays explicit in the partner report.</p><pre>${partnerExperiment}</pre></details>`;

export async function preparePartnerData(
  directory: string,
  source = idahoSource,
) {
  const original = await readFile(source);
  const parsed: IdahoRow[] = parse(original, {
    columns: true,
    bom: true,
    skip_empty_lines: true,
    max_record_size: 1_000_000,
  });
  assert.ok(
    parsed.length >= partnerRecords,
    "Need at least ten Idaho source records",
  );
  assert.deepEqual(Object.keys(parsed[0]), [...idahoHeaders]);
  const rows = parsed.slice(0, partnerRecords);
  for (const row of rows) {
    assert.ok(row["Class Code"].trim() && row["Class Title"].trim());
    assert.ok(row.Summary.trim() || row.Qualifications.trim());
  }
  const csv =
    [idahoHeaders, ...rows.map((row) => idahoHeaders.map((key) => row[key]))]
      .map((row) =>
        row.map((value) => `"${value.replaceAll('"', '""')}"`).join(","),
      )
      .join("\r\n") + "\r\n";
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const fixture = path.join(directory, "idaho-first-10.csv");
  await writeFile(fixture, csv, { mode: 0o600 });
  const selection = {
    originalRecords: parsed.length,
    sourceSha256: sha256(original),
    selectedRecords: partnerRecords,
    fixtureSha256: sha256(csv),
    selection:
      "First ten parsed data records in original file order; no deduplication or length sampling outside these ten",
    rows: rows.map((row, index) => ({
      sourceRow: index + 1,
      classCode: row["Class Code"],
      name: row["Class Title"],
    })),
  };
  await writeFile(
    path.join(directory, "selection.json"),
    JSON.stringify(selection, null, 2),
  );
  return { fixture, rows, selection };
}
export type PartnerData = Awaited<ReturnType<typeof preparePartnerData>>;

/** Fixture settings only. The live assistant still writes its own adapter and starts the trial. */
export async function configurePartnerGraph(harness: ManualHarness) {
  const { workspace } = await harness.request<YpWorkflowSnapshot>("");
  for (const node of workspace.graph.nodes) {
    if (node.id === "normalize")
      node.configuration.fields = { classCode: "Class Code" };
    if (node.id === "export") node.configuration.agentId = "skills-first";
  }
  await harness.request("/graph", "PUT", {
    graph: workspace.graph,
    revision: workspace.revision,
  });
}

/** Separate ten-record rehearsal; the existing five-record operator stays unchanged. */
export async function offlinePartnerOperator(workspace: string) {
  const cli = <T>(...args: string[]) =>
    offlineWorkflowCli<T>(workspace, ...args);
  const snapshot = await cli<YpWorkflowSnapshot>("status");
  const asset = snapshot.assets.find((item) => item.source === "upload")!;
  await cli("data", asset.id);
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
    if (node.kind === "agent")
      node.enabled = idahoResearchStages.includes(node.id);
    if (node.id === "normalize") node.configuration.jurisdiction = "Idaho, USA";
    if (node.id === "analyze") delete node.configuration.tasks;
  }
  graph.nodes.push({
    id: "adapt-import",
    kind: "agent",
    label: "Adapt Idaho CSV",
    description:
      "Preserve all eight source fields, duplicate class codes and row identities.",
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
    String(partnerRecords),
    asset.id,
  );
  return `Offline rehearsal: all ten Idaho records started through all agents in trial ${run.id}. Missing reference data remains unknown. No bulk run.`;
}

export function verifyPartnerSelection(
  data: PartnerData,
  uploadId: string,
  run: YpWorkflowRun,
  adapted: unknown,
  rows: Record<string, unknown>[],
) {
  const expected = new Map(
    data.rows.map((row, index) => [`${uploadId}:${index + 1}`, row]),
  );
  assert.equal(run.inputCount, partnerRecords);
  assert.equal(run.sample?.populationCount, partnerRecords);
  assert.deepEqual(new Set(run.sample.recordIds), new Set(expected.keys()));
  assert.deepEqual(run.nodeIds, idahoResearchStages);
  for (const id of idahoResearchStages)
    assert.equal(run.nodeStates[id]?.status, "completed");
  assert.ok(Array.isArray(adapted));
  assert.equal(adapted.length, partnerRecords);
  assert.deepEqual(
    new Set(adapted.map((row) => row.id)),
    new Set(expected.keys()),
  );
  for (const row of adapted) {
    const original = expected.get(row.id)!;
    assert.equal(row.name, original["Class Title"]);
    assert.equal(row.text, idahoText(original));
    assert.deepEqual(row.metadata, original);
    assert.equal(row.source, uploadId);
  }
  assert.deepEqual(
    new Set(rows.map((row) => row.parentId ?? row.id)),
    new Set(expected.keys()),
  );
  for (const row of rows) {
    const original = expected.get(String(row.parentId ?? row.id))!;
    assert.equal(row.source, uploadId);
    assert.equal(row.originalText, idahoText(original));
    assert.equal(row.titleCode, original["Class Code"]);
    assert.equal(row.classCode, original["Class Code"]);
    assert.deepEqual(row.metadata, original);
    assert.equal(row.jurisdiction, "Idaho, USA");
  }
}

export function partnerStageCoverage(
  run: YpWorkflowRun,
  rows: Record<string, unknown>[],
) {
  const object = (value: unknown) =>
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  return idahoResearchStages.map((nodeId) => ({
    nodeId,
    status: run.nodeStates[nodeId]?.status ?? "not_run",
    failedRecords: run.nodeStates[nodeId]?.failedRecords ?? 0,
    records: rows.map((row) => {
      const analysis = object(row.analysis);
      const result = object(
        ["licenses", "education"].includes(nodeId)
          ? object(analysis.research)[nodeId]
          : analysis[nodeId],
      );
      return {
        id: row.id,
        name: row.name,
        ...(nodeId === "analyze"
          ? { missingTasks: analysisNames.filter((task) => !analysis[task]) }
          : {}),
        status: result.status ?? null,
        missingEvidence: result.missingEvidence ?? result.gaps ?? [],
      };
    }),
  }));
}

export function verifyPartnerBrowserActions(
  requests: BrowserObservation[],
  downloads: string[],
) {
  const successful = requests.filter((item) => item.status === 200);
  const posts = successful.filter((item) => item.method === "POST");
  const uploads = posts.filter((item) => item.route.endsWith("/assets"));
  assert.equal(uploads.length, 1);
  assert.equal(posts[0], uploads[0], "Upload is the first browser mutation");
  assert.equal(posts.filter((item) => item.route.endsWith("/chat")).length, 1);
  assert.equal(
    posts.filter((item) => item.route.endsWith("/account/api-key")).length,
    1,
  );
  assert.ok(
    !posts.some((item) =>
      /\/runs(?:$|\/[^/]+\/(start|resume)$)/.test(item.route),
    ),
    "No bulk approval or retry",
  );
  assert.ok(
    successful.some(
      (item) => item.method === "GET" && item.route.endsWith("/results"),
    ),
  );
  for (const id of downloads)
    assert.ok(
      successful.some(
        (item) => item.method === "GET" && item.route.endsWith(`/assets/${id}`),
      ),
    );
}

export function boundedPartnerFirecrawl(request: typeof fetch = fetch) {
  let paid = 0;
  const firecrawlFetch: typeof fetch = async (url, init) => {
    const address = String(url);
    assert.ok(
      ["search", "scrape", "team/credit-usage"].some(
        (endpoint) => address === `https://api.firecrawl.dev/v2/${endpoint}`,
      ),
    );
    if (!address.endsWith("/credit-usage")) {
      assert.equal(init?.method, "POST");
      assert.ok(
        paid < partnerFirecrawlLimit,
        "Partner test reached its Firecrawl request cap; no automatic retry",
      );
      paid++;
    }
    return request(url, init);
  };
  return { firecrawlFetch, paidRequests: () => paid };
}
