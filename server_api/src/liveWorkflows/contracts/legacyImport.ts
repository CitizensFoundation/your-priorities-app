import { z } from "zod";
import { ISODateTimeSchema } from "./core.js";

export const LegacyImportSchemaVersion = "yp-live-workflow.legacy_import.v1" as const;

export const LegacyImportDocumentKinds = ["legacyMasterImport", "legacyGroupWorkspace"] as const;
export const LegacyImportSourceRootStatuses = ["archived", "active_cleanup", "unknown"] as const;
export const LegacyImportVisibilityModes = ["private", "internal"] as const;
export const LegacyImportDuplicatePolicies = ["fail_on_slug_collision", "replace_existing_import_batch"] as const;
export const LegacyImportModes = ["copy_files"] as const;
export const LegacyImportChecksumPolicies = ["required_before_import", "allow_missing_until_validation"] as const;
export const LegacyImportMissingRequiredAssetPolicies = ["block_import"] as const;
export const LegacyImportGroupRefStatuses = ["ready", "needs_review", "blocked", "excluded"] as const;
export const LegacyImportCurationStatuses = ["draft", "ready", "needs_review", "blocked"] as const;
export const LegacyImportLegacyFormats = ["experiments_folder", "mixed_experiment_dirs", "research_steps_folder"] as const;
export const LegacyImportArchivedStates = ["archived"] as const;
export const LegacyImportEligibilityStatuses = ["eligible", "eligible_with_warnings", "blocked", "excluded"] as const;
export const LegacyImportOldStepTerminologies = ["experiments"] as const;
export const LegacyImportCanonicalStepTerminologies = ["research_steps"] as const;
export const LegacyImportResearchStepStatuses = ["complete", "partial", "needs_review", "excluded"] as const;
export const LegacyImportReferenceStatuses = ["present", "empty", "missing", "not_applicable"] as const;
export const LegacyImportReferenceImportModes = ["recursive_if_non_empty", "selected_files_only", "skip"] as const;
export const LegacyImportAssetKinds = ["local_image", "local_file", "external_url", "embedded_data_uri"] as const;
export const LegacyImportAssetReferenceKinds = ["markdown_image", "html_img_src", "html_link", "markdown_link"] as const;
export const LegacyImportAssetImportModes = ["asset", "external_reference", "already_embedded", "blocker"] as const;
export const LegacyImportTargetScopes = ["group", "experiment", "run_step"] as const;
export const LegacyImportAssetTargetImportModes = [
  "artifact",
  "embed_data_uri",
  "external_reference",
  "already_embedded",
  "defer_to_legacy_import_script",
  "skip",
] as const;
export const LegacyImportProjectImportTools = ["legacy_project_import"] as const;
export const LegacyImportProjectCreatePolicies = ["create_if_missing"] as const;
export const LegacyImportGroupArchiveModes = ["group_archives_from_legacy_manifests"] as const;

export const LegacyImportReportBundleTargetRoles = [
  "paper_draft",
  "paper_distill",
  "paper_lay_summary",
  "paper_status_overview",
  "paper_cluster_index",
  "paper_cluster_full_report",
  "paper_cluster_novelty_report",
] as const;

export const LegacyImportArtifactRoles = [
  "paper_draft",
  "paper_distill",
  "paper_lay_summary",
  "status_overview",
  "status_research_steps_clusters",
  "status_cluster_full_report",
  "status_cluster_novelty_report",
  "startup_report",
  "cluster_report",
  "novelty_report",
  "input_manifest",
  "dataset_manifest",
  "reference_paper",
  "figure_asset",
  "table_asset",
  "source_code",
  "notebook",
  "log",
  "other",
] as const;

export const LegacyImportArtifactImportModes = [
  "report_artifact",
  "supporting_artifact",
  "reference",
  "asset",
  "skip",
] as const;

export const LegacyImportArtifactSelectionReasons = [
  "required_primary_output",
  "latest_per_role",
  "latest_per_cluster",
  "referenced_dependency",
  "manual_include",
  "manual_exclude",
] as const;

const NonEmptyStringSchema = z.string().min(1);
const OptionalStringSchema = z.string().nullable();
const Sha256Schema = z.string().regex(/^[a-f0-9]{64}$/i);
const NullableSha256Schema = Sha256Schema.nullable();
const NullableDateTimeSchema = ISODateTimeSchema.nullable();
const NullableNonnegativeIntegerSchema = z.number().int().nonnegative().nullable();
const NonnegativeIntegerSchema = z.number().int().nonnegative();

