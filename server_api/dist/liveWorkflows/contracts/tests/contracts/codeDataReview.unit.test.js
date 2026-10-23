import assert from "node:assert/strict";
import test from "node:test";
import { ChiefScientistDecisionActions, CodeDataReviewConfigurationSchema, LiveWorkflowModelDefaultsSchema, ModelAssignmentIds, PlanningJobKinds, PromptBindingTargetKinds, } from "../../index.js";
test("Code & Data review contracts expose defaults and workflow identifiers", () => {
    assert.deepEqual(CodeDataReviewConfigurationSchema.parse({}), { enabled: true, interval: 3 });
    assert.equal(CodeDataReviewConfigurationSchema.safeParse({ enabled: true, interval: 0 }).success, false);
    assert.ok(ChiefScientistDecisionActions.includes("request_code_data_review"));
    assert.ok(PlanningJobKinds.includes("code_data_review"));
    assert.ok(ModelAssignmentIds.includes("review.code_data"));
    assert.ok(PromptBindingTargetKinds.includes("code_data_review"));
    assert.ok(PromptBindingTargetKinds.includes("serial_experiment_planning_policy"));
    assert.ok(PromptBindingTargetKinds.includes("experiment_initial_research_step_instruction"));
    assert.equal(LiveWorkflowModelDefaultsSchema.safeParse({
        workflow: { assignments: { "review.code_data": { provider: "anthropic", model: "claude" } } },
    }).success, false);
    assert.equal(LiveWorkflowModelDefaultsSchema.safeParse({
        workflow: {
            default: { provider: "anthropic", model: "claude" },
            assignments: { "review.code_data": { model: "gpt-5.6-sol" } },
        },
    }).success, false);
    assert.equal(LiveWorkflowModelDefaultsSchema.safeParse({
        workflow: { assignments: { "review.code_data": { model: "gpt-5.6-sol" } } },
    }).success, false);
    assert.equal(LiveWorkflowModelDefaultsSchema.safeParse({
        workflow: { assignments: { "review.code_data": { provider: "openai", model: "gpt-5.6-sol" } } },
    }).success, true);
});
