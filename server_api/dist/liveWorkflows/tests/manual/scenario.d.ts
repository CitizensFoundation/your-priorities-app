import { type ManualHarness } from "./harness.js";
export declare function runManualScenario(harness: ManualHarness, outputDir: string, headed: boolean, chatgpt: boolean, signal?: AbortSignal): Promise<{
    runId: string;
    sourceHash: string;
    runtimeImage: string | undefined;
    quality: {
        records: number;
        unknown: number;
    };
    downloads: {
        name: string;
        bytes: number;
        checksum: string;
    }[];
    processingSpentMicros: number;
    processingCapMicros: number;
    agents: Record<string, YpWorkflowNodeCost> | undefined;
    requests: number;
    codexBilling: string;
}>;
