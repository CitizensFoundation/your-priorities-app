import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { LegacyImportSchemaVersion, type LegacyImportArtifact } from "../../legacyImport.js";

const testFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(testFile), "../../../../..");
const validatorScript = path.join(repoRoot, "scripts", "validate-legacy-import.mjs");

function makeTempWorkspace() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "legacy-import-validator-"));
  const sourceRoot = path.join(root, "source");
  const groupRoot = path.join(sourceRoot, "groupA");
  fs.mkdirSync(groupRoot, { recursive: true });
  fs.mkdirSync(path.join(groupRoot, "papers"));
  return { root, sourceRoot, groupRoot };
}

function writeFile(filePath: string, content: string | Buffer) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function sha256(content: string | Buffer) {
  return createHash("sha256").update(content).digest("hex");
}

function artifact(
  role: LegacyImportArtifact["role"],
  sourceRelativePath: string,
  content: string | Buffer | null,
  overrides: Partial<LegacyImportArtifact> = {},
): LegacyImportArtifact {
  const targetArtifactRole = role === "paper_draft"
    ? "paper_draft"
    : role === "paper_distill"
      ? "paper_distill"
      : role === "paper_lay_summary"
        ? "paper_lay_summary"
        : role === "status_overview"
          ? "paper_status_overview"
          : role === "status_research_steps_clusters"
            ? "paper_cluster_index"
            : role === "status_cluster_full_report"
              ? "paper_cluster_full_report"
              : role === "status_cluster_novelty_report"
                ? "paper_cluster_novelty_report"
                : null;
  const isReportArtifact = targetArtifactRole !== null;

  return {
    role,
    sourceRelativePath,
    canonicalRelativePath: sourceRelativePath,
    title: null,
    description: null,
    mediaType: sourceRelativePath.endsWith(".html") ? "text/html" : "text/markdown",
    required: true,
    featured: false,
    importAs: role.startsWith("paper_") ? "report_artifact" : "supporting_artifact",
    selectionReason: role.startsWith("paper_") ? "required_primary_output" : "manual_include",
    clusterKey: null,
    researchStepSlug: null,
    targetScope: isReportArtifact ? "run_step" : "group",
    targetKind: isReportArtifact ? "report" : "legacy_supporting_artifact",
    targetArtifactRole,
    sizeBytes: content === null ? null : Buffer.byteLength(content),
    sourceSha256: content === null ? null : sha256(content),
    mtime: "2026-05-25T00:00:00.000Z",
    materializedRelativePath: isReportArtifact
      ? `generatedPapersAndSummaries/test-bundle/${sourceRelativePath}`
      : sourceRelativePath,
    materializedSizeBytes: null,
    materializedSha256: null,
    tags: [],
    notes: [],
    ...overrides,
  };
}

function groupManifest(groupRoot: string, overrides: Record<string, unknown> = {}) {
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
      absoluteWorkspacePath: groupRoot,
      sourceRootLabel: "test-source",
      legacyFormat: "mixed_experiment_dirs",
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
      stepDirectoryRoots: ["."],
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
    researchSteps: [],
    papers: {
      sourceRelativePath: "papers",
      status: "empty",
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
    ...overrides,
  };
}

function masterManifest(
  sourceRoot: string,
  groupRoot: string,
  groupManifestPath: string,
  checksumPolicy = "required_before_import",
  largeFilePolicy: Record<string, unknown> = {
    thresholdBytes: 512000,
    allowedExtensions: [".md", ".markdown", ".html", ".htm", ".pdf", ".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"],
    maxBytesByExtension: {
      ".gif": 52428800,
      ".jpeg": 52428800,
      ".jpg": 52428800,
      ".png": 52428800,
      ".svg": 52428800,
      ".webp": 52428800,
    },
    blockDisallowedLargeFiles: true,
  },
) {
  return {
    kind: "legacyMasterImport",
    schemaVersion: LegacyImportSchemaVersion,
    batch: {
      slug: "test-batch",
      name: "Test Batch",
      description: "Test batch.",
      createdAt: "2026-05-25T00:00:00.000Z",
      curatedBy: "test",
      notes: [],
    },
    sourceRoots: [{
      label: "test-source",
      absolutePath: sourceRoot,
      status: "archived",
    }],
    defaults: {
      visibility: "private",
      duplicatePolicy: "fail_on_slug_collision",
      importMode: "copy_files",
      checksumPolicy,
      missingRequiredAssetPolicy: "block_import",
      largeFilePolicy,
    },
    legacyWorkspace: {
      workspaceSlug: "test-batch",
      name: "Test Batch",
      description: "Test import workspace.",
      projectImportTool: "legacy_project_import",
      projectCreatePolicy: "create_if_missing",
      groupArchiveMode: "group_archives_from_legacy_manifests",
      bundleOutputDirectory: "bundles",
    },
    projects: [{
      projectSlug: "test-project",
      name: "Test Project",
      description: "Test project.",
      tags: [],
      groups: [{
        groupSlug: "test-group",
        name: "Test Group",
        description: "Test group.",
        order: 1,
        sourceWorkspacePath: groupRoot,
        manifestPath: groupManifestPath,
        include: true,
        status: "ready",
        notes: [],
      }],
    }],
    validation: {
      errors: [],
      warnings: [],
      checkedAt: null,
    },
  };
}

