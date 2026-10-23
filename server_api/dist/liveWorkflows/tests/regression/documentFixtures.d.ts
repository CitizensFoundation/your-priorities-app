export interface DocumentFixture {
    name: string;
    buffer: Buffer;
    expectedText?: string[];
    expectedRows?: Record<string, string>[];
}
export declare function documentFixtures(): Promise<DocumentFixture[]>;
export declare const malformedDocuments: DocumentFixture[];
