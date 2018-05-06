import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/iron-pages/iron-pages.js';
import '../../../../@polymer/paper-tabs/paper-tab.js';
import '../../../../@polymer/paper-tabs/paper-tabs.js';
import '../../../../@polymer/app-route/app-route.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { CollectionHelpers } from '../yp-behaviors/collection-helpers.js';
import { YpNewsTabSelected } from '../yp-behaviors/yp-news-tab-selected.js';
import { ypLoggedInUserBehavior } from '../yp-behaviors/yp-logged-in-user-behavior.js';
import { ypDetectOldiOs } from '../yp-behaviors/yp-detect-old-ios.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { ypImageFormatsBehavior } from '../yp-behaviors/yp-image-formats-behavior.js';
import '../ac-activities/ac-activities.js';
import { ypThemeBehavior } from '../yp-theme/yp-theme-behavior.js';
import '../yp-post/yp-post-map.js';
import '../yp-ajax/yp-ajax.js';
import '../yp-page/yp-page.js';
import { GroupCollectionBehaviors } from '../yp-group/yp-group-collection-behaviors.js';
import '../yp-group/yp-group-grid.js';
import './yp-community-header.js';
import './yp-community-large-card.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { AccessHelpers } from '../yp-behaviors/access-helpers.js';
import { dom } from '../../../../@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      .card-container {
        @apply --layout-horizontal;
        @apply --layout-wrap;
      }

      .card {
        padding: 16px;
      }

      yp-ajax {
        background-color: var(--primary-background-color) !important;
      }

      .archivedText {
        font-size: 26px;
        color: #333;
      }

      .minHeightSection {
        min-height: 450px;
      }

      #paper_tabs[apple] {
        margin-top: 42px;
        margin-bottom: 8px;
      }

      [hidden] {
        display: none !important;
      }
    </style>

    <yp-page id="page" create-fab-icon="[[createFabIcon]]" create-fab-title="[[t('group.add')]]" on-yp-create-fab-tap="_newGroup">

      <template is="dom-if" if="[[useAlternativeHeader]]">
        <yp-community-header id="communityCard" slot="largeCard" class="largeCard card" community="[[community]]" on-update-community="_refreshAjax"></yp-community-header>
      </template>

      <template is="dom-if" if="[[useNormalHeader]]">
        <yp-community-large-card id="communityCard" slot="largeCard" class="largeCard card" community="[[community]]" on-update-community="_refreshAjax"></yp-community-large-card>
      </template>

      <paper-tabs id="paper_tabs" apple\$="[[isOldiOs]]" slot="tabs" class="tabs" selected="{{selectedTab}}" attr-for-selected="name" focused="">
        <paper-tab name="groups" class="tab"><span>[[t('groups')]]</span> &nbsp; (<span>[[groupsLength]]</span>)</paper-tab>
        <paper-tab name="news" class="tab">[[t('news')]]</paper-tab>
        <paper-tab name="map" class="tab" hidden\$="[[locationHidden]]">[[t('posts.map')]]</paper-tab>
      </paper-tabs>

      <iron-pages class="tabPages" slot="tabPages" selected="{{selectedTab}}" attr-for-selected="name" entry-animation="fade-in-animation" exit-animation="fade-out-animation">
        <section name="groups">
          <div class="layout horizontal center-center wrap">
            <yp-group-grid featured-groups="[[featuredGroups]]" active-groups="[[activeGroups]]" archived-groups="[[archivedGroups]]" hide-add\$="[[!createFabIcon]]" on-add-new-group="_newGroup">
            </yp-group-grid>
          </div>
        </section>
        <section class="minHeightSection" name="news">
          <template is="dom-if" if="[[newsTabSelected]]">
            <ac-activities id="communityNews" selected-tab="[[selectedTab]]" community-id="[[community.id]]"></ac-activities>
          </template>
        </section>
        <section class="minHeightSection" name="map" hidden\$="[[locationHidden]]">
          <template is="dom-if" if="[[mapActive]]" restamp="">
            <yp-post-map community-id="[[community.id]]"></yp-post-map>
          </template>
        </section>
      </iron-pages>
    </yp-page>

    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>
    <lite-signal on-lite-signal-logged-in="_userLoggedIn"></lite-signal>
    <lite-signal on-lite-signal-got-admin-rights="_gotAdminRights"></lite-signal>

    <app-route route="{{idRoute}}" pattern="/:id" data="{{idRouteData}}" tail="{{tabRoute}}">
    </app-route>

    <app-route route="{{tabRoute}}" pattern="/:tabName" data="{{tabRouteData}}">
    </app-route>

    <yp-ajax id="ajax" url="/api/communities" on-response="_response"></yp-ajax>
    <yp-ajax id="pagesAjax" on-response="_pagesResponse"></yp-ajax>
