import test from "node:test";
import assert from "node:assert/strict";
import { researchResponse } from "./researchFixture.js";
import { analysisResponse } from "./analysisFixture.js";
import type { Context } from "../runner/run.js";

type Agent = (
  context: Context,
  input: YpWorkflowJson,
) => Promise<YpWorkflowJson>;
const load = async (name: string) =>
  (
    (await import(
      new URL(
        `../../../workflow-packages/skills-first/source/${name}.ts`,
        import.meta.url,
      ).href
    )) as { run: Agent }
  ).run;
function context(overrides: Partial<Context> = {}): Context {
  const saved = new Map<string, YpWorkflowJson>();
  return {
    nodeId: "test",
    mode: "trial",
    configuration: { concurrency: 1 },
    model: async () => {
      throw new Error("Unexpected model call");
    },
    connector: async () => {
      throw new Error("Unexpected connector call");
    },
    progress: async () => {},
    checkpoint: async (key, value) => {
      saved.set(key, value);
    },
    restore: async (key) => saved.get(key),
    artifact: async () => {},
    cancelled: async () => false,
    ...overrides,
  };
}
const job = {
  id: "one",
  name: "Technician",
  text: "A license is required. Maintain equipment.",
  source: "fixture",
  jurisdiction: "New Jersey",
  status: "complete",
  analysis: {},
  citations: [],
  errors: [],
};
test("targeted evidence analysis runs degree extraction first; consistency includes its dependencies without reading-level spending", async () => {
  const analyze = await load("analysis");
  for (const [requested, expected] of [
    ["evidence", ["degrees", "evidence"]],
    [
      "consistency",
      [
        "degrees",
        "evidence",
        "mandatory",
        "licenses",
        "barriers",
        "consistency",
      ],
    ],
  ] as const) {
    const calls: string[] = [];
    const messages: string[] = [];
    const output = (await analyze(
      context({
        configuration: { tasks: [requested] },
        progress: async (_processed, _total, _child, _failed, message) => {
          if (message) messages.push(message);
        },
        model: async (key, _system, input) => {
          const name = key.split(":").at(-1)!;
          assert.equal(messages.at(-1), `Checking ${name} for ${job.name}`);
          const current = input as { analysis: Record<string, unknown> };
          if (name === "evidence") assert.ok(current.analysis.degrees);
          if (name === "consistency")
            for (const prerequisite of expected.slice(0, -1))
              assert.ok(current.analysis[prerequisite]);
          calls.push(name);
          return analysisResponse(name, job.text);
        },
      }),
      [job],
    )) as { analysis: Record<string, unknown> }[];
    assert.deepEqual(calls, expected);
    assert.ok(
      messages.includes(`Checked ${requested} for ${job.name} · known`),
    );
    assert.equal(output[0].analysis.readingLevel, undefined);
  }
  for (const tasks of [[], ["not-a-task"], "evidence", ["__proto__"]])
    await assert.rejects(
      analyze(context({ configuration: { tasks } }), [job]),
      /supported task names/,
    );
});

test("legacy analysis responses and unsupported quotes stay failed records rather than silently becoming findings", async () => {
  const analyze = await load("analysis");
  const rewrite = await load("rewrite");
  const responses: YpWorkflowJson[] = [
    {
      needsCollegeDegree: false,
      maximumDegreeRequirement: "Bachelor's degree",
      educationRequirements: [],
    },
    { status: "known", findings: {}, evidence: ["Invented requirement"] },
  ];
  for (const response of responses) {
    const analyzed = (await analyze(
      context({
        nodeId: "analyze",
        model: async () => response,
      }),
      [job],
    )) as Record<string, YpWorkflowJson>[];
    assert.equal(analyzed[0].status, "unknown");
    assert.equal((analyzed[0].errors as string[]).length, 1);
    const analysis = analyzed[0].analysis as Record<string, YpWorkflowJson>;
    assert.equal(
      analysis.degrees,
      undefined,
      "Rejected fields must not become accepted findings",
    );
    assert.deepEqual(
      (analysis.rejectedAnalysis as Record<string, YpWorkflowJson>).response,
      response,
    );
    assert.equal(typeof analysis.fleschKincaidGrade, "number");
    const rewritten = await rewrite(context(), analyzed);
    assert.deepEqual(
      rewritten,
      analyzed,
      "Failed records must not spend on a rewrite",
    );
  }
});

