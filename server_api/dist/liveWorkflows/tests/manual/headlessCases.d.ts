export declare const headlessCases: readonly ["adapt-format", "codex-trial", "mixed-records", "run-controls", "approved-bulk"];
export type HeadlessCase = (typeof headlessCases)[number];
export declare function selectHeadlessCases(value: string): HeadlessCase[];
/** Independent disposable workspaces share one upper bound, never one full allowance apiece. */
export declare function headlessCaseBudget(total: number, count: number): number;
