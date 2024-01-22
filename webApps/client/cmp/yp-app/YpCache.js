import { YpCodeBase } from '../common/YpCodeBaseclass.js';
export class YpCache extends YpCodeBase {
    constructor() {
        super(...arguments);
        this.backToDomainCommunityItems = {};
        this.backToCommunityGroupItems = {};
        this.communityItemsCache = {};
        this.groupItemsCache = {};
        this.postItemsCache = {};
        this.autoTranslateCache = {};
    }
    addPostsToCacheLater(posts) {
        const laterTimeoutMs = Math.floor(Math.random() * 1000) + 750;
        setTimeout(() => {
            this.addPostsToCache(posts);
        }, laterTimeoutMs);
    }
    addPostsToCache(posts) {
        if (posts) {
            for (let i = 0; i < posts.length; i++) {
                if (!this.postItemsCache[posts[i].id]) {
                    this.postItemsCache[posts[i].id] = posts[i];
                }
            }
        }
        else {
            console.error('No posts for cache');
        }
    }
    getPostFromCache(postId) {
        return this.postItemsCache[postId];
    }
    updatePostInCache(post) {
        this.postItemsCache[post.id] = post;
    }
}
//# sourceMappingURL=YpCache.js.map