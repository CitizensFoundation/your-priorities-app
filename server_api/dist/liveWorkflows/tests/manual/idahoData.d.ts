export declare const idahoDirectory: string;
export declare const idahoSource: string;
export declare const idahoHeaders: readonly ["Class Code", "Class Title", "Pay Schedule", "Pay Grade", "FLSA Code", "Summary", "Duties and Responsibilities", "Qualifications"];
export declare const idahoPopulation = 100;
export declare const idahoSample = 5;
export type IdahoRow = Record<(typeof idahoHeaders)[number], string>;
export declare const sha256: (value: string | Buffer) => string;
/** Preserve field contents, including quotes, newlines, Unicode and leading zeros. */
export declare function idahoSelection(contents: string): {
    records: number;
    rows: IdahoRow[];
    csv: string;
};
export declare function prepareIdahoData(source?: string, directory?: string): Promise<{
    rows: IdahoRow[];
    source: string;
    originalRecords: number;
    sourceSha256: string;
    fixture: string;
    selectedRecords: number;
    fixtureSha256: string;
    selection: string;
    classCodes: string[];
}>;
export declare function idahoText(row: IdahoRow): string;
