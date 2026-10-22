import { z } from "zod";
import {
  ISODateTimeSchema,
  JsonSchema,
  UUIDSchema,
  type ISODateTime,
  type Json,
  type UUID,
} from "./core.js";

export const GroupArchiveSchemaVersion = "yp-live-workflow.group_archive.v2" as const;

export const GroupArchiveJobKinds = ["export", "import_preview"] as const;
export type GroupArchiveJobKind = (typeof GroupArchiveJobKinds)[number];

export const GroupArchiveJobStatuses = ["queued", "running", "completed", "failed", "cancelled"] as const;
export type GroupArchiveJobStatus = (typeof GroupArchiveJobStatuses)[number];

export const GroupArchiveArtifactByteModes = ["all_resolvable", "none"] as const;
export type GroupArchiveArtifactByteMode = (typeof GroupArchiveArtifactByteModes)[number];

export interface GroupArchiveExportOptions {
  includeSensitiveHistory: boolean;
  includeArtifactBytes: boolean;
  artifactByteMode: GroupArchiveArtifactByteMode;
}

export interface GroupArchiveArtifactStatus {
  artifactId: UUID;
  path: string;
  contentStatus: "included" | "unavailable";
  sizeBytes?: number | null;
  checksumSha256?: string | null;
  reason?: string | null;
}

export interface GroupArchiveManifest {
  schemaVersion: typeof GroupArchiveSchemaVersion;
  archiveId: UUID;
  exportedAt: ISODateTime;
  source: {
    groupId: number;
    groupName?: string | null;
    communityId?: number | null;
    domainId?: number | null;
  };
  exportOptions: GroupArchiveExportOptions;
  rowCounts: Record<string, number>;
  artifactCounts: {
    total: number;
    included: number;
    unavailable: number;
    bytesIncluded: number;
  };
  checksums: Record<string, string>;
  redactions: Record<string, number>;
}

export interface GroupArchivePreviewResult {
  schemaVersion: typeof GroupArchiveSchemaVersion;
  archiveId: UUID;
  source: GroupArchiveManifest["source"];
  target: {
    communityId: number;
    domainId?: number | null;
  };
  rowCounts: Record<string, number>;
  artifactCounts: GroupArchiveManifest["artifactCounts"];
  redactions: Record<string, number>;
  artifactStatuses: GroupArchiveArtifactStatus[];
  warnings: string[];
  blockers: string[];
  wouldCreate: {
    group: boolean;
    activeIds: "new";
  };
}

export interface GroupArchiveImportReportItem {
  kind: "created" | "rewritten" | "skipped" | "placeholder" | "warning" | "blocker";
  recordType: string;
  sourceId?: string | null;
  targetId?: string | null;
  message: string;
}

export interface GroupArchiveCommitResult {
  archiveId: UUID;
  targetGroupId: number;
  targetCommunityId: number;
  targetDomainId?: number | null;
  reportArtifactId?: UUID | null;
  createdCounts: Record<string, number>;
  skippedCounts: Record<string, number>;
  artifactImportCounts: {
    imported: number;
    unavailable: number;
    bytesImported: number;
  };
  idMaps: Record<string, Record<string, string>>;
  report: {
    items: GroupArchiveImportReportItem[];
    warnings: string[];
    blockers: string[];
  };
}

