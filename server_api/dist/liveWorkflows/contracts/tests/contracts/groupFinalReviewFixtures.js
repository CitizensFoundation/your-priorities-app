import { GroupFinalReviewEditorialPromptTemplateTargetKinds, GroupFinalReviewPromptTemplateTargetKinds, } from "../../index.js";
export function groupFinalReviewEditorialPromptTemplateReferencesFixture() {
    return Object.fromEntries(GroupFinalReviewEditorialPromptTemplateTargetKinds.map((targetKind, index) => [
        targetKind,
        {
            targetKind,
            requestedScope: { type: "group", id: "31" },
            resolvedScope: { type: "domain", id: "1" },
            bindingId: `61000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
            postId: index + 101,
            postRevisionId: index + 108,
            checksumSha256: "c".repeat(64),
            inherited: true,
        },
    ]));
}
export function groupFinalReviewPromptTemplateReferencesFixture() {
    return Object.fromEntries(GroupFinalReviewPromptTemplateTargetKinds.map((targetKind, index) => [
        targetKind,
        {
            targetKind,
            requestedScope: { type: "group", id: "31" },
            resolvedScope: { type: "domain", id: "1" },
            bindingId: `60000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
            postId: index + 1,
            postRevisionId: index + 8,
            checksumSha256: "a".repeat(64),
            inherited: true,
        },
    ]));
}
export function groupFinalReviewReviewerSessionStartingFixture(overrides = {}) {
    return {
        phase: "reviewer_session_starting",
        reviewerAttempt: 2,
        distillAttempt: 3,
        laySummaryAttempt: 4,
        sourceFingerprint: "b".repeat(64),
        experimentId: "10000000-0000-4000-8000-000000000001",
        workspaceId: "20000000-0000-4000-8000-000000000002",
        runId: "30000000-0000-4000-8000-000000000003",
        reportBundleId: "40000000-0000-4000-8000-000000000004",
        sourceIndexArtifactId: "50000000-0000-4000-8000-000000000005",
        promptTemplateReferences: groupFinalReviewPromptTemplateReferencesFixture(),
        warnings: [],
        ...overrides,
    };
}
export function groupFinalReviewReviewerRunningFixture(overrides = {}) {
    const { phase: _phase, ...starting } = groupFinalReviewReviewerSessionStartingFixture();
    return {
        ...starting,
        phase: "reviewer_running",
        sessionId: "70000000-0000-4000-8000-000000000007",
        reviewerTurnId: null,
        ...overrides,
    };
}
