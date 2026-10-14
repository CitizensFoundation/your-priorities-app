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
  assert.equal(result[0].analysis.licenses.limits.exhausted, true);
  assert.equal(result[0].analysis.licenses.researchTrace.length, 2);
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
