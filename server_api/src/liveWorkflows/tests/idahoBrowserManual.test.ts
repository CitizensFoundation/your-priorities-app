import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { parse } from "csv-parse/sync";
import {
  idahoHeaders,
  idahoSelection,
  prepareIdahoData,
  sha256,
  idahoText,
} from "./manual/idahoData.js";
import {
  verifyIdahoActions,
  verifyIdahoResults,
} from "./manual/interactiveBrowserIdaho.js";
import { analysisNames } from "./manual/verification.js";
import {
  idahoCosts,
  workbookTextParts,
  informationalIdahoProjection,
  writeIdahoWorkbook,
} from "./manual/idahoReport.js";
import ExcelJS from "exceljs";
import { ManualCodexUsage } from "./manual/codexUsage.js";
import { resolveManualConfig } from "./manual/environment.js";
import { fixture as workflowFixture } from "./memoryStore.js";
import { stableRequestId } from "../runner/socketClient.js";
import type { UsageReservation } from "../budget.js";
import type { BrowserObservation } from "./manual/interactiveBrowser.js";

const fixture = () => {
  const rows = Array.from({ length: 101 }, (_, index) =>
    Object.fromEntries(
      idahoHeaders.map((header) => [
        header,
        header === "Class Code"
          ? String(index + 1).padStart(4, "0")
          : header === "Class Title"
            ? `Idaho job ${index + 1}`
            : header === "Summary"
              ? 'Line one, "quoted"\r\nLine two — résumé'
              : header === "Qualifications"
                ? "=Untrusted source text, kept verbatim"
                : "",
      ]),
    ),
  );
  const cell = (value: string) => `"${value.replaceAll('"', '""')}"`;
  const csv =
    "\uFEFF" +
    [idahoHeaders, ...rows.map((row) => idahoHeaders.map((key) => row[key]))]
      .map((row) => row.map(cell).join(","))
      .join("\r\n");
  return { rows, csv };
};

test("Excel text parts preserve long and untrusted source text without oversized or clipped cells", () => {
  const text = "=DO_NOT_EXECUTE()\n" + "quoted Idaho text 🏔️\n".repeat(4000);
  const parts = workbookTextParts(text);
  assert.equal(parts.join(""), text);
  assert.ok(
    parts.every((part) => part.length <= 1200 && part.split("\n").length <= 17),
  );
  assert.deepEqual(workbookTextParts(undefined), [""]);
});