export const LegacyImportValidationSchema = z
  .object({
    errors: z.array(z.string()),
    warnings: z.array(z.string()),
    checkedAt: NullableDateTimeSchema,
  })
  .strict();

export const LegacyImportLargeFilePolicySchema = z
  .object({
    thresholdBytes: NonnegativeIntegerSchema,
    allowedExtensions: z.array(NonEmptyStringSchema),
    maxBytesByExtension: z.record(NonEmptyStringSchema, NonnegativeIntegerSchema).optional(),
    blockDisallowedLargeFiles: z.boolean(),
  })
  .strict();

export const LegacyImportArtifactSchema = z
  .object({
    role: z.enum(LegacyImportArtifactRoles),
    sourceRelativePath: NonEmptyStringSchema,
    canonicalRelativePath: NonEmptyStringSchema,
    title: OptionalStringSchema,
    description: OptionalStringSchema,
    mediaType: OptionalStringSchema,
    required: z.boolean(),
    featured: z.boolean(),
    importAs: z.enum(LegacyImportArtifactImportModes),
    selectionReason: z.enum(LegacyImportArtifactSelectionReasons),
    clusterKey: OptionalStringSchema,
    researchStepSlug: OptionalStringSchema,
    targetScope: z.enum(LegacyImportTargetScopes),
    targetKind: NonEmptyStringSchema,
    targetArtifactRole: z.enum(LegacyImportReportBundleTargetRoles).nullable(),
    sizeBytes: NullableNonnegativeIntegerSchema,
    sourceSha256: NullableSha256Schema,
    mtime: NullableDateTimeSchema,
    materializedRelativePath: OptionalStringSchema,
    materializedSizeBytes: NullableNonnegativeIntegerSchema,
    materializedSha256: NullableSha256Schema,
    tags: z.array(z.string()),
    notes: z.array(z.string()),
  })
  .strict();

export const LegacyImportReferenceCollectionSchema = z
  .object({
    sourceRelativePath: NonEmptyStringSchema,
    status: z.enum(LegacyImportReferenceStatuses),
    importMode: z.enum(LegacyImportReferenceImportModes),
    files: z.array(LegacyImportArtifactSchema),
    notes: z.array(z.string()),
  })
  .strict();

export const LegacyImportAssetReferenceSchema = z
  .object({
    artifactSourceRelativePath: NonEmptyStringSchema,
    artifactRole: z.enum(LegacyImportArtifactRoles),
    referenceKind: z.enum(LegacyImportAssetReferenceKinds),
    originalReference: NonEmptyStringSchema,
  })
  .strict();

export const LegacyImportAssetDependencySchema = z
  .object({
    kind: z.enum(LegacyImportAssetKinds),
    sourceRelativePath: OptionalStringSchema,
    canonicalRelativePath: OptionalStringSchema,
    mediaType: OptionalStringSchema,
    sizeBytes: NullableNonnegativeIntegerSchema,
    sourceSha256: NullableSha256Schema,
    mtime: NullableDateTimeSchema,
    targetScope: z.enum(LegacyImportTargetScopes),
    targetKind: NonEmptyStringSchema,
    targetArtifactRole: z.enum(LegacyImportReportBundleTargetRoles).nullable(),
    targetImportMode: z.enum(LegacyImportAssetTargetImportModes),
    materializedRelativePath: OptionalStringSchema,
    materializedSizeBytes: NullableNonnegativeIntegerSchema,
    materializedSha256: NullableSha256Schema,
    required: z.boolean(),
    exists: z.boolean(),
    referencedBy: z.array(LegacyImportAssetReferenceSchema),
    importAs: z.enum(LegacyImportAssetImportModes),
    notes: z.array(z.string()),
  })
  .strict();

export const LegacyImportAssetDependencyCollectionSchema = z
  .object({
    extractionPolicy: z
      .object({
        scanArtifactRoles: z.array(z.enum(LegacyImportArtifactRoles)),
        includeMarkdownImages: z.boolean(),
        includeHtmlImgSrc: z.boolean(),
        includeLocalFileLinks: z.boolean(),
        ignoreDataUris: z.boolean(),
        includeOnlyReferencedAssets: z.boolean(),
      })
      .strict(),
    assets: z.array(LegacyImportAssetDependencySchema),
    embeddedDataUriCounts: z.array(
      z
        .object({
          artifactSourceRelativePath: NonEmptyStringSchema,
          count: z.number().int().nonnegative(),
        })
        .strict(),
    ),
  })
  .strict();

export const LegacyImportAssetPathRewriteSchema = z
  .object({
    artifactSourceRelativePath: NonEmptyStringSchema,
    from: NonEmptyStringSchema,
    to: NonEmptyStringSchema,
    required: z.boolean(),
  })
  .strict();

