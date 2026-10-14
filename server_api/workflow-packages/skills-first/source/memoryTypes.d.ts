/** Skills First memory contract. Original field names are retained; absent evidence is null. */
export type SkillsFirstCheck = "pass" | "fail" | "unknown" | "n/a";
export interface SkillsFirstEducationRequirement {
  type: string;
  evidenceQuote: string;
  isMandatory: boolean | null;
  requirementStatus?: "mandatory" | "preferred" | "alternative" | "unknown";
}
export interface SkillsFirstDegreeStatus {
  isDegreeMandatory: boolean | null;
  hasAlternativeQualifications: boolean | null;
  alternativeQualifications: string[] | null;
  multipleQualificationPaths: boolean | null;
  isDegreeAbsolutelyRequired: boolean | null;
  substitutionPossible: boolean | null;
}
export interface SkillsFirstExplanations {
  degreeRequirementExplanation: string | null;
  bothTrueExplanation: string | null;
  bothFalseExplanation: string | null;
}
export interface SkillsFirstLicenseRequirement {
  isLicenseRequired: boolean | null;
  licenseType: string | null;
  licenseDescription: string | null;
  issuingAuthority: string | null;
  includesDegreeRequirement: boolean | null;
}
export interface SkillsFirstConsistencyChecks {
  cscRevisedConsistency: SkillsFirstCheck | null;
  requiredAlternativeExplanationConsistency: SkillsFirstCheck | null;
  barriersToNonDegreeApplicantsConsistency: SkillsFirstCheck | null;
  licenseIncludesDegreeRequirementConsistency: SkillsFirstCheck | null;
  alternativesIfTrueConsistency: SkillsFirstCheck | null;
  degreeMandatoryConsistency: SkillsFirstCheck | null;
  alternativeQualificationsConsistency: SkillsFirstCheck | null;
  educationRequirementsConsistency: SkillsFirstCheck | null;
  needsCollegeDegreeConsistency: SkillsFirstCheck | null;
}
export interface SkillsFirstLegalResearch {
  titleCode: string | null;
  jobTitle: string;
  statedDegreeRequirement: string | null;
  degreeRequirementType: string | null;
  typeOfOfficialDocument: string | null;
  matchTypeForJobTitle: "exact" | "partial" | null;
  typeOfDegreeRequirement: string | null;
  mandatoryDegreeRequirementStatus: string | null;
  reasoning: string | null;
  sourceUrl: string;
  evidenceQuote: string;
  status: "known" | "unknown";
}
/** Includes supplied reference/manual values; agents must never invent those inputs. */
export interface SkillsFirstLicenseComparison {
  licenseType: string | null;
  matchingWvuProfession: string | null;
  wvuEducationRequirement: string | null;
  researchEducationRequirement: string | null;
  researchMatchesWvu: boolean | "N/A" | null;
  researchComparisonExplanation: string | null;
  manualMinimumEducationRequirement: string | null;
  combinedManualAndResearch: string | null;
  researchMatchesManual: boolean | "N/A" | null;
  requiresManualReview: boolean | "N/A" | null;
  recommendedAction: string | null;
  sourceUrl: string | null;
  notes: string | null;
}
export interface SkillsFirstJobDescription {
  titleCode: string | null;
  variant: string | null;
  classOfService: string | null;
  workWeek: string | null;
  bargainUnit: string | null;
  classCode: string | null;
  salaryRange: string | null;
  workMonth: string | null;
  deptCode: string | null;
  url: string | null;
  name: string;
  text: string;
  originalText?: string;
  rewrittenText?: string;
  classification: string[] | null;
  error: string | null;
  multiLevelJob: boolean | null;
  cscRevised: boolean | null;
  notes: string | null;
  occupationalCategory: { mainCategory: string; subCategory: string }[] | null;
  degreeAnalysis: {
    needsCollegeDegree: boolean | null;
    maximumDegreeRequirement: string | null;
    includesMultipleJobLevelsWithDifferentEducationalRequirements:
      | boolean
      | null;
    educationRequirements: SkillsFirstEducationRequirement[] | null;
    degreeRequirementStatus: SkillsFirstDegreeStatus;
    mandatoryStatusExplanations: SkillsFirstExplanations;
    degreePreferenceQuote: string | null;
    professionalLicenseRequirement: SkillsFirstLicenseRequirement;
    barriersToNonDegreeApplicants: string | null;
    validationChecks: SkillsFirstConsistencyChecks;
    deepResearchResults: SkillsFirstLegalResearch[];
  };
  readingLevelGradeAnalysis: {
    readabilityLevelExplanation: string | null;
    readabilityLevel: string | null;
    difficultPassages: string[] | null;
    readingLevelMatchesDegreeRequirement: boolean | null;
  };
  readabilityAnalysisTextTSNPM: { fleschKincaidGrade: number | null };
  validationScore: number | null;
  licenseComparisons: SkillsFirstLicenseComparison[];
}
export interface SkillsFirstMemory<
  T extends SkillsFirstJobDescription = SkillsFirstJobDescription,
> {
  schemaVersion: "skills-first-memory-v1";
  agentId: string | number | null;
  jobDescriptions: T[];
  rewrittenJobDescriptions: T[];
  llmErrors: string[];
  educationRequirementResearchResults: SkillsFirstLegalResearch[];
  licenseComparisons: SkillsFirstLicenseComparison[];
}
