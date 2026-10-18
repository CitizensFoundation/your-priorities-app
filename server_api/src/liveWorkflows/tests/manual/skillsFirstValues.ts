/** Read-only acceptance checks for live results, independent of the package's projections. */
import ExcelJS from "exceljs";
import { isDeepStrictEqual } from "node:util";
import { readFile } from "node:fs/promises";
import { parse } from "csv-parse/sync";
import { stableRequestId } from "../../runner/socketClient.js";
import { modelJson } from "../../runner/modelJson.js";
import type { UsageReservation } from "../../budget.js";
import { analysisNames } from "./verification.js";

const object = (value: unknown): Record<string, any> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, any>)
    : {};
function at(value: unknown, path: string): unknown {
  const parts = path.split(".");
  const walk = (item: unknown, index: number): unknown => {
    if (index === parts.length) return item;
    if (Array.isArray(item)) return item.map((entry) => walk(entry, index));
    return walk(object(item)[parts[index]], index + 1);
  };
  return walk(value, 0);
}
const separator = "\r\n|\r\n";
function scalar(value: unknown): unknown {
  if (value === null || value === undefined) return null;
  if (Array.isArray(value))
    return value.map((v) => scalar(v) ?? "").join(separator);
  return typeof value === "object" ? JSON.stringify(value) : value;
}
// Explicit mappings ensure a missing projection is detected, even when the renderer
// consistently exports the same wrong/empty canonical value to all three formats.
const projections: Record<string, Record<string, string>> = {
  degrees: Object.fromEntries(
    [
      "needsCollegeDegree",
      "maximumDegreeRequirement",
      "includesMultipleJobLevelsWithDifferentEducationalRequirements",
      "educationRequirements",
    ].map((key) => [key, `degreeAnalysis.${key}`]),
  ),
  mandatory: {
    ...Object.fromEntries(
      [
        "isDegreeMandatory",
        "hasAlternativeQualifications",
        "alternativeQualifications",
        "multipleQualificationPaths",
        "isDegreeAbsolutelyRequired",
        "substitutionPossible",
      ].map((key) => [key, `degreeAnalysis.degreeRequirementStatus.${key}`]),
    ),
    ...Object.fromEntries(
      [
        "degreeRequirementExplanation",
        "bothTrueExplanation",
        "bothFalseExplanation",
      ].map((key) => [
        `mandatoryStatusExplanations.${key}`,
        `degreeAnalysis.mandatoryStatusExplanations.${key}`,
      ]),
    ),
    degreePreferenceQuote: "degreeAnalysis.degreePreferenceQuote",
  },
  licenses: Object.fromEntries(
    [
      "isLicenseRequired",
      "licenseType",
      "licenseDescription",
      "issuingAuthority",
      "includesDegreeRequirement",
    ].map((key) => [
      key,
      `degreeAnalysis.professionalLicenseRequirement.${key}`,
    ]),
  ),
  barriers: {
    barriersToNonDegreeApplicants:
      "degreeAnalysis.barriersToNonDegreeApplicants",
  },
  consistency: { validationChecks: "degreeAnalysis.validationChecks" },
  readingLevel: Object.fromEntries(
    [
      "readabilityLevel",
      "readabilityLevelExplanation",
      "difficultPassages",
      "readingLevelMatchesDegreeRequirement",
    ].map((key) => [key, `readingLevelGradeAnalysis.${key}`]),
  ),
};

