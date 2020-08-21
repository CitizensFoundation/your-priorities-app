import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-list/iron-list.js';
import '@polymer/iron-scroll-threshold/iron-scroll-threshold.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-material/paper-material.js';
import { ypLoggedInUserBehavior } from '../yp-behaviors/yp-logged-in-user-behavior.js';
import { AccessHelpers } from '../yp-behaviors/access-helpers.js';
import { ypIronListBehavior } from '../yp-behaviors/yp-iron-list-behavior.js';
import '../yp-ajax/yp-ajax.js';
import '../yp-point/yp-point-news-story-edit.js';
import './ac-activity.js';
import './ac-activity-recommended-posts.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';

class AcActivitiesLit extends YpBaseElement {
  static get properties() {
    return {
      disableNewPosts: {
        type: Boolean,
        value: false
      },

      activities: {
        type: Array,
        notify: true
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

      postGroupId: {
        type: Number
      },

      // 'activities' and 'news_feed'
      mode: {
        type: String,
        value: "activities"
      },

      url: {
        type: String
      },

      oldestProcessedActivityAt: {
        type: Date
      },

      latestProcessedActivityAt: {
        type: Date
      },

      activityIdToDelete: {
        type: Number
      },

      wide: {
        type: Boolean,
        value: false
      },

      selectedTab: {
        type: String
      },

      recommendedPosts: {
        type: Array,
        value: null
      },

      noRecommendedPosts: {
        type: Boolean,
        value: true
      },

      skipIronListWidth: {
        type: Boolean,
        computed: '_skipIronListWidth(wide)'
      },

      ironListResizeScrollThreshold: {
        type: Number,
        computed: '_ironListResizeScrollThreshold(wide)'
      },

      ironListPaddingTop: {
        type: Number,
        computed: '_ironListPaddingTop(wide, groupId, hasLoggedInUser, selectedTab)'
      },

      wideListOffset: {
        type: String,
        computed: '_wideListOffset(groupId)'
      },

      hasLoggedInUser: {
        type: Boolean,
        computed: '_hasLoggedInUser(loggedInUser)'
      },

      gotInitialData: {
        type: Boolean,
        value: false
      }
    }
  }

  static get styles() {
    return [
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
      `, YpflexLayout]
  }

  render() {
    return html`
    <div class="layout horizontal topLevelActivitiesContainer layout-center-center" wide="${this.wide}" rtl?="${this.rtl}">
      <div class="layout vertical self-start">

        ${ this.loggedInUser ?  html`
          <paper-material .loggedInUser="${this.hasLoggedInUser}" elevation="1" class="layout horizontal addNewsBox">
            <yp-point-news-story-edit .domainId="${this.domainId}" .communityId="${this.communityId}" groupId="${this.groupId}" .postGroupId="${this.postGroupId}" .postId="${this.postId}" @refresh="${this.loadNewData}">
            </yp-point-news-story-edit>
          </paper-material>
        ` : html`
          <div class="layout vertical center-center">
            <mwc-button raised class="layout horizontal notLoggedInButton" .label="${this.t('loginToShareALink')}" @click="${this._openLogin}">
            </mwc-button>
          </div>
        `}

        <div class="layout horizontal center-center topSpinnerContainer" ?hidden="${this.gotInitialData}">
          <yp-ajax id="ajax" large-spinner @response="${this._activitiesResponse}"></yp-ajax>
        </div>

        <iron-list id="ironList" .scrollOffset="${this.ironListPaddingTop}" .scrollTarget="document" .items="${this.activities}" as="activity">
          <template>
            <div tabindex ="${this.tabIndex}" class="layout vertical center-center">
              <ac-activity .hasLoggedInUser="${this.hasLoggedInUser}" class="activityContainer" .activity="${this.activity}" .postId="${this.postId}" groupId="${this.groupId}" .communityId="${this.communityId}" domainId="${this.domainId}" @ak-delete-activity="${this._deleteActivity}"></ac-activity>
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

    <iron-media-query query="(min-width: 600px)" query-matches="${this.wide}"></iron-media-query>

    <lite-signal @lite-signal-logged-in="${this._userLoggedIn}"></lite-signal>
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
    
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeListener('yp-point-deleted', this._pointDeleted);
  

  _openLogin() {
    this.fire('yp-open-login');
  }

  _pointDeleted(event, detail) {
    for (let i = 0; i < this.activities.length; i++) {
      if (this.activities[i].Point) {
        if (this.activities[i].Point.id==detail.pointId) {
          this._removeActivityId(this.activities[i].id);
        }
      }
    }
  }

  _hasLoggedInUser(user) {
    if (user) {
      return true;
    } else {
      return false;
    }
  }

  _wideListOffset(groupId) {
    if (groupId) {
      return "800";
    } else {
      return "415"
    }
  }

  _ironListResizeScrollThreshold(wide) {
    if (wide) {
      return 800;
    } else {
      return 300;
    }
  }

  _ironListPaddingTop(wide, groupId, hasLoggedInUser, selectedTab) {
    let offset = this.$$("#ironList").offsetTop;
    offset -= 75;

    if (!hasLoggedInUser && !groupId)
      offset -= 75;

    if (offset>0) {
      console.info("News scroll offset: "+offset);
      return offset;
    } else {
      if (groupId) {
        if (wide) {
          offset = hasLoggedInUser? 700 : 580;
        } else {
          offset = hasLoggedInUser? 950 :  690;
        }
      } else {
        if (wide) {
          offset = hasLoggedInUser? 600 : 400;
        } else {
          offset = hasLoggedInUser? 700 : 610;
        }
      }
      console.info("News (manual) scroll offset: "+offset);
      return offset;
    }
  }

  _skipIronListWidth(wide) {
    if (wide) {
      const list = this.$$("#ironList");
      list.style.width = '600px';
      list.updateViewportBoundaries();
      this.async(function () {
        list.notifyResize();
      }, 50);
    }
    return wide;
  }

  _activityDeletedResponse(event, detail) {
    this._removeActivityId(detail.response.activityId);
  }

  _removeActivityId(activityId) {
    for (let i = 0; i < this.activities.length; i++) {
      if (this.activities[i].id == activityId) {
        this.splice('activities', i, 1);
      }
    }
    this.$$("#ironList").fire("iron-resize");
  }

  _deleteActivity(event, detail) {
    this.activityIdToDelete = detail.id;
    dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
      dialog.open(this.t('activity.confirmDelete'), this._reallyDelete.bind(this));
    }.bind(this));
  }

  _reallyDelete() {
    if (this.domainId) {
      this.$$("#deleteActivityAjax").url = "/api/domains/"+this.domainId+"/"+this.activityIdToDelete+"/delete_activity";
    } else if (this.communityId) {
      this.$$("#deleteActivityAjax").url = "/api/communities/"+this.communityId+"/"+this.activityIdToDelete+"/delete_activity";
    } else if (this.groupId) {
      this.$$("#deleteActivityAjax").url = "/api/groups/"+this.groupId+"/"+this.activityIdToDelete+"/delete_activity";
    } else if (this.postId) {
      this.$$("#deleteActivityAjax").url = "/api/posts/"+this.postId+"/"+this.activityIdToDelete+"/delete_activity";
    }
    this.$$("#deleteActivityAjax").body = {};
    this.$$("#deleteActivityAjax").generateRequest();
    this.activityIdToDelete = null;
  }

  _generateRequest(typeId, typeName) {
    if (typeId) {
      this.activities = [];
      this.oldestProcessedActivityAt = null;
      this.noRecommendedPosts = true;

      //TODO: Add a minimum threshold of filtering before enabling dynamic news_feeds again
      if (false && window.appUser && window.appUser.user && !this.postId) {
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
    this.async(function () {
      console.log("_loadMoreData for scroll");
      if (this.$$("#ironList").offsetWidth > 0 && this.$$("#ironList").offsetHeight > 0) {
        console.log("_loadMoreData for scroll 2 url: "+this.url+" moreToLoad: "+this.moreToLoad);
        if (this.url!='' && this.moreToLoad && this.oldestProcessedActivityAt) {
          console.log("_loadMoreData for scroll 3");
          this.moreToLoad = false;
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

  _domainIdChanged(newValue) {
    this.activities = null;
    this.recommendedPosts = null;
    this._generateRequest(newValue, 'domains');
  }

  _communityIdChanged(newValue) {
    this.activities = null;
    this.recommendedPosts = null;
    this._generateRequest(newValue, 'communities');
  }

  _groupIdChanged(newValue) {
    this.activities = null;
    this.recommendedPosts = null;
    this._generateRequest(newValue, 'groups');
  }

  _postIdChanged(newValue) {
    this.activities = null;
    this.recommendedPosts = null;
    this._generateRequest(newValue, 'posts');
  }

  _clearScrollThreshold() {
    this.$$("#scrollTheshold").clearTriggers();
    console.info("Clearing scrolling triggers for activity");
  }

  _recommendedPostsResponse(event, detail) {
    var allowRecommendations = true;
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
    if (allowRecommendations && detail.response && detail.response.length>0) {
      this.recommendedPosts = detail.response;
      this.noRecommendedPosts = false;
    } else {
      this.noRecommendedPosts = true;
    }
  }

  _preProcessActivities(activities) {
    for (let i = 0; i < activities.length; i++) {
      if (activities[i].Point) {
        activities[i].Point.latestContent = activities[i].Point.PointRevisions[activities[i].Point.PointRevisions.length-1].content;
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
      if (this.$$("#ajax").url.indexOf('afterDate') > -1) {
        this.unshift('activities', activities[i]);
      } else {
        this.push('activities', activities[i]);
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
      this.moreToLoad = true;
      if (this.activities.length<15 || (activities.length<3 && this.activities.length<100)) {
        this._loadMoreData();
      }
    }

    document.dispatchEvent(
      new CustomEvent("lite-signal", {
        bubbles: true,
        compose: true,
        detail: { name: 'yp-refresh-activities-scroll-threshold', data: {} }
      })
    );

    this.async(function () {
      this.$$("#ironList").fire('iron-resize');
    });
  }

  scrollToItem(item) {
    console.log("Activity scrolling to item");
    this.$$("#ironList").scrollToItem(item);
    this.async(function () {
      this._clearScrollThreshold();
    });
  }

  fireResize() {
    console.log("fireResize");
    this.$$("#ironList").fire('iron-resize');
  }
}

window.customElements.define('ac-activities-lit', AcActivitiesLit)
