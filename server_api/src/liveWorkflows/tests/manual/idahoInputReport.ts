import { idahoHeaders, sha256, type IdahoRow } from "./idahoData.js";
import type { PartnerData } from "./idahoPartner.js";

export function profileIdahoInput(rows: IdahoRow[]) {
  return {
    records: rows.length,
    uniqueClassCodes: new Set(rows.map((row) => row["Class Code"])).size,
    fields: idahoHeaders.map((field) => ({
      field,
      present: rows.filter((row) => row[field].trim()).length,
      missing: rows.filter((row) => !row[field].trim()).length,
    })),
  };
}
const object = (value: unknown): Record<string, any> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, any>)
    : {};
const cell = (value: unknown) =>
  String(value ?? "")
    .replaceAll("|", "\\|")
    .replace(/[\r\n]+/g, " ")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("[", "\\[")
    .replaceAll("]", "\\]");

/** Deterministic source audit: no model calls and no new external research. */
export function idahoInputReport(options: {
  data: PartnerData;
  mode: string;
  run?: YpWorkflowRun;
  records: Record<string, unknown>[];
  filterReady: boolean;
}) {
  const { data, run, records } = options;
  const groups = new Map<string, IdahoRow[]>();
  for (const row of data.rows) {
    const key = sha256(row.Qualifications);
    groups.set(key, [...(groups.get(key) ?? []), row]);
  }
  const recordErrors = records.filter(
    (row) => Array.isArray(row.errors) && row.errors.length,
  );
  const failedChecks = (row: Record<string, unknown>) =>
    Object.entries(
      object(
        object(object(object(row.analysis).consistency).findings)
          .validationChecks,
      ),
    )
      .filter(([, value]) => value === "fail")
      .map(([key]) => key);
  const research = records
    .flatMap((row) => Object.values(object(object(row.analysis).research)))
    .map(object);
  const stages =
    run?.nodeIds.filter((id) => run.nodeStates[id]?.status === "completed")
      .length ?? 0;
  return [
    "# Idaho input data and processing assessment",
    "",
    options.mode === "offline"
      ? "**Offline rehearsal: model results and costs are simulated.**"
      : "This report accompanies the live first-ten-record test.",
    "",
    "## Scope and provenance",
    "",
    "- Source data records: " +
      data.profile.records +
      "; distinct class codes: " +
      data.profile.uniqueClassCodes +
      ".",
    "- Selected records: the first " +
      data.rows.length +
      " data rows, in original order, with repeated class codes preserved.",
    "- Source file SHA-256: " + data.selection.sourceSha256 + ".",
    "- Selected CSV SHA-256: " + data.selection.fixtureSha256 + ".",
    "- Run ID: " + (run?.id ?? "No processing run started") + ".",
    "- This source audit is computed directly from the CSV. It does not infer legal requirements from missing text.",
    "- Ten consecutive records are a functional test, not a representative sample of all Idaho occupations.",
    "",
    "## Completeness of the supplied CSV",
    "",
    "The source contains the following eight columns. A populated cell establishes that text was supplied, not that the specification is current or complete.",
    "",
    "| Source field | Populated records | Blank records |",
    "|---|---:|---:|",
    ...data.profile.fields.map(
      (field) =>
        "| " +
        cell(field.field) +
        " | " +
        field.present +
        " | " +
        field.missing +
        " |",
    ),
    "",
    "Original fields, including Pay Schedule, Pay Grade and FLSA Code, are preserved in input metadata and the exported original documents. A pay grade is not a salary range; a dated pay table would be needed to derive salary amounts.",
    "",
    "## Ambiguity in the first ten records",
    "",
    "The selected records contain " +
      new Set(data.rows.map((row) => row["Class Code"])).size +
      " distinct class codes and " +
      groups.size +
      " distinct qualifications texts.",
    "",
    "| Class code(s) | Rows sharing identical qualifications | Titles |",
    "|---|---:|---|",
    ...[...groups.values()].map(
      (rows) =>
        "| " +
        cell([...new Set(rows.map((row) => row["Class Code"]))].join(", ")) +
        " | " +
        rows.length +
        " | " +
        cell(rows.map((row) => row["Class Title"]).join("; ")) +
        " |",
    ),
    "",
    "Repeated qualifications do not identify the specialty selected for each position. Numeric title suffixes are retained as supplied; their meaning is not assumed to be an agency, department, vacancy or specialty code.",
    "Where the text lists qualifications for some positions or selected specialties, those conditions must be preserved. A license mentioned for one specialty cannot automatically be applied to every vacancy in that class.",
    "",
    "## Additional inputs that would improve processing",
    "",
    "| Priority | Input | Benefit |",
    "|---|---|---|",
    "| High | Official classification or vacancy URL; revision/effective date; source owner | Anchors research to the correct version and helps distinguish current specifications from historical postings. |",
    "| High | Agency/department, meaning of title suffixes, and the selected specialty for each position | Resolves the applicability of conditional qualifications and improves job matching. |",
    "| High | Complete qualification text, including referenced attachments and specialty addenda | Resolves requirements that may live outside the supplied CSV description. |",
    "| High for reference comparisons | WVU/license reference workbook and the manual education-review dataset, with versions and a reliable match key | Enables the specific WVU/manual comparison fields. No such dataset was supplied for this test. |",
    "| Helpful for web research | Known official personnel, regulator and licensing-source links | Provides authoritative starting points. Firecrawl can discover sources, but a discovered page still needs applicability and currency checks. |",
    "| Optional for metadata completeness | Work week, work month, bargaining unit, class of service, department code, salary range/pay table, CSC revision status, occupational categories and notes | Fills business metadata columns when those fields are applicable. They must not be invented to fill the spreadsheet. |",
    "",
    "## Description findings and external verification",
    "",
    "The document-only assessment reports what the uploaded description states: required, preferred, alternative, conditional, explicitly not required, not stated, or unclear. It appears in Results and the workbook's Documents sheet and is retained in JSON.",
    "A 'not stated' finding does not establish that an external degree or licensing rule is absent. The existing required yes/no fields remain unresolved where the evidence does not support a decision. The partner filter contract must distinguish these meanings before importing records with unresolved decisions.",
    "Consistency checks assess extraction fidelity. An accurately preserved unknown can be consistent with the source; that does not certify legal completeness. New checks use pass/fail/n/a, with explanations. Legacy unknown check values remain auditable rather than being silently converted.",
    "",
    "| Job | Education statement in description | License statement in description | Failed consistency checks | Processing errors |",
    "|---|---|---|---|---|",
    ...records.map((row) => {
      const assessment = object(object(row.analysis).documentRequirements);
      return (
        "| " +
        cell(row.name) +
        " | " +
        cell(object(assessment.degree).statement ?? "Not assessed") +
        " | " +
        cell(object(assessment.license).statement ?? "Not assessed") +
        " | " +
        cell(failedChecks(row).join(", ") || "None") +
        " | " +
        cell(
          Array.isArray(row.errors) && row.errors.length
            ? row.errors.join("; ")
            : "None",
        ) +
        " |"
      );
    }),
    "",
    "## Outcome and remaining gaps",
    "",
    "- Completed pipeline stages: " +
      stages +
      "/" +
      (run?.nodeIds.length ?? 0) +
      ".",
    "- Result records: " +
      records.length +
      "; records with processing errors: " +
      recordErrors.length +
      ".",
    "- Records with failed consistency checks: " +
      records.filter((row) => failedChecks(row).length).length +
      ". These are substantive review findings even when processing completed without an error; consult the saved consistency explanations before using those conclusions.",
    "- Returned research results: " +
      research.length +
      "; marked unresolved: " +
      research.filter((result) => result.status !== "known").length +
      ".",
    "- Partner filter checks: " +
      (options.filterReady
        ? "passed the supplied checks"
        : "needs review; see contract-issues.csv") +
      ".",
    "",
    "Citation-selection errors, malformed model responses and invalid output labels are processing defects, not missing Idaho inputs. Source-passage IDs and evidence IDs bind citations to original bytes; label normalization changes category/display labels only, never source quotations.",
    "Research remains bounded by the run's configured search, source, document, time and spending limits. Missing, truncated, historical or partially applicable evidence must remain visible; completing an agent does not prove a definitive legal conclusion.",
    "Missing source metadata, conditional fields, unavailable reference data, unresolved research and processing errors are different causes of blanks. The field audit distinguishes them. Spreadsheet joins can produce more rows than source jobs, so cell counts in that audit are not counts of distinct jobs.",
    "",
    "## Companion files",
    "",
    "- [Column completeness](field-completeness.csv) and [filter issues](contract-issues.csv).",
    "- [Research evidence and gaps](research-verification.json).",
    "- [Stage coverage](stage-coverage.json), [value verification](value-verification.json), and [per-agent costs](agent-costs.csv).",
    "- [Workbook](idaho-trial-results.xlsx), [CSV](idaho-trial-results.csv), and [full memory](skills-first-memory.json).",
    "",
  ].join("\n");
}
