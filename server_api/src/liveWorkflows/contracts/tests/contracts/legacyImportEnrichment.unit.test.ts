import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { LegacyImportSchemaVersion, type LegacyGroupWorkspaceManifest, type LegacyImportArtifact } from "../../legacyImport.js";

const testFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(testFile), "../../../../..");
const enrichmentScript = path.join(repoRoot, "scripts", "enrich-legacy-step-artifacts.mjs");

test("legacy step artifact enrichment adds eligible step files and skips large intermediates", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "legacy-step-enrichment-"));
  const workspaceRoot = path.join(root, "workspace");
  const stepRoot = path.join(workspaceRoot, "experiment_001");
  fs.mkdirSync(path.join(stepRoot, "figures"), { recursive: true });
  fs.mkdirSync(path.join(stepRoot, "results"), { recursive: true });

  writeFile(path.join(stepRoot, "LOG.md"), "# Log\n");
  writeFile(path.join(stepRoot, "summary.md"), "# Summary\n");
  writeFile(path.join(stepRoot, "results", "table.csv"), "a,b\n1,2\n");
  writeFile(path.join(stepRoot, "results", "large.csv"), "a".repeat(20));
  writeFile(path.join(stepRoot, "figures", "small.png"), Buffer.from([0x89, 0x50, 0x4e, 0x47]));
  writeFile(path.join(stepRoot, "figures", "large.png"), Buffer.alloc(20, "x"));
  writeFile(path.join(stepRoot, "raw.npy"), Buffer.from([1, 2, 3]));

  const manifestPath = path.join(root, "legacy-group.import.v1.json");
  fs.writeFileSync(manifestPath, `${JSON.stringify(groupManifest(workspaceRoot), null, 2)}\n`, "utf8");

  const dryRun = runEnrichment([
    "--manifest",
    manifestPath,
    "--workspace-root",
    workspaceRoot,
    "--threshold-bytes",
    "10",
    "--image-max-bytes",
    "10",
  ]);
  assert.equal(dryRun.status, 0, dryRun.stdout + dryRun.stderr);
  assert.match(dryRun.stdout, /added=3/);
  assert.equal(JSON.parse(fs.readFileSync(manifestPath, "utf8")).researchSteps[0].artifacts.length, 1);

  const apply = runEnrichment([
    "--manifest",
    manifestPath,
    "--workspace-root",
    workspaceRoot,
    "--threshold-bytes",
    "10",
    "--image-max-bytes",
    "10",
    "--apply",
  ]);
  assert.equal(apply.status, 0, apply.stdout + apply.stderr);

  const enriched = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as LegacyGroupWorkspaceManifest;
  const artifactPaths = enriched.researchSteps[0]?.artifacts.map((artifact) => artifact.sourceRelativePath).sort();
  assert.deepEqual(artifactPaths, [
    "experiment_001/LOG.md",
    "experiment_001/figures/small.png",
    "experiment_001/results/table.csv",
    "experiment_001/summary.md",
  ]);
  assert.equal(enriched.researchSteps[0]?.artifacts.find((artifact) => artifact.sourceRelativePath.endsWith("table.csv"))?.role, "table_asset");
  assert.equal(enriched.researchSteps[0]?.artifacts.find((artifact) => artifact.sourceRelativePath.endsWith("small.png"))?.role, "figure_asset");
});

test("legacy step artifact enrichment resolves artifacts manifests relative to the step root first", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "legacy-step-enrichment-manifest-"));
  const workspaceRoot = path.join(root, "workspace");
  const stepRoot = path.join(workspaceRoot, "experiment_001");
  const manifestPath = path.join(root, "legacy-group.import.v1.json");

  writeFile(path.join(stepRoot, "LOG.md"), "# Log\n");
  writeFile(path.join(stepRoot, "artifacts_manifest.json"), JSON.stringify([
    { path: "results/nested/from_manifest.csv" },
  ]));
  writeFile(path.join(stepRoot, "results", "nested", "from_manifest.csv"), "source,value\nstep,1\n");
  writeFile(path.join(workspaceRoot, "results", "nested", "from_manifest.csv"), "source,value\nworkspace,2\n");
  fs.writeFileSync(manifestPath, `${JSON.stringify(groupManifest(workspaceRoot), null, 2)}\n`, "utf8");

  const result = runEnrichment([
    "--manifest",
    manifestPath,
    "--workspace-root",
    workspaceRoot,
    "--apply",
  ]);
  assert.equal(result.status, 0, result.stdout + result.stderr);

  const enriched = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as LegacyGroupWorkspaceManifest;
  const artifactPaths = enriched.researchSteps[0]?.artifacts.map((artifact) => artifact.sourceRelativePath).sort();
  assert.ok(artifactPaths?.includes("experiment_001/results/nested/from_manifest.csv"));
  assert.ok(!artifactPaths?.includes("results/nested/from_manifest.csv"));
});

