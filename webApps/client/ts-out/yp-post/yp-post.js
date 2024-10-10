var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { YpAccessHelpers } from "../common/YpAccessHelpers.js";
import { YpCollection } from "../yp-collection/yp-collection.js";
import { nothing, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
//import '@material/web/navigationbar/navigation-bar.js';
//import { MdNavigationBar } from '@material/web/navigationbar/navigation-bar.js';
//import '@material/web/navigationtab/navigation-tab.js';
//import { MdNavigationTab } from '@material/web/navigationtab/navigation-tab.js';
import "lit-google-map";
import "@material/web/fab/fab.js";
import { YpFormattingHelpers } from "../common/YpFormattingHelpers.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
import "./yp-post-header.js";
import "./yp-post-points.js";
import "./yp-post-user-images.js";
import { ifDefined } from "lit/directives/if-defined.js";
export const PostTabTypes = {
    Debate: 0,
    News: 1,
    Location: 2,
    Photos: 3,
};
let YpPost = class YpPost extends YpCollection {
    constructor() {
        super("post", null, "lightbulb_outline", "post.create");
        this.isAdmin = false;
        this.disableNewPosts = false;
        this.post = undefined;
        this.scrollToPointId = undefined;
        this.debateCount = undefined;
        this.photosCount = undefined;
    }
    scrollToCollectionItemSubClass() {
        //TODO: Do we need this
    }
    setupTheme() {
        try {
            const group = this.post.Group;
            if (group.configuration && group.configuration?.theme) {
                if (group.configuration?.inheritThemeFromCommunity && group.Community) {
                    window.appGlobals.theme.setTheme(undefined, group.Community.configuration);
                }
                else {
                    window.appGlobals.theme.setTheme(undefined, group.configuration);
                }
            }
            else if (group.configuration &&
                group.configuration?.themeOverrideColorPrimary) {
                window.appGlobals.theme.setTheme(undefined, group.configuration);
            }
            else if (group.Community && group.Community.configuration.theme) {
                window.appGlobals.theme.setTheme(undefined, group.Community.configuration);
            }
            else if (group.theme_id) {
                window.appGlobals.theme.setTheme(group.theme_id, group.configuration);
            }
            else if (group.Community &&
                group.Community.configuration.themeOverrideColorPrimary) {
                window.appGlobals.theme.setTheme(group.Community.theme_id, group.Community.configuration);
            }
            else if (group.Community &&
                group.Community.Domain &&
                group.Community.Domain.configuration.theme) {
                window.appGlobals.theme.setTheme(group.Community.Domain.theme_id);
            }
            else {
                window.appGlobals.theme.setTheme(1);
            }
        }
        catch (error) {
            console.error("Error setting group theme", error);
        }
    }
    static get styles() {
        return [
            super.styles,
            css `
        .outerFrameContainer {
          max-width: 1034px;
          width: 1034px;
          background-color: var(--md-sys-color-surface);
          margin: 0 auto;
          padding: 32px;
        }

        .frameContainer {
          max-width: 970px;
          width: 970px;
          min-height: 1000px;
          margin: 32px;
          margin-top: 0;
          padding: 32px;
          border-radius: 4px;
          border: 1px solid var(--md-sys-color-outline);
          position: relative;
          background-color: var(--md-sys-color-surface);
        }

        .dividerLine {
          opacity: 0.3;
          max-width: 88%;
        }

        .mapContainer {
          max-width: 1080px;
        }

        .postHeader {
          padding: 16px;
          background-color: var(--md-sys-color-primary);
          color: var(--md-sys-color-on-primary);
          width: 940px;
        }

        .postStaticHeader {
          position: fixed;
          top: 10%;
          z-index: 1000;
        }

        .arrowNavigation {
          --md-filled-tonal-icon-button-container-width: 64px;
          --md-filled-tonal-icon-button-container-height: 64px;
          --md-filled-tonal-icon-button-icon-size: 48px;
          position: fixed;
          top: 500px;
          transform: translateY(-50%);
          z-index: 20;
        }

        .leftArrowNavigationButton {
          left: calc(50% - (940px / 2) - 80px);
        }

        .rightArrowNavigationButton {
          right: calc(50% - (940px / 2) - 80px);
        }

        md-tabs {
          margin-top: 64px;
          min-width: 90%;
        }

        .dividerLine {
          border-top: 1px solid var(--md-sys-color-outline);
          margin-top: 64px;
          margin-bottom: 16px;
        }

        ac-activities {
          padding-top: 8px;
        }

        yp-post-user-images {
          padding-top: 32px;
        }

        @media (max-width: 960px) {
          .postHeader {
            width: 600px;
          }
        }

        @media (max-width: 960px) {
          .postHeader {
            width: 400px;
          }

          .outerFrameContainer {
            max-width: 100%;
            width: 100%;
          }

          .frameContainer {
            max-width: 100%;
            width: 100%;
            margin: 0;
            padding: 0;
            border-radius: 0;
            border: none;
          }
        }

        @media (max-width: 360px) {
          .postHeader {
            height: 100%;
            width: 360px;
            padding: 0;
          }
        }

        [hidden] {
          display: none !important;
        }
      `,
        ];
    }
    get leftArrowDisabled() {
        if (window.appGlobals.cache.getPreviousPostInGroupList(this.post.group_id, this.post.id)) {
            return false;
        }
        else {
            return true;
        }
    }
    get rightArrowDisabled() {
        if (window.appGlobals.cache.getNextPostInGroupList(this.post.group_id, this.post.id)) {
            return false;
        }
        else {
            return true;
        }
    }
    get bothArrowsDisabled() {
        if (this.leftArrowDisabled && this.rightArrowDisabled) {
            return true;
        }
        else {
            return false;
        }
    }
    handleKeydown(event) {
        if (event.key === "ArrowLeft" && !this.leftArrowDisabled) {
            this.goToPreviousPost();
        }
        else if (event.key === "ArrowRight" && !this.rightArrowDisabled) {
            this.goToNextPost();
        }
        else if (event.key === "Escape") {
            if (this.post && window.location.pathname.indexOf("/edit") === -1) {
                event.preventDefault();
                event.stopPropagation();
                YpNavHelpers.redirectTo("/group/" + this.post.group_id);
            }
        }
    }
    renderPostStaticHeader() {
        return html `
      <yp-post-header
        ?hasNoLeftRightButtons="${this.bothArrowsDisabled}"
        onlyRenderTopActionBar
        .post="${this.post}"
      ></yp-post-header>
    `;
    }
    renderPostHeader() {
        return html `
      <yp-post-header
        hideTopActionBar
        id="postCard"
        .post="${this.post}"
        @refresh="${this._getPost}"
      ></yp-post-header>
    `;
    }
    renderPostTabs() {
        if (this.post && !this.post.Group.configuration?.hideAllTabs) {
            return html `
        <md-tabs
          @change="${this._selectTab}"
          .activeTabIndex="${this.selectedTab}"
        >
          <md-secondary-tab ?has-static-theme="${this.hasStaticTheme}"
            >${this.tabDebateCount}<md-icon slot="icon"
              >lightbulb_outline</md-icon
            ></md-secondary-tab
          >

          ${this.renderNewsAndMapTabs()}
          <md-secondary-tab ?has-static-theme="${this.hasStaticTheme}"
            >${this.tabPhotosCount}<md-icon slot="icon"
              >photo_camera</md-icon
            ></md-secondary-tab
          >
        </md-tabs>
      `;
        }
        else {
            return html `<md-divider class="dividerLine"></md-divider>`;
        }
    }
    renderCurrentPostTabPage() {
        let page;
        if (this.post) {
            switch (this.selectedTab) {
                case PostTabTypes.Debate:
                    page = html `<yp-post-points
            id="pointsSection"
            role="main"
            aria-label="${this.t("debate")}"
            ?isPostPage="${this.isPostPage}"
            ?isAdmin="${this.isAdmin}"
            .post="${this.post}"
            .scrollToId="${this.scrollToPointId}"
          ></yp-post-points>`;
                    break;
                case PostTabTypes.News:
                    page = html `<ac-activities
            id="postNews"
            .selectedTab="${this.selectedTab}"
            .disableNewPosts="${this.disableNewPosts}"
            .postGroupId="${this.post.group_id}"
            .postId="${this.post.id}"
          ></ac-activities>`;
                    break;
                case PostTabTypes.Location:
                    page = this.post.location
                        ? html `<div
                class="mapContainer shadow-elevation-4dp shadow-transition"
              >
                <lit-google-map
                  additionalMapOptions="{'keyboardShortcuts':false}"
                  api-key="${ifDefined(window.appGlobals.googleMapsApiKey)}"
                  id="map"
                  libraries="places"
                  class="map"
                  .mapType="${this.post.location.mapType}"
                  .zoom="${this.post.location.map_zoom}"
                  fitToMarkers=""
                >
                  <lit-google-map-marker
                    slot="markers"
                    .latitude="${this.post.location.latitude}"
                    .longitude="${this.post.location.longitude}"
                    id="marker"
                  ></lit-google-map-marker>
                </lit-google-map>
              </div>`
                        : html ` <h1 style="padding-top: 16px">
                ${this.t("post.noLocation")}
              </h1>`;
                    break;
                case PostTabTypes.Photos:
                    page = html ` <div class="layout horizontal center-center">
            <yp-post-user-images .post="${this.post}"></yp-post-user-images>
          </div>`;
                    break;
            }
        }
        return page;
    }
    goToPreviousPost() {
        if (this.post) {
            const previousPost = window.appGlobals.cache.getPreviousPostInGroupList(this.post.group_id, this.post.id);
            if (previousPost) {
                YpNavHelpers.goToPost(previousPost.id);
                window.appGlobals.cache.cachedPostItem = previousPost;
                this.fireGlobal("yp-scroll-to-post-for-group-id", {
                    groupId: this.post.group_id,
                    postId: previousPost.id,
                });
            }
        }
    }
    goToNextPost() {
        if (this.post) {
            const nextPost = window.appGlobals.cache.getNextPostInGroupList(this.post.group_id, this.post.id);
            if (nextPost) {
                YpNavHelpers.goToPost(nextPost.id);
                window.appGlobals.cache.cachedPostItem = nextPost;
                this.fireGlobal("yp-scroll-to-post-for-group-id", {
                    groupId: this.post.group_id,
                    postId: nextPost.id,
                });
            }
        }
    }
    renderNavigationButtons() {
        return html `
      <div style="position: relative;" ?hidden="${this.bothArrowsDisabled}">
        <md-filled-tonal-icon-button
          ?disabled="${this.leftArrowDisabled}"
          @click="${this.goToPreviousPost}"
          class="arrowNavigation leftArrowNavigationButton"
        >
          <md-icon>keyboard_arrow_left</md-icon>
        </md-filled-tonal-icon-button>
        <md-filled-tonal-icon-button
          ?disabled="${this.rightArrowDisabled}"
          @click="${this.goToNextPost}"
          class="arrowNavigation rightArrowNavigationButton"
        >
          <md-icon>keyboard_arrow_right</md-icon>
        </md-filled-tonal-icon-button>
      </div>
    `;
    }
    get isEditingPost() {
        return (this.subRoute?.endsWith("/edit") || this.subRoute?.endsWith("/edit/"));
    }
    render() {
        //TODO: Bottom add new post button
        if (this.post && !this.isEditingPost) {
            return html `
        <div class="layout vertical center-center outerFrameContainer">
          <div class="frameContainer">
            <div class="layout vertical">
              ${this.renderPostStaticHeader()} ${this.renderPostHeader()}
            </div>
            ${this.renderNavigationButtons()}
            <div class="layout vertical center-center">
              ${this.renderPostTabs()}
            </div>
            ${this.renderCurrentPostTabPage()}
            ${!this.disableNewPosts &&
                this.post &&
                !this.post.Group.configuration?.hideNewPost &&
                !this.post.Group.configuration?.hideNewPostOnPostPage
                ? html ``
                : nothing}
          </div>
        </div>
      `;
        }
        else if (this.post) {
            return html `
        <yp-post-edit
          disableDialog
          .new="${false}"
          .post="${this.post}"
          .group="${this.post.Group}"
        ></yp-post-edit>
      `;
        }
        else {
            return html ``;
        }
    }
    get tabDebateCount() {
        const labelTranslation = this.t("post.tabs.debate");
        return `${labelTranslation} (${this.debateCount != undefined ? this.debateCount : "..."})`;
    }
    get tabPhotosCount() {
        const labelTranslation = this.t("post.tabs.photos");
        if (this.photosCount) {
            return `${labelTranslation} (${this.photosCount})`;
        }
        else {
            return `${labelTranslation}`;
        }
    }
    _selectedTabChanged() {
        //TODO: Make sure to polyfill Object.keys IE11
        if (this.selectedTab) {
            const tabKeys = Object.keys(PostTabTypes);
            const tabName = tabKeys[this.selectedTab]?.toLowerCase();
            if (this.post) {
                //YpNavHelpers.redirectTo('/post/' + this.post.id + '/' + tabName);
            }
            if (tabName) {
                window.appGlobals.activity("open", "post_tab_" + tabName, "", {
                    id: this.collectionId,
                    modelType: "post",
                });
            }
        }
        else {
            console.error("No selected tab");
        }
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("selectedTab")) {
            this._selectedTabChanged();
        }
    }
    get isPostPage() {
        return this.currentPage === "post";
    }
    _newPost() {
        window.appGlobals.activity("open", "newPost");
        this.fire("yp-new-post", { group: this.post.Group });
    }
    connectedCallback() {
        super.connectedCallback();
        this.addListener("yp-debate-info", this._updateDebateInfo);
        this.addListener("yp-post-image-count", this._updatePostImageCount);
        document.addEventListener("keydown", this.handleKeydown.bind(this));
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeListener("yp-debate-info", this._updateDebateInfo);
        this.removeListener("yp-post-image-count", this._updatePostImageCount);
        document.removeEventListener("keydown", this.handleKeydown.bind(this));
    }
    _updatePostImageCount(event) {
        const imageCount = event.detail;
        this.photosCount = YpFormattingHelpers.number(imageCount);
    }
    _updateDebateInfo(event) {
        const detail = event.detail;
        this.debateCount = YpFormattingHelpers.number(detail.count);
    }
    _mainContainerClasses() {
        if (!this.wide) {
            return "layout horizontal wrap";
        }
        else {
            return "layout horizontal center-center";
        }
    }
    _headerClasses() {
        if (!this.wide) {
            return "layout vertical postHeader wrap";
        }
        else {
            return "layout horizontal postHeader";
        }
    }
    get postName() {
        if (this.post && this.post.name) {
            return YpFormattingHelpers.truncate(YpFormattingHelpers.trim(this.post.name), 200);
        }
        else {
            return "";
        }
    }
    get postDescription() {
        if (this.post && this.post.description) {
            return YpFormattingHelpers.truncate(YpFormattingHelpers.trim(this.post.description), 10000, "...");
        }
        else {
            return "";
        }
    }
    async getCollection() {
        console.warn("Trying to get collection in post");
    }
    async _getPost() {
        if (this.collectionId) {
            this.post = undefined;
            this.post = (await window.serverApi.getCollection(this.collectionType, this.collectionId));
            if (this.post) {
                this.setupTheme();
                this._processIncomingPost();
                this._getHelpPages("group", this.post.group_id);
            }
        }
        else {
            console.error("No collection id for _getPost");
        }
    }
    collectionIdChanged() {
        if (this.collectionId) {
            const cachedItem = window.appGlobals.cache.cachedPostItem;
            if (cachedItem && cachedItem.id == this.collectionId) {
                this.post = cachedItem;
                this._processIncomingPost();
                console.debug("Got post from single item cache");
            }
            else if (window.appGlobals.cache.getPostFromCache(this.collectionId)) {
                this.post = window.appGlobals.cache.getPostFromCache(this.collectionId);
                this._processIncomingPost(true);
                console.debug("Got post from post multi cache possibly from recommendations");
            }
            else {
                console.debug("Got post from server not cache");
                this.post = undefined;
                this._getPost();
            }
        }
    }
    _processIncomingPost(fromCache = false) {
        if (this.post) {
            this.refresh();
            if (!fromCache)
                window.appGlobals.cache.addPostsToCacheLater([this.post]);
            window.appGlobals.recommendations.getNextRecommendationForGroup(this.post.group_id, this.post.id, this._processRecommendation.bind(this));
            this.isAdmin = YpAccessHelpers.checkPostAdminOnlyAccess(this.post);
        }
        else {
            console.error("Trying to refresh without post");
        }
    }
    _processRecommendation(recommendedPost) {
        if (recommendedPost && this.post) {
            let postName = recommendedPost.name;
            if (this.wide) {
                postName = YpFormattingHelpers.truncate(postName, 60);
            }
            else {
                postName = YpFormattingHelpers.truncate(postName, 30);
            }
            this.fire("yp-set-next-post", {
                currentPostId: this.post.id,
                goForwardToPostId: recommendedPost.id,
                goForwardPostName: postName,
            });
        }
        else if (this.post) {
            this.fire("yp-set-next-post", {
                currentPostId: this.post.id,
                goForwardToPostId: null,
                goForwardPostName: null,
            });
            console.log("Not recommended post");
        }
    }
    refresh() {
        if (this.post) {
            if (this.post.Group.configuration &&
                this.post.Group.configuration?.canAddNewPosts != undefined) {
                if (this.post.Group.configuration?.canAddNewPosts === true) {
                    this.disableNewPosts = false;
                }
                else {
                    this.disableNewPosts = true;
                }
            }
            else {
                this.disableNewPosts = false;
            }
            if (this.post.Group.Community) {
                window.appGlobals.analytics.setCommunityAnalyticsTracker(this.post.Group.Community.google_analytics_code);
                if (this.post.Group.Community.configuration) {
                    window.appGlobals.analytics.setCommunityPixelTracker(this.post.Group.Community.configuration.facebookPixelId);
                }
                if (this.post.Group.Community.configuration &&
                    this.post.Group.Community.configuration.customSamlLoginMessage) {
                    window.appGlobals.currentSamlLoginMessage =
                        this.post.Group.Community.configuration.customSamlLoginMessage;
                }
                else {
                    window.appGlobals.currentSamlLoginMessage = undefined;
                }
            }
            else {
                console.error("No community!");
            }
            window.appGlobals.setAnonymousGroupStatus(this.post.Group);
            window.appGlobals.setRegistrationQuestionGroup(this.post.Group);
            if (this.post.Group.configuration &&
                this.post.Group.configuration?.defaultLocale != null) {
                window.appGlobals.changeLocaleIfNeeded(this.post.Group.configuration?.defaultLocale);
            }
            if (this.post.Group.configuration &&
                this.post.Group.configuration?.locationHidden != undefined) {
                this.locationHidden = this.post.Group.configuration?.locationHidden;
            }
            else {
                this.locationHidden = false;
            }
            this.fire("yp-change-header", {
                headerTitle: YpFormattingHelpers.truncate(this.post.Group.name, 80),
                documentTitle: this.post.name,
                headerDescription: "", //this.truncate(this.post.Group.objectives,45),
                backPath: "/group/" + this.post.group_id,
                backListItem: this.post,
                hideHelpIcon: this.post.Group.configuration &&
                    this.post.Group.configuration?.hideHelpIcon
                    ? true
                    : null,
            });
            if (this.post.Group.configuration &&
                this.post.Group.configuration?.disableFacebookLoginForGroup === true) {
                window.appGlobals.disableFacebookLoginForGroup = true;
            }
            else {
                window.appGlobals.disableFacebookLoginForGroup = false;
            }
            this.fire("yp-set-home-link", {
                type: "group",
                id: this.post.Group.id,
                name: this.post.Group.name,
            });
            if (this.post.Group &&
                this.post.Group.Community &&
                this.post.Group.Community.configuration &&
                this.post.Group.Community.configuration.signupTermsPageId &&
                this.post.Group.Community.configuration.signupTermsPageId != -1) {
                window.appGlobals.signupTermsPageId =
                    this.post.Group.Community.configuration.signupTermsPageId;
            }
            else {
                window.appGlobals.signupTermsPageId = undefined;
            }
            window.appGlobals.currentGroup = this.post.Group;
            if ((this.post.Group.configuration &&
                this.post.Group.configuration?.forceSecureSamlLogin &&
                !YpAccessHelpers.checkGroupAccess(this.post.Group)) ||
                (this.post.Group.Community &&
                    this.post.Group.Community.configuration &&
                    this.post.Group.Community.configuration.forceSecureSamlLogin &&
                    !YpAccessHelpers.checkCommunityAccess(this.post.Group.Community))) {
                window.appGlobals.currentForceSaml = true;
            }
            else {
                window.appGlobals.currentForceSaml = false;
            }
            if ((this.post.Group.configuration &&
                this.post.Group.configuration?.forceSecureSamlLogin) ||
                (this.post.Group.Community &&
                    this.post.Group.Community.configuration &&
                    this.post.Group.Community.configuration.forceSecureSamlLogin)) {
                window.appGlobals.currentForceSaml = true;
            }
            else {
                window.appGlobals.currentForceSaml = false;
            }
            if (this.post.Group.Community &&
                this.post.Group.Community.configuration &&
                this.post.Group.Community.configuration.customSamlDeniedMessage) {
                window.appGlobals.currentSamlDeniedMessage =
                    this.post.Group.Community.configuration.customSamlDeniedMessage;
            }
            else {
                window.appGlobals.currentSamlDeniedMessage = undefined;
            }
            if (this.post.Group.configuration &&
                this.post.Group.configuration?.maxNumberOfGroupVotes) {
                window.appUser.calculateVotesLeftForGroup(this.post.Group);
            }
        }
    }
};
__decorate([
    property({ type: Boolean })
], YpPost.prototype, "isAdmin", void 0);
__decorate([
    property({ type: Boolean })
], YpPost.prototype, "disableNewPosts", void 0);
__decorate([
    property({ type: String })
], YpPost.prototype, "currentPage", void 0);
__decorate([
    property({ type: Object })
], YpPost.prototype, "post", void 0);
__decorate([
    property({ type: Number })
], YpPost.prototype, "scrollToPointId", void 0);
__decorate([
    property({ type: String })
], YpPost.prototype, "debateCount", void 0);
__decorate([
    property({ type: String })
], YpPost.prototype, "photosCount", void 0);
YpPost = __decorate([
    customElement("yp-post")
], YpPost);
export { YpPost };
//# sourceMappingURL=yp-post.js.map