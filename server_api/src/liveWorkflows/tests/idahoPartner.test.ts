import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { idahoHeaders, sha256 } from "./manual/idahoData.js";
import {
  preparePartnerData,
  boundedPartnerFirecrawl,
  partnerFirecrawlLimit,
} from "./manual/idahoPartner.js";
import {
  auditPartnerCsv,
  writePartnerBundle,
} from "./manual/idahoPartnerReport.js";
import {
  collectPartnerExports,
  recoverPartnerExports,
} from "./manual/idahoPartnerExports.js";
import { loadAgent } from "./skillsFirstFixture.js";
import { researchResponse } from "./researchFixture.js";
import { renderWorkbook, WORKBOOK_SPEC_CONTENT_TYPE } from "../workbooks.js";
import type { Context } from "../runner/run.js";

test("research review fits bounded documents without repeating full pages or earlier research", async () => {
  const research = await loadAgent("research");
  const evidence = "A license is required.";
  const markdown = `${evidence}\n${"Background material. ".repeat(2900)}`;
  const priorResearch = { trace: "Prior research. ".repeat(8000) };
  let reviewInput: any;
  const output = (await research(
    {
      nodeId: "education",
      mode: "trial",
      configuration: { maxPages: 5, maxSources: 4, maxFollowupRounds: 0 },
      model: async (_key, system, input) => {
        if (system.startsWith("Independently verify the synthesized")) {
          reviewInput = input;
          assert.ok(
            Buffer.byteLength(JSON.stringify(input) + system) + 1024 + 65536 <
              271999,
          );
        }
        return researchResponse(system, input);
      },
      connector: async () => ({
        retrievedAt: "2026-10-17T00:00:00.000Z",
        pages: Array.from({ length: 4 }, (_, i) => ({
          url: `https://example.gov/statute-${i}`,
          markdown,
          truncated: true,
        })),
      }),
      progress: async () => {},
      checkpoint: async () => {},
      restore: async () => undefined,
      artifact: async () => {},
      cancelled: async () => false,
    },
    [
      {
        id: "record-10",
        name: "Technician",
        text: evidence,
        jurisdiction: "Idaho, USA",
        source: "fixture",
        status: "complete",
        analysis: { research: { licenses: priorResearch } },
        citations: [],
        errors: [],
      },
    ],
  )) as any[];
  assert.ok(reviewInput, "An independent review must still run");
  assert.equal(reviewInput.job.text, evidence);
  assert.equal(reviewInput.job.analysis, undefined);
  assert.equal(reviewInput.sources.length, 4);
  for (const source of reviewInput.sources) {
    assert.equal(source.text, undefined);
    assert.deepEqual(source.extraction.requirements[0].quotes, [evidence]);
    assert.equal(source.truncated, true);
    assert.equal(source.jurisdictionMatches, true);
    assert.equal(source.retrievedAt, "2026-10-17T00:00:00.000Z");
  }
  assert.equal(output[0].analysis.research.education.status, "unknown");
  assert.deepEqual(output[0].analysis.research.licenses, priorResearch);
  assert.ok(output[0].citations.every((c: any) => c.quote === evidence));
  assert.ok(
    Buffer.byteLength(markdown) * 4 +
      Buffer.byteLength(JSON.stringify(priorResearch)) >
      271999,
  );
});

