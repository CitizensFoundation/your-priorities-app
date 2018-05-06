import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../@polymer/iron-media-query/iron-media-query.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/iron-pages/iron-pages.js';
import '../../../../@polymer/paper-material/paper-material.js';
import '../../../../@polymer/paper-tabs/paper-tab.js';
import '../../../../@polymer/paper-tabs/paper-tabs.js';
import '../../../../@polymer/app-route/app-route.js';
import '../../../../google-map/google-map.js';
import '../../../../google-map/google-map-marker.js';
import '../../../../google-map/google-map.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import '../ac-activities/ac-activities.js';
import { ypThemeBehavior } from '../yp-theme/yp-theme-behavior.js';
import { YpNewsTabSelected } from '../yp-behaviors/yp-news-tab-selected.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { ypImageFormatsBehavior } from '../yp-behaviors/yp-image-formats-behavior.js';
import { ypNumberFormatBehavior } from '../yp-behaviors/yp-number-format-behavior.js';
import { ypTruncateBehavior } from '../yp-behaviors/yp-truncate-behavior.js';
import './yp-post-header.js';
import './yp-post-points.js';
import './yp-post-user-images.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { dom } from '../../../../@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      :host {
      }

      .container {
        padding-top: 0;
        margin-top: -70px;
        height: 100%;
      }

      .flex {
        @apply --layout-vertical;
        @apply --layout-flex;
      }

      .centerContainer {
        @apply --layout-center-center;
      }

      .postHeader {
        padding: 16px;
        background-color: #fefefe;
        width: 940px;
      }

      .statusHeader {
        padding: 16px;
        background-color: #fefefe;
        width: 940px;
        margin-top: 16px;
        height: 48px;
      }

      .description {
        width: 510px;
        padding-left: 24px;
      }

      ac-activities {
        padding-top: 8px;
      }

      .statusColumn {
        width: 670px;
        padding-bottom: 16px;
      }

      .mainPage {
        background-color: #FFF;
      }

      yp-post-user-images {
        padding-top: 32px;
      }

      @media (max-width: 961px) {
        .postHeader {
          width: 600px;
        }
      }

      @media (max-width: 600px) {
        .postHeader {
          width: 400px;
        }
      }

      .createFab {
        position: fixed;
        bottom: 24px;
        right: 28px;
        background-color: var(--accent-color);
        color: #FFF;

        --paper-fab-iron-icon: {
          color: var(--icon-general-color, #FFF);
          height: 40px;
          width: 40px;
        }
      }

      .createFab[wide-layout] {
        width: 72px;
        height: 72px;
        --paper-fab-iron-icon: {
          color: var(--icon-general-color, #FFF);
          width: 72px;
          height: 72px;
        }
      }

      @media (max-width: 360px) {

        .centerContainer {
          @apply --layout-vertical;
        }

        .postHeader {
          height: 100%;
          width: 360px;
          padding: 0;
        }

        .tabsMaterial {
          width: 360px;
        }

        .statusHeader {
          width: 360px;
          height: 120px;
          padding: 0px;
          padding-left: 20px;
        }

        .statusColumn {
          height: 60px;
          padding: 0px;
        }

        .description {
          width: 320px;
          padding: 8px;
          padding-left: 20px;
          padding-bottom: 16px;
        }

        .statusColumn {
          width: 320px;
        }

        paper-tab {
          font-size: 14px;
        }
      }

      yp-ajax {
        background-color: var(--primary-background-color);
      }

      .mapContainer {
        margin: 24px;
        width: 960px;
        height: 500px;
      }

      .counterInfo {
        font-size: 11px;
      }

      .topContainer {
        margin-top: 16px;
      }

      .tabs {
        margin-top: 24px;
      }

      @media (max-width: 934px) {
        .mapContainer {
          margin: 16px;
          width: 800px;
          height: 400px;
        }
      }

      @media (max-width: 832px) {
        .mapContainer {
          margin: 8px;
          width: 600px;
          height: 340px;
        }
      }

      @media (max-width: 632px) {
        .mapContainer {
          margin: 8px;
          width: 400px;
          height: 300px;
        }
      }

      @media (max-width: 420px) {
        .mapContainer {
          margin: 8px;
          width: 330px;
          height: 250px;
        }
      }

      @media (max-width: 360px) {
        .mapContainer {
          margin: 8px;
          width: 280px;
          height: 200px;
        }
      }


      .tabs {
        width: 1100px;
        padding-top: 8px;
        padding-bottom: 8px;
      }

      .tabs .tab {
        width: 250px;
      }

      @media (max-width: 1024px) {
        .tabs {
          max-width: 920px;
        }

        .tabs .tab {
          width: 200px;
        }
      }

      @media (max-width: 900px) {
        .tabs {
          max-width: 450px;
          font-size: 13px !important;
          word-wrap: break-word !important;
          margin-top: 16px;
        }

        .tabs .tab {
          width: 120px;
          word-wrap: break-word !important;
        }

        .topArea {
          height: 300px;
        }

        .topArea[is-post] {
          min-height: 470px;
        }
      }

      @media (max-width: 380px) {
        .tabs {
          max-width: 330px;
          font-size: 10px !important;
        }

        paper-tab {
          width: 100px;
          font-size: 10px !important;
        }

        .topArea[is-post] {
          min-height: 530px;
        }

        ac-activities {
          min-height: 600px !important;
        }
      }

      .minHeightSection {
        min-height: 450px;
      }

      [hidden] {
        display: none !important;
      }
    </style>

    <div class="topContainer layout vertical center-center" is-post="" create-fab-title="[[t('point.add')]]" on-yp-create-fab-tap="_newPoint">

      <yp-post-header id="postCard" class="largeCard" post="[[post]]" on-refresh="_refreshAjax" header-mode=""></yp-post-header>

      <div class="layout horizontal center-center" hidden\$="[[post.Group.configuration.hideAllTabs]]">
        <paper-tabs id="paper_tabs" class="tabs" selected="{{selectedTab}}" attr-for-selected="name" focused="">
          <paper-tab name="debate">
            <div class="layout vertical center-center tabCounterContainer">
              <span>[[t('post.tabs.debate')]]</span><div class="counterInfo" id="tabCountDebate"></div>
            </div>
          </paper-tab>
          <paper-tab name="news">[[t('post.tabs.news')]]</paper-tab>
          <paper-tab name="location" hidden\$="[[locationHidden]]">[[t('post.tabs.location')]]</paper-tab>
          <paper-tab name="photos">
            <div class="layout vertical center-center tabCounterContainer">
              <span>[[t('post.tabs.photos')]]</span><div class="counterInfo" id="tabCountPhotos"></div>
            </div>
          </paper-tab>
        </paper-tabs>
      </div>

      <iron-pages id="pages" class="tabPages" selected="[[selectedTab]]" attr-for-selected="name" entry-animation="fade-in-animation" exit-animation="fade-out-animation">
        <div name="debate" class="layout horizontal center-center">
          <yp-post-points host="[[host]]" id="pointsSection" post="[[post]]" scroll-to-id\$="[[scrollToPointId]]"></yp-post-points>
        </div>
        <section name="news" class="minHeightSection">
          <template is="dom-if" if="[[newsTabSelected]]">
            <ac-activities id="postNews" selected-tab="[[selectedTab]]" disable-new-posts="[[disableNewPosts]]" post-group-id="[[post.group_id]]" post-id="[[post.id]]"></ac-activities>
          </template>
        </section>
        <section name="location" class="minHeightSection">
          <div class="layout horizontal center-center">
            <template is="dom-if" if="[[post.location]]" restamp="">
              <template is="dom-if" if="[[mapActive]]" restamp="">
                <paper-material class="mapContainer" elevation="3">
                  <google-map additional-map-options="{&quot;keyboardShortcuts&quot;:false}" api-key="AIzaSyDkF_kak8BVZA5zfp5R4xRnrX8HP3hjiL0" id="map" libraries="places" class="map" map-type="[[post.location.mapType]]" zoom="[[post.location.map_zoom]]" fit-to-markers="">
                    <google-map-marker slot="markers" latitude="[[post.location.latitude]]" longitude="[[post.location.longitude]]" id="marker"></google-map-marker>
                  </google-map>
                </paper-material>
              </template>
            </template>
            <template is="dom-if" if="[[post]]">
              <template is="dom-if" if="[[!post.location]]">
                <h1 style="padding-top: 16px">[[t('post.noLocation')]]</h1>
              </template>
            </template>
          </div>
        </section>
        <section name="photos" class="minHeightSection">
          <div class="layout vertical flex">
            <div class="layout horizontal center-center">
              <yp-post-user-images post="[[post]]"></yp-post-user-images>
            </div>
          </div>
        </section>
      </iron-pages>
    </div>

    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <app-route route="{{idRoute}}" pattern="/:id" data="{{idRouteData}}" tail="{{tabRoute}}">
    </app-route>

    <app-route route="{{tabRoute}}" pattern="/:tabName" data="{{tabRouteData}}">
    </app-route>

    <iron-media-query query="(min-width: 1024px)" query-matches="{{wideWidth}}"></iron-media-query>

    <div class="create-fab-wrapper layout horizontal end-justified createFabContainer" hidden\$="[[post.Group.configuration.hideNewPostOnPostPage]]">
      <template is="dom-if" if="[[!disableNewPosts]]">
        <paper-fab class="createFab" icon="[[createFabIcon]]" elevation="5" wide-layout\$="{{wideWidth}}" title="[[createFabTitle]]" on-tap="_newPost"></paper-fab>
      </template>
    </div>

    <div class="layout horizontal center-center">
      <yp-ajax id="ajax" on-response="_response"></yp-ajax>
      <yp-ajax id="pagesAjax" on-response="_pagesResponse"></yp-ajax>
    </div>
`,

  is: 'yp-post',

  behaviors: [
    ypLanguageBehavior,
    ypThemeBehavior,
    YpNewsTabSelected,
    ypGotoBehavior,
    ypImageFormatsBehavior,
    ypNumberFormatBehavior,
    ypTruncateBehavior
  ],

  properties: {

    idRoute: Object,
    tabRoute: Object,
    idRouteData: Object,
    tabRouteData: Object,

    postId: {
      type: Number,
      value: null,
      observer: "_postIdChanged"
    },

    host: String,

    post: {
      type: Object,
      value: null,
      notify: true,
      observer: "_postChanged"
    },

    selectedTab: {
      type: String,
      value: 'debate',
      observer: '_selectedTabChanged'
    },

    small: {
      type: Boolean
    },

    method: {
      type: String
    },

    mapActive: {
      type: Boolean,
      value: false
    },

    wideWidth: {
      type: Boolean,
      value: false
    },

    createFabIcon: {
      type: String,
      value: "lightbulb-outline"
    },

    disableNewPosts: {
      type: Boolean,
      value: false
    },

    scrollToPointId: {
      type: String,
      value: null
    },

    locationHidden: {
      type: Boolean,
      value: false
    }
  },

  observers: [
    '_routeIdChanged(idRouteData.id)',
    '_routeTabChanged(tabRouteData.tabName)'
  ],

  _routeIdChanged: function (newId) {
    if (newId) {
      this.set('postId', newId);
    }
  },

  _routeTabChanged: function (newTabName) {
    if (newTabName && !this._isNumber(newTabName)) {
      this.set('selectedTab', newTabName);
    } else if (newTabName && this._isNumber(newTabName)) {
      this.set('scrollToPointId', newTabName);
      this.set('selectedTab', 'debate');
    }
  },

  _isNumber: function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },

  _selectedTabChanged: function (tabName) {
    if (this.post) {
      this.redirectTo("/post/" + this.post.id + '/' + tabName);
    }

    if (tabName == "location") {
      this.set('mapActive', true);
    } else {
      this.set('mapActive', false);
    }

    if (tabName && window.appGlobals) {
      window.appGlobals.activity('open', 'post_tab_' + tabName);
    }

    this.async(function () {
      var news = this.$$("#postNews");
      if (news) {
        news.fireResize();
      }
    }, 300);
  },

  _newPost: function () {
    window.appGlobals.activity('open', 'newPost');
    dom(document).querySelector('yp-app').getDialogAsync("postEdit", function (dialog) {
      dialog.setup(null, true, null);
      dialog.open('new', {groupId: this.post.Group.id, group: this.post.Group});
    }.bind(this));
  },

  listeners: {
    'yp-debate-info': '_updateDebateInfo',
    'yp-post-image-count': '_updatePostImageCount'
  },

  _updatePostImageCount: function (event, imageCount) {
    var tabCounter = this.$$('#tabCountPhotos');
    if (tabCounter) {
      tabCounter.innerHTML = this.formatNumber(imageCount);
    }
  },

  _updateDebateInfo: function (event, detail) {
    var tabCounter = this.$$('#tabCountDebate');
    if (tabCounter) {
      tabCounter.innerHTML = this.formatNumber(detail.count);
    }
    if (detail.firstPoint) {
      this.$.postCard.updateDescriptionIfEmpty(detail.firstPoint.content);
    }
  },

  _mainContainerClasses: function(small) {
    if (small) {
      return "layout horizontal wrap";
    } else {
      return "layout horizontal center-center";
    }
  },

  _headerClasses: function(small) {
    if (small) {
      return "layout vertical postHeader wrap";
    } else {
      return "layout horizontal postHeader";
    }
  },

  postName: function (post) {
    if (post && post.name) {
      return this.truncate(this.trim(post.name), 200);
    } else if (post) {
      return post.short_name;
    }
  },

  postDescription: function (post) {
    if (post && post.description) {
      return this.truncate(this.trim(post.description), 10000, '...');
    } else {
      return "";
    }
  },

  _refreshAjax: function () {
    this.$.ajax.generateRequest();
  },

  _postChanged: function (newValue, oldValue) {
  },

  _postIdChanged: function (newValue, oldValue) {
    this.set("post",null);
    if (newValue) {
      this._getPost();
      this.set('selectedTab', 'debate');
    }
  },

  _pagesResponse: function (event, detail) {
    this.fire('yp-set-pages', detail.response);
  },

  _getPost: function () {
    if (this.host) {
      this.$.ajax.url = this.host+'/api/posts/' + this.postId;
    } else {
      this.$.ajax.url = '/api/posts/' + this.postId;
    }
    this.$$('#ajax').retryMethodAfter401Login = this._getPost.bind(this);
    this.$.ajax.generateRequest();
  },

  _response: function (event, detail, sender) {
    this.set("post", detail.response);

    this.refresh();

    if (this.post.Group.configuration && this.post.Group.configuration.canAddNewPosts!=undefined) {
      if (this.post.Group.configuration.canAddNewPosts===true) {
        this.set('disableNewPosts', false);
      } else {
        this.set('disableNewPosts', true);
      }
    } else {
      this.set('disableNewPosts', false);
    }

    if (this.post.description === null) {
      this.post.description = this.post.Points[0].content;
      this.post.Points.shift();
    }
  },

  refresh: function () {
    if (this.post) {
      if (this.post.Group.theme_id!=null) {
        this.setTheme(this.post.Group.theme_id);
      } else if (this.post.Group.Community && this.post.Group.Community.theme_id!=null) {
        this.setTheme(this.post.Group.Community.theme_id);
      }

      if (window.appGlobals) {
        window.appGlobals.setCommunityAnalyticsTracker(this.post.Group.Community.google_analytics_code);

        if (this.post.Group.Community.configuration) {
          window.appGlobals.setCommunityPixelTracker(this.post.Group.Community.configuration.facebookPixelId);
        }
        window.appGlobals.setAnonymousGroupStatus(this.post.Group);
      }

      if (this.post.Group.configuration && this.post.Group.configuration.defaultLocale!=null) {
        window.appGlobals.changeLocaleIfNeeded(this.post.Group.configuration.defaultLocale);
      }

      if (this.post.Group.configuration && this.post.Group.configuration.locationHidden!=undefined) {
        this.set('locationHidden', this.post.Group.configuration.locationHidden);
      } else {
        this.set('locationHidden', false);
      }

      /*
      if (this.post.Group.GroupHeaderImages && this.post.Group.GroupHeaderImages.length>0) {
        this.setupTopHeaderImage(this.post.Group.GroupHeaderImages);
      } else  if (this.post.Group.Community.CommunityHeaderImages && this.post.Group.Community.CommunityHeaderImages.length>0) {
        this.setupTopHeaderImage(this.post.Group.Community.CommunityHeaderImage);
      }
      */
      this.fire("change-header", { headerTitle: this.truncate(this.post.Group.name,80),
        documentTitle: this.post.name,
        headerDescription: '',//this.truncate(this.post.Group.objectives,45),
        backPath: "/group/" + this.post.group_id,
        hideHelpIcon: (this.post.Group.configuration && this.post.Group.configuration.hideHelpIcon) ? true : null,
      });
      this.$.pagesAjax.url = "/api/groups/"+this.post.Group.id+"/pages";
      this.$.pagesAjax.generateRequest();
      if (this.post.Group.configuration && this.post.Group.configuration.disableFacebookLoginForGroup===true) {
        window.appGlobals.disableFacebookLoginForGroup = true;
      } else {
        window.appGlobals.disableFacebookLoginForGroup = false;
      }
      this.fire('yp-set-home-link', {
        type: 'group',
        id: this.post.Group.id,
        name: this.post.Group.name
      });
    }
  },

  setupTopHeaderImage: function (image) {
    var url = 'url(' + this.getImageFormatUrl(image, 0) + ')';
    this.updateStyles({ '--top-area-background-image': url });
  },

  computeUrl: function (post_id) {
    return '/api/posts/' + post_id;
  }
});
