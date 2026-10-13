import assert from "node:assert/strict";
import test from "node:test";
import {
  GroupArchiveCommitResultSchema,
  GroupArchiveJobSchema,
  GroupArchiveManifestSchema,
  GroupArchivePreviewResultSchema,
  GroupArchiveSchemaVersion,
} from "../../groupArchive.js";

test("group archive manifest schema accepts portable v2 manifests", () => {
  const manifest = GroupArchiveManifestSchema.parse({
    schemaVersion: GroupArchiveSchemaVersion,
    archiveId: "archive-id",
    exportedAt: "2026-05-25T00:00:00.000Z",
    source: {
      groupId: 42,
      groupName: "Cardio experiments",
      communityId: 7,
      domainId: 3,
    },
    exportOptions: {
      includeSensitiveHistory: true,
      includeArtifactBytes: true,
      artifactByteMode: "all_resolvable",
    },
    rowCounts: {
      group: 1,
      experiments: 2,
    },
    artifactCounts: {
      total: 1,
      included: 1,
      unavailable: 0,
      bytesIncluded: 12,
    },
    checksums: {
      "records/group.json": "a".repeat(64),
    },
    redactions: {
      agentAuthProfileSecretRef: 1,
    },
  });

  assert.equal(manifest.schemaVersion, GroupArchiveSchemaVersion);
  assert.equal(manifest.source.groupId, 42);
});

test("group archive manifest schema rejects pre-cutover v1 archives", () => {
  const parsed = GroupArchiveManifestSchema.safeParse({
    schemaVersion: "yp-live-workflow.group_archive.v1",
    archiveId: "archive-id",
    exportedAt: "2026-05-25T00:00:00.000Z",
    source: {
      groupId: 42,
      groupName: "Cardio experiments",
      communityId: 7,
      domainId: 3,
    },
    exportOptions: {
      includeSensitiveHistory: true,
      includeArtifactBytes: true,
      artifactByteMode: "all_resolvable",
    },
    rowCounts: { group: 1 },
    artifactCounts: {
      total: 0,
      included: 0,
      unavailable: 0,
      bytesIncluded: 0,
    },
    checksums: {},
    redactions: {},
  });

  assert.equal(parsed.success, false);
});

test("group archive commit result schema captures imported group reports", () => {
  const result = GroupArchiveCommitResultSchema.parse({
    archiveId: "archive-id",
    targetGroupId: 99,
    targetCommunityId: 70,
    targetDomainId: 30,
    reportArtifactId: "report-artifact-id",
    createdCounts: {
      experiments: 1,
      artifacts: 2,
    },
    skippedCounts: {
      usageRollups: 1,
    },
    artifactImportCounts: {
      imported: 1,
      unavailable: 0,
      bytesImported: 11,
    },
    idMaps: {
      experiments: {
        "source-experiment-id": "target-experiment-id",
      },
    },
    report: {
      items: [{
        kind: "created",
        recordType: "experiments",
        sourceId: "source-experiment-id",
        targetId: "target-experiment-id",
        message: "Created experiment.",
      }],
      warnings: [],
      blockers: [],
    },
  });

  assert.equal(result.targetGroupId, 99);
  assert.equal(result.idMaps.experiments?.["source-experiment-id"], "target-experiment-id");
});

test("group archive job and preview schemas capture phase 1 API payloads", () => {
  const preview = GroupArchivePreviewResultSchema.parse({
    schemaVersion: GroupArchiveSchemaVersion,
    archiveId: "archive-id",
    source: {
      groupId: 42,
      groupName: "Cardio experiments",
      communityId: 7,
      domainId: 3,
    },
    target: {
      communityId: 70,
      domainId: 30,
    },
    rowCounts: {
      group: 1,
    },
    artifactCounts: {
      total: 1,
      included: 0,
      unavailable: 1,
      bytesIncluded: 0,
    },
    redactions: {},
    artifactStatuses: [{
      artifactId: "artifact-id",
      path: "papers/input.pdf",
      contentStatus: "unavailable",
      reason: "missing bytes",
    }],
    warnings: ["Some artifact bytes are unavailable in this archive."],
    blockers: [],
    wouldCreate: {
      group: true,
      activeIds: "new",
    },
  });

  const job = GroupArchiveJobSchema.parse({
    id: "job-id",
    kind: "import_preview",
    status: "completed",
    targetCommunityId: 70,
    requestPayload: {
      filename: "group.zip",
    },
    resultPayload: preview,
    errorPayload: null,
    artifactFilename: "group.zip",
    requestedByUserId: 13,
    startedAt: "2026-05-25T00:00:00.000Z",
    finishedAt: "2026-05-25T00:00:01.000Z",
    createdAt: "2026-05-25T00:00:00.000Z",
    updatedAt: "2026-05-25T00:00:01.000Z",
  });

  assert.equal(job.kind, "import_preview");
  assert.equal(job.status, "completed");
  assert.equal(preview.wouldCreate.activeIds, "new");
});
