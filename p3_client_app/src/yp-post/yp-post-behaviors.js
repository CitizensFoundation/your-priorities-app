import '@polymer/polymer/polymer-legacy.js';

/**
 * @polymerBehavior Polymer.YpPostBehavior
 */
export const YpPostBehavior = {

  properties: {
    post: {
      type: Object,
      notify: true
    },

    endorseMode: {
      type: String
    },

    image: {
      type: Boolean,
      value: true
    },

    elevation: {
      type: Number,
      value: 1
    },

    postName: {
      type: String,
      computed: 'postNameFunc(post)'
    },

    postDescription: {
      type: String,
      computed: 'postDescriptionFunc(post)'
    },

    getCategoryImagePath: {
      type: String,
      computed: '_getCategoryImagePath(post)'
    }
  },

  postNameFunc: function (post) {
    if (post && post.name) {
      return this.truncate(this.trim(post.name), 100);
    } else if (post) {
      return post.short_name;
    } else {
      return "";
    }
  },

  postDescriptionFunc: function (post) {
    if (post && post.description) {
      return this.truncate(this.trim(post.description), 500, '...');
    } else if (post && post.Points && post.Points[0]) {
      return  this.truncate(this.trim(post.Points[0].content), 500, '...');
    } else {
      return '';
    }
  },

  _getCategoryImagePath: function (post) {
    if (post && post.Category && post.Category.CategoryIconImages) {
      return this.getImageFormatUrl(post.Category.CategoryIconImages, 0);
    } else {
      return "";
    }
  }
};
