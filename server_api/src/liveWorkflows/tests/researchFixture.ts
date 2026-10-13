/** Deterministic provider substitute; no network or legal accuracy claims. */
export function researchResponse(
  system: string,
  input: any,
): YpWorkflowJson {
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
          quotes: ["A license is required."],
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
            citations: [
              {
                url: input.sources[0].url,
                quote: "A license is required.",
              },
            ],
          },
        ]
      : [],
    comparisons: [],
    conflicts: [],
    gaps: input.sources.length ? [] : ["No evidence"],
    followUpQueries: [],
  };
}