test("bounded document retrieval upgrades complete PDF evidence and preserves partial coverage as unknown", async () => {
  const stage = await load("research");
  for (const truncated of [false, true]) {
    const documents: Record<string, YpWorkflowJson>[] = [];
    const result = (await stage(
      context({
        nodeId: "licenses",
        configuration: {
          maxDocuments: 1,
          maxDocumentPages: 5,
          maxDocumentChars: 60000,
        },
        model: async (_key, system, input) => researchResponse(system, input),
        connector: async (
          _key,
          _binding,
          operation,
          input,
        ): Promise<YpWorkflowJson> => {
          if (operation === "search")
            return {
              requestId: "33333333-3333-4333-8333-333333333333",
              retrievedAt: "2026-10-01",
              pages: [
                {
                  url: "https://example.gov/statute.pdf",
                  markdown: "A license is required.",
                },
              ],
            };
          assert.equal(operation, "scrape");
          documents.push(input);
          return {
            markdown: "A license is required. Complete document evidence.",
            truncated,
            coverage: { parsedPages: 5, totalPages: truncated ? 10 : 5 },
            retrievedAt: "2026-10-02",
          };
        },
      }),
      [job],
    )) as any[];
    assert.equal(documents.length, 1);
    assert.equal(documents[0].maxPages, 5);
    assert.equal(
      result[0].analysis.licenses.status,
      truncated ? "unknown" : "known",
    );
    assert.equal(result[0].analysis.licenses.limits.fetchedDocuments, 1);
    assert.equal(result[0].citations[0].retrievedAt, "2026-10-02");
  }
});
test("unsupported citations isolate the affected record and preserve original evidence", async () => {
  const stage = await load("research");
  const counts: number[] = [];
  const result = (await stage(
    context({
      nodeId: "licenses",
      connector: async () => ({
        retrievedAt: "2026-10-01T00:00:00.000Z",
        pages: [
          {
            url: "https://example.gov",
            markdown: "A license is required.",
          },
        ],
      }),
      model: async (_key, system, input) => {
        const response = researchResponse(system, input);
        if (
          system.startsWith("Extract only requirements") &&
          (input as { job: { id: string } }).job.id === "one"
        )
          return {
            status: "known",
            requirements: [
              {
                statement: "Missing",
                quotes: ["No license is required."],
              },
            ],
            gaps: [],
          };
        return response;
      },
      progress: async (_done, _total, _child, failed) => {
        if (failed !== undefined) counts.push(failed);
      },
    }),
    [job, { ...job, id: "two" }],
  )) as Record<string, YpWorkflowJson>[];
  assert.equal(result[0].status, "unknown");
  assert.equal(result[0].text, job.text);
  assert.deepEqual(result[0].citations, []);
  assert.match(String(result[0].errors), /not supported/);
  assert.equal(result[1].status, "complete");
  assert.equal(
    (result[1].citations as { retrievedAt: string }[])[0].retrievedAt,
    "2026-10-01T00:00:00.000Z",
  );
  assert.equal(counts.at(-1), 1);
});
test("paid provider failures pause execution while invalid records skip downstream spending", async () => {
  const stage = await load("research");
  const result = (await stage(context(), [
    { ...job, errors: ["analysis: invalid response"], status: "unknown" },
  ])) as Record<string, YpWorkflowJson>[];
  assert.equal(result[0].status, "unknown");
  await assert.rejects(
    stage(
      context({
        model: async (_key, system, input) => researchResponse(system, input),
        connector: async () => {
          throw new Error("Provider unavailable");
        },
      }),
      [job],
    ),
    /Provider unavailable/,
  );
});
test("research replay keeps paid model inputs identical for both new and legacy cached searches", async () => {
  const stage = await load("research");
  for (const retrievedAt of [undefined, "2026-10-01T00:00:00.000Z"]) {
    const prompts: YpWorkflowJson[] = [];
    const connector = async () => ({
      ...(retrievedAt ? { retrievedAt } : {}),
      pages: [
        { url: "https://example.gov", markdown: "A license is required." },
      ],
    });
    const model: Context["model"] = async (key, system, input) => {
      prompts.push({ key, system, input });
      return researchResponse(system, input);
    };
    await stage(context({ connector, model }), [job]);
    await stage(context({ connector, model }), [job]);
    assert.ok(prompts.length >= 10);
    assert.deepEqual(
      prompts.slice(0, prompts.length / 2),
      prompts.slice(prompts.length / 2),
    );
  }
});

test("rewrite repairs retain the previous proposal and every review so later corrections do not erase earlier ones", async () => {
  const rewrite = await load("rewrite");
  let attempt = 0;
  const proposals = [
    "Draft with two issues",
    "Draft with first issue fixed",
    job.text,
  ];
  const feedback = [
    "Restore the license requirement",
    "Restore the original duty wording",
  ];
  const result = (await rewrite(
    context({
      nodeId: "rewrite",
      model: async (_key, _system, input, role): Promise<YpWorkflowJson> => {
        if (role !== "review") {
          const revision = input as Record<string, YpWorkflowJson>;
          const history = revision.reviewHistory as { feedback: string }[];
          assert.deepEqual(
            history.map((review) => review.feedback),
            feedback.slice(0, attempt),
          );
          if (attempt)
            assert.equal(
              (revision.previousProposal as { text: string }).text,
              proposals[attempt - 1],
            );
          else assert.equal(revision.previousProposal, undefined);
          return { text: proposals[attempt++], changes: [] };
        }
        const passed = attempt === 3;
        return {
          allChecksPassed: passed,
          checks: [
            "dutyPreservation",
            "legalRequirements",
            "inclusiveLanguage",
            "readability",
            "factualAccuracy",
          ].map((name) => ({
            name,
            passed,
            reason: passed ? "Preserved" : "Restore source meaning",
          })),
          feedback: feedback[attempt - 1] ?? "",
        };
      },
    }),
    [job],
  )) as { rewrittenText: string; errors: string[] }[];
  assert.equal(attempt, 3);
  assert.equal(result[0].rewrittenText, job.text);
  assert.deepEqual(result[0].errors, []);
});

