export class YpNavHelpers {
  static redirectTo(path: string) {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new CustomEvent('location-changed'));
    document.dispatchEvent(new CustomEvent('yp-pause-media-playback', {bubbles: true, detail: {}}));
  }

  static goToPost(postId: number, pointId: number|null = null,
                           cachedActivityItem: YpActivity|null = null,
                          cachedPostItem: YpPost|null = null, skipKeepOpen = false) {
    if (postId===null) {
      console.error("Can't find post id for goToPost");
      return;
    }

    let postUrl = '/post/' + postId;

    if (pointId!==null) {
      postUrl += '/' + pointId;
    }

    const windowLocation = window.location.href;
    console.log("Go to post: "+postUrl);
    console.log("Current window location: "+windowLocation);

    if (cachedActivityItem) {
      console.info("Saving cached scroll to item "+cachedActivityItem.id);
      window.appGlobals.cachedActivityItem = cachedActivityItem;
    }

    if (cachedPostItem && cachedPostItem.Group && cachedPostItem.Group.Community) {
      console.info("Saving cached scroll to post "+cachedPostItem.id);
      window.appGlobals.cachedPostItem = cachedPostItem;
    }

    if (windowLocation.indexOf(postUrl) == -1) {
      window.appGlobals.activity('open', 'post', postUrl, { id: postId, modelType: 'post' });
      if (skipKeepOpen!==true)
        window.appGlobals.setKeepOpenForPostsOn(window.location.pathname);
      setTimeout(() => {
        this.redirectTo(postUrl);
      });
    }
  }
}