import assert from "node:assert/strict";
import {
  copyFile,
  mkdir,
  readdir,
  readFile,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { redactManualText } from "./environment.js";
import { sha256, type IdahoRow } from "./idahoData.js";
import { partnerStageCoverage, type PartnerData } from "./idahoPartner.js";
import { idahoQuality, type saveIdahoCosts } from "./idahoReport.js";

const columns = JSON.parse(
  await readFile(
    new URL(
      "../../../../workflow-packages/skills-first/schemas/exportColumns.json",
      import.meta.url,
    ),
    "utf8",
  ),
) as Record<"core" | "license" | "legal", { header: string; path: string }[]>;
const allColumns = [...columns.core, ...columns.license, ...columns.legal];
const degrees = [
  "none",
  "High school",
  "Some college",
  "Associate's degree",
  "Bachelor's degree",
  "Master's degree",
  "Doctoral degree",
];
const readingLevels = [
  "No Education Requirement",
  "High School",
  "Some College (but no degree)",
  "Associate's Degree",
  "Bachelor's Degree",
  "Master's or Doctoral Degree",
];
const booleans = new Set([
  "multiLevelJob",
  "cscRevised",
  "needsCollegeDegree",
  "includesMultipleJobLevelsWithDifferentEducationalRequirements",
  "isDegreeMandatory",
  "hasAlternativeQualifications",
  "multipleQualificationPaths",
  "isDegreeAbsolutelyRequired",
  "substitutionPossible",
  "isLicenseRequired",
  "includesDegreeRequirement",
]);
const required = new Set(["isDegreeAbsolutelyRequired", "isLicenseRequired"]);
const sourceFields = new Set([
  "variant",
  "classOfService",
  "workWeek",
  "bargainUnit",
  "salaryRange",
  "workMonth",
  "deptCode",
  "url",
  "cscRevised",
  "notes",
  "mainCategory",
  "subCategory",
]);
const csvCell = (value: unknown) => {
  const text = String(value ?? "");
  return `"${(/^(?:\s*[=+@\-]|[\t\r])/.test(text) ? "'" : "") + text.replaceAll('"', '""')}"`;
};
const csvTable = (rows: unknown[][]) =>
  rows.map((row) => row.map(csvCell).join(",")).join("\r\n") + "\r\n";

/** Audit the partner's contract independently of producer schemas. Never turn unknown into false/n/a. */
export function auditPartnerCsv(csv: Buffer | string) {
  const table: string[][] = parse(csv, { bom: true });
  assert.deepEqual(
    table[1],
    allColumns.map((column) => column.header),
    "All 74 headers must match, including whitespace",
  );
  const rows = table.slice(2);
  assert.ok(rows.length, "No exported partner rows");
  for (const row of rows) assert.equal(row.length, 74);
  const issues: {
    exportRow: number;
    field: string;
    value: string;
    issue: string;
  }[] = [];
  const fields = allColumns.map((column, index) => {
    const values = rows.map((row) => row[index]);
    const errors: typeof issues = [];
    for (const [rowIndex, value] of values.entries()) {
      let issue: string | undefined;
      if (!value.trim()) {
        if (required.has(column.header))
          issue =
            "Required yes/no field is blank; needs a supported decision before filter import";
      } else if (booleans.has(column.header) && !/^(TRUE|FALSE)$/i.test(value))
        issue = "Expected TRUE or FALSE";
      else if (
        column.header.endsWith("Consistency") &&
        !["pass", "fail", "n/a"].includes(value)
      )
        issue =
          "Partner permits pass, fail or n/a; unresolved evidence cannot silently become n/a";
      else if (
        column.header === "maximumDegreeRequirement" &&
        !degrees.includes(value)
      )
        issue = "Not an allowed education category";
      else if (
        column.header === "readabilityLevel" &&
        !readingLevels.includes(value)
      )
        issue = "Expected the reading category with straight apostrophes";
      else if (column.header === "url" && !/^https?:\/\//.test(value))
        issue = "Expected a job-description URL";
      if (issue)
        errors.push({
          exportRow: rowIndex + 3,
          field: column.header,
          value,
          issue,
        });
    }
    issues.push(...errors);
    const blankReason =
      column.header === "error"
        ? "Correct when no processing error occurred"
        : sourceFields.has(column.header)
          ? "Not a column in the supplied Idaho CSV; needs supplied source/manual/category data, not an invented value"
          : index >= 64
            ? "Requires a supported retrieved legal finding; inspect per-record research coverage and gaps"
            : index >= 51
              ? "Requires license/research evidence and, for WVU or manual fields, a supplied comparison dataset"
              : [
                    "licenseType",
                    "licenseDescription",
                    "issuingAuthority",
                    "includesDegreeRequirement",
                  ].includes(column.header)
                ? "Conditional on a license requirement and evidence for this detail"
                : [
                      "bothTrueExplanation",
                      "bothFalseExplanation",
                      "alternativeQualifications",
                    ].includes(column.header)
                  ? "Conditional on the corresponding qualification flags; otherwise legitimately blank"
                  : "Unresolved analysis, omitted task or missing source evidence; inspect the record's saved analysis";
    return {
      position: index + 1,
      field: column.header,
      filled: values.filter((value) => value.trim()).length,
      blank: values.filter((value) => !value.trim()).length,
      invalid: errors.length,
      required: required.has(column.header),
      examples: [...new Set(values.filter((value) => value.trim()))].slice(
        0,
        3,
      ),
      blankReason,
    };
  });
  const licenseIndex = allColumns.findIndex(
    (column) => column.header === "licenseType",
  );
  const licenseSpellings = [
    ...new Set(rows.map((row) => row[licenseIndex]).filter(Boolean)),
  ];
  const driverSpellings = licenseSpellings.filter((value) =>
    /^drivers?['’]?\s+licen[cs]e$/i.test(value),
  );
  return {
    columns: 74,
    exportedRows: rows.length,
    filterReady: issues.length === 0,
    requiredBlankCells: issues.filter(
      (issue) => required.has(issue.field) && !issue.value.trim(),
    ).length,
    entirelyEmptyColumns: fields.filter((field) => field.blank === rows.length)
      .length,
    fields,
    issues,
    licenseSpellings,
    warnings:
      driverSpellings.length > 1
        ? [
            `Driver's license uses multiple labels: ${driverSpellings.join("; ")}`,
          ]
        : [],
    note: "This audit uses the partner's supplied requirements. CSV booleans are checked case-insensitively. Blank optional/conditional fields are reported separately. It does not certify legal completeness or invent missing facts.",
  };
}

export async function writePartnerBundle(options: {
  output: string;
  data: PartnerData;
  mode: string;
  run?: YpWorkflowRun;
  records: Record<string, unknown>[];
  costs?: Awaited<ReturnType<typeof saveIdahoCosts>>;
  executionPassed: boolean;
  error?: unknown;
}) {
  const { output, data, run, records, costs } = options;
  const directory = path.join(output, "for-partners");
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const copy = async (filename: string, name = filename) => {
    try {
      await copyFile(path.join(output, filename), path.join(directory, name));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  };
  await copy("input/idaho-first-10.csv", "idaho-first-10-input.csv");
  await copy("input/selection.json", "input-selection.json");
  for (const filename of [
    "idaho-trial-results.xlsx",
    "idaho-trial-results.csv",
    "skills-first-memory.json",
    "last-run-results.json",
    "agent-costs.csv",
    "value-verification.json",
    "research-verification.json",
    "partial-recovery.json",
    "export-delivery.json",
  ])
    await copy(filename);
  const productionFiles = await readdir(
    path.join(output, "production-exports"),
  ).catch(() => [] as string[]);
  if (productionFiles.length)
    await mkdir(path.join(directory, "production-exports"), {
      recursive: true,
    });
  for (const filename of productionFiles) {
    assert.match(filename, /^skills-first(?:-\d{4})?\.(json|csv|xlsx|md)$/);
    await copy(`production-exports/${filename}`);
  }
  const screenshots = (await readdir(output)).filter((name) =>
    /^\d.*\.png$/.test(name),
  );
  if (screenshots.length)
    await mkdir(path.join(directory, "screenshots"), { recursive: true });
  for (const name of screenshots) await copy(name, `screenshots/${name}`);
  const csv = await readFile(
    path.join(directory, "idaho-trial-results.csv"),
  ).catch(() => undefined);
  const audit = csv ? auditPartnerCsv(csv) : null;
  const delivery = JSON.parse(
    await readFile(path.join(output, "export-delivery.json"), "utf8").catch(
      () => "null",
    ),
  ) as {
    consolidated?: boolean;
    recovered?: { stage: string; method: string };
    note?: string;
  } | null;
  const coverage = run ? partnerStageCoverage(run, records) : [];
  const quality = idahoQuality(records);
  const summary = {
    mode: options.mode,
    simulated: options.mode === "offline",
    runId: run?.id ?? null,
    executionPassed: options.executionPassed,
    filterReady: audit?.filterReady ?? false,
    selectedSourceRecords: 10,
    resultRecords: records.length,
    exportedRows: audit?.exportedRows ?? 0,
    allAgentsCompleted:
      coverage.length > 0 &&
      coverage.every((stage) => stage.status === "completed"),
    bulkRun: false,
    referenceDatasetProvided: false,
    exportDelivery: delivery,
    quality,
    stages: coverage,
    costs: costs
      ? {
          agents: costs.agents,
          analysisTasks: costs.analysisTasks,
          totals: costs.totals,
          firecrawl: costs.firecrawl,
          codexEstimatedMicros: costs.totalCodexEstimatedMicros,
          combinedSettledAndEstimatedMicros:
            costs.combinedSettledAndEstimatedMicros,
          note: costs.note,
        }
      : null,
    ...(options.error
      ? { error: redactManualText(String(options.error)) }
      : {}),
  };
  const save = (filename: string, value: unknown) =>
    writeFile(
      path.join(directory, filename),
      redactManualText(JSON.stringify(value, null, 2)),
      { mode: 0o600 },
    );
  await save("summary.json", summary);
  await save("stage-coverage.json", coverage);
  await save("field-completeness.json", audit);
  if (audit)
    await writeFile(
      path.join(directory, "field-completeness.csv"),
      csvTable([
        [
          "Column",
          "Field",
          "Filled rows",
          "Blank rows",
          "Invalid cells",
          "Required",
          "Why it may be blank",
        ],
        ...audit.fields.map((field) => [
          field.position,
          field.field,
          field.filled,
          field.blank,
          field.invalid,
          field.required,
          field.blankReason,
        ]),
      ]),
    );
  if (audit)
    await writeFile(
      path.join(directory, "contract-issues.csv"),
      csvTable([
        [
          "Export row (including description and header)",
          "Field",
          "Value",
          "Issue",
        ],
        ...audit.issues.map((issue) => [
          issue.exportRow,
          issue.field,
          issue.value,
          issue.issue,
        ]),
      ]),
    );
  const usd = (micros: number | null | undefined) =>
    micros == null ? "unavailable" : `$${(micros / 1e6).toFixed(6)}`;
  const exportDescription = !csv
    ? "No workbook or CSV was produced before the run stopped."
    : delivery?.recovered
      ? `${delivery.note} The partial workbook and CSV use`
      : delivery?.consolidated
        ? "idaho-trial-results.xlsx and .csv consolidate all production parts using the production formatter. Unchanged browser-downloaded originals are in production-exports/; see export-delivery.json. The consolidated files have"
        : "idaho-trial-results.xlsx and .csv are the exact production artifacts downloaded in the browser, with";
  const readme = `Idaho Skills First — first ten records\n\n${options.mode === "offline" ? "OFFLINE REHEARSAL: MODEL RESULTS AND COSTS ARE SIMULATED.\n\n" : "Live model and Firecrawl run.\n\n"}Execution: ${options.executionPassed ? "passed" : "incomplete / failed"}. Partner filter compatibility: ${audit?.filterReady ? "passed the supplied checks" : "NEEDS REVIEW — see contract-issues.csv"}.\n\nInput: exactly the first ten CSV data records, preserving original order and repeated class codes. These contain ${new Set(data.rows.map((row: IdahoRow) => row["Class Code"])).size} distinct class codes; repeated codes are distinct source rows, not duplicates to discard. Levels may create additional output records. Research/license joins may create additional spreadsheet rows.\n\nScope: adaptation, normalization, level splitting/verification, all seven analysis tasks, license research, education/statute research, rewriting with independent review, dataset comparison, license/education comparison, and export. stage-coverage.json records what actually completed and each job's missing evidence. Running a stage does not establish a legal conclusion.\n\nThe original Idaho CSV has only Class Code, Class Title, Pay Schedule, Pay Grade, FLSA Code, Summary, Duties and Responsibilities, and Qualifications. It does not supply work week, bargaining unit, department, source URL, CSC revisions, occupational categories or manual notes. Pay grade is not a dollar salary range. No WVU/manual reference dataset was supplied: comparison stages may report missing evidence. Unknown booleans have NOT been replaced with FALSE, and unresolved consistency checks have NOT been relabelled n/a. Those are filter-contract issues requiring resolution before import.\n\nOutputs: ${exportDescription}${csv ? " 74 master columns and two header rows (descriptions, then field names)." : ""} JSON retains original texts, findings, reviews, citations and research gaps. field-completeness.csv covers all 74 columns; contract-issues.csv lists disallowed values and blank required booleans. The workbook includes Documents, legal research and review/provenance sheets. Screenshots record the UI states reached during this run.\n\nCosts: settled processing ${usd(costs?.totals.settledMicros)}; unresolved reservations ${usd(costs?.totals.reservedMicros)}; Codex estimated ${usd(costs?.totalCodexEstimatedMicros)}. Firecrawl credits ${costs?.firecrawl.credits ?? "unavailable"}; their allocated plan cost is included in processing, not an additional charge. Agent breakdown: agent-costs.csv. Hard processing cap $5; no bulk run or automatic paid retry.\n\n${options.error ? `Run issue: ${redactManualText(String(options.error))}\n\n` : ""}Share this for-partners folder. Private harness diagnostics and the resumable run archive are kept in its parent directory. SHA256SUMS.json lists every included artifact.\n`;
  await writeFile(path.join(directory, "README.txt"), readme, { mode: 0o600 });
  const checksums: Record<string, string> = {};
  for (const name of (await readdir(directory)).sort()) {
    if (name === "screenshots" || name === "production-exports") {
      for (const shot of (await readdir(path.join(directory, name))).sort())
        checksums[`${name}/${shot}`] = sha256(
          await readFile(path.join(directory, name, shot)),
        );
    } else if (name !== "SHA256SUMS.json")
      checksums[name] = sha256(await readFile(path.join(directory, name)));
  }
  await save("SHA256SUMS.json", checksums);
  return {
    directory,
    filterReady: audit?.filterReady ?? false,
    issues: audit?.issues.length ?? null,
  };
}
