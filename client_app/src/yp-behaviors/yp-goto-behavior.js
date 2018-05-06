import '../../../../@polymer/polymer/polymer.js';

export const ypGotoBehavior = {

  redirectTo: function (path) {
    //this.fire("yp-redirect-to", { path: path });
    window.history.pushState({}, null, path);
    window.dispatchEvent(new CustomEvent('location-changed'));
  },

  goToPost: function (postIdIn, pointId) {
    var postId;
    if (postIdIn && !(postIdIn instanceof Event)) {
      postId = postIdIn;
    } else if (this.post && this.post.id) {
      postId = this.post.id
    } else {
      console.error("Can't find post id for goToPost");
      return;
    }
    var postUrl = '/post/' + postId;
    if (pointId && !(postIdIn instanceof Event)) {
      postUrl += '/' + pointId;
    }
    var windowLocation = window.location.href;
    console.log(postUrl);
    console.log(windowLocation);
    if (windowLocation.indexOf(postUrl) == -1) {
      window.appGlobals.activity('open', 'post', postUrl);
      window.app.setKeepOpenForPostsOn(window.location.pathname);
      this.async(function () {
        this.redirectTo(postUrl);
      });
    }
  }
};
