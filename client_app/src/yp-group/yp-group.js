import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../@polymer/iron-scroll-threshold/iron-scroll-threshold.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/iron-pages/iron-pages.js';
import '../../../../@polymer/paper-tabs/paper-tab.js';
import '../../../../@polymer/paper-tabs/paper-tabs.js';
import '../../../../@polymer/paper-fab/paper-fab.js';
import '../../../../@polymer/app-route/app-route.js';
import '../../../../@polymer/iron-scroll-threshold/iron-scroll-threshold.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { YpNewsTabSelected } from '../yp-behaviors/yp-news-tab-selected.js';
import { ypDetectOldiOs } from '../yp-behaviors/yp-detect-old-ios.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { ypImageFormatsBehavior } from '../yp-behaviors/yp-image-formats-behavior.js';
import '../ac-activities/ac-activities.js';
import '../yp-ajax/yp-ajax.js';
import '../yp-post/yp-post-card.js';
import '../yp-post/yp-post-card-add.js';
import '../yp-post/yp-post-list.js';
import '../yp-post/yp-post-map.js';
import { ypThemeBehavior } from '../yp-theme/yp-theme-behavior.js';
import { ypNumberFormatBehavior } from '../yp-behaviors/yp-number-format-behavior.js';
import './yp-group-card-large.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { dom } from '../../../../@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      .objectives {
        padding-bottom: 40px;
        max-width: 432px;
      }

      .description {
        padding: 12px;
      }

      yp-ajax {
        background-color: var(--primary-background-color);
      }

      .counterInfo {
        font-size: 11px;
      }

      .topContainer {
        margin-top: 16px;
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

      .createFabContainer[wide-layout] .createFab {
      }

      .topArea {
        background-color: var(--primary-background-color);
        background-image: var(--top-area-background-image, none);
        height: 300px;
      }

      .tabs {
        width: 1100px;
        padding-top: 8px;
        padding-bottom: 8px;
      }

      .tabs .tab {
        width: 250px;
      }

      .largeAddButton {
        margin-bottom: 4px;
        margin-top: 4px;
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
          max-width: 550px;
          width: 550px;
          font-size: 14px;
          word-wrap: break-word !important;
        }

        .tabs[has-non-open-posts] {
          font-size: 10px;
        }

        .counterInfo[has-non-open-posts] {
          font-size: 9px;
        }

        .tabs .tab {
          width: 120px;
          word-wrap: break-word !important;
        }

        .topArea {
          height: auto;
        }

        .largeAddButton[is-apple] {
          margin-top: 32px;
        }

        .largeAddButton[is-ipad] {
          margin-top: 48px;
        }
      }

      @media (max-width: 380px) {
        .tabs {
          max-width: 360px;
          font-size: 12px;
          width: 360px;
        }

        paper-tab {
          width: 170px;
        }
      }

      @media (max-width: 320px) {
        .tabs {
          max-width: 320px;
          font-size: 12px;
          width: 320px;
        }

        paper-tab {
          width: 160px;
        }
      }

      .tabSubTitle {
        font-size: 13px;
      }

      .minHeightSection {
        min-height: 450px;
      }

      .tabContainer[hide] {
        display: none;
      }

      [hidden] {
        display: none !important;
      }
    </style>

    <div id="topContainer">

      <div id="topArea" class="large-card-wrapper layout horizontal center-center topArea" hidden\$="[[group.configuration.hideGroupHeader]]">
        <yp-group-card-large id="groupCard" class="largeCard" group="[[group]]" on-update-group="_refreshAjax"></yp-group-card-large>
      </div>

      <div class="largeAddButton layout horizontal center-center" is-apple\$="[[isOldiOs]]" is-ipad\$="[[isIpad]]" hidden\$="[[group.configuration.hideNewPost]]">
        <yp-post-card-add disabled="[[disableNewPosts]]" on-new-post="_newPost" elevation="2"></yp-post-card-add>
      </div>

      <div class="layout horizontal center-center tabContainer" hide\$="[[group.configuration.hideAllTabs]]">
        <paper-tabs scrollable\$="[[!wideWidth]]" id="paperTabs" has-non-open-posts\$="[[hasNonOpenPosts]]" class="tabs" selected="{{selectedTab}}" attr-for-selected="name" focused="">
          <paper-tab id="tab1" name="open">
            <div class="layout vertical center-center tabCounterContainer">
              <div hidden\$="[[isTabOpen]]">
                [[t('posts.open')]]
              </div>
              <div hidden\$="[[!isTabOpen]]" class="tabSubTitsle">
                [[tabOpenSubTitle]]
              </div>
              <div class="counterInfo" has-non-open-posts\$="[[hasNonOpenPosts]]" id="tabCountOpen"></div>
            </div>
          </paper-tab>
          <template is="dom-if" if="[[hasNonOpenPosts]]">
            <paper-tab name="in_progress">
              <div class="layout vertical center-center tabCounterContainer">
                <div>
                  [[t('posts.inProgress')]]
                </div>
                <div hidden\$="[[!isTabInProgress]]" class="tabSubTitle">
                  [[tabInProgressSubTitle]]
                </div>
                <div hidden\$="[[isTabInProgress]]" has-non-open-posts\$="[[hasNonOpenPosts]]" class="counterInfo" id="tabCountInProgress"></div>
              </div>
            </paper-tab>
            <paper-tab name="successful">
              <div class="layout vertical center-center tabCounterContainer">
                <div>
                  [[t('posts.successful')]]
                </div>
                <div hidden\$="[[!isTabSuccessful]]" class="tabSubTitle">
                  [[tabSuccessfulSubTitle]]
                </div>
                <div hidden\$="[[isTabSuccessful]]" has-non-open-posts\$="[[hasNonOpenPosts]]" class="counterInfo" id="tabCountSuccessful"></div>
              </div>
            </paper-tab>
            <paper-tab name="failed">
              <div class="layout vertical center-center tabCounterContainer">
                <div>
                  [[t('posts.failed')]]
                </div>
                <div hidden\$="[[!isTabFailed]]" class="tabSubTitle">
                  [[tabFailedSubTitle]]
                </div>
                <div hidden\$="[[isTabFailed]]" has-non-open-posts\$="[[hasNonOpenPosts]]" class="counterInfo" id="tabCountFailed"></div>
              </div>
            </paper-tab>
          </template>
          <paper-tab name="news">[[t('news')]]</paper-tab>
          <paper-tab name="map" hidden\$="[[locationHidden]]">[[t('posts.map')]]</paper-tab>
        </paper-tabs>
      </div>

      <iron-pages id="tabPages" class="tabPages" selected="{{selectedTab}}" attr-for-selected="name" entry-animation="fade-in-animation" exit-animation="fade-out-animation">
        <section name="open">
          <div class="layout horizontal center-center">
            <yp-post-list id="openPostList" sub-title="{{tabOpenSubTitle}}" selected-tab="[[selectedTab]]" list-route="[[listRoute]]" status-filter="open" tab-counter-id="tabCountOpen" searching-for="[[searchingFor]]" group="[[group]]" group-id="[[lastValidGroupId]]"></yp-post-list>
          </div>
        </section>
        <section name="news" class="minHeightSection">
          <template is="dom-if" if="[[newsTabSelected]]">
            <ac-activities id="groupActivities" disable-new-posts="[[disableNewPosts]]" selected-tab="[[selectedTab]]" list-route="[[listRoute]]" group-id="[[group.id]]"></ac-activities>
          </template>
        </section>
        <template is="dom-if" if="[[hasNonOpenPosts]]">
          <section name="in_progress">
            <div class="layout horizontal center-center">
              <yp-post-list id="inProgressPostList" sub-title="{{tabInProgressSubTitle}}" selected-tab="[[selectedTab]]" list-route="[[listRoute]]" status-filter="in_progress" tab-counter-id="tabCountInProgress" searching-for="[[searchingFor]]" group="[[group]]" group-id="[[lastValidGroupId]]"></yp-post-list>
            </div>
          </section>
          <section name="successful">
            <div class="layout horizontal center-center">
              <yp-post-list id="successfulPostList" sub-title="{{tabSuccessfulSubTitle}}" selected-tab="[[selectedTab]]" list-route="[[listRoute]]" status-filter="successful" tab-counter-id="tabCountSuccessful" searching-for="[[searchingFor]]" group="[[group]]" group-id="[[lastValidGroupId]]"></yp-post-list>
            </div>
          </section>
          <section name="failed">
            <div class="layout horizontal center-center">
              <yp-post-list id="failedPostList" sub-title="{{tabFailedSubTitle}}" selected-tab="[[selectedTab]]" list-route="[[listRoute]]" status-filter="failed" tab-counter-id="tabCountFailed" searching-for="[[searchingFor]]" group="[[group]]" group-id="[[lastValidGroupId]]"></yp-post-list>
            </div>
          </section>
        </template>
        <section name="map" hidden\$="[[locationHidden]]" class="minHeightSection">
          <template is="dom-if" if="[[mapActive]]" restamp="">
            <yp-post-map group-id="[[group.id]]"></yp-post-map>
          </template>
        </section>
      </iron-pages>
    </div>

    <template is="dom-if" if="[[!disableNewPosts]]" restamp="">
      <div class="create-fab-wrapper layout horizontal end-justified createFabContainer" hidden\$="[[disableNewPosts]]">
          <paper-fab class="createFab" icon="[[createFabIcon]]" elevation="5" wide-layout\$="{{wideWidth}}" title="[[createFabTitle]]" on-tap="_newPost"></paper-fab>
      </div>
    </template>

    <iron-scroll-threshold id="scrollTheshold" lower-threshold="550" on-lower-threshold="_loadMoreData" scroll-target="document">
    </iron-scroll-threshold>

    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>
    <lite-signal on-lite-signal-yp-refresh-group-posts="_refreshGroupPosts"></lite-signal>
    <lite-signal on-lite-signal-yp-refresh-activities-scroll-threshold="_clearScrollThreshold"></lite-signal>

    <iron-media-query query="(min-width: 1024px)" query-matches="{{wideWidth}}"></iron-media-query>

    <app-route route="{{idRoute}}" pattern="/:id" data="{{idRouteData}}" tail="{{tabRoute}}">
    </app-route>

    <app-route route="{{tabRoute}}" pattern="/:tabName" data="{{tabRouteData}}" tail="{{listRoute}}">
    </app-route>

    <div class="layout horizontal center-center">
      <yp-ajax large-spinner="" id="ajax" on-response="_groupsResponse"></yp-ajax>
      <yp-ajax id="pagesAjax" on-response="_pagesResponse"></yp-ajax>
    </div>
