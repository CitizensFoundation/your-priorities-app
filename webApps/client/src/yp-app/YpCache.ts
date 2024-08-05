import { YpCodeBase } from '../common/YpCodeBaseclass.js';

export class YpCache extends YpCodeBase {
  cachedActivityItem: AcActivityData | undefined;

  cachedPostItem: YpPostData | undefined;

  backToDomainCommunityItems: Record<number, YpCommunityData | undefined> = {};

  backToCommunityGroupItems: Record<number, YpGroupData | undefined> = {};

  communityItemsCache: Record<number, YpCommunityData> = {};

  groupItemsCache: Record<number, YpGroupData> = {};

  postItemsCache: Record<number, YpPostData> = {};

  currentPostListForGroup: Record<number, Array<YpPostData>> = {};

  setCurrentPostListForGroup(groupId: number, posts: Array<YpPostData>) {
    this.currentPostListForGroup[groupId] = posts;
  }

  getPostPositionInTheGroupList(groupId: number, postId: number) {
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

  getPreviousPostInGroupList(groupId: number, postId: number) {
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

  getNextPostInGroupList(groupId: number, postId: number) {
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
    return undefined
  }

  autoTranslateCache: Record<string, string[] | string> = {};

  addPostsToCacheLater(posts: Array<YpPostData>) {
    const laterTimeoutMs = Math.floor(Math.random() * 1000) + 750;
    setTimeout(() => {
      this.addPostsToCache(posts);
    }, laterTimeoutMs);
  }

  addPostsToCache(posts: Array<YpPostData>) {
    if (posts) {
      for (let i = 0; i < posts.length; i++) {
        if (!this.postItemsCache[posts[i].id]) {
          this.postItemsCache[posts[i].id] = posts[i];
        }
      }
    } else {
      console.error('No posts for cache');
    }
  }

  getPostFromCache(postId: number) {
    return this.postItemsCache[postId];
  }

  updatePostInCache(post: YpPostData) {
    this.postItemsCache[post.id] = post;
  }
}