function runValidator(args: string[]) {
  return spawnSync(process.execPath, [validatorScript, ...args], {
    cwd: repoRoot,
    encoding: "utf8",
  });
}

test("legacy import validator enforces master required checksum policy", () => {
  const { root, sourceRoot, groupRoot } = makeTempWorkspace();
  const paper = "# draft\n";
  writeFile(path.join(groupRoot, "draft.md"), paper);

  const groupPath = path.join(root, "group.import.json");
  const manifest = groupManifest(groupRoot, {
    reportBundle: {
      primaryArtifacts: [
        artifact("paper_draft", "draft.md", paper, { sourceSha256: null }),
      ],
      supportingArtifacts: [],
      startupReports: [],
      clusterReports: [],
      noveltyReports: [],
      statusReports: [],
    },
  });
  fs.writeFileSync(groupPath, JSON.stringify(manifest));

  const masterPath = path.join(root, "master.import.json");
  fs.writeFileSync(masterPath, JSON.stringify(masterManifest(sourceRoot, groupRoot, groupPath)));

  const result = runValidator(["--manifest", masterPath]);

  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /Missing required checksum for paper_draft artifact draft\.md/);
});

test("legacy import validator checks research-step asset dependencies", () => {
  const { root, groupRoot } = makeTempWorkspace();
  fs.mkdirSync(path.join(groupRoot, "experiment_001"));

  const groupPath = path.join(root, "group.import.json");
  const manifest = groupManifest(groupRoot, {
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
      artifacts: [],
      papers: null,
      assetDependencies: {
        extractionPolicy: {
          scanArtifactRoles: [],
          includeMarkdownImages: true,
          includeHtmlImgSrc: true,
          includeLocalFileLinks: true,
          ignoreDataUris: true,
          includeOnlyReferencedAssets: true,
        },
        assets: [{
          kind: "local_file",
          sourceRelativePath: "experiment_001/missing-step-asset.txt",
          canonicalRelativePath: "assets/missing-step-asset.txt",
          mediaType: "text/plain",
          sizeBytes: 20,
          sourceSha256: "a".repeat(64),
          mtime: null,
          targetScope: "experiment",
          targetKind: "legacy_step_asset",
          targetArtifactRole: null,
          targetImportMode: "artifact",
          materializedRelativePath: "assets/missing-step-asset.txt",
          materializedSizeBytes: null,
          materializedSha256: null,
          required: true,
          exists: true,
          referencedBy: [],
          importAs: "asset",
          notes: [],
        }],
        embeddedDataUriCounts: [],
      },
      notes: [],
    }],
  });
  fs.writeFileSync(groupPath, JSON.stringify(manifest));

  const result = runValidator(["--manifest", groupPath, "--workspace-root", groupRoot]);

  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /Missing local_file asset experiment_001\/missing-step-asset\.txt/);
});

test("legacy import validator enforces large-file policy with filesystem size", () => {
  const { root, groupRoot } = makeTempWorkspace();
  const large = Buffer.alloc(513000, "x");
  writeFile(path.join(groupRoot, "large.bin"), large);

  const groupPath = path.join(root, "group.import.json");
  const manifest = groupManifest(groupRoot, {
    reportBundle: {
      primaryArtifacts: [],
      supportingArtifacts: [],
      startupReports: [
        artifact("startup_report", "large.bin", large, {
          sizeBytes: 1,
          importAs: "reference",
          targetScope: "group",
          targetKind: "legacy_startup_artifact",
          targetArtifactRole: null,
          materializedRelativePath: "startup/large.bin",
        }),
      ],
      clusterReports: [],
      noveltyReports: [],
      statusReports: [],
    },
  });
  fs.writeFileSync(groupPath, JSON.stringify(manifest));

  const result = runValidator(["--manifest", groupPath, "--workspace-root", groupRoot]);

  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /Large source file is selected for import but extension is not allowed by policy/);
  assert.match(result.stdout, /Declared sizeBytes does not match filesystem size/);
});