`,

  is: 'yp-group',

  behaviors: [
    ypLanguageBehavior,
    ypThemeBehavior,
    YpNewsTabSelected,
    ypDetectOldiOs,
    ypGotoBehavior,
    ypImageFormatsBehavior,
    ypNumberFormatBehavior
  ],

  listeners: {
    'yp-post-count': '_updateTabPostCount',
    'yp-post-new': '_newPost'
  },

  properties: {

    idRoute: Object,
    tabRoute: Object,
    idRouteData: Object,
    tabRouteData: Object,
    listRoute: Object,

    createFabIcon: {
      type: String,
      value: "lightbulb-outline"
    },

    groupId: {
      type: Number,
      observer: "_groupIdChanged"
    },

    group: {
      type: Object,
      notify: true,
      value: null
    },

    searchingFor: {
      type: String,
      value: null
    },

    selectedTab: {
      type: String,
      value: 'open',
      observer: '_selectedTabChanged'
    },

    hasNonOpenPosts: {
      type: Boolean,
      value: false,
      observer: '_refreshTabsAndPages'
    },

    mapActive: {
      type: Boolean,
      value: false
    },

    lastValidGroupId: {
      type: String
    },

    disableNewPosts: {
      type: Boolean,
      value: false
    },

    locationHidden: {
      type: Boolean,
      value: false
    },

    haveGotTabCountInfoCount: {
      type: Number,
      value: 0
    },

    tabCounters: {
      type: Object,
      value: {}
    },

    tabOpenSubTitle: String,
    tabInProgressSubTitle: String,
    tabSuccessfulSubTitle: String,
    tabFailedSubTitle: String,

    isTabOpen: {
      type: Boolean,
      computed: '_isTabOpen(selectedTab)'

    },

    isTabInProgress: {
      type: Boolean,
      computed: '_isTabInProgress(selectedTab)'
    },

    isTabSuccessful: {
      type: Boolean,
      computed: '_isTabSuccessful(selectedTab)'
    },

    isTabFailed: {
      type: Boolean,
      computed: '_isTabFailed(selectedTab)'
    },

    isOldiOs: {
      type: Boolean,
      computed: '_isOldiOs(groupId)'
    },

    isIpad: {
      type: Boolean,
      computed: '_isIpad(groupId)'
    }
  },

  observers: [
    '_routeIdChanged(idRouteData.id)',
    '_routeTabChanged(tabRouteData.tabName)'
  ],

  _isTabOpen: function (selectedTab) {
    return selectedTab==='open';
  },

  _isTabInProgress: function (selectedTab) {
    return selectedTab==='in_progress';
  },

  _isTabFailed: function (selectedTab) {
    return selectedTab==='failed';
  },

  _isTabSuccessful: function (selectedTab) {
    return selectedTab==='successful';
  },

  _clearScrollThreshold: function () {
    this.$$("#scrollTheshold").clearTriggers();
    console.info("Clearing scrolling triggers for group");
  },

  _loadDataOnTab: function (tabId) {
    var tab = this.$$("#"+tabId);
    if (tab) {
      tab._loadMoreData();
    } else {
      console.error("Cant find tab "+tabId);
    }
  },

  _isIpad: function () {
    return /iPad/.test(navigator.userAgent) && !window.MSStream;
  },

  _loadMoreData: function () {
    if (this.selectedTab=="open") {
      this._loadDataOnTab("openPostList");
    } else if (this.selectedTab=="in_progress") {
      this._loadDataOnTab("inProgressPostList");
    } else if (this.selectedTab=="successful") {
      this._loadDataOnTab("successfulPostList");
    } else if (this.selectedTab=="failed") {
      this._loadDataOnTab("failedPostList");
    }
  },

  _refreshGroupPosts: function () {
    this.$$("#openPostList")._refreshGroupFromFilter();
  },

  _routeIdChanged: function (newId) {
    if (newId) {
      this.set('groupId', newId);
    }
  },

  _routeTabChanged: function (newTabName) {
    if (newTabName) {
      this.set('selectedTab', newTabName);
    }
  },

  _selectedTabChanged: function (tabName) {
    if (tabName=='config') {
      this.async(function () {
        var configRoute = this.listRoute.path;
        var groupId = this.idRoute.path.split("/")[1];
        var configOverride= configRoute.substring(1, configRoute.length);
        if (groupId && configOverride && configOverride!="")
        window.appGlobals.setupGroupConfigOverride(groupId, configOverride);
        this.set('selectedTab', 'open');
      });
    } else {
      if (this.group) {
        this.redirectTo("/group/" + this.group.id + '/' + tabName);
      }

      if (tabName == "map") {
        this.set('mapActive', true);
      } else {
        this.set('mapActive', false);
      }

      if (tabName && window.appGlobals) {
        window.appGlobals.activity('open', 'group_tab_' + tabName);
      }

      this.async(function () {
        var news = this.$$("#groupActivities");
        if (news) {
          news.fireResize();
        }
      }, 300);
    }
  },

  _refreshTabsAndPages: function () {
    this.async(function () {
      var pages = this.$$("#tabPages");
      if (pages) {
        pages.forceSynchronousItemUpdate();
      }

      var paperTabs = this.$$("#paperTabs");
      if (paperTabs) {
        paperTabs.forceSynchronousItemUpdate();
        paperTabs.notifyResize();
      }
    }, 10);
  },

  _updateTabPostCount: function (event, tabCounterInfo) {
    var tabCounter = this.$$('#'+tabCounterInfo.tabCounterId);
    if (tabCounter) {
      tabCounter.innerHTML = this.formatNumber(tabCounterInfo.count);
      this.tabCounters[tabCounterInfo.tabCounterId] = tabCounterInfo.count;
    }

    this.haveGotTabCountInfoCount+=1;

    if (this.hasNonOpenPosts) {
      if (this.haveGotTabCountInfoCount==4) {
        if (this.tabCounters["tabCountOpen"] && this.tabCounters["tabCountOpen"]>0) {
          this.set('selectedTab', 'open');
        } else if (this.tabCounters["tabCountInProgress"] && this.tabCounters["tabCountInProgress"]>0) {
          this.set('selectedTab', 'in_progress');
        } else if (this.tabCounters["tabCountSuccessful"] && this.tabCounters["tabCountSuccessful"]>0) {
          this.set('selectedTab', 'successful');
        } else if (this.tabCounters["tabCountFailed"] && this.tabCounters["tabCountFailed"]>0) {
          this.set('selectedTab', 'failed');
        }
      }
    }
  },

  _searchingForChanged: function (newValue, oldValue) {
  },

  _filterChanged: function (newValue, oldValue) {
  },

  _categoryIdChanged: function (newValue, oldValue) {
  },

  _openEdit: function () {
    this.$$("#groupEdit").open('edit', { groupId: this.group.id });
  },

  _refreshAjax: function () {
    this.$.ajax.generateRequest();
    var groupActivities = this.$$("#groupActivities");
    if (groupActivities) {
      this.$$("#groupActivities").loadNewData();
    }
  },

  ready: function () {
  },

  _groupIdChanged: function (newValue, oldValue) {
    if (newValue && newValue!=this.lastValidGroupId) {
      this.set('lastValidGroupId', newValue);
      this.set('group', null);
      this.$.groupCard.resetGroup();
      this.$.tabCountOpen.innerHTML = "";
      if (this.hasNonOpenPosts) {
        this.$$("#tabCountInProgress").innerHTML = "";
        this.$$("#tabCountSuccessful").innerHTML = "";
        this.$$("#tabCountFailed").innerHTML = "";
      }
      this.set('selectedTab', 'open');
      this.set('hasNonOpenPosts', false);
      this.set('haveGotTabCountInfoCount', 0);
      this.set('tabCounters', {});
      this._getGroup();
    }
  },

  _getGroup: function () {
    this.$.ajax.url = '/api/groups/' + this.groupId;
    this.$.ajax.retryMethodAfter401Login = this._getGroup.bind(this);
    this.$.ajax.generateRequest();
  },

  _pagesResponse: function (event, detail) {
    this.fire('yp-set-pages', detail.response);
  },

  _groupsResponse: function (event, detail, sender) {
    this.set('group', detail.response.group);

    this.set('group.configuration', window.appGlobals.overrideGroupConfigIfNeeded(this.group.id, this.group.configuration));

    this.refresh();

    if (this.group.configuration.canAddNewPosts!=undefined) {
      if (this.group.configuration.canAddNewPosts===true) {
        this.set('disableNewPosts', false);
      } else {
        this.set('disableNewPosts', true);
      }
    } else {
      this.set('disableNewPosts', false);
    }

    this.set('hasNonOpenPosts', detail.response.hasNonOpenPosts);

    if (this.selectedTab=='edit') {
      this.set('tabName', 'open');
      this.$$("#groupCard")._openEdit();
    }
  },

  setupTopHeaderImage: function (image) {
    if (this.wideWidth) {
      var path;
      if (image) {
        path = 'url(' + this.getImageFormatUrl(image, 0) + ')';
      } else {
        path = 'none';
      }
      this.updateStyles( {'--top-area-background-image': path });
    }
  },

  refresh: function () {
    if (this.group) {
      this.fire('yp-set-home-link', {
        type: 'group',
        id: this.group.id,
        name: this.group.name
      });

      if (this.group.configuration.defaultLocale!=null) {
        window.appGlobals.changeLocaleIfNeeded(this.group.configuration.defaultLocale);
      }

      window.appGlobals.setCommunityAnalyticsTracker(this.group.Community.google_analytics_code);

      if (this.group.Community.configuration) {
        window.appGlobals.setCommunityPixelTracker(this.group.Community.configuration.facebookPixelId);
      }

      if (this.group.theme_id!=null) {
        this.setTheme(this.group.theme_id);
      } else if (this.group.Community.theme_id!=null) {
        this.setTheme(this.group.Community.theme_id);
      } else if (this.group.Community.Domain.theme_id!=null) {
        this.setTheme(this.group.Community.Domain.theme_id);
      }

      if (this.group.configuration.locationHidden) {
        if (this.group.configuration.locationHidden == true) {
          this.set('locationHidden', true);
        } else {
          this.set('locationHidden', false);
        }
      } else {
        this.set('locationHidden', false);
      }

      this._refreshTabsAndPages();

      if (this.group.GroupHeaderImages && this.group.GroupHeaderImages.length>0) {
        this.setupTopHeaderImage(this.group.GroupHeaderImages);
      } else {
        this.setupTopHeaderImage(null);
      }

      this.fire("change-header", {
        headerTitle: this.group.configuration.fixedReturnUrlName ?
                       this.group.configuration.fixedReturnUrlName :
                       this.group.Community.name,
        headerDescription: this.group.Community.description,
        headerIcon: "social:group",
        documentTitle: this.group.name,
        enableSearch: true,
        hideHelpIcon: this.group.configuration.hideHelpIcon ? true : null,
        useHardBack: this.group.configuration.fixedReturnUrl ? true : false,
        backPath:  this.group.configuration.fixedReturnUrl ?
                     this.group.configuration.fixedReturnUrl :
                     "/community/" + this.group.community_id
      });

      this.$.pagesAjax.url = "/api/groups/"+this.group.id+"/pages";
      this.$.pagesAjax.generateRequest();

      window.appGlobals.setAnonymousGroupStatus(this.group);

      if (this.group.configuration && this.group.configuration.disableFacebookLoginForGroup===true) {
        window.appGlobals.disableFacebookLoginForGroup = true;
      } else {
        window.appGlobals.disableFacebookLoginForGroup = false;
      }

      if (this.group.configuration && this.group.configuration.externalGoalTriggerUrl) {
        window.appGlobals.externalGoalTriggerUrl = this.group.configuration.externalGoalTriggerUrl;
      } else {
        window.appGlobals.externalGoalTriggerUrl = null;
      }
    }
  },

  _newPost: function () {
    window.appGlobals.activity('open', 'newPost');
    dom(document).querySelector('yp-app').getDialogAsync("postEdit", function (dialog) {
      dialog.setup(null, true, null);
      dialog.open('new', {groupId: this.groupId, group: this.group});
    }.bind(this));
  }
});
