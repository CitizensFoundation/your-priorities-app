var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing } from "lit";
import { property, customElement, state } from "lit/decorators.js";
import "@material/web/button/outlined-button.js";
import "../yp-point/yp-point-news-story-edit.js";
import "./ac-activity.js";
import "./ac-activity-recommended-posts.js";
import "@lit-labs/virtualizer";
import { YpBaseElementWithLogin } from "../common/yp-base-element-with-login.js";
import { FlowLayout } from "@lit-labs/virtualizer/layouts/flow.js";
import { ShadowStyles } from "../common/ShadowStyles.js";
let AcActivities = class AcActivities extends YpBaseElementWithLogin {
    constructor() {
        super(...arguments);
        this.disableNewPosts = false;
        this.noRecommendedPosts = true;
        this.gotInitialData = false;
        this.mode = "activities";
        this.closeNewsfeedSubmissions = false;
        this._moreToLoad = false;
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("domainId")) {
            this._domainIdChanged();
        }
        if (changedProperties.has("communityId")) {
            this._communityIdChanged();
        }
        if (changedProperties.has("groupId")) {
            this._groupIdChanged();
        }
        if (changedProperties.has("postId")) {
            this._postIdChanged();
        }
        if (changedProperties.has("userId")) {
            this._userIdChanged();
        }
    }
    static get styles() {
        return [
            super.styles,
            ShadowStyles,
            css `
        :host {
          height: 100%;
        }

        lit-virtualizer {
          height: 100vh;
          width: 100vw;
        }

        .addNewsBox {
          background-color: var(--md-sys-primary-container);
          color: var(--md-sys-on-primary-container);
          width: 550px;
          height: 100%;
          padding-left: 16px;
          padding-right: 16px;
          margin-top: 32px;
          margin-left: 16px;
          margin-right: 16px;
        }

        @media (max-width: 600px) {
          .addNewsBox {
            width: 100%;
            height: 100%;
            margin-bottom: 8px;
            margin-top: 8px;
            margin-left: 0;
            margin-right: 0;
          }
        }

        @media (max-width: 340px) {
          .addNewsBox {
            width: 100%;
            height: 100%;
            margin-bottom: 8px;
            margin-top: 8px;
            margin-left: 0;
            margin-right: 0;
          }
        }

        .activityContainer {
          width: 550px;
          margin: 0;
          padding: 0;
          margin-bottom: 16px;
          margin-top: 16px;
          background-color: var(--md-sys-color-surface-container-low);
        }

        @media (max-width: 600px) {
          .activityContainer {
            width: 100%;
          }
        }

        .recommendedPosts[not-active] {
          display: none;
        }

        .recommendedPosts[small] {
          display: none;
        }

        .mainActivityContent {
          height: 100% !important;
        }

        .headerUserImage {
          padding-top: 16px;
        }

        h1 {
          font-size: 24px;
        }

        md-outlined-button {
        }

        md-icon {
        }

        .createdAt {
          margin-top: 16px;
          font-size: 14px;
        }

        yp-ajax {
        }

        .deleteIcon {
          position: absolute;
          right: 0px;
          bottom: 8px;
        }

        .withCursor {
          cursor: pointer;
        }

        @media (max-width: 960px) {
          .recommendedPosts {
            display: none !important;
          }
        }

        .topLevelActivitiesContainer[wide] {
        }

        [hidden] {
          display: none !important;
        }

        .spinnerContainer {
          margin-top: 32px;
        }

        .topSpinnerContainer {
          margin-top: 16px;
        }

        :focus {
          outline: none;
        }

        .notLoggedInButton {
          margin-top: 8px;
          width: 250px;
          margin-bottom: 8px;
          text-align: center;
        }

        .topLevelActivitiesContainer[rtl] {
          direction: rtl;
        }
      `,
        ];
    }
    renderItem(activity, index) {
        return html `
      <div class="layout vertical center-center" style="width: 100%;">
        <ac-activity
          tabindex="${index}"
          .hasLoggedInUser="${this.isLoggedIn}"
          class="activityContainer"
          .activity="${activity}"
          .postId="${this.postId}"
          .groupId="${this.groupId}"
          .communityId="${this.communityId}"
          .domainId="${this.domainId}"
        ></ac-activity>
      </div>
    `;
    }
    render() {
        return html `
      <div
        class="layout horizontal topLevelActivitiesContainer center-center"
        wide="${this.wide}"
        ?rtl="${this.rtl}"
      >
        <div class="layout vertical  center-center">
          ${this.loggedInUser
            ? html `
                <div
                  .loggedInUser="${this.isLoggedIn}"
                  ?hidden="${this.closeNewsfeedSubmissions || !this.activities}"
                  class="addNewsBox"
                >
                  <yp-point-news-story-edit
                    .label="${this.label}"
                    .notLoggedInLabel="${this.notLoggedInLabel}"
                    .addLabel="${this.addLabel}"
                    .domainId="${this.domainId}"
                    .communityId="${this.communityId}"
                    .groupId="${this.groupId}"
                    .postGroupId="${this.postGroupId}"
                    .postId="${this.postId}"
                    @refresh="${this.loadNewData}"
                  >
                  </yp-point-news-story-edit>
                </div>
              `
            : html `
                <div
                  class="layout horizontal center-center"
                  style="width: 100%;"
                >
                  <md-filled-button
                    class="layout horizontal notLoggedInButton"
                    @click="${this._openLogin}"
                  >
                    ${this.t("loginToShareALink")}</md-filled-button
                  >
                </div>
              `}
          ${this.activities
            ? html `
                <lit-virtualizer
                  id="list"
                  .items=${this.activities}
                  .scrollTarget="${window}"
                  .layout="${FlowLayout}"
                  id="activitiesList"
                  .renderItem=${this.renderItem.bind(this)}
                  @rangeChanged=${this.scrollEvent}
                ></lit-virtualizer>
              `
            : nothing}
        </div>

        <div
          class="layout vertical self-start recommendedPosts"
          ?notActive="${this.noRecommendedPosts}"
          small="${!this.wide}"
          ?hidden="${!this.recommendedPosts}"
        >
          <ac-activity-recommended-posts
            id="recommendedPosts"
            .recommendedPosts="${this.recommendedPosts}"
            class="layout vertical"
          ></ac-activity-recommended-posts>
        </div>
      </div>
    `;
    }
    scrollEvent(event) {
        //TODO: Check this logic
        if (this.activities &&
            this._moreToLoad &&
            event.last != -1 &&
            event.last < this.activities.length &&
            event.last + 5 >= this.activities.length) {
            this._moreToLoad = true;
            this._loadMoreData();
        }
    }
    connectedCallback() {
        super.connectedCallback();
        this.addListener("yp-point-deleted", this._pointDeleted);
        this.addListener("yp-refresh-activities-scroll-threshold", this._clearScrollThreshold);
        this.addListener("yp-delete-activity", this._deleteActivity);
        switch (this.collectionType) {
            case "domain":
                this.domainId = this.collectionId;
                break;
            case "community":
                this.communityId = this.collectionId;
                break;
            case "group":
                this.groupId = this.collectionId;
                break;
            case "post":
                this.postId = this.collectionId;
                break;
            case "user":
                this.userId = this.collectionId;
                break;
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeListener("yp-point-deleted", this._pointDeleted);
        this.removeListener("yp-refresh-activities-scroll-threshold", this._clearScrollThreshold);
        this.removeListener("yp-delete-activity", this._deleteActivity);
    }
    _openLogin() {
        this.fire("yp-open-login");
    }
    _pointDeleted(event) {
        if (this.activities) {
            for (let i = 0; i < this.activities.length; i++) {
                if (this.activities[i].Point) {
                    if (this.activities[i].Point.id == event.detail.pointId) {
                        this._removeActivityId(this.activities[i].id);
                    }
                }
            }
        }
    }
    get wideListOffset() {
        if (this.groupId) {
            return "800";
        }
        else {
            return "415";
        }
    }
    get ironListResizeScrollThreshold() {
        if (this.wide) {
            return 800;
        }
        else {
            return 300;
        }
    }
    //TODO: Look into if this is needed
    get ironListPaddingTop() {
        let offset = this.$$("#activitiesList").offsetTop;
        offset -= 75;
        if (!this.isLoggedIn && !this.groupId)
            offset -= 75;
        if (offset > 0) {
            console.info("News scroll offset: " + offset);
            return offset;
        }
        else {
            if (this.groupId) {
                if (this.wide) {
                    offset = this.isLoggedIn ? 700 : 580;
                }
                else {
                    offset = this.isLoggedIn ? 950 : 690;
                }
            }
            else {
                if (this.wide) {
                    offset = this.isLoggedIn ? 600 : 400;
                }
                else {
                    offset = this.isLoggedIn ? 700 : 610;
                }
            }
            console.info("News (manual) scroll offset: " + offset);
            return offset;
        }
    }
    _removeActivityId(activityId) {
        if (this.activities) {
            for (let i = 0; i < this.activities.length; i++) {
                if (this.activities[i].id == activityId) {
                    this.activities.splice(i, 1);
                }
            }
        }
        //TODO: See if this needed
        //this.$$("#activitiesList").fire("iron-resize");
    }
    _deleteActivity(event) {
        this.activityIdToDelete = event.detail.id;
        window.appDialogs.getDialogAsync("confirmationDialog", (dialog) => {
            dialog.open(this.t("activity.confirmDelete"), this._reallyDelete.bind(this));
        });
    }
    async _reallyDelete() {
        let type, collectionId;
        if (this.domainId) {
            type = "domains";
            collectionId = this.domainId;
        }
        else if (this.communityId) {
            type = "communities";
            collectionId = this.communityId;
        }
        else if (this.groupId) {
            type = "groups";
            collectionId = this.groupId;
        }
        else if (this.postId) {
            type = "posts";
            collectionId = this.postId;
        }
        else if (this.userId) {
            type = "users";
            collectionId = this.postId;
        }
        if (type && collectionId && this.activityIdToDelete) {
            await window.serverApi.deleteActivity(type, collectionId, this.activityIdToDelete);
            this._removeActivityId(this.activityIdToDelete);
            this.activityIdToDelete = undefined;
            this.requestUpdate();
        }
        else {
            console.error("No activity found to delete");
        }
    }
    _generateRequest(typeId, typeName) {
        if (typeId) {
            this.oldestProcessedActivityAt = undefined;
            this.noRecommendedPosts = true;
            this._moreToLoad = true;
            //TODO: Add a minimum threshold of filtering before enabling dynamic news_feeds again
            if (window.appUser && window.appUser.user && !this.postId) {
                this.mode = "activities";
                //this.mode = 'news_feeds';
            }
            else {
                this.mode = "activities";
            }
            this.url = "/api/" + this.mode + "/" + typeName + "/" + typeId;
            this._loadMoreData();
            if (typeName != "posts") {
                this._getRecommendations(typeName, typeId);
            }
        }
    }
    async _loadMoreData() {
        if (this.url && this._moreToLoad) {
            this._moreToLoad = false;
            let url = this.url;
            if (this.oldestProcessedActivityAt)
                url += "?beforeDate=" + this.oldestProcessedActivityAt;
            const response = (await window.serverApi.getAcActivities(url));
            this._processResponse(response);
        }
        else {
            console.warn("Trying to load more activities without conditions");
        }
    }
    async loadNewData() {
        if (this.url && this.latestProcessedActivityAt) {
            let url = this.url;
            if (this.oldestProcessedActivityAt)
                url = url + "?afterDate=" + this.latestProcessedActivityAt;
            this._processResponse((await window.serverApi.getAcActivities(url)), true);
        }
        else if (this.url && !this.latestProcessedActivityAt) {
            this._processResponse((await window.serverApi.getAcActivities(this.url)), true);
        }
    }
    _domainIdChanged() {
        if (this.domainId) {
            this.activities = undefined;
            this.recommendedPosts = undefined;
            this._generateRequest(this.domainId, "domains");
        }
    }
    _communityIdChanged() {
        if (this.communityId) {
            this.activities = undefined;
            this.recommendedPosts = undefined;
            this._generateRequest(this.communityId, "communities");
        }
    }
    _groupIdChanged() {
        if (this.groupId) {
            this.activities = undefined;
            this.recommendedPosts = undefined;
            this._generateRequest(this.groupId, "groups");
        }
    }
    _postIdChanged() {
        if (this.postId) {
            this.activities = undefined;
            this.recommendedPosts = undefined;
            this._generateRequest(this.postId, "posts");
        }
    }
    _userIdChanged() {
        if (this.userId) {
            this.activities = undefined;
            this.recommendedPosts = undefined;
            this._generateRequest(this.userId, "users");
        }
    }
    _clearScrollThreshold() {
        //TODO: Do we need this?
        //this.$$("#scrollTheshold").clearTriggers();
    }
    async _getRecommendations(typeName, typeId) {
        let allowRecommendations = true;
        if (this.activities && this.activities.length > 0) {
            if (this.activities[0].Group &&
                this.activities[0].Group.configuration &&
                this.activities[0].Group.configuration.hideRecommendationOnNewsFeed) {
                allowRecommendations = false;
            }
            if (this.activities[0].Community &&
                this.activities[0].Community.configuration &&
                this.activities[0].Community.configuration.hideRecommendationOnNewsFeed) {
                allowRecommendations = false;
            }
        }
        if (allowRecommendations) {
            this.recommendedPosts = await window.serverApi.getRecommendations(typeName, typeId);
            this.noRecommendedPosts = false;
        }
        else {
            this.noRecommendedPosts = true;
        }
    }
    _preProcessActivities(activities) {
        for (let i = 0; i < activities.length; i++) {
            if (activities[i].Point) {
                activities[i].Point.latestContent =
                    activities[i].Point.PointRevisions[activities[i].Point.PointRevisions.length - 1].content;
            }
        }
        return activities;
    }
    _processResponse(activitiesResponse, newData = false) {
        const activities = this._preProcessActivities(activitiesResponse.activities);
        this.gotInitialData = true;
        if (activitiesResponse.oldestProcessedActivityAt) {
            this.oldestProcessedActivityAt =
                activitiesResponse.oldestProcessedActivityAt;
        }
        else {
            console.warn("Have not set oldestProcessedActivityAt");
        }
        if (this.activities) {
            for (let i = 0; i < activities.length; i++) {
                if (newData || this.url.indexOf("afterDate") > -1) {
                    this.activities.unshift(activities[i]);
                }
                else {
                    this.activities.push(activities[i]);
                }
            }
        }
        else {
            this.activities = activities;
        }
        if (activities && activities.length > 0) {
            if (!this.latestProcessedActivityAt ||
                this.latestProcessedActivityAt < activities[0].created_at) {
                this.latestProcessedActivityAt = activities[0].created_at;
            }
            if (!this.latestProcessedActivityAt) {
                console.error("Have not set latest processed activity at");
            }
            this._moreToLoad = true;
            if ((this.activities.length < 15) ||
                (activities.length < 3 && this.activities.length < 100)) {
                this._loadMoreData();
            }
        }
        this.fireGlobal("yp-refresh-activities-scroll-threshold", {});
        setTimeout(() => {
            //TODO: Check out
            //this.$$("#activitiesList").fire('iron-resize');
        });
        this.closeNewsfeedSubmissions = false;
        if (this.activities && this.activities.length > 0) {
            if (this.activities[0].Group &&
                this.activities[0].Group.configuration &&
                this.activities[0].Group.configuration.closeNewsfeedSubmissions) {
                this.closeNewsfeedSubmissions = true;
            }
            else if (this.activities[0].Community &&
                this.activities[0].Community.configuration &&
                this.activities[0].Community.configuration.closeNewsfeedSubmissions) {
                this.closeNewsfeedSubmissions = true;
            }
        }
        console.error(`Acitivites length ${this.activities.length}`);
        this.requestUpdate();
    }
    scrollToItem(item) {
        console.log("Activity scrolling to item");
        if (item && this.activities) {
            for (let i = 0; i < this.activities.length; i++) {
                if (this.activities[i] == item) {
                    this.$$("#list").scrollToIndex(i);
                    break;
                }
            }
        }
        //      this.fireGlobal('yp-refresh-activities-scroll-threshold');
        //TODO: Get workgin
        //(this.$$('#activitiesList') as LitVirtualizer).scrollToItem(item);
    }
    fireResize() {
        console.log("fireResize");
        //TODO: Is this needed
        //this.$$("#activitiesList").fire('iron-resize');
    }
};
__decorate([
    property({ type: Boolean })
], AcActivities.prototype, "disableNewPosts", void 0);
__decorate([
    property({ type: Boolean })
], AcActivities.prototype, "noRecommendedPosts", void 0);
__decorate([
    property({ type: Boolean })
], AcActivities.prototype, "gotInitialData", void 0);
__decorate([
    property({ type: Array })
], AcActivities.prototype, "activities", void 0);
__decorate([
    property({ type: Number })
], AcActivities.prototype, "domainId", void 0);
__decorate([
    property({ type: String })
], AcActivities.prototype, "label", void 0);
__decorate([
    property({ type: String })
], AcActivities.prototype, "addLabel", void 0);
__decorate([
    property({ type: String })
], AcActivities.prototype, "notLoggedInLabel", void 0);
__decorate([
    property({ type: Number })
], AcActivities.prototype, "collectionId", void 0);
__decorate([
    property({ type: String })
], AcActivities.prototype, "collectionType", void 0);
__decorate([
    property({ type: Number })
], AcActivities.prototype, "communityId", void 0);
__decorate([
    property({ type: Number })
], AcActivities.prototype, "groupId", void 0);
__decorate([
    property({ type: Number })
], AcActivities.prototype, "postId", void 0);
__decorate([
    property({ type: Number })
], AcActivities.prototype, "postGroupId", void 0);
__decorate([
    property({ type: Number })
], AcActivities.prototype, "userId", void 0);
__decorate([
    property({ type: String })
], AcActivities.prototype, "mode", void 0);
__decorate([
    property({ type: String })
], AcActivities.prototype, "url", void 0);
__decorate([
    property({ type: String })
], AcActivities.prototype, "latestProcessedActivityAt", void 0);
__decorate([
    property({ type: String })
], AcActivities.prototype, "oldestProcessedActivityAt", void 0);
__decorate([
    property({ type: Number })
], AcActivities.prototype, "activityIdToDelete", void 0);
__decorate([
    property({ type: Array })
], AcActivities.prototype, "recommendedPosts", void 0);
__decorate([
    state()
], AcActivities.prototype, "closeNewsfeedSubmissions", void 0);
AcActivities = __decorate([
    customElement("ac-activities")
], AcActivities);
export { AcActivities };
//# sourceMappingURL=ac-activities.js.map