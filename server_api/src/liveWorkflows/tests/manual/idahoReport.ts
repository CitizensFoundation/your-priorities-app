import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import ExcelJS from "exceljs";
import { renderWorkbook } from "../../workbooks.js";
import type { UsageReservation } from "../../budget.js";
import { estimateFromTrial } from "../../budget.js";
import { stableRequestId } from "../../runner/socketClient.js";
import { analysisNames } from "./verification.js";
import type { ManualHarness } from "./harness.js";
import { redactManualText } from "./environment.js";
import { summarizeIdahoFirecrawl } from "./idahoResearch.js";

/** Cost arithmetic only. Failed-record trials remain ineligible for product bulk approval. */
export function informationalIdahoProjection(trial: YpWorkflowRun | undefined) {
  if (
    !trial ||
    trial.status !== "completed" ||
    trial.reservedMicros ||
    trial.reuse
  )
    return null;
  const failedRecords = Math.max(
    0,
    ...Object.values(trial.nodeStates).map((node) => node.failedRecords ?? 0),
  );
  return {
    ...estimateFromTrial(trial, 100),
    approvalEligible: false,
    failedRecords,
    basis: failedRecords
      ? "Informational extrapolation from observed trial spending, including failed reviews and retries. This is not an eligible bulk quote or approval; resolve failed records and run a successful trial first."
      : "Informational extrapolation from a completed trial, including review retries. No bulk quote has been created or approved; request an estimate in the workflow UI before approving any full run.",
  };
}

export function idahoQuality(records: Record<string, unknown>[]) {
  const rows = records.map((row) => {
    const analysis = (row.analysis ?? {}) as Record<string, unknown>;
    const research =
      analysis.research &&
      typeof analysis.research === "object" &&
      !Array.isArray(analysis.research)
        ? Object.values(
            analysis.research as Record<string, { status?: string }>,
          )
        : [];
    const review = analysis.rewriteValidation as
      | {
          allChecksPassed?: boolean;
          feedback?: string;
          checks?: { name: string; passed: boolean; reason?: string }[];
        }
      | undefined;
    return {
      id: String(row.id),
      name: String(row.name),
      errors: row.errors,
      allSevenAnalysesPresent: analysisNames.every((name) =>
        Boolean(analysis[name]),
      ),
      rewriteAccepted:
        review?.allChecksPassed === true && Boolean(row.rewrittenText),
      feedback: review?.feedback ?? null,
      failedChecks: review?.checks?.filter((check) => !check.passed) ?? [],
      researchChecks: research.length,
      unresolvedResearchChecks: research.filter(
        (stage) => stage?.status !== "known",
      ).length,
    };
  });
  return {
    records: rows.length,
    analyzed: rows.filter((row) => row.allSevenAnalysesPresent).length,
    acceptedRewrites: rows.filter((row) => row.rewriteAccepted).length,
    needsReview: rows.filter((row) => !row.rewriteAccepted).length,
    researchChecks: rows.reduce((total, row) => total + row.researchChecks, 0),
    unresolvedResearchChecks: rows.reduce(
      (total, row) => total + row.unresolvedResearchChecks,
      0,
    ),
    recordsWithResearchGaps: rows.filter(
      (row) => row.unresolvedResearchChecks > 0,
    ).length,
    note: "needsReview counts rejected rewrites. Research uncertainty is reported separately; an accepted rewrite does not establish legal requirements.",
    rows,
  };
}

