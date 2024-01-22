export declare function setSharedLinkAuth(auth: string): void;
export declare function cancelAll(): void;
export declare function serializeQuery(query: PlausibleQueryData, extraQuery?: any): string;
export declare function get(proxyUrl: string | undefined, url: string | Request, query: PlausibleQueryData, ...extraQuery: any[]): Promise<any>;
export declare function getWithProxy(proxyUrl: string, url: string | Request, query: PlausibleQueryData, ...extraQuery: any[]): Promise<any>;
export declare function getDirect(url: string | Request, query: PlausibleQueryData, ...extraQuery: any[]): Promise<any>;
//# sourceMappingURL=api.d.ts.map