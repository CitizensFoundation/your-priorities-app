import { property, html, css, customElement } from 'lit-element';
import { nothing, TemplateResult } from 'lit-html';
import { YpBaseElement } from '../@yrpri/yp-base-element.js';
import linkifyStr from 'linkifyjs/string.js';

import '@material/mwc-circular-progress-four-color';
import '@material/mwc-dialog';
import '@material/mwc-button';
import '@material/mwc-icon-button';
import '@material/mwc-snackbar';

import '@material/mwc-checkbox';
import '@material/mwc-radio';

import '@material/mwc-formfield';
import { Radio } from '@material/mwc-radio';

import { Checkbox } from '@material/mwc-checkbox';

import { TextField } from '@material/mwc-textfield';
import { YpBaseElementWithLogin } from '../@yrpri/yp-base-element-with-login.js';
import { LitVirtualizer } from 'lit-virtualizer';
import { ShadowStyles } from '../@yrpri/ShadowStyles.js';

@customElement('ac-activities')
export class AcActivities extends YpBaseElementWithLogin {
  @property({ type: Boolean })
  disableNewPosts = false

  @property({ type: Boolean })
  noRecommendedPosts = true

  @property({ type: Boolean })
  gotInitialData = false

  @property({ type: Array })
  activities: Array<AcActivityData> | undefined

  @property({ type: Number })
  domainId: number | undefined

  @property({ type: Number })
  communityId: number | undefined

  @property({ type: Number })
  groupId: number | undefined

  @property({ type: Number })
  postId: number | undefined

  @property({ type: Number })
  postGroupId: number | undefined

  @property({ type: Number })
  userId: number | undefined

  @property({ type: String })
  mode: 'activities' | 'news_feeds' = 'activities'

  @property({ type: String })
  url: string | undefined

  @property({ type: Object })
  latestProcessedActivityAt: Date | undefined

  @property({ type: Object })
  oldestProcessedActivityAt: Date | undefined

  @property({ type: Number })
  activityIdToDelete: number | undefined

  @property({ type: Array })
  recommendedPosts: Array<YpPostData> | undefined

  _moreToLoad = false

  static get prsoperties() {
    return {

      ironListPaddingTop: {
        type: Number,
        computed: '_ironListPaddingTop(wide, groupId, hasLoggedInUser, selectedTab)'
      },

      domainId: {
        type: Number,
        observer: "_domainIdChanged"
      },

      communityId: {
        type: Number,
        observer: "_communityIdChanged"
      },

      groupId: {
        type: Number,
        observer: "_groupIdChanged"
      },

      postId: {
        type: Number,
        observer: "_postIdChanged"
      },

    }
  }

  static get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
        :host {
          height: 100%;
        }

        iron-list {
          height: 100vh;
        }

