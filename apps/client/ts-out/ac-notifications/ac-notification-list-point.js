var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import "@material/web/icon/icon.js";
import '../yp-magic-text/yp-magic-text.js';
import '../yp-user/yp-user-image.js';
import { YpBaseElement } from '../common/yp-base-element.js';
import { YpNavHelpers } from '../common/YpNavHelpers.js';
import { truncateNameList } from './TruncateNameList.js';
import { YpFormattingHelpers } from '../common/YpFormattingHelpers.js';
let AcNotificationListPoint = class AcNotificationListPoint extends YpBaseElement {
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('notification')) {
            this._notificationChanged();
        }
    }
    static get styles() {
        return [
            super.styles,
            css `
        .pointerCursor {
          cursor: pointer;
        }

        .endorsers {
        }

        .opposers {
        }

        .chatIcon {
          min-width: 24px;
          min-height: 24px;
          max-width: 24px;
          max-height: 24px;
          margin: 6px;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .thumbsIcon {
          margin-top: 0;
          padding-top: 0;
          min-width: 20px;
          min-height: 20px;
          max-width: 20px;
          max-height: 20px;
        }

        .smallIcons {
          max-width: 16px;
          max-height: 16px;
          min-width: 16px;
          min-height: 16px;
          padding-top: 2px;
          padding-right: 2px;
        }

        .postName {
          padding-top: 4px;
          padding-bottom: 0;
          font-style: italic;
        }

        .postName[point-value-up] {
        }

        .pointContent {
          padding-bottom: 4px;
        }

        .pointContent[point-value-up] {
        }

        .leftContainer {
          margin-right: 8px;
        }

        [hidden] {
          display: none !important;
        }
      `,
        ];
    }
    render() {
        return html `
      <div
        class="layout vertical pointerCursor"
        @click="${this.goToPost}"
        ?hidden="${!this.post}">
        <div class="layout horizontal">
          <div class="layout vertical center-center self-start leftContainer">
            ${this.user
            ? html `
                  <yp-user-image small .user="${this.user}"></yp-user-image>
                `
            : nothing}
            <md-icon class="chatIcon">chat_bubble_outline</md-icon>
            <div ?hidden="${!this.pointValueUp}">
              <md-icon class="chatIcon thumbsIcon">thumb_up</md-icon>
            </div>
            <div ?hidden="${this.pointValueUp}">
              <md-icon class="chatIcon thumbsIcon">thumb_down</md-icon>
            </div>
          </div>
          <div class="layout vertical">
            <div
              .pointValueUp="${this.pointValueUp}"
              class="layout horizontal pointContent">
              ${this.pointContent}
            </div>
            <div class="layout horizontal" ?hidden="${!this.helpfulsText}">
              <md-icon class="smallIcons endorsers">arrow_upward</md-icon>
              <div class="endorsers">${this.helpfulsText}</div>
            </div>
            <div class="layout horizontal" ?hidden="${!this.unhelpfulsText}">
              <md-icon class="smallIcons opposers">arrow_downward</md-icon>
              <div class="opposers">${this.unhelpfulsText}</div>
            </div>
            <div class="postName">${this.postNameTruncated}</div>
          </div>
        </div>
      </div>
    `;
    }
    get postNameTruncated() {
        if (this.postName) {
            return YpFormattingHelpers.truncate(this.postName, 42);
        }
        else {
            return '';
        }
    }
    get pointValueUp() {
        return this.point && this.point.value > 0;
    }
    goToPost() {
        if (this.post) {
            let postUrl = '/post/' + this.post.id;
            if (this.point) {
                postUrl += '/' + this.point.id;
            }
            window.appGlobals.activity('open', 'post', postUrl);
            setTimeout(() => {
                YpNavHelpers.redirectTo(postUrl);
                this.fire('yp-close-right-drawer');
            });
        }
    }
    _notificationChanged() {
        if (this.notification) {
            this.point = this.notification.AcActivities[0].Point;
            this.post = this.notification.AcActivities[0].Post;
            this.user = this.notification.AcActivities[0].User;
            if (this.point) {
                this.pointContent = YpFormattingHelpers.truncate(this.point.content, 72);
            }
            if (this.notification.type == 'notification.point.new') {
                this.newPointMode = true;
            }
            else if (this.notification.type == 'notification.point.quality') {
                this.qualityMode = true;
                this._createQualityStrings();
            }
        }
        else {
            this.helpfulsText = undefined;
            this.unhelpfulsText = undefined;
            this.newPointMode = undefined;
            this.qualityMode = undefined;
        }
    }
    _createQualityStrings() {
        let helpfuls = '';
        let unhelpfuls = '';
        this.notification.AcActivities.forEach(activity => {
            if (activity.type == 'activity.point.helpful.new') {
                if (!helpfuls) {
                    helpfuls = '';
                }
                helpfuls = this._addWithComma(helpfuls, activity.User.name);
            }
            else if (activity.type == 'activity.point.unhelpful.new') {
                if (!unhelpfuls) {
                    unhelpfuls = '';
                }
                unhelpfuls = this._addWithComma(unhelpfuls, activity.User.name);
            }
        });
        if (helpfuls && helpfuls != '') {
            this.helpfulsText = truncateNameList(helpfuls);
        }
        if (unhelpfuls && unhelpfuls != '') {
            this.unhelpfulsText = truncateNameList(unhelpfuls);
        }
    }
    _addWithComma(text, toAdd) {
        let returnText = '';
        if (text != '') {
            returnText += text + ',';
        }
        return returnText + toAdd;
    }
};
__decorate([
    property({ type: Object })
], AcNotificationListPoint.prototype, "notification", void 0);
__decorate([
    property({ type: String })
], AcNotificationListPoint.prototype, "helpfulsText", void 0);
__decorate([
    property({ type: String })
], AcNotificationListPoint.prototype, "unhelpfulsText", void 0);
__decorate([
    property({ type: Boolean })
], AcNotificationListPoint.prototype, "newPointMode", void 0);
__decorate([
    property({ type: Boolean })
], AcNotificationListPoint.prototype, "qualityMode", void 0);
__decorate([
    property({ type: Object })
], AcNotificationListPoint.prototype, "point", void 0);
__decorate([
    property({ type: String })
], AcNotificationListPoint.prototype, "pointContent", void 0);
__decorate([
    property({ type: Object })
], AcNotificationListPoint.prototype, "user", void 0);
__decorate([
    property({ type: Object })
], AcNotificationListPoint.prototype, "post", void 0);
__decorate([
    property({ type: String })
], AcNotificationListPoint.prototype, "postName", void 0);
AcNotificationListPoint = __decorate([
    customElement('ac-notification-list-point')
], AcNotificationListPoint);
export { AcNotificationListPoint };
//# sourceMappingURL=ac-notification-list-point.js.map