test("legacy import validator rejects selected large table files", () => {
  const { root, groupRoot } = makeTempWorkspace();
  const large = Buffer.alloc(20, "x");
  writeFile(path.join(groupRoot, "large.csv"), large);

  const groupPath = path.join(root, "group.import.json");
  const manifest = groupManifest(groupRoot, {
    reportBundle: {
      primaryArtifacts: [],
      supportingArtifacts: [],
      startupReports: [
        artifact("table_asset", "large.csv", large, {
          sizeBytes: 1,
          importAs: "supporting_artifact",
          targetScope: "group",
          targetKind: "table_asset",
          targetArtifactRole: null,
          materializedRelativePath: "tables/large.csv",
        }),
      ],
      clusterReports: [],
      noveltyReports: [],
      statusReports: [],
    },
  });
  fs.writeFileSync(groupPath, JSON.stringify(manifest));

  const masterPath = path.join(root, "master.import.json");
  fs.writeFileSync(masterPath, JSON.stringify(masterManifest(
    root,
    groupRoot,
    groupPath,
    "allow_missing_until_validation",
    {
      thresholdBytes: 10,
      allowedExtensions: [".png"],
      maxBytesByExtension: { ".png": 50 },
      blockDisallowedLargeFiles: true,
    },
  )));

  const result = runValidator(["--manifest", masterPath]);

  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /Large source file is selected for import but extension is not allowed by policy/);
  assert.match(result.stdout, /large\.csv/);
});

test("legacy import validator rejects images above extension size cap", () => {
  const { root, groupRoot } = makeTempWorkspace();
  const image = Buffer.alloc(20, "x");
  writeFile(path.join(groupRoot, "large.png"), image);

  const groupPath = path.join(root, "group.import.json");
  const manifest = groupManifest(groupRoot, {
    reportBundle: {
      primaryArtifacts: [],
      supportingArtifacts: [],
      startupReports: [
        artifact("figure_asset", "large.png", image, {
          importAs: "supporting_artifact",
          mediaType: "image/png",
          targetScope: "group",
          targetKind: "figure_asset",
          targetArtifactRole: null,
          materializedRelativePath: "figures/large.png",
        }),
      ],
      clusterReports: [],
      noveltyReports: [],
      statusReports: [],
    },
  });
  fs.writeFileSync(groupPath, JSON.stringify(manifest));

  const masterPath = path.join(root, "master.import.json");
  fs.writeFileSync(masterPath, JSON.stringify(masterManifest(
    root,
    groupRoot,
    groupPath,
    "allow_missing_until_validation",
    {
      thresholdBytes: 10,
      allowedExtensions: [".png"],
      maxBytesByExtension: { ".png": 15 },
      blockDisallowedLargeFiles: true,
    },
  )));

  const result = runValidator(["--manifest", masterPath]);

  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /Large source file exceeds extension size cap/);
  assert.match(result.stdout, /large\.png/);
});

test("legacy import validator rejects non-report primary artifacts", () => {
  const { root, groupRoot } = makeTempWorkspace();
  const content = "# startup\n";
  writeFile(path.join(groupRoot, "startup.md"), content);

  const groupPath = path.join(root, "group.import.json");
  const manifest = groupManifest(groupRoot, {
    reportBundle: {
      primaryArtifacts: [
        artifact("startup_report", "startup.md", content, {
          importAs: "reference",
          targetScope: "group",
          targetKind: "legacy_startup_artifact",
          targetArtifactRole: null,
          materializedRelativePath: "startup/startup.md",
        }),
      ],
      supportingArtifacts: [],
      startupReports: [],
      clusterReports: [],
      noveltyReports: [],
      statusReports: [],
    },
  });
  fs.writeFileSync(groupPath, JSON.stringify(manifest));

  const result = runValidator(["--manifest", groupPath, "--workspace-root", groupRoot]);

  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /reportBundle\.primaryArtifacts artifact is not a report-bundle output role/);
});
