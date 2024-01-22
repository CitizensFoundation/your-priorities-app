var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { YpBaseElement } from '../common/yp-base-element.js';
import './ac-notification-selection.js';
let AcNotificationSettings = class AcNotificationSettings extends YpBaseElement {
    render() {
        return html `
      <ac-notification-selection
        .name="${this.t('notification.myPosts')}"
        .setting="${this.notificationsSettings.my_posts}">
      </ac-notification-selection>

      <ac-notification-selection
        .name="${this.t('notification.myPostsEndorsements')}"
        .setting="${this.notificationsSettings.my_posts_endorsements}">
      </ac-notification-selection>

      <ac-notification-selection
        .name="${this.t('notification.myPoints')}"
        .setting="${this.notificationsSettings.my_points}">
      </ac-notification-selection>

      <ac-notification-selection
        .name="${this.t('notification.myPointEndorsements')}"
        .setting="${this.notificationsSettings.my_points_endorsements}">
      </ac-notification-selection>

      <ac-notification-selection
        .name="${this.t('notification.allCommunity')}"
        .setting="${this.notificationsSettings.all_community}">
      </ac-notification-selection>

      <ac-notification-selection
        .name="${this.t('notification.allGroup')}"
        .setting="${this.notificationsSettings.all_group}">
      </ac-notification-selection>
    `;
    }
    connectedCallback() {
        super.connectedCallback();
        this.addListener('yp-notification-changed', this._settingsChanged.bind(this));
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeListener('yp-notification-changed', this._settingsChanged.bind(this));
    }
    _settingsChanged() {
        this.fire('yp-notifications-changed', this.notificationsSettings);
    }
};
__decorate([
    property({ type: Object })
], AcNotificationSettings.prototype, "notificationsSettings", void 0);
AcNotificationSettings = __decorate([
    customElement('ac-notification-settings')
], AcNotificationSettings);
export { AcNotificationSettings };
//# sourceMappingURL=ac-notification-settings.js.map