test("a failed-review trial still produces Excel output and a clearly ineligible cost projection", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "idaho-failed-review-"));
  try {
    const { run } = await workflowFixture();
    run.mode = "trial";
    run.status = "completed";
    run.inputCount = 5;
    run.spentMicros = 100_000;
    run.reservedMicros = 0;
    run.nodeIds = ["rewrite"];
    run.graph = {
      nodes: [
        {
          id: "rewrite",
          kind: "agent",
          label: "Rewrite",
          enabled: true,
          configuration: {},
          models: {},
          position: { x: 0, y: 0 },
        },
      ],
      edges: [],
    };
    run.nodeStates = {
      rewrite: {
        status: "completed",
        processed: 5,
        total: 5,
        failedRecords: 2,
      },
    };
    const projection = informationalIdahoProjection(run)!;
    assert.equal(projection.approvalEligible, false);
    assert.equal(projection.failedRecords, 2);
    assert.equal(projection.expectedMicros, 2_000_000);
    const successful = structuredClone(run);
    successful.nodeStates.rewrite.failedRecords = 0;
    const successfulProjection = informationalIdahoProjection(successful)!;
    assert.equal(successfulProjection.failedRecords, 0);
    assert.match(successfulProjection.basis, /completed trial/);
    assert.doesNotMatch(successfulProjection.basis, /resolve failed records/);
    assert.equal(
      informationalIdahoProjection({ ...run, status: "running" }),
      null,
    );
    assert.equal(
      informationalIdahoProjection({ ...run, reservedMicros: 1 }),
      null,
    );
    const call: UsageReservation = {
      id: "request",
      runId: run.id,
      nodeId: "rewrite",
      fingerprint: "test",
      status: "settled",
      actualMicros: 100_000,
      maximumMicros: 200_000,
      description: "Fixture model",
      createdAt: "now",
    };
    const costs = {
      ...idahoCosts([run], [call]),
      simulated: true,
      codex: new ManualCodexUsage(resolveManualConfig({}), "offline").report(),
      combinedSettledAndEstimatedMicros: 100_000,
      estimate: null,
      informationalProjection: projection,
      bulkApproved: false,
      note: "Offline regression fixture",
    };
    const rows = Array.from({ length: 5 }, (_, index) => ({
      id: String(index),
      name: `Fixture ${index}`,
      source: "fixture",
      jurisdiction: "Idaho, USA",
      status: "unknown",
      originalText: "=Untrusted source text",
      rewrittenText: index < 3 ? "Reviewed draft" : undefined,
      errors: index < 3 ? [] : ["Rewrite needs clarification"],
      analysis: {
        ...Object.fromEntries(
          analysisNames.map((name) => [
            name,
            { status: "unknown", findings: {}, evidence: [] },
          ]),
        ),
        rewriteValidation: {
          allChecksPassed: index < 3,
          feedback: "Fixture review",
          checks: [{ name: "readability", passed: index < 3 }],
        },
      },
    }));
    const filename = await writeIdahoWorkbook(root, rows, costs);
    const book = new ExcelJS.Workbook();
    await book.xlsx.readFile(filename);
    assert.equal(book.getWorksheet("merged (master + legal)")!.rowCount, 7);
    assert.equal(
      book.getWorksheet("merged (master + legal)")!.getRow(2).cellCount,
      74,
    );
    assert.equal(
      book.getWorksheet("Documents")!.getCell("C2").type,
      ExcelJS.ValueType.String,
      "Never turn source text into a formula",
    );
    await book.xlsx.readFile(path.join(root, "idaho-trial-diagnostics.xlsx"));
    assert.equal(book.getWorksheet("Overview")!.getCell("B12").value, 2);
    assert.match(
      String(book.getWorksheet("Overview")!.getCell("B19").value),
      /not an eligible bulk quote/,
    );
    const quality = JSON.parse(
      await readFile(path.join(root, "quality-review.json"), "utf8"),
    );
    assert.equal(quality.acceptedRewrites, 3);
    assert.equal(quality.needsReview, 2);
    assert.equal(quality.analyzed, 5);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("Idaho output acceptance rejects changed source fields, wrong jurisdiction and missing analysis", () => {
  const { rows } = idahoSelection(fixture().csv);
  const adapted = rows.slice(0, 5).map((row, index) => ({
    id: `asset:${index + 1}`,
    source: "asset",
    name: row["Class Title"],
    text: idahoText(row),
    metadata: row,
    jurisdiction: "Idaho, USA",
  }));
  const results = adapted.map((row) => ({
    ...row,
    titleCode: row.metadata["Class Code"],
    originalText: row.text,
    rewrittenText: row.text,
    status: "unknown",
    errors: [],
    analysis: {
      ...Object.fromEntries(
        analysisNames.map((name) => [
          name,
          { status: "unknown", findings: {}, evidence: [] },
        ]),
      ),
      compare: { status: "unknown", missingEvidence: ["No reference dataset"] },
      "compare-license": {
        status: "unknown",
        missingEvidence: ["No researched education evidence"],
      },
      rewriteValidation: {
        allChecksPassed: true,
        checks: [
          "dutyPreservation",
          "legalRequirements",
          "inclusiveLanguage",
          "readability",
          "factualAccuracy",
        ].map((name) => ({ name, passed: true })),
      },
    },
  }));
  const sampled = adapted.map((row) => row.id);
  verifyIdahoResults(rows, "asset", sampled, adapted, results);
  const incorrect = structuredClone(results);
  incorrect[0].jurisdiction = "New Jersey, USA";
  assert.throws(
    () => verifyIdahoResults(rows, "asset", sampled, adapted, incorrect),
    /wrong jurisdiction/,
  );
  const changed = structuredClone(adapted);
  changed[0].text = "Source was summarized";
  assert.throws(
    () => verifyIdahoResults(rows, "asset", sampled, changed, results),
    /changed an Idaho source/,
  );
  const missing = results.map((row) => ({
    ...row,
    analysis: { ...row.analysis } as Record<string, unknown>,
  }));
  delete missing[0].analysis.evidence;
  assert.throws(() =>
    verifyIdahoResults(rows, "asset", sampled, adapted, missing),
  );
});

test("Idaho selection preserves the first 100 parsed rows, exact fields, multiline quotes and identifiers", () => {
  const { rows, csv } = fixture();
  const selected = idahoSelection(csv);
  assert.equal(selected.records, 101);
  assert.deepEqual(selected.rows, rows.slice(0, 100));
  assert.deepEqual(parse(selected.csv, { columns: true }), rows.slice(0, 100));
  assert.equal(selected.rows[0]["Class Code"], "0001");
  assert.throws(
    () => idahoSelection(csv.replace("Class Title", "Wrong title")),
    /Unexpected Idaho/,
  );
  assert.throws(() => idahoSelection("Class Code\n1\n"), /at least 100/);
});

test("Idaho import keeps a byte-identical local original and refuses to overwrite a different original", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "idaho-import-test-"));
  try {
    const source = path.join(root, "source.csv"),
      target = path.join(root, "local");
    const { csv } = fixture();
    await writeFile(source, csv);
    const imported = await prepareIdahoData(source, target);
    assert.equal(imported.sourceSha256, sha256(csv));
    assert.equal(await readFile(imported.source, "utf8"), csv);
    assert.equal(
      parse(await readFile(imported.fixture), { columns: true }).length,
      100,
    );
    await prepareIdahoData(source, target);
    await writeFile(source, csv.replace("Idaho job 1", "Different job"));
    await assert.rejects(prepareIdahoData(source, target), /differs/);
    assert.equal(await readFile(imported.source, "utf8"), csv);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("Idaho browser acceptance requires upload-first and never accepts bulk approval", () => {
  const actions: BrowserObservation[] = [
    ["POST", "assets"],
    ["POST", "account/api-key"],
    ["POST", "chat"],
    ["GET", "runs/trial/results"],
    ["GET", "assets/download"],
    ["POST", "runs"],
  ].map(([method, route], order) => ({
    method,
    route: `/api/live-workflows/groups/1/${route}`,
    status: 200,
    order,
  }));
  verifyIdahoActions(actions, ["download"]);
  assert.throws(
    () =>
      verifyIdahoActions(
        [actions[1], actions[0], ...actions.slice(2)],
        ["download"],
      ),
    /first browser mutation/,
  );
  assert.throws(
    () =>
      verifyIdahoActions(
        [
          ...actions,
          {
            method: "POST",
            route: "/api/live-workflows/groups/1/runs/bulk/start",
            status: 200,
            order: 7,
          },
        ],
        ["download"],
      ),
    /Never approve/,
  );
  assert.throws(
    () =>
      verifyIdahoActions(
        actions.filter((action) => !action.route.endsWith("/download")),
        ["download"],
      ),
    /Download every output/,
  );
});

test("Idaho costs reconcile zero-cost stages, settled and unresolved calls, and analysis subtasks without double billing", () => {
  const run = {
    id: "trial",
    mode: "trial",
    nodeIds: ["normalize", "analyze"],
    graph: {
      nodes: ["normalize", "analyze"].map((id) => ({
        id,
        label: id,
        kind: "agent" as const,
        enabled: true,
        configuration: {},
        position: { x: 0, y: 0 },
        models: { default: "luna" },
        reasoningEffort: "max" as const,
      })),
      edges: [],
    },
  } satisfies Pick<YpWorkflowRun, "id" | "mode" | "nodeIds" | "graph">;
  const call = {
    id: stableRequestId("trial:analyze:record:degrees"),
    runId: "trial",
    nodeId: "analyze",
    status: "settled",
    actualMicros: 1234,
    maximumMicros: 5000,
    result: { tokensIn: 100, tokensOut: 200, content: "Private model content" },
    fingerprint: "hash",
    description: "Model luna",
    createdAt: "now",
  } satisfies UsageReservation;
  const unknown = {
    ...call,
    id: "unresolved",
    status: "unknown" as const,
    actualMicros: undefined,
    result: undefined,
  };
  const costs = idahoCosts([run], [call, unknown], ["record"]);
  assert.equal(costs.agents[0].settledMicros, 0);
  assert.equal(costs.agents[1].settledMicros, 1234);
  assert.equal(costs.totals.settledMicros, 1234);
  assert.equal(costs.totals.reservedMicros, 5000);
  assert.equal(
    costs.analysisTasks.find((task) => task.task === "degrees")!.settledMicros,
    1234,
  );
  assert.equal(costs.unmatchedAnalysisRequests, 1);
  assert.ok(!JSON.stringify(costs).includes("Private model content"));
  assert.throws(() => idahoCosts([run], [call, call]), /Duplicate ledger/);
});