export interface GroupArchiveJob {
  id: UUID;
  kind: GroupArchiveJobKind | string;
  status: GroupArchiveJobStatus | string;
  sourceGroupId?: number | null;
  targetCommunityId?: number | null;
  requestPayload: Record<string, Json>;
  resultPayload?: Record<string, Json> | null;
  errorPayload?: Record<string, Json> | null;
  artifactFilename?: string | null;
  startedAt?: ISODateTime | null;
  finishedAt?: ISODateTime | null;
  requestedByUserId?: number | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export const GroupArchiveExportOptionsSchema = z
  .object({
    includeSensitiveHistory: z.boolean().default(true),
    includeArtifactBytes: z.boolean().default(true),
    artifactByteMode: z.enum(GroupArchiveArtifactByteModes).default("all_resolvable"),
  })
  .strict() satisfies z.ZodType<GroupArchiveExportOptions>;

export const GroupArchiveArtifactStatusSchema = z
  .object({
    artifactId: UUIDSchema,
    path: z.string(),
    contentStatus: z.enum(["included", "unavailable"]),
    sizeBytes: z.number().nullable().optional(),
    checksumSha256: z.string().nullable().optional(),
    reason: z.string().nullable().optional(),
  })
  .strict() satisfies z.ZodType<GroupArchiveArtifactStatus>;

export const GroupArchiveManifestSchema = z
  .object({
    schemaVersion: z.literal(GroupArchiveSchemaVersion),
    archiveId: UUIDSchema,
    exportedAt: ISODateTimeSchema,
    source: z
      .object({
        groupId: z.number().int().positive(),
        groupName: z.string().nullable().optional(),
        communityId: z.number().int().positive().nullable().optional(),
        domainId: z.number().int().positive().nullable().optional(),
      })
      .strict(),
    exportOptions: GroupArchiveExportOptionsSchema,
    rowCounts: z.record(z.string(), z.number().int().nonnegative()),
    artifactCounts: z
      .object({
        total: z.number().int().nonnegative(),
        included: z.number().int().nonnegative(),
        unavailable: z.number().int().nonnegative(),
        bytesIncluded: z.number().int().nonnegative(),
      })
      .strict(),
    checksums: z.record(z.string(), z.string().regex(/^[a-f0-9]{64}$/i)),
    redactions: z.record(z.string(), z.number().int().nonnegative()),
  })
  .strict() satisfies z.ZodType<GroupArchiveManifest>;

export const GroupArchivePreviewResultSchema = z
  .object({
    schemaVersion: z.literal(GroupArchiveSchemaVersion),
    archiveId: UUIDSchema,
    source: GroupArchiveManifestSchema.shape.source,
    target: z
      .object({
        communityId: z.number().int().positive(),
        domainId: z.number().int().positive().nullable().optional(),
      })
      .strict(),
    rowCounts: z.record(z.string(), z.number().int().nonnegative()),
    artifactCounts: GroupArchiveManifestSchema.shape.artifactCounts,
    redactions: z.record(z.string(), z.number().int().nonnegative()),
    artifactStatuses: z.array(GroupArchiveArtifactStatusSchema),
    warnings: z.array(z.string()),
    blockers: z.array(z.string()),
    wouldCreate: z
      .object({
        group: z.boolean(),
        activeIds: z.literal("new"),
      })
      .strict(),
  })
  .strict() satisfies z.ZodType<GroupArchivePreviewResult>;

export const GroupArchiveImportReportItemSchema = z
  .object({
    kind: z.enum(["created", "rewritten", "skipped", "placeholder", "warning", "blocker"]),
    recordType: z.string(),
    sourceId: z.string().nullable().optional(),
    targetId: z.string().nullable().optional(),
    message: z.string(),
  })
  .strict() satisfies z.ZodType<GroupArchiveImportReportItem>;

export const GroupArchiveCommitResultSchema = z
  .object({
    archiveId: UUIDSchema,
    targetGroupId: z.number().int().positive(),
    targetCommunityId: z.number().int().positive(),
    targetDomainId: z.number().int().positive().nullable().optional(),
    reportArtifactId: UUIDSchema.nullable().optional(),
    createdCounts: z.record(z.string(), z.number().int().nonnegative()),
    skippedCounts: z.record(z.string(), z.number().int().nonnegative()),
    artifactImportCounts: z
      .object({
        imported: z.number().int().nonnegative(),
        unavailable: z.number().int().nonnegative(),
        bytesImported: z.number().int().nonnegative(),
      })
      .strict(),
    idMaps: z.record(z.string(), z.record(z.string(), z.string())),
    report: z
      .object({
        items: z.array(GroupArchiveImportReportItemSchema),
        warnings: z.array(z.string()),
        blockers: z.array(z.string()),
      })
      .strict(),
  })
  .strict() satisfies z.ZodType<GroupArchiveCommitResult>;

export const GroupArchiveJobSchema = z
  .object({
    id: UUIDSchema,
    kind: z.string(),
    status: z.string(),
    sourceGroupId: z.number().int().positive().nullable().optional(),
    targetCommunityId: z.number().int().positive().nullable().optional(),
    requestPayload: z.record(z.string(), JsonSchema),
    resultPayload: z.record(z.string(), JsonSchema).nullable().optional(),
    errorPayload: z.record(z.string(), JsonSchema).nullable().optional(),
    artifactFilename: z.string().nullable().optional(),
    startedAt: ISODateTimeSchema.nullable().optional(),
    finishedAt: ISODateTimeSchema.nullable().optional(),
    requestedByUserId: z.number().int().positive().nullable().optional(),
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
  })
  .strict() satisfies z.ZodType<GroupArchiveJob>;
