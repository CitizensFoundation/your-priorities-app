import columns from "../schemas/exportColumns.json" with { type: "json" };
import { record, RecordError } from "./sdk.js";
import { licenseLabel } from "./labels.js";
import type {
  SkillsFirstJobDescription,
  SkillsFirstLicenseComparison,
} from "./memoryTypes.js";

const booleanFields = new Set([
  "researchMatchesWvu",
  "researchMatchesManual",
  "requiresManualReview",
]);
function referenceFlag(value: unknown): boolean | "N/A" | null {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return normalized === "true"
    ? true
    : normalized === "false"
      ? false
      : normalized === "n/a"
        ? "N/A"
        : null;
}
/** Accept normalized memory fields or the reference workbook's literal license headers. */
export function licenseComparison(
  value: unknown,
): SkillsFirstLicenseComparison {
  const row = record(value);
  return Object.fromEntries(
    columns.license.map((column) => {
      const value =
        row[column.path] ??
        row[column.header] ??
        (column.path === "matchingWvuProfession"
          ? row["Matching WVU Profession"]
          : null);
      return [
        column.path,
        booleanFields.has(column.path)
          ? referenceFlag(value)
          : typeof value === "string"
            ? column.path === "licenseType"
              ? licenseLabel(value)
              : value
            : null,
      ];
    }),
  ) as unknown as SkillsFirstLicenseComparison;
}
export function matchedLicenseReferences(
  job: SkillsFirstJobDescription,
  value: unknown,
): SkillsFirstLicenseComparison[] {
  if (!Array.isArray(value)) return [];
  const type = job.degreeAnalysis.professionalLicenseRequirement.licenseType
    ?.trim()
    .toLowerCase();
  return value
    .map(licenseComparison)
    .filter(
      (reference) =>
        type && reference.licenseType?.trim().toLowerCase() === type,
    );
}
/** The model may add research comparisons, never overwrite supplied manual/reference columns. */
export function reviewedLicenseComparisons(
  job: SkillsFirstJobDescription,
  references: SkillsFirstLicenseComparison[],
  value: unknown,
): SkillsFirstLicenseComparison[] {
  if (!Array.isArray(value) || value.length !== references.length)
    throw new RecordError("Expected one comparison per license reference");
  const seen = new Set<number>();
  return value.map((item) => {
    const comparison = record(item),
      index = comparison.referenceIndex;
    if (
      typeof index !== "number" ||
      !Number.isInteger(index) ||
      !references[index] ||
      seen.has(index)
    )
      throw new RecordError("Invalid or duplicate license reference index");
    seen.add(index);
    const reference = references[index];
    for (const key of [
      "researchEducationRequirement",
      "researchComparisonExplanation",
      "recommendedAction",
      "sourceUrl",
      "evidenceQuote",
    ])
      if (comparison[key] !== null && typeof comparison[key] !== "string")
        throw new RecordError(`Invalid license comparison ${key}`);
    for (const key of booleanFields)
      if (comparison[key] !== null && typeof comparison[key] !== "boolean")
        throw new RecordError(`Invalid license comparison ${key}`);
    const evidence = job.degreeAnalysis.deepResearchResults.filter(
      (row) =>
        row.sourceUrl === comparison.sourceUrl &&
        row.evidenceQuote === comparison.evidenceQuote,
    );
    if (
      (comparison.researchEducationRequirement ||
        comparison.sourceUrl ||
        comparison.evidenceQuote) &&
      !evidence.length
    )
      throw new RecordError(
        "License comparison is not supported by researched evidence",
      );
    const known =
      evidence.length > 0 && evidence.every((row) => row.status === "known");
    if (
      (!reference.wvuEducationRequirement &&
        comparison.researchMatchesWvu !== null) ||
      (!reference.manualMinimumEducationRequirement &&
        comparison.researchMatchesManual !== null)
    )
      throw new RecordError(
        "License comparison claims a match without reference data",
      );
    return {
      ...reference,
      researchEducationRequirement: comparison.researchEducationRequirement as
        | string
        | null,
      researchComparisonExplanation:
        comparison.researchComparisonExplanation as string | null,
      researchMatchesWvu: known
        ? (comparison.researchMatchesWvu as boolean | null)
        : null,
      researchMatchesManual: known
        ? (comparison.researchMatchesManual as boolean | null)
        : null,
      requiresManualReview:
        known &&
        comparison.researchEducationRequirement &&
        (reference.wvuEducationRequirement ||
          reference.manualMinimumEducationRequirement)
          ? (comparison.requiresManualReview as boolean | null)
          : true,
      recommendedAction: comparison.recommendedAction as string | null,
      sourceUrl: comparison.sourceUrl as string | null,
    };
  });
}
