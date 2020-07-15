import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-tabs/paper-tab.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/app-route/app-route.js';
import { CollectionHelpers } from '../yp-behaviors/collection-helpers.js';
import { YpNewsTabSelected } from '../yp-behaviors/yp-news-tab-selected.js';
import { ypLoggedInUserBehavior } from '../yp-behaviors/yp-logged-in-user-behavior.js';
import { ypDetectOldiOs } from '../yp-behaviors/yp-detect-old-ios.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { ypMediaFormatsBehavior } from '../yp-behaviors/yp-media-formats-behavior.js';
import '../ac-activities/ac-activities.js';
import { ypThemeBehavior } from '../yp-theme/yp-theme-behavior.js';
import '../yp-post/yp-post-map.js';
import '../yp-ajax/yp-ajax.js';
import '../yp-page/yp-page.js';
import { GroupCollectionBehaviors } from '../yp-group/yp-group-collection-behaviors.js';
import '../yp-group/yp-group-grid.js';
import './yp-community-header.js';
import './yp-community-large-card.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { AccessHelpers } from '../yp-behaviors/access-helpers.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { YpBaseElement } from '../yp-base-element.js';
import { YpFlexLayout } from '../yp-flex-layout.js';

class YpCommunityLit extends YpBaseElement {
  static get properties() {
    return {
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
    }
  }

  static get styles() {
    return [
      css`

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
  `, YpFlexLayout]
}

  render() {
    return html`
    <yp-page id="page" create-fab-icon="${this.createFabIcon}" create-fab-title="${this.t('group.add')}" @yp-create-fab-tap="${this._newGroup}" .hideAllTabs="${this.community.configuration.hideAllTabs}">

      ${this.useAlternativeHeader ? html`
        <yp-community-header id="communityCard" slot="largeCard" class="largeCard card" .community="${this.community}" @update-community="${this._refreshAjax}"></yp-community-header>
      `: html``}

      ${useNormalHeader ? html`
        <yp-community-large-card id="communityCard" slot="largeCard" class="largeCard card" .community="${this.community}" @update-community="${this._refreshAjax}"></yp-community-large-card>
      `: html``}

      <paper-tabs id="paper_tabs" .apple="${this.isOldiOs}" slot="tabs" class="tabs" .selected="${this.selectedTab}" .attrForSelected="name" .focused ?hidden="${this.community.configuration.hideAllTabs}">
        <paper-tab .name="groups" class="tab"><span>${this.t('groups')}</span> &nbsp; (<span>${this.groupsLength}</span>)</paper-tab>
        <paper-tab .name="news" class="tab">${this.t('news')}</paper-tab>
        <paper-tab .name="map" class="tab" ?hidden="${this.locationHidden}">${this.t('posts.map')}</paper-tab>
      </paper-tabs>

      <iron-pages class="tabPages" slot="tabPages" .selected="${this.selectedTab}" .attrForSelected="name" .entryAnimation="fade-in-animation" .exitAnimation="fade-out-animation">
        <section .name="groups">
          <div class="layout horizontal center-center">
            <yp-group-grid id="groupGrid" .featuredGroups="${this.featuredGroups}" .activeGroups="${this.activeGroups}" .archivedGroups="${this.archivedGroups}" .hideAdd="${!this.createFabIcon}" @add-new-group="${this._newGroup}">
            </yp-group-grid>
          </div>
        </section>
        <section class="minHeightSection" .name="news">
          ${this.newsTabSelected ? html`
            <ac-activities id="communityNews" .selectedTab="${this.selectedTab}" .communityId="${this.community.id}"></ac-activities>
          `: html``}

        </section>
        <section class="minHeightSection" .name="map" ?hidden="${this.locationHidden}">
          ${this.mapActive ? html`
            <yp-post-map .communityId="${this.community.id}"></yp-post-map>
          `: html``}

        </section>
      </iron-pages>
    </yp-page>

    <lite-signal @lite-signal-logged-in="${this._userLoggedIn}"></lite-signal>
    <lite-signal @lite-signal-got-admin-rights="${this._gotAdminRights}"></lite-signal>

    <app-route .route="${this.idRoute}" .pattern="/:id" .data="${this.idRouteData}" .tail="${this.tabRoute}">
    </app-route>

    <app-route .route="${this.tabRoute}" .pattern="/:tabName" .data="${this.tabRouteData}">
    </app-route>

    <yp-ajax id="ajax" url="/api/communities" @response="${this._response}"></yp-ajax>
    <yp-ajax id="pagesAjax" @response="${this._pagesResponse}"></yp-ajax>
`
  }

/*
  behaviors: [
    GroupCollectionBehaviors,
    ypThemeBehavior,
    CollectionHelpers,
    AccessHelpers,
    YpNewsTabSelected,
    ypLoggedInUserBehavior,
    ypDetectOldiOs,
    ypGotoBehavior,
    ypMediaFormatsBehavior
  ],


  observers: [
    '_routeIdChanged(idRouteData.id)',
    '_routeTabChanged(tabRouteData.tabName)'
  ],

  listeners: {
    'yp-new-group': '_newGroup'
  },

 */

