import { property, html, customElement } from 'lit-element';
import { nothing } from 'lit-html';
import { classMap } from 'lit-html/directives/class-map.js';
import { accessibleSnackbarLabel } from '@material/mwc-snackbar/accessible-snackbar-label-directive.js';

import '../yp-user/yp-user-with-organization.js';
import { Snackbar } from '@material/mwc-snackbar';

@customElement('ac-notification-toast')
export class AcNotificationToast extends Snackbar {
  @property({ type: String })
  notificationText = '';

  @property({ type: Object })
  user: YpUserData | undefined;

  render() {
    const classes = {
      'mdc-snackbar--stacked': this.stacked,
      'mdc-snackbar--leading': this.leading,
    };
    return html` <div
      class="mdc-snackbar ${classMap(classes)}"
      @keydown="${this._keyDown}">
      <div class="mdc-snackbar__surface">
        ${this.user
          ? html`
              <yp-user-with-organization
                class="layout horizontal self-end"
                .user="${this.user}"></yp-user-with-organization>
            `
          : nothing}
        ${accessibleSnackbarLabel(this.notificationText, this.open)}
        <div class="mdc-snackbar__actions">
          <slot name="action" @click="${this._close}"></slot>
          <slot name="dismiss" @click="${this._dismiss}"></slot>
        </div>
      </div>
    </div>`;
  }

  _keyDown(e: KeyboardEvent) {
    this.mdcFoundation.handleKeyDown(e);
  }

  _close(e: MouseEvent) {
    this.mdcFoundation.handleActionButtonClick(e);
  }

  _dismiss(e: MouseEvent) {
    this.mdcFoundation.handleActionButtonClick(e);
  }

  openDialog(
    user: YpUserData | undefined,
    notificationText: string,
    systemNotification: boolean
  ) {
    this.notificationText = notificationText;
    if (!systemNotification) {
      this.user = user;
    }
    this.open = true;
  }
}
