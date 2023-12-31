import { YpCodeBase } from '../common/YpCodeBaseclass.js';
export declare class YpCache extends YpCodeBase {
    cachedActivityItem: AcActivityData | undefined;
    cachedPostItem: YpPostData | undefined;
    backToDomainCommunityItems: Record<number, YpCommunityData | undefined>;
    backToCommunityGroupItems: Record<number, YpGroupData | undefined>;
    communityItemsCache: Record<number, YpCommunityData>;
    groupItemsCache: Record<number, YpGroupData>;
    postItemsCache: Record<number, YpPostData>;
    autoTranslateCache: Record<string, string[] | string>;
    addPostsToCacheLater(posts: Array<YpPostData>): void;
    addPostsToCache(posts: Array<YpPostData>): void;
    getPostFromCache(postId: number): YpPostData;
    updatePostInCache(post: YpPostData): void;
}
//# sourceMappingURL=YpCache.d.ts.map