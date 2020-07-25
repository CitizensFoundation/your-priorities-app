import { YpAccessHelpers } from '../@yrpri/YpAccessHelpers.js';
import { YpMediaHelpers } from '../@yrpri/YpMediaHelpers.js';

import { YpCollection } from './yp-collection.js';
import { YpCollectionItemsGrid } from './yp-collection-items-grid.js';
import { customElement, html, property, LitElement } from 'lit-element';
import { nothing, TemplateResult } from 'lit-html';

import '@material/mwc-fab';
import '@material/mwc-tab';
import '@material/mwc-tab-bar';
import '@polymer/iron-scroll-threshold';

import '../yp-post/yp-posts-list.js';
import '../yp-post/yp-post-card-add.js';
import { YpPostsList } from '../yp-post/yp-posts-list.js';

// TODO: Remove
interface AcActivity extends LitElement {
  scrollToItem(item: YpDatabaseItem): () => void;
  loadNewData(): () => void;
}

@customElement('yp-group')
export class YpGroup extends YpCollection {
  @property({ type: String })
  searchingFor: string | undefined;

  @property({ type: Boolean })
  hasNonOpenPosts = false;

  @property({ type: Boolean })
  disableNewPosts = false;

  @property({ type: Number })
  selectedGroupTab: GroupTabTypes = GroupTabTypes.Open;

  haveGotTabCountInfoCount = 0;
  tabCounters: Record<string, number> = {};

  constructor() {
    super('group', 'post', 'light-bulb', 'post.create');
  }

