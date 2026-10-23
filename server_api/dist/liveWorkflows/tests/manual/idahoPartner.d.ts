import { type IdahoRow } from "./idahoData.js";
import type { ManualHarness } from "./harness.js";
import type { BrowserObservation } from "./interactiveBrowser.js";
export declare const partnerRecords = 10;
export declare const partnerFirecrawlLimit = 160;
export declare const partnerExperiment: string;
export declare const partnerInstructions: string;
export declare function preparePartnerData(directory: string, source?: string): Promise<{
    fixture: string;
    rows: IdahoRow[];
    selection: {
        originalRecords: number;
        sourceSha256: string;
        selectedRecords: number;
        fixtureSha256: string;
        selection: string;
        rows: {
            sourceRow: number;
            classCode: string;
            name: string;
        }[];
    };
    profile: {
        records: number;
        uniqueClassCodes: number;
        fields: {
            field: "Class Code" | "Class Title" | "Pay Schedule" | "Pay Grade" | "FLSA Code" | "Summary" | "Duties and Responsibilities" | "Qualifications";
            present: number;
            missing: number;
        }[];
    };
}>;
export type PartnerData = Awaited<ReturnType<typeof preparePartnerData>>;
/** Fixture settings only. The live assistant still writes its own adapter and starts the trial. */
export declare function configurePartnerGraph(harness: ManualHarness): Promise<void>;
/** Separate ten-record rehearsal; the existing five-record operator stays unchanged. */
export declare function offlinePartnerOperator(workspace: string): Promise<string>;
export declare function verifyPartnerSelection(data: PartnerData, uploadId: string, run: YpWorkflowRun, adapted: unknown, rows: Record<string, unknown>[]): void;
export declare function partnerStageCoverage(run: YpWorkflowRun, rows: Record<string, unknown>[]): {
    nodeId: string;
    status: YpWorkflowStatus;
    failedRecords: number;
    records: {
        status: {} | null;
        missingEvidence: {};
        missingTasks?: string[] | undefined;
        id: unknown;
        name: unknown;
    }[];
}[];
export declare function verifyPartnerBrowserActions(requests: BrowserObservation[], downloads: string[]): void;
export declare function boundedPartnerFirecrawl(request?: typeof fetch): {
    firecrawlFetch: typeof fetch;
    paidRequests: () => number;
};
