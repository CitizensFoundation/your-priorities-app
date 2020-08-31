import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-material/paper-material.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLoggedInUserBehavior } from '../yp-behaviors/yp-logged-in-user-behavior.js';
import { AccessHelpers } from '../yp-behaviors/access-helpers.js';
import './ac-activity-header.js';
import './ac-activity-post.js';
import './ac-activity-point.js';
import './ac-activity-point-news-story.js';
import './ac-activity-post-status-update.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { format, formatDistance } from 'date-fns';
import { YpBaseElement } from '../yp-base-element.js';

class AcActivityLit extends YpBaseElement {
  static get properties() {
    return {
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
    };
  }

  static get styles() {
    return [
      css`

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

      [hidden] {
        display: none !important;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
    <paper-material is-old-safari-or-ie="${this.isOldSafariOrIe}" .loggedInUser="${this.hasLoggedInUser}" .elevation="${this._elevationForType(activity.type)}" class="layout vertical activity" tabindex="${this.tabIndex}">
      <paper-icon-button .title="${this.t('deleteActivity')}" ?hidden="${!this._hasActivityAccess(activity)}" .icon="delete" data-args="${this.activity.id}" class="deleteIcon" @tap="${this._deleteActivity}"></paper-icon-button>
      <div class="mainActivityContent">
        <div class="layout horizontal">
          <ac-activity-header class="layout horizontal headerUserImage" .activity="${this.activity}"></ac-activity-header>
          <div class="flex"></div>
          <div ?hidden="${!this.wide}" class="createdAt" .title="${this.fromLongTime(activity.created_at)}">
            ${this.fromTime(activity.created_at)}
          </div>
        </div>

        ${this._isActivityType(activity,'activity.post.new') ? html`
          <ac-activity-post .activity="${this.activity}" .postId="${this.postId}" .communityId="${this.communityId}" .groupId="${this.groupId}"></ac-activity-post>
        `  : html``}

        ${this._isActivityType(activity,'activity.point.new') ? html`
          <ac-activity-point .postId="${this.postId}" .activity="${this.activity}"></ac-activity-point>
        ` : html``}

        ${this._isActivityType(activity,'activity.point.newsStory.new') ? html`
          <ac-activity-point-news-story .activity="${this.activity}" .postId="${this.postId}" .communityId="${this.communityId}" .groupId="${this.groupId}"></ac-activity-point-news-story>
        ` : html``}

        ${this._isActivityType(activity,'activity.post.status.change') ? html`
          <ac-activity-post-status-update .activity="${this.activity}"></ac-activity-post-status-update>
        ` : html``}
      </div>
    </paper-material>

    <iron-media-query query="(min-width: 600px)" query-matches="${this.wide}"></iron-media-query>
    <lite-signal @lite-signal-yp-language="${this._languageEvent}"></lite-signal>
`
  }

/*
  behaviors: [
    ypLoggedInUserBehavior,
    AccessHelpers
  ],
*/


  _hasLoggedInUser(user) {
    if (user) {
      return true;
    } else {
      return false;
    }
  }

  fromTime(timeValue) {
    return formatDistance(timeValue, new Date(),  {
      locale: this.language
    });
  }

  fromLongTime(timeValue) {
    return format(timeValue,"",{
      locale: this.language
    });
  }

  _isOldSafariOrIe(wide) {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent) &&
      !(/10/i.test(navigator.userAgent)) &&
      !window.MSStream;
  }

  _elevationForType(type) {
    return 1;
  }

  _hasActivityAccess(activity) {
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
  }

  _deleteActivity(event) {
    this.fire("ak-delete-activity", { id: this.activity.id });
  }

  _isNotActivityType(activity, type) {
    return activity.type!=type
  }

  _isActivityType(activity, type) {
    return activity.type==type
  }
}

window.customElements.define('ac-activity-lit', AcActivityLit)
