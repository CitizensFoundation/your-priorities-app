import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/paper-material/paper-material.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLoggedInUserBehavior } from '../yp-behaviors/yp-logged-in-user-behavior.js';
import { AccessHelpers } from '../yp-behaviors/access-helpers.js';
import './ac-activity-header.js';
import './ac-activity-post.js';
import './ac-activity-point.js';
import './ac-activity-point-news-story.js';
import './ac-activity-post-status-update.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">

      .activity {
        margin: 16px;
        background-color: #FFF;
        width: 550px;
        height: 100%;
        padding-left: 16px;
        padding-right: 16px;
        margin-bottom: 0;
      }

      @media (max-width: 600px) {
        .activity {
          width: 100%;
          height: 100%;

          margin: 0;
          padding-left: 16px;
          padding-right: 16px;
          margin-bottom: 8px;
          margin-top: 8px;
          width: -webkit-calc(100% - 8px);
          width:    -moz-calc(100% - 8px);
          width:         calc(100% - 8px);
        }

        .activity[logged-in-user] {
          margin-left: 0;
          width: -webkit-calc(100% - 16px);
          width:    -moz-calc(100% - 16px);
          width:         calc(100% - 16px);
        }
      }

      .aaaactivity[is-old-safari-or-ie] {
        height: 550px;
        overflow: auto;
      }

      .mainActivityContent {
        height: 100% !important;
      }

      ac-activity-header {
      }

      ac-activity-post {
        width :100%;
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

      [hidden] {
        display: none !important;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <paper-material is-old-safari-or-ie\$="[[isOldSafariOrIe]]" logged-in-user\$="[[hasLoggedInUser]]" elevation="[[_elevationForType(activity.type)]]" class="layout vertical activity" tabindex\$="[[tabIndex]]">
      <paper-icon-button title\$="[[t('deleteActivity')]]" hidden\$="[[!_hasActivityAccess(activity)]]" icon="delete" data-args\$="[[activity.id]]" class="deleteIcon" on-tap="_deleteActivity"></paper-icon-button>
      <div class="mainActivityContent">
        <div class="layout horizontal">
          <ac-activity-header class="layout horizontal headerUserImage" activity="[[activity]]"></ac-activity-header>
          <div class="flex"></div>
          <div hidden\$="[[!wide]]" class="createdAt" title="[[fromLongTime(activity.created_at)]]">
            [[fromTime(activity.created_at)]]
          </div>
        </div>

        <template is="dom-if" if="[[_isActivityType(activity,'activity.post.new')]]">
          <ac-activity-post activity="[[activity]]" post-id\$="[[postId]]" community-id="[[communityId]]" group-id="[[groupId]]"></ac-activity-post>
        </template>

        <template is="dom-if" if="[[_isActivityType(activity,'activity.point.new')]]">
          <ac-activity-point post-id\$="[[postId]]" activity="[[activity]]"></ac-activity-point>
        </template>

        <template is="dom-if" if="[[_isActivityType(activity,'activity.point.newsStory.new')]]">
          <ac-activity-point-news-story activity="[[activity]]" post-id="[[postId]]" community-id="[[communityId]]" group-id="[[groupId]]"></ac-activity-point-news-story>
        </template>

        <template is="dom-if" if="[[_isActivityType(activity,'activity.post.status.change')]]">
          <ac-activity-post-status-update activity="[[activity]]"></ac-activity-post-status-update>
        </template>
      </div>
    </paper-material>

    <iron-media-query query="(min-width: 600px)" query-matches="{{wide}}"></iron-media-query>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>
`,

  is: 'ac-activity',

  behaviors: [
    ypLanguageBehavior,
    ypLoggedInUserBehavior,
    AccessHelpers
  ],

  properties: {

    activity: {
      type: Object
    },

    domainId: {
      type: Number
    },

    communityId: {
      type: Number
    },

    groupId: {
      type: Number
    },

    postId: {
      type: Number
    },

    postGroupId: {
      type: Number
    },

    wide: {
      type: Boolean,
      value: false
    },

    isOldSafariOrIe: {
      type: Boolean,
      computed: '_isOldSafariOrIe(wide)'
    },

    hasLoggedInUser: {
      type: Boolean
    }
  },

  _hasLoggedInUser: function (user) {
    if (user) {
      return true;
    } else {
      return false;
    }
  },

  fromTime: function (timeValue) {
    return moment(timeValue).fromNow();
  },

  fromLongTime: function (timeValue) {
    return moment(timeValue).format();
  },

  _isOldSafariOrIe: function (wide) {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent) &&
      !(/10/i.test(navigator.userAgent)) &&
      !window.MSStream;
  },

  _elevationForType: function (type) {
    return 1;
  },

  _hasActivityAccess: function (activity) {
    if (this.domainId) {
      return this.checkDomainAccess(activity.Domain)
    } else if (this.communityId) {
      return this.checkCommunityAccess(activity.Community)
    } else if (this.groupId) {
      return this.checkGroupAccess(activity.Group)
    } else if (this.postId) {
      return this.checkPostAccess(activity.Post)
    } else {
      return false;
    }
  },

  _deleteActivity: function (event) {
    this.fire("ak-delete-activity", { id: this.activity.id });
  },

  _isNotActivityType: function (activity, type) {
    return activity.type!=type
  },

  _isActivityType: function (activity, type) {
    return activity.type==type
  }
});
