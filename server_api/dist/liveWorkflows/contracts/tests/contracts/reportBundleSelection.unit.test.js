import assert from "node:assert/strict";
import test from "node:test";
import { isCompleteReportBundle, latestCompleteReportBundle, latestCompleteReportBundleForExperiment, } from "../../index.js";
const ExperimentId = "experiment-1";
test("latest complete report bundle switches all report roles atomically", () => {
    const previous = reportBundle("bundle-1", "2026-08-13T10:00:00.000Z");
    const incompleteNewer = reportBundle("bundle-2", "2026-08-13T11:00:00.000Z", {
        bundleStatus: "running",
        incompleteTarget: "paper_lay_summary",
    });
    assert.equal(isCompleteReportBundle(previous), true);
    assert.equal(isCompleteReportBundle(incompleteNewer), false);
    assert.equal(latestCompleteReportBundleForExperiment([incompleteNewer, previous], ExperimentId)?.bundleId, previous.bundleId);
    const completedNewer = reportBundle("bundle-2", "2026-08-13T11:00:00.000Z");
    assert.equal(latestCompleteReportBundleForExperiment([previous, completedNewer], ExperimentId)?.bundleId, completedNewer.bundleId);
});
test("latest complete report bundle ignores other experiments and uses a deterministic tie break", () => {
    const lower = reportBundle("bundle-a", "2026-08-13T11:00:00.000Z");
    const higher = reportBundle("bundle-b", "2026-08-13T11:00:00.000Z");
    const other = { ...reportBundle("bundle-z", "2026-08-13T12:00:00.000Z"), experimentId: "experiment-2" };
    assert.equal(latestCompleteReportBundleForExperiment([other, lower, higher], ExperimentId)?.bundleId, "bundle-b");
    assert.equal(latestCompleteReportBundle([lower, other])?.bundleId, "bundle-z");
});
function reportBundle(bundleId, completedAt, options = {}) {
    const targets = ["paper_draft", "paper_distill", "paper_lay_summary"];
    return {
        artifactDirectory: `generatedPapersAndSummaries/${bundleId}`,
        bundleId,
        completedAt,
        experimentId: ExperimentId,
        groupId: 42,
        kind: "generated_papers_and_summaries",
        runId: "run-1",
        startedAt: completedAt,
        status: options.bundleStatus ?? "completed",
        steps: targets.map((targetKind) => ({
            artifactId: targetKind === options.incompleteTarget ? null : `${bundleId}-${targetKind}`,
            outputFile: `${targetKind}.md`,
            relativePath: `generatedPapersAndSummaries/${bundleId}/${targetKind}.md`,
            status: targetKind === options.incompleteTarget ? "running" : "completed",
            targetKind,
        })),
        supportingArtifacts: [],
        updatedAt: completedAt,
        warnings: [],
    };
}
