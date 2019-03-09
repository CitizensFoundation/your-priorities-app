import '@polymer/polymer/polymer-legacy.js';

/**
 * @polymerBehavior Polymer.ypAppCacheBehavior
 */
export const ypAppCacheBehavior = {

  properties: {
    cachedActivityItem: {
      type: Object,
      value: null
    },

    cachedPostItem: {
      type: Object,
      value: null
    },

    backToDomainCommunityItems: {
      type: Object,
      value: null
    },

    backToCommunityGroupItems: {
      type: Object,
      value: null
    },

    communityItemsCache: {
      type: Object,
      value: null
    },

    groupItemsCache: {
      type: Object,
      value: null
    },

    postItemsCache: {
      type: Object,
      value: null
    },

    autoTranslateCache: Object,
  },

  addPostsToCacheLater: function (posts) {
    var laterTimeoutMs = Math.floor(Math.random() * 1000) + 750;
    this.async(function () {
      if (posts) {
        for (i = 0; i < posts.length; i++) {
          if (!this.postItemsCache[posts[i].id]) {
            this.postItemsCache[posts[i].id]=posts[i];
          }
        }
      } else {
        console.error("No posts for cache");
      }
    }, laterTimeoutMs);
  },

  getPostFromCache: function (postId) {
    return this.postItemsCache[parseInt(postId)];
  },

  ready: function () {
    this.autoTranslateCache = {};
    this.communityItemsCache = {};
    this.groupItemsCache = {};
    this.postItemsCache = {};
  }
};