export function idahoCosts(
  runs: Pick<YpWorkflowRun, "id" | "mode" | "nodeIds" | "graph">[],
  usage: UsageReservation[],
  resultIds: string[] = [],
) {
  assert.equal(
    new Set(usage.map((item) => item.id)).size,
    usage.length,
    "Duplicate ledger request",
  );
  const sum = (items: UsageReservation[]) => ({
    requests: items.length,
    settledMicros: items.reduce(
      (total, item) =>
        total + (item.status === "settled" ? (item.actualMicros ?? 0) : 0),
      0,
    ),
    reservedMicros: items.reduce(
      (total, item) =>
        total + (item.status !== "settled" ? item.maximumMicros : 0),
      0,
    ),
    unresolvedRequests: items.filter((item) => item.status !== "settled")
      .length,
    modelMicros: items.reduce(
      (sum, item) =>
        sum +
        (!item.creditUsage && item.status === "settled"
          ? (item.actualMicros ?? 0)
          : 0),
      0,
    ),
    firecrawlMicros: items.reduce(
      (sum, item) =>
        sum +
        (item.creditUsage && item.status === "settled"
          ? (item.actualMicros ?? 0)
          : 0),
      0,
    ),
    firecrawlCredits: summarizeIdahoFirecrawl(items).credits,
    firecrawlReservedCredits: summarizeIdahoFirecrawl(items).reservedCredits,
    tokensIn: items.reduce(
      (total, item) =>
        total +
        Number(
          (item.result as { tokensIn?: number } | undefined)?.tokensIn ?? 0,
        ),
      0,
    ),
    tokensOut: items.reduce(
      (total, item) =>
        total +
        Number(
          (item.result as { tokensOut?: number } | undefined)?.tokensOut ?? 0,
        ),
      0,
    ),
  });
  const agents = runs
    .filter((run) => run.mode === "trial")
    .flatMap((run) =>
      run.nodeIds.map((nodeId) => {
        const node = run.graph.nodes.find((node) => node.id === nodeId)!;
        return {
          runId: run.id,
          nodeId,
          agent: node.label,
          models: node.models,
          reasoningEffort: node.reasoningEffort ?? null,
          ...sum(
            usage.filter(
              (item) => item.runId === run.id && item.nodeId === nodeId,
            ),
          ),
        };
      }),
    );
  const tasks = runs
    .filter((run) => run.mode === "trial")
    .flatMap((run) =>
      analysisNames.map((task) => {
        const ids = new Set(
          resultIds.map((id) =>
            stableRequestId(`${run.id}:analyze:${id}:${task}`),
          ),
        );
        return {
          runId: run.id,
          task,
          ...sum(usage.filter((item) => ids.has(item.id))),
        };
      }),
    );
  const totals = sum(usage);
  assert.equal(
    agents.reduce((total, agent) => total + agent.settledMicros, 0),
    totals.settledMicros,
    "Agent totals do not reconcile",
  );
  return {
    currency: "USD",
    agents,
    analysisTasks: tasks,
    totals,
    firecrawl: summarizeIdahoFirecrawl(usage),
    taskNote:
      "Analysis task costs are a breakdown of Analyze requirements, not additional charges. Unmatched requests stay included in agent totals.",
    unmatchedAnalysisRequests:
      agents
        .filter((agent) => agent.nodeId === "analyze")
        .reduce((n, agent) => n + agent.requests, 0) -
      tasks.reduce((n, task) => n + task.requests, 0),
    // Preserve billing evidence without including provider response contents or credentials.
    requests: usage.map(({ result, ...item }) => ({
      ...item,
      billing: result
        ? {
            tokensIn: (result as Record<string, unknown>).tokensIn,
            tokensOut: (result as Record<string, unknown>).tokensOut,
            requestedServiceTier: (result as Record<string, unknown>)
              .requestedServiceTier,
            appliedServiceTier: (result as Record<string, unknown>)
              .appliedServiceTier,
          }
        : null,
    })),
  };
}

