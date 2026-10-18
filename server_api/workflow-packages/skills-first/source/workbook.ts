import columns from "../schemas/exportColumns.json" with { type: "json" };
import { record } from "./memory.js";
import type { Job } from "./sdk.js";
import type {
  SkillsFirstJobDescription,
  SkillsFirstLicenseComparison,
  SkillsFirstLegalResearch,
  SkillsFirstMemory,
} from "./memoryTypes.js";

export type Cell = string | number | boolean | null;
export interface Worksheet {
  name: string;
  rows: Cell[][];
  headerRows: number;
  widths: number[];
}
/** Rendered by the host's bounded Excel exporter; the VM needs no spreadsheet dependency. */
export const workbookContentType = "application/vnd.yrpri.workbook+json";
export interface Workbook {
  version: 1;
  sheets: Worksheet[];
}
const separator = "\r\n|\r\n";
export const masterHeaders = [
  ...columns.core,
  ...columns.license,
  ...columns.legal,
].map((column) => column.header);
const descriptions = [
  ...columns.core.map((column) => column.description),
  ...columns.license.map(
    (column) =>
      `License comparison: ${column.header.trim()}. Reference/manual values require supplied data.`,
  ),
  ...columns.legal.map(
    (column) =>
      `Legal research: ${column.header}. Requires retrieved source evidence.`,
  ),
];

