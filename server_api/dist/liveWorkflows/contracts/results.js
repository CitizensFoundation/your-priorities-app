import { z } from "zod";
import { ISODateTimeSchema, ScopeRefSchema, } from "./core.js";
import { ExperimentStatusSchema } from "./execution.js";
export const ResultsScopeTypes = ["domain", "community"];
export const ResultsSections = ["all", "experiments", "groups"];
export const ArtifactPdfDownloadStatuses = ["queued", "running", "completed", "failed"];
export const ResultsScopeTypeSchema = z.enum(ResultsScopeTypes);
export const ResultsSectionSchema = z.enum(ResultsSections);
export const ResultsScopeRefSchema = ScopeRefSchema
    .extend({ type: ResultsScopeTypeSchema })
    .strict();
export const ResultArtifactSummarySchema = z
    .object({
    artifactId: z.string().min(1),
    contentType: z.string().optional(),
    createdAt: ISODateTimeSchema.optional(),
    filename: z.string().min(1),
    kind: z.string().min(1),
    relativePath: z.string().optional(),
    sizeBytes: z.number().int().nonnegative().optional(),
    title: z.string().optional(),
})
    .strict();
const ResultReportLinksShape = {
    detailedArtifactId: z.string().min(1).optional(),
    preprintArtifactId: z.string().min(1).optional(),
    simpleArtifactId: z.string().min(1).optional(),
};
export const ArtifactPdfDownloadStateSchema = z
    .object({
    status: z.enum(ArtifactPdfDownloadStatuses),
    errorCode: z.string().min(1).nullable().optional(),
    filename: z.string().min(1).nullable().optional(),
    sizeBytes: z.number().int().nonnegative().nullable().optional(),
})
    .strict();
export const RecentExperimentResultSchema = z
    .object({
    ...ResultReportLinksShape,
    artifactIncludeIds: z.string().min(1).array(),
    canRegenerateInfographic: z.boolean().optional(),
    canManageInfographic: z.boolean().optional(),
    experimentId: z.string().min(1),
    experimentName: z.string(),
    experimentStatus: ExperimentStatusSchema,
    groupDescription: z.string().nullable(),
    groupId: z.number().int().positive(),
    groupImageUrl: z.string().nullable().optional(),
    groupName: z.string(),
    infographicJobId: z.string().min(1).optional(),
    partId: z.string().nullable().optional(),
    reportBundleId: z.string().min(1),
    reportUpdatedAt: ISODateTimeSchema,
})
    .strict();
export const RecentGroupResultSchema = z
    .object({
    ...ResultReportLinksShape,
    artifacts: ResultArtifactSummarySchema.array(),
    canRegenerateInfographic: z.boolean().optional(),
    canManageInfographic: z.boolean().optional(),
    groupDescription: z.string().nullable(),
    groupId: z.number().int().positive(),
    groupImageUrl: z.string().nullable().optional(),
    groupName: z.string(),
    infographicJobId: z.string().min(1).optional(),
    reviewFreshness: z.enum(["current", "historical", "stale"]).optional(),
    reviewUpdatedAt: ISODateTimeSchema,
})
    .strict();
export const RecentExperimentResultsPageSchema = z
    .object({
    items: RecentExperimentResultSchema.array(),
    nextCursor: z.string().nullable(),
})
    .strict();
export const RecentGroupResultsPageSchema = z
    .object({
    items: RecentGroupResultSchema.array(),
    nextCursor: z.string().nullable(),
    totalCount: z.number().int().nonnegative(),
})
    .strict();
export const ResultsScopeSnapshotSchema = z
    .object({
    scope: ResultsScopeRefSchema,
    generatedAt: ISODateTimeSchema,
    recentExperiments: RecentExperimentResultsPageSchema,
    recentGroups: RecentGroupResultsPageSchema,
})
    .strict();
