import assert from "node:assert/strict";
import test from "node:test";
import { LegacyGroupWorkspaceManifestSchema, LegacyImportDocumentSchema, LegacyImportSchemaVersion, LegacyMasterImportManifestSchema, } from "../../legacyImport.js";
function artifact(role, sourceRelativePath) {
    const targetArtifactRole = role === "status_overview"
        ? "paper_status_overview"
        : role === "status_research_steps_clusters"
            ? "paper_cluster_index"
            : role === "status_cluster_full_report"
                ? "paper_cluster_full_report"
                : role === "status_cluster_novelty_report"
                    ? "paper_cluster_novelty_report"
                    : role;
    const isReportBundleRole = targetArtifactRole === "paper_draft" ||
        targetArtifactRole === "paper_distill" ||
        targetArtifactRole === "paper_lay_summary" ||
        targetArtifactRole === "paper_status_overview" ||
        targetArtifactRole === "paper_cluster_index" ||
        targetArtifactRole === "paper_cluster_full_report" ||
        targetArtifactRole === "paper_cluster_novelty_report";
    return {
        role,
        sourceRelativePath,
        canonicalRelativePath: sourceRelativePath,
        title: null,
        description: null,
        mediaType: sourceRelativePath.endsWith(".html") ? "text/html" : "text/markdown",
        required: true,
        featured: role === "paper_draft" || role === "paper_distill" || role === "paper_lay_summary",
        importAs: role.startsWith("paper_") ? "report_artifact" : "supporting_artifact",
        selectionReason: role.startsWith("paper_") ? "required_primary_output" : "latest_per_role",
        clusterKey: null,
        researchStepSlug: null,
        targetScope: isReportBundleRole ? "run_step" : "group",
        targetKind: isReportBundleRole ? "report" : "legacy_supporting_artifact",
        targetArtifactRole: isReportBundleRole ? targetArtifactRole : null,
        sizeBytes: 123,
        sourceSha256: "a".repeat(64),
        mtime: "2026-05-25T00:00:00.000Z",
        materializedRelativePath: isReportBundleRole ? `generatedPapersAndSummaries/test-bundle/${sourceRelativePath}` : sourceRelativePath,
        materializedSizeBytes: null,
        materializedSha256: null,
        tags: [],
        notes: [],
    };
}
test("legacy master import manifest schema accepts project and group mappings", () => {
    const manifest = LegacyMasterImportManifestSchema.parse({
        kind: "legacyMasterImport",
        schemaVersion: LegacyImportSchemaVersion,
        batch: {
            slug: "legacy-codex-import-2026-05",
            name: "Legacy Codex Import",
            description: "Hand-curated import of archived Codex research workspaces.",
            createdAt: "2026-05-25T00:00:00.000Z",
            curatedBy: "robert",
            notes: [],
        },
        sourceRoots: [{
                label: "bioice-experiments",
                absolutePath: "/mnt/bioIce1/bioIce/experiments",
                status: "archived",
            }],
        defaults: {
            visibility: "private",
            duplicatePolicy: "fail_on_slug_collision",
            importMode: "copy_files",
            checksumPolicy: "required_before_import",
            missingRequiredAssetPolicy: "block_import",
            largeFilePolicy: {
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
        },
        legacyWorkspace: {
            workspaceSlug: "legacy-codex-import-2026-05",
            name: "Legacy Codex Import",
            description: "Project-level workspace for importing archived Codex research groups.",
            projectImportTool: "legacy_project_import",
            projectCreatePolicy: "create_if_missing",
            groupArchiveMode: "group_archives_from_legacy_manifests",
            bundleOutputDirectory: "bundles",
        },
        projects: [{
                projectSlug: "breast-cancer-bioelectricity",
                name: "Breast Cancer Bioelectricity",
                description: "Legacy breast cancer research groups from archived Codex workspaces.",
                tags: ["breast-cancer", "legacy-codex"],
                groups: [{
                        groupSlug: "breast-cancer-1",
                        name: "Breast Cancer 1",
                        description: "First legacy breast cancer research group.",
                        order: 1,
                        sourceWorkspacePath: "/mnt/bioIce1/bioIce/experiments/breastCancer.1",
                        manifestPath: "legacy-manifests/breastCancer.1/legacy-group.import.v1.json",
                        include: true,
                        status: "needs_review",
                        notes: [],
                    }],
            }],
        validation: {
            errors: [],
            warnings: [],
            checkedAt: null,
        },
    });
    assert.equal(manifest.kind, "legacyMasterImport");
    assert.equal(manifest.projects[0]?.groups[0]?.groupSlug, "breast-cancer-1");
});
test("legacy group workspace manifest schema captures report artifacts, papers, and image dependencies", () => {
    const paperDraft = artifact("paper_draft", "PRE_PRINT_PAPER_DRAFT.md");
    const paperDistill = artifact("paper_distill", "PRE_PRINT_DISTILL.PUB.html");
    const laySummary = artifact("paper_lay_summary", "PRE_PRINT_DISTILL.PUB.LAYMANS.html");
    const statusOverview = artifact("status_overview", "STATUS_REPORT_OVERVIEW.md");
    const manifest = LegacyGroupWorkspaceManifestSchema.parse({
        kind: "legacyGroupWorkspace",
        schemaVersion: LegacyImportSchemaVersion,
        curation: {
            status: "draft",
            createdAt: "2026-05-25T00:00:00.000Z",
            updatedAt: "2026-05-25T00:00:00.000Z",
            curatedBy: "robert",
            notes: [],
        },
        source: {
            absoluteWorkspacePath: "/mnt/bioIce1/bioIce/experiments/breastCancer.1",
            sourceRootLabel: "bioice-experiments",
            legacyFormat: "experiments_folder",
            archivedState: "archived",
        },
        target: {
            projectSlug: "breast-cancer-bioelectricity",
            groupSlug: "breast-cancer-1",
            groupName: "Breast Cancer 1",
            groupDescription: "First legacy breast cancer research group.",
            groupTags: ["breast-cancer", "legacy-codex"],
            reportBundleSlug: "breast-cancer-1-report-bundle",
            reportBundleTitle: "Breast Cancer 1 Report Bundle",
            reportBundleDescription: "Imported legacy preprint, distill, lay summary, and supporting reports.",
        },
        materialization: {
            archiveIdSeed: "legacy:breastCancer.1",
            sourceGroupIdSeed: "legacy:group:breastCancer.1",
            reportExperimentIdSeed: "legacy:experiment:breastCancer.1:report-bundle",
            reportRunIdSeed: "legacy:run:breastCancer.1:report-bundle",
            reportRunStepIdSeed: "legacy:run-step:breastCancer.1:report-bundle",
            artifactIdPrefix: "legacy:artifact:breastCancer.1:",
            reportBundleId: "breast-cancer-1-report-bundle",
            artifactDirectory: "generatedPapersAndSummaries/breast-cancer-1-report-bundle",
            datePolicy: {
                preserveSourceDates: true,
                groupCreatedAt: "2026-05-25T00:00:00.000Z",
                groupCreatedAtSource: "earliest included legacy experiment directory mtime",
                reportBundleStartedAt: "2026-05-25T00:00:00.000Z",
                reportBundleCompletedAt: "2026-05-25T00:00:00.000Z",
            },
        },
        eligibility: {
            status: "eligible_with_warnings",
            requiredPrimaryRolesPresent: true,
            requiredAssetDependenciesPresent: true,
            reasons: ["papers/ exists but is empty"],
        },
        legacyLayout: {
            oldStepTerminology: "experiments",
            canonicalStepTerminology: "research_steps",
            stepDirectoryRoots: ["experiments"],
            papersDirectory: "papers",
        },
        reportBundle: {
            primaryArtifacts: [paperDraft, paperDistill, laySummary],
            supportingArtifacts: [statusOverview],
            startupReports: [],
            clusterReports: [],
            noveltyReports: [],
            statusReports: [statusOverview],
        },
        researchSteps: [{
                stepSlug: "experiment-003",
                order: 3,
                sourceRelativePath: "experiment_003",
                canonicalRelativePath: "research_steps/experiment-003",
                name: "Experiment 003",
                description: null,
                status: "complete",
                legacyExperimentId: "experiment_003",
                tags: [],
                artifacts: [],
                papers: null,
                assetDependencies: null,
                notes: [],
            }],
        papers: {
            sourceRelativePath: "papers",
            status: "empty",
            importMode: "recursive_if_non_empty",
            files: [],
            notes: [],
        },
        assetDependencies: {
            extractionPolicy: {
                scanArtifactRoles: ["paper_draft", "paper_distill", "paper_lay_summary", "status_overview"],
                includeMarkdownImages: true,
                includeHtmlImgSrc: true,
                includeLocalFileLinks: true,
                ignoreDataUris: true,
                includeOnlyReferencedAssets: true,
            },
            assets: [{
                    kind: "local_image",
                    sourceRelativePath: "experiment_003/figures/e03_method_matrix_overall_score.png",
                    canonicalRelativePath: "assets/experiment_003/figures/e03_method_matrix_overall_score.png",
                    mediaType: "image/png",
                    sizeBytes: 12345,
                    sourceSha256: "b".repeat(64),
                    mtime: "2026-05-25T00:00:00.000Z",
                    targetScope: "group",
                    targetKind: "figure_asset",
                    targetArtifactRole: null,
                    targetImportMode: "defer_to_legacy_import_script",
                    materializedRelativePath: "assets/experiment_003/figures/e03_method_matrix_overall_score.png",
                    materializedSizeBytes: null,
                    materializedSha256: null,
                    required: true,
                    exists: true,
                    referencedBy: [{
                            artifactSourceRelativePath: "PRE_PRINT_PAPER_DRAFT.md",
                            artifactRole: "paper_draft",
                            referenceKind: "markdown_image",
                            originalReference: "./experiment_003/figures/e03_method_matrix_overall_score.png",
                        }],
                    importAs: "asset",
                    notes: [],
                }],
            embeddedDataUriCounts: [{
                    artifactSourceRelativePath: "PRE_PRINT_DISTILL.PUB.html",
                    count: 4,
                }],
        },
        pathRewrites: [{
                artifactSourceRelativePath: "PRE_PRINT_PAPER_DRAFT.md",
                from: "./experiment_003/figures/e03_method_matrix_overall_score.png",
                to: "assets/experiment_003/figures/e03_method_matrix_overall_score.png",
                required: true,
            }],
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
            warnings: ["papers/ exists but is empty"],
            checkedAt: null,
        },
    });
    assert.equal(manifest.kind, "legacyGroupWorkspace");
    assert.equal(manifest.reportBundle.primaryArtifacts.length, 3);
    assert.equal(manifest.assetDependencies.assets[0]?.exists, true);
    assert.equal(LegacyImportDocumentSchema.parse(manifest).kind, "legacyGroupWorkspace");
});
