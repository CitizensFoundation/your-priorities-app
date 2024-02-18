import { css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import '../yp-user/yp-user-with-organization.js';
import { YpSnackbar } from '../yp-app/yp-snackbar.js';
import { YpBaseElement } from '../common/yp-base-element.js';

@customElement('ac-notification-toast')
export class AcNotificationToast extends YpSnackbar {
  @property({ type: Object })
  user: YpUserData | undefined;

  @property({ type: String })
  icon: string | undefined;

  @property({ type: Boolean })
  largerFont = false;

  static override get styles() {
    return [
      super.styles,
      css`
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

  override render() {
    const classes = {
      'larger-font': this.largerFont, // Adjust class to control font size
    };

    return html`
      <div class="${classMap(classes)}">
        ${this.user
          ? html`
              <yp-user-with-organization
                class="user-info"
                .user="${this.user}"
              ></yp-user-with-organization>
            `
          : nothing}
        <div class="message-content">
          ${this.icon ? html`<md-icon class="icon" .icon="${this.icon}"></md-icon>` : nothing}
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
  openDialog(
    user: YpUserData | undefined,
    notificationText: string,
    systemNotification: boolean,
    icon: string | undefined = undefined,
    timeoutMs: number | undefined = undefined,
    largerFont: boolean | undefined = undefined
  ) {
    this.labelText = notificationText; // Use labelText instead of notificationText
    if (!systemNotification) {
      this.user = user;
    }

    this.icon = icon;
    this.largerFont = !!largerFont; // Use boolean coercion for simplicity
    this.timeoutMs = timeoutMs || 5000; // Use the provided timeoutMs or default to 5000
    this.open = true;
  }
}
