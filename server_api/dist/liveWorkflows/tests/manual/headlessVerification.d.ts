import { z } from "zod";
import { type ManualJob } from "./verification.js";
export declare const resultRows: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    text: z.ZodString;
    originalText: z.ZodString;
    parentId: z.ZodOptional<z.ZodString>;
    parentName: z.ZodOptional<z.ZodString>;
    level: z.ZodOptional<z.ZodObject<{
        name: z.ZodString;
        index: z.ZodNumber;
        count: z.ZodNumber;
    }, z.core.$strip>>;
    errors: z.ZodArray<z.ZodString>;
    status: z.ZodEnum<{
        unknown: "unknown";
        complete: "complete";
    }>;
    analysis: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    rewrittenText: z.ZodOptional<z.ZodString>;
}, z.core.$strip>>;
export type ResultRow = z.infer<typeof resultRows>[number];
export declare function verifyAnalyses(rows: ResultRow[], names: readonly string[]): void;
export declare function verifyReviewedRewrites(rows: ResultRow[]): void;
export declare function verifyMixedResults(input: ManualJob[], output: unknown): {
    parents: number;
    records: number;
    splitChildren: number;
    unknown: number;
};
export declare const exportRows: z.ZodArray<z.ZodObject<{
    vacancy_card: z.ZodObject<{
        display_heading: z.ZodString;
        day_to_day: z.ZodArray<z.ZodString>;
        entry_rules: z.ZodArray<z.ZodString>;
        nice_to_have: z.ZodArray<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>>;
export declare function verifyAdaptedResults(raw: unknown, assetId: string, output: unknown, recordIds?: string[]): {
    records: number;
    tasks: string[];
};