`,

  is: 'yp-community',

  behaviors: [
    ypLanguageBehavior,
    GroupCollectionBehaviors,
    ypThemeBehavior,
    CollectionHelpers,
    AccessHelpers,
    YpNewsTabSelected,
    ypLoggedInUserBehavior,
    ypDetectOldiOs,
    ypGotoBehavior,
    ypImageFormatsBehavior
  ],

  properties: {

    idRoute: Object,
    tabRoute: Object,
    idRouteData: Object,
    tabRouteData: Object,

    createFabIcon: {
      type: String,
      value: null,
      notify: true
    },

    communityId: {
      type: Number,
      value: null,
      observer: "_communityIdChanged"
    },

    community: {
      type: Object
    },

    selectedTab: {
      type: String,
      value: 'groups',
      observer: '_selectedTabChanged'
    },

    mapActive: {
      type: Boolean,
      value: false
    },

    locationHidden: {
      type: Boolean,
      value: false
    },

    useAlternativeHeader: {
      type: Boolean,
      value: false
    },

    isOldiOs: {
      type: Boolean,
      computed: '_isOldiOs(communityId)'
    },

    useNormalHeader: {
      type: Boolean,
      value: true
    }
  },

  observers: [
    '_routeIdChanged(idRouteData.id)',
    '_routeTabChanged(tabRouteData.tabName)'
  ],

  listeners: {
    'yp-new-group': '_newGroup'
  },

  _userLoggedIn: function (user) {
    if (user) {
      if (this.community && window.location.href.indexOf("/community/") > -1) {
        this.$$('#ajax').generateRequest();
      }
    }
  },

  _newPostForGroup: function (group) {
    window.appGlobals.activity('open', 'newPost');
    dom(document).querySelector('yp-app').getDialogAsync("postEdit", function (dialog) {
      dialog.setup(null, true, null);
      dialog.open('new', {groupId: group.id, group: group});
    }.bind(this));
  },

  _refreshTabsAndPages: function () {
    this.async(function () {
      var pages = this.$$("#tabPages");
      if (pages) {
        pages.forceSynchronousItemUpdate();
      }

      var paperTabs = this.$$("#paper_tabs");
      if (paperTabs) {
        paperTabs.forceSynchronousItemUpdate();
        paperTabs.notifyResize();
      }
    }, 10);
  },

  _routeIdChanged: function (newId) {
    if (newId) {
      this.set('communityId', newId);
    }
  },

  _routeTabChanged: function (newTabName) {
    if (newTabName) {
      this.set('selectedTab', newTabName);
    }
  },

  _selectedTabChanged: function (tabName) {
    if (this.community) {
      this.redirectTo("/community/" + this.community.id + '/' + tabName);
    }

    if (tabName == "map") {
      this.set('mapActive', true);
    } else {
      this.set('mapActive', false);
    }

    if (tabName && window.appGlobals) {
      window.appGlobals.activity('open', 'community_tab_' + tabName);
    }

    this.async(function () {
      var news = this.$$("#communityNews");
      if (news) {
        news.fireResize();
      }
    }, 300);
  },

  _hideEdit: function () {
    if (!this.community)
      return true;

    if (!window.appUser.loggedIn())
      return true;

    return (window.appUser.user.id!=this.community.user_id);
  },

  _communityHeaderUrl: function (community) {
    return this.getImageFormatUrl(community.CommunityHeaderImages, 2);
  },

  _communityIdChanged: function (newValue, oldValue) {
    if (newValue) {
      this.set("community", null);
      this.set("featuredGroups",null);
      this.set("activeGroups",null);
      this.set("archivedGroups",null);
      this.set("selectedTab", "groups");
      this._getCommunity();
    }
  },

  _getCommunity: function () {
    this.$$('#ajax').url = '/api/communities/' + this.communityId;
    this.$$('#ajax').retryMethodAfter401Login = this._getCommunity.bind(this);
    this.$$('#ajax').generateRequest();
  },

  _newGroup: function () {
    window.appGlobals.activity('open', 'newGroup');
    dom(document).querySelector('yp-app').getDialogAsync("groupEdit", function (dialog) {
      dialog.setup(null, true, this._refreshAjax.bind(this));
      dialog.open('new', { communityId: this.communityId, community: this.community });
    }.bind(this));
  },

  _pagesResponse: function (event, detail) {
    this.fire('yp-set-pages', detail.response);
  },

  _response: function (event, detail, sender) {
    this.set('community', detail.response);

    this.refresh();

    if (!this.community.only_admins_can_create_groups || this.checkCommunityAccess(this.community)) {
      this.set('createFabIcon', 'add');
    }

    var url = this._communityHeaderUrl(this.community);

    this.setupGroups(this.community.Groups);
    this._setLocationHidden(this.community.Groups);

    this.async(function() {
      var communityCard = this.$$('#communityCard');
      if (communityCard) {
        communityCard.setElevation(5);
        communityCard.lowerCardLater();
      }
    },20);
  },

  _gotAdminRights: function (event, detail) {
    if (detail && detail>0) {
      if (this.checkCommunityAccess(this.community)) {
        this.set('createFabIcon', 'add');
      }
    }
  },

  _setLocationHidden: function (groups) {
    var locationHidden = true;
    groups.forEach(function(group) {
      if (group.configuration && group.configuration.locationHidden) {
        if (group.configuration.locationHidden != true) {
          locationHidden = false;
        }
      } else {
        locationHidden = false;
      }
    }.bind(this));
    this.set('locationHidden', locationHidden);
    this._refreshTabsAndPages();
  },

  refresh: function () {
    if (this.community) {
      this.fire('yp-set-home-link', { type: 'community', id: this.community.id, name: this.community.name });

      window.appGlobals.setCommunityAnalyticsTracker(this.community.google_analytics_code);

      if (this.community.configuration) {
        window.appGlobals.setCommunityPixelTracker(this.community.configuration.facebookPixelId);
      }

      if (this.community.theme_id!=null) {
        this.setTheme(this.community.theme_id);
      } else if (this.community.Domain.theme_id!=null) {
        this.setTheme(this.community.Domain.theme_id);
      }

      if (this.community.default_locale!=null) {
        window.appGlobals.changeLocaleIfNeeded(this.community.default_locale);
      }

      if (this.community.configuration && this.community.configuration.alternativeHeader && this.community.configuration.alternativeHeader!="") {
        this.set('useAlternativeHeader', true);
        this.set('useNormalHeader', false);
      } else {
        this.set('useAlternativeHeader', false);
        this.set('useNormalHeader', true);
      }

      if (this.community.CommunityHeaderImages && this.community.CommunityHeaderImages.length>0) {
        this.$.page.setupTopHeaderImage(this.community.CommunityHeaderImages);
      } else {
        this.$.page.setupTopHeaderImage(null);
      }

      this.fire("change-header", { headerTitle: this.community.Domain.name,
                                   headerDescription: this.community.Domain.description,
                                   headerIcon: "group-work",
                                   disableDomainUpLink: (this.community.configuration &&
                                                         this.community.configuration.disableDomainUpLink === true),
                                   documentTitle: this.community.name,
                                   backPath: "/domain/" + this.community.domain_id });
      this.$.pagesAjax.url = "/api/communities/"+this.community.id+"/pages";
      this.$.pagesAjax.generateRequest();
      window.appGlobals.setAnonymousGroupStatus(null);
      window.appGlobals.disableFacebookLoginForGroup = false;
      window.appGlobals.externalGoalTriggerUrl = null;
    }
  },

  defaultGroupFirst: function (items) {
    var filtered = [];
    var defaultGroup = null;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.short_name != 'default') {
        filtered.push(item);
      } else {
        defaultGroup = item;
      }
    }
    filtered.unshift(defaultGroup);
    return filtered;
  },

  noTestGroup: function (items) {
    var filtered = [];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.short_name != 'test' && item.short_name != 'ac-posts' && item.short_name != 'development' && item.short_name.indexOf('2012') == -1 && item.short_name.indexOf('2013') == -1) {
        filtered.push(item);
      }
    }
    return filtered;
  },

  _refreshAjax: function () {
    this.$$('#ajax').generateRequest();
  },

  ready: function () {
  }
});