export async function saveIdahoCosts(
  harness: ManualHarness,
  output: string,
  resultIds: string[] = [],
) {
  const snapshot = await harness.request<YpWorkflowSnapshot>("");
  const usage = await harness.request<UsageReservation[]>("/usage");
  const processing = idahoCosts(snapshot.runs, usage, resultIds);
  assert.equal(processing.totals.settledMicros, snapshot.workspace.spentMicros);
  assert.equal(
    processing.totals.reservedMicros,
    snapshot.workspace.reservedMicros,
  );
  const codex = harness.codexUsage.report();
  const historicalCodex = harness.historicalCodexUsage ?? null;
  const totalCodexEstimatedMicros =
    codex.estimatedCostMicros === null ||
    historicalCodex?.estimatedCostMicros === null
      ? null
      : codex.estimatedCostMicros + (historicalCodex?.estimatedCostMicros ?? 0);
  const report = {
    ...processing,
    simulated: codex.simulated,
    codex,
    historicalCodex,
    totalCodexEstimatedMicros,
    combinedSettledAndEstimatedMicros:
      totalCodexEstimatedMicros === null
        ? null
        : processing.totals.settledMicros + totalCodexEstimatedMicros,
    estimate:
      snapshot.runs.find((run) => run.mode === "bulk")?.estimate ?? null,
    informationalProjection: snapshot.runs.some((run) => run.mode === "bulk")
      ? null
      : informationalIdahoProjection(
          snapshot.runs.find((run) => run.mode === "trial"),
        ),
    bulkApproved: snapshot.runs.some(
      (run) => run.mode === "bulk" && run.approvedAt,
    ),
    note: "Processing includes settled model charges at backend catalog prices and Firecrawl credits allocated at the frozen binding rate. Firecrawl costs are included, not added again. Codex is a separate estimate at the requested tier. Infrastructure is excluded. A 100-record estimate is not spending approval.",
  };
  await writeFile(
    path.join(output, "costs.json"),
    redactManualText(JSON.stringify(report, null, 2)),
    { mode: 0o600 },
  );
  const rows = [
    "Agent,Run ID,Requests,Settled USD,Unresolved reserved USD,Input tokens,Output tokens,Model USD,Firecrawl USD,Firecrawl credits,Reserved credits",
    ...report.agents.map((agent) =>
      [
        `"${(/^[=+@\-\t\r]/.test(agent.agent) ? "'" : "") + agent.agent.replaceAll('"', '""')}"`,
        agent.runId,
        agent.requests,
        (agent.settledMicros / 1e6).toFixed(6),
        (agent.reservedMicros / 1e6).toFixed(6),
        agent.tokensIn,
        agent.tokensOut,
        (agent.modelMicros / 1e6).toFixed(6),
        (agent.firecrawlMicros / 1e6).toFixed(6),
        agent.firecrawlCredits,
        agent.firecrawlReservedCredits,
      ].join(","),
    ),
  ];
  await writeFile(path.join(output, "agent-costs.csv"), rows.join("\r\n"), {
    mode: 0o600,
  });
  return report;
}

/** Bound cell size and wrapped height while retaining every character, including surrogate pairs. */
export function workbookTextParts(value: unknown) {
  const parts: string[] = [];
  let part = "",
    lines = 1;
  for (const character of String(value ?? "")) {
    if (part.length + character.length > 1200 || lines > 16) {
      parts.push(part);
      part = "";
      lines = 1;
    }
    part += character;
    if (character === "\n") lines++;
  }
  if (part || !parts.length) parts.push(part);
  return parts;
}

