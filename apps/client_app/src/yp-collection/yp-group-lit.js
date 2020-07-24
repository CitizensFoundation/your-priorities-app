import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-scroll-threshold/iron-scroll-threshold.js';
import 'lite-signal/lite-signal.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-tabs/paper-tab.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/paper-fab/paper-fab.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-scroll-threshold/iron-scroll-threshold.js';
import '../yp-app-globals/yp-app-icons.js';
import { YpNewsTabSelected } from '../yp-behaviors/yp-news-tab-selected.js';
import { ypDetectOldiOs } from '../yp-behaviors/yp-detect-old-ios.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { ypMediaFormatsBehavior } from '../yp-behaviors/yp-media-formats-behavior.js';
import '../ac-activities/ac-activities.js';
import '../yp-ajax/yp-ajax.js';
import '../yp-post/yp-post-card.js';
import '../yp-post/yp-post-card-add.js';
import '../yp-post/yp-post-list.js';
import '../yp-post/yp-post-map.js';
import { ypThemeBehavior } from '../yp-theme/yp-theme-behavior.js';
import { ypNumberFormatBehavior } from '../yp-behaviors/yp-number-format-behavior.js';
import './yp-group-card-large.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';

class YpGroupLit extends YpBaseElement {
  static get properties() {
    return {
      shouldScrollTabs: {
        type: Boolean,
        computed: '_shouldScrollTabs(phoneWidth, hasNonOpenPosts)',
      }
    };
  }

