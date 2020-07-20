import { YpCodeBase } from '../@yrpri/YpCodeBaseclass.js'

export class YpCache extends YpCodeBase {

  cachedActivityItem: YpActivityData |null = null

  cachedPostItem: YpPostData |null = null

  backToDomainCommunityItems: Record<number,YpCommunityData> = {}

  backToCommunityGroupItems: Record<number,YpGroupData> = {}

  communityItemsCache: Record<number,YpCommunityData> = {}

  groupItemsCache: Record<number,YpGroupData> = {}

  postItemsCache: Record<number,YpPostData> = {}

  autoTranslateCache: Record<string,string> = {}

  addPostsToCacheLater(posts: Array<YpPostData>) {
    const laterTimeoutMs = Math.floor(Math.random() * 1000) + 750;
    setTimeout(() => {
      if (posts) {
        for (let i = 0; i < posts.length; i++) {
          if (!this.postItemsCache[posts[i].id]) {
            this.postItemsCache[posts[i].id]=posts[i];
          }
        }
      } else {
        console.error("No posts for cache");
      }
    }, laterTimeoutMs);
  }

  getPostFromCache(postId: number) {
    return this.postItemsCache[postId];
  }

  updatePostInCache(post: YpPostData) {
    this.postItemsCache[post.id] = post;
  }
}
