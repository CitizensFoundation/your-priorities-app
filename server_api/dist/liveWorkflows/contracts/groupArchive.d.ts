import { z } from "zod";
import { type ISODateTime, type Json, type UUID } from "./core.js";
export declare const GroupArchiveSchemaVersion: "yp-live-workflow.group_archive.v2";
export declare const GroupArchiveJobKinds: readonly ["export", "import_preview"];
export type GroupArchiveJobKind = (typeof GroupArchiveJobKinds)[number];
export declare const GroupArchiveJobStatuses: readonly ["queued", "running", "completed", "failed", "cancelled"];
export type GroupArchiveJobStatus = (typeof GroupArchiveJobStatuses)[number];
export declare const GroupArchiveArtifactByteModes: readonly ["all_resolvable", "none"];
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
export declare const GroupArchiveExportOptionsSchema: z.ZodObject<{
    includeSensitiveHistory: z.ZodDefault<z.ZodBoolean>;
    includeArtifactBytes: z.ZodDefault<z.ZodBoolean>;
    artifactByteMode: z.ZodDefault<z.ZodEnum<{
        none: "none";
        all_resolvable: "all_resolvable";
    }>>;
}, z.core.$strict>;
export declare const GroupArchiveArtifactStatusSchema: z.ZodObject<{
    artifactId: z.ZodString;
    path: z.ZodString;
    contentStatus: z.ZodEnum<{
        unavailable: "unavailable";
        included: "included";
    }>;
    sizeBytes: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    checksumSha256: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    reason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strict>;
export declare const GroupArchiveManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<"yp-live-workflow.group_archive.v2">;
    archiveId: z.ZodString;
    exportedAt: z.ZodString;
    source: z.ZodObject<{
        groupId: z.ZodNumber;
        groupName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        communityId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        domainId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strict>;
    exportOptions: z.ZodObject<{
        includeSensitiveHistory: z.ZodDefault<z.ZodBoolean>;
        includeArtifactBytes: z.ZodDefault<z.ZodBoolean>;
        artifactByteMode: z.ZodDefault<z.ZodEnum<{
            none: "none";
            all_resolvable: "all_resolvable";
        }>>;
    }, z.core.$strict>;
    rowCounts: z.ZodRecord<z.ZodString, z.ZodNumber>;
    artifactCounts: z.ZodObject<{
        total: z.ZodNumber;
        included: z.ZodNumber;
        unavailable: z.ZodNumber;
        bytesIncluded: z.ZodNumber;
    }, z.core.$strict>;
    checksums: z.ZodRecord<z.ZodString, z.ZodString>;
    redactions: z.ZodRecord<z.ZodString, z.ZodNumber>;
}, z.core.$strict>;
export declare const GroupArchivePreviewResultSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<"yp-live-workflow.group_archive.v2">;
    archiveId: z.ZodString;
    source: z.ZodObject<{
        groupId: z.ZodNumber;
        groupName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        communityId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        domainId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strict>;
    target: z.ZodObject<{
        communityId: z.ZodNumber;
        domainId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strict>;
    rowCounts: z.ZodRecord<z.ZodString, z.ZodNumber>;
    artifactCounts: z.ZodObject<{
        total: z.ZodNumber;
        included: z.ZodNumber;
        unavailable: z.ZodNumber;
        bytesIncluded: z.ZodNumber;
    }, z.core.$strict>;
    redactions: z.ZodRecord<z.ZodString, z.ZodNumber>;
    artifactStatuses: z.ZodArray<z.ZodObject<{
        artifactId: z.ZodString;
        path: z.ZodString;
        contentStatus: z.ZodEnum<{
            unavailable: "unavailable";
            included: "included";
        }>;
        sizeBytes: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        checksumSha256: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        reason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strict>>;
    warnings: z.ZodArray<z.ZodString>;
    blockers: z.ZodArray<z.ZodString>;
    wouldCreate: z.ZodObject<{
        group: z.ZodBoolean;
        activeIds: z.ZodLiteral<"new">;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const GroupArchiveImportReportItemSchema: z.ZodObject<{
    kind: z.ZodEnum<{
        warning: "warning";
        created: "created";
        skipped: "skipped";
        rewritten: "rewritten";
        placeholder: "placeholder";
        blocker: "blocker";
    }>;
    recordType: z.ZodString;
    sourceId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    targetId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    message: z.ZodString;
}, z.core.$strict>;
export declare const GroupArchiveCommitResultSchema: z.ZodObject<{
    archiveId: z.ZodString;
    targetGroupId: z.ZodNumber;
    targetCommunityId: z.ZodNumber;
    targetDomainId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    reportArtifactId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdCounts: z.ZodRecord<z.ZodString, z.ZodNumber>;
    skippedCounts: z.ZodRecord<z.ZodString, z.ZodNumber>;
    artifactImportCounts: z.ZodObject<{
        imported: z.ZodNumber;
        unavailable: z.ZodNumber;
        bytesImported: z.ZodNumber;
    }, z.core.$strict>;
    idMaps: z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodString>>;
    report: z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            kind: z.ZodEnum<{
                warning: "warning";
                created: "created";
                skipped: "skipped";
                rewritten: "rewritten";
                placeholder: "placeholder";
                blocker: "blocker";
            }>;
            recordType: z.ZodString;
            sourceId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            targetId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            message: z.ZodString;
        }, z.core.$strict>>;
        warnings: z.ZodArray<z.ZodString>;
        blockers: z.ZodArray<z.ZodString>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const GroupArchiveJobSchema: z.ZodObject<{
    id: z.ZodString;
    kind: z.ZodString;
    status: z.ZodString;
    sourceGroupId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    targetCommunityId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    requestPayload: z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>;
    resultPayload: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>;
    errorPayload: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodType<Json, unknown, z.core.$ZodTypeInternals<Json, unknown>>>>>;
    artifactFilename: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    startedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    finishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    requestedByUserId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strict>;
