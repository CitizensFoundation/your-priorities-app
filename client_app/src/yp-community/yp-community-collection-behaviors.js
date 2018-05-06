import '../../../../@polymer/polymer/polymer.js';

export const CommunityCollectionBehaviors = {

  properties: {
    activeCommunities: {
      type: Array,
      notify: true
    },

    featuredCommunities: {
      type: Array
    },

    archivedCommunities: {
      type: Array
    },

    communitiesLength: {
      type: Number
    }
  },

  setupCommunities: function (communities) {
    this.set('communitiesLength', communities.length);
    var splitCommunities = this.splitByStatus(communities);
//      this.set('featuredCommunities', splitCommunities.featured);
    this.set('activeCommunities', splitCommunities.featured.concat(splitCommunities.active.concat(splitCommunities.archived)));
  }
};
