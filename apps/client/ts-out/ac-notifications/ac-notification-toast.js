var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { accessibleSnackbarLabel } from '@material/mwc-snackbar/accessible-snackbar-label-directive.js';
import '../yp-user/yp-user-with-organization.js';
import { Snackbar } from '@material/mwc-snackbar';
let AcNotificationToast = class AcNotificationToast extends Snackbar {
    constructor() {
        super(...arguments);
        this.notificationText = '';
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
            'mdc-snackbar--stacked': this.stacked,
            'mdc-snackbar--leading': this.leading,
        };
        return html ` <div
      class="mdc-snackbar ${classMap(classes)}"
      @keydown="${this._handleKeydown}"
    >
      <div class="mdc-snackbar__surface">
        ${this.user
            ? html `
              <yp-user-with-organization
                class="layout horizontal self-end"
                .user="${this.user}"
              ></yp-user-with-organization>
            `
            : nothing}
        <div class="layout horizontal">
          <md-icon
            class="icon"
            ?hidden="${!this.icon}"
            .icon="${this.icon}"
          ></md-icon>
          <!-- add larger-font -->
          ${accessibleSnackbarLabel(this.notificationText, this.open)}
        </div>
        <div class="mdc-snackbar__actions">
          <slot name="action" @click="${this._handleActionClick}"></slot>
          <slot name="dismiss" @click="${this._handleDismissClick}"></slot>
        </div>
      </div>
    </div>`;
    }
    openDialog(user, notificationText, systemNotification, icon = undefined, timeoutMs = undefined, largerFont = undefined) {
        this.notificationText = notificationText;
        if (!systemNotification) {
            this.user = user;
        }
        if (icon) {
            this.icon = icon;
        }
        else {
            this.icon = undefined;
        }
        if (largerFont) {
            this.largerFont = true;
        }
        else {
            this.largerFont = false;
        }
        if (timeoutMs) {
            this.timeoutMs = timeoutMs;
        }
        this.open = true;
    }
};
__decorate([
    property({ type: String })
], AcNotificationToast.prototype, "notificationText", void 0);
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