export async function verifySkillsFirstValues(input: {
  runId: string;
  /** Original analysis receipt scope when a new trial reuses that exact stage. */
  analysisRunId?: string;
  records: Record<string, unknown>[];
  memory: unknown;
  csv: Buffer;
  xlsx: Buffer;
  usage: UsageReservation[];
}) {
  // API rootDir excludes package sources. Verify the ID binding contract and
  // independently check exact source bytes, projections and exported values.
  const { resolveDocumentEvidence } = await import(
    new URL(
      "../../../../workflow-packages/skills-first/source/documentEvidence.ts",
      import.meta.url,
    ).href
  );
  const { licenseLabel, readingLevelLabel } = await import(
    new URL(
      "../../../../workflow-packages/skills-first/source/labels.ts",
      import.meta.url,
    ).href
  );
  const issues: {
    recordId: string | null;
    field: string;
    expected: unknown;
    actual: unknown;
  }[] = [];
  let checks = 0,
    populatedFindings = 0,
    verifiedQuotes = 0,
    rawResponses = 0;
  const unknownFindings: { recordId: string; field: string; reason: string }[] =
    [];
  const excelLineEndingNormalizations: { recordId: string; field: string }[] =
    [];
  const equal = (
    recordId: string | null,
    field: string,
    actual: unknown,
    expected: unknown,
  ) => {
    checks++;
    if (!isDeepStrictEqual(actual, expected))
      issues.push({
        recordId,
        field,
        expected: expected ?? null,
        actual: actual ?? null,
      });
  };
  const memory = object(input.memory);
  // XML readers normalize CRLF/CR to LF inside Excel string cells. Preserve exact
  // JSON/CSV checks, compare all other Excel characters, and report normalization.
  const equalExcel = (
    recordId: string,
    field: string,
    actual: unknown,
    expected: unknown,
  ) => {
    if (
      typeof actual === "string" &&
      typeof expected === "string" &&
      actual !== expected &&
      actual === expected.replace(/\r\n?/g, "\n")
    ) {
      excelLineEndingNormalizations.push({ recordId, field });
      equal(recordId, field, actual, expected.replace(/\r\n?/g, "\n"));
    } else equal(recordId, field, actual, expected);
  };
  const jobs = (memory.jobDescriptions ?? []) as Record<string, unknown>[];
  equal(null, "memory.jobDescriptions", jobs, input.records);
  equal(
    null,
    "memory.llmErrors",
    memory.llmErrors,
    jobs.flatMap((job) =>
      (job.errors as string[]).map((error) => `${job.id}: ${error}`),
    ),
  );
  const accepted = jobs.filter(
    (job) =>
      job.rewrittenText &&
      !(job.errors as string[]).length &&
      object(object(job.analysis).rewriteValidation).allChecksPassed === true,
  );
  equal(
    null,
    "memory.rewrittenJobDescriptions",
    memory.rewrittenJobDescriptions,
    accepted,
  );

  const ledger = new Map(input.usage.map((entry) => [entry.id, entry]));
  for (const job of jobs) {
    const id = String(job.id),
      analysis = object(job.analysis);
    for (const task of analysisNames) {
      const entry = ledger.get(
        stableRequestId(
          `${input.analysisRunId ?? input.runId}:analyze:${id}:${task}`,
        ),
      );
      if (!entry) {
        equal(
          id,
          `analysis.${task}.providerResponse`,
          Boolean(analysis[task]),
          false,
        );
        unknownFindings.push({
          recordId: id,
          field: task,
          reason:
            "Task did not return a settled response; inspect record errors.",
        });
        continue;
      }
      equal(id, `analysis.${task}.settled`, entry.status, "settled");
      let raw: Record<string, any>;
      try {
        raw = object(modelJson(String(object(entry.result).content)));
      } catch {
        equal(
          id,
          `analysis.${task}.invalidJsonIsFlagged`,
          (job.errors as string[]).length > 0,
          true,
        );
        continue;
      }
      rawResponses++;
      const result = object(analysis[task]);
      if (Object.keys(result).length === 0) {
        equal(
          id,
          `analysis.${task}.rejectedResponseRetained`,
          object(analysis.rejectedAnalysis).response,
          raw,
        );
        equal(
          id,
          `analysis.${task}.rejectionIsFlagged`,
          (job.errors as string[]).length > 0,
          true,
        );
        continue;
      }
      const resolvedRaw = resolveDocumentEvidence(raw, String(job.text), task);
      equal(
        id,
        `analysis.${task}.findingsFromProvider`,
        result.findings,
        resolvedRaw.findings,
      );
      equal(
        id,
        `analysis.${task}.evidenceFromProvider`,
        result.evidence,
        resolvedRaw.evidence,
      );
      for (const quote of result.evidence ?? []) {
        equal(
          id,
          `analysis.${task}.exactQuote`,
          typeof quote === "string" &&
            quote.length > 0 &&
            String(job.text).includes(quote),
          true,
        );
        verifiedQuotes++;
      }
      for (const [field, target] of Object.entries(projections[task] ?? {})) {
        let value = at(resolvedRaw.findings, field);
        if (typeof value === "string") {
          if (task === "licenses" && field === "licenseType")
            value = licenseLabel(value);
          if (task === "readingLevel" && field === "readabilityLevel")
            value = readingLevelLabel(value);
        }
        equal(id, `${task}.${field}→${target}`, at(job, target), value);
        if (value === null || value === undefined)
          unknownFindings.push({
            recordId: id,
            field: target,
            reason:
              "Model returned null (unknown or inapplicable); no value was lost in export.",
          });
        else populatedFindings++;
      }
    }
    equal(
      id,
      "fleschKincaidGrade",
      at(job, "readabilityAnalysisTextTSNPM.fleschKincaidGrade"),
      analysis.fleschKincaidGrade,
    );
    const values = Object.values(
      object(at(job, "degreeAnalysis.validationChecks")),
    );
    equal(
      id,
      "validationScore",
      job.validationScore,
      values.length === 9 && values.every((v) => v !== null)
        ? values.filter((v) => v === "pass").length
        : null,
    );
  }

  const columns = JSON.parse(
    await readFile(
      new URL(
        "../../../../workflow-packages/skills-first/schemas/exportColumns.json",
        import.meta.url,
      ),
      "utf8",
    ),
  ) as Record<"core" | "license" | "legal", { header: string; path: string }[]>;
  const headers = [...columns.core, ...columns.license, ...columns.legal].map(
    (c) => c.header,
  );
  const book = new ExcelJS.Workbook();
  await book.xlsx.load(
    input.xlsx as unknown as Parameters<typeof book.xlsx.load>[0],
  );
  const master = book.getWorksheet("merged (master + legal)")!;
  const csv = parse(input.csv) as string[][];
  const readCell = (sheet: ExcelJS.Worksheet, row: number, column: number) => {
    // Reconstruct long cells using the renderer's lossless overflow sheet.
    const overflow = book.getWorksheet("Long cell text");
    const parts: { index: number; text: string }[] = [];
    overflow?.eachRow((value, index) => {
      if (
        index > 1 &&
        value.getCell(1).value === sheet.name &&
        value.getCell(2).value === row &&
        value.getCell(3).value === column
      )
        parts.push({
          index: Number(value.getCell(4).value),
          text: String(value.getCell(5).value ?? ""),
        });
    });
    return parts.length
      ? parts
          .sort((a, b) => a.index - b.index)
          .map((p) => p.text)
          .join("")
      : sheet.getCell(row, column).value;
  };
  equal(
    null,
    "xlsx.headers",
    headers.map((_, i) => readCell(master, 2, i + 1)),
    headers,
  );
  equal(null, "csv.headers", csv[1], headers);
  const expectedRows = jobs.flatMap((job) => {
    const licenses = (job.licenseComparisons as unknown[]).length
      ? (job.licenseComparisons as unknown[])
      : [undefined];
    const legal = at(job, "degreeAnalysis.deepResearchResults") as unknown[];
    return licenses.flatMap((license) =>
      (legal.length ? legal : [undefined]).map((research) => ({
        id: String(job.id),
        cells: [
          ...columns.core.map(({ header, path }) =>
            header === "agentId"
              ? (memory.agentId ?? job.agentId ?? null)
              : header === "educationRequirements"
                ? ((at(job, path) as any[] | null)
                    ?.map((r) => `${r.type}: ${r.evidenceQuote}`)
                    .join(separator) ?? null)
                : scalar(at(job, path)),
          ),
          ...columns.license.map(({ path }) => scalar(at(license, path))),
          ...columns.legal.map(({ path }) =>
            path === "reasoning" && object(research).status === "unknown"
              ? `Needs review: ${object(research).reasoning ?? "Research is incomplete or unverified."}`
              : scalar(at(research, path)),
          ),
        ],
      })),
    );
  });
  equal(null, "xlsx.rows", master.rowCount - 2, expectedRows.length);
  equal(null, "csv.rows", csv.length - 2, expectedRows.length);
  for (const [index, row] of expectedRows.entries())
    for (const [column, expected] of row.cells.entries()) {
      const actual = readCell(master, index + 3, column + 1);
      equalExcel(
        row.id,
        `xlsx.${headers[column]}`,
        actual === "" ? null : (actual ?? null),
        expected === "" ? null : expected,
      );
      const value = String(expected ?? "");
      const safe = /^(?:\s*[=+@\-]|[\t\r])/.test(value) ? `'${value}` : value;
      equal(row.id, `csv.${headers[column]}`, csv[index + 2]?.[column], safe);
    }
  const documents = book.getWorksheet("Documents")!,
    provenance = book.getWorksheet("Review and provenance")!;
  equal(null, "xlsx.documents.rows", documents.rowCount - 1, jobs.length);
  for (const [index, job] of jobs.entries()) {
    const row = index + 2,
      id = String(job.id);
    const expected = [
      job.id,
      job.name,
      job.originalText ?? job.text,
      job.text,
      accepted.includes(job) ? job.rewrittenText : null,
      at(job, "degreeAnalysis.degreePreferenceQuote"),
      at(job, "readingLevelGradeAnalysis.readabilityLevelExplanation"),
      at(job, "readingLevelGradeAnalysis.readingLevelMatchesDegreeRequirement"),
      at(job, "analysis.documentRequirements.degree.statement"),
      at(job, "analysis.documentRequirements.degree.explanation"),
      at(job, "analysis.documentRequirements.license.statement"),
      at(job, "analysis.documentRequirements.license.explanation"),
      at(job, "analysis.documentRequirements")
        ? "Supplied description only. Not stated does not establish that no external requirement applies."
        : null,
    ];
    expected.forEach((value, i) => {
      const actual = readCell(documents, row, i + 1);
      equalExcel(
        id,
        `xlsx.Documents.${i + 1}`,
        actual === "" ? null : (actual ?? null),
        value === "" ? null : (value ?? null),
      );
    });
    equal(
      id,
      "xlsx.Review.analysis",
      JSON.parse(String(readCell(provenance, row, 9))),
      job.analysis,
    );
    equal(
      id,
      "xlsx.Review.errors",
      readCell(provenance, row, 5) ?? null,
      (job.errors as string[]).join("; ") || job.error || null,
    );
  }
  return {
    passed: issues.length === 0,
    records: jobs.length,
    checks,
    rawResponses,
    populatedFindings,
    verifiedQuotes,
    masterColumns: headers.length,
    missingOrChangedValues: issues,
    excelLineEndingNormalizations,
    unknownFindings,
    note: "Checks transport, exact source quotes and output completeness. Semantic findings and rewrites still require review; nulls are reported separately from lost values.",
  };
}
