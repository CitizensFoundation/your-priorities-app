import { YpCodeBase } from '../common/YpCodeBaseclass.js';
import { YpServerApi } from '../common/YpServerApi.js';
export declare class YpRecommendations extends YpCodeBase {
    recommendationsGroupCache: Record<number, Array<YpPostData>>;
    recommendationsSeenPostIds: object | undefined;
    recommendationCallbacks: Record<number, Function>;
    lastRecommendationResponseLengths: Record<number, number>;
    currentPostId: number | undefined;
    currentlyDownloadingIds: Record<number, boolean>;
    preCacheLimit: number;
    serverApi: YpServerApi;
    constructor(serverApi: YpServerApi);
    getNextRecommendationForGroup(groupId: number, currentPostId: number, recommendationCallback: Function): void;
    _preCacheMediaForPost(post: YpPostData): void;
    _getImageFormatUrl(images: Array<YpImageData> | undefined, formatId: number): any;
    _getCategoryImagePath(post: YpPostData): any;
    _downloadItemToCache(postId: number): void;
    _ensureNextItemsAreCached(groupId: number): void;
    _getRecommendationsForGroup(groupId: number): Promise<void>;
    _getSelectedPost(groupId: number): YpPostData | null;
    reset(): void;
}
//# sourceMappingURL=YpRecommendations.d.ts.map