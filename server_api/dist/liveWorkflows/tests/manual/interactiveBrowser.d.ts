import type { RequestHandler } from "express";
import type { ManualHarness } from "./harness.js";
export declare const browserFixture: string;
export declare const browserGreeting = "Hello! Briefly say hello and that you are ready for my Skills First job description. Do not use tools or start processing yet.";
export declare const browserExperiment = "Use the job description I uploaded. Inspect the package instructions, workflow status and document through the workflow CLI. Validate the existing Skills First package and start exactly one one-record trial through the complete default pipeline, including analysis, rewrite, independent review and JSON/CSV/Markdown export. Keep the package, models and budgets unchanged and external connectors off. Tell me the run ID and what will run, then finish your turn without polling. Do not install dependencies, use provider credentials or start bulk work.";
export declare const browserInstructions = "<details><summary>Browser test steps and prompts</summary>\n<p>This page waits for you. The local group and Your Priorities user are test fixtures; live mode uses your imported OpenAI API key.</p>\n<ol><li>Choose Use imported test key. This submits the API-key login form without putting the real key into your browser. Offline mode uses a fake key.</li>\n<li>Send this greeting and wait for Codex's reply:<pre>Hello! Briefly say hello and that you are ready for my Skills First job description. Do not use tools or start processing yet.</pre></li>\n<li><a href=\"/manual/fixture\" download>Download the sample job description</a>, then use Data \u2192 Upload files to upload it. Or select the fixture path printed in the terminal.</li>\n<li>Send this message to Codex:<pre>Use the job description I uploaded. Inspect the package instructions, workflow status and document through the workflow CLI. Validate the existing Skills First package and start exactly one one-record trial through the complete default pipeline, including analysis, rewrite, independent review and JSON/CSV/Markdown export. Keep the package, models and budgets unchanged and external connectors off. Tell me the run ID and what will run, then finish your turn without polling. Do not install dependencies, use provider credentials or start bulk work.</pre></li>\n<li>Watch the graph and cost. After the trial completes, open Results, then download and open all four skills-first files (.json, .csv, .xlsx and .md) from Data.</li>\n<li>Return to the terminal and press Enter to verify and finish. Ctrl+C stops and cleans up an unfinished test.</li></ol>\n<p>There are two Codex turns in this test. Nothing sends chat, uploads data, starts processing or approves spending automatically.</p></details>";
export type BrowserObservation = {
    method: string;
    route: string;
    status: number;
    order: number;
    searched?: boolean;
    compared?: boolean;
    filtered?: boolean;
};
export declare class BrowserEvidence {
    readonly requests: BrowserObservation[];
    private sequence;
    readonly observe: RequestHandler;
}
export declare function verifyBrowserActions(requests: BrowserObservation[], assetIds: string[], mode: "api-key" | "chatgpt" | "offline", batch?: {
    trialId: string;
    bulkId: string;
}): void;
export declare function offlineBrowserOperator(adapt?: boolean): (workspace: string) => Promise<string>;
export declare function verifyInteractiveBrowser(harness: ManualHarness, evidence: BrowserEvidence, outputDir: string, mode: "api-key" | "chatgpt" | "offline"): Promise<{
    runId: string;
    quality: {
        records: number;
        unknown: number;
    } | undefined;
    downloads: {
        name: string;
        bytes: number;
        checksum: string;
    }[];
    processingSpentMicros: number;
    processingReservedMicros: number;
    requests: number;
    sourceHash: string;
    runtimeImage: string | undefined;
    codexCapabilities: {
        operation: string;
        status: number;
    }[];
    browserRequests: BrowserObservation[];
    chatgptLoginVerified: boolean;
    apiKeyLoginVerified: boolean;
    browserOperatorConfirmedReview: boolean;
    downloadEvidence: string;
}>;