  _userLoggedIn(user) {
    if (user) {
      if (this.community && window.location.href.indexOf("/community/") > -1) {
        this.$$('#ajax').generateRequest();
      }
    }
  }

  _newPostForGroup(group) {
    window.appGlobals.activity('open', 'newPost');
    dom(document).querySelector('yp-app').getDialogAsync("postEdit", function (dialog) {
      dialog.setup(null, true, null);
      dialog.open('new', {groupId: group.id, group: group});
    }.bind(this));
  }

  _refreshTabsAndPages() {
    this.async(function () {
      const pages = this.$$("#tabPages");
      if (pages) {
        pages.forceSynchronousItemUpdate();
      }

      const paperTabs = this.$$("#paper_tabs");
      if (paperTabs) {
        paperTabs.forceSynchronousItemUpdate();
        paperTabs.notifyResize();
      }
    }, 10);
  }

  scrollToGroupItem() {
    if (this.selectedTab==="news" && window.appGlobals.cachedActivityItem!==null) {
      const list = this.$$("#communityNews");
      if (list) {
        list.scrollToItem(window.appGlobals.cachedActivityItem);
        window.appGlobals.cachedActivityItem = null;
      } else {
        console.warn("No community activities for scroll to item");
      }
    } else if (this.selectedTab==="groups") {
      if (window.appGlobals.backToCommunityGroupItems &&
        window.appGlobals.backToCommunityGroupItems[this.community.id]) {
        this.$$("#groupGrid").scrollToItem(window.appGlobals.backToCommunityGroupItems[this.community.id]);
        window.appGlobals.backToCommunityGroupItems[this.community.id] = null;
      }
    }
  }

  _routeIdChanged(newId) {
    if (newId) {
      this.set('communityId', newId);
    }
  }

  _routeTabChanged(newTabName) {
    if (newTabName) {
      this.set('selectedTab', newTabName);
    }
  }

  _selectedTabChanged(tabName) {
    if (this.community) {
      this.redirectTo("/community/" + this.community.id + '/' + tabName);
    }

    if (tabName == "map") {
      this.set('mapActive', true);
    } else {
      this.set('mapActive', false);
    }

    if (tabName && window.appGlobals) {
      window.appGlobals.activity('open', 'community_tab_' + tabName, '',
        { id: this.communityId });
    }

    this.async(function () {
      const news = this.$$("#communityNews");
      if (news) {
        news.fireResize();
      }
    }, 300);
  }

  _hideEdit() {
    if (!this.community)
      return true;

    if (!window.appUser.loggedIn())
      return true;

    return (window.appUser.user.id!=this.community.user_id);
  }

  _communityHeaderUrl(community) {
    return this.getImageFormatUrl(community.CommunityHeaderImages, 2);
  }

  _communityIdChanged(newValue, oldValue) {
    if (newValue) {
      this.set("community", null);
      this.set("featuredGroups",null);
      this.set("activeGroups",null);
      this.set("archivedGroups",null);
      this.set("selectedTab", "groups");
      this._getCommunity();
    }
  }

  _getCommunity() {
    this.$$('#ajax').url = '/api/communities/' + this.communityId;
    this.$$('#ajax').retryMethodAfter401Login = this._getCommunity.bind(this);
    this.$$('#ajax').generateRequest();
  }

  _newGroup() {
    window.appGlobals.activity('open', 'newGroup');
    dom(document).querySelector('yp-app').getDialogAsync("groupEdit", function (dialog) {
      dialog.setup(null, true, this._refreshAjax.bind(this));
      dialog.open('new', { communityId: this.communityId, community: this.community });
    }.bind(this));
  }

  _pagesResponse(event, detail) {
    this.fire('yp-set-pages', detail.response);
  }

  _response(event, detail, sender) {
    this.set('community', detail.response);

    if (this.community.is_community_folder) {
      this.redirectTo("/community_folder/"+this.community.id);
    } else {
      this.refresh();

      if (!this.community.is_community_folder && (!this.community.only_admins_can_create_groups || this.checkCommunityAccess(this.community))) {
        this.set('createFabIcon', 'add');
      }

      const url = this._communityHeaderUrl(this.community);

      this.setupGroups(this.community.Groups, this.community.configuration);
      this._setLocationHidden(this.community.Groups);

      if (this.community.Groups && this.community.Groups.length>0) {
        window.appGlobals.setAnonymousGroupStatus(this.community.Groups[0]);
      }
      this._setLocationHidden(this.community.Groups);

      this.async(function() {
        const communityCard = this.$$('#communityCard');
        if (communityCard) {
          communityCard.setElevation(5);
          communityCard.lowerCardLater();
        }
      },20);
    }
  }

  _gotAdminRights(event, detail) {
    if (detail && detail>0) {
      if (this.checkCommunityAccess(this.community)) {
        this.set('createFabIcon', 'add');
      }
    }
  }

  _setLocationHidden(groups) {
    let locationHidden = true;
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
  }

