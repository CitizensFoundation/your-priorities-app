interface Language {
    code: string;
    name: string;
    nativeName: string;
}
export declare class ISO6391 {
    static getLanguages(codes?: string[]): Language[];
    static getName(code: string): string;
    static getAllNames(): string[];
    static getNativeName(code: string): string;
    static getAllNativeNames(): string[];
    static getCode(name: string): string;
    static getAllCodes(): string[];
    static validate(code: string): boolean;
}
export {};
//# sourceMappingURL=iso6391.d.ts.map