/** Reusable test export from browser-saved results; does not change the VM package or call models. */
async function writeIdahoDiagnostics(
  output: string,
  records: Record<string, unknown>[],
  costs: Awaited<ReturnType<typeof saveIdahoCosts>>,
) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Skills First manual browser test";
  const sheet = (name: string, headers: string[], widths: number[]) => {
    const ws = workbook.addWorksheet(name, {
      views: [{ state: "frozen", ySplit: 1, showGridLines: false }],
      pageSetup: {
        orientation: "landscape",
        paperSize: 9,
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
        printTitlesRow: "1:1",
        margins: {
          left: 0.3,
          right: 0.3,
          top: 0.4,
          bottom: 0.4,
          header: 0.2,
          footer: 0.2,
        },
      },
    });
    ws.columns = headers.map((header, index) => ({
      header,
      width: widths[index] ?? 24,
    }));
    ws.getRow(1).height = 32;
    ws.getRow(1).eachCell((cell) => {
      cell.font = { name: "Calibri", bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF173B57" },
      };
      cell.alignment = { vertical: "middle", wrapText: true };
    });
    ws.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: headers.length },
    };
    return ws;
  };
  const overview = sheet("Overview", ["Item", "Value"], [43, 100]);
  const projection = costs.estimate ?? costs.informationalProjection;
  const quality = idahoQuality(records);
  await writeFile(
    path.join(output, "quality-review.json"),
    JSON.stringify(quality, null, 2),
    { mode: 0o600 },
  );
  overview.addRows([
    [
      "Mode",
      costs.simulated
        ? "OFFLINE REHEARSAL — simulated results and costs"
        : "Live Luna trial — five sampled Idaho classifications",
    ],
    ["Population", "First 100 records in original CSV order"],
    [
      "Sampling",
      "Five original records stratified across input lengths; not the first five",
    ],
    ["Bulk execution", "NOT APPROVED / NOT RUN"],
    [
      "Research",
      costs.agents.some((agent) =>
        ["licenses", "education"].includes(agent.nodeId),
      )
        ? "Firecrawl license/education research enabled. Exact citations and coverage are retained. Missing reference/manual inputs remain unknown; see research-report.json."
        : "Disabled. No external reference dataset; comparison evidence remains unknown.",
    ],
    ["Result records (may include job levels)", records.length],
    ["Processing settled USD", costs.totals.settledMicros / 1e6],
    ["Processing unresolved reserved USD", costs.totals.reservedMicros / 1e6],
    [
      "Codex estimated USD",
      costs.totalCodexEstimatedMicros === null
        ? "Unavailable"
        : costs.totalCodexEstimatedMicros / 1e6,
    ],
    [
      "Combined actual processing + estimated Codex USD",
      costs.combinedSettledAndEstimatedMicros === null
        ? "Unavailable"
        : {
            formula: "SUM(B8,B10)",
            result: costs.combinedSettledAndEstimatedMicros / 1e6,
          },
    ],
    [
      costs.estimate
        ? "Projected processing for all 100 USD"
        : "Informational 100-record projection USD",
      projection ? projection.expectedMicros / 1e6 : "No estimate",
    ],
    [
      "Upper projection for all 100 USD",
      projection ? projection.upperMicros / 1e6 : "No estimate",
    ],
    ["Cost basis", costs.note],
    [
      "Analysis",
      "Automated draft findings, not human-verified conclusions. Unknowns and failures are retained.",
    ],
    [
      "Source",
      "Idaho Classification CSV.csv; see selection.json for checksums and row identities",
    ],
    ["Accepted rewrites", quality.acceptedRewrites],
    ["Records needing rewrite review", quality.needsReview],
    [
      "Projection status",
      costs.informationalProjection?.basis ??
        "Unapproved product estimate. No bulk execution.",
    ],
    ["Research checks needing review", quality.unresolvedResearchChecks],
    ["Records with unresolved research", quality.recordsWithResearchGaps],
  ]);
  for (let row = 8; row <= 13; row++)
    overview.getCell(row, 2).numFmt = '"$"#,##0.000000';
  const jobs = sheet(
    "Jobs",
    ["Title", "Status", "Errors", "Record ID", "Parent ID", "Jurisdiction"],
    [48, 16, 60, 46, 46, 20],
  );
  const findings = sheet(
    "Findings",
    [
      "Job",
      "Analysis",
      "Status",
      "Findings / details",
      "Evidence / gaps",
      "Part",
    ],
    [40, 24, 14, 95, 95, 10],
  );
  const texts = sheet(
    "Texts",
    ["Job", "Document", "Part", "Text"],
    [40, 24, 10, 125],
  );
  const chunks = workbookTextParts;
  for (const record of records) {
    const title = String(record.name);
    jobs.addRow([
      title,
      record.status,
      JSON.stringify(record.errors),
      record.id,
      record.parentId ?? "",
      record.jurisdiction,
    ]);
    for (const [name, value] of Object.entries(
      (record.analysis ?? {}) as Record<string, unknown>,
    )) {
      const entry =
        value && typeof value === "object"
          ? (value as Record<string, unknown>)
          : {};
      const details = chunks(JSON.stringify(entry.findings ?? value, null, 2));
      const evidence = chunks(
        JSON.stringify(entry.evidence ?? entry.missingEvidence ?? [], null, 2),
      );
      for (
        let index = 0;
        index < Math.max(details.length, evidence.length);
        index++
      )
        findings.addRow([
          title,
          name,
          entry.status ?? "",
          details[index] ?? "",
          evidence[index] ?? "",
          index + 1,
        ]);
    }
    for (const [label, content] of [
      ["Original", record.originalText],
      ["Rewritten", record.rewrittenText],
      ["Full result JSON", JSON.stringify(record, null, 2)],
    ])
      chunks(content).forEach((text, index) =>
        texts.addRow([title, label, index + 1, text]),
      );
  }
  const agentCosts = sheet(
    "Agent costs",
    [
      "Agent",
      "Requests",
      "Input tokens",
      "Output tokens",
      "Settled micro USD",
      "Settled USD",
      "Reserved USD",
      "Model USD",
      "Firecrawl USD",
      "Firecrawl credits",
    ],
    [38, 12, 18, 18, 22, 20, 20],
  );
  costs.agents.forEach((agent) => {
    const row = agentCosts.rowCount + 1;
    agentCosts.addRow([
      agent.agent,
      agent.requests,
      agent.tokensIn,
      agent.tokensOut,
      agent.settledMicros,
      { formula: `E${row}/1000000`, result: agent.settledMicros / 1e6 },
      agent.reservedMicros / 1e6,
      agent.modelMicros / 1e6,
      agent.firecrawlMicros / 1e6,
      agent.firecrawlCredits,
    ]);
  });
  agentCosts.getColumn(6).numFmt = agentCosts.getColumn(7).numFmt =
    '"$"#,##0.000000';
  const taskCosts = sheet(
    "Analysis task costs",
    [
      "Task (included in agent total)",
      "Requests",
      "Input tokens",
      "Output tokens",
      "Settled USD",
      "Reserved USD",
    ],
    [38, 12, 18, 18, 20, 20],
  );
  costs.analysisTasks.forEach((task) =>
    taskCosts.addRow([
      task.task,
      task.requests,
      task.tokensIn,
      task.tokensOut,
      task.settledMicros / 1e6,
      task.reservedMicros / 1e6,
    ]),
  );
  taskCosts.getColumn(5).numFmt = taskCosts.getColumn(6).numFmt =
    '"$"#,##0.000000';
  for (const ws of workbook.worksheets)
    ws.eachRow((row, index) => {
      if (index === 1) return;
      let lines = 1;
      row.eachCell((cell) => {
        const numeric =
          typeof cell.value === "number" ||
          cell.type === ExcelJS.ValueType.Formula;
        cell.alignment = {
          vertical: "top",
          wrapText: true,
          horizontal: numeric ? "right" : "left",
        };
        cell.font = { name: "Calibri", size: 11 };
        const width = Math.max(10, (ws.getColumn(cell.col).width ?? 24) - 5);
        lines = Math.max(
          lines,
          cell.text
            .split("\n")
            .reduce(
              (n, line) => n + Math.max(1, Math.ceil(line.length / width)),
              0,
            ),
        );
      });
      row.height = Math.min(390, Math.max(22, lines * 16 + 5));
    });
  const filename = path.join(output, "idaho-trial-diagnostics.xlsx");
  await workbook.xlsx.writeFile(filename);
  const readback = new ExcelJS.Workbook();
  await readback.xlsx.readFile(filename);
  assert.equal(readback.getWorksheet("Jobs")!.rowCount - 1, records.length);
  assert.equal(
    readback.getWorksheet("Agent costs")!.rowCount - 1,
    costs.agents.length,
  );
  assert.deepEqual(
    readback.getWorksheet("Texts")!.getColumn(4).values,
    texts.getColumn(4).values,
    "Excel export changed source/result text",
  );
  return filename;
}

