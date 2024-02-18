var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import '../yp-user/yp-user-with-organization.js';
import { YpSnackbar } from '../yp-app/yp-snackbar.js';
let AcNotificationToast = class AcNotificationToast extends YpSnackbar {
    constructor() {
        super(...arguments);
        this.largerFont = false;
    }
    static get styles() {
        return [
            super.styles,
            css `
        .icon {
          height: 32px;
          width: 32px;
          min-width: 32px;
          min-height: 32px;
        }

        .text[large-font] {
          margin: 8px;
          font-size: 16px;
          margin-left: 12px;
        }
      `,
        ];
    }
    render() {
        const classes = {
            'larger-font': this.largerFont, // Adjust class to control font size
        };
        return html `
      <div class="${classMap(classes)}">
        ${this.user
            ? html `
              <yp-user-with-organization
                class="user-info"
                .user="${this.user}"
              ></yp-user-with-organization>
            `
            : nothing}
        <div class="message-content">
          ${this.icon ? html `<md-icon class="icon" .icon="${this.icon}"></md-icon>` : nothing}
          <span class="message">${this.labelText}</span>
        </div>
        <div class="actions">
          <slot name="action"></slot>
          <slot name="dismiss"></slot>
        </div>
      </div>
    `;
    }
    // You might need to adjust this method depending on how you want to handle the user data and icon logic
    openDialog(user, notificationText, systemNotification, icon = undefined, timeoutMs = undefined, largerFont = undefined) {
        this.labelText = notificationText; // Use labelText instead of notificationText
        if (!systemNotification) {
            this.user = user;
        }
        this.icon = icon;
        this.largerFont = !!largerFont; // Use boolean coercion for simplicity
        this.timeoutMs = timeoutMs || 5000; // Use the provided timeoutMs or default to 5000
        this.open = true;
    }
};
__decorate([
    property({ type: Object })
], AcNotificationToast.prototype, "user", void 0);
__decorate([
    property({ type: String })
], AcNotificationToast.prototype, "icon", void 0);
__decorate([
    property({ type: Boolean })
], AcNotificationToast.prototype, "largerFont", void 0);
AcNotificationToast = __decorate([
    customElement('ac-notification-toast')
], AcNotificationToast);
export { AcNotificationToast };
//# sourceMappingURL=ac-notification-toast.js.map