import type { ManualConfig } from "./environment.js";
import type { ManualHarness } from "./harness.js";
import { type BrowserEvidence, type BrowserObservation } from "./interactiveBrowser.js";
export declare const browserFeaturesExperiment = "Use the one job description I uploaded. Inspect the package instructions, workflow status and document through the workflow CLI. In graph.json change only analyze.configuration.tasks to [\"evidence\"]; its degree prerequisite must run automatically. Validate and start exactly one one-record trial with --target analyze using this upload. Keep every model, reasoning setting, budget and other configuration unchanged. Do not rewrite jobs, research, use connectors, install dependencies or start bulk work. Briefly report the run ID and normalize \u2192 levels \u2192 degrees \u2192 evidence dependencies, then finish without polling. I will change an agent model and run the comparison through the UI myself.";
export declare const browserFeaturesInstructions = "<details><summary>UI feature test steps and prompts</summary>\n<p>Two one-job trials, with six processing calls expected. Codex only greets you and starts the first trial. All later actions use the workflow UI.</p>\n<ol><li>Choose Use imported test key and send:<pre>Hello! Briefly say hello and that you are ready for my Skills First job description. Do not use tools or start processing yet.</pre></li>\n<li>Open the compact Settings button beside the chat composer, then Load models. Select the comparison model, high reasoning (medium if already high) and the other response speed. Apply to next turn; the dialog closes. Refresh, reopen Settings and verify the saved values. Restore the original assistant model, reasoning and speed and apply again before sending another message. The conversation must keep the same session. This adds no model calls.</li>\n<li>Upload <a href=\"/manual/fixture\" download>the sample job description</a> in Data. Preview and download it. Send:<pre>Use the one job description I uploaded. Inspect the package instructions, workflow status and document through the workflow CLI. In graph.json change only analyze.configuration.tasks to [\"evidence\"]; its degree prerequisite must run automatically. Validate and start exactly one one-record trial with --target analyze using this upload. Keep every model, reasoning setting, budget and other configuration unchanged. Do not rewrite jobs, research, use connectors, install dependencies or start bulk work. Briefly report the run ID and normalize \u2192 levels \u2192 degrees \u2192 evidence dependencies, then finish without polling. I will change an agent model and run the comparison through the UI myself.</pre></li>\n<li>Use Agents \u2192 Fit/zoom; watch Agent activity. After completion, open Results, inspect the original and quoted evidence, search for Library, and try the failed filter.</li>\n<li>Open Analyze requirements from the graph. Its saved run must be read only. Choose Edit current draft, select the alternative processing model, then Cancel. Reopen and confirm the first model remains.</li>\n<li>Choose the alternative processing model again, the original model for Review, max reasoning and a $4 agent cap; Save agent settings. Refresh, reopen the draft and verify persistence. Model history must still show the original run and model.</li>\n<li>In Data select only the uploaded text. Set Trial records to 1 and Experiment scope to Through Analyze requirements. Run the second trial with the UI button. Watch status, then refresh after completion.</li>\n<li>Open the agent's model history and inspect both saved runs. In Results compare the second run with the first, expand both Models by agent tables and original/evidence details. Search and filter results.</li>\n<li>Review Usage, inspect saved package revisions and check VM storage. Download and open both runs' results-0.json documents in Data. Check the model popup at a narrow browser width.</li>\n<li>Press Enter in the terminal after completing these checks. With --drive, a separate on-demand browser driver performs and asserts these UI steps, saves screenshots and verifies browser-saved files.</li></ol>\n<p>The original run keeps its models and prices. This case never approves bulk, changes workspace allowances or starts external research.</p></details>";
export declare function offlineBrowserFeaturesOperator(): (workspace: string) => Promise<string>;
/** HTTP evidence alone never claims that a popup or result was visually inspected. */
export declare function verifyBrowserFeatureActions(observed: BrowserObservation[], firstId: string, secondId: string, downloads: string[]): void;
export declare function verifyInteractiveFeaturesBrowser(harness: ManualHarness, evidence: BrowserEvidence, output: string, config: ManualConfig): Promise<{
    firstRunId: string;
    secondRunId: string;
    quality: {
        runId: string;
        records: number;
        tasks: string[];
    }[];
    modelHistory: {
        runId: string;
        revision: number;
        models: Record<string, string>;
        reasoningEffort: YpWorkflowReasoningEffort | undefined;
        modelCatalog: YpWorkflowModel[];
        spentMicros: number;
    }[];
    requests: number;
    processingSpentMicros: number;
    processingReservedMicros: number;
    browserRequests: BrowserObservation[];
    codexCapabilities: {
        operation: string;
        status: number;
    }[];
}>;