  connectedCallback() {
    super.connectedCallback();
    this.addListener('yp-post-count', this._updateTabPostCount);
    this.addListener('yp-refresh-group-posts', this._refreshGroupPosts);
    this.addListener(
      'yp-refresh-activities-scroll-threshold',
      this._clearScrollThreshold
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeListener('yp-post-count', this._updateTabPostCount);
    this.removeListener('yp-refresh-group-posts', this._refreshGroupPosts);
    this.removeListener(
      'yp-refresh-activities-scroll-threshold',
      this._clearScrollThreshold
    );
  }

  _updateTabPostCount(event: CustomEvent) {
    const tabCounterInfo = event.detail;
    const tabCounter = this.$$('#' + tabCounterInfo.tabCounterId);
    if (tabCounter) {
      this.tabCounters[tabCounterInfo.tabCounterId] = tabCounterInfo.count;
    }

    this.haveGotTabCountInfoCount += 1;

    if (this.hasNonOpenPosts) {
      if (this.haveGotTabCountInfoCount == 4) {
        if (this.selectedGroupTab === GroupTabTypes.Open) {
          if (this.tabCounters['open'] && this.tabCounters['open'] > 0) {
            this.selectedGroupTab = GroupTabTypes.Open;
          } else if (
            this.tabCounters['inProgress'] &&
            this.tabCounters['inProgress'] > 0
          ) {
            this.selectedGroupTab = GroupTabTypes.InProgress;
          } else if (
            this.tabCounters['successful'] &&
            this.tabCounters['successful'] > 0
          ) {
            this.selectedGroupTab = GroupTabTypes.Successful;
          } else if (
            this.tabCounters['failed'] &&
            this.tabCounters['failed'] > 0
          ) {
            this.selectedGroupTab = GroupTabTypes.Failed;
          }
        }
      }
    }

    this.requestUpdate();
  }

  tabLabelWithCount(type: string): string {
    return `${this.t('posts.' + type)} (${
      this.tabCounters[type] ? this.tabCounters[type] : '...'
    })`;
  }

  getCurrentTabElement(): HTMLElement | undefined {
    let element: HTMLElement | undefined | null;

    switch (this.selectedGroupTab) {
      case GroupTabTypes.Open:
        element = this.$$('#openPostList');
        break;
      case GroupTabTypes.InProgress:
        element = this.$$('#inProgressPostList');
        break;
      case GroupTabTypes.Successful:
        element = this.$$('#successfulPostList');
        break;
      case GroupTabTypes.Failed:
        element = this.$$('#failedPostList');
        break;
      case GroupTabTypes.Newsfeed:
        element = this.$$('#newsfeed');
        break;
      case GroupTabTypes.Map:
        element = this.$$('#postMap');
        break;
    }

    if (element === null) element = undefined;

    return element;
  }

  async _getCollection() {
    window.appGlobals.retryMethodAfter401Login = this._getCollection.bind(this);
    this.hasNonOpenPosts = false;
    this.haveGotTabCountInfoCount = 0;
    this.tabCounters = {};

    if (
      this.collectionId &&
      window.appGlobals.cache.groupItemsCache[this.collectionId]
    ) {
      this.collection =
        window.appGlobals.cache.groupItemsCache[this.collectionId];
      this.refresh();
    } else {
      super._getCollection();
    }
    window.appGlobals.retryMethodAfter401Login = undefined;
  }

  renderGroupTabs() {
    if (this.collection && !this.tabsHidden) {
      return html`
        <mwc-tab-bar @MDCTabBar:activated="${this._selectTab}">
          <mwc-tab
            .label="${this.collectionTabLabel}"
            icon="people"
            stacked></mwc-tab>
          <mwc-tab
            ?hidden="${this.hasNonOpenPosts}"
            .label="${this.tabLabelWithCount('open')}"
            icon="people"
            stacked></mwc-tab>
          <mwc-tab
            ?hidden="${this.hasNonOpenPosts}"
            .label="${this.tabLabelWithCount('inProgress')}"
            icon="people"
            stacked></mwc-tab>
          <mwc-tab
            ?hidden="${this.hasNonOpenPosts}"
            .label="${this.tabLabelWithCount('successful')}"
            icon="people"
            stacked></mwc-tab>
          <mwc-tab
            ?hidden="${this.hasNonOpenPosts}"
            .label="${this.tabLabelWithCount('failed')}"
            icon="people"
            stacked></mwc-tab>
          ${this.renderNewsAndMapTabs()}
        </mwc-tab-bar>
      `;
    } else {
      return nothing;
    }
  }

  renderPostList(type: string): TemplateResult {
    return this.collection
      ? html`
          <yp-posts-list
            id="${type}PostList"
            .selectedGroupTab="${this.selectedGroupTab}"
            .listRoute="${this.subRoute}"
            .type="${type}"
            .searchingFor="${this.searchingFor}"
            .group="${this.collection as YpGroupData}"></yp-posts-list>
        `
      : html``;
  }

  renderCurrentGroupTabPage(): TemplateResult | undefined {
    let page: TemplateResult | undefined;

    switch (this.selectedGroupTab) {
      case GroupTabTypes.Open:
        page = this.renderPostList('open');
        break;
      case GroupTabTypes.InProgress:
        page = this.renderPostList('inProgress');
        break;
      case GroupTabTypes.Successful:
        page = this.renderPostList('successful');
        break;
      case GroupTabTypes.Failed:
        page = this.renderPostList('failed');
        break;
      case GroupTabTypes.Newsfeed:
        page = html` <ac-activities
          id="newsfeed"
          .selectedGroupTab="${this.selectedGroupTab}"
          .collectionType="${this.collectionType}"
          .collectionId="${this.collectionId}"></ac-activities>`;
        break;
      case GroupTabTypes.Map:
        page = html``;
        break;
    }

    return page;
  }

  render() {
    return html`
      ${this.renderHeader()}
      ${this.collection &&
      !(this.collection.configuration as YpGroupConfiguration).hideNewPost
        ? html` <div
            class="largeAddButton layout horizontal center-center"
            ?hidden="${(this.collection.configuration as YpGroupConfiguration)
              .hideNewPost}">
            <yp-post-card-add
              .group="${this.collection as YpGroupData}"
              ?disableNewPosts="${this.disableNewPosts}"
              @new-post="${this._newPost}"></yp-post-card-add>
          </div>`
        : nothing}
      ${this.renderGroupTabs()} ${this.renderCurrentGroupTabPage()}
      ${!this.disableNewPosts &&
      this.collection &&
      !(this.collection.configuration as YpGroupConfiguration).hideNewPost
        ? html` <mwc-fab
            ?extended="${this.wide}"
            .label="${this.t('post.create')}"
            icon="light_bulb"
            @click="${this._newPost}"></mwc-fab>`
        : nothing}

      <iron-scroll-threshold
        id="scrollTheshold"
        lowerThreshold="550"
        @lower-threshold="${this._loadMoreData}"
        scroll-target="document">
      </iron-scroll-threshold>
    `;
  }

  _selectGroupTab(event: CustomEvent) {
    this.selectedGroupTab = event.detail as GroupTabTypes;
  }

  //TODO: Check this and rename
  _refreshAjax() {
    setTimeout(() => {
      this._getCollection();
      const newsfeed = this.$$('#newsfeed') as AcActivity;
      if (newsfeed) {
        newsfeed.loadNewData();
      }
    }, 100);
  }

  _newPost() {
    window.appGlobals.activity('open', 'newPost');
    //TODO: Fix ts type
    window.appDialogs.getDialogAsync(
      'postEdit',
      (dialog: {
        setup: (arg0: null, arg1: boolean, arg2: null) => void;
        open: (
          arg0: string,
          arg1: {
            groupId: number | undefined;
            group: YpCollectionData | undefined;
          }
        ) => void;
      }) => {
        dialog.setup(null, true, null);
        dialog.open('new', {
          groupId: this.collectionId,
          group: this.collection,
        });
      }
    );
  }

