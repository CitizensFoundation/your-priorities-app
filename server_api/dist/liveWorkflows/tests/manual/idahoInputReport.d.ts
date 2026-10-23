import { type IdahoRow } from "./idahoData.js";
import type { PartnerData } from "./idahoPartner.js";
export declare function profileIdahoInput(rows: IdahoRow[]): {
    records: number;
    uniqueClassCodes: number;
    fields: {
        field: "Class Code" | "Class Title" | "Pay Schedule" | "Pay Grade" | "FLSA Code" | "Summary" | "Duties and Responsibilities" | "Qualifications";
        present: number;
        missing: number;
    }[];
};
/** Deterministic source audit: no model calls and no new external research. */
export declare function idahoInputReport(options: {
    data: PartnerData;
    mode: string;
    run?: YpWorkflowRun;
    records: Record<string, unknown>[];
    filterReady: boolean;
}): string;
