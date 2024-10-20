import { YpCodeBase } from '../common/YpCodeBaseclass.js';
export class YpCache extends YpCodeBase {
    constructor() {
        super(...arguments);
        this.backToDomainCommunityItems = {};
        this.backToCommunityGroupItems = {};
        this.communityItemsCache = {};
        this.groupItemsCache = {};
        this.postItemsCache = {};
        this.currentPostListForGroup = {};
        this.postCountsForGroup = {};
        this.autoTranslateCache = {};
    }
    setPostCountsForGroup(groupId, postCount) {
        this.postCountsForGroup[groupId] = postCount;
    }
    getPostCountsForGroup(groupId) {
        return this.postCountsForGroup[groupId];
    }
    setCurrentPostListForGroup(groupId, posts) {
        this.currentPostListForGroup[groupId] = posts;
    }
    getPostPositionInTheGroupList(groupId, postId) {
        const posts = this.currentPostListForGroup[groupId];
        if (posts) {
            for (let i = 0; i < posts.length; i++) {
                if (posts[i].id === postId) {
                    return i;
                }
            }
        }
        return -1;
    }
    getPreviousPostInGroupList(groupId, postId) {
        const posts = this.currentPostListForGroup[groupId];
        if (posts) {
            for (let i = 0; i < posts.length; i++) {
                if (posts[i].id === postId) {
                    if (i > 0) {
                        return posts[i - 1];
                    }
                }
            }
        }
        return undefined;
    }
    getNextPostInGroupList(groupId, postId) {
        const posts = this.currentPostListForGroup[groupId];
        if (posts) {
            for (let i = 0; i < posts.length; i++) {
                if (posts[i].id === postId) {
                    if (i < posts.length - 1) {
                        return posts[i + 1];
                    }
                }
            }
        }
        return undefined;
    }
    addPostsToCacheLater(posts) {
        const laterTimeoutMs = Math.floor(Math.random() * 500) + 250;
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