import { YpCodeBase } from '../@yrpri/YpCodeBase.js'

export class YpCache extends YpCodeBase {

  cachedActivityItem: YpActivity|null = null

  cachedPostItem: YpPost|null = null

  backToDomainCommunityItems: Record<number,YpCommunity> = {}

  backToCommunityGroupItems: Record<number,YpGroup> = {}

  communityItemsCache: Record<number,YpCommunity> = {}

  groupItemsCache: Record<number,YpGroup> = {}

  postItemsCache: Record<number,YpPost> = {}

  autoTranslateCache: Record<string,string> = {}

  addPostsToCacheLater(posts: Array<YpPost>) {
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

  updatePostInCache(post: YpPost) {
    this.postItemsCache[post.id] = post;
  }
}