/** The primary workbook is the production export; costs stay in a separate diagnostic file. */
export async function writeIdahoWorkbook(
  output: string,
  records: Record<string, unknown>[],
  costs: Awaited<ReturnType<typeof saveIdahoCosts>>,
  downloadedWorkbook?: Buffer,
) {
  let bytes = downloadedWorkbook;
  if (!bytes) {
    // Allows local re-export of already saved results without any provider calls.
    const source = new URL(
      "../../../../workflow-packages/skills-first/source/",
      import.meta.url,
    );
    const { skillsFirstMemory } = await import(
      new URL("memory.ts", source).href
    );
    const { workbook } = await import(new URL("workbook.ts", source).href);
    const jobs = records.map((row) => ({
      ...row,
      text: row.text ?? row.originalText ?? "",
      citations: row.citations ?? [],
    }));
    bytes = await renderWorkbook(
      JSON.stringify(workbook(skillsFirstMemory(jobs))),
    );
  }
  const filename = path.join(output, "idaho-trial-results.xlsx");
  await writeFile(filename, bytes, { mode: 0o600 });
  const readback = new ExcelJS.Workbook();
  await readback.xlsx.readFile(filename);
  assert.equal(
    readback.getWorksheet("merged (master + legal)")!.getRow(2).cellCount,
    74,
  );
  assert.equal(
    readback.getWorksheet("Review and provenance")!.rowCount - 1,
    records.length,
  );
  assert.ok(readback.getWorksheet("license info"));
  assert.ok(readback.getWorksheet("legal research"));
  await writeIdahoDiagnostics(output, records, costs);
  return filename;
}