test("a claimed successful rewrite with missing review checks is rejected after bounded attempts", async () => {
  let requests = 0;
  const stage = await load("rewrite");
  const result = (await stage(
    context({
      model: async (_key, _system, _input, role): Promise<YpWorkflowJson> => {
        requests++;
        return role === "review"
          ? {
              allChecksPassed: true,
              checks: Array.from({ length: 5 }, () => ({
                name: "readability",
                passed: true,
              })),
            }
          : { text: "No license is needed.", changes: [] };
      },
    }),
    [job],
  )) as Record<string, YpWorkflowJson>[];
  assert.equal(requests, 6);
  assert.equal(result[0].status, "unknown");
  assert.equal(result[0].rewrittenText, undefined);
});
test("missing reference evidence is unknown and does not spend model tokens", async () => {
  const stage = await load("compare"),
    result = (await stage(context({ nodeId: "compare" }), [job])) as Record<
      string,
      YpWorkflowJson
    >[];
  assert.equal(result[0].status, "unknown");
  assert.match(JSON.stringify(result[0].analysis), /Reference data is missing/);
});
test("trial exports stay local and escape spreadsheet formulas", async () => {
  const artifacts = new Map<string, string>(),
    stage = await load("export");
  await stage(
    context({
      configuration: { outputBindings: ["external"] },
      artifact: async (name, contents) => {
        artifacts.set(name, contents);
      },
    }),
    [{ ...job, name: '=HYPERLINK("https://example.com")' }],
  );
  assert.equal(artifacts.size, 4);
  assert.ok(artifacts.get("skills-first.csv")?.includes("'=HYPERLINK"));
});
test("large exports preserve every record in bounded parts and advance external sheet rows", async () => {
  const artifacts = new Map<string, string>();
  const writes: Record<string, YpWorkflowJson>[] = [];
  const stage = await load("export");
  const input = Array.from({ length: 4 }, (_, i) => ({
    ...job,
    id: String(i),
    text: "x".repeat(600_000),
  }));
  await stage(
    context({
      mode: "bulk",
      configuration: { outputBindings: ["results"] },
      artifact: async (name, contents) => {
        artifacts.set(name, contents);
      },
      connector: async (_key, _binding, _operation, input) => {
        writes.push(input);
        return {};
      },
    }),
    input,
  );
  const parts = [...artifacts].filter(([name]) =>
    /^skills-first-\d+\.json$/.test(name),
  );
  assert.equal(parts.length, 4);
  assert.deepEqual(
    parts.flatMap(([, content]) =>
      JSON.parse(content).jobDescriptions.map((row: { id: string }) => row.id),
    ),
    ["0", "1", "2", "3"],
  );
  assert.ok(
    [...artifacts.values()].every(
      (content) => Buffer.byteLength(JSON.stringify({ content })) < 12_000_000,
    ),
  );
  assert.deepEqual(
    writes.map((write) => write.rowOffset),
    [0, 3, 4, 5],
  );
  assert.equal((writes[0].rows as unknown[]).length, 3);
  assert.equal((writes[1].rows as unknown[]).length, 1);
  assert.equal(
    JSON.parse(artifacts.get("skills-first-manifest.json")!).records,
    4,
  );
});

test("external exports omit failed and unknown records while local artifacts retain them for review", async () => {
  const stage = await load("export");
  const artifacts = new Map<string, string>();
  const writes: Record<string, YpWorkflowJson>[] = [];
  const input = [
    {
      ...job,
      id: "invalid",
      text: "x".repeat(900_000),
      status: "unknown",
      errors: ["unsupported citation"],
    },
    { ...job, id: "uncertain", status: "unknown" },
    { ...job, id: "valid", text: "x".repeat(900_000) },
  ];
  await stage(
    context({
      mode: "bulk",
      configuration: { outputBindings: ["results"] },
      artifact: async (name, content) => {
        artifacts.set(name, content);
      },
      connector: async (_key, _binding, _operation, data) => {
        writes.push(data);
        return {};
      },
    }),
    input,
  );
  assert.equal(writes.length, 1);
  assert.equal(
    writes[0].rowOffset,
    0,
    "the first eligible part gets a header at the original output row",
  );
  assert.equal((writes[0].rows as unknown[]).length, 3);
  assert.deepEqual(
    (writes[0].documents as { id: string }[]).map((row) => row.id),
    ["valid"],
  );
  const local = [...artifacts]
    .filter(([name]) => /^skills-first-\d+\.json$/.test(name))
    .flatMap(([, content]) => JSON.parse(content).jobDescriptions);
  assert.deepEqual(
    local.map((row) => row.id),
    ["invalid", "uncertain", "valid"],
  );
});
