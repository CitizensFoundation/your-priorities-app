export declare class YpNavHelpers {
    /**
     * Appends ?forAgentBundle=... if present in originalQueryParameters.
     */
    static withForAgentBundle(path: string): string;
    static redirectTo(path: string): void;
    static goToPost(postId: number, pointId?: number | undefined, cachedActivityItem?: AcActivityData | undefined, cachedPostItem?: YpPostData | undefined, skipKeepOpen?: boolean): void;
}
//# sourceMappingURL=YpNavHelpers.d.ts.map