  render() {
    return html`
      <div id="topContainer">

        <div
          class="layout horizontal center-center tabContainer"
          .hide="${this.group.configuration.hideAllTabs}">
          <paper-tabs
            .scrollable="${this.shouldScrollTabs}"
            id="paperTabs"
            has-non-open-posts="${this.hasNonOpenPosts}"
            class="tabs"
            .selected="${this.selectedTab}"
            attr-for-selected="name"
            focused>
            <paper-tab id="tab1" .name="open">
              <div class="layout vertical center-center tabCounterContainer">
                <div ?hidden="${this.isTabOpen}">
                  ${this.t('posts.open')}
                </div>
                <div ?hidden="${!this.isTabOpen}" class="tabSubTitsle">
                  ${this.tabOpenSubTitle}
                </div>
                <div
                  class="counterInfo"
                  has-non-open-posts="${this.hasNonOpenPosts}"
                  id="tabCountOpen"></div>
              </div>
            </paper-tab>

            ${this.hasNonOpenPosts
              ? html`
                  <paper-tab .name="in_progress">
                    <div
                      class="layout vertical center-center tabCounterContainer">
                      <div>
                        ${this.t('posts.inProgress')}
                      </div>
                      <div
                        ?hidden="${!this.isTabInProgress}"
                        class="tabSubTitle">
                        ${this.tabInProgressSubTitle}
                      </div>
                      <div
                        ?hidden="${this.isTabInProgress}"
                        has-non-open-posts="${this.hasNonOpenPosts}"
                        class="counterInfo"
                        id="tabCountInProgress"></div>
                    </div>
                  </paper-tab>
                  <paper-tab .name="successful">
                    <div
                      class="layout vertical center-center tabCounterContainer">
                      <div>
                        ${this.t('posts.successful')}
                      </div>
                      <div
                        ?hidden="${!this.isTabSuccessful}"
                        class="tabSubTitle">
                        ${this.tabSuccessfulSubTitle}
                      </div>
                      <div
                        ?hidden="${this.isTabSuccessful}"
                        has-non-open-posts="${this.hasNonOpenPosts}"
                        class="counterInfo"
                        id="tabCountSuccessful"></div>
                    </div>
                  </paper-tab>
                  <paper-tab .name="failed">
                    <div
                      class="layout vertical center-center tabCounterContainer">
                      <div>
                        ${this.t('posts.failed')}
                      </div>
                      <div ?hidden="${!this.isTabFailed}" class="tabSubTitle">
                        ${this.tabFailedSubTitle}
                      </div>
                      <div
                        ?hidden="${this.isTabFailed}"
                        has-non-open-posts="${this.hasNonOpenPosts}"
                        class="counterInfo"
                        id="tabCountFailed"></div>
                    </div>
                  </paper-tab>
                `
              : html``}

          </paper-tabs>
        </div>

        <iron-pages
          id="tabPages"
          class="tabPages"
          .selected="${this.selectedTab}"
          attr-for-selected="name"
          .entryaAnimation="fade-in-animation"
          .exitAnimation="fade-out-animation">
          <section .name="open">
            <div class="layout horizontal center-center">
              <yp-post-list
                id="openPostList"
                sub-title="${this.tabOpenSubTitle}"
                selected-tab="${this.selectedTab}"
                .listRoute="${this.listRoute}"
                .statusFilter="open"
                .tabCounterId="tabCountOpen"
                .searchingFor="${this.searchingFor}"
                .group="${this.group}"
                .groupId="${this.lastValidGroupId}"></yp-post-list>
            </div>
          </section>
          <section .name="news" class="minHeightSection">
            ${this.newsTabSelected
              ? html`
                  <ac-activities
                    id="groupActivities"
                    ?disableNewPosts="${this.disableNewPosts}"
                    .selectedTab="${this.selectedTab}"
                    .listRoute="${this.listRoute}"
                    .groupId="${this.group.id}"></ac-activities>
                `
              : html``}
          </section>

          ${this.hasNonOpenPosts
            ? html`
                <section .name="in_progress">
                  <div class="layout horizontal center-center">
                    <yp-post-list
                      id="inProgressPostList"
                      .subTitle="${this.tabInProgressSubTitle}"
                      .selectedTab="${this.selectedTab}"
                      .listRoute="${this.listRoute}"
                      .statusFilter="in_progress"
                      .tabCounterId="tabCountInProgress"
                      .searchingFor="${this.searchingFor}"
                      .group="${this.group}"
                      .groupId="${this.lastValidGroupId}"></yp-post-list>
                  </div>
                </section>
                <section .name="successful">
                  <div class="layout horizontal center-center">
                    <yp-post-list
                      id="successfulPostList"
                      .subTitle="${this.tabSuccessfulSubTitle}"
                      .selectedTab="${this.selectedTab}"
                      .listRoute="${this.listRoute}"
                      .statusFilter="successful"
                      .tabCounterId="tabCountSuccessful"
                      .searchingFor="${this.searchingFor}"
                      .group="${this.group}"
                      .groupId="${this.lastValidGroupId}"></yp-post-list>
                  </div>
                </section>
                <section .name="failed">
                  <div class="layout horizontal center-center">
                    <yp-post-list
                      id="failedPostList"
                      .subTitle="${this.tabFailedSubTitle}"
                      .selectedTab="${this.selectedTab}"
                      .listRoute="${this.listRoute}"
                      .statusFilter="failed"
                      tabCounterId="tabCountFailed"
                      .searchingFor="${this.searchingFor}"
                      .group="${this.group}"
                      .groupId="${this.lastValidGroupId}"></yp-post-list>
                  </div>
                </section>
              `
            : html``}

          <section
            name="map"
            ?hidden="${this.locationHidden}"
            class="minHeightSection">
            ${this.mapActive
              ? html` <yp-post-map .groupId="${this.group.id}"></yp-post-map> `
              : html``}
          </section>
        </iron-pages>
      </div>

      ${!this.disableNewPosts
        ? html`
            <div
              class="create-fab-wrapper layout horizontal end-justified createFabContainer"
              ?hidden="${this.disableNewPosts}">
              <paper-fab
                class="createFab"
                .icon="${this.createFabIcon}"
                .title="${this.t('post.new')}"
                .elevation="5"
                wide-layout="${this.wideWidth}"
                title="${this.createFabTitle}"
                @tap="${this._newPost}"></paper-fab>
            </div>
          `
        : html``}

      <iron-scroll-threshold
        id="scrollTheshold"
        .lowerThreshold="550"
        @lower-threshold="${this._loadMoreData}"
        .scrollTarget="document">
      </iron-scroll-threshold>

      <lite-signal
        @lite-signal-yp-language="${this._languageEvent}"></lite-signal>
      <lite-signal
        @lite-signal-yp-refresh-group-posts="${this
          ._refreshGroupPosts}"></lite-signal>
      <lite-signal
        @lite-signal-yp-refresh-activities-scroll-threshold="${this
          ._clearScrollThreshold}"></lite-signal>

      <iron-media-query
        .query="(min-width: 1024px)"
        .querMatches="${this.wideWidth}"></iron-media-query>
      <iron-media-query
        .query="(max-width: 700px)"
        .queryMatches="${this.phoneWidth}"></iron-media-query>


      <div class="layout horizontal center-center">
        <yp-ajax
          large-spinner=""
          id="ajax"
          @response="${this._groupResponse}"></yp-ajax>

        <yp-ajax
          id="ajaxCheckNonOpenPosts"
          @response="${this._nonOpenPosts}"></yp-ajax>
        <yp-ajax id="pagesAjax" @response="${this._pagesResponse}"></yp-ajax>
      </div>
    `;
  }

