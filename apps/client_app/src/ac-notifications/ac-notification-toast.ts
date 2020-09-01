import { property, html, css, customElement } from 'lit-element';
import { nothing } from 'lit-html';

import { YpBaseElement } from '../@yrpri/yp-base-element.js';

@customElement('ac-notification-toast')
export class AcNotificationToastLit extends YpBaseElement {
  @property({ type: String })
  notificationText: string | undefined

  @property({ type: Object })
  user: YpUserData | undefined

  static get styles() {
    return [
      css`
        .text {
          margin: 16px;
        }

        [hidden] {
          display: none !important;
        }
      `
    ];
  }

  render() {
    return html`
      <paper-toast id="toast" duration="5000">
        <div class="layout vertical">
          ${this.user
            ? html`
                <yp-user-with-organization
                  class="layout horizontal self-end"
                  .user="${this.user}"
                  ?hidden="${!this.user}"></yp-user-with-organization>
              `
            : nothing}
          <div class="text">${this.notificationText}</div>
        </div>
      </paper-toast>
    `;
  }

  open(user: YpUserData | undefined, notificationText: string, systemNotification: boolean) {
    this.notificationText = notificationText;
    if (!systemNotification) {
      this.user = user;
    }
    this.$$('#toast').close();
    setTimeout(() => {
      this.$$('#toast').open();
    });
  }
}
