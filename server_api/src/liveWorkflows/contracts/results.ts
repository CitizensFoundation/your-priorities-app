import { z } from "zod";
import {
  ISODateTimeSchema,
  ScopeRefSchema,
  type ISODateTime,
  type ScopeRef,
} from "./core.js";
import { ExperimentStatusSchema, type ExperimentStatus } from "./execution.js";

export const ResultsScopeTypes = ["domain", "community"] as const;
export type ResultsScopeType = (typeof ResultsScopeTypes)[number];

export const ResultsSections = ["all", "experiments", "groups"] as const;
export type ResultsSection = (typeof ResultsSections)[number];

export interface ResultArtifactSummary {
  artifactId: string;
  contentType?: string;
  createdAt?: ISODateTime;
  filename: string;
  kind: string;
  relativePath?: string;
  sizeBytes?: number;
  title?: string;
}

export interface ResultReportLinks {
  detailedArtifactId?: string;
  preprintArtifactId?: string;
  simpleArtifactId?: string;
}

export const ArtifactPdfDownloadStatuses = ["queued", "running", "completed", "failed"] as const;
export type ArtifactPdfDownloadStatus = (typeof ArtifactPdfDownloadStatuses)[number];

export interface ArtifactPdfDownloadState {
  status: ArtifactPdfDownloadStatus;
  errorCode?: string | null;
  filename?: string | null;
  sizeBytes?: number | null;
}

export interface ArtifactPdfJobResult {
  pdfDownload: ArtifactPdfDownloadState;
}

export interface RecentExperimentResult extends ResultReportLinks {
  artifactIncludeIds: string[];
  canRegenerateInfographic?: boolean;
  canManageInfographic?: boolean;
  experimentId: string;
  experimentName: string;
  experimentStatus: ExperimentStatus;
  groupDescription: string | null;
  groupId: number;
  groupImageUrl?: string | null;
  groupName: string;
  infographicJobId?: string;
  partId?: string | null;
  reportBundleId: string;
  reportUpdatedAt: ISODateTime;
}

export interface RecentGroupResult extends ResultReportLinks {
  artifacts: ResultArtifactSummary[];
  canRegenerateInfographic?: boolean;
  canManageInfographic?: boolean;
  groupDescription: string | null;
  groupId: number;
  groupImageUrl?: string | null;
  groupName: string;
  infographicJobId?: string;
  reviewFreshness?: "current" | "historical" | "stale";
  reviewUpdatedAt: ISODateTime;
}

export interface ResultsPage<T> {
  items: T[];
  nextCursor: string | null;
}

export interface CountedResultsPage<T> extends ResultsPage<T> {
  totalCount: number;
}

export interface ResultsScopeRef extends Omit<ScopeRef, "type"> {
  type: ResultsScopeType;
}

export interface ResultsScopeSnapshot {
  scope: ResultsScopeRef;
  generatedAt: ISODateTime;
  recentExperiments: ResultsPage<RecentExperimentResult>;
  recentGroups: CountedResultsPage<RecentGroupResult>;
}

export const ResultsScopeTypeSchema = z.enum(ResultsScopeTypes);
export const ResultsSectionSchema = z.enum(ResultsSections);
export const ResultsScopeRefSchema = ScopeRefSchema
  .extend({ type: ResultsScopeTypeSchema })
  .strict() satisfies z.ZodType<ResultsScopeRef>;

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
  .strict() satisfies z.ZodType<ResultArtifactSummary>;

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
  .strict() satisfies z.ZodType<ArtifactPdfDownloadState>;

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
  .strict() satisfies z.ZodType<RecentExperimentResult>;

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
  .strict() satisfies z.ZodType<RecentGroupResult>;

export const RecentExperimentResultsPageSchema = z
  .object({
    items: RecentExperimentResultSchema.array(),
    nextCursor: z.string().nullable(),
  })
  .strict() satisfies z.ZodType<ResultsPage<RecentExperimentResult>>;

export const RecentGroupResultsPageSchema = z
  .object({
    items: RecentGroupResultSchema.array(),
    nextCursor: z.string().nullable(),
    totalCount: z.number().int().nonnegative(),
  })
  .strict() satisfies z.ZodType<CountedResultsPage<RecentGroupResult>>;

export const ResultsScopeSnapshotSchema = z
  .object({
    scope: ResultsScopeRefSchema,
    generatedAt: ISODateTimeSchema,
    recentExperiments: RecentExperimentResultsPageSchema,
    recentGroups: RecentGroupResultsPageSchema,
  })
  .strict() satisfies z.ZodType<ResultsScopeSnapshot>;
