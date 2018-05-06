import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../@polymer/iron-list/iron-list.js';
import '../../../../@polymer/iron-scroll-threshold/iron-scroll-threshold.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/paper-material/paper-material.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { ypLoggedInUserBehavior } from '../yp-behaviors/yp-logged-in-user-behavior.js';
import { AccessHelpers } from '../yp-behaviors/access-helpers.js';
import { ypIronListBehavior } from '../yp-behaviors/yp-iron-list-behavior.js';
import '../yp-ajax/yp-ajax.js';
import '../yp-point/yp-point-news-story-edit.js';
import './ac-activity.js';
import './ac-activity-recommended-posts.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { dom } from '../../../../@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">

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

      paper-button {
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

      @-moz-document url-prefix() {
        .activityContainer {
          margin-bottom: 16px;
        }
      }

      @media (max-width: 960px) {
        .recommendedPosts {
          display: none !important;
        }
      }

      .topLevelActivitiesContainer[wide] {
        @apply --layout-center-center;
      }

      [hidden] {
        display: none !important;
      }

      .spinnerContainer {
        margin-top: 32px;
      }

      :focus {
        outline: none;
      }
    </style>
    <div class="layout horizontal topLevelActivitiesContainer" wide\$="[[wide]]">
      <div class="layout vertical self-start">
        <template is="dom-if" if="[[loggedInUser]]">
          <paper-material logged-in-user\$="[[hasLoggedInUser]]" elevation="1" class="layout horizontal addNewsBox">
            <yp-point-news-story-edit domain-id="[[domainId]]" community-id="[[communityId]]" group-id="[[groupId]]" post-group-id="[[postGroupId]]" post-id="[[postId]]" on-refresh="loadNewData">
            </yp-point-news-story-edit>
          </paper-material>
        </template>
        <iron-list id="ironList" scroll-offset\$="[[ironListPaddingTop]]" scroll-target="document" items="[[activities]]" as="activity">
          <template>
            <div tabindex\$="[[tabIndex]]" class="layout vertical center-center">
              <ac-activity has-logged-in-user\$="[[hasLoggedInUser]]" class="activityContainer" activity="[[activity]]" post-id="[[postId]]" group-id="[[groupId]]" community-id="[[communityId]]" domain-id="[[domainId]]" on-ak-delete-activity="_deleteActivity"></ac-activity>
            </div>
          </template>
        </iron-list>
        <div class="layout horizontal center-center spinnerContainer">
          <yp-ajax id="deleteActivityAjax" method="DELETE" large-spinner="" on-response="_activityDeletedResponse"></yp-ajax>
          <yp-ajax id="ajax" large-spinner="" on-response="_activitiesResponse"></yp-ajax>
        </div>
      </div>
      <div class="layout vertical self-start recommendedPosts" not-active\$="[[noRecommendedPosts]]" small\$="[[!wide]]" hidden\$="[[!recommendedPosts]]">
        <ac-activity-recommended-posts id="recommendedPosts" recommended-posts="[[recommendedPosts]]" class="layout vertical"></ac-activity-recommended-posts>
        <div class="layout horizontal center-center">
          <yp-ajax id="recommendationAjax" large-spinner="" on-response="_recommendedPostsResponse"></yp-ajax>
        </div>
      </div>
    </div>

    <iron-media-query query="(min-width: 600px)" query-matches="{{wide}}"></iron-media-query>

    <lite-signal on-lite-signal-logged-in="_userLoggedIn"></lite-signal>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>
    <lite-signal on-lite-signal-yp-refresh-activities-scroll-threshold="_clearScrollThreshold"></lite-signal>

    <iron-scroll-threshold id="scrollTheshold" lower-threshold="450" on-lower-threshold="_loadMoreData" scroll-target="document">
    </iron-scroll-threshold>
`,

  is: 'ac-activities',

  behaviors: [
    ypLanguageBehavior,
    ypLoggedInUserBehavior,
    AccessHelpers,
    ypIronListBehavior
  ],

  properties: {

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
      computed: '_ironListPaddingTop(wide)'
    },

    wideListOffset: {
      type: String,
      computed: '_wideListOffset(groupId)'
    },

    hasLoggedInUser: {
      type: Boolean,
      computed: '_hasLoggedInUser(loggedInUser)'
    }
  },

  listeners: {
    'yp-point-deleted': '_pointDeleted'
  },

  _pointDeleted: function (event, detail) {
    for (var i = 0; i < this.activities.length; i++) {
      if (this.activities[i].Point) {
        if (this.activities[i].Point.id==detail.pointId) {
          this._removeActivityId(this.activities[i].id);
        }
      }
    }
  },

  _hasLoggedInUser: function (user) {
    if (user) {
      return true;
    } else {
      return false;
    }
  },

  _wideListOffset: function (groupId) {
    if (groupId) {
      return "800";
    } else {
      return "415"
    }
  },

  _ironListResizeScrollThreshold: function (wide) {
    if (wide) {
      return 800;
    } else {
      return 300;
    }
  },

  _ironListPaddingTop: function (wide) {
    if (wide) {
      return 600;
    } else {
      return 500;
    }
  },

  _skipIronListWidth: function (wide) {
    if (wide) {
      var list = this.$$("#ironList");
      list.style.width = '600px';
      list.updateViewportBoundaries();
      this.async(function () {
        list.notifyResize();
      }, 50);
    }
    return wide;
  },

  _activityDeletedResponse: function (event, detail) {
    this._removeActivityId(detail.response.activityId);
  },

  _removeActivityId: function (activityId) {
    for (var i = 0; i < this.activities.length; i++) {
      if (this.activities[i].id == activityId) {
        this.splice('activities', i, 1);
      }
    }
    this.$$("#ironList").fire("iron-resize");
  },

  _deleteActivity: function (event, detail) {
    this.set('activityIdToDelete', detail.id);
    dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
      dialog.open(this.t('activity.confirmDelete'), this._reallyDelete.bind(this));
    }.bind(this));
  },

  _reallyDelete: function () {
    if (this.domainId) {
      this.$.deleteActivityAjax.url = "/api/domains/"+this.domainId+"/"+this.activityIdToDelete+"/delete_activity";
    } else if (this.communityId) {
      this.$.deleteActivityAjax.url = "/api/communities/"+this.communityId+"/"+this.activityIdToDelete+"/delete_activity";
    } else if (this.groupId) {
      this.$.deleteActivityAjax.url = "/api/groups/"+this.groupId+"/"+this.activityIdToDelete+"/delete_activity";
    } else if (this.postId) {
      this.$.deleteActivityAjax.url = "/api/posts/"+this.postId+"/"+this.activityIdToDelete+"/delete_activity";
    }
    this.$.deleteActivityAjax.body = {};
    this.$.deleteActivityAjax.generateRequest();
    this.set('activityIdToDelete', null);
  },

  _generateRequest: function (typeId, typeName) {
    if (typeId) {
      this.set('activities', []);
      this.set('oldestProcessedActivityAt', null);
      this.set('noRecommendedPosts', true);

      //TODO: Add a minimum threshold of filtering before enabling dynamic news_feeds again
      if (false && window.appUser && window.appUser.user && !this.postId) {
        this.mode = 'news_feeds';
      } else {
        this.mode = 'activities';
      }

      this.set('url', '/api/'+this.mode+'/' + typeName + '/' + typeId);
      this.$.ajax.url = this.url;
      this.$.ajax.generateRequest();
      if (typeName!='posts') {
        this.$.recommendationAjax.url = '/api/recommendations/' + typeName + '/' + typeId;
        this.$.recommendationAjax.generateRequest();
      }
    }
  },

  _loadMoreData: function () {
    this.async(function () {
      console.log("_loadMoreData");
      if (this.$$("#ironList").offsetWidth > 0 && this.$$("#ironList").offsetHeight > 0) {
        console.log("_loadMoreData 2 url: "+this.url+" moreToLoad: "+this.moreToLoad);
        if (this.url!='' && this.moreToLoad && this.oldestProcessedActivityAt) {
          console.log("_loadMoreData 3");
          this.set('moreToLoad', false);
          console.info("_loadMoreData for domainId: "+this.domainId+" communityId: "+this.communityId+" groupId: "+this.groupId+" postId: "+this.postId);
          this.$.ajax.url = this.url + '?beforeDate='+this.oldestProcessedActivityAt;
          this.$.ajax.generateRequest();
        }
      } else {
        console.warn("NOT VISIBLE for domainId: "+this.domainId+" communityId: "+this.communityId+" groupId: "+this.groupId+" postId: "+this.postId);
      }
    });
  },

  loadNewData: function () {
    if (this.url!='' && this.latestProcessedActivityAt) {
      this.$.ajax.url = this.url + '?afterDate='+this.latestProcessedActivityAt;
      this.$.ajax.generateRequest();
    } else if (!this.latestProcessedActivityAt) {
      this.$.ajax.url = this.url;
      this.$.ajax.generateRequest();
    }
  },

  _domainIdChanged: function (newValue) {
    this.set('activities', null);
    this.set('recommendedPosts', null);
    this._generateRequest(newValue, 'domains');
  },

  _communityIdChanged: function (newValue) {
    this.set('activities', null);
    this.set('recommendedPosts', null);
    this._generateRequest(newValue, 'communities');
  },

  _groupIdChanged: function (newValue) {
    this.set('activities', null);
    this.set('recommendedPosts', null);
    this._generateRequest(newValue, 'groups');
  },

  _postIdChanged: function (newValue) {
    this.set('activities', null);
    this.set('recommendedPosts', null);
    this._generateRequest(newValue, 'posts');
  },

  _clearScrollThreshold: function () {
    this.$$("#scrollTheshold").clearTriggers();
    console.info("Clearing scrolling triggers for activity");
  },

  _recommendedPostsResponse: function (event, detail) {
    if (detail.response && detail.response.length>0) {
      this.set('recommendedPosts', detail.response);
      this.set('noRecommendedPosts', false);
    } else {
      this.set('noRecommendedPosts', true);
    }
  },

  _preProcessActivities: function (activities) {
    for (var i = 0; i < activities.length; i++) {
      if (activities[i].Point) {
        activities[i].Point.latestContent = activities[i].Point.PointRevisions[activities[i].Point.PointRevisions.length-1].content;
      }
    }
    return activities;
  },

  _activitiesResponse: function (event, detail) {
    var activities = this._preProcessActivities(detail.response.activities);

    if (detail.response.oldestProcessedActivityAt) {
      this.set('oldestProcessedActivityAt', detail.response.oldestProcessedActivityAt);
    } else {
      console.warn("Have not set oldestProcessedActivityAt");
    }

    for (var i = 0; i < activities.length; i++) {
      if (this.$.ajax.url.indexOf('afterDate') > -1) {
        this.unshift('activities', activities[i]);
      } else {
        this.push('activities', activities[i]);
      }
    }

    console.info("Activities length: "+activities.length);
    if (activities.length>0) {
      if (!this.latestProcessedActivityAt || this.latestProcessedActivityAt < activities[0].created_at) {
        this.set('latestProcessedActivityAt', activities[0].created_at);
      }
      if (!this.latestProcessedActivityAt) {
        console.error("Have not set latest processed activity at");
      } else {
        console.log("latestProcessedActivityAt: "+ this.latestProcessedActivityAt)
      }
      this.set('moreToLoad', true);
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
      this.$.ironList.fire('iron-resize');
    });
  },

  fireResize: function () {
    console.log("fireResize");
    this.$.ironList.fire('iron-resize');
  }
});
