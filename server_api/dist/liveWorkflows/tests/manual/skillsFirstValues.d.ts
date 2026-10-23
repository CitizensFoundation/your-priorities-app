import type { UsageReservation } from "../../budget.js";
export declare function verifySkillsFirstValues(input: {
    runId: string;
    /** Original analysis receipt scope when a new trial reuses that exact stage. */
    analysisRunId?: string;
    records: Record<string, unknown>[];
    memory: unknown;
    csv: Buffer;
    xlsx: Buffer;
    usage: UsageReservation[];
}): Promise<{
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
}>;