  /*behaviors: [
    ypThemeBehavior,
    YpNewsTabSelected,
    ypDetectOldiOs,
    AccessHelpers,
    ypGotoBehavior,
    ypMediaFormatsBehavior,
    ypNumberFormatBehavior
  ],


  listeners: {
    'yp-post-count': '_updateTabPostCount',
    'yp-post-new': '_newPost'
  },
*/

  _shouldScrollTabs(phoneWidth, hasNonOpenPosts) {
    return phoneWidth && hasNonOpenPosts;
  }

  /*observers: [
    '_routeIdChanged(idRouteData.id)',
    '_routeTabChanged(tabRouteData.tabName)'
  ],
*/

  _isTabOpen(selectedTab) {
    return selectedTab === 'open';
  }

  _isTabInProgress(selectedTab) {
    return selectedTab === 'in_progress';
  }

  _isTabFailed(selectedTab) {
    return selectedTab === 'failed';
  }

  _isTabSuccessful(selectedTab) {
    return selectedTab === 'successful';
  }

  _clearScrollThreshold() {
    this.$$('#scrollTheshold').clearTriggers();
    console.info('Clearing scrolling triggers for group');
  }

  _loadDataOnTab(tabId) {
    const tab = this.$$('#' + tabId);
    if (tab) {
      tab._loadMoreData();
    } else {
      console.error('Cant find tab ' + tabId);
    }
  }

  _goToPostIdTab(tabId) {
    const tab = this.$$('#' + tabId);
    if (tab && window.appGlobals.cachedPostItem !== null) {
      tab.scrollToPost(window.appGlobals.cachedPostItem);
      window.appGlobals.cachedPostItem = null;
    } else {
      console.warn(
        'Cant find tab or scroll post ' +
          tabId +
          ' retrying for item ' +
          window.appGlobals.cachedPostItem
      );
      this._retryGoToPostIdTab(tabId);
    }
  }

  _retryGoToPostIdTab(tabId) {
    this.async(function () {
      const tab = this.$$('#' + tabId);
      if (tab && window.appGlobals.cachedPostItem !== null) {
        tab.scrollToPost(window.appGlobals.cachedPostItem);
        window.appGlobals.cachedPostItem = null;
      } else {
        console.error(
          'Cant find tab or scroll post ' +
            tabId +
            ' not retrying for item ' +
            window.appGlobals.cachedPostItem
        );
      }
    }, 100);
  }

