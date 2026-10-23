import assert from "node:assert/strict";
import test from "node:test";
import { ArtifactPdfDownloadStateSchema, ResultsScopeSnapshotSchema, ResultsSectionSchema, } from "../../index.js";
const generatedAt = "2026-08-03T12:00:00.000Z";
test("results snapshots validate independent experiment and group pages", () => {
    const snapshot = ResultsScopeSnapshotSchema.parse({
        scope: { type: "domain", id: "7" },
        generatedAt,
        recentExperiments: {
            items: [{
                    artifactIncludeIds: ["full-plan", "research-plan"],
                    canManageInfographic: true,
                    canRegenerateInfographic: true,
                    detailedArtifactId: "experiment-detailed",
                    experimentId: "experiment-1",
                    experimentName: "Expression analysis",
                    experimentStatus: "completed",
                    groupDescription: "Active programme description.",
                    groupId: 11,
                    groupImageUrl: null,
                    groupName: "Active group",
                    infographicJobId: "experiment-infographic",
                    partId: "E01",
                    preprintArtifactId: "experiment-preprint",
                    reportBundleId: "bundle-1",
                    reportUpdatedAt: generatedAt,
                    simpleArtifactId: "experiment-simple",
                }],
            nextCursor: "experiment-cursor",
        },
        recentGroups: {
            items: [{
                    artifacts: [{
                            artifactId: "review-artifact",
                            filename: "GROUP_REVIEW.md",
                            kind: "paper_draft",
                        }],
                    canManageInfographic: true,
                    canRegenerateInfographic: true,
                    detailedArtifactId: "review-detailed",
                    groupDescription: "Review the completed programme.",
                    groupId: 12,
                    groupName: "Completed group",
                    infographicJobId: "review-infographic",
                    preprintArtifactId: "review-preprint",
                    reviewFreshness: "stale",
                    reviewUpdatedAt: generatedAt,
                    simpleArtifactId: "review-simple",
                }],
            nextCursor: null,
            totalCount: 1,
        },
    });
    assert.equal(snapshot.recentExperiments.items[0]?.experimentName, "Expression analysis");
    assert.equal(snapshot.recentExperiments.items[0]?.groupDescription, "Active programme description.");
    assert.equal(snapshot.recentExperiments.items[0]?.canRegenerateInfographic, true);
    assert.equal(snapshot.recentExperiments.items[0]?.canManageInfographic, true);
    assert.equal(snapshot.recentGroups.items[0]?.groupDescription, "Review the completed programme.");
    assert.equal(snapshot.recentGroups.items[0]?.canRegenerateInfographic, true);
    assert.equal(snapshot.recentGroups.items[0]?.canManageInfographic, true);
    assert.equal(snapshot.recentGroups.items[0]?.reviewFreshness, "stale");
    assert.equal(snapshot.recentGroups.totalCount, 1);
});
test("results schemas reject group scope and unknown sections", () => {
    assert.throws(() => ResultsScopeSnapshotSchema.parse({
        scope: { type: "group", id: "11" },
        generatedAt,
        recentExperiments: { items: [], nextCursor: null },
        recentGroups: { items: [], nextCursor: null, totalCount: 0 },
    }));
    assert.throws(() => ResultsSectionSchema.parse("reviews"));
});
test("report PDF state validates durable queued and completed records", () => {
    const queued = ArtifactPdfDownloadStateSchema.parse({
        filename: "preprint.pdf",
        status: "queued",
    });
    const completed = ArtifactPdfDownloadStateSchema.parse({
        filename: queued.filename,
        sizeBytes: 4096,
        status: "completed",
    });
    assert.equal(completed.sizeBytes, 4096);
    assert.throws(() => ArtifactPdfDownloadStateSchema.parse({
        queueJobId: "internal-job-id",
        status: "queued",
    }));
});