  _openHelpPageIfNeeded () {
    if (!sessionStorage.getItem("yp-welcome-for-community-"+this.community.id)) {
      if (this.community && this.community.configuration && this.community.configuration.welcomePageId) {
        this.async(function () {
          this.fire('yp-open-page', {pageId: this.community.configuration.welcomePageId});
          sessionStorage.setItem("yp-welcome-for-community-"+this.community.id, true)
        }, 1200);
      }
    }
  }

  _useHardBack (configuration) {
    if (configuration && configuration.customBackURL) {
      var backUrl = configuration.customBackURL;
      if (backUrl.startsWith("/community/") ||
        backUrl.startsWith("/group/") ||
        backUrl.startsWith("/domain/") ||
        backUrl.startsWith("/post/")) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  refresh() {
    if (this.community) {
      this._openHelpPageIfNeeded();
      this.fire('yp-set-home-link', { type: 'community', id: this.community.id, name: this.community.name });

      window.appGlobals.setCommunityAnalyticsTracker(this.community.google_analytics_code);

      if (this.community.configuration) {
        window.appGlobals.setCommunityPixelTracker(this.community.configuration.facebookPixelId);
      }

      if (this.community.theme_id!=null || (this.community.configuration && this.community.configuration.themeOverrideColorPrimary!=null)) {
        this.setTheme(this.community.theme_id, this.community.configuration);
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
        this.$$("#page").setupTopHeaderImage(this.community.CommunityHeaderImages);
      } else {
        this.$$("#page").setupTopHeaderImage(null);
      }

      if (window.location.href.indexOf("/community") >-1) {
        let backPath, headerTitle, headerDescription;
        if (this.community.CommunityFolder) {
          backPath = "/community_folder/" + this.community.CommunityFolder.id;
          headerTitle = this.community.CommunityFolder.name;
          headerDescription = this.community.CommunityFolder.description;
        } else {
          backPath = "/domain/" + this.community.domain_id;
          headerTitle = this.community.Domain.name;
          headerDescription = this.community.Domain.description;
        }
        this.fire("change-header", {
          headerTitle: this.community.configuration && this.community.configuration.customBackName ?
            this.community.configuration.customBackName :
            headerTitle,
          headerDescription: headerDescription,
          headerIcon: "group-work",
          useHardBack: this._useHardBack(this.community.configuration),
          disableDomainUpLink: (this.community.configuration &&
            this.community.configuration.disableDomainUpLink === true),
          documentTitle: this.community.name,
          backPath: this.community.configuration && this.community.configuration.customBackURL ?
            this.community.configuration.customBackURL : backPath
        });
      }
      this.$.pagesAjax.url = "/api/communities/"+this.community.id+"/pages";
      this.$.pagesAjax.generateRequest();
      window.appGlobals.disableFacebookLoginForGroup = false;
      window.appGlobals.externalGoalTriggerGroupId = null;
      window.appGlobals.currentGroup = null;

      if (this.community.configuration &&
          this.community.configuration.forceSecureSamlLogin &&
          !this.checkCommunityAccess(this.community)) {
        window.appGlobals.currentForceSaml = true;
      } else {
        window.appGlobals.currentForceSaml = false;
      }

      if (this.community.configuration && this.community.configuration.customSamlDeniedMessage) {
        window.appGlobals.currentSamlDeniedMessage = this.community.configuration.customSamlDeniedMessage;
      } else {
        window.appGlobals.currentSamlDeniedMessage = null;
      }

      if (this.community.configuration && this.community.configuration.customSamlLoginMessage) {
        window.appGlobals.currentSamlLoginMessage = this.community.configuration.customSamlLoginMessage;
      } else {
        window.appGlobals.currentSamlLoginMessage = null;
      }

      if (this.community.configuration && this.community.configuration.signupTermsPageId &&
          this.community.configuration.signupTermsPageId!=-1) {
        window.appGlobals.signupTermsPageId = this.community.configuration.signupTermsPageId;
      } else {
        window.appGlobals.signupTermsPageId = null;
      }

      if (this.community.configuration.highlightedLanguages) {
        window.appGlobals.setHighlightedLanguages(this.community.configuration.highlightedLanguages);
      } else {
        window.appGlobals.setHighlightedLanguages(null);
      }
    }
  }

  defaultGroupFirst(items) {
    const filtered = [];
    let defaultGroup = null;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.short_name != 'default') {
        filtered.push(item);
      } else {
        defaultGroup = item;
      }
    }
    filtered.unshift(defaultGroup);
    return filtered;
  }

  noTestGroup(items) {
    const filtered = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.short_name != 'test' && item.short_name != 'ac-posts' && item.short_name != 'development' && item.short_name.indexOf('2012') == -1 && item.short_name.indexOf('2013') == -1) {
        filtered.push(item);
      }
    }
    return filtered;
  }

  _refreshAjax() {
    this.async(function () {
      this.$$('#ajax').generateRequest();
    }, 100);
  }

  connectedCallback() {
    super.connectedCallback()
  }
}

window.customElements.define('yp-community-lit', YpCommunityLit)