export const LegacyImportResearchStepSchema = z
  .object({
    stepSlug: NonEmptyStringSchema,
    order: z.number().int().nonnegative(),
    sourceRelativePath: NonEmptyStringSchema,
    canonicalRelativePath: NonEmptyStringSchema,
    name: NonEmptyStringSchema,
    description: OptionalStringSchema,
    status: z.enum(LegacyImportResearchStepStatuses),
    legacyExperimentId: OptionalStringSchema,
    tags: z.array(z.string()),
    artifacts: z.array(LegacyImportArtifactSchema),
    papers: LegacyImportReferenceCollectionSchema.nullable(),
    assetDependencies: LegacyImportAssetDependencyCollectionSchema.nullable(),
    notes: z.array(z.string()),
  })
  .strict();

export const LegacyMasterImportManifestSchema = z
  .object({
    kind: z.literal("legacyMasterImport"),
    schemaVersion: z.literal(LegacyImportSchemaVersion),
    batch: z
      .object({
        slug: NonEmptyStringSchema,
        name: NonEmptyStringSchema,
        description: NonEmptyStringSchema,
        createdAt: NullableDateTimeSchema,
        curatedBy: OptionalStringSchema,
        notes: z.array(z.string()),
      })
      .strict(),
    sourceRoots: z.array(
      z
        .object({
          label: NonEmptyStringSchema,
          absolutePath: NonEmptyStringSchema,
          status: z.enum(LegacyImportSourceRootStatuses),
        })
        .strict(),
    ),
    defaults: z
      .object({
        visibility: z.enum(LegacyImportVisibilityModes),
        duplicatePolicy: z.enum(LegacyImportDuplicatePolicies),
        importMode: z.enum(LegacyImportModes),
        checksumPolicy: z.enum(LegacyImportChecksumPolicies),
        missingRequiredAssetPolicy: z.enum(LegacyImportMissingRequiredAssetPolicies),
        largeFilePolicy: LegacyImportLargeFilePolicySchema,
      })
      .strict(),
    legacyWorkspace: z
      .object({
        workspaceSlug: NonEmptyStringSchema,
        name: NonEmptyStringSchema,
        description: NonEmptyStringSchema,
        projectImportTool: z.enum(LegacyImportProjectImportTools),
        projectCreatePolicy: z.enum(LegacyImportProjectCreatePolicies),
        groupArchiveMode: z.enum(LegacyImportGroupArchiveModes),
        bundleOutputDirectory: NonEmptyStringSchema,
      })
      .strict(),
    projects: z.array(
      z
        .object({
          projectSlug: NonEmptyStringSchema,
          name: NonEmptyStringSchema,
          description: NonEmptyStringSchema,
          tags: z.array(z.string()),
          groups: z.array(
            z
              .object({
                groupSlug: NonEmptyStringSchema,
                name: NonEmptyStringSchema,
                description: NonEmptyStringSchema,
                order: z.number().int().nonnegative(),
                sourceWorkspacePath: NonEmptyStringSchema,
                manifestPath: NonEmptyStringSchema,
                include: z.boolean(),
                status: z.enum(LegacyImportGroupRefStatuses),
                notes: z.array(z.string()),
                overrides: z
                  .object({
                    name: z.string().optional(),
                    description: z.string().optional(),
                    tags: z.array(z.string()).optional(),
                  })
                  .strict()
                  .optional(),
              })
              .strict(),
          ),
        })
        .strict(),
    ),
    validation: LegacyImportValidationSchema,
  })
  .strict();