  goToPostOrNewsItem() {
    if (this.selectedTab == 'open') {
      this._goToPostIdTab('openPostList');
    } else if (this.selectedTab == 'in_progress') {
      this._goToPostIdTab('inProgressPostList');
    } else if (this.selectedTab == 'successful') {
      this._goToPostIdTab('successfulPostList');
    } else if (this.selectedTab == 'failed') {
      this._goToPostIdTab('failedPostList');
    } else if (
      this.selectedTab == 'news' &&
      window.appGlobals.cachedActivityItem !== null
    ) {
      const list = this.$$('#groupActivities');
      if (list) {
        list.scrollToItem(window.appGlobals.cachedActivityItem);
        window.appGlobals.cachedActivityItem = null;
      } else {
        console.warn('No group activities for scroll to item');
      }
    }
  }

  _loadMoreData() {
    if (this.selectedTab == 'open') {
      this._loadDataOnTab('openPostList');
    } else if (this.selectedTab == 'in_progress') {
      this._loadDataOnTab('inProgressPostList');
    } else if (this.selectedTab == 'successful') {
      this._loadDataOnTab('successfulPostList');
    } else if (this.selectedTab == 'failed') {
      this._loadDataOnTab('failedPostList');
    }
  }

  _refreshGroupPosts() {
    this.$$('#openPostList')._refreshGroupFromFilter();
  }

  _routeIdChanged(newId) {
    if (newId) {
      this.set('groupId', newId);
    }
  }

  _routeTabChanged(newTabName) {
    if (newTabName) {
      this.async(function () {
        this.set('selectedTab', newTabName);
      });
    }
  }

  _selectedTabChanged(tabName) {
    if (tabName == 'config') {
      this.async(function () {
        const configRoute = this.listRoute.path;
        const groupId = this.idRoute.path.split('/')[1];
        const configOverride = configRoute.substring(1, configRoute.length);
        if (groupId && configOverride && configOverride != '')
          window.appGlobals.setupGroupConfigOverride(groupId, configOverride);
        this.set('selectedTab', 'open');
      });
    } else {
      if (this.group) {
        this.redirectTo('/group/' + this.group.id + '/' + tabName);
      }

      if (tabName == 'map') {
        this.set('mapActive', true);
      } else {
        this.set('mapActive', false);
      }

      if (tabName && window.appGlobals) {
        window.appGlobals.activity('open', 'group_tab_' + tabName, '', {
          id: this.groupId,
        });
      }

      this.async(function () {
        const news = this.$$('#groupActivities');
        if (news) {
          news.fireResize();
        }
      }, 300);
    }
  }

  _refreshTabsAndPages() {
    this.async(function () {
      const pages = this.$$('#tabPages');
      if (pages) {
        pages.forceSynchronousItemUpdate();
      }

      const paperTabs = this.$$('#paperTabs');
      if (paperTabs) {
        paperTabs.forceSynchronousItemUpdate();
        paperTabs.notifyResize();
      }
    }, 10);
  }

  _updateTabPostCount(event, tabCounterInfo) {
    if (this.$$('#ajaxCheckNonOpenPosts').active === true) {
      this.async(function () {
        this._reallyUpdateTabPostCount(event, tabCounterInfo);
      }, 200);
    } else {
      this._reallyUpdateTabPostCount(event, tabCounterInfo);
    }
  }

  _reallyUpdateTabPostCount(event, tabCounterInfo) {
    const tabCounter = this.$$('#' + tabCounterInfo.tabCounterId);
    if (tabCounter) {
      tabCounter.innerHTML = this.formatNumber(tabCounterInfo.count);
      this.tabCounters[tabCounterInfo.tabCounterId] = tabCounterInfo.count;
    }

    this.haveGotTabCountInfoCount += 1;

    if (this.hasNonOpenPosts) {
      if (this.haveGotTabCountInfoCount == 4) {
        if (this.selectedTab === 'open') {
          if (
            this.tabCounters['tabCountOpen'] &&
            this.tabCounters['tabCountOpen'] > 0
          ) {
            this.set('selectedTab', 'open');
          } else if (
            this.tabCounters['tabCountInProgress'] &&
            this.tabCounters['tabCountInProgress'] > 0
          ) {
            this.set('selectedTab', 'in_progress');
          } else if (
            this.tabCounters['tabCountSuccessful'] &&
            this.tabCounters['tabCountSuccessful'] > 0
          ) {
            this.set('selectedTab', 'successful');
          } else if (
            this.tabCounters['tabCountFailed'] &&
            this.tabCounters['tabCountFailed'] > 0
          ) {
            this.set('selectedTab', 'failed');
          }
        }
      }
    }
  }

