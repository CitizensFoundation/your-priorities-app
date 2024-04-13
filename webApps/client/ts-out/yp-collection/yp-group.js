var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { YpAccessHelpers } from "../common/YpAccessHelpers.js";
import { YpMediaHelpers } from "../common/YpMediaHelpers.js";
import { YpCollection } from "./yp-collection.js";
import { html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "@material/web/tabs/tabs.js";
import "@material/web/tabs/primary-tab.js";
import "./yp-group-header.js";
import "../yp-post/yp-posts-list.js";
import "../yp-post/yp-post-card-add.js";
import { cache } from "lit/directives/cache.js";
import "../allOurIdeas/aoi-survey.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
export const GroupTabTypes = {
    Open: 0,
    InProgress: 1,
    Successful: 2,
    Failed: 3,
    Newsfeed: 4,
    Map: 5,
};
let YpGroup = class YpGroup extends YpCollection {
    constructor() {
        super("group", "post", "lightbulb_outline", "post.create");
        this.hasNonOpenPosts = false;
        this.disableNewPosts = false;
        this.selectedGroupTab = GroupTabTypes.Open;
        this.newGroupRefresh = false;
        this.tabCounters = {};
        this.configCheckTTL = 45000;
    }
    connectedCallback() {
        super.connectedCallback();
        this.addListener("yp-post-count", this._updateTabPostCount);
        this.addListener("yp-refresh-activities-scroll-threshold", this._clearScrollThreshold);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeListener("yp-post-count", this._updateTabPostCount);
        this.removeListener("yp-refresh-activities-scroll-threshold", this._clearScrollThreshold);
    }
    _cancelConfigCheckTimer() {
        if (this.configCheckTimer) {
            clearTimeout(this.configCheckTimer);
            this.configCheckTimer = undefined;
        }
    }
    _startConfigCheckTimer() {
        this._cancelConfigCheckTimer();
        if (this.collection) {
            this.configCheckTimer = setTimeout(this._getGroupConfig.bind(this), this.configCheckTTL);
        }
    }
    async _getGroupConfig() {
        if (this.collection) {
            const groupConfiguration = (await window.serverApi.getGroupConfiguration(this.collection.id));
            if (groupConfiguration) {
                if (this._doesGroupRequireRefresh(this.collection.configuration, groupConfiguration)) {
                    window.appDialogs.getDialogAsync("masterToast", (toast) => {
                        toast.textContent = this.t("groupConfigurationHasBeenUpdated");
                        toast.timeoutMs = 7500;
                    });
                    this._refreshAjax();
                }
                this._startConfigCheckTimer();
            }
            else {
                this._cancelConfigCheckTimer();
            }
        }
        else {
            this._cancelConfigCheckTimer();
        }
    }
    _doesGroupRequireRefresh(groupConfigA, groupConfigB) {
        if (groupConfigA && groupConfigB) {
            if (groupConfigA.canVote !== groupConfigB.canVote ||
                groupConfigA.canAddNewPosts !== groupConfigB.canAddNewPosts ||
                groupConfigA.disableDebate !== groupConfigB.disableDebate ||
                groupConfigA.hideNewPost !== groupConfigB.hideNewPost) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    _updateTabPostCount(event) {
        const tabCounterInfo = event.detail;
        this.tabCounters[tabCounterInfo.type] = tabCounterInfo.count;
        this._setupOpenTab();
        setTimeout(() => {
            this.requestUpdate();
        });
    }
    _setupOpenTab() {
        if (this.hasNonOpenPosts) {
            if (this.collection.configuration &&
                this.collection.configuration
                    .makeMapViewDefault) {
                console.log("Not opening tabs with ideas in map mode");
            }
            else {
                if (Object.keys(this.tabCounters).length === 4) {
                    //TODO: Fix this logic of selecting a group with some ideas after we get the new counts from the server
                    if (this.selectedGroupTab === GroupTabTypes.Open) {
                        if (this.tabCounters["open"] && this.tabCounters["open"] > 0) {
                            this.selectedGroupTab = GroupTabTypes.Open;
                        }
                        else if (this.tabCounters["inProgress"] &&
                            this.tabCounters["inProgress"] > 0) {
                            this.selectedGroupTab = GroupTabTypes.InProgress;
                        }
                        else if (this.tabCounters["successful"] &&
                            this.tabCounters["successful"] > 0) {
                            this.selectedGroupTab = GroupTabTypes.Successful;
                        }
                        else if (this.tabCounters["failed"] &&
                            this.tabCounters["failed"] > 0) {
                            this.selectedGroupTab = GroupTabTypes.Failed;
                        }
                    }
                }
            }
        }
    }
    tabLabelWithCount(type) {
        const labelTranslation = this.t("posts." + type);
        if (type === "inProgress")
            type = "in_progress";
        return `${labelTranslation} (${this.tabCounters[type] != undefined ? this.tabCounters[type] : "..."})`;
    }
    getCurrentTabElement() {
        let element;
        switch (this.selectedGroupTab) {
            case GroupTabTypes.Open:
                element = this.$$("#openPostList");
                break;
            case GroupTabTypes.InProgress:
                element = this.$$("#in_progressPostList");
                break;
            case GroupTabTypes.Successful:
                element = this.$$("#successfulPostList");
                break;
            case GroupTabTypes.Failed:
                element = this.$$("#failedPostList");
                break;
            case GroupTabTypes.Newsfeed:
                element = this.$$("#newsfeed");
                break;
            case GroupTabTypes.Map:
                element = this.$$("#postMap");
                break;
        }
        if (element === null)
            element = undefined;
        return element;
    }
    async getCollection() {
        window.appGlobals.retryMethodAfter401Login = this.getCollection.bind(this);
        this.hasNonOpenPosts = false;
        this.tabCounters = {};
        if (this.collectionId &&
            window.appGlobals.cache.groupItemsCache[this.collectionId]) {
            this.collection =
                window.appGlobals.cache.groupItemsCache[this.collectionId];
            this.refresh();
        }
        else if (this.collectionId) {
            this.collection = undefined;
            this.collectionItems = undefined;
            const groupResults = (await window.serverApi.getCollection(this.collectionType, this.collectionId));
            if (groupResults) {
                this.collection = groupResults.group;
                this.hasNonOpenPosts = groupResults.hasNonOpenPosts;
                this.refresh();
            }
        }
        window.appGlobals.retryMethodAfter401Login = undefined;
    }
    //TODO: Fix moving on to the next group with focus if 0 ideas in Open
    renderGroupTabs() {
        if (this.collection && !this.tabsHidden) {
            return html `
        <div class="layout vertical center-center">
          <md-tabs
            @change="${this._selectGroupTab}"
            .activeTabIndex="${this.selectedGroupTab}"
          >
            <md-primary-tab
              >${this.tabLabelWithCount("open")}<md-icon slot="icon"
                >lightbulb_outline</md-icon
              ></md-primary-tab
            >
            ${this.hasNonOpenPosts
                ? html `
                  <md-primary-tab
                    >${this.tabLabelWithCount("inProgress")}<md-icon slot="icon"
                      >lightbulb_outline</md-icon
                    ></md-primary-tab
                  >
                  <md-primary-tab
                    >${this.tabLabelWithCount("successful")}<md-icon slot="icon"
                      >lightbulb_outline</md-icon
                    ></md-primary-tab
                  >
                  <md-primary-tab
                    >${this.tabLabelWithCount("failed")}<md-icon slot="icon"
                      >lightbulb_outline</md-icon
                    >
                  </md-primary-tab>
                `
                : nothing}
            ${this.renderNewsAndMapTabs()}
          </md-tabs>
        </div>
      `;
        }
        else {
            return nothing;
        }
    }
    renderPostList(statusFilter) {
        return this.collection
            ? html `<div class="layout vertical center-center">
          <yp-posts-list
            id="${statusFilter}PostList"
            role="main"
            aria-label="${this.t("posts.posts")}"
            .selectedGroupTab="${this.selectedGroupTab}"
            .listRoute="${this.subRoute}"
            .statusFilter="${statusFilter}"
            .searchingFor="${this.searchingFor}"
            .group="${this.collection}"
          ></yp-posts-list>
        </div> `
            : html ``;
    }
    renderCurrentGroupTabPage() {
        let page;
        switch (this.selectedGroupTab) {
            case GroupTabTypes.Open:
                page = this.renderPostList("open");
                break;
            case GroupTabTypes.InProgress:
                page = this.renderPostList("in_progress");
                break;
            case GroupTabTypes.Successful:
                page = this.renderPostList("successful");
                break;
            case GroupTabTypes.Failed:
                page = this.renderPostList("failed");
                break;
            case GroupTabTypes.Newsfeed:
                page = html ` <ac-activities
          id="newsfeed"
          .selectedGroupTab="${this.selectedGroupTab}"
          .collectionType="${this.collectionType}"
          .collectionId="${this.collectionId}"
        ></ac-activities>`;
                break;
            case GroupTabTypes.Map:
                page = html ``;
                break;
        }
        return page;
    }
    renderHeader() {
        return this.collection && !this.noHeader
            ? html `
          <div class="layout vertical center-center header">
            <yp-group-header
              .collection="${this.collection}"
              .collectionType="${this.collectionType}"
              aria-label="${this.collectionType}"
              role="banner"
            ></yp-group-header>
          </div>
        `
            : nothing;
    }
    render() {
        if (this.collection && this.collection.configuration) {
            if (!this.collection.configuration.groupType ||
                this.collection.configuration.groupType == 0) {
                return this.renderYpGroup();
            }
            else if (this.collection.configuration.groupType == 1) {
                return html `
          <aoi-survey
            id="aoiSurvey"
            .collectionId="${this.collectionId}"
            .collection="${this.collection}"
          ></aoi-survey>
        `;
            }
            else if (this.collection.configuration.groupType == 2) {
                return html `
          <div class="layout vertical">
            ${unsafeHTML(this.collection.configuration.staticHtml?.content)}
            <div
              class="layout vertical center-center"
              ?hidden="${!YpAccessHelpers.checkGroupAccess(this.collection)}"
            >
              <md-icon-button
                id="menuButton"
                @click="${this._openAdmin}"
                title="${this.t("group.edit")}"
                ><md-icon>settings</md-icon>
              </md-icon-button>
            </div>
          </div>
        `;
            }
            else {
                return html ``;
            }
        }
        else {
            return html `<md-linear-progress indeterminate></md-linear-progress> `;
        }
    }
    renderYpGroup() {
        return html `
      ${this.renderHeader()}
      ${this.collection &&
            !this.collection.configuration.hideNewPost
            ? html ` <div
            class="layout vertical center-center"
            ?hidden="${this.collection.configuration
                .hideNewPost}"
          >
            <div>
              <yp-post-card-add
                role="button"
                aria-label="${this.t("post.new")}"
                .group="${this.collection}"
                ?disableNewPosts="${this.disableNewPosts}"
                @new-post="${this._newPost}"
              ></yp-post-card-add>
            </div>
          </div>`
            : nothing}
      ${this.renderGroupTabs()} ${cache(this.renderCurrentGroupTabPage())}
      ${!this.disableNewPosts &&
            this.collection &&
            !this.collection.configuration.hideNewPost
            ? html ` <md-fab
            .label="${this.t("post.new")}"
            icon="lightbulb"
            @click="${this._newPost}"
          ></md-fab>`
            : nothing}
    `;
    }
    _selectGroupTab(event) {
        this.selectedGroupTab = event.currentTarget.activeTabIndex;
        if (!this.hasNonOpenPosts && this.selectedGroupTab !== 0) {
            this.selectedGroupTab += 3;
        }
    }
    _openHelpPageIfNeededOnce() {
        if (this.collection &&
            !sessionStorage.getItem("yp-welcome-for-group-" + this.collection.id)) {
            setTimeout(() => {
                if (this.collection &&
                    this.collection.configuration &&
                    this.collection.configuration.welcomePageId) {
                    this.fire("yp-open-page", {
                        pageId: this.collection.configuration.welcomePageId,
                    });
                    sessionStorage.setItem("yp-welcome-for-group-" + this.collection.id, "true");
                }
            }, 1200);
        }
    }
    //TODO: Check this and rename
    _refreshAjax() {
        setTimeout(() => {
            this.getCollection();
            const newsfeed = this.$$("#newsfeed");
            if (newsfeed) {
                newsfeed.loadNewData();
            }
            //TODO: Get this working
            const postsMap = this.$$("#postsMap");
            if (postsMap) {
                postsMap.requestUpdate;
            }
        }, 100);
    }
    _newPost() {
        window.appGlobals.activity("open", "newPost");
        //TODO: Fix ts type
        window.appDialogs.getDialogAsync("postEdit", (dialog) => {
            dialog.setup(undefined, true, undefined, this.collection);
            dialog.open(true, {
                groupId: this.collectionId,
                group: this.collection,
            });
        });
    }
    _clearScrollThreshold() {
        this.$$("#scrollTheshold").clearTriggers();
    }
    _setSelectedTabFromRoute(routeTabName) {
        let tabNumber;
        switch (routeTabName) {
            case "open":
                tabNumber = GroupTabTypes.Open;
                break;
            case "inProgress":
                tabNumber = GroupTabTypes.InProgress;
                break;
            case "successfull":
                tabNumber = GroupTabTypes.Successful;
                break;
            case "failed":
                tabNumber = GroupTabTypes.Failed;
                break;
            case "news":
                tabNumber = GroupTabTypes.Newsfeed;
                break;
            case "map":
                tabNumber = GroupTabTypes.Map;
                break;
            default:
                tabNumber = GroupTabTypes.Open;
                break;
        }
        if (tabNumber) {
            this.selectedGroupTab = tabNumber;
            window.appGlobals.activity("open", this.collectionType + "_tab_" + routeTabName);
        }
    }
    get _isCurrentPostsTab() {
        return (this.selectedGroupTab == GroupTabTypes.Open ||
            this.selectedGroupTab == GroupTabTypes.InProgress ||
            this.selectedGroupTab == GroupTabTypes.Successful ||
            this.selectedGroupTab == GroupTabTypes.Failed);
    }
    _loadMoreData() {
        if (this._isCurrentPostsTab) {
            const tab = this.getCurrentTabElement();
            if (tab) {
                tab._loadMoreData();
            }
            else {
                console.error("Cant find tab to load data on" + this.selectedGroupTab);
            }
        }
        else {
            console.error("Trying to load more data on non posts tab");
        }
    }
    goToPostOrNewsItem() {
        if (this._isCurrentPostsTab) {
            //TODO: See what if this is needed
        }
        else if (this.selectedGroupTab === GroupTabTypes.Newsfeed &&
            window.appGlobals.cache.cachedActivityItem !== undefined) {
            const list = this.$$("#newsfeed");
            if (list) {
                list.scrollToItem(window.appGlobals.cache.cachedActivityItem);
                window.appGlobals.cache.cachedActivityItem = undefined;
            }
            else {
                console.warn("No group activities for scroll to item");
            }
        }
    }
    //TODO: Implment this if needed
    /*
    _retryGoToPostIdTab: function (tabId) {
          this.async(function () {
            var tab = this.$$("#"+tabId);
            if (tab && window.appGlobals.cachedPostItem!==null) {
              tab.scrollToPost(window.appGlobals.cachedPostItem);
              window.appGlobals.cachedPostItem = null;
            } else {
              console.warn("Cant find tab or scroll post "+tabId+ " not retrying for item "+window.appGlobals.cachedPostItem);
            }
          }, 100);
        },
  
        _selectedTabChanged: function (tabName) {
          if (tabName=='config') {
            this.async(function () {
            });
            var configRoute = this.listRoute.path;
            var groupId = this.idRoute.path.split("/")[1];
            var configOverride= configRoute.substring(1, configRoute.length);
            if (groupId && configOverride && configOverride!="")
              window.appGlobals.setupGroupConfigOverride(groupId, configOverride);
            this.set('selectedTab', 'open');
          } else {
            if (this.group) {
              //TODO (for new version): Change the URL to match the tab without reloading everything
              //this.redirectTo("/group/" + this.group.id + '/' + tabName);
            }
  
            if (tabName == "map") {
              this.set('mapActive', true);
            } else {
              this.set('mapActive', false);
            }
  
            if (tabName && window.appGlobals) {
              window.appGlobals.activity('open', 'group_tab_' + tabName,'',
                { id: this.groupId });
            }
  
            this.async(function () {
              var news = this.$$("#groupActivities");
              if (news) {
                news.fireResize();
              }
            }, 300);
          }
          this._clearScrollThreshold();
        },
  */
    //TODO: Make sure to capture the caching from this
    /* _groupIdChanged: function (groupId, oldGroupId) {
          this._cancelConfigCheckTimer();
          if (groupId && groupId!=this.lastValidGroupId) {
            this.newGroupRefresh = true;
            this.set('lastValidGroupId', groupId);
            this.set('group', null);
            this.$.groupCard.resetGroup();
            this.$.tabCountOpen.innerHTML = "";
            if (this.hasNonOpenPosts) {
              this.$$("#tabCountInProgress").innerHTML = "";
              this.$$("#tabCountSuccessful").innerHTML = "";
              this.$$("#tabCountFailed").innerHTML = "";
            }
            this.set('hasNonOpenPosts', false);
            this.set('tabCounters', {});
            var groupIdInt = parseInt(groupId);
  
            if (!this.selectedTab ||
               (oldGroupId &&
                this.selectedTab==='map' &&
                !this.group.configuration.makeMapViewDefault
               )) {
              this.set('selectedTab', 'open');
              this._setupOpenTab();
            }
  
            if (window.appGlobals.groupItemsCache && window.appGlobals.groupItemsCache[groupIdInt]) {
              this._groupResponse(null, { response: {
                  group: window.appGlobals.groupItemsCache[groupIdInt],
                  checkServerForNonOpenPosts: true
                }});
              window.appGlobals.groupItemsCache[groupIdInt] = null;
              console.info("Using cache for group id "+groupId);
              this.refresh();
            } else {
              this._getGroup();
            }
          }
        },*/
    async refresh(fromMainApp = false) {
        super.refresh();
        const group = this.collection;
        if (group) {
            this._openHelpPageIfNeededOnce();
            group.configuration = window.appGlobals.overrideGroupConfigIfNeeded(group.id, group.configuration);
            if (group.configuration.canAddNewPosts != undefined) {
                if (group.configuration.canAddNewPosts === true) {
                    this.disableNewPosts = false;
                }
                else {
                    this.disableNewPosts = true;
                }
            }
            else {
                this.disableNewPosts = false;
            }
            setTimeout(async () => {
                const checkResults = (await window.serverApi.getHasNonOpenPosts(group.id));
                if (checkResults) {
                    this.hasNonOpenPosts = checkResults.hasNonOpenPosts;
                }
            });
            window.appGlobals.analytics.setCommunityAnalyticsTracker(group.Community?.google_analytics_code);
            if (group.Community?.configuration) {
                window.appGlobals.analytics.setCommunityPixelTracker(group.Community.configuration.facebookPixelId);
            }
            if (group.configuration.theme != null ||
                (group.configuration &&
                    group.configuration.themeOverrideColorPrimary != null)) {
                window.appGlobals.theme.setTheme(group.theme_id, group.configuration);
            }
            else if (group.Community &&
                (group.Community.configuration.theme != null ||
                    (group.Community.configuration &&
                        group.Community.configuration.themeOverrideColorPrimary))) {
                window.appGlobals.theme.setTheme(group.Community.theme_id, group.Community.configuration);
            }
            else if (group.Community &&
                group.Community.Domain &&
                group.Community.Domain.configuration.theme != null) {
                window.appGlobals.theme.setTheme(group.Community.Domain.theme_id);
            }
            else {
                window.appGlobals.theme.setTheme(1);
            }
            if (group.configuration.locationHidden) {
                if (group.configuration.locationHidden == true) {
                    this.locationHidden = true;
                }
                else {
                    this.locationHidden = false;
                }
            }
            else {
                this.locationHidden = false;
            }
            if (group.configuration.useCommunityTopBanner &&
                group.Community &&
                group.Community.CommunityHeaderImages &&
                group.Community.CommunityHeaderImages.length > 0) {
                YpMediaHelpers.setupTopHeaderImage(this, group.Community.CommunityHeaderImages);
            }
            else if (group.GroupHeaderImages &&
                group.GroupHeaderImages.length > 0) {
                YpMediaHelpers.setupTopHeaderImage(this, group.GroupHeaderImages);
            }
            else {
                YpMediaHelpers.setupTopHeaderImage(this, null);
            }
            let backPath;
            let headerTitle;
            const isAdmin = YpAccessHelpers.checkGroupAccess(this.collection);
            if (group.configuration.customBackURL) {
                backPath = group.configuration.customBackURL;
                headerTitle = group.configuration.customBackName;
            }
            else if (group.Community &&
                group.Community.configuration &&
                group.Community.configuration.redirectToGroupId &&
                !isAdmin) {
                backPath = "/domain/" + group.Community.Domain.id;
                headerTitle = group.Community.Domain.name;
            }
            else {
                backPath = "/community/" + group.community_id;
                headerTitle = group.Community.name;
            }
            this.fire("yp-change-header", {
                headerTitle: headerTitle,
                headerDescription: group.Community?.description,
                headerIcon: "social:group",
                documentTitle: group.name,
                enableSearch: true,
                disableCollectionUpLink: group.configuration &&
                    group.configuration.disableCollectionUpLink === true,
                hideHelpIcon: group.configuration.hideHelpIcon ? true : null,
                useHardBack: this._useHardBack(group.configuration),
                backPath: backPath,
            });
            window.appGlobals.setAnonymousGroupStatus(group);
            window.appGlobals.setRegistrationQuestionGroup(group);
            if (group.configuration &&
                group.configuration.disableFacebookLoginForGroup === true) {
                window.appGlobals.disableFacebookLoginForGroup = true;
            }
            else {
                window.appGlobals.disableFacebookLoginForGroup = false;
            }
            if (group.configuration && group.configuration.externalGoalTriggerUrl) {
                window.appGlobals.externalGoalTriggerGroupId = group.id;
            }
            else {
                window.appGlobals.externalGoalTriggerGroupId = undefined;
            }
            if (group.Community &&
                group.Community.configuration &&
                group.Community.configuration.signupTermsPageId &&
                group.Community.configuration.signupTermsPageId != -1) {
                window.appGlobals.signupTermsPageId =
                    group.Community.configuration.signupTermsPageId;
            }
            else {
                window.appGlobals.signupTermsPageId = undefined;
            }
            this._setupGroupSaml(group);
            window.appGlobals.currentGroup = group;
            if ((group.configuration &&
                group.configuration.forceSecureSamlLogin &&
                !YpAccessHelpers.checkGroupAccess(group)) ||
                (group.Community &&
                    group.Community.configuration &&
                    group.Community.configuration.forceSecureSamlLogin &&
                    !YpAccessHelpers.checkCommunityAccess(group.Community))) {
                window.appGlobals.currentForceSaml = true;
            }
            else {
                window.appGlobals.currentForceSaml = false;
            }
            if (group.configuration && group.configuration.makeMapViewDefault) {
                this.selectedGroupTab = GroupTabTypes.Map;
            }
            if (group.Community &&
                group.Community.configuration &&
                group.Community.configuration.highlightedLanguages) {
                window.appGlobals.setHighlightedLanguages(group.Community.configuration.highlightedLanguages);
            }
            else {
                window.appGlobals.setHighlightedLanguages(undefined);
            }
            if (this.hasNonOpenPosts && this.tabCounters) {
                this._setupOpenTab();
            }
            if (group.configuration && group.configuration.maxNumberOfGroupVotes) {
                window.appUser.calculateVotesLeftForGroup(group);
            }
            if (group &&
                group.configuration &&
                group.configuration.isDataVisualizationGroup &&
                group.configuration.dataForVisualizationJson) {
                window.appDialogs.loadDataViz();
            }
        }
        if (this.hasNonOpenPosts &&
            this.tabCounters &&
            (this.newGroupRefresh || fromMainApp === true)) {
            this._setupOpenTab();
        }
        this.newGroupRefresh = false;
        window.appGlobals.postLoadGroupProcessing(group);
        this._startConfigCheckTimer();
        //TODO: Get this working, when you go back and fourth between survey group you get the wrong one until reload
        /*if (fromMainApp &&
          (this.collection as YpGroupData).configuration.groupType == 1
        ) {
          await this.updateComplete;
          const survey = this.$$("#aoiSurvey") as AoiSurvey;
          await survey.getEarl();
          this.requestUpdate();
        }*/
    }
    _setupGroupSaml(group) {
        if (group.Community &&
            group.Community.configuration &&
            group.Community.configuration.customSamlDeniedMessage) {
            window.appGlobals.currentSamlDeniedMessage =
                group.Community.configuration.customSamlDeniedMessage;
        }
        else {
            window.appGlobals.currentSamlDeniedMessage = undefined;
        }
        if (group.Community &&
            group.Community.configuration &&
            group.Community.configuration.customSamlLoginMessage) {
            window.appGlobals.currentSamlLoginMessage =
                group.Community.configuration.customSamlLoginMessage;
        }
        else {
            window.appGlobals.currentSamlLoginMessage = undefined;
        }
    }
    scrollToCollectionItemSubClass() {
        if (this.collection &&
            window.appGlobals.cache.backToCommunityGroupItems &&
            window.appGlobals.cache.backToCommunityGroupItems[this.collection.id]) {
            this.$$("#collectionItems").scrollToItem(window.appGlobals.cache.backToCommunityGroupItems[this.collection.id]);
            window.appGlobals.cache.backToCommunityGroupItems[this.collection.id] =
                undefined;
        }
    }
};
__decorate([
    property({ type: Object })
], YpGroup.prototype, "collection", void 0);
__decorate([
    property({ type: String })
], YpGroup.prototype, "searchingFor", void 0);
__decorate([
    property({ type: Boolean })
], YpGroup.prototype, "hasNonOpenPosts", void 0);
__decorate([
    property({ type: Boolean })
], YpGroup.prototype, "disableNewPosts", void 0);
__decorate([
    property({ type: Number })
], YpGroup.prototype, "selectedGroupTab", void 0);
__decorate([
    property({ type: Number })
], YpGroup.prototype, "configCheckTimer", void 0);
__decorate([
    state()
], YpGroup.prototype, "newGroupRefresh", void 0);
YpGroup = __decorate([
    customElement("yp-group")
], YpGroup);
export { YpGroup };
//# sourceMappingURL=yp-group.js.map