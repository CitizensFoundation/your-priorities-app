export declare const analysisNames: string[];
export interface ManualJob {
    id: string;
    name: string;
    text: string;
}
export declare function exportedJobs(value: unknown): unknown[];
/** Structural acceptance, not a claim that a model's employment advice is correct. */
export declare function verifySkillsFirstOutput(input: ManualJob[], output: unknown): {
    records: number;
    unknown: number;
};
export declare function verifyDownload(asset: Pick<YpWorkflowAsset, "checksum" | "bytes">, data: Buffer): void;
