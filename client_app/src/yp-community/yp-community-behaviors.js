import '../../../../@polymer/polymer/polymer.js';

export const CommunityBehaviors = {

  properties: {
    community: {
      type: Object,
      notify: true,
      observer: '_communityChanged'
    },

    communityLogoImagePath: {
      type: String,
      computed: '_communityLogoImagePath(community)'
    },

    communityLogoImageNextPath: {
      type: String,
      computed: '_communityLogoImageNextPath(community)'
    },

    communityHeaderImagePath: {
      type: String,
      computed: '_communityHeaderImagePath(community)'
    },

    communityName: {
      type: String,
      computed: '_communityName(community)'
    },

    communityNameFull: {
      type: String,
      computed: '_communityName(community, 1)'
    },

    communityDescription: {
      type: String,
      computed: '_communityDescription(community)'
    },

    communityDescriptionFull: {
      type: String,
      computed: '_communityDescription(community,1)'
    },

    noImage: {
      type: Boolean,
      value: true
    },

    featured: {
      type: Boolean,
      value: false
    },

    archived: {
      type: Boolean,
      value: false
    }
  },

  _communityChanged: function (community) {
    if (community) {
      if (community.CommunityLogoImages && community.CommunityLogoImages.length>0)
      {
        this.set('noImage', false);
      } else {
        this.set('noImage', true);
      }

      if (community.status=='featured') {
        this.set('featured', true);
      } else if (community.status=='archived') {
        this.set('archived', true);
      } else {
        this.set('featured', false);
        this.set('archived', false);
      }
    } else {
      this.set('featured', false);
      this.set('archived', false);
    }
  },

  _goToCommunity: function (e) {
    var communityUrl = '/community/' + this.community.id;
    window.appGlobals.activity('open', 'community', communityUrl);
    this.redirectTo(communityUrl);
  },

  _communityLogoImagePath: function (community) {
    if (community) {
      return this.getImageFormatUrl(community.CommunityLogoImages, 0);
    }
  },

  _communityLogoImageNextPath: function (community) {
    if (community) {
      return this.getImageFormatNextUrl(community.CommunityLogoImages, 0);
    }
  },

  _communityHeaderImagePath: function (community) {
    if (community) {
      return this.getImageFormatUrl(community.CommunityHeaderImages, 0);
    }
  },

  _communityName: function (community, showAll) {
    if (community && community.name) {
      return this.truncate(this.trim(community.name),  showAll ? 300 : 35, '...');
    } else if (community) {
      return community.short_name;
    } else {
      return "";
    }
  },

  _communityDescription: function (community, showAll) {
    if (community && community.description) {
      return this.truncate(this.trim(community.description), showAll ? 300 : 120, '...');
    } else {
      return "";
    }
  },

  getImageFormatNextUrl: function(images, formatId) {
    if (images && images.length>1) {
      var formats = JSON.parse(images[images.length-2].formats);
      if (formats && formats.length>0)
        return formats[formatId];
    } else {
      return "";
    }
  }
};