  _searchingForChanged(newValue, oldValue) {}

  _filterChanged(newValue, oldValue) {}

  _categoryIdChanged(newValue, oldValue) {}

  _openEdit() {
    this.$$('#groupEdit').open('edit', { groupId: this.group.id });
  }

  _refreshAjax() {
    this.async(function () {
      this._getGroup();
      this.$$('#ajax').generateRequest();
      const groupActivities = this.$$('#groupActivities');
      if (groupActivities) {
        this.$$('#groupActivities').loadNewData();
      }
    }, 100);
  }

  _groupIdChanged(groupId, oldGroupId) {
    if (groupId && groupId != this.lastValidGroupId) {
      this.$$('#tabCountOpen').innerHTML = '';
      if (this.hasNonOpenPosts) {
        this.$$('#tabCountInProgress').innerHTML = '';
        this.$$('#tabCountSuccessful').innerHTML = '';
        this.$$('#tabCountFailed').innerHTML = '';
      }
      this.set('hasNonOpenPosts', false);
      this.set('haveGotTabCountInfoCount', 0);
      this.set('tabCounters', {});

      this.async(function () {
        if (!this.selectedTab || (oldGroupId && this.selectedTab === 'map')) {
          this.set('selectedTab', 'open');
        }
      });
    }
  }

  _nonOpenPosts(event, detail) {
    this.set('hasNonOpenPosts', detail.response.hasNonOpenPosts);
  }

  _groupResponse(event, detail) {
    this.set('group', detail.response.group);
    this.set(
      'group.configuration',
      window.appGlobals.overrideGroupConfigIfNeeded(
        this.group.id,
        this.group.configuration
      )
    );

    this.refresh();

    if (this.group.configuration.canAddNewPosts != undefined) {
      if (this.group.configuration.canAddNewPosts === true) {
        this.set('disableNewPosts', false);
      } else {
        this.set('disableNewPosts', true);
      }
    } else {
      this.set('disableNewPosts', false);
    }

    if (detail.response.checkServerForNonOpenPosts && this.group) {
      this.$$('#ajaxCheckNonOpenPosts').url =
        '/api/groups/' + this.group.id + '/checkNonOpenPosts';
      this.$$('#ajaxCheckNonOpenPosts').generateRequest();
    } else {
      this.set('hasNonOpenPosts', detail.response.hasNonOpenPosts);
    }

    window.appGlobals.postLoadGroupProcessing(this.group);
  }

