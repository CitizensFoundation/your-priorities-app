import { z } from "zod";
import { type ISODateTime, type ScopeRef } from "./core.js";
import { type ExperimentStatus } from "./execution.js";
export declare const ResultsScopeTypes: readonly ["domain", "community"];
export type ResultsScopeType = (typeof ResultsScopeTypes)[number];
export declare const ResultsSections: readonly ["all", "experiments", "groups"];
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
export declare const ArtifactPdfDownloadStatuses: readonly ["queued", "running", "completed", "failed"];
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
export declare const ResultsScopeTypeSchema: z.ZodEnum<{
    domain: "domain";
    community: "community";
}>;
export declare const ResultsSectionSchema: z.ZodEnum<{
    all: "all";
    experiments: "experiments";
    groups: "groups";
}>;
export declare const ResultsScopeRefSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<{
        domain: "domain";
        community: "community";
    }>;
}, z.core.$strict>;
export declare const ResultArtifactSummarySchema: z.ZodObject<{
    artifactId: z.ZodString;
    contentType: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodString>;
    filename: z.ZodString;
    kind: z.ZodString;
    relativePath: z.ZodOptional<z.ZodString>;
    sizeBytes: z.ZodOptional<z.ZodNumber>;
    title: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const ArtifactPdfDownloadStateSchema: z.ZodObject<{
    status: z.ZodEnum<{
        failed: "failed";
        completed: "completed";
        running: "running";
        queued: "queued";
    }>;
    errorCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    filename: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sizeBytes: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, z.core.$strict>;
export declare const RecentExperimentResultSchema: z.ZodObject<{
    artifactIncludeIds: z.ZodArray<z.ZodString>;
    canRegenerateInfographic: z.ZodOptional<z.ZodBoolean>;
    canManageInfographic: z.ZodOptional<z.ZodBoolean>;
    experimentId: z.ZodString;
    experimentName: z.ZodString;
    experimentStatus: z.ZodEnum<{
        active: "active";
        completed: "completed";
        paused: "paused";
        draft: "draft";
        archived: "archived";
    }>;
    groupDescription: z.ZodNullable<z.ZodString>;
    groupId: z.ZodNumber;
    groupImageUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    groupName: z.ZodString;
    infographicJobId: z.ZodOptional<z.ZodString>;
    partId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    reportBundleId: z.ZodString;
    reportUpdatedAt: z.ZodString;
    detailedArtifactId: z.ZodOptional<z.ZodString>;
    preprintArtifactId: z.ZodOptional<z.ZodString>;
    simpleArtifactId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const RecentGroupResultSchema: z.ZodObject<{
    artifacts: z.ZodArray<z.ZodObject<{
        artifactId: z.ZodString;
        contentType: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodOptional<z.ZodString>;
        filename: z.ZodString;
        kind: z.ZodString;
        relativePath: z.ZodOptional<z.ZodString>;
        sizeBytes: z.ZodOptional<z.ZodNumber>;
        title: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    canRegenerateInfographic: z.ZodOptional<z.ZodBoolean>;
    canManageInfographic: z.ZodOptional<z.ZodBoolean>;
    groupDescription: z.ZodNullable<z.ZodString>;
    groupId: z.ZodNumber;
    groupImageUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    groupName: z.ZodString;
    infographicJobId: z.ZodOptional<z.ZodString>;
    reviewFreshness: z.ZodOptional<z.ZodEnum<{
        stale: "stale";
        current: "current";
        historical: "historical";
    }>>;
    reviewUpdatedAt: z.ZodString;
    detailedArtifactId: z.ZodOptional<z.ZodString>;
    preprintArtifactId: z.ZodOptional<z.ZodString>;
    simpleArtifactId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const RecentExperimentResultsPageSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        artifactIncludeIds: z.ZodArray<z.ZodString>;
        canRegenerateInfographic: z.ZodOptional<z.ZodBoolean>;
        canManageInfographic: z.ZodOptional<z.ZodBoolean>;
        experimentId: z.ZodString;
        experimentName: z.ZodString;
        experimentStatus: z.ZodEnum<{
            active: "active";
            completed: "completed";
            paused: "paused";
            draft: "draft";
            archived: "archived";
        }>;
        groupDescription: z.ZodNullable<z.ZodString>;
        groupId: z.ZodNumber;
        groupImageUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        groupName: z.ZodString;
        infographicJobId: z.ZodOptional<z.ZodString>;
        partId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        reportBundleId: z.ZodString;
        reportUpdatedAt: z.ZodString;
        detailedArtifactId: z.ZodOptional<z.ZodString>;
        preprintArtifactId: z.ZodOptional<z.ZodString>;
        simpleArtifactId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    nextCursor: z.ZodNullable<z.ZodString>;
}, z.core.$strict>;
export declare const RecentGroupResultsPageSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        artifacts: z.ZodArray<z.ZodObject<{
            artifactId: z.ZodString;
            contentType: z.ZodOptional<z.ZodString>;
            createdAt: z.ZodOptional<z.ZodString>;
            filename: z.ZodString;
            kind: z.ZodString;
            relativePath: z.ZodOptional<z.ZodString>;
            sizeBytes: z.ZodOptional<z.ZodNumber>;
            title: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        canRegenerateInfographic: z.ZodOptional<z.ZodBoolean>;
        canManageInfographic: z.ZodOptional<z.ZodBoolean>;
        groupDescription: z.ZodNullable<z.ZodString>;
        groupId: z.ZodNumber;
        groupImageUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        groupName: z.ZodString;
        infographicJobId: z.ZodOptional<z.ZodString>;
        reviewFreshness: z.ZodOptional<z.ZodEnum<{
            stale: "stale";
            current: "current";
            historical: "historical";
        }>>;
        reviewUpdatedAt: z.ZodString;
        detailedArtifactId: z.ZodOptional<z.ZodString>;
        preprintArtifactId: z.ZodOptional<z.ZodString>;
        simpleArtifactId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    nextCursor: z.ZodNullable<z.ZodString>;
    totalCount: z.ZodNumber;
}, z.core.$strict>;
export declare const ResultsScopeSnapshotSchema: z.ZodObject<{
    scope: z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<{
            domain: "domain";
            community: "community";
        }>;
    }, z.core.$strict>;
    generatedAt: z.ZodString;
    recentExperiments: z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            artifactIncludeIds: z.ZodArray<z.ZodString>;
            canRegenerateInfographic: z.ZodOptional<z.ZodBoolean>;
            canManageInfographic: z.ZodOptional<z.ZodBoolean>;
            experimentId: z.ZodString;
            experimentName: z.ZodString;
            experimentStatus: z.ZodEnum<{
                active: "active";
                completed: "completed";
                paused: "paused";
                draft: "draft";
                archived: "archived";
            }>;
            groupDescription: z.ZodNullable<z.ZodString>;
            groupId: z.ZodNumber;
            groupImageUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            groupName: z.ZodString;
            infographicJobId: z.ZodOptional<z.ZodString>;
            partId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            reportBundleId: z.ZodString;
            reportUpdatedAt: z.ZodString;
            detailedArtifactId: z.ZodOptional<z.ZodString>;
            preprintArtifactId: z.ZodOptional<z.ZodString>;
            simpleArtifactId: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        nextCursor: z.ZodNullable<z.ZodString>;
    }, z.core.$strict>;
    recentGroups: z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            artifacts: z.ZodArray<z.ZodObject<{
                artifactId: z.ZodString;
                contentType: z.ZodOptional<z.ZodString>;
                createdAt: z.ZodOptional<z.ZodString>;
                filename: z.ZodString;
                kind: z.ZodString;
                relativePath: z.ZodOptional<z.ZodString>;
                sizeBytes: z.ZodOptional<z.ZodNumber>;
                title: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
            canRegenerateInfographic: z.ZodOptional<z.ZodBoolean>;
            canManageInfographic: z.ZodOptional<z.ZodBoolean>;
            groupDescription: z.ZodNullable<z.ZodString>;
            groupId: z.ZodNumber;
            groupImageUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            groupName: z.ZodString;
            infographicJobId: z.ZodOptional<z.ZodString>;
            reviewFreshness: z.ZodOptional<z.ZodEnum<{
                stale: "stale";
                current: "current";
                historical: "historical";
            }>>;
            reviewUpdatedAt: z.ZodString;
            detailedArtifactId: z.ZodOptional<z.ZodString>;
            preprintArtifactId: z.ZodOptional<z.ZodString>;
            simpleArtifactId: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        nextCursor: z.ZodNullable<z.ZodString>;
        totalCount: z.ZodNumber;
    }, z.core.$strict>;
}, z.core.$strict>;
