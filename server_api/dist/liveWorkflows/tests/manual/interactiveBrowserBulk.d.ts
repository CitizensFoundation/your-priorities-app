import type { ManualHarness } from "./harness.js";
import { BrowserEvidence } from "./interactiveBrowser.js";
export declare const browserBulkFixture: string;
export declare const browserBulkExperiment = "I uploaded ten fictional job descriptions in an unfamiliar recruitment export. Inspect the raw data and package instructions through the workflow CLI. Create a deterministic TypeScript adapter agent named adapt-import before normalize. Preserve imported record IDs, source, titles, jurisdiction, and every duty, mandatory requirement and preference verbatim. Export the adapted input via context.artifact as adapted-jobs.json. Update graph.json with its dependencies, description and clear diagram positions, then validate. Select only evidence in analyze.configuration.tasks; the package must include its degree prerequisite. Start exactly one two-record trial with --target analyze using this asset and existing model selections and reasoning effort. Keep rewriting, research and connectors off. Report the run ID and dependencies, then finish without polling. I will review the trial, estimate and approve bulk processing in the browser. Do not start or approve bulk work, change budgets, install dependencies or use provider credentials.";
export declare const browserBulkInstructions = "<details><summary>Ten-job browser test steps and prompts</summary>\n<p>Use the real workflow controls below. Your Priorities membership is a fixture; live mode uses the server's imported API key. Only two Codex turns are allowed.</p>\n<ol><li>Choose Use imported test key, then send:<pre>Hello! Briefly say hello and that you are ready for my Skills First job description. Do not use tools or start processing yet.</pre></li>\n<li>Use Data \u2192 Upload files to upload <a href=\"/manual/fixture\" download>the ten-job recruitment export</a>.</li>\n<li>Send:<pre>I uploaded ten fictional job descriptions in an unfamiliar recruitment export. Inspect the raw data and package instructions through the workflow CLI. Create a deterministic TypeScript adapter agent named adapt-import before normalize. Preserve imported record IDs, source, titles, jurisdiction, and every duty, mandatory requirement and preference verbatim. Export the adapted input via context.artifact as adapted-jobs.json. Update graph.json with its dependencies, description and clear diagram positions, then validate. Select only evidence in analyze.configuration.tasks; the package must include its degree prerequisite. Start exactly one two-record trial with --target analyze using this asset and existing model selections and reasoning effort. Keep rewriting, research and connectors off. Report the run ID and dependencies, then finish without polling. I will review the trial, estimate and approve bulk processing in the browser. Do not start or approve bulk work, change budgets, install dependencies or use provider credentials.</pre></li>\n<li>Inspect the adapter, its upstream/downstream links and the analysis prerequisites in Agents. After the trial completes, review Results and open the original/evidence details. Download and open its adapted-jobs.json and results-0.json from Data.</li>\n<li>Select only the original recruitment-batch.json input in Data. Choose the experiment scope through the analysis agent, then Estimate full run. Review the two-record sample, ten-record estimate and per-agent costs. Bulk includes all ten jobs; the trial records are charged separately. Enter a cap within the remaining workspace allowance and approve the saved revision.</li>\n<li>Wait for the checkpoint notice below. Click pause in the workflow UI, then refresh this page. Inspect the saved Codex replies, graph, progress and spending. Use Approve allowance and resume without increasing the cap.</li>\n<li>Wait for completion. Review and search batch Results (for example Library), inspect quoted evidence and unknown findings, and compare trial/batch costs in Usage. Download and open the batch's adapted-jobs.json and results-0.json from Data.</li>\n<li>Press Enter in the terminal to verify and finish. Ctrl+C cleans up an incomplete test.</li></ol>\n<p>The test holds processing after the durable levels checkpoint so there is time to click pause. It does not approve, pause or resume anything automatically. This tests browser refresh and acknowledged pause/resume, not a host crash or an in-flight provider failure.</p></details><p id=\"manual-checkpoint\" role=\"status\">Batch checkpoint: awaiting batch.</p><script>\nconst checkpointMessages = {\n  \"awaiting-batch\": \"Awaiting an approved batch. Complete the trial and review the estimate first.\",\n  \"processing-levels\": \"Batch is processing levels. Wait for the checkpoint before clicking pause.\",\n  \"ready-to-pause\": \"Checkpoint ready: all ten level calls are settled. Click pause in the workflow UI.\",\n  \"paused\": \"Paused. Refresh this page to verify saved chat and progress.\",\n  \"reloaded\": \"Reload verified. Review saved chat and progress, then use Approve allowance and resume.\",\n  \"resumed\": \"Resumed. Wait for completion, review results, and download both runs' inputs and results.\"\n};\nasync function updateCheckpoint() {\n  try {\n    const state = await (await fetch('/manual/checkpoint')).json();\n    document.getElementById('manual-checkpoint').textContent = checkpointMessages[state.phase];\n  } catch { /* The harness may be closing. */ }\n}\nupdateCheckpoint(); setInterval(updateCheckpoint, 2000);\n</script>";
export declare function verifyInteractiveBulkBrowser(harness: ManualHarness, evidence: BrowserEvidence, output: string, mode: "api-key" | "chatgpt" | "offline"): Promise<{
    trialRunId: string;
    bulkRunId: string;
    trialRecords: number;
    bulkRecords: number;
    bulkIncludesTrialRecords: boolean;
    quality: {
        records: number;
        tasks: string[];
        mode: "trial" | "bulk";
    }[];
    trialSpentMicros: number;
    bulkSpentMicros: number;
    processingSpentMicros: number;
    processingReservedMicros: number;
    requests: number;
    sourceHash: string;
    runtimeImage: string | undefined;
    estimate: YpWorkflowEstimate;
    actualToExpectedRatio: number;
    actualWithinEstimateUpper: boolean;
    approvedBudgetMicros: number;
    paidCallsReplayed: number;
    pauseAndReloadVerified: boolean;
    resumedWithSameApproval: boolean;
    checkpoint: {
        checksum: string;
        records: number;
    };
    codexCapabilities: {
        operation: string;
        status: number;
    }[];
    browserRequests: import("./interactiveBrowser.js").BrowserObservation[];
    downloads: {
        id: string;
        name: string;
        bytes: number;
        checksum: string;
    }[];
    apiKeyLoginVerified: boolean;
    chatgptLoginVerified: boolean;
    browserOperatorConfirmedReview: boolean;
    downloadEvidence: string;
}>;
