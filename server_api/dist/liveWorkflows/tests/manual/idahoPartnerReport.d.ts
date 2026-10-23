import { type PartnerData } from "./idahoPartner.js";
import { type saveIdahoCosts } from "./idahoReport.js";
/** Audit the partner's contract independently of producer schemas. Never turn unknown into false/n/a. */
export declare function auditPartnerCsv(csv: Buffer | string): {
    columns: number;
    exportedRows: number;
    filterReady: boolean;
    requiredBlankCells: number;
    entirelyEmptyColumns: number;
    fields: {
        position: number;
        field: string;
        filled: number;
        blank: number;
        invalid: number;
        required: boolean;
        examples: string[];
        blankReason: string;
    }[];
    issues: {
        exportRow: number;
        field: string;
        value: string;
        issue: string;
    }[];
    licenseSpellings: string[];
    warnings: string[];
    note: string;
};
export declare function writePartnerBundle(options: {
    output: string;
    data: PartnerData;
    mode: string;
    run?: YpWorkflowRun;
    records: Record<string, unknown>[];
    costs?: Awaited<ReturnType<typeof saveIdahoCosts>>;
    executionPassed: boolean;
    error?: unknown;
}): Promise<{
    directory: string;
    filterReady: boolean;
    issues: number | null;
}>;
