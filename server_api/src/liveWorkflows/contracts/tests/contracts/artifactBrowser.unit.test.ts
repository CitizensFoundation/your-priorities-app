import assert from "node:assert/strict";
import test from "node:test";
import {
  ArtifactBrowserPageSchema,
  artifactBrowserTypeForKind,
} from "../../index.js";

test("artifact browser groups stored kinds into stable user-facing families", () => {
  assert.equal(artifactBrowserTypeForKind("paper_draft"), "reports");
  assert.equal(artifactBrowserTypeForKind("report_markdown"), "reports");
  assert.equal(artifactBrowserTypeForKind("table"), "tables");
  assert.equal(artifactBrowserTypeForKind("analysis_table"), "tables");
  assert.equal(artifactBrowserTypeForKind("infographic_image"), "images");
  assert.equal(artifactBrowserTypeForKind("infographic"), "images");
  assert.equal(artifactBrowserTypeForKind("figure_asset"), "images");
  assert.equal(artifactBrowserTypeForKind("source_code"), "code");
  assert.equal(artifactBrowserTypeForKind("log"), "logs");
  assert.equal(artifactBrowserTypeForKind("archive"), "archives");
  assert.equal(artifactBrowserTypeForKind("data"), "data");
  assert.equal(artifactBrowserTypeForKind("result_json"), "data");
  assert.equal(artifactBrowserTypeForKind("validation_manifest"), "data");
  assert.equal(artifactBrowserTypeForKind("unknown-kind"), "other");
});

test("artifact browser page schema accepts slim paged items and exact counts", () => {
  const page = ArtifactBrowserPageSchema.parse({
    seedItems: [],
    items: [{
      id: "artifact-1",
      section: "research",
      kind: "report",
      browserType: "reports",
      filename: "paper.md",
      featured: true,
      runId: "run-1",
      isCurrentRun: true,
    }],
    nextCursor: null,
    summary: {
      totalCount: 1,
      filteredCount: 1,
      seedCount: 0,
      filteredSeedCount: 0,
      researchCount: 1,
      filteredResearchCount: 1,
      typeCounts: { reports: 1 },
      roleCounts: { paper_draft: 1 },
    },
  });

  assert.equal(page.items[0]?.filename, "paper.md");
  assert.equal(page.summary?.typeCounts.reports, 1);
});

test("artifact browser page schema rejects unknown type families", () => {
  assert.throws(() => ArtifactBrowserPageSchema.parse({
    items: [{
      id: "artifact-1",
      section: "research",
      kind: "report",
      browserType: "documents",
      filename: "paper.md",
      featured: false,
    }],
    nextCursor: null,
  }));
});