function runEnrichment(args: string[]) {
  return spawnSync(process.execPath, [enrichmentScript, ...args], {
    cwd: repoRoot,
    encoding: "utf8",
  });
}

function groupManifest(workspaceRoot: string): LegacyGroupWorkspaceManifest {
  const log = "# Log\n";
  return {
    kind: "legacyGroupWorkspace",
    schemaVersion: LegacyImportSchemaVersion,
    curation: {
      status: "ready",
      createdAt: "2026-05-25T00:00:00.000Z",
      updatedAt: "2026-05-25T00:00:00.000Z",
      curatedBy: "test",
      notes: [],
    },
    source: {
      absoluteWorkspacePath: workspaceRoot,
      sourceRootLabel: "test-source",
      legacyFormat: "experiments_folder",
      archivedState: "archived",
    },
    target: {
      projectSlug: "test-project",
      groupSlug: "test-group",
      groupName: "Test Group",
      groupDescription: "Test group.",
      groupTags: [],
      reportBundleSlug: "test-bundle",
      reportBundleTitle: "Test Bundle",
      reportBundleDescription: "Test bundle.",
    },
    materialization: {
      archiveIdSeed: "legacy:archive:test",
      sourceGroupIdSeed: "legacy:group:test",
      reportExperimentIdSeed: "legacy:experiment:test:report-bundle",
      reportRunIdSeed: "legacy:run:test:report-bundle",
      reportRunStepIdSeed: "legacy:run-step:test:report-bundle",
      artifactIdPrefix: "legacy:artifact:test:",
      reportBundleId: "test-bundle",
      artifactDirectory: "generatedPapersAndSummaries/test-bundle",
      datePolicy: {
        preserveSourceDates: true,
        groupCreatedAt: "2026-05-25T00:00:00.000Z",
        groupCreatedAtSource: "test",
        reportBundleStartedAt: "2026-05-25T00:00:00.000Z",
        reportBundleCompletedAt: "2026-05-25T00:00:00.000Z",
      },
    },
    eligibility: {
      status: "eligible",
      requiredPrimaryRolesPresent: true,
      requiredAssetDependenciesPresent: true,
      reasons: [],
    },
    legacyLayout: {
      oldStepTerminology: "experiments",
      canonicalStepTerminology: "research_steps",
      stepDirectoryRoots: ["experiment_001"],
      papersDirectory: "papers",
    },
    reportBundle: {
      primaryArtifacts: [],
      supportingArtifacts: [],
      startupReports: [],
      clusterReports: [],
      noveltyReports: [],
      statusReports: [],
    },
    researchSteps: [{
      stepSlug: "experiment-001",
      order: 1,
      sourceRelativePath: "experiment_001",
      canonicalRelativePath: "research_steps/experiment-001",
      name: "Experiment 001",
      description: null,
      status: "complete",
      legacyExperimentId: "experiment_001",
      tags: [],
      artifacts: [artifact("experiment_001/LOG.md", log)],
      papers: null,
      assetDependencies: null,
      notes: [],
    }],
    papers: {
      sourceRelativePath: "papers",
      status: "not_applicable",
      importMode: "skip",
      files: [],
      notes: [],
    },
    assetDependencies: {
      extractionPolicy: {
        scanArtifactRoles: [],
        includeMarkdownImages: true,
        includeHtmlImgSrc: true,
        includeLocalFileLinks: true,
        ignoreDataUris: true,
        includeOnlyReferencedAssets: true,
      },
      assets: [],
      embeddedDataUriCounts: [],
    },
    pathRewrites: [],
    importBehavior: {
      createProjectIfMissing: true,
      createGroupIfMissing: true,
      createResearchSteps: true,
      createReportBundle: true,
      copyReferencedAssets: true,
      rewriteArtifactLinks: true,
      preserveOriginalFiles: true,
    },
    validation: {
      errors: [],
      warnings: [],
      checkedAt: null,
    },
  };
}

function artifact(sourceRelativePath: string, content: string): LegacyImportArtifact {
  return {
    role: "log",
    sourceRelativePath,
    canonicalRelativePath: "research_steps/experiment-001/LOG.md",
    title: "Log",
    description: null,
    mediaType: "text/markdown",
    required: true,
    featured: false,
    importAs: "supporting_artifact",
    selectionReason: "manual_include",
    clusterKey: null,
    researchStepSlug: "experiment-001",
    targetScope: "experiment",
    targetKind: "log",
    targetArtifactRole: null,
    sizeBytes: Buffer.byteLength(content),
    sourceSha256: createHash("sha256").update(content).digest("hex"),
    mtime: "2026-05-25T00:00:00.000Z",
    materializedRelativePath: "research_steps/experiment-001/LOG.md",
    materializedSizeBytes: null,
    materializedSha256: null,
    tags: [],
    notes: [],
  };
}

function writeFile(filePath: string, content: string | Buffer) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}
