import assert from "node:assert/strict";
import test from "node:test";
import { GroupFinalReviewExecutionSystemRole, experimentSystemRole, hasExperimentSystemRole, isAgentSessionTerminalStatus, isExperimentRunStepTerminalStatus, isExperimentRunTerminalStatus, isExperimentRunUnsuccessfulTerminalStatus, isGroupReviewReadyExperimentStatus, isHumanReviewCaseTerminalStatus, isInfographicJobTerminalStatus, isInfographicSlideTerminalStatus, isModelCallTerminalStatus, isPlanningJobTerminalStatus, isScienceAgentRunTerminalStatus, isSystemExperimentMetadata, } from "../../index.js";
test("experiment system roles classify any non-empty role as internal", () => {
    assert.equal(experimentSystemRole({ systemRole: " group_final_review_execution " }), GroupFinalReviewExecutionSystemRole);
    assert.equal(isSystemExperimentMetadata({ systemRole: GroupFinalReviewExecutionSystemRole }), true);
    assert.equal(isSystemExperimentMetadata({ systemRole: "archive_builder" }), true);
    assert.equal(isSystemExperimentMetadata({ groupPlanExperimentType: "dataset" }), false);
    assert.equal(isSystemExperimentMetadata({ groupPlanExperimentType: "research" }), false);
    assert.equal(isSystemExperimentMetadata({ systemRole: "   " }), false);
    assert.equal(isSystemExperimentMetadata(null), false);
    assert.equal(hasExperimentSystemRole({ systemRole: GroupFinalReviewExecutionSystemRole }, GroupFinalReviewExecutionSystemRole), true);
    assert.equal(hasExperimentSystemRole({ systemRole: "archive_builder" }, GroupFinalReviewExecutionSystemRole), false);
});
test("terminal status predicates preserve domain-specific semantics", () => {
    assert.equal(isGroupReviewReadyExperimentStatus("completed"), true);
    assert.equal(isGroupReviewReadyExperimentStatus("archived"), true);
    assert.equal(isGroupReviewReadyExperimentStatus("failed"), false);
    assert.equal(isExperimentRunTerminalStatus("cancelled"), true);
    assert.equal(isExperimentRunTerminalStatus("paused"), false);
    assert.equal(isExperimentRunUnsuccessfulTerminalStatus("failed"), true);
    assert.equal(isExperimentRunUnsuccessfulTerminalStatus("completed"), false);
    assert.equal(isExperimentRunStepTerminalStatus("skipped"), true);
    assert.equal(isExperimentRunStepTerminalStatus("running"), false);
    assert.equal(isAgentSessionTerminalStatus("archived"), true);
    assert.equal(isAgentSessionTerminalStatus("paused"), false);
    assert.equal(isPlanningJobTerminalStatus("failed"), true);
    assert.equal(isPlanningJobTerminalStatus("waiting_for_input"), false);
    assert.equal(isModelCallTerminalStatus("completed"), true);
    assert.equal(isModelCallTerminalStatus("running"), false);
    assert.equal(isScienceAgentRunTerminalStatus("cancelled"), true);
    assert.equal(isScienceAgentRunTerminalStatus("queued"), false);
    assert.equal(isInfographicJobTerminalStatus("failed"), true);
    assert.equal(isInfographicSlideTerminalStatus("completed"), true);
    assert.equal(isHumanReviewCaseTerminalStatus("superseded"), true);
    assert.equal(isHumanReviewCaseTerminalStatus("waiting_vote"), false);
    for (const value of [null, undefined, 1, {}, "unknown"]) {
        assert.equal(isExperimentRunTerminalStatus(value), false);
        assert.equal(isAgentSessionTerminalStatus(value), false);
    }
});
