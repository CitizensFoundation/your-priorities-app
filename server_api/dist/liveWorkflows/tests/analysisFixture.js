/** Structural test responses only; these are not semantic/model evaluations. */
export function analysisTaskFromPrompt(system) {
    const prefixes = {
        "Determine whether degrees": "mandatory",
        "Identify explicit professional license": "licenses",
        "Identify education requirements": "degrees",
        "Review the education findings": "evidence",
        "Identify stated degree requirements": "barriers",
        "Compare prior education": "consistency",
        "Check the fidelity": "consistency",
        "Estimate the reading grade": "readingLevel",
    };
    const match = Object.entries(prefixes).find(([prefix]) => system.includes(`Task: ${prefix}`));
    if (!match)
        throw new Error("Unrecognized analysis prompt");
    return match[1];
}
export function analysisResponse(task, text, missing = false) {
    const findings = {
        degrees: {
            needsCollegeDegree: null,
            maximumDegreeRequirement: null,
            includesMultipleJobLevelsWithDifferentEducationalRequirements: null,
            educationRequirements: null,
        },
        evidence: { checks: [] },
        mandatory: {
            isDegreeMandatory: missing ? null : /degree in .+ is required/.test(text),
            hasAlternativeQualifications: missing
                ? null
                : text.includes("instead of a degree"),
            alternativeQualifications: null,
            multipleQualificationPaths: null,
            isDegreeAbsolutelyRequired: null,
            substitutionPossible: null,
            degreePreferenceQuote: null,
            mandatoryStatusExplanations: {
                degreeRequirementExplanation: null,
                bothTrueExplanation: null,
                bothFalseExplanation: null,
            },
        },
        licenses: {
            isLicenseRequired: null,
            includesDegreeRequirement: null,
            licenseType: null,
            licenseDescription: null,
            issuingAuthority: null,
        },
        barriers: { barriersToNonDegreeApplicants: null },
        consistency: {
            validationChecks: Object.fromEntries([
                "cscRevisedConsistency",
                "requiredAlternativeExplanationConsistency",
                "barriersToNonDegreeApplicantsConsistency",
                "licenseIncludesDegreeRequirementConsistency",
                "alternativesIfTrueConsistency",
                "degreeMandatoryConsistency",
                "alternativeQualificationsConsistency",
                "educationRequirementsConsistency",
                "needsCollegeDegreeConsistency",
            ].map((key) => [key, "unknown"])),
        },
        readingLevel: {
            readabilityLevel: null,
            readabilityLevelExplanation: null,
            difficultPassages: null,
            readingLevelMatchesDegreeRequirement: null,
        },
    };
    if (!findings[task])
        throw new Error(`Unknown analysis task: ${task}`);
    return {
        status: missing ? "unknown" : "known",
        findings: findings[task],
        evidence: missing ? [] : [text],
    };
}
