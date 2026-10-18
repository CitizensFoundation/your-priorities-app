import test from "node:test";
import assert from "node:assert/strict";
import { readFile, mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import type { Context as WorkflowContext } from "../runner/run.js";
import { loadAgent, loadEvaluator } from "./skillsFirstFixture.js";
type Json = YpWorkflowJson;
const asJson = (value: unknown): Json => JSON.parse(JSON.stringify(value));
const [normalize, levels, analyze, research, rewrite, exportResults] =
  await Promise.all(
    ["normalize", "levels", "analysis", "research", "rewrite", "export"].map(
      loadAgent,
    ),
  );
const evaluate = await loadEvaluator();
import { researchResponse } from "./researchFixture.js";
import { analysisResponse } from "./analysisFixture.js";
const dataset = JSON.parse(
  await readFile(
    new URL(
      "../../../workflow-packages/skills-first/evaluation/cases.json",
      import.meta.url,
    ),
    "utf8",
  ),
);
function context(
  nodeId: string,
  overrides: Partial<WorkflowContext> = {},
): WorkflowContext {
  const saved = new Map<string, Json>();
  return {
    nodeId,
    mode: "trial",
    configuration: { concurrency: 1 },
    model: async () => {
      throw new Error("Unexpected model request");
    },
    connector: async () => ({
      retrievedAt: "2026-10-01T00:00:00Z",
      pages: dataset.evidence
        .slice(0, 1)
        .map((s: any) => ({ url: s.url, markdown: s.text })),
    }),
    progress: async () => {},
    artifact: async () => {},
    checkpoint: async (k, v) => {
      saved.set(k, structuredClone(v));
    },
    restore: async (k) => saved.get(k),
    cancelled: async () => false,
    ...overrides,
  };
}
const extraction = {
  isMultiLevel: true,
  sharedQuotes: ["Maintain equipment."],
  levels: [
    {
      name: "Technician I",
      evidenceQuotes: ["Level I: No degree is specified."],
    },
    {
      name: "Technician II",
      evidenceQuotes: ["Level II: An engineering degree is required."],
    },
  ],
};
const levelReview = {
  allLevelsCovered: true,
  sharedRequirementsPreserved: true,
  noCrossLevelRequirements: true,
  issues: [],
};
const rewriteChecks = [
  "dutyPreservation",
  "legalRequirements",
  "inclusiveLanguage",
  "readability",
  "factualAccuracy",
];

test("versioned synthetic benchmark exercises normalization, split, analysis, research, rewrite and export offline", async (t) => {
  const outputs: Record<string, any>[] = [],
    external: any[] = [];
  for (const example of dataset.cases) {
    const scenario = example.scenario;
    let current = await normalize(
      context("normalize", {
        configuration: { fields: example.fields ?? {} },
      }),
      [example.input],
    );
    current = await levels(
      context("levels", {
        model: async (_key, _system, _input, role) => {
          if (role === "review")
            return scenario === "incomplete-levels"
              ? { ...levelReview, sharedRequirementsPreserved: false }
              : levelReview;
          return ["two-levels", "incomplete-levels"].includes(scenario)
            ? extraction
            : { isMultiLevel: false, sharedQuotes: [], levels: [] };
        },
      }),
      current,
    );
    current = await analyze(
      context("analyze", {
        model: async (_key, _system, input) => {
          const job = input as any;
          assert.equal(
            job.originalText,
            undefined,
            "full parent text must not enter child analysis",
          );
          if (job.name === "Technician I")
            assert.ok(
              !JSON.stringify(input).includes(
                "An engineering degree is required.",
              ),
            );
          return analysisResponse(_key.split(":").at(-1)!, job.text);
        },
      }),
      current,
    );
    current = await research(
      context("licenses", {
        connector: async () => ({
          pages:
            scenario === "missing-evidence"
              ? []
              : dataset.evidence
                  .slice(0, scenario === "conflicting-evidence" ? 2 : 1)
                  .map((s: any) => ({ url: s.url, markdown: s.text })),
        }),
        model: async (_key, system, input) => {
          const response = researchResponse(system, input) as any;
          if (system.startsWith("Extract only requirements")) {
            const text = (input as any).source.url.endsWith("conflict")
              ? "A license is not required."
              : "A license is required.";
            response.requirements = [
              {
                statement: text,
                quotes: [
                  scenario === "unsupported-citation"
                    ? "Invented quote."
                    : text,
                ],
              },
            ];
          }
          if (
            system.startsWith("Select the strongest") &&
            scenario === "wrong-jurisdiction"
          )
            response.sources.forEach((s: any) => {
              s.jurisdictionMatches = false;
            });
          if (
            system.includes("Synthesize only the extracted") &&
            scenario === "conflicting-evidence"
          )
            response.conflicts = ["The two supplied sources disagree."];
          return response;
        },
      }),
      current,
    );
    current = await rewrite(
      context("rewrite", {
        model: async (_key, _system, input, role): Promise<Json> =>
          role === "review"
            ? {
                allChecksPassed: scenario !== "rewrite-failure",
                checks: rewriteChecks.map((name) => ({
                  name,
                  passed: scenario !== "rewrite-failure",
                })),
                feedback: "Fixture review",
              }
            : { text: (input as any).text, changes: [] },
      }),
      current,
    );
    const artifacts = new Map<string, string>();
    current = await exportResults(
      context("export", {
        mode: "bulk",
        configuration: { outputBindings: ["fixture"] },
        artifact: async (name, content) => {
          artifacts.set(name, content);
        },
        connector: async (_k, _b, _o, input) => {
          external.push(...(input.documents as any[]));
          return {};
        },
      }),
      current,
    );
    assert.deepEqual(
      JSON.parse(artifacts.get("skills-first.json")!).jobDescriptions,
      current,
    );
    outputs.push(...(current as any[]));
  }
  const report = evaluate(dataset, outputs);
  assert.deepEqual(
    report.cases.filter((c) => !c.passed),
    [],
  );
  assert.equal(report.success, true);
  assert.equal(report.total, 10);
  assert.equal(
    evaluate(
      dataset,
      outputs.map((row) => ({
        ...row,
        source: "fixture-asset",
        id: row.parentId ? row.id : `fixture-asset:${row.id}`,
        ...(row.parentId ? { parentId: `fixture-asset:${row.parentId}` } : {}),
      })),
    ).success,
    true,
    "saved exports retain asset-prefixed identities",
  );
  assert.ok(
    external.every(
      (row) => row.status === "complete" && row.errors.length === 0,
    ),
  );
  assert.equal(external.length, 5);
  const altered = structuredClone(outputs);
  altered.find((row) => row.id === "single-mandatory")!.rewrittenText =
    "Maintain equipment.";
  altered.find((row) => row.name === "Technician I")!.text +=
    " An engineering degree is required.";
  assert.equal(evaluate(dataset, altered).success, false);
  assert.ok(
    evaluate(dataset, altered)
      .cases.find((c) => c.id === "two-levels")!
      .issues.includes("qualification crossed levels"),
  );
  const directory = await mkdtemp(path.join(tmpdir(), "yp-evaluation-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const file = path.join(directory, "results.json");
  for (const [rows, expectedStatus] of [
    [outputs, 0],
    [altered, 1],
  ] as const) {
    await writeFile(file, JSON.stringify(rows));
    const scored = spawnSync(
      process.execPath,
      [
        "--import",
        "tsx",
        fileURLToPath(new URL("./evaluateSkillsFirst.ts", import.meta.url)),
        file,
      ],
      { encoding: "utf8" },
    );
    assert.ifError(scored.error);
    assert.equal(scored.status, expectedStatus, scored.stderr);
    assert.equal(JSON.parse(scored.stdout).success, expectedStatus === 0);
  }
});
test("splitting preserves lineage and stable IDs after checkpoint loss; invalid splits retain the parent", async () => {
  const example = dataset.cases.find((c: any) => c.id === "two-levels");
  const input = await normalize(context("normalize"), [example.input]);
  const requests: Json[] = [];
  const model: WorkflowContext["model"] = async (key, system, value, role) => {
    requests.push(asJson({ key, system, value, role }));
    return role === "review" ? levelReview : extraction;
  };
  const first = await levels(context("levels", { model }), input),
    second = await levels(context("levels", { model }), input);
  assert.deepEqual(first, second);
  assert.deepEqual(requests.slice(0, 2), requests.slice(2));
  const rows = first as any[];
  assert.equal(new Set(rows.map((r) => r.id)).size, 2);
  assert.ok(
    rows.every(
      (r) => r.parentId === example.id && r.originalText === example.input.text,
    ),
  );
  for (const bad of [
    {
      ...extraction,
      levels: [...extraction.levels, extraction.levels[0]],
    },
    { ...extraction, sharedQuotes: ["Invented duty."] },
  ]) {
    const result = (await levels(
      context("levels", { model: async () => bad }),
      input,
    )) as any[];
    assert.equal(result.length, 1);
    assert.equal(result[0].id, example.id);
    assert.equal(result[0].status, "unknown");
  }
});
test("research enforces query/source/follow-up bounds and records uncertainty instead of looping", async () => {
  const input = (await normalize(context("normalize"), [
    dataset.cases[0].input,
  ])) as any[];
  input[0].status = "complete";
  const requests: string[] = [];
  let queryCount = 0;
  const result = (await research(
    context("licenses", {
      configuration: {
        queriesPerRound: 2,
        maxPages: 1,
        maxSources: 3,
        maxFollowupRounds: 1,
      },
      connector: async (key) => {
        requests.push(key);
        queryCount++;
        return {
          pages: [
            {
              url: `https://fixture.example/${queryCount}`,
              markdown: "A license is required.",
            },
          ],
        };
      },
      model: async (key, system, value) => {
        requests.push(key);
        const result = researchResponse(system, value) as any;
        if (system.startsWith("Plan authoritative"))
          result.queries = ["q1", "q2", "q3"];
        if (system.includes("Synthesize only the extracted")) {
          result.gaps = ["Unresolved exception"];
          result.followUpQueries = ["f1", "f2", "f3"];
        }
        return result;
      },
    }),
    input,
  )) as any[];
  assert.equal(queryCount, 4);
  assert.equal(requests.filter((k) => k.includes(":extract:")).length, 3);
  assert.equal(new Set(requests).size, requests.length);
  assert.equal(result[0].status, "unknown");
  assert.equal(result[0].analysis.research.licenses.limits.exhausted, true);
  assert.equal(result[0].analysis.research.licenses.researchTrace.length, 2);
});
test("research rejects invented source URLs before accepting a finding", async () => {
  const input = await normalize(context("normalize"), [dataset.cases[0].input]);
  const result = (await research(
    context("licenses", {
      model: async (_key, system, input) => {
        if (system.startsWith("Select the strongest"))
          return {
            sources: [
              {
                url: "https://invented.example/",
                authority: "statute",
                jurisdictionMatches: true,
              },
            ],
          };
        return researchResponse(system, input);
      },
    }),
    input,
  )) as any[];
  assert.equal(result[0].status, "unknown");
  assert.match(result[0].errors.join(), /observed URLs/);
});

test("research citation IDs preserve exact Unicode spacing and punctuation and reject invented IDs", async () => {
  const input = await normalize(context("normalize"), [dataset.cases[0].input]);
  const quote = "A license\u00a0is required (or a supervised alternative).";
  for (const invalid of [false, true]) {
    const result = (await research(
      context("licenses", {
        configuration: {
          queriesPerRound: 1,
          maxSources: 1,
          maxFollowupRounds: 0,
        },
        connector: async () => ({
          pages: [{ url: "https://example.gov/license", markdown: quote }],
        }),
        model: async (_key, system, value) => {
          const data = value as any;
          if (system.startsWith("Extract only requirements")) {
            assert.equal(data.source.passages[0].text, quote);
            assert.equal(data.source.text, undefined);
            return {
              status: "known",
              requirements: [
                {
                  statement: "A license or supervised alternative is required.",
                  quoteIds: [invalid ? "invented" : data.source.passages[0].id],
                },
              ],
              gaps: [],
            };
          }
          const response = researchResponse(system, data) as any;
          if (system.includes("Synthesize only the extracted")) {
            assert.equal(data.evidence[0].quote, quote);
            response.requirements = [
              {
                statement: "A license or supervised alternative is required.",
                evidenceIds: [data.evidence[0].id],
              },
            ];
            response.educationRequirementResearchResults[0].evidenceId =
              data.evidence[0].id;
            delete response.educationRequirementResearchResults[0].sourceUrl;
            delete response.educationRequirementResearchResults[0]
              .evidenceQuote;
          }
          return response;
        },
      }),
      input,
    )) as any[];
    if (invalid)
      assert.match(result[0].errors.join(), /Unknown research passage IDs/);
    else {
      assert.deepEqual(result[0].errors, []);
      assert.equal(
        result[0].analysis.research.licenses.citations[0].quote,
        quote,
      );
      assert.equal(
        result[0].degreeAnalysis.deepResearchResults[0].evidenceQuote,
        quote,
      );
    }
  }
});

test("research compacts an overlong plan once before searching and rejects a still-invalid correction", async (t) => {
  for (const repaired of [
    "Idaho Technician official qualifications",
    "x".repeat(501),
  ]) {
    await t.test(
      repaired.length > 200 ? "invalid correction" : "valid correction",
      async () => {
        const input = await normalize(context("normalize"), [
          dataset.cases[0].input,
        ]);
        const searches: string[] = [],
          repairs: string[] = [];
        const result = (await research(
          context("licenses", {
            configuration: { queriesPerRound: 1, maxFollowupRounds: 0 },
            connector: async (_key, _binding, _operation, value) => {
              searches.push(String(value.query));
              return { pages: [] };
            },
            model: async (key, system, value) => {
              if (system.startsWith("Plan authoritative")) {
                assert.equal((value as any).maxQueryChars, 200);
                assert.match(system, /search-engine keyword string/);
                return {
                  queries: [
                    "Research all the laws and qualifications. ".repeat(20),
                  ],
                };
              }
              if (key.endsWith(":compact")) {
                repairs.push(key);
                return { queries: [repaired] };
              }
              return researchResponse(system, value);
            },
          }),
          input,
        )) as any[];
        assert.equal(repairs.length, 1);
        if (repaired.length > 200) {
          assert.equal(searches.length, 0);
          assert.match(result[0].errors.join(), /query is too long/);
        } else {
          assert.deepEqual(searches, [repaired]);
          assert.deepEqual(result[0].errors, []);
          assert.equal(result[0].analysis.research.licenses.status, "unknown");
        }
      },
    );
  }
});

test("research retains retrieved evidence when unusable follow-ups exceed the exhausted search budget", async () => {
  const input = await normalize(
    context("normalize", {
      configuration: { jurisdiction: "Idaho, USA" },
    }),
    [dataset.cases[0].input],
  );
  const requests: string[] = [];
  const result = (await research(
    context("education", {
      configuration: { queriesPerRound: 1, maxFollowupRounds: 0 },
      model: async (key, system, value) => {
        requests.push(key);
        const response = researchResponse(system, value) as any;
        if (system.includes("Synthesize only the extracted")) {
          assert.doesNotMatch(system, /New Jersey|JSON array/);
          assert.match(system, /Implicit Associate's/);
          assert.match(system, /silence is not such a statement/);
          assert.equal((value as any).followupRoundsRemaining, 0);
          response.followUpQueries = [
            "Find more official sources. ".repeat(30),
          ];
        }
        return response;
      },
    }),
    input,
  )) as any[];
  assert.ok(!requests.some((key) => key.endsWith(":compact")));
  assert.deepEqual(result[0].errors, []);
  assert.ok(result[0].degreeAnalysis.deepResearchResults.length);
  assert.equal(result[0].analysis.research.education.limits.exhausted, true);
  assert.equal(result[0].analysis.research.education.status, "unknown");
});

test("research gives an overlong follow-up one correction within the remaining search limits", async () => {
  const input = await normalize(context("normalize"), [dataset.cases[0].input]);
  let searches = 0,
    repairs = 0;
  const result = (await research(
    context("education", {
      configuration: {
        queriesPerRound: 1,
        maxSources: 2,
        maxFollowupRounds: 1,
      },
      connector: async () => ({
        pages: [
          {
            url: `https://fixture.example/${++searches}`,
            markdown: "A license is required.",
          },
        ],
      }),
      model: async (key, system, value) => {
        if (key.endsWith(":compact")) {
          repairs++;
          assert.match(key, /:follow-up:0:compact$/);
          return { queries: ["Idaho Technician official license exceptions"] };
        }
        const response = researchResponse(system, value) as any;
        if (system.includes("Synthesize only the extracted")) {
          response.gaps = ["Unresolved exception"];
          response.followUpQueries = [
            "Find more official sources. ".repeat(30),
          ];
        }
        return response;
      },
    }),
    input,
  )) as any[];
  assert.equal(searches, 2);
  assert.equal(repairs, 1);
  assert.deepEqual(result[0].errors, []);
  assert.equal(result[0].analysis.research.education.limits.exhausted, true);
});

test("no applicable web evidence stays unknown without synthesizing upload citations or paying for an empty review", async () => {
  const input = await normalize(context("normalize"), [dataset.cases[0].input]);
  const requests: string[] = [];
  const result = (await research(
    context("licenses", {
      configuration: { queriesPerRound: 1, maxFollowupRounds: 0 },
      model: async (key, system, value) => {
        requests.push(key);
        assert.ok(
          !key.includes(":synthesis:") && !key.endsWith(":research-review"),
        );
        if (system.startsWith("Extract only requirements"))
          return {
            status: "unknown",
            requirements: [],
            gaps: [
              "The search result concerns a different job; the upload has no web source URL.",
            ],
          };
        return researchResponse(system, value);
      },
    }),
    input,
  )) as any[];
  const finding = result[0].analysis.research.licenses;
  assert.deepEqual(result[0].errors, []);
  assert.equal(finding.status, "unknown");
  assert.deepEqual(finding.citations, []);
  assert.deepEqual(result[0].degreeAnalysis.deepResearchResults, []);
  assert.equal(finding.review.supported, false);
  assert.equal(finding.review.performed, false);
  assert.equal(finding.review.jurisdictionCorrect, false);
  assert.ok(finding.gaps.some((gap: string) => gap.includes("different job")));
  assert.equal(
    requests.length,
    3,
    "Only planning, selection and extraction are needed",
  );
});

test("research reserves follow-up capacity and follows an observed official document within the same caps", async () => {
  const input = await normalize(context("normalize"), [dataset.cases[0].input]);
  let searches = 0,
    documents = 0;
  const result = (await research(
    context("education", {
      configuration: {
        queriesPerRound: 1,
        maxSources: 2,
        maxFollowupRounds: 1,
        maxDocuments: 2,
      },
      connector: async (_key, _binding, operation, value): Promise<Json> => {
        if (operation === "search") {
          searches++;
          return {
            requestId: "search",
            pages: [
              {
                url: "https://agency.gov/jobs",
                markdown: "General careers page.",
              },
            ],
          };
        }
        documents++;
        if (documents === 1)
          return {
            requestId: "document",
            markdown: "General careers page.",
            truncated: false,
            links: [
              {
                url: "https://agency.gov/classification",
                title: "Official classification",
              },
            ],
          };
        assert.equal(value.url, "https://agency.gov/classification");
        assert.equal(value.sourceRequestId, "document");
        return {
          requestId: "classification",
          markdown: "A license is required.",
          truncated: false,
          links: [],
        };
      },
      model: async (_key, system, value) => {
        const data = value as any;
        if (
          system.startsWith("Extract only") &&
          data.source.passages?.some(
            (p: any) => p.text === "General careers page.",
          )
        )
          return {
            status: "unknown",
            requirements: [],
            gaps: ["Need specific classification"],
          };
        if (system.includes("Synthesize only"))
          return researchResponse(system, {
            ...data,
            sources: data.sources.filter(
              (s: any) => s.extraction.requirements.length,
            ),
          });
        return researchResponse(system, value);
      },
    }),
    input,
  )) as any[];
  assert.equal(
    searches,
    1,
    "Do not repeat the same search just to follow a known link",
  );
  assert.equal(documents, 2);
  assert.deepEqual(result[0].errors, []);
  assert.equal(
    result[0].analysis.research.education.sources[1].linkedFrom,
    "https://agency.gov/jobs",
  );
  assert.equal(
    result[0].analysis.research.education.citations[0].url,
    "https://agency.gov/classification",
  );
});

test("empty research can use its remaining follow-up budget and synthesis sees only retrieved evidence", async () => {
  const input = await normalize(context("normalize"), [dataset.cases[0].input]);
  let searches = 0,
    followups = 0;
  const result = (await research(
    context("education", {
      configuration: {
        queriesPerRound: 1,
        maxSources: 2,
        maxFollowupRounds: 1,
      },
      connector: async () => ({
        pages: [
          {
            url: `https://fixture.example/${++searches}`,
            markdown:
              searches === 1 ? "Unrelated role." : "A license is required.",
          },
        ],
      }),
      model: async (key, system, value) => {
        const data = value as any;
        if (key.includes(":follow-up-plan:")) {
          followups++;
          assert.equal(data.searched.length, 1);
          return { queries: ["Different official source"] };
        }
        if (
          system.startsWith("Extract only requirements") &&
          data.source.passages?.some((p: any) => p.text === "Unrelated role.")
        )
          return {
            status: "unknown",
            requirements: [],
            gaps: ["Different job"],
          };
        if (system.includes("Synthesize only the extracted")) {
          assert.equal(data.job.text, undefined);
          assert.equal(data.job.analysis, undefined);
          assert.equal(data.job.citations, undefined);
          assert.match(system, /Never cite the uploaded job/);
          return researchResponse(system, {
            ...data,
            sources: data.sources.filter(
              (source: any) => source.extraction.requirements.length,
            ),
          });
        }
        return researchResponse(system, value);
      },
    }),
    input,
  )) as any[];
  assert.equal(searches, 2);
  assert.equal(followups, 1);
  assert.deepEqual(result[0].errors, []);
  assert.equal(result[0].analysis.research.education.status, "known");
  assert.equal(
    result[0].degreeAnalysis.deepResearchResults[0].sourceUrl,
    "https://fixture.example/2",
  );
});
