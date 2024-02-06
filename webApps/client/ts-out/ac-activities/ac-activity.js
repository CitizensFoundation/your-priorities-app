var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { DateTime } from 'luxon';
import './ac-activity-point.js';
import './ac-activity-post.js';
import './ac-activity-point-news-story.js';
import './ac-activity-post-status-update.js';
import '../yp-user/yp-user-with-organization.js';
import '@material/web/button/outlined-button.js';
import { YpBaseElementWithLogin } from '../common/yp-base-element-with-login.js';
import { YpAccessHelpers } from '../common/YpAccessHelpers.js';
import { ShadowStyles } from '../common/ShadowStyles.js';
let AcActivity = class AcActivity extends YpBaseElementWithLogin {
    static get styles() {
        return [
            super.styles,
            ShadowStyles,
            css `
        .activity {
          margin: 16px;
          height: 100%;
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

        [hidden] {
          display: none !important;
        }
      `,
        ];
    }
    renderActivity() {
        switch (this.activity.type) {
            case 'activity.post.new':
                return html `
          <ac-activity-post
            .activity="${this.activity}"
            .postId="${this.postId}"
            .communityId="${this.communityId}"
            .groupId="${this.groupId}"></ac-activity-post>
        `;
            case 'activity.point.new':
                return html `
          <ac-activity-point
            .postId="${this.postId}"
            .activity="${this.activity}"></ac-activity-point>
        `;
            case 'activity.point.newsStory.new':
                return html `
          <ac-activity-point-news-story
            .activity="${this.activity}"
            .postId="${this.postId}"
            .communityId="${this.communityId}"
            .groupId="${this.groupId}"></ac-activity-point-news-story>
        `;
            case 'activity.post.status.change':
                return html `
          <ac-activity-post-status-update
            .postId="${this.postId}"
            .activity="${this.activity}"></ac-activity-post-status-update>
        `;
            default:
                return nothing;
        }
    }
    render() {
        return this.activity
            ? html `
          <div
            .loggedInUser="${this.isLoggedIn}"
            class="layout vertical activity" style="position: relative;"
            tabindex="${this.tabIndex}">
            <md-icon-button
              .label="${this.t('deleteActivity')}"
              ?hidden="${!this.hasActivityAccess}"
              data-args="${this.activity.id}"
              class="deleteIcon"
              @click="${this._deleteActivity}"><md-icon>delete</md-icon></md-icon-button>
            <div class="mainActivityContent">
              <div class="layout horizontal">
                <yp-user-with-organization
                  .user="${this.activity.User}"
                  inverted></yp-user-with-organization>
                <div class="flex"></div>
                <div
                  ?hidden="${!this.wide}"
                  class="createdAt"
                  .title="${this.fromLongTime(this.activity.created_at)}">
                  ${this.fromTime(this.activity.created_at)}
                </div>
              </div>

              ${this.renderActivity()}
            </div>
          </div>
        `
            : nothing;
    }
    fromTime(timeValue) {
        return DateTime.fromISO(timeValue).toRelative();
    }
    fromLongTime(timeValue) {
        return DateTime.fromISO(timeValue).toLocaleString(DateTime.DATETIME_FULL);
    }
    get hasActivityAccess() {
        if (this.activity) {
            if (this.domainId && this.activity.Domain) {
                return YpAccessHelpers.checkDomainAccess(this.activity.Domain);
            }
            else if (this.communityId && this.activity.Community) {
                return YpAccessHelpers.checkCommunityAccess(this.activity.Community);
            }
            else if (this.groupId && this.activity.Group) {
                return YpAccessHelpers.checkGroupAccess(this.activity.Group);
            }
            else if (this.postId && this.activity.Post) {
                return YpAccessHelpers.checkPostAccess(this.activity.Post);
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    _deleteActivity() {
        this.fire('yp-delete-activity', { id: this.activity.id });
    }
    _isNotActivityType(activity, type) {
        return activity.type != type;
    }
    _isActivityType(activity, type) {
        return activity.type == type;
    }
};
__decorate([
    property({ type: Object })
], AcActivity.prototype, "activity", void 0);
__decorate([
    property({ type: Number })
], AcActivity.prototype, "domainId", void 0);
__decorate([
    property({ type: Number })
], AcActivity.prototype, "communityId", void 0);
__decorate([
    property({ type: Number })
], AcActivity.prototype, "groupId", void 0);
__decorate([
    property({ type: Number })
], AcActivity.prototype, "postId", void 0);
__decorate([
    property({ type: Number })
], AcActivity.prototype, "postGroupId", void 0);
__decorate([
    property({ type: Number })
], AcActivity.prototype, "userId", void 0);
AcActivity = __decorate([
    customElement('ac-activity')
], AcActivity);
export { AcActivity };
//# sourceMappingURL=ac-activity.js.map