  refresh() {
    if (this.group) {
      window.appGlobals.setCommunityAnalyticsTracker(
        this.group.Community.google_analytics_code
      );

      if (this.group.Community.configuration) {
        window.appGlobals.setCommunityPixelTracker(
          this.group.Community.configuration.facebookPixelId
        );
      }

      if (
        this.group.theme_id != null ||
        (this.group.configuration &&
          this.group.configuration.themeOverrideColorPrimary != null)
      ) {
        this.setTheme(this.group.theme_id, this.group.configuration);
      } else if (
        this.group.Community &&
        (this.group.Community.theme_id != null ||
          (this.group.Community.configuration &&
            this.group.Community.configuration.themeOverrideColorPrimary))
      ) {
        this.setTheme(
          this.group.Community.theme_id,
          this.group.Community.configuration
        );
      } else if (
        this.group.Community &&
        this.group.Community.Domain &&
        this.group.Community.Domain.theme_id != null
      ) {
        this.setTheme(this.group.Community.Domain.theme_id);
      } else {
        this.setTheme(1);
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

      if (
        this.group.configuration.useCommunityTopBanner &&
        this.group.Community.CommunityHeaderImages &&
        this.group.Community.CommunityHeaderImages.length > 0
      ) {
        this.setupTopHeaderImage(this.group.Community.CommunityHeaderImages);
      } else if (
        this.group.GroupHeaderImages &&
        this.group.GroupHeaderImages.length > 0
      ) {
        this.setupTopHeaderImage(this.group.GroupHeaderImages);
      } else {
        this.setupTopHeaderImage(null);
      }

      this.fire('change-header', {
        headerTitle: this.group.configuration.customBackName
          ? this.group.configuration.customBackName
          : this.group.Community.name,
        headerDescription: this.group.Community.description,
        headerIcon: 'social:group',
        documentTitle: this.group.name,
        enableSearch: true,
        hideHelpIcon: this.group.configuration.hideHelpIcon ? true : null,
        useHardBack: this._useHardBack(this.group.configuration),
        backPath: this.group.configuration.customBackURL
          ? this.group.configuration.customBackURL
          : '/community/' + this.group.community_id,
      });

      this.$$('#pagesAjax').url = '/api/groups/' + this.group.id + '/pages';
      this.$$('#pagesAjax').generateRequest();

      window.appGlobals.setAnonymousGroupStatus(this.group);

      if (
        this.group.configuration &&
        this.group.configuration.disableFacebookLoginForGroup === true
      ) {
        window.appGlobals.disableFacebookLoginForGroup = true;
      } else {
        window.appGlobals.disableFacebookLoginForGroup = false;
      }

      if (
        this.group.configuration &&
        this.group.configuration.externalGoalTriggerUrl
      ) {
        window.appGlobals.externalGoalTriggerGroupId = this.group.id;
      } else {
        window.appGlobals.externalGoalTriggerGroupId = null;
      }

      if (
        this.group.Community &&
        this.group.Community.configuration &&
        this.group.Community.configuration.signupTermsPageId &&
        this.group.Community.configuration.signupTermsPageId != -1
      ) {
        window.appGlobals.signupTermsPageId = this.group.Community.configuration.signupTermsPageId;
      } else {
        window.appGlobals.signupTermsPageId = null;
      }

      if (
        this.group.Community &&
        this.group.Community.configuration &&
        this.group.Community.configuration.customSamlDeniedMessage
      ) {
        window.appGlobals.currentSamlDeniedMessage = this.group.Community.configuration.customSamlDeniedMessage;
      } else {
        window.appGlobals.currentSamlDeniedMessage = null;
      }

      if (
        this.group.Community.configuration &&
        this.group.Community.configuration.customSamlLoginMessage
      ) {
        window.appGlobals.currentSamlLoginMessage = this.group.Community.configuration.customSamlLoginMessage;
      } else {
        window.appGlobals.currentSamlLoginMessage = null;
      }

      window.appGlobals.currentGroup = this.group;

      if (
        (this.group.configuration &&
          this.group.configuration.forceSecureSamlLogin &&
          !this.checkGroupAccess(this.group)) ||
        (this.group.Community &&
          this.group.Community.configuration &&
          this.group.Community.configuration.forceSecureSamlLogin &&
          !this.checkCommunityAccess(this.group.Community))
      ) {
        window.appGlobals.currentForceSaml = true;
      } else {
        window.appGlobals.currentForceSaml = false;
      }
      if (
        this.group.configuration &&
        this.group.configuration.makeMapViewDefault
      ) {
        this.set('selectedTab', 'map');
      }
    }
  }

  _newPost() {
    window.appGlobals.activity('open', 'newPost');
    dom(document)
      .querySelector('yp-app')
      .getDialogAsync(
        'postEdit',
        function (dialog) {
          dialog.setup(null, true, null);
          dialog.open('new', { groupId: this.groupId, group: this.group });
        }.bind(this)
      );
  }
}

window.customElements.define('yp-group-lit', YpGroupLit);
