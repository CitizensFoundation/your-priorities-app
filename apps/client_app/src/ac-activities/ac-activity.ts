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
import { YpAccessHelpers } from '../@yrpri/YpAccessHelpers.js';

@customElement('ac-activity')
export class AcActivity extends YpBaseElementWithLogin {
  @property({ type: Object })
  activity: AcActivityData | undefined;

  @property({ type: Number })
  domainId: number | undefined;

  @property({ type: Number })
  communityId: number | undefined;

  @property({ type: Number })
  groupId: number | undefined;

  @property({ type: Number })
  postId: number | undefined;

  @property({ type: Number })
  postGroupId: number | undefined;

  @property({ type: Number })
  userId: number | undefined;

  static get styles() {
    return [
      super.styles,
      css`
        .activity {
          margin: 16px;
          background-color: #fff;
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
            width: -moz-calc(100% - 8px);
            width: calc(100% - 8px);
          }

          .activity[logged-in-user] {
            margin-left: 0;
            width: -webkit-calc(100% - 16px);
            width: -moz-calc(100% - 16px);
            width: calc(100% - 16px);
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
          width: 100%;
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
      `
    ];
  }

  render() {
    return this.activity
      ? html`
          <paper-material
            .loggedInUser="${this.isLoggedIn}"
            .elevation="${this._elevationForType()}"
            class="layout vertical activity"
            tabindex="${this.tabIndex}">
            <paper-icon-button
              .title="${this.t('deleteActivity')}"
              ?hidden="${!this._hasActivityAccess(this.activity)}"
              icon="delete"
              data-args="${this.activity.id}"
              class="deleteIcon"
              @tap="${this._deleteActivity}"></paper-icon-button>
            <div class="mainActivityContent">
              <div class="layout horizontal">
                <yp-user-with-organization .user="${this.activity.User}" inverted></yp-user-with-organization>
                <div class="flex"></div>
                <div
                  ?hidden="${!this.wide}"
                  class="createdAt"
                  .title="${this.fromLongTime(this.activity.created_at)}">
                  ${this.fromTime(this.activity.created_at)}
                </div>
              </div>

              ${this._isActivityType(this.activity, 'activity.post.new')
                ? html`
                    <ac-activity-post
                      .activity="${this.activity}"
                      .postId="${this.postId}"
                      .communityId="${this.communityId}"
                      .groupId="${this.groupId}"></ac-activity-post>
                  `
                : html``}
              ${this._isActivityType(this.activity, 'activity.point.new')
                ? html`
                    <ac-activity-point
                      .postId="${this.postId}"
                      .activity="${this.activity}"></ac-activity-point>
                  `
                : html``}
              ${this._isActivityType(
                this.activity,
                'activity.point.newsStory.new'
              )
                ? html`
                    <ac-activity-point-news-story
                      .activity="${this.activity}"
                      .postId="${this.postId}"
                      .communityId="${this.communityId}"
                      .groupId="${this.groupId}"></ac-activity-point-news-story>
                  `
                : html``}
              ${this._isActivityType(
                this.activity,
                'activity.post.status.change'
              )
                ? html`
                    <ac-activity-post-status-update
                      .activity="${this
                        .activity}"></ac-activity-post-status-update>
                  `
                : html``}
            </div>
          </paper-material>
        `
      : nothing;
  }

  /*
  behaviors: [
    ypLoggedInUserBehavior,
    AccessHelpers
  ],
*/

  fromTime(timeValue) {
    return formatDistance(timeValue, new Date(), {
      locale: this.language,
    });
  }

  fromLongTime(timeValue) {
    return format(timeValue, '', {
      locale: this.language,
    });
  }

  _elevationForType() {
    return 1;
  }

  _hasActivityAccess(activity: AcActivityData) {
    if (this.domainId && activity.Domain) {
      return YpAccessHelpers.checkDomainAccess(activity.Domain);
    } else if (this.communityId && activity.Community) {
      return YpAccessHelpers.checkCommunityAccess(activity.Community);
    } else if (this.groupId && activity.Group) {
      return YpAccessHelpers.checkGroupAccess(activity.Group);
    } else if (this.postId && activity.Post) {
      return YpAccessHelpers.checkPostAccess(activity.Post);
    } else {
      return false;
    }
  }

  _deleteActivity() {
    this.fire('ak-delete-activity', { id: this.activity!.id });
  }

  _isNotActivityType(activity: AcActivityData, type: string) {
    return activity.type != type;
  }

  _isActivityType(activity: AcActivityData, type: string) {
    return activity.type == type;
  }
}
