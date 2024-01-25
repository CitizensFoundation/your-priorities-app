export declare const FILTER_GROUPS: Record<string, string[]>;
export declare function getFormState(filterGroup: string, query: PlausibleQueryData): {};
export declare function toFilterType(value: string): string;
export declare function valueWithoutPrefix(value: string): string;
export declare function toFilterQuery(value: string, type: string): string;
export declare function supportsContains(filterName: string): boolean;
export declare function supportsIsNot(filterName: string): boolean;
export declare function withIndefiniteArticle(word: string): string;
export declare function formatFilterGroup(filterGroup: string): any;
export declare function filterGroupForFilter(filter: string): any;
//# sourceMappingURL=filter.d.ts.map