export const LegacyGroupWorkspaceManifestSchema = z
  .object({
    kind: z.literal("legacyGroupWorkspace"),
    schemaVersion: z.literal(LegacyImportSchemaVersion),
    curation: z
      .object({
        status: z.enum(LegacyImportCurationStatuses),
        createdAt: NullableDateTimeSchema,
        updatedAt: NullableDateTimeSchema,
        curatedBy: OptionalStringSchema,
        notes: z.array(z.string()),
      })
      .strict(),
    source: z
      .object({
        absoluteWorkspacePath: NonEmptyStringSchema,
        sourceRootLabel: NonEmptyStringSchema,
        legacyFormat: z.enum(LegacyImportLegacyFormats),
        archivedState: z.enum(LegacyImportArchivedStates),
      })
      .strict(),
    target: z
      .object({
        projectSlug: NonEmptyStringSchema,
        groupSlug: NonEmptyStringSchema,
        groupName: NonEmptyStringSchema,
        groupDescription: NonEmptyStringSchema,
        groupTags: z.array(z.string()),
        reportBundleSlug: NonEmptyStringSchema,
        reportBundleTitle: NonEmptyStringSchema,
        reportBundleDescription: NonEmptyStringSchema,
      })
      .strict(),
    materialization: z
      .object({
        archiveIdSeed: NonEmptyStringSchema,
        sourceGroupIdSeed: NonEmptyStringSchema,
        reportExperimentIdSeed: NonEmptyStringSchema,
        reportRunIdSeed: NonEmptyStringSchema,
        reportRunStepIdSeed: NonEmptyStringSchema,
        artifactIdPrefix: NonEmptyStringSchema,
        reportBundleId: NonEmptyStringSchema,
        artifactDirectory: NonEmptyStringSchema,
        datePolicy: z
          .object({
            preserveSourceDates: z.boolean(),
            groupCreatedAt: NullableDateTimeSchema,
            groupCreatedAtSource: NonEmptyStringSchema,
            reportBundleStartedAt: NullableDateTimeSchema,
            reportBundleCompletedAt: NullableDateTimeSchema,
          })
          .strict(),
      })
      .strict(),
    eligibility: z
      .object({
        status: z.enum(LegacyImportEligibilityStatuses),
        requiredPrimaryRolesPresent: z.boolean(),
        requiredAssetDependenciesPresent: z.boolean(),
        reasons: z.array(z.string()),
      })
      .strict(),
    legacyLayout: z
      .object({
        oldStepTerminology: z.enum(LegacyImportOldStepTerminologies),
        canonicalStepTerminology: z.enum(LegacyImportCanonicalStepTerminologies),
        stepDirectoryRoots: z.array(NonEmptyStringSchema),
        papersDirectory: NonEmptyStringSchema,
      })
      .strict(),
    reportBundle: z
      .object({
        primaryArtifacts: z.array(LegacyImportArtifactSchema),
        supportingArtifacts: z.array(LegacyImportArtifactSchema),
        startupReports: z.array(LegacyImportArtifactSchema),
        clusterReports: z.array(LegacyImportArtifactSchema),
        noveltyReports: z.array(LegacyImportArtifactSchema),
        statusReports: z.array(LegacyImportArtifactSchema),
      })
      .strict(),
    researchSteps: z.array(LegacyImportResearchStepSchema),
    papers: LegacyImportReferenceCollectionSchema,
    assetDependencies: LegacyImportAssetDependencyCollectionSchema,
    pathRewrites: z.array(LegacyImportAssetPathRewriteSchema),
    importBehavior: z
      .object({
        createProjectIfMissing: z.boolean(),
        createGroupIfMissing: z.boolean(),
        createResearchSteps: z.boolean(),
        createReportBundle: z.boolean(),
        copyReferencedAssets: z.boolean(),
        rewriteArtifactLinks: z.boolean(),
        preserveOriginalFiles: z.boolean(),
      })
      .strict(),
    validation: LegacyImportValidationSchema,
  })
  .strict();

export const LegacyImportDocumentSchema = z.discriminatedUnion("kind", [
  LegacyMasterImportManifestSchema,
  LegacyGroupWorkspaceManifestSchema,
]);

export type LegacyImportDocumentKind = (typeof LegacyImportDocumentKinds)[number];
export type LegacyImportArtifactRole = (typeof LegacyImportArtifactRoles)[number];
export type LegacyImportReportBundleTargetRole = (typeof LegacyImportReportBundleTargetRoles)[number];
export type LegacyImportLargeFilePolicy = z.infer<typeof LegacyImportLargeFilePolicySchema>;
export type LegacyImportArtifact = z.infer<typeof LegacyImportArtifactSchema>;
export type LegacyImportReferenceCollection = z.infer<typeof LegacyImportReferenceCollectionSchema>;
export type LegacyImportAssetDependency = z.infer<typeof LegacyImportAssetDependencySchema>;
export type LegacyImportAssetDependencyCollection = z.infer<typeof LegacyImportAssetDependencyCollectionSchema>;
export type LegacyImportAssetPathRewrite = z.infer<typeof LegacyImportAssetPathRewriteSchema>;
export type LegacyImportResearchStep = z.infer<typeof LegacyImportResearchStepSchema>;
export type LegacyMasterImportManifest = z.infer<typeof LegacyMasterImportManifestSchema>;
export type LegacyGroupWorkspaceManifest = z.infer<typeof LegacyGroupWorkspaceManifestSchema>;
export type LegacyImportDocument = z.infer<typeof LegacyImportDocumentSchema>;