  _clearScrollThreshold() {
    (this.$$(
      '#scrollTheshold'
    ) as IronScrollThresholdInterface).clearTriggers();
  }

  _setSelectedTabFromRoute(routeTabName: string): void {
    let tabNumber;

    switch (routeTabName) {
      case 'open':
        tabNumber = GroupTabTypes.Open;
        break;
      case 'inProgress':
        tabNumber = GroupTabTypes.InProgress;
        break;
      case 'successfull':
        tabNumber = GroupTabTypes.Successful;
        break;
      case 'failed':
        tabNumber = GroupTabTypes.Failed;
        break;
      case 'news':
        tabNumber = GroupTabTypes.Newsfeed;
        break;
      case 'map':
        tabNumber = GroupTabTypes.Map;
        break;
      default:
        tabNumber = GroupTabTypes.Open;
        break;
    }

    if (tabNumber) {
      this.selectedGroupTab = tabNumber;
      window.appGlobals.activity(
        'open',
        this.collectionType + '_tab_' + routeTabName
      );
    }
  }

  get _isCurrentPostsTab(): boolean {
    return (
      this.selectedGroupTab !== undefined &&
      [
        GroupTabTypes.Open,
        GroupTabTypes.InProgress,
        GroupTabTypes.Successful,
        GroupTabTypes.Failed,
      ].indexOf(this.selectedGroupTab) > 1
    );
  }

  _loadMoreData() {
    if (this._isCurrentPostsTab) {
      const tab = this.getCurrentTabElement() as YpPostsList;
      if (tab) {
        tab._loadMoreData();
      } else {
        console.error('Cant find tab to load data on' + this.selectedGroupTab);
      }
    } else {
      console.error('Trying to load more data on non posts tab');
    }
  }

  _goToPostIdTab() {
    const tab = this.getCurrentTabElement() as YpPostsList;
    if (tab && window.appGlobals.cache.cachedPostItem !== undefined) {
      tab.scrollToPost(window.appGlobals.cache.cachedPostItem);
      window.appGlobals.cache.cachedPostItem = undefined;
    } else {
      console.error('TODO: Check - cant find tab or scroll post');
    }
  }

  _refreshGroupPosts() {
    if (this._isCurrentPostsTab) {
      const tab = this.getCurrentTabElement() as YpPostsList;
      if (tab) tab._refreshGroupFromFilter();
      else console.error('TODO: Check, cant find tab to refresh');
    } else {
      console.error('TODO: Check, post tab not selected');
    }
  }

  goToPostOrNewsItem() {
    if (this._isCurrentPostsTab) {
      this._goToPostIdTab();
    } else if (
      this.selectedGroupTab === GroupTabTypes.Newsfeed &&
      window.appGlobals.cache.cachedActivityItem !== undefined
    ) {
      const list = this.$$('#newsfeed') as IronListInterface;
      if (list) {
        list.scrollToItem(window.appGlobals.cache.cachedActivityItem);
        window.appGlobals.cache.cachedActivityItem = undefined;
      } else {
        console.warn('No group activities for scroll to item');
      }
    }
  }