function at(value: unknown, path: string[]): unknown {
  if (!path.length) return value;
  if (Array.isArray(value)) return value.map((item) => at(item, path));
  return at(record(value)[path[0]], path.slice(1));
}
export function cell(value: unknown): Cell {
  if (value === null || value === undefined) return null;
  if (typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (Array.isArray(value))
    return value.map((item) => cell(item) ?? "").join(separator);
  return JSON.stringify(value);
}
function coreRow(
  memory: SkillsFirstMemory,
  job: SkillsFirstJobDescription,
): Cell[] {
  return columns.core.map((column) => {
    if (column.header === "agentId")
      return cell(memory.agentId ?? record(job).agentId);
    if (column.header === "educationRequirements")
      return (
        job.degreeAnalysis.educationRequirements
          ?.map(
            (requirement) =>
              `${requirement.type}: ${requirement.evidenceQuote}`,
          )
          .join(separator) ?? null
      );
    return cell(at(job, column.path.split(".")));
  });
}
function licenseRow(comparison?: SkillsFirstLicenseComparison): Cell[] {
  return columns.license.map((column) => cell(record(comparison)[column.path]));
}
function legalRow(research?: SkillsFirstLegalResearch): Cell[] {
  return columns.legal.map((column) => {
    if (column.path === "reasoning" && research?.status === "unknown")
      return `Needs review: ${research.reasoning ?? "Research is incomplete or unverified."}`;
    return cell(record(research)[column.path]);
  });
}

/** One-to-many joins are intentional. Distinct records are never merged by business code. */
export function masterRows(memory: SkillsFirstMemory): Cell[][] {
  return memory.jobDescriptions.flatMap((job) => {
    const licenses = job.licenseComparisons.length
      ? job.licenseComparisons
      : [undefined];
    const research = job.degreeAnalysis.deepResearchResults.length
      ? job.degreeAnalysis.deepResearchResults
      : [undefined];
    return licenses.flatMap((license) =>
      research.map((result) => [
        ...coreRow(memory, job),
        ...licenseRow(license),
        ...legalRow(result),
      ]),
    );
  });
}
export function workbook(
  memory: SkillsFirstMemory<Job & SkillsFirstJobDescription>,
): Workbook {
  const acceptedRewrites = new Set(
    memory.rewrittenJobDescriptions.map((job) => job.id),
  );
  const coreAndLicenseHeaders = masterHeaders.slice(0, 64);
  const licenseHeaders = columns.license.map((column) =>
    column.header === "Matchin WVU Profession"
      ? "Matching WVU Profession"
      : column.header,
  );
  const sheets: Worksheet[] = [
    {
      name: "merged (master + legal)",
      headerRows: 2,
      rows: [descriptions, masterHeaders, ...masterRows(memory)],
      widths: masterHeaders.map((header) =>
        /Explanation|Requirements|Description|barriers|Reasoning|difficultPassages/.test(
          header,
        )
          ? 58
          : 26,
      ),
    },
    {
      name: "Master sheet old",
      headerRows: 2,
      rows: [
        descriptions.slice(0, 64),
        coreAndLicenseHeaders,
        ...memory.jobDescriptions.flatMap((job) =>
          (job.licenseComparisons.length
            ? job.licenseComparisons
            : [undefined]
          ).map((license) => [...coreRow(memory, job), ...licenseRow(license)]),
        ),
      ],
      widths: coreAndLicenseHeaders.map(() => 28),
    },
    {
      name: "license info",
      headerRows: 1,
      rows: [licenseHeaders, ...memory.licenseComparisons.map(licenseRow)],
      widths: licenseHeaders.map(() => 40),
    },
    {
      name: "legal research",
      headerRows: 1,
      rows: [
        ["Title Code", ...columns.legal.map((column) => column.header)],
        ...memory.educationRequirementResearchResults.map((result) => [
          result.titleCode,
          ...legalRow(result),
        ]),
      ],
      widths: [20, 40, 60, 30, 30, 25, 30, 30, 60, 60, 20],
    },
    {
      name: "Review and provenance",
      headerRows: 1,
      rows: [
        [
          "Record ID",
          "Title Code",
          "Job title",
          "Status",
          "Errors",
          "Source",
          "Jurisdiction",
          "Parent ID",
          "Analysis and review details",
        ],
        ...memory.jobDescriptions.map((job) => [
          job.id,
          job.titleCode,
          job.name,
          job.status,
          job.errors.join("; ") || job.error,
          job.source,
          job.jurisdiction,
          job.parentId ?? null,
          JSON.stringify(job.analysis, null, 2),
        ]),
      ],
      widths: [42, 20, 40, 18, 60, 42, 22, 42, 80],
    },
    {
      name: "Documents",
      headerRows: 1,
      rows: [
        [
          "Record ID",
          "Job title",
          "Original document",
          "Level text",
          "Accepted rewrite",
          "Degree preference quote",
          "Reading level explanation",
          "Reading level matches degree requirement",
          "Degree statement in supplied description",
          "Degree statement explanation",
          "License statement in supplied description",
          "License statement explanation",
          "Assessment scope",
        ],
        ...memory.jobDescriptions.map((job) => [
          job.id,
          job.name,
          job.originalText ?? job.text,
          job.text,
          acceptedRewrites.has(job.id) ? (job.rewrittenText ?? null) : null,
          job.degreeAnalysis.degreePreferenceQuote,
          job.readingLevelGradeAnalysis.readabilityLevelExplanation,
          job.readingLevelGradeAnalysis.readingLevelMatchesDegreeRequirement,
          (record(record(job.analysis.documentRequirements).degree)
            .statement as Cell) ?? null,
          (record(record(job.analysis.documentRequirements).degree)
            .explanation as Cell) ?? null,
          (record(record(job.analysis.documentRequirements).license)
            .statement as Cell) ?? null,
          (record(record(job.analysis.documentRequirements).license)
            .explanation as Cell) ?? null,
          job.analysis.documentRequirements
            ? "Supplied description only. Not stated does not establish that no external requirement applies."
            : null,
        ]),
      ],
      widths: [42, 40, 100, 100, 100, 60, 60, 30, 32, 70, 32, 70, 70],
    },
  ];
  return { version: 1, sheets };
}
export function masterTable(memory: SkillsFirstMemory): Cell[][] {
  return [descriptions, masterHeaders, ...masterRows(memory)];
}