        .addNewsBox {
          background-color: #FFF;
          width: 550px;
          height: 100%;
          padding-left: 16px;
          padding-right: 16px;
          margin-top: 16px;
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
            width: -webkit-calc(100% - 16px);
            width:    -moz-calc(100% - 16px);
            width:         calc(100% - 16px);
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
            width: -webkit-calc(100% - 36px);
            width:    -moz-calc(100% - 36px);
            width:         calc(100% - 36px);
          }
        }

        .activityContainer {
          width: 550px;
          margin: 0;
          padding: 0;
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

        mwc-button {
          color: var(--accent-color);
        }

        iron-icon {
          width: 48px;
          height: 48px;
          padding-top: 14px;
        }


        .createdAt {
          color: #777;
          margin-top: 16px;
          font-size: 14px;
        }

        yp-ajax {
          background-color: var(--primary-background-color);
        }

        .deleteIcon {
          position: absolute;
          right: 8px;
          bottom: 8px;
          color: #ddd;
        }

        .withCursor {
          cursor: pointer;
        }

        .activityContainer {
          width: 100%;
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
          background-color: #FFF;
          margin-bottom: 8px;
          text-align: center;
        }

        .topLevelActivitiesContainer[rtl] {
          direction: rtl;
        }
      `
      ]
  }

  render() {
    return html`
    <div class="layout horizontal topLevelActivitiesContainer layout-center-center" wide="${this.wide}" rtl?="${this.rtl}">
      <div class="layout vertical self-start">

        ${ this.loggedInUser ?  html`
          <div .loggedInUser="${this.isLoggedIn}" elevation="1" class="layout horizontal addNewsBox shadow-elevation-2dp shadow-transition">
            <yp-point-news-story-edit .domainId="${this.domainId}" .communityId="${this.communityId}" .groupId="${this.groupId}" .postGroupId="${this.postGroupId}" .postId="${this.postId}" @refresh="${this.loadNewData}">
            </yp-point-news-story-edit>
          </div>
        ` : html`
          <div class="layout vertical center-center">
            <mwc-button raised class="layout horizontal notLoggedInButton" .label="${this.t('loginToShareALink')}" @click="${this._openLogin}">
            </mwc-button>
          </div>
        `}

        <div class="layout horizontal center-center topSpinnerContainer" ?hidden="${this.gotInitialData}">
          <yp-ajax id="ajax" large-spinner @response="${this._activitiesResponse}"></yp-ajax>
        </div>

        <iron-list id="activitiesList" .scrollOffset="${this.ironListPaddingTop}" .scrollTarget="document" .items="${this.activities}" as="activity">
          <template>
            <div tabindex ="${this.tabIndex}" class="layout vertical center-center">
              <ac-activity .hasLoggedInUser="${this.isLoggedIn}" class="activityContainer" .activity="${this.activity}" .postId="${this.postId}" groupId="${this.groupId}" .communityId="${this.communityId}" domainId="${this.domainId}" @ak-delete-activity="${this._deleteActivity}"></ac-activity>
            </div>
          </template>
        </iron-list>

        <div class="layout horizontal center-center spinnerContainer">
          <yp-ajax id="deleteActivityAjax" .method="DELETE" large-spinner @response="${this._activityDeletedResponse}"></yp-ajax>
        </div>
      </div>

      <div class="layout vertical self-start recommendedPosts" ?notActive="${this.noRecommendedPosts}" small="${!this.wide}" ?hidden="${!this.recommendedPosts}">
        <ac-activity-recommended-posts id="recommendedPosts" .recommendedPosts="${this.recommendedPosts}" class="layout vertical"></ac-activity-recommended-posts>
        <div class="layout horizontal center-center">
          <yp-ajax id="recommendationAjax" large-spinner @response="${this._recommendedPostsResponse}"></yp-ajax>
        </div>
      </div>
    </div>

    <lite-signal @lite-signal-yp-refresh-activities-scroll-threshold="${this._clearScrollThreshold}"></lite-signal>

    <iron-scroll-threshold id="scrollTheshold" .lowerThreshold="450" @lower-threshold="${this._loadMoreData}" .scrollTarget="document">
    </iron-scroll-threshold>
    `
  }

/*
  behaviors: [
    ypLoggedInUserBehavior,
    AccessHelpers,
    ypIronListBehavior
  ],
*/

  connectedCallback() {
    super.connectedCallback();
    this.addListener('yp-point-deleted', this._pointDeleted);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeListener('yp-point-deleted', this._pointDeleted);
  }

  _openLogin() {
    this.fire('yp-open-login');
  }

  _pointDeleted(event: CustomEvent) {
    if (this.activities) {
      for (let i = 0; i < this.activities.length; i++) {
        if (this.activities[i].Point) {
          if (this.activities[i].Point!.id==event.detail.pointId) {
            this._removeActivityId(this.activities[i].id);
          }
        }
      }
    }
  }

  get wideListOffset() {
    if (this.groupId) {
      return "800";
    } else {
      return "415"
    }
  }

  get ironListResizeScrollThreshold() {
    if (this.wide) {
      return 800;
    } else {
      return 300;
    }
  }

  //TODO: Look into if this is needed
  get ironListPaddingTop() {
    let offset = (this.$$("#activitiesList") as HTMLElement).offsetTop;
    offset -= 75;

    if (!this.isLoggedIn && !this.groupId)
      offset -= 75;

    if (offset>0) {
      console.info("News scroll offset: "+offset);
      return offset;
    } else {
      if (this.groupId) {
        if (this.wide) {
          offset = this.isLoggedIn ? 700 : 580;
        } else {
          offset = this.isLoggedIn ? 950 :  690;
        }
      } else {
        if (this.wide) {
          offset = this.isLoggedIn ? 600 : 400;
        } else {
          offset = this.isLoggedIn ? 700 : 610;
        }
      }
      console.info("News (manual) scroll offset: "+offset);
      return offset;
    }
  }

  //TODO: See what this is and if its needed
  /*get skipIronListWidth() {
    if (this.wide) {
      const list = this.$$("#activitiesList");
      list.style.width = '600px';
      list.updateViewportBoundaries();
      setTimeout( () => {
        list.notifyResize();
      }, 50);
    }
    return this.wide;
  }*/

  _activityDeletedResponse(event: CustomEvent) {
    this._removeActivityId(event.detail.response.activityId);
  }

  _removeActivityId(activityId: number) {
    if (this.activities) {
      for (let i = 0; i < this.activities.length; i++) {
        if (this.activities[i].id == activityId) {
          this.splice('activities', i, 1);
        }
      }
    }
    //TODO: See if this needed
    //this.$$("#activitiesList").fire("iron-resize");
  }

  _deleteActivity(event: CustomEvent) {
    this.activityIdToDelete = event.detail.id;
    //TODO: Make work
    /*window.appDialogs.getDialogAsync("confirmationDialog", (dialog) => {
      dialog.open(this.t('activity.confirmDelete'), this._reallyDelete.bind(this));
    });*/
  }

  async _reallyDelete() {
    let type, collectionId
    if (this.domainId) {
      type = "domains"
      collectionId = this.domainId
    } else if (this.communityId) {
      type = "communities"
      collectionId = this.communityId
    } else if (this.groupId) {
      type = "groups"
      collectionId = this.groupId
    } else if (this.postId) {
      type = "posts"
      collectionId = this.postId
    } else if (this.userId) {
      type = "users"
      collectionId = this.postId
    }

    if (type && collectionId && this.activityIdToDelete) {
      await window.serverApi.deleteActivity(type, collectionId, this.activityIdToDelete)
      this.activityIdToDelete = undefined
    } else {
      console.error("No activity found to delete")
    }
  }

  _generateRequest(typeId: number, typeName: string) {
    if (typeId) {
      this.activities = [];
      this.oldestProcessedActivityAt = undefined;
      this.noRecommendedPosts = true;

      //TODO: Add a minimum threshold of filtering before enabling dynamic news_feeds again
      if (window.appUser && window.appUser.user && !this.postId) {
        this.mode = 'news_feeds';
      } else {
        this.mode = 'activities';
      }

      this.url = '/api/'+this.mode+'/' + typeName + '/' + typeId;
      this.$$("#ajax").url = this.url;
      this.$$("#ajax").generateRequest();
      if (typeName!='posts') {
        this.$$("#recommendationAjax").url = '/api/recommendations/' + typeName + '/' + typeId;
        this.$$("#recommendationAjax").generateRequest();
      }
    }
  }

  _loadMoreData() {
    setTimeout(()  => {
      console.log("_loadMoreData for scroll");
      if (this.$$("#activitiesList").offsetWidth > 0 && this.$$("#activitiesList").offsetHeight > 0) {
        console.log("_loadMoreData for scroll 2 url: "+this.url+" moreToLoad: "+this._moreToLoad);
        if (this.url!='' && this._moreToLoad && this.oldestProcessedActivityAt) {
          console.log("_loadMoreData for scroll 3");
          this._moreToLoad = false;
          console.info("_loadMoreData for scroll for domainId: "+this.domainId+" communityId: "+this.communityId+" groupId: "+this.groupId+" postId: "+this.postId);
          this.$$("#ajax").url = this.url + '?beforeDate='+this.oldestProcessedActivityAt;
          this.$$("#ajax").generateRequest();
        }
      } else {
        console.warn("NOT VISIBLE for domainId: "+this.domainId+" communityId: "+this.communityId+" groupId: "+this.groupId+" postId: "+this.postId);
      }
    });
  }

  loadNewData() {
    if (this.url!='' && this.latestProcessedActivityAt) {
      this.$$("#ajax").url = this.url + '?afterDate='+this.latestProcessedActivityAt;
      this.$$("#ajax").generateRequest();
    } else if (!this.latestProcessedActivityAt) {
      this.$$("#ajax").url = this.url;
      this.$$("#ajax").generateRequest();
    }
  }

  _domainIdChanged() {
    if (this.domainId) {
      this.activities = undefined
      this.recommendedPosts = undefined
      this._generateRequest(this.domainId, 'domains')
    }
  }

  _communityIdChanged() {
    if (this.communityId) {
      this.activities = undefined
      this.recommendedPosts = undefined
      this._generateRequest(this.communityId, 'communities');
    }
  }

  _groupIdChanged() {
    if (this.groupId) {
      this.activities = undefined
      this.recommendedPosts = undefined
      this._generateRequest(this.groupId, 'groups');
    }
  }

  _postIdChanged() {
    if (this.postId) {
      this.activities = undefined
      this.recommendedPosts = undefined
      this._generateRequest(this.postId, 'posts');
    }
  }

  _userIdChanged() {
    if (this.userId) {
      this.activities = undefined
      this.recommendedPosts = undefined
      this._generateRequest(this.userId, 'users');
    }
  }

  _clearScrollThreshold() {
    //this.$$("#scrollTheshold").clearTriggers();
    console.info("Clearing scrolling triggers for activity");
  }

  _recommendedPostsResponse(event: CustomEvent) {
    let allowRecommendations = true;
    if (this.activities && this.activities.length>0) {
      if( this.activities[0].Group &&
        this.activities[0].Group.configuration &&
        this.activities[0].Group.configuration.hideRecommendationOnNewsFeed) {
        allowRecommendations = false;
      }
      if( this.activities[0].Community &&
        this.activities[0].Community.configuration &&
        this.activities[0].Community.configuration.hideRecommendationOnNewsFeed) {
        allowRecommendations = false;
      }
    }
    if (allowRecommendations && event.detail.response && event.detail.response.length>0) {
      this.recommendedPosts = event.detail.response;
      this.noRecommendedPosts = false;
    } else {
      this.noRecommendedPosts = true;
    }
  }

  _preProcessActivities(activities: Array<AcActivityData>) {
    for (let i = 0; i < activities.length; i++) {
      if (activities[i].Point) {
        activities[i].Point!.latestContent = activities[i].Point!.PointRevisions![activities[i].Point!.PointRevisions!.length-1].content;
      }
    }
    return activities;
  }

  _activitiesResponse(event, detail) {
    const activities = this._preProcessActivities(detail.response.activities);

    this.gotInitialData =true;

    if (detail.response.oldestProcessedActivityAt) {
      this.oldestProcessedActivityAt = detail.response.oldestProcessedActivityAt;
    } else {
      console.warn("Have not set oldestProcessedActivityAt");
    }

    for (let i = 0; i < activities.length; i++) {
      if (this.url!.indexOf('afterDate') > -1) {
        this.activities?.unshift(activities[i]);
      } else {
        this.activities?.push(activities[i]);
      }
    }

    console.info("Activities length: "+activities.length);
    if (activities.length>0) {
      if (!this.latestProcessedActivityAt || this.latestProcessedActivityAt < activities[0].created_at) {
        this.latestProcessedActivityAt = activities[0].created_at;
      }
      if (!this.latestProcessedActivityAt) {
        console.error("Have not set latest processed activity at");
      } else {
        console.log("latestProcessedActivityAt: "+ this.latestProcessedActivityAt)
      }
      this._moreToLoad = true;
      if (this.activities.length<15 || (activities.length<3 && this.activities.length<100)) {
        this._loadMoreData();
      }
    }

    this.fireGlobal('yp-refresh-activities-scroll-threshold', {});

    setTimeout( () => {
      //TODO: Check out
      //this.$$("#activitiesList").fire('iron-resize');
    });
  }

  scrollToItem(item: AcActivityData) {
    console.log("Activity scrolling to item");
    (this.$$("#activitiesList") as LitVirtualizer).scrollToItem(item);
    setTimeout(() => {
      this._clearScrollThreshold();
    });
  }

  fireResize() {
    console.log("fireResize");
    //TODO: Is this needed
    //this.$$("#activitiesList").fire('iron-resize');
  }
}
