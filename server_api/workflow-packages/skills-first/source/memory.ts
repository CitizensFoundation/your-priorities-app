import { RecordError, record, type Job } from "./sdk.js";
import { licenseComparison } from "./licenseComparisons.js";
export { record } from "./sdk.js";
import { EducationType } from "./educationTypes.js";
import { readingLevels } from "./readingLevels.js";
import { licenseLabel, readingLevelLabel } from "./labels.js";
import type {
  SkillsFirstJobDescription,
  SkillsFirstMemory,
  SkillsFirstLegalResearch,
} from "./memoryTypes.js";

export const consistencyKeys = [
  "cscRevisedConsistency",
  "requiredAlternativeExplanationConsistency",
  "barriersToNonDegreeApplicantsConsistency",
  "licenseIncludesDegreeRequirementConsistency",
  "alternativesIfTrueConsistency",
  "degreeMandatoryConsistency",
  "alternativeQualificationsConsistency",
  "educationRequirementsConsistency",
  "needsCollegeDegreeConsistency",
] as const;
export const degreeStatusKeys = [
  "isDegreeMandatory",
  "hasAlternativeQualifications",
  "multipleQualificationPaths",
  "isDegreeAbsolutelyRequired",
  "substitutionPossible",
] as const;
export const explanationKeys = [
  "degreeRequirementExplanation",
  "bothTrueExplanation",
  "bothFalseExplanation",
] as const;
export const businessFields = [
  "titleCode",
  "variant",
  "classOfService",
  "workWeek",
  "bargainUnit",
  "classCode",
  "salaryRange",
  "workMonth",
  "deptCode",
  "url",
  "notes",
] as const;
function text(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}
function boolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}
function strings(value: unknown): string[] | null {
  return Array.isArray(value) && value.every((v) => typeof v === "string")
    ? value
    : null;
}
function number(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function legalResearch(value: unknown): SkillsFirstLegalResearch {
  const row = record(value);
  return {
    ...row,
    titleCode: text(row.titleCode),
    jobTitle: text(row.jobTitle) ?? "",
    statedDegreeRequirement: text(row.statedDegreeRequirement),
    degreeRequirementType: text(row.degreeRequirementType),
    typeOfOfficialDocument: text(row.typeOfOfficialDocument),
    matchTypeForJobTitle:
      row.matchTypeForJobTitle === "exact" ||
      row.matchTypeForJobTitle === "partial"
        ? row.matchTypeForJobTitle
        : null,
    typeOfDegreeRequirement: text(row.typeOfDegreeRequirement),
    mandatoryDegreeRequirementStatus: text(
      row.mandatoryDegreeRequirementStatus,
    ),
    reasoning: text(row.reasoning),
    sourceUrl: text(row.sourceUrl) ?? "",
    evidenceQuote: text(row.evidenceQuote) ?? "",
    status: row.status === "known" ? "known" : "unknown",
  };
}
export function emptyDegreeAnalysis(): SkillsFirstJobDescription["degreeAnalysis"] {
  return {
    needsCollegeDegree: null,
    maximumDegreeRequirement: null,
    includesMultipleJobLevelsWithDifferentEducationalRequirements: null,
    educationRequirements: null,
    degreePreferenceQuote: null,
    degreeRequirementStatus: {
      isDegreeMandatory: null,
      hasAlternativeQualifications: null,
      alternativeQualifications: null,
      multipleQualificationPaths: null,
      isDegreeAbsolutelyRequired: null,
      substitutionPossible: null,
    },
    mandatoryStatusExplanations: {
      degreeRequirementExplanation: null,
      bothTrueExplanation: null,
      bothFalseExplanation: null,
    },
    professionalLicenseRequirement: {
      isLicenseRequired: null,
      licenseType: null,
      licenseDescription: null,
      issuingAuthority: null,
      includesDegreeRequirement: null,
    },
    barriersToNonDegreeApplicants: null,
    validationChecks: Object.fromEntries(
      consistencyKeys.map((key) => [key, null]),
    ) as unknown as SkillsFirstJobDescription["degreeAnalysis"]["validationChecks"],
    deepResearchResults: [],
  };
}
/** Projection is also used for old saved runs. Missing legacy fields remain unknown. */
export function canonicalJob(input: Job): Job & SkillsFirstJobDescription {
  const job = structuredClone(input) as Job & SkillsFirstJobDescription;
  const raw = record(input),
    metadata = record(raw.metadata);
  for (const key of businessFields)
    job[key] =
      text(raw[key]) ??
      (typeof raw[key] === "number" && Number.isFinite(raw[key])
        ? String(raw[key])
        : null);
  // Idaho's source code is a business reference, never the runner's row identity.
  job.titleCode ??= text(metadata["Class Code"]) ?? text(raw["Class Code"]);
  job.classCode ??= text(metadata["Class Code"]) ?? text(raw["Class Code"]);
  job.classification =
    strings(raw.classification) ??
    (typeof raw.classification === "string" ? [raw.classification] : null);
  job.error = input.errors.length ? input.errors.join("; ") : text(raw.error);
  job.multiLevelJob = boolean(raw.multiLevelJob) ?? (input.level ? true : null);
  job.cscRevised = boolean(raw.cscRevised);
  const categories = Array.isArray(raw.occupationalCategory)
    ? raw.occupationalCategory
    : raw.occupationalCategory && typeof raw.occupationalCategory === "object"
      ? [raw.occupationalCategory]
      : null;
  job.occupationalCategory = categories
    ? categories.flatMap((value) => {
        const item = record(value);
        return typeof item.mainCategory === "string" &&
          typeof item.subCategory === "string"
          ? [{ mainCategory: item.mainCategory, subCategory: item.subCategory }]
          : [];
      })
    : null;
  job.degreeAnalysis = { ...job.degreeAnalysis, ...emptyDegreeAnalysis() };
  job.readingLevelGradeAnalysis = {
    ...job.readingLevelGradeAnalysis,
    readabilityLevelExplanation: null,
    readabilityLevel: null,
    difficultPassages: null,
    readingLevelMatchesDegreeRequirement: null,
  };
  job.readabilityAnalysisTextTSNPM = {
    ...job.readabilityAnalysisTextTSNPM,
    fleschKincaidGrade: null,
  };
  job.validationScore = null;
  job.licenseComparisons = Array.isArray(input.licenseComparisons)
    ? input.licenseComparisons.map(licenseComparison)
    : [];
  // Import the original nested memory shape before applying newer task results.
  const degree = record(raw.degreeAnalysis);
  projectFindings(job, "degrees", degree);
  // Preserve a supplied legacy classification until a newer degrees task replaces it.
  job.classification =
    strings(raw.classification) ??
    (typeof raw.classification === "string"
      ? [raw.classification]
      : job.classification);
  projectFindings(job, "mandatory", {
    ...record(degree.degreeRequirementStatus),
    mandatoryStatusExplanations: degree.mandatoryStatusExplanations,
    degreePreferenceQuote: degree.degreePreferenceQuote,
  });
  projectFindings(
    job,
    "licenses",
    record(degree.professionalLicenseRequirement),
  );
  projectFindings(job, "barriers", {
    barriersToNonDegreeApplicants: degree.barriersToNonDegreeApplicants,
  });
  projectFindings(job, "consistency", {
    validationChecks: degree.validationChecks,
  });
  projectFindings(job, "readingLevel", record(raw.readingLevelGradeAnalysis));
  job.degreeAnalysis.deepResearchResults = Array.isArray(
    input.degreeAnalysis?.deepResearchResults,
  )
    ? input.degreeAnalysis.deepResearchResults.map(legalResearch)
    : [];
  job.readabilityAnalysisTextTSNPM.fleschKincaidGrade = number(
    record(raw.readabilityAnalysisTextTSNPM).fleschKincaidGrade,
  );
  for (const task of [
    "degrees",
    "mandatory",
    "licenses",
    "barriers",
    "consistency",
    "readingLevel",
  ])
    if (record(input.analysis[task]).findings) {
      const findings = record(record(input.analysis[task]).findings);
      // Old task envelopes may omit newly restored fields. Absence must not erase
      // supplied nested memory; explicit null in a new response still means unknown.
      const current =
        task === "degrees"
          ? record(job.degreeAnalysis)
          : task === "mandatory"
            ? {
                ...job.degreeAnalysis.degreeRequirementStatus,
                mandatoryStatusExplanations:
                  job.degreeAnalysis.mandatoryStatusExplanations,
                degreePreferenceQuote: job.degreeAnalysis.degreePreferenceQuote,
              }
            : task === "licenses"
              ? record(job.degreeAnalysis.professionalLicenseRequirement)
              : task === "barriers"
                ? {
                    barriersToNonDegreeApplicants:
                      job.degreeAnalysis.barriersToNonDegreeApplicants,
                  }
                : task === "consistency"
                  ? { validationChecks: job.degreeAnalysis.validationChecks }
                  : record(job.readingLevelGradeAnalysis);
      projectFindings(job, task, {
        ...current,
        ...findings,
        ...(task === "mandatory"
          ? {
              mandatoryStatusExplanations: {
                ...job.degreeAnalysis.mandatoryStatusExplanations,
                ...record(findings.mandatoryStatusExplanations),
              },
            }
          : {}),
        ...(task === "consistency"
          ? {
              validationChecks: {
                ...job.degreeAnalysis.validationChecks,
                ...record(findings.validationChecks),
              },
            }
          : {}),
      });
    }
  if (input.analysis.fleschKincaidGrade !== undefined)
    job.readabilityAnalysisTextTSNPM.fleschKincaidGrade = number(
      input.analysis.fleschKincaidGrade,
    );
  return job;
}

export function projectFindings(
  job: Job & SkillsFirstJobDescription,
  task: string,
  f: Record<string, unknown>,
) {
  const degree = job.degreeAnalysis;
  if (task === "degrees") {
    degree.needsCollegeDegree = boolean(f.needsCollegeDegree);
    degree.maximumDegreeRequirement = text(f.maximumDegreeRequirement);
    degree.includesMultipleJobLevelsWithDifferentEducationalRequirements =
      boolean(f.includesMultipleJobLevelsWithDifferentEducationalRequirements);
    degree.educationRequirements = Array.isArray(f.educationRequirements)
      ? f.educationRequirements.flatMap((value) => {
          const requirement = record(value);
          if (
            typeof requirement.type !== "string" ||
            typeof requirement.evidenceQuote !== "string"
          )
            return [];
          const status = requirement.requirementStatus;
          return [
            {
              type: requirement.type,
              evidenceQuote: requirement.evidenceQuote,
              isMandatory:
                boolean(requirement.isMandatory) ??
                (status === "mandatory"
                  ? true
                  : status === "preferred" || status === "alternative"
                    ? false
                    : null),
              ...(["mandatory", "preferred", "alternative", "unknown"].includes(
                String(status),
              )
                ? {
                    requirementStatus: status as
                      | "mandatory"
                      | "preferred"
                      | "alternative"
                      | "unknown",
                  }
                : {}),
            },
          ];
        })
      : null;
    if (degree.educationRequirements !== null)
      job.classification = [
        ...new Set(
          degree.educationRequirements.map((requirement) => requirement.type),
        ),
      ];
  } else if (task === "mandatory") {
    for (const key of degreeStatusKeys)
      degree.degreeRequirementStatus[key] = boolean(f[key]);
    degree.degreeRequirementStatus.alternativeQualifications = strings(
      f.alternativeQualifications,
    );
    const explanations = record(f.mandatoryStatusExplanations);
    for (const key of explanationKeys)
      degree.mandatoryStatusExplanations[key] = text(explanations[key]);
    degree.degreePreferenceQuote = text(f.degreePreferenceQuote);
  } else if (task === "licenses") {
    for (const key of [
      "isLicenseRequired",
      "includesDegreeRequirement",
    ] as const)
      degree.professionalLicenseRequirement[key] = boolean(f[key]);
    for (const key of [
      "licenseType",
      "licenseDescription",
      "issuingAuthority",
    ] as const)
      degree.professionalLicenseRequirement[key] = text(f[key]);
    if (degree.professionalLicenseRequirement.licenseType)
      degree.professionalLicenseRequirement.licenseType = licenseLabel(
        degree.professionalLicenseRequirement.licenseType,
      );
  } else if (task === "barriers") {
    degree.barriersToNonDegreeApplicants = text(
      f.barriersToNonDegreeApplicants,
    );
    if (
      degree.barriersToNonDegreeApplicants === null &&
      Array.isArray(f.barriers)
    ) {
      const descriptions = f.barriers.flatMap((value) => {
        const barrier = record(value);
        return typeof barrier.wording === "string" &&
          typeof barrier.explanation === "string"
          ? [`${barrier.wording}: ${barrier.explanation}`]
          : [];
      });
      if (descriptions.length)
        degree.barriersToNonDegreeApplicants = descriptions.join("\n\n");
    }
  } else if (task === "consistency") {
    const checks = record(f.validationChecks);
    for (const key of consistencyKeys) {
      const value = checks[key];
      degree.validationChecks[key] =
        value === "pass" ||
        value === "fail" ||
        value === "unknown" ||
        value === "n/a"
          ? value
          : null;
    }
    job.validationScore = consistencyKeys.every(
      (key) => degree.validationChecks[key] !== null,
    )
      ? consistencyKeys.filter((key) => degree.validationChecks[key] === "pass")
          .length
      : null;
  } else if (task === "readingLevel") {
    job.readingLevelGradeAnalysis = {
      ...job.readingLevelGradeAnalysis,
      readabilityLevel:
        typeof f.readabilityLevel === "string"
          ? readingLevelLabel(f.readabilityLevel)
          : null,
      readabilityLevelExplanation: text(f.readabilityLevelExplanation),
      difficultPassages: strings(f.difficultPassages),
      readingLevelMatchesDegreeRequirement: boolean(
        f.readingLevelMatchesDegreeRequirement,
      ),
    };
  }
}

/** New model responses must provide stable fields, including explicit nulls for unknowns. */
export function validateFindings(
  task: string,
  f: Record<string, unknown>,
  source: string,
) {
  const require = (
    key: string,
    kind: "boolean" | "string" | "strings",
    object = f,
  ) => {
    if (!Object.hasOwn(object, key))
      throw new RecordError(`Missing ${task} finding: ${key}`);
    const value = object[key];
    if (value === null) return;
    const valid =
      kind === "strings" ? strings(value) !== null : typeof value === kind;
    if (!valid) throw new RecordError(`Invalid ${task} finding: ${key}`);
  };
  if (task === "degrees") {
    require("needsCollegeDegree", "boolean");
    require("maximumDegreeRequirement", "string");
    require("includesMultipleJobLevelsWithDifferentEducationalRequirements", "boolean");
    if (
      f.maximumDegreeRequirement !== null &&
      !Object.values(EducationType).includes(
        f.maximumDegreeRequirement as EducationType,
      )
    )
      throw new RecordError("Unknown education type");
    if (
      f.educationRequirements !== null &&
      !Array.isArray(f.educationRequirements)
    )
      throw new RecordError("Invalid education requirements");
    for (const value of (f.educationRequirements as unknown[] | null) ?? []) {
      const requirement = record(value);
      if (
        !Object.values(EducationType).includes(
          requirement.type as EducationType,
        ) ||
        typeof requirement.evidenceQuote !== "string" ||
        !requirement.evidenceQuote.trim() ||
        !source.includes(requirement.evidenceQuote)
      )
        throw new RecordError(
          "Invalid education requirement or evidence quote",
        );
      require("isMandatory", "boolean", requirement);
      if (
        !["mandatory", "preferred", "alternative", "unknown"].includes(
          String(requirement.requirementStatus),
        )
      )
        throw new RecordError("Missing or invalid requirement status");
      if (
        (requirement.requirementStatus === "mandatory" &&
          requirement.isMandatory !== true) ||
        (["preferred", "alternative"].includes(
          String(requirement.requirementStatus),
        ) &&
          requirement.isMandatory !== false)
      )
        throw new RecordError("Conflicting requirement status");
    }
  } else if (task === "mandatory") {
    for (const key of degreeStatusKeys) require(key, "boolean");
    require("alternativeQualifications", "strings");
    const explanations = record(f.mandatoryStatusExplanations);
    for (const key of explanationKeys) require(key, "string", explanations);
    require("degreePreferenceQuote", "string");
    if (
      f.degreePreferenceQuote &&
      !source.includes(String(f.degreePreferenceQuote))
    )
      throw new RecordError("Unsupported degree preference quote");
  } else if (task === "licenses") {
    for (const key of ["isLicenseRequired", "includesDegreeRequirement"])
      require(key, "boolean");
    for (const key of ["licenseType", "licenseDescription", "issuingAuthority"])
      require(key, "string");
  } else if (task === "barriers")
    require("barriersToNonDegreeApplicants", "string");
  else if (task === "consistency") {
    const checks = record(f.validationChecks);
    for (const key of consistencyKeys)
      if (!["pass", "fail", "unknown", "n/a"].includes(String(checks[key])))
        throw new RecordError(`Missing or invalid consistency check: ${key}`);
  } else if (task === "readingLevel") {
    for (const key of ["readabilityLevel", "readabilityLevelExplanation"])
      require(key, "string");
    require("difficultPassages", "strings");
    require("readingLevelMatchesDegreeRequirement", "boolean");
    if (
      f.readabilityLevel !== null &&
      !(readingLevels as readonly unknown[]).includes(
        typeof f.readabilityLevel === "string"
          ? readingLevelLabel(f.readabilityLevel)
          : f.readabilityLevel,
      )
    )
      throw new RecordError("Unknown reading-level category");
    for (const passage of (f.difficultPassages as string[] | null) ?? [])
      if (!passage.trim() || !source.includes(passage))
        throw new RecordError("Unsupported difficult passage");
  }
}

export function skillsFirstMemory(
  items: Job[],
  agentId: string | number | null = null,
): SkillsFirstMemory<Job & SkillsFirstJobDescription> {
  const jobDescriptions = items.map(canonicalJob);
  const importedIds = [
    ...new Set(
      items
        .map((job) => job.agentId)
        .filter((id) => id !== null && id !== undefined),
    ),
  ];
  return {
    schemaVersion: "skills-first-memory-v1",
    agentId: agentId ?? (importedIds.length === 1 ? importedIds[0]! : null),
    jobDescriptions,
    rewrittenJobDescriptions: jobDescriptions.filter(
      (job) =>
        job.rewrittenText &&
        !job.errors.length &&
        record(job.analysis.rewriteValidation).allChecksPassed === true,
    ),
    llmErrors: jobDescriptions.flatMap((job) =>
      job.errors.map((error) => `${job.id}: ${error}`),
    ),
    educationRequirementResearchResults: jobDescriptions.flatMap(
      (job) => job.degreeAnalysis.deepResearchResults,
    ),
    licenseComparisons: jobDescriptions.flatMap(
      (job) => job.licenseComparisons,
    ),
  };
}
