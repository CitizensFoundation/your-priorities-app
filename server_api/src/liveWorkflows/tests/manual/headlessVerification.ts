import assert from "node:assert/strict";
import { z } from "zod";
import { analysisNames, type ManualJob } from "./verification.js";

export const resultRows = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    text: z.string(),
    originalText: z.string(),
    parentId: z.string().optional(),
    parentName: z.string().optional(),
    level: z
      .object({ name: z.string(), index: z.number(), count: z.number() })
      .optional(),
    errors: z.array(z.string()),
    status: z.enum(["complete", "unknown"]),
    analysis: z.record(z.string(), z.unknown()),
    rewrittenText: z.string().optional(),
  }),
);
export type ResultRow = z.infer<typeof resultRows>[number];
const analysis = z.object({
  status: z.enum(["known", "unknown"]),
  findings: z.record(z.string(), z.unknown()),
  evidence: z.array(z.string()),
});

export function verifyAnalyses(rows: ResultRow[], names: readonly string[]) {
  assert.equal(
    new Set(rows.map((row) => row.id)).size,
    rows.length,
    "Duplicate result IDs",
  );
  for (const row of rows) {
    assert.deepEqual(row.errors, [], `Processing failed for ${row.id}`);
    for (const name of names) {
      const result = analysis.parse(row.analysis[name]);
      for (const quote of result.evidence)
        assert.ok(
          quote.trim() && row.text.includes(quote),
          `Unsupported ${name} evidence for ${row.id}`,
        );
    }
  }
}

export function verifyReviewedRewrites(rows: ResultRow[]) {
  const names = [
    "dutyPreservation",
    "legalRequirements",
    "inclusiveLanguage",
    "readability",
    "factualAccuracy",
  ];
  for (const row of rows) {
    assert.ok(row.rewrittenText?.trim(), `Missing rewrite for ${row.id}`);
    const review = z
      .object({
        allChecksPassed: z.literal(true),
        checks: z.array(
          z.object({ name: z.string(), passed: z.literal(true) }),
        ),
      })
      .parse(row.analysis.rewriteValidation);
    assert.deepEqual(
      new Set(review.checks.map((check) => check.name)),
      new Set(names),
    );
  }
}

