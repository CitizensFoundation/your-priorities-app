/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

function onSplashClick() {
  var loadContainer = document.getElementById('splash');
  loadContainer.parentNode.removeChild(loadContainer);
  document.body.classList.remove('loading');
}


(function(document) {
  'use strict';

  window.appStartTime = new Date();

  i18n.init({ lng: "en" });
  window.i18n = i18n;

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');
  app.appTitle = "Your Priorities";
  app.user = null;
  app.previousSearches = [];
  app.showSearch = false;
  app.showBack = false;
  app.backPath = null;

  app.displayInstalledToast = function() {
    // Check to make sure caching is actually enabled—it won't be in the dev environment.
    if (!document.querySelector('platinum-sw-cache').disabled) {
      document.querySelector('#caching-complete').show();
    }
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
  });

  // Main area's paper-scroll-header-panel custom condensing transformation of
  // the appName in the middle-container and the bottom title in the bottom-container.
  // The appName is moved to top and shrunk on condensing. The bottom sub title
  // is shrunk to nothing on condensing.
  addEventListener('paper-header-transform', function(e) {
    var appName = document.querySelector('#mainToolbar .app-name');
    var middleContainer = document.querySelector('#mainToolbar .middle-container');
    var bottomContainer = document.querySelector('#mainToolbar .bottom-container');
    var detail = e.detail;
    var heightDiff = detail.height - detail.condensedHeight;
    var yRatio = Math.min(1, detail.y / heightDiff);
    var maxMiddleScale = 0.50;  // appName max size when condensed. The smaller the number the smaller the condensed size.
    var scaleMiddle = Math.max(maxMiddleScale, (heightDiff - detail.y) / (heightDiff / (1-maxMiddleScale))  + maxMiddleScale);
    var scaleBottom = 1 - yRatio;

    // Move/translate middleContainer
   // Polymer.Base.transform('translate3d(0,' + yRatio * 100 + '%,0)', middleContainer);

    // Scale bottomContainer and bottom sub title to nothing and back
    //Polymer.Base.transform('scale(' + scaleBottom + ') translateZ(0)', bottomContainer);

    // Scale middleContainer appName
    //Polymer.Base.transform('scale(' + scaleMiddle + ') translateZ(0)', appName);
  });

  // Close drawer after menu item is selected if drawerPanel is narrow
  app.onDataRouteClick = function() {
    var drawerPanel = document.querySelector('#paperDrawerPanel');
    if (drawerPanel.narrow) {
      drawerPanel.closeDrawer();
    }
  };

  app.openEdit = function () {
    var userEdit = document.querySelector('#userEdit');
    userEdit.open('edit', { userId: app.user.id });
  };

  app.onChangeHeader = function(event, header) {
    app.headerTitle = document.title = header.headerTitle;
    app.headerDescription = header.headerDescription;
    //if (header.headerIcon)
      //app.headerIcon = header.headerIcon;
    if (header.enableSearch)
      this.showSearch = true;
    else
      this.showSearch = false;
    if (header.backPath) {
      this.showBack = true;
      this.backPath = header.backPath;
    } else {
      this.showBack = false;
      this.backPath = null;
    }
  };

  app.goBack = function (event, detail) {
    if (this.backPath)
      page(this.backPath);
  };

  app.onUserChanged = function(event, detail) {
    if (detail) {
      app.user = detail;
    } else {
      app.user = null;
    }
  };

  app._onSearch = function(e) {
    app.toggleSearch();
    this.unshift('previousSearches', e.detail.value);
    var postsFilter =  document.querySelector('#postsFilter');
    if (postsFilter) {
      postsFilter.searchFor(e.detail.value);
    }
  };

  app.toggleSearch = function() {
    app.$.search.toggle();
  };

  // Scroll page to top and expand header
  app.scrollPageToTop = function() {
    document.getElementById('mainArea').scroller.scrollTop = 0;
  };

})(document);
