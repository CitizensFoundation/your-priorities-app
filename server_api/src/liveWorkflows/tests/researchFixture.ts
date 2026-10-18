/** Deterministic provider substitute; no network or legal accuracy claims. */
export function researchResponse(system: string, input: any): YpWorkflowJson {
  if (system.startsWith("Plan authoritative"))
    return { queries: ["fixture statute", "fixture regulator"] };
  if (system.startsWith("Select the strongest"))
    return {
      sources: input.candidates
        .slice(0, input.remainingSources)
        .map((source: any) => ({
          url: source.url,
          authority: "statute",
          jurisdictionMatches: true,
          reason: "Fixture authority label",
        })),
    };
  if (system.startsWith("Extract only requirements"))
    return {
      status: "known",
      requirements: [
        {
          statement: "A license is required.",
          ...(input.source.passages?.find(
            (p: any) => p.text === "A license is required.",
          )
            ? {
                quoteIds: [
                  input.source.passages.find(
                    (p: any) => p.text === "A license is required.",
                  ).id,
                ],
              }
            : { quotes: ["A license is required."] }),
        },
      ],
      gaps: [],
    };
  if (system.startsWith("Independently verify the synthesized"))
    return {
      supported: true,
      jurisdictionCorrect: true,
      conflictsResolved: true,
      issues: [],
    };
  return {
    status: input.sources.length ? "known" : "unknown",
    requirements: input.sources.length
      ? [
          {
            statement: "A license is required.",
            ...(input.evidence?.length
              ? { evidenceIds: [input.evidence[0].id] }
              : {
                  citations: [
                    {
                      url: input.sources[0].url,
                      quote: "A license is required.",
                    },
                  ],
                }),
          },
        ]
      : [],
    comparisons: [],
    educationRequirementResearchResults: input.sources.length
      ? [
          {
            jobTitle: input.job.name,
            statedDegreeRequirement: null,
            degreeRequirementType: null,
            typeOfOfficialDocument: "statute",
            matchTypeForJobTitle: "exact",
            typeOfDegreeRequirement: null,
            mandatoryDegreeRequirementStatus: null,
            reasoning:
              "Fixture evidence establishes a license, not its education prerequisites.",
            ...(input.evidence?.length
              ? { evidenceId: input.evidence[0].id }
              : {
                  sourceUrl: input.sources[0].url,
                  evidenceQuote: "A license is required.",
                }),
          },
        ]
      : [],
    conflicts: [],
    gaps: input.sources.length ? [] : ["No evidence"],
    followUpQueries: [],
  };
}