export function verifyMixedResults(input: ManualJob[], output: unknown) {
  const rows = resultRows.parse(output);
  assert.equal(
    rows.length,
    4,
    "Three original jobs must produce four independently analyzed jobs",
  );
  const parent = input.find((job) => job.id.endsWith(":two-levels"))!;
  const children = rows.filter((row) => row.parentId === parent.id);
  assert.equal(children.length, 2);
  for (const child of children) {
    assert.equal(child.originalText, parent.text);
    assert.equal(child.parentName, parent.name);
    assert.equal(child.level?.count, 2);
    assert.ok(
      child.text.includes(
        "maintain the records inventory and protect confidential records",
      ),
    );
  }
  const junior = children.find((row) => row.name.endsWith(" I"))!;
  const senior = children.find((row) => row.name.endsWith(" II"))!;
  assert.ok(junior && senior, "Both named levels must survive");
  assert.ok(junior.text.includes("No college degree is required."));
  assert.ok(
    !junior.text.includes(
      "A bachelor's degree in information management is required.",
    ),
    "Senior requirements transferred to junior",
  );
  assert.ok(
    senior.text.includes(
      "A bachelor's degree in information management is required.",
    ),
  );
  assert.ok(
    !senior.text.includes("No college degree is required."),
    "Junior exemption transferred to senior",
  );
  const preferred = rows.find((row) => row.id.endsWith(":preferred-degree"))!;
  const missing = rows.find((row) => row.id.endsWith(":missing-evidence"))!;
  assert.equal(
    analysis.parse(preferred.analysis.mandatory).findings.isDegreeMandatory,
    false,
  );
  assert.equal(
    analysis.parse(preferred.analysis.mandatory).findings
      .hasAlternativeQualifications,
    true,
  );
  assert.equal(
    analysis.parse(junior.analysis.mandatory).findings.isDegreeMandatory,
    false,
  );
  assert.equal(
    analysis.parse(senior.analysis.mandatory).findings.isDegreeMandatory,
    true,
  );
  for (const [task, fact] of [
    ["mandatory", "isDegreeMandatory"],
    ["licenses", "isLicenseRequired"],
  ]) {
    const value = analysis.parse(missing.analysis[task]);
    assert.equal(value.status, "unknown");
    assert.equal(
      value.findings[fact],
      null,
      "Unstated requirements must be unknown, not false",
    );
  }
  verifyAnalyses(rows, analysisNames);
  // Analysis quotes are checked against each child's verified text above; splitting may
  // join original passages with newlines that did not occur between them in the parent.
  for (const row of rows) {
    const original = input.find((job) => job.id === (row.parentId ?? row.id));
    assert.ok(original, "Unexpected output lineage");
    assert.equal(row.originalText, original.text, "Original source changed");
    if (!row.parentId) assert.equal(row.name, original.name);
  }
  verifyReviewedRewrites(rows);
  for (const [row, passages] of [
    [
      junior,
      [
        "No college degree is required.",
        "One year of records support experience is required.",
      ],
    ],
    [
      senior,
      [
        "A bachelor's degree in information management is required.",
        "Three years of records management experience is required.",
      ],
    ],
    [
      preferred,
      [
        "A bachelor's degree is preferred, not required.",
        "Applicants may qualify with two years of workshop coordination experience instead of a degree.",
      ],
    ],
  ] as const)
    for (const passage of passages)
      assert.ok(
        row.rewrittenText!.includes(passage),
        "Rewrite changed a qualification or alternative path",
      );
  return {
    parents: input.length,
    records: rows.length,
    splitChildren: children.length,
    unknown: rows.filter((row) => row.status === "unknown").length,
  };
}

export const exportRows = z.array(
  z.object({
    vacancy_card: z.object({
      display_heading: z.string(),
      day_to_day: z.array(z.string()),
      entry_rules: z.array(z.string()),
      nice_to_have: z.array(z.string()),
    }),
  }),
);
export function verifyAdaptedResults(
  raw: unknown,
  assetId: string,
  output: unknown,
  recordIds?: string[],
) {
  const inputs = exportRows.parse(raw),
    rows = resultRows.parse(output);
  const expectedIds =
    recordIds ?? inputs.map((_, index) => `${assetId}:${index + 1}`);
  assert.equal(new Set(expectedIds).size, expectedIds.length);
  assert.ok(
    expectedIds.every((id) =>
      inputs.some((_, index) => id === `${assetId}:${index + 1}`),
    ),
  );
  assert.equal(rows.length, expectedIds.length);
  for (const [index, input] of inputs.entries()) {
    if (!expectedIds.includes(`${assetId}:${index + 1}`)) continue;
    const row = rows.find(
      (candidate) => candidate.id === `${assetId}:${index + 1}`,
    )!;
    assert.ok(row, "Adapter must preserve the imported immutable record ID");
    assert.equal(row.name, input.vacancy_card.display_heading);
    for (const passage of [
      ...input.vacancy_card.day_to_day,
      ...input.vacancy_card.entry_rules,
      ...input.vacancy_card.nice_to_have,
    ]) {
      assert.ok(
        row.text.includes(passage),
        `Adapter lost source passage: ${passage}`,
      );
      assert.ok(
        row.originalText.includes(passage),
        "Adapted original must retain source passages",
      );
    }
    assert.deepEqual(
      analysisNames.filter((name) => row.analysis[name] !== undefined),
      ["degrees", "evidence"],
      "Early trial must include the degree prerequisite and exclude later analyses",
    );
    assert.equal(row.rewrittenText, undefined);
  }
  verifyAnalyses(rows, ["degrees", "evidence"]);
  return { records: rows.length, tasks: ["degrees", "evidence"] };
}
