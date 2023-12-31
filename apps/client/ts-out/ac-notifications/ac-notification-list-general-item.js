var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { YpBaseElement } from '../common/yp-base-element.js';
import { YpNavHelpers } from '../common/YpNavHelpers.js';
import { YpFormattingHelpers } from '../common/YpFormattingHelpers.js';
let AcNotificationListGenaralItem = class AcNotificationListGenaralItem extends YpBaseElement {
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

        .icon {
          min-width: 24px;
          min-height: 24px;
          max-width: 24px;
          max-height: 24px;
          margin: 6px;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .name {
          padding-top: 4px;
          padding-bottom: 0;
          font-style: italic;
        }

        .shortText {
          padding-right: 8px;
          padding-bottom: 4px;
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
      <div class="layout vertical pointerCursor" @click="${this._goTo}">
        <div class="layout horizontal">
          <div class="layout vertical center-center self-start leftContainer">
            <yp-user-image small .user="${this.user}"></yp-user-image>
            <md-icon class="icon">${this.icon}</md-icon>
          </div>
          <div class="layout vertical">
            <div class="name">${this.nameTruncated}</div>
            <div ?hidden="${!this.shortText}" class="shortText">
              ${this.shortTextTruncated}
            </div>
          </div>
        </div>
      </div>
    `;
    }
    _goTo() {
        let gotoLocation;
        if (this.post) {
            this.goToPost();
        }
        else if (this.notification) {
            if (this.notification.AcActivities[0].Group &&
                this.notification.AcActivities[0].Group.name !=
                    'hidden_public_group_for_domain_level_points') {
                gotoLocation =
                    '/group/' +
                        this.notification.AcActivities[0].Group.id +
                        '/news/' +
                        this.notification.AcActivities[0].id;
            }
            else if (this.notification.AcActivities[0].Community) {
                gotoLocation =
                    '/community/' +
                        this.notification.AcActivities[0].Community.id +
                        '/news/' +
                        this.notification.AcActivities[0].id;
            }
            else if (this.notification.AcActivities[0].Domain) {
                gotoLocation =
                    '/domain/' +
                        this.notification.AcActivities[0].Domain.id +
                        '/news/' +
                        this.notification.AcActivities[0].id;
            }
            if (gotoLocation) {
                YpNavHelpers.redirectTo(gotoLocation);
            }
        }
    }
    get nameTruncated() {
        const notification = this.notification;
        if (notification.AcActivities[0].Post) {
            return YpFormattingHelpers.truncate(notification.AcActivities[0].Post.name, 42);
        }
        else if (notification.AcActivities[0].Group &&
            notification.AcActivities[0].Group.name !=
                'hidden_public_group_for_domain_level_points') {
            return YpFormattingHelpers.truncate(notification.AcActivities[0].Group.name, 42);
        }
        else if (notification.AcActivities[0].Community) {
            return YpFormattingHelpers.truncate(notification.AcActivities[0].Community.name, 42);
        }
        else if (notification.AcActivities[0].Domain) {
            return YpFormattingHelpers.truncate(notification.AcActivities[0].Domain.name, 42);
        }
        else {
            return '';
        }
    }
    get shortTextTruncated() {
        if (this.shortText) {
            return YpFormattingHelpers.truncate(this.shortText, 60);
        }
        else {
            return '';
        }
    }
    goToPost() {
        if (this.post) {
            const postUrl = '/post/' + this.post.id + '/news';
            window.appGlobals.activity('open', 'post', postUrl);
            setTimeout(() => {
                YpNavHelpers.redirectTo(postUrl);
                this.fire('yp-close-right-drawer');
            });
        }
    }
    _notificationChanged() {
        if (this.notification) {
            this.post = this.notification.AcActivities[0].Post;
            this.user = this.notification.AcActivities[0].User;
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
], AcNotificationListGenaralItem.prototype, "notification", void 0);
__decorate([
    property({ type: Object })
], AcNotificationListGenaralItem.prototype, "user", void 0);
__decorate([
    property({ type: Object })
], AcNotificationListGenaralItem.prototype, "post", void 0);
__decorate([
    property({ type: String })
], AcNotificationListGenaralItem.prototype, "icon", void 0);
__decorate([
    property({ type: String })
], AcNotificationListGenaralItem.prototype, "shortText", void 0);
AcNotificationListGenaralItem = __decorate([
    customElement('ac-notification-list-general-item')
], AcNotificationListGenaralItem);
export { AcNotificationListGenaralItem };
//# sourceMappingURL=ac-notification-list-general-item.js.map