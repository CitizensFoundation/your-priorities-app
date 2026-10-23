import type { UsageReservation } from "../../budget.js";
/** Keep every browser-downloaded part. Consolidation uses the same production formatter,
 * and is explicitly distinguished from byte-identical original downloads. No model calls. */
export declare function collectPartnerExports(options: {
    output: string;
    runId: string;
    artifacts: Map<string, Buffer>;
    records: Record<string, unknown>[];
    usage: UsageReservation[];
    /** Explicit provenance for locally rendered partial results after a failed run. */
    recovered?: {
        stage: string;
        method: string;
    };
}): Promise<{
    passed: boolean;
    missingOrChangedValues: {
        recordId: string | null;
        field: string;
        expected: unknown;
        actual: unknown;
    }[];
    parts: {
        passed: boolean;
        records: number;
        checks: number;
        rawResponses: number;
        populatedFindings: number;
        verifiedQuotes: number;
        masterColumns: number;
        missingOrChangedValues: {
            recordId: string | null;
            field: string;
            expected: unknown;
            actual: unknown;
        }[];
        excelLineEndingNormalizations: {
            recordId: string;
            field: string;
        }[];
        unknownFindings: {
            recordId: string;
            field: string;
            reason: string;
        }[];
        note: string;
    }[];
    delivery: {
        parts: {
            stem: string;
            records: number;
            checksums: Record<string, string>;
        }[];
        note: string;
        recovered?: {
            stage: string;
            method: string;
        } | undefined;
        consolidated: boolean;
    };
    records: number;
    checks: number;
    rawResponses: number;
    populatedFindings: number;
    verifiedQuotes: number;
    masterColumns: number;
    excelLineEndingNormalizations: {
        recordId: string;
        field: string;
    }[];
    unknownFindings: {
        recordId: string;
        field: string;
        reason: string;
    }[];
    note: string;
}>;
/** Preserve reviewable files after a failed trial without claiming a finished browser export. */
export declare function recoverPartnerExports(options: {
    output: string;
    runId: string;
    records: Record<string, unknown>[];
    usage: UsageReservation[];
    stage: string;
    method: string;
}): Promise<{
    records: Record<string, unknown>[];
    verification: {
        passed: boolean;
        missingOrChangedValues: {
            recordId: string | null;
            field: string;
            expected: unknown;
            actual: unknown;
        }[];
        parts: {
            passed: boolean;
            records: number;
            checks: number;
            rawResponses: number;
            populatedFindings: number;
            verifiedQuotes: number;
            masterColumns: number;
            missingOrChangedValues: {
                recordId: string | null;
                field: string;
                expected: unknown;
                actual: unknown;
            }[];
            excelLineEndingNormalizations: {
                recordId: string;
                field: string;
            }[];
            unknownFindings: {
                recordId: string;
                field: string;
                reason: string;
            }[];
            note: string;
        }[];
        delivery: {
            parts: {
                stem: string;
                records: number;
                checksums: Record<string, string>;
            }[];
            note: string;
            recovered?: {
                stage: string;
                method: string;
            } | undefined;
            consolidated: boolean;
        };
        records: number;
        checks: number;
        rawResponses: number;
        populatedFindings: number;
        verifiedQuotes: number;
        masterColumns: number;
        excelLineEndingNormalizations: {
            recordId: string;
            field: string;
        }[];
        unknownFindings: {
            recordId: string;
            field: string;
            reason: string;
        }[];
        note: string;
    };
}>;
