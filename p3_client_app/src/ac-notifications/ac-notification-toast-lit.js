import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-toast/paper-toast.js';
import '../yp-app-globals/yp-app-icons.js';
import '../yp-user/yp-user-with-organization.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';

class AcNotificationToastLit extends YpBaseElement {
  static get properties() {
    return {
      user: {
        type: Object,
        value: null
      },
  
      notificationText: {
        type: String,
        value: null
      }
    }
  }

  static get styles() {
    return [
      css`

      .text {
        margin: 16px;
      }

      [hidden] {
        display: none !important;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
    <paper-toast id="toast" .duration="5000">
      <div class="layout vertical">
        <yp-user-with-organization class="layout horizontal self-end" .user="${this.user}" ?hidden="${!this.user}"></yp-user-with-organization>
        <div class="text">${this.notificationText}</div>
      </div>
    </paper-toast>
`
  }

  open(user, notificationText, systemNotification) {
    this.notificationText = notificationText;
    if (!systemNotification) {
      this.user = user;
    }
    this.$$("#toast").close();
    this.async(function () {
      this.$$("#toast").open();
    });
  }
}

window.customElements.define('ac-notification-toast-lit', AcNotificationToastLit)
