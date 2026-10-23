import assert from "node:assert/strict";
import test from "node:test";
import { GroupFinalCodexReviewSchema, GroupFinalReviewConfigurationSchema, GroupFinalReviewPromptTemplateReferencesSchema, GroupFinalReviewResultSchema, GroupFinalReviewSourceIndexSchema, GroupReviewAttributedPreprintSchema, GroupReviewPreprintCoverageSchema, PersistedGroupFinalReviewResultSchema, } from "../../index.js";
import { groupFinalReviewEditorialPromptTemplateReferencesFixture, groupFinalReviewPromptTemplateReferencesFixture, groupFinalReviewReviewerSessionStartingFixture, } from "./groupFinalReviewFixtures.js";
test("group final review configuration validates pinned runtime and reviewer settings", () => {
    const parsed = GroupFinalReviewConfigurationSchema.parse({
        authProfileId: "10000000-0000-4000-8000-000000000001",
        runtimeProfileId: "20000000-0000-4000-8000-000000000002",
        vmHostId: "30000000-0000-4000-8000-000000000003",
        reviewer: {
            model: "gpt-5.1-codex",
            modelProvider: "openai",
            reasoningEffort: "xhigh",
        },
    });
    assert.equal(parsed.reviewer?.model, "gpt-5.1-codex");
    assert.throws(() => GroupFinalReviewConfigurationSchema.parse({
        councilRoster: [{
                id: "legacy-member",
                selector: { provider: "openai", model: "gpt-test" },
            }],
    }));
    assert.throws(() => GroupFinalReviewConfigurationSchema.parse({
        modelAssignments: { "council.draft": { provider: "openai", model: "gpt-test" } },
    }));
});
test("group final Codex review requires structured findings and evidence", () => {
    const review = GroupFinalCodexReviewSchema.parse({
        version: 2,
        disposition: "caution",
        executiveSummary: "A promising result needs one data-quality caveat.",
        interestingResults: [{
                rank: 1,
                title: "Primary result",
                summary: "The primary experiment produced a reproducible signal.",
                significance: "This is the strongest candidate for the preprint.",
                evidence: [{
                        sourceKind: "preprint",
                        sourceRef: "artifact:40000000-0000-4000-8000-000000000004",
                        sourcePath: "/review-sources/experiments/e01/artifacts/result.md",
                        description: "Canonical experiment report",
                    }],
            }],
        selectedFigures: [{
                artifactId: "50000000-0000-4000-8000-000000000005",
                sourcePath: "/review-sources/experiments/e01/artifacts/chart.png",
                caption: "Primary outcome by cohort.",
                altText: "Bar chart comparing the primary outcome across cohorts.",
            }],
        blockers: [],
        dataProblems: ["One cohort has incomplete metadata."],
        contradictions: [],
        nullOrNegativeResults: [],
        missingEvidence: [],
        reproducibilityConcerns: [],
        publicationCaveats: ["Qualify the affected cohort."],
        councilInstructions: ["Preserve the caveat in the limitations section."],
        checksRun: ["Cross-experiment artifact comparison"],
    });
    assert.equal(review.interestingResults[0]?.evidence.length, 1);
    assert.equal(review.selectedFigures?.[0]?.caption, "Primary outcome by cohort.");
    assert.throws(() => GroupFinalCodexReviewSchema.parse({
        ...review,
        interestingResults: [{ ...review.interestingResults[0], evidence: [] }],
    }));
});
test("group final review source index describes mounted experiments, canonical charts, and datasets", () => {
    const index = GroupFinalReviewSourceIndexSchema.parse({
        version: 2,
        groupId: 31,
        planningJobId: "10000000-0000-4000-8000-000000000001",
        sourceFingerprint: "a".repeat(64),
        generatedAt: "2026-07-18T00:00:00.000Z",
        sourceGroup: {
            name: "Research group",
            objectives: "Synthesize the completed experiments.",
        },
        fullPlan: {
            artifactId: "50000000-0000-4000-8000-000000000005",
            sourcePath: "FULL_PLAN.md",
            filename: "FULL_PLAN.md",
            contentType: "text/markdown",
            checksumSha256: "b".repeat(64),
            sizeBytes: 1024,
        },
        experiments: [{
                experimentId: "20000000-0000-4000-8000-000000000002",
                experimentName: "Experiment 1",
                experimentStatus: "completed",
                mounts: {
                    workspace: "/review-sources/experiments/e01/workspace",
                    artifacts: "/review-sources/experiments/e01/artifacts",
                    cache: "/review-sources/experiments/e01/cache",
                },
                preprints: [],
                canonicalFigures: [],
            }],
        datasets: [{
                datasetId: "30000000-0000-4000-8000-000000000003",
                datasetVersionId: "40000000-0000-4000-8000-000000000004",
                datasetName: "Historical export",
                versionLabel: "v1",
                sourcePath: "/datasets/historical-export/v1",
            }],
    });
    assert.equal(index.datasets[0]?.sourcePath, "/datasets/historical-export/v1");
});
test("attributed Council preprints validate provenance, coverage, and truncation", () => {
    const experimentId = "10000000-0000-4000-8000-000000000001";
    const preprint = GroupReviewAttributedPreprintSchema.parse({
        experimentId,
        experimentName: "Experiment 1",
        experimentStatus: "completed",
        reportBundleId: "bundle-1",
        runId: "20000000-0000-4000-8000-000000000002",
        artifactId: "30000000-0000-4000-8000-000000000003",
        filename: "PRE_PRINT_PAPER_DRAFT.md",
        checksumSha256: "a".repeat(64),
        content: "# Experiment 1",
        truncated: true,
    });
    const coverage = GroupReviewPreprintCoverageSchema.parse({
        expectedExperimentIds: [experimentId],
        includedExperimentIds: [experimentId],
        omittedExperiments: [],
    });
    assert.equal(preprint.experimentName, "Experiment 1");
    assert.equal(preprint.truncated, true);
    assert.deepEqual(coverage.includedExperimentIds, [experimentId]);
    assert.throws(() => GroupReviewAttributedPreprintSchema.parse({
        ...preprint,
        checksumSha256: "too-short",
    }));
    assert.throws(() => GroupReviewPreprintCoverageSchema.parse({
        ...coverage,
        omittedExperiments: [{
                experimentId,
                experimentName: "Experiment 1",
                reason: "fallback_to_old_bundle",
            }],
    }));
});
test("group final review state accepts immutable prompt revision references", () => {
    const references = GroupFinalReviewPromptTemplateReferencesSchema.parse(groupFinalReviewPromptTemplateReferencesFixture());
    const result = GroupFinalReviewResultSchema.parse(groupFinalReviewReviewerSessionStartingFixture({ promptTemplateReferences: references }));
    if (result.phase !== "reviewer_session_starting") {
        throw new Error(`Expected reviewer_session_starting, received ${result.phase}`);
    }
    assert.equal(result.promptTemplateReferences.group_final_review_reviewer.postRevisionId, 9);
    assert.throws(() => GroupFinalReviewResultSchema.parse({
        ...result,
        promptTemplateReferences: {
            ...result.promptTemplateReferences,
            group_final_review_reviewer: {
                ...result.promptTemplateReferences.group_final_review_reviewer,
                checksumSha256: "too-short",
            },
        },
    }));
});
test("persisted completed final reviews remain parseable without a Preprint Council snapshot", () => {
    const { phase: _phase, ...active } = groupFinalReviewReviewerSessionStartingFixture();
    const historical = {
        ...active,
        phase: "completed",
        sessionId: "70000000-0000-4000-8000-000000000007",
        reviewerTurnId: "reviewer-turn",
        disposition: "clear",
        reviewerJsonArtifactId: "71000000-0000-4000-8000-000000000071",
        reviewerMarkdownArtifactId: "72000000-0000-4000-8000-000000000072",
        reviewerEvidenceVerified: true,
        selectedFigureArtifactIds: [],
        councilExecutionId: "group-final-review:historical:council:0",
        councilModelCallIds: ["73000000-0000-4000-8000-000000000073"],
        councilRatifyOutcome: "approved",
        councilStage: "artifacts_materialized",
        preprintArtifactId: "74000000-0000-4000-8000-000000000074",
        councilProceedingsMarkdownArtifactId: "75000000-0000-4000-8000-000000000075",
        councilProceedingsJsonArtifactId: "76000000-0000-4000-8000-000000000076",
        distillTurnId: "distill-turn",
        distillArtifactId: "77000000-0000-4000-8000-000000000077",
        laySummaryTurnId: "lay-summary-turn",
        laySummaryArtifactId: "78000000-0000-4000-8000-000000000078",
        infographicJobId: null,
        acknowledgedAt: null,
        acknowledgedByUserId: null,
    };
    const parsed = PersistedGroupFinalReviewResultSchema.parse(historical);
    assert.equal(parsed.phase, "completed");
    assert.equal("preprintCouncilPromptTemplateReference" in parsed, false);
    const acknowledged = PersistedGroupFinalReviewResultSchema.parse({
        ...historical,
        acknowledgedAt: "2026-08-10T12:00:00.000Z",
        acknowledgedByUserId: 13,
    });
    assert.equal(acknowledged.phase, "completed");
    if (acknowledged.phase !== "completed")
        return;
    assert.equal(acknowledged.acknowledgedByUserId, 13);
});
test("group final review state rejects incomplete phase payloads", () => {
    assert.throws(() => GroupFinalReviewResultSchema.parse({
        phase: "reviewer_running",
        reviewerTurnId: null,
    }));
    assert.throws(() => GroupFinalReviewResultSchema.parse({
        phase: "needs_configuration",
    }));
});
test("persisted group final review state accepts a pinned v2 editorial revision round without a Council stage", () => {
    const { phase: _phase, ...starting } = groupFinalReviewReviewerSessionStartingFixture({
        workflowVersion: 2,
        draftAttempt: 1,
        revisionAttempt: 1,
        editorialPromptTemplateReferences: groupFinalReviewEditorialPromptTemplateReferencesFixture(),
    });
    const checkpoint = {
        ...starting,
        phase: "codex_revision_running",
        sessionId: "70000000-0000-4000-8000-000000000007",
        reviewerTurnId: "reviewer-turn",
        disposition: "clear",
        reviewerJsonArtifactId: "71000000-0000-4000-8000-000000000071",
        reviewerMarkdownArtifactId: "72000000-0000-4000-8000-000000000072",
        reviewerEvidenceVerified: true,
        selectedFigureArtifactIds: [],
        councilExecutionId: "group-final-review:job:council:0",
        codexDraftArtifactId: "73000000-0000-4000-8000-000000000073",
        editorialRoster: [{ id: "member-1", selector: { provider: "openai", model: "gpt-a" } }],
        editorialChair: {
            id: "chair:ai_council_synthesis",
            selector: { provider: "openai", model: "gpt-chair" },
        },
        editorialReviewPackageArtifactId: "74000000-0000-4000-8000-000000000074",
        editorialNotesModelCallIds: ["75000000-0000-4000-8000-000000000075"],
        editorialDiscussionModelCallIds: ["76000000-0000-4000-8000-000000000076"],
        editorialBriefModelCallId: "77000000-0000-4000-8000-000000000077",
        editorialBriefJsonArtifactId: "78000000-0000-4000-8000-000000000078",
        editorialBriefMarkdownArtifactId: "79000000-0000-4000-8000-000000000079",
        editorialCouncilModelCallIds: ["75000000-0000-4000-8000-000000000075"],
        ratificationRound: 2,
        revisionAttempt: 1,
        revisionTurnId: null,
        currentManuscriptArtifactId: "80000000-0000-4000-8000-000000000080",
        ratificationModelCallIds: ["81000000-0000-4000-8000-000000000081"],
        revisionPacketJsonArtifactId: "82000000-0000-4000-8000-000000000082",
        revisionPacketMarkdownArtifactId: "83000000-0000-4000-8000-000000000083",
    };
    const result = PersistedGroupFinalReviewResultSchema.parse(checkpoint);
    assert.equal(result.phase, "codex_revision_running");
    if (result.phase !== "codex_revision_running")
        return;
    assert.equal(result.ratificationRound, 2);
    assert.equal(result.editorialReviewPackageArtifactId, "74000000-0000-4000-8000-000000000074");
    assert.equal("councilStage" in result, false);
    assert.throws(() => PersistedGroupFinalReviewResultSchema.parse({
        ...checkpoint,
        councilStage: "editorial_review",
    }));
});
test("persisted group final review state normalizes only supported legacy defaults", () => {
    const legacy = { ...groupFinalReviewReviewerSessionStartingFixture() };
    delete legacy.reviewerAttempt;
    delete legacy.distillAttempt;
    delete legacy.laySummaryAttempt;
    delete legacy.warnings;
    legacy.manifestArtifactId = "legacy-unused-artifact";
    const normalized = PersistedGroupFinalReviewResultSchema.parse(legacy);
    assert.equal(normalized.phase, "reviewer_session_starting");
    if (normalized.phase !== "reviewer_session_starting")
        return;
    assert.equal(normalized.reviewerAttempt, 1);
    assert.equal(normalized.distillAttempt, 1);
    assert.equal(normalized.laySummaryAttempt, 1);
    assert.deepEqual(normalized.warnings, []);
    assert.equal("manifestArtifactId" in normalized, false);
    assert.deepEqual(PersistedGroupFinalReviewResultSchema.parse({
        phase: "needs_configuration",
    }), {
        phase: "needs_configuration",
        configurationErrors: [],
    });
});
