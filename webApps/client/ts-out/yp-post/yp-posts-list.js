var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { YpBaseElement } from "../common/yp-base-element.js";
import { flow } from "@lit-labs/virtualizer/layouts/flow.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/textfield/outlined-text-field.js";
import "./yp-posts-filter.js";
import "./yp-post-list-item.js";
import { nothing } from "lit";
let YpPostsList = class YpPostsList extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.filter = "newest";
        this.statusFilter = "open";
        this.noPosts = false;
        this.showSearchIcon = false;
        this.grid = false;
        this.moreToLoad = false;
        this.moreFromScrollTriggerActive = false;
        this.skipIronListWidth = false;
    }
    static get styles() {
        return [
            super.styles,
            css `
        .cardContainer {
          width: 100%;
          margin: 8px;
        }

        .postsFilter {
          padding-left: 16px;
          height: 36px;
        }

        yp-post-list-item {
          margin-bottom: 38px;
          margin-top: 38px;
        }

        .objectives {
          padding-bottom: 40px;
          max-width: 432px;
        }

        .description {
          padding: 12px;
        }

        yp-post-card {
        }

        #outerRegion {
          position: relative;
        }

        #scrollableRegion {
        }

        lit-virtualizer {
          //TODO: Check this !important usage
          max-width: 1012px !important;
          min-width: 1012px !important;
        }

        yp-posts-filter {
          margin-bottom: 8px;
          margin-left: 8px;
          margin-top: 16px;
        }

        #ironList {
        }

        .searchButton {
          padding: 8px;
          margin: 8px;
        }

        .searchContainer {
          margin-top: 8px;
        }

        yp-posts-filter {
        }

        .half {
          width: 50%;
        }

        .searchBox {
          margin-bottom: 22px;
        }

        .card {
          padding: 0;
          width: 100%;
        }

        yp-post-card {
          height: 435px !important;
          width: 416px !important;
        }

        .card[mini] {
          width: 210px;
          height: 100%;
        }

        .card[wide-padding] {
          padding: 16px !important;
        }

        .card[desktop-list] {
          padding: 0 !important;
          padding-top: 16px !important;
        }

        .card[is-last-item] {
          padding-bottom: 128px;
        }

        @media (max-width: 800px) {
          .searchBox {
            margin-bottom: 8px;
          }

          .searchBox {
            margin-top: 8px;
          }

          .half {
            width: 100%;
          }

          .searchContainer {
            margin-top: 0;
          }

          .postsFilter {
            padding-left: 16px;
            width: 215px !important;
          }
        }

        @media (max-width: 600px) {
          lit-virtualizer {
            margin-top: 80px;
            margin-left: 8px;
            margin-right: 8px;
            padding-left: 8px;
            padding-right: 8px;
            width: 100% !important;
            min-width: 100% !important;
          }
          .card {
            margin-bottom: 16px;
          }
        }

        .noIdeas {
          background-color: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
          max-width: 200px;
          padding: 16px;
          margin: 16px;
          margin-top: 32px;
        }

        .noIdeasText {
          font-weight: bold;
        }

        .card {
          padding: 0;
          padding-top: 8px;
        }

        yp-post-cover-media {
          width: 100%;
          height: 230px;
        }

        #searchInput {
          margin-left: 8px;
          margin-top: 14px;
        }

        [hidden] {
          display: none !important;
        }

        :focus {
        }

        .largeAjax {
          position: absolute;
          bottom: 32px;
        }

        a {
          text-decoration: none;
        }
      `,
        ];
    }
    _searchKey(event) {
        if (event.keyCode === 13) {
            this._search();
        }
        this.showSearchIcon = true;
    }
    render() {
        return html `
      <div class="layout vertical center-centser topMost">
        ${this.noPosts
            ? html `
              <div class="layout horiztonal center-center">
                <div
                  class="noIdeas layout horizontal center-center shadow-elevation-6dp shadow-transition"
                  ?hidden="${this.group.configuration.allPostsBlockedByDefault}"
                >
                  <div class="noIdeasText">${this.t("noIdeasHere")}</div>
                </div>
              </div>
            `
            : nothing}
        <div
          class="searchContainer layout horizontal wrap"
          ?hidden="${this.group.configuration.hidePostFilterAndSearch ||
            this.noPosts}"
        >
          <div class="layout horizontal center-center">
            <md-outlined-text-field
              id="searchInput"
              @keydown="${this._searchKey}"
              .label="${this.t("searchFor")}"
              .value="${this.searchingFor ? this.searchingFor : ""}"
              class="searchBox"
            >
            </md-outlined-text-field>

            ${this.searchingFor
            ? html `
                  <md-icon-button
                    aria-label="${this.t("clearSearchInput")}"
                    @click="${this._clearSearch}"
                    class="clear-search-trigger"
                    ><md-icon>clear</md-icon></md-icon-button
                  >
                `
            : nothing}

            <md-icon-button
              .label="${this.t("startSearch")}"
              @click="${this._search}"
              ?hiddsen="${!this.showSearchIcon}"
              ><md-icon>search</md-icon></md-icon-button
            >
          </div>
          <div class="layout horizontal">
            <yp-posts-filter
              @click="${this._tapOnFilter}"
              .subTitle="${this.subTitle ? this.subTitle : ""}"
              class="filter"
              id="postsFilter"
              .tabName="${this.statusFilter}"
              @refresh-group="${this.refreshGroupFromFilter}"
              .group="${this.group}"
              .filter="${this.filter}"
              .statusFilter="${this.statusFilter}"
              .searchingFor="${this.searchingFor}"
              .categoryId="${this.categoryId}"
              .postsCount="${this.postsCount}"
            >
            </yp-posts-filter>
          </div>
        </div>
        ${this.posts
            ? html `
              <lit-virtualizer
                id="list"
                .items=${this.posts}
                .layout="${flow()}"
                .scrollTarget="${window}"
                .renderItem=${this.renderPostItem.bind(this)}
                @rangeChanged=${this.scrollEvent}
              ></lit-virtualizer>
            `
            : nothing}
      </div>
    `;
    }
    renderPostItem(post, index) {
        const tabindex = index !== undefined ? index + 1 : 0;
        return html `
      <yp-post-list-item
        aria-label="${post.name}"
        ?is-last-item="${this._isLastItem(index)}"
        @keypress="${this._keypress.bind(this)}"
        @click="${this._selectedItemChanged.bind(this)}"
        tabindex="${tabindex}"
        id="postCard${post.id}"
        class="csard"
        .post="${post}"
      >
      </yp-post-list-item>
    `;
    }
    get desktopListFormat() {
        return this.wide && this.group != undefined && this.posts != undefined;
    }
    get wideNotListFormat() {
        return (this.wide &&
            !this.desktopListFormat &&
            this.group != undefined &&
            this.posts != undefined);
    }
    _isLastItem(index) {
        return this.posts && index >= this.posts.length - 1;
    }
    _keypress(event) {
        if (event.keyCode == 13) {
            this._selectedItemChanged(event);
        }
    }
    _categoryChanged(event) {
        if (event.detail) {
            this.categoryId = event.detail;
        }
        else {
            this.categoryId = undefined;
        }
    }
    _filterChanged(event) {
        this.filter = event.detail;
    }
    firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
    }
    _clearSearch() {
        this.searchingFor = undefined;
        this.filter = "newest";
        this.$$("#postsFilter")._updateAfterFiltering();
    }
    scrollEvent(event) {
        //TODO: Check this logic
        if (this.posts &&
            !this.moreFromScrollTriggerActive &&
            event.last != -1 &&
            event.last < this.posts.length &&
            event.last + 5 >= this.posts.length) {
            this.moreFromScrollTriggerActive = true;
            this._loadMoreData();
        }
    }
    scrollToPostForGroupId(event) {
        const groupId = event.detail.groupId;
        const postId = event.detail.postId;
        if (groupId && postId && this.group && this.group.id === groupId) {
            const posts = window.appGlobals.cache.currentPostListForGroup[groupId];
            if (posts) {
                for (let i = 0; i < posts.length; i++) {
                    if (posts[i].id == postId) {
                        this.$$("#list").scrollToIndex(i);
                        if (posts.length < i + 3) {
                            console.error(`Loading more data for group ${groupId} to scroll to post ${postId} at index ${i} length ${posts.length}`);
                            this._loadMoreData();
                        }
                        break;
                    }
                }
            }
        }
    }
    async connectedCallback() {
        super.connectedCallback();
        this.addListener("yp-filter-category-change", this._categoryChanged);
        this.addListener("yp-filter-changed", this._filterChanged);
        this.addGlobalListener("yp-scroll-to-post-for-group-id", this.scrollToPostForGroupId.bind(this));
        this.addListener("refresh", this._refreshPost);
        if (this.posts) {
            if (window.appGlobals.cache.cachedPostItem !== undefined) {
                this.scrollToPost(window.appGlobals.cache.cachedPostItem);
                window.appGlobals.cache.cachedPostItem = undefined;
            }
            if (window.appGlobals.groupLoadNewPost) {
                window.appGlobals.groupLoadNewPost = false;
                this.refreshGroupFromFilter();
            }
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeListener("yp-filter-category-change", this._categoryChanged);
        this.removeListener("yp-filter-changed", this._filterChanged);
        this.removeListener("refresh", this._refreshPost);
        this.removeGlobalListener("yp-scroll-to-post-for-group-id", this.scrollToPostForGroupId.bind(this));
    }
    _selectedItemChanged(event) {
        const postCard = event.target;
        postCard.clickOnA();
    }
    async _refreshPost(event) {
        const postId = event.detail.id;
        if (postId) {
            const post = (await window.serverApi.getPost(postId));
            if (post && this.posts) {
                for (let i = 0; i < this.posts.length; i++) {
                    if (this.posts[i].id == post.id) {
                        this.posts[i] = post;
                        window.appGlobals.cache.updatePostInCache(post);
                        this.requestUpdate;
                        await this.updateComplete;
                        setTimeout(() => {
                            //TODO: See if we still need to do something like this
                            //(this.$$('#ironList') as IronListInterface).fire('iron-resize');
                        });
                        break;
                    }
                }
            }
        }
    }
    _getPostLink(post) {
        if (post) {
            if (post.Group &&
                post.Group.configuration &&
                post.Group.configuration.disablePostPageLink) {
                return "#";
            }
            else if (post.Group &&
                post.Group.configuration &&
                post.Group.configuration.resourceLibraryLinkMode) {
                return post.description.trim();
            }
            else {
                return "/post/" + post.id;
            }
        }
        else {
            console.warn("Trying to get empty post link");
            return undefined;
        }
    }
    get scrollOffset() {
        const list = this.$$("ironList");
        if (list) {
            let offset = list.offsetTop;
            offset -= 75;
            if (list.offsetTop > 0 && offset > 0) {
                console.info("Post list scroll offset: " + offset);
                return offset;
            }
            else {
                if (this.wide)
                    offset = 550;
                else
                    offset = 700;
                if (this.group && this.group.configuration) {
                    if (this.group.configuration.hideAllTabs)
                        offset -= 60;
                    if (this.group.configuration.hideNewPost)
                        offset -= 100;
                    if (this.group.configuration.hidePostFilterAndSearch)
                        offset -= 100;
                }
                console.info("Post list (manual) scroll offset: " + offset);
                return offset;
            }
        }
        else {
            console.warn("No list for scroll offset");
            return null;
        }
    }
    _tapOnFilter() {
        window.appGlobals.activity("click", "filter");
    }
    _search() {
        window.appGlobals.activity("click", "search");
        this.searchingFor = this.$$("#searchInput").value;
        if (this.searchingFor && this.searchingFor != "") {
            this.refreshGroupFromFilter();
        }
    }
    buildPostsUrlPath() {
        return this.$$("#postsFilter").buildPostsUrlPath();
    }
    async scrollToPost(post) {
        if (post && this.posts) {
            console.info("Scrolling to post: " + post.id);
            for (let i = 0; i < this.posts.length; i++) {
                if (this.posts[i] == post) {
                    this.$$("#list").scrollToIndex(i);
                    break;
                }
            }
            this.fireGlobal("yp-refresh-activities-scroll-threshold");
        }
        else {
            console.error("No post id on goToPostId");
        }
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("statusFilter") &&
            this.group &&
            this.statusFilter) {
            const allowedForceByValues = [
                "oldest",
                "newest",
                "top",
                "most_debated",
                "random",
                "alphabetical",
            ];
            this.randomSeed = Math.random();
            this.posts = undefined;
            this.noPosts = false;
            if (this.group) {
                this.moreToLoad = true;
                if (window.appGlobals.originalQueryParameters &&
                    window.appGlobals.originalQueryParameters["categoryId"]) {
                    this.categoryId = window.appGlobals.originalQueryParameters["categoryId"];
                    window.appGlobals.originalQueryParameters["categoryId"] = undefined;
                }
                else {
                    this.categoryId = undefined;
                }
                if (this.group.configuration &&
                    this.group.configuration.forcePostSortMethodAs &&
                    allowedForceByValues.indexOf(this.group.configuration.forcePostSortMethodAs) > -1) {
                    this.filter = this.group.configuration.forcePostSortMethodAs;
                }
                else {
                    if (this.group.configuration &&
                        this.group.configuration.canAddNewPosts != undefined) {
                        if (this.group.configuration.canAddNewPosts === true) {
                            this.filter = "newest";
                        }
                        else if (this.group.configuration.canAddNewPosts === false &&
                            this.group.configuration.canVote === false) {
                            this.filter = "top";
                        }
                        else {
                            this.filter = "random";
                        }
                    }
                    else if (!this.filter) {
                        this.filter = "newest";
                    }
                }
                console.info("LOADMORE FOR CONTAINER");
                this._loadMoreData();
            }
        }
        else if (this.group && changedProperties.has("filter") && this.filter) {
            //this._loadMoreData();
        }
        else if (this.group &&
            changedProperties.has("categoryId") &&
            this.categoryId) {
            this._loadMoreData();
        }
        if (changedProperties.has("searchingFor")) {
            if (this.searchingFor && this.searchingFor != "") {
                this.moreToLoad = true;
                this.showSearchIcon = true;
            }
            else {
                this.showSearchIcon = false;
            }
        }
    }
    refreshGroupFromFilter() {
        this.posts = undefined;
        this.moreToLoad = true;
        this._loadMoreData();
    }
    async _loadMoreData() {
        if (this.moreToLoad && this.group) {
            this.moreToLoad = false;
            this.noPosts = false;
            let objectIdString;
            let objectType;
            let url;
            if (this.userId) {
                objectIdString = this.userId + "/posts";
                objectType = "users";
            }
            else {
                objectIdString = `${this.group.id}`;
                objectType = "groups";
            }
            if (this.searchingFor) {
                url =
                    "/api/" +
                        objectType +
                        "/" +
                        objectIdString +
                        "/search/" +
                        this.searchingFor;
            }
            else {
                url =
                    "/api/" + objectType + "/" + objectIdString + "/posts/" + this.filter;
                if (this.categoryId) {
                    url += "/" + this.categoryId;
                }
                else {
                    url += "/null";
                }
                url += "/" + this.statusFilter;
            }
            const offset = this.posts ? this.posts.length : 0;
            url += "?offset=" + offset;
            if (this.filter == "random" && this.randomSeed) {
                url += "&randomSeed=" + this.randomSeed;
            }
            const postsInfo = (await window.serverApi.getGroupPosts(url));
            if (postsInfo) {
                this.postsCount = postsInfo.totalPostsCount;
                this.fire("yp-post-count", {
                    type: this.statusFilter,
                    count: this.postsCount,
                });
                if (!this.posts) {
                    this.posts = postsInfo.posts;
                }
                else {
                    for (let i = 0; i < postsInfo.posts.length; i++) {
                        this.posts.push(postsInfo.posts[i]);
                    }
                }
                if (postsInfo.posts.length == 0 && this.posts.length == 0) {
                    this.noPosts = true;
                }
                else {
                    window.appGlobals.cache.setCurrentPostListForGroup(this.group.id, this.posts);
                }
                if (postsInfo.posts.length > 0) {
                    this.noPosts = false;
                }
                else {
                    if (this.searchingFor && this.searchingFor != "") {
                        this.noPosts = false;
                    }
                }
                setTimeout(() => {
                    const postFilter = this.$$("#postsFilter");
                    if (postFilter) {
                        postFilter._updateTitle();
                    }
                }, 20);
                if (postsInfo.posts.length > 0 &&
                    postsInfo.posts.length != this.postsCount) {
                    this.moreToLoad = true;
                }
                this.fireGlobal("yp-refresh-activities-scroll-threshold");
                this._processCategories();
                this._checkForMultipleLanguages(postsInfo.posts);
                window.appGlobals.cache.addPostsToCacheLater(postsInfo.posts);
                this.requestUpdate();
            }
        }
        this.moreFromScrollTriggerActive = false;
    }
    _checkForMultipleLanguages(posts) {
        if (!localStorage.getItem("dontPromptForAutoTranslation") &&
            !sessionStorage.getItem("dontPromptForAutoTranslation")) {
            let firstLanguage;
            let firstContent;
            let multipleLanguages = false;
            posts.forEach(function (post) {
                if (post.language && !multipleLanguages) {
                    if (!firstLanguage && post.language !== "??") {
                        firstLanguage = post.language;
                        firstContent = post.description;
                    }
                    else if (firstLanguage &&
                        firstLanguage !== post.language &&
                        post.language !== "??") {
                        multipleLanguages = true;
                        console.info("Multiple post languages: " +
                            firstLanguage +
                            " and " +
                            post.language);
                        //console.info("A: "+firstContent+" B: "+post.description);
                    }
                }
            });
            if (multipleLanguages) {
                /* TODO: Fix explicit typedef
                window.appDialogs.getDialogAsync('autoTranslateDialog', (dialog: { openLaterIfAutoTranslationEnabled: () => void }) => {
                  dialog.openLaterIfAutoTranslationEnabled();
                }); */
            }
        }
    }
    _processCategories() {
        if (this.categoryId && this.group.Categories) {
            for (let i = 0; i < this.group.Categories.length; i++) {
                if (this.group.Categories[i].id == this.categoryId) {
                    this.selectedCategoryName = this.group.Categories[i].name;
                    //this.$.layout.updateFilter();
                }
            }
        }
        else {
            this.selectedCategoryName = "categories.all";
            //this.$.layout.updateFilter();
        }
    }
};
__decorate([
    property({ type: String })
], YpPostsList.prototype, "searchingFor", void 0);
__decorate([
    property({ type: String })
], YpPostsList.prototype, "subTitle", void 0);
__decorate([
    property({ type: String })
], YpPostsList.prototype, "filter", void 0);
__decorate([
    property({ type: String })
], YpPostsList.prototype, "statusFilter", void 0);
__decorate([
    property({ type: Array })
], YpPostsList.prototype, "posts", void 0);
__decorate([
    property({ type: Number })
], YpPostsList.prototype, "userId", void 0);
__decorate([
    property({ type: Object })
], YpPostsList.prototype, "group", void 0);
__decorate([
    property({ type: Number })
], YpPostsList.prototype, "categoryId", void 0);
__decorate([
    property({ type: Number })
], YpPostsList.prototype, "postsCount", void 0);
__decorate([
    property({ type: String })
], YpPostsList.prototype, "selectedCategoryName", void 0);
__decorate([
    property({ type: Number })
], YpPostsList.prototype, "selectedGroupTab", void 0);
__decorate([
    property({ type: Boolean })
], YpPostsList.prototype, "noPosts", void 0);
__decorate([
    property({ type: Boolean })
], YpPostsList.prototype, "showSearchIcon", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], YpPostsList.prototype, "grid", void 0);
__decorate([
    state()
], YpPostsList.prototype, "randomSeed", void 0);
YpPostsList = __decorate([
    customElement("yp-posts-list")
], YpPostsList);
export { YpPostsList };
//# sourceMappingURL=yp-posts-list.js.map