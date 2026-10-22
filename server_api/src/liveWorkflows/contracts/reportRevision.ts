import { z } from "zod";
import {
  ISODateTimeSchema,
  UUIDSchema,
  type ISODateTime,
  type Json,
  type UUID,
} from "./core.js";
import {
  ReportBundleSchema,
  type ReportBundle,
} from "./execution.js";
import {
  InfographicJobSchema,
  type InfographicJob,
} from "./review.js";

export const ReportRevisionManifestArtifactKind = "report_revision_manifest" as const;
export const ReportRevisionSchemaVersion = 1 as const;
export const ReportRevisionTargetTypes = ["experiment", "group_final_review"] as const;
export const ReportRevisionRoles = ["paper_draft", "paper_distill", "paper_lay_summary"] as const;

export type ReportRevisionTargetType = (typeof ReportRevisionTargetTypes)[number];
export type ReportRevisionRole = (typeof ReportRevisionRoles)[number];

export interface ReportRevisionManifest {
  schemaVersion: typeof ReportRevisionSchemaVersion;
  revisionId: UUID;
  reportBundleId: string;
  baseBundleId: string;
  rootBundleId: string;
  groupId: number;
  targetType: ReportRevisionTargetType;
  targetId: string;
  runId: UUID;
  experimentId: UUID;
  artifactIds: Record<ReportRevisionRole, UUID>;
  supportingArtifactIds: UUID[];
  replacedRoles: ReportRevisionRole[];
  authorUserId: number;
  revisionNote: string;
  createdAt: ISODateTime;
}

export interface ReportRevision extends ReportRevisionManifest {
  manifestArtifactId: UUID;
}

export interface CreateReportRevisionResponse {
  reportRevision: ReportRevision;
  reportBundle: ReportBundle;
  infographicJob: InfographicJob | null;
  infographicError?: string | null;
  topic?: string | null;
}

const ReportRevisionArtifactIdsSchema = z.object({
  paper_draft: UUIDSchema,
  paper_distill: UUIDSchema,
  paper_lay_summary: UUIDSchema,
}).strict();

export const ReportRevisionManifestSchema = z.object({
  schemaVersion: z.literal(ReportRevisionSchemaVersion),
  revisionId: UUIDSchema,
  reportBundleId: z.string().trim().min(1),
  baseBundleId: z.string().trim().min(1),
  rootBundleId: z.string().trim().min(1),
  groupId: z.number().int().positive(),
  targetType: z.enum(ReportRevisionTargetTypes),
  targetId: z.string().trim().min(1),
  runId: UUIDSchema,
  experimentId: UUIDSchema,
  artifactIds: ReportRevisionArtifactIdsSchema,
  supportingArtifactIds: z.array(UUIDSchema),
  replacedRoles: z.array(z.enum(ReportRevisionRoles)).min(1),
  authorUserId: z.number().int().positive(),
  revisionNote: z.string().trim().min(1).max(2_000),
  createdAt: ISODateTimeSchema,
}).strict() satisfies z.ZodType<ReportRevisionManifest>;

export const ReportRevisionSchema = ReportRevisionManifestSchema.extend({
  manifestArtifactId: UUIDSchema,
}).strict() satisfies z.ZodType<ReportRevision>;

export const CreateReportRevisionResponseSchema = z.object({
  reportRevision: ReportRevisionSchema,
  reportBundle: ReportBundleSchema,
  infographicJob: InfographicJobSchema.nullable(),
  infographicError: z.string().nullable().optional(),
  topic: z.string().nullable().optional(),
}).strict() satisfies z.ZodType<CreateReportRevisionResponse>;

export function reportRevisionManifestFromMetadata(
  metadata: Record<string, Json> | null | undefined
): ReportRevisionManifest | null {
  const parsed = ReportRevisionManifestSchema.safeParse(metadata?.reportRevision);
  return parsed.success ? parsed.data : null;
}

export function reportRevisionMetadata(manifest: ReportRevisionManifest): Record<string, Json> {
  return {
    artifactRole: ReportRevisionManifestArtifactKind,
    generatedBy: "manual_report_revision",
    reportBundleId: manifest.reportBundleId,
    reportRevision: manifest as unknown as Json,
    reportRevisionId: manifest.revisionId,
  };
}
