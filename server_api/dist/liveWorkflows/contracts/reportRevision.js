import { z } from "zod";
import { ISODateTimeSchema, UUIDSchema, } from "./core.js";
import { ReportBundleSchema, } from "./execution.js";
import { InfographicJobSchema, } from "./review.js";
export const ReportRevisionManifestArtifactKind = "report_revision_manifest";
export const ReportRevisionSchemaVersion = 1;
export const ReportRevisionTargetTypes = ["experiment", "group_final_review"];
export const ReportRevisionRoles = ["paper_draft", "paper_distill", "paper_lay_summary"];
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
    revisionNote: z.string().trim().min(1).max(2000),
    createdAt: ISODateTimeSchema,
}).strict();
export const ReportRevisionSchema = ReportRevisionManifestSchema.extend({
    manifestArtifactId: UUIDSchema,
}).strict();
export const CreateReportRevisionResponseSchema = z.object({
    reportRevision: ReportRevisionSchema,
    reportBundle: ReportBundleSchema,
    infographicJob: InfographicJobSchema.nullable(),
    infographicError: z.string().nullable().optional(),
    topic: z.string().nullable().optional(),
}).strict();
export function reportRevisionManifestFromMetadata(metadata) {
    const parsed = ReportRevisionManifestSchema.safeParse(metadata?.reportRevision);
    return parsed.success ? parsed.data : null;
}
export function reportRevisionMetadata(manifest) {
    return {
        artifactRole: ReportRevisionManifestArtifactKind,
        generatedBy: "manual_report_revision",
        reportBundleId: manifest.reportBundleId,
        reportRevision: manifest,
        reportRevisionId: manifest.revisionId,
    };
}