  refresh() {
    super.refresh();
    const group = this.collection as YpGroupData;

    if (group) {
      group.configuration = window.appGlobals.overrideGroupConfigIfNeeded(
        group.id,
        group.configuration
      );

      if (group.configuration.canAddNewPosts != undefined) {
        if (group.configuration.canAddNewPosts === true) {
          this.disableNewPosts = false;
        } else {
          this.disableNewPosts = true;
        }
      } else {
        this.disableNewPosts = false;
      }

      setTimeout(async () => {
        const checkResults = await window.serverApi.getHasNonOpenPosts(
          group.id
        ) as boolean | void;

        if (checkResults) {
          this.hasNonOpenPosts = checkResults;
        }
      });

      window.appGlobals.analytics.setCommunityAnalyticsTracker(
        group.Community?.google_analytics_code
      );

      if (group.Community?.configuration) {
        window.appGlobals.analytics.setCommunityPixelTracker(
          group.Community.configuration.facebookPixelId
        );
      }

      if (
        group.theme_id != null ||
        (group.configuration &&
          group.configuration.themeOverrideColorPrimary != null)
      ) {
        window.appGlobals.theme.setTheme(
          group.theme_id,
          this,
          group.configuration
        );
      } else if (
        group.Community &&
        (group.Community.theme_id != null ||
          (group.Community.configuration &&
            group.Community.configuration.themeOverrideColorPrimary))
      ) {
        window.appGlobals.theme.setTheme(
          group.Community.theme_id,
          this,
          group.Community.configuration
        );
      } else if (
        group.Community &&
        group.Community.Domain &&
        group.Community.Domain.theme_id != null
      ) {
        window.appGlobals.theme.setTheme(group.Community.Domain.theme_id, this);
      } else {
        window.appGlobals.theme.setTheme(1, this);
      }

      if (group.configuration.locationHidden) {
        if (group.configuration.locationHidden == true) {
          this.locationHidden = true;
        } else {
          this.locationHidden = false;
        }
      } else {
        this.locationHidden = false;
      }

      if (
        group.configuration.useCommunityTopBanner &&
        group.Community &&
        group.Community.CommunityHeaderImages &&
        group.Community.CommunityHeaderImages.length > 0
      ) {
        YpMediaHelpers.setupTopHeaderImage(
          this,
          group.Community.CommunityHeaderImages
        );
      } else if (
        group.GroupHeaderImages &&
        group.GroupHeaderImages.length > 0
      ) {
        YpMediaHelpers.setupTopHeaderImage(this, group.GroupHeaderImages);
      } else {
        YpMediaHelpers.setupTopHeaderImage(this, null);
      }

      this.fire('change-header', {
        headerTitle: group.configuration.customBackName
          ? group.configuration.customBackName
          : group.Community?.name,
        headerDescription: group.Community?.description,
        headerIcon: 'social:group',
        documentTitle: group.name,
        enableSearch: true,
        hideHelpIcon: group.configuration.hideHelpIcon ? true : null,
        useHardBack: this._useHardBack(group.configuration),
        backPath: group.configuration.customBackURL
          ? group.configuration.customBackURL
          : '/community/' + group.community_id,
      });

      window.appGlobals.setAnonymousGroupStatus(group);

      if (
        group.configuration &&
        group.configuration.disableFacebookLoginForGroup === true
      ) {
        window.appGlobals.disableFacebookLoginForGroup = true;
      } else {
        window.appGlobals.disableFacebookLoginForGroup = false;
      }

      if (group.configuration && group.configuration.externalGoalTriggerUrl) {
        window.appGlobals.externalGoalTriggerGroupId = group.id;
      } else {
        window.appGlobals.externalGoalTriggerGroupId = undefined;
      }

      if (
        group.Community &&
        group.Community.configuration &&
        group.Community.configuration.signupTermsPageId &&
        group.Community.configuration.signupTermsPageId != -1
      ) {
        window.appGlobals.signupTermsPageId =
          group.Community.configuration.signupTermsPageId;
      } else {
        window.appGlobals.signupTermsPageId = undefined;
      }

      this._setupGroupSaml(group);

      window.appGlobals.currentGroup = group;

      if (
        (group.configuration &&
          group.configuration.forceSecureSamlLogin &&
          !YpAccessHelpers.checkGroupAccess(group)) ||
        (group.Community &&
          group.Community.configuration &&
          group.Community.configuration.forceSecureSamlLogin &&
          !YpAccessHelpers.checkCommunityAccess(group.Community))
      ) {
        window.appGlobals.currentForceSaml = true;
      } else {
        window.appGlobals.currentForceSaml = false;
      }
      if (group.configuration && group.configuration.makeMapViewDefault) {
        this.selectedGroupTab = GroupTabTypes.Map;
      }
    }

    window.appGlobals.postLoadGroupProcessing(group);
  }

  _setupGroupSaml(group: YpGroupData) {
    if (
      group.Community &&
      group.Community.configuration &&
      group.Community.configuration.customSamlDeniedMessage
    ) {
      window.appGlobals.currentSamlDeniedMessage =
        group.Community.configuration.customSamlDeniedMessage;
    } else {
      window.appGlobals.currentSamlDeniedMessage = undefined;
    }

    if (
      group.Community &&
      group.Community.configuration &&
      group.Community.configuration.customSamlLoginMessage
    ) {
      window.appGlobals.currentSamlLoginMessage =
        group.Community.configuration.customSamlLoginMessage;
    } else {
      window.appGlobals.currentSamlLoginMessage = undefined;
    }
  }

  scrollToCollectionItemSubClass() {
    if (
      this.collection &&
      window.appGlobals.cache.backToCommunityGroupItems &&
      window.appGlobals.cache.backToCommunityGroupItems[this.collection.id]
    ) {
      (this.$$('#collectionItems') as YpCollectionItemsGrid).scrollToItem(
        window.appGlobals.cache.backToCommunityGroupItems[this.collection.id]
      );
      window.appGlobals.cache.backToCommunityGroupItems[
        this.collection.id
      ] = undefined;
    }
  }
}
