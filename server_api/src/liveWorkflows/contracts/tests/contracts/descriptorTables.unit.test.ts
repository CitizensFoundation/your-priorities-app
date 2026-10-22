import assert from "node:assert/strict";
import test from "node:test";
import {
  ArtifactRoleDescriptors,
  GroupFinalReviewTurnPhaseDescriptors,
  ReportBundleStepArtifactRoleDescriptors,
  getArtifactRoleDescriptor,
  getGroupFinalReviewTurnPhaseDescriptor,
  groupFinalReviewEditorialRevisionCommandAttempt,
  groupFinalReviewTurnAttempt,
  groupFinalReviewTurnId,
  reportBundleStepArtifactRole,
  reportBundleSupportingArtifactRole,
  resetGroupFinalReviewTurnAttempt,
  withGroupFinalReviewTurnId,
} from "../../index.js";
import { groupFinalReviewReviewerRunningFixture } from "./groupFinalReviewFixtures.js";

test("artifact role descriptors are unique, ordered, and report-bundle safe", () => {
  const roles = ArtifactRoleDescriptors.map((descriptor) => descriptor.role);
  assert.equal(new Set(roles).size, roles.length);

  const ranked = ArtifactRoleDescriptors.filter((descriptor) => descriptor.displayRank !== null);
  assert.equal(new Set(ranked.map((descriptor) => descriptor.displayRank)).size, ranked.length);
  assert.deepEqual(
    ranked.map((descriptor) => descriptor.displayRank),
    [...ranked].map((descriptor) => descriptor.displayRank).sort((left, right) => left - right)
  );

  assert.deepEqual(
    ReportBundleStepArtifactRoleDescriptors.map(({ role, outputFile }) => ({ role, outputFile })),
    [
      { role: "paper_draft", outputFile: "PRE_PRINT_PAPER_DRAFT.md" },
      { role: "paper_distill", outputFile: "PRE_PRINT_DISTILL.PUB.html" },
      { role: "paper_lay_summary", outputFile: "PRE_PRINT_DISTILL.PUB.LAYMANS.html" },
    ]
  );
  assert.equal(reportBundleStepArtifactRole("paper_draft"), "paper_draft");
  assert.equal(reportBundleStepArtifactRole("group_codex_review_markdown"), null);
  assert.equal(reportBundleSupportingArtifactRole("group_codex_review_markdown"), "group_codex_review_markdown");
  assert.equal(reportBundleSupportingArtifactRole("unknown_role"), null);

  const codexReview = getArtifactRoleDescriptor("group_codex_review_markdown");
  assert.equal(codexReview?.label, "Group Researcher review");
  assert.equal(codexReview?.featuredByDefault, true);
  assert.match(codexReview?.previewHint ?? "", /findings, evidence/iu);
  assert.equal(getArtifactRoleDescriptor("group_ai_council_proceedings_json")?.featuredByDefault, false);
  assert.equal(getArtifactRoleDescriptor("unknown_role"), null);
});

test("group final-review turn descriptors own attempt and turn-id field access", () => {
  assert.deepEqual(
    GroupFinalReviewTurnPhaseDescriptors.map((descriptor) => ({
      resultPhase: descriptor.resultPhase,
      commandPhase: descriptor.commandPhase,
      attemptField: descriptor.attemptField,
      turnIdField: descriptor.turnIdField,
      validationKind: descriptor.validationKind,
    })),
    [
      {
        resultPhase: "reviewer_running",
        commandPhase: "reviewer",
        attemptField: "reviewerAttempt",
        turnIdField: "reviewerTurnId",
        validationKind: "reviewer",
      },
      {
        resultPhase: "codex_draft_running",
        commandPhase: "preprint-draft",
        attemptField: "draftAttempt",
        turnIdField: "draftTurnId",
        validationKind: "preprint_markdown",
      },
      {
        resultPhase: "codex_revision_running",
        commandPhase: "preprint-revision",
        attemptField: "revisionAttempt",
        turnIdField: "revisionTurnId",
        validationKind: "preprint_markdown",
      },
      {
        resultPhase: "distill_running",
        commandPhase: "distill",
        attemptField: "distillAttempt",
        turnIdField: "distillTurnId",
        validationKind: "distill_html",
      },
      {
        resultPhase: "lay_summary_running",
        commandPhase: "lay-summary",
        attemptField: "laySummaryAttempt",
        turnIdField: "laySummaryTurnId",
        validationKind: "lay_summary_html",
      },
    ]
  );

  const result = groupFinalReviewReviewerRunningFixture();
  const descriptor = getGroupFinalReviewTurnPhaseDescriptor(result.phase);
  assert.ok(descriptor);
  assert.equal(descriptor, getGroupFinalReviewTurnPhaseDescriptor("reviewer"));
  assert.equal(groupFinalReviewTurnAttempt(result, descriptor), 2);
  assert.equal(groupFinalReviewTurnId(result, descriptor), null);

  const withTurn = withGroupFinalReviewTurnId(result, descriptor, " turn-2 ");
  assert.equal(groupFinalReviewTurnId(withTurn, descriptor), "turn-2");
  assert.equal(withTurn.distillTurnId, undefined);

  const reset = resetGroupFinalReviewTurnAttempt(withTurn, descriptor);
  assert.equal(reset.reviewerAttempt, 1);
  assert.equal(reset.distillAttempt, 3);
  assert.equal(reset.laySummaryAttempt, 4);
  assert.equal(groupFinalReviewEditorialRevisionCommandAttempt(1, 1), 101);
  assert.equal(groupFinalReviewEditorialRevisionCommandAttempt(2, 1), 201);
  assert.equal(groupFinalReviewEditorialRevisionCommandAttempt(3, 2), 302);
  assert.equal(getGroupFinalReviewTurnPhaseDescriptor("council_running"), null);
});