const columns = JSON.parse(
  await readFile(
    new URL(
      "../../../workflow-packages/skills-first/schemas/exportColumns.json",
      import.meta.url,
    ),
    "utf8",
  ),
) as Record<string, { header: string }[]>;
const headers = [...columns.core, ...columns.license, ...columns.legal].map(
  (column) => column.header,
);
const csv = (rows: readonly (readonly unknown[])[]) =>
  rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`)
        .join(","),
    )
    .join("\r\n");
const table = (changes: Record<string, unknown> = {}) =>
  csv([
    headers,
    headers,
    headers.map(
      (header) =>
        ({
          isDegreeAbsolutelyRequired: false,
          isLicenseRequired: false,
          validationScore: 0,
          maximumDegreeRequirement: "none",
          readabilityLevel: "Bachelor's Degree",
          ...changes,
        })[header],
    ),
  ]);
const inputCsv = () =>
  csv([
    idahoHeaders,
    ...Array.from({ length: 12 }, (_, index) =>
      idahoHeaders.map((header) =>
        header === "Class Code"
          ? "00180"
          : header === "Class Title"
            ? `Manager ${index + 1}`
            : header === "Qualifications"
              ? 'Line one, "quoted"\r\nLine two\u00a0— résumé'
              : "",
      ),
    ),
  ]);

test("partner selection preserves exactly the first ten rows, duplicate codes, Unicode and original bytes", async () => {
  const directory = await mkdtemp("/tmp/idaho-partner-test-");
  try {
    const source = path.join(directory, "source.csv");
    await writeFile(source, inputCsv());
    const data = await preparePartnerData(
      path.join(directory, "input"),
      source,
    );
    assert.equal(data.selection.originalRecords, 12);
    assert.equal(data.rows.length, 10);
    assert.equal(data.rows[9]["Class Title"], "Manager 10");
    assert.deepEqual(
      parse(await readFile(data.fixture), { columns: true }),
      data.rows,
    );
    assert.equal(new Set(data.rows.map((row) => row["Class Code"])).size, 1);
    assert.equal(
      data.selection.fixtureSha256,
      sha256(await readFile(data.fixture)),
    );
    assert.equal(await readFile(source, "utf8"), inputCsv());
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("contract audit distinguishes false/zero/conditional blanks from missing required decisions", () => {
  const audit = auditPartnerCsv(table());
  assert.equal(audit.columns, 74);
  assert.equal(audit.filterReady, true);
  for (const field of [
    "isDegreeAbsolutelyRequired",
    "isLicenseRequired",
    "validationScore",
  ])
    assert.equal(audit.fields.find((item) => item.field === field)?.filled, 1);
  const missing = auditPartnerCsv(
    table({ isDegreeAbsolutelyRequired: null, isLicenseRequired: "" }),
  );
  assert.equal(missing.filterReady, false);
  assert.equal(missing.requiredBlankCells, 2);
  assert.equal(missing.issues.length, 2);
});

test("contract audit flags the partner's unknown checks, invalid categories and curly apostrophes without rewriting evidence", () => {
  const text = table({
    cscRevisedConsistency: "unknown",
    readabilityLevel: "Bachelor’s Degree",
    maximumDegreeRequirement: "graduate",
    licenseType: "driver's license",
  });
  const audit = auditPartnerCsv(text);
  assert.deepEqual(
    audit.issues.map((issue) => issue.field),
    ["maximumDegreeRequirement", "cscRevisedConsistency", "readabilityLevel"],
  );
  assert.ok(audit.issues.some((issue) => issue.value === "unknown"));
  assert.equal(
    audit.fields.find((field) => field.field === "licenseType")?.filled,
    1,
  );
  assert.throws(
    () =>
      auditPartnerCsv(
        text
          .replace('"agentId"', '"changed"')
          .replace('"agentId"', '"changed"'),
      ),
    /74 headers/,
  );
});

test("partner Firecrawl ceiling permits ten-record research but rejects extra paid work before fetch", async () => {
  let calls = 0;
  const transport = boundedPartnerFirecrawl(async () => {
    calls++;
    return new Response("{}");
  });
  for (let i = 0; i < partnerFirecrawlLimit; i++)
    await transport.firecrawlFetch("https://api.firecrawl.dev/v2/search", {
      method: "POST",
    });
  await assert.rejects(
    transport.firecrawlFetch("https://api.firecrawl.dev/v2/search", {
      method: "POST",
    }),
    /request cap/,
  );
  assert.equal(calls, partnerFirecrawlLimit);
  assert.equal(transport.paidRequests(), partnerFirecrawlLimit);
  await transport.firecrawlFetch(
    "https://api.firecrawl.dev/v2/team/credit-usage",
  );
  assert.equal(transport.paidRequests(), partnerFirecrawlLimit);
});

test("share bundle copies only named artifacts, reports incomplete execution, and hashes downloads unchanged", async () => {
  const output = await mkdtemp("/tmp/idaho-partner-bundle-test-");
  try {
    const source = path.join(output, "source.csv");
    await writeFile(source, inputCsv());
    const data = await preparePartnerData(path.join(output, "input"), source);
    await writeFile(
      path.join(output, "idaho-trial-results.csv"),
      table({ isLicenseRequired: null }),
    );
    await writeFile(
      path.join(output, "private-diagnostics.txt"),
      "not for sharing",
    );
    const bundle = await writePartnerBundle({
      output,
      data,
      mode: "offline",
      records: [],
      executionPassed: false,
      error: "incomplete",
    });
    assert.equal(bundle.filterReady, false);
    assert.ok(
      !(await readdir(bundle.directory)).includes("private-diagnostics.txt"),
    );
    const summary = JSON.parse(
      await readFile(path.join(bundle.directory, "summary.json"), "utf8"),
    );
    assert.equal(summary.simulated, true);
    assert.equal(summary.executionPassed, false);
    assert.equal(summary.referenceDatasetProvided, false);
    const hashes = JSON.parse(
      await readFile(path.join(bundle.directory, "SHA256SUMS.json"), "utf8"),
    );
    assert.equal(
      hashes["idaho-trial-results.csv"],
      sha256(await readFile(path.join(output, "idaho-trial-results.csv"))),
    );
    assert.match(
      await readFile(path.join(bundle.directory, "README.txt"), "utf8"),
      /NEEDS REVIEW/,
    );
  } finally {
    await rm(output, { recursive: true, force: true });
  }
});

test("Idaho class code is preserved from original metadata without replacing record identity", async () => {
  const { canonicalJob } = await import(
    new URL(
      "../../../workflow-packages/skills-first/source/memory.ts",
      import.meta.url,
    ).href
  );
  const job = canonicalJob({
    id: "upload:2",
    name: "Manager",
    text: "Description",
    source: "upload",
    status: "pending",
    jurisdiction: "Idaho, USA",
    metadata: { "Class Code": "00180" },
    analysis: {},
    citations: [],
    errors: [],
  });
  assert.equal(job.id, "upload:2");
  assert.equal(job.titleCode, "00180");
  assert.equal(job.classCode, "00180");
  assert.equal(
    canonicalJob({ ...job, classCode: "explicit" }).classCode,
    "explicit",
  );
});

test("partner delivery preserves every production part and consolidates rows without dropping false/zero values", async () => {
  const output = await mkdtemp("/tmp/idaho-partner-parts-test-");
  try {
    const exportAgent = await loadAgent("export");
    const artifacts = new Map<string, Buffer>();
    const records: Record<string, unknown>[] = [];
    for (const index of [1, 2]) {
      const context: Context = {
        nodeId: "export",
        mode: "trial",
        configuration: { agentId: "skills-first" },
        model: async () => {
          throw new Error("No model calls");
        },
        connector: async () => {
          throw new Error("No connectors");
        },
        checkpoint: async () => {},
        restore: async () => undefined,
        progress: async () => {},
        cancelled: async () => false,
        artifact: async (name, content, type) => {
          const bytes =
            type === WORKBOOK_SPEC_CONTENT_TYPE
              ? await renderWorkbook(content)
              : Buffer.from(content);
          artifacts.set(
            name.replace("skills-first.", `skills-first-000${index}.`),
            bytes,
          );
        },
      };
      const result = await exportAgent(context, [
        {
          id: `row-${index}`,
          name: `Job ${index}`,
          text: "Preserved source.",
          originalText: "Preserved source.",
          source: "upload",
          jurisdiction: "Idaho, USA",
          status: "unknown",
          errors: [],
          citations: [],
          analysis: { fleschKincaidGrade: 0 },
          multiLevelJob: false,
          degreeAnalysis: {
            degreeRequirementStatus: { isDegreeAbsolutelyRequired: false },
            professionalLicenseRequirement: { isLicenseRequired: false },
          },
          readabilityAnalysisTextTSNPM: { fleschKincaidGrade: 0 },
        },
      ]);
      records.push(...(result as Record<string, unknown>[]));
    }
    const result = await collectPartnerExports({
      output,
      runId: "test",
      artifacts,
      records: records.toReversed(),
      usage: [],
    });
    assert.equal(
      result.passed,
      true,
      JSON.stringify(result.missingOrChangedValues),
    );
    assert.equal(result.delivery.consolidated, true);
    assert.equal(result.delivery.parts.length, 2);
    const data: string[][] = parse(
      await readFile(path.join(output, "idaho-trial-results.csv")),
    );
    assert.equal(data.length, 4);
    assert.equal(
      data[2][headers.indexOf("isDegreeAbsolutelyRequired")],
      "false",
    );
    assert.equal(data[3][headers.indexOf("fleschKincaidGrade")], "0");
    assert.deepEqual(
      await readFile(
        path.join(output, "production-exports/skills-first-0001.xlsx"),
      ),
      artifacts.get("skills-first-0001.xlsx"),
    );
    const single = new Map(
      [...artifacts]
        .filter(([name]) => name.includes("0001"))
        .map(([name, bytes]) => [name.replace("-0001", ""), bytes]),
    );
    const one = await collectPartnerExports({
      output: path.join(output, "single"),
      runId: "test",
      artifacts: single,
      records: records.slice(0, 1),
      usage: [],
    });
    assert.equal(one.delivery.consolidated, false);
    assert.deepEqual(
      await readFile(path.join(output, "single/idaho-trial-results.xlsx")),
      single.get("skills-first.xlsx"),
    );
    const recovered = await recoverPartnerExports({
      output: path.join(output, "partial"),
      runId: "test",
      records: records.map((record, index) =>
        index === 1
          ? {
              ...record,
              error: null,
              errors: ["analyze: Rejected source quote"],
            }
          : record,
      ),
      usage: [],
      stage: "licenses",
      method: "Verified saved stage; later agents did not run.",
    });
    const recovery = recovered.verification;
    assert.equal(recovered.records[1].error, "analyze: Rejected source quote");
    assert.equal(recovery.passed, true);
    assert.equal(recovery.delivery.recovered?.stage, "licenses");
    assert.match(recovery.delivery.note, /PARTIAL RESULTS/);
    assert.match(recovery.delivery.note, /did not complete in the browser/);
    const source = path.join(output, "source.csv");
    await writeFile(source, inputCsv());
    const partialData = await preparePartnerData(
      path.join(output, "partial/input"),
      source,
    );
    const bundle = await writePartnerBundle({
      output: path.join(output, "partial"),
      data: partialData,
      records,
      mode: "offline",
      executionPassed: false,
    });
    const readme = await readFile(
      path.join(bundle.directory, "README.txt"),
      "utf8",
    );
    assert.match(readme, /PARTIAL RESULTS/);
    assert.doesNotMatch(
      readme,
      /exact production artifacts downloaded in the browser/,
    );
    artifacts.delete("skills-first-0002.xlsx");
    await assert.rejects(
      collectPartnerExports({
        output,
        runId: "test",
        artifacts,
        records,
        usage: [],
      }),
      /Missing.*companion/,
    );
  } finally {
    await rm(output, { recursive: true, force: true });
  }
});
