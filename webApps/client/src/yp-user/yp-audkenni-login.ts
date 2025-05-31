import { html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { YpBaseElement } from '../common/yp-base-element.js';

import '@material/web/textfield/outlined-text-field.js';
import '@material/web/button/filled-button.js';
import '@material/web/progress/circular-progress.js';
import '@material/web/radio/radio.js';

@customElement('yp-audkenni-login')
export class YpAudkenniLogin extends YpBaseElement {
  @property({ type: String })
  phone = '';

  @property({ type: String })
  authenticator: 'sim' | 'card' = 'sim';

  @property({ type: Boolean })
  polling = false;

  @property({ type: String })
  pollId: string | undefined;

  static override get styles() {
    return [
      super.styles,
      css`
        .loginField {
          margin-bottom: 8px;
          width: 100%;
        }
        .options {
          margin-bottom: 8px;
        }
        .status {
          margin-top: 8px;
        }
      `,
    ];
  }

  override render() {
    return html`
      <div>
        <md-outlined-text-field
          class="loginField"
          .value=${this.phone}
          @input=${(e: Event) =>
            (this.phone = (e.target as HTMLInputElement).value)}
          label="${this.t('user.phoneNumber') || 'Phone number'}"
        ></md-outlined-text-field>

        <div class="options layout horizontal center-center">
          <label class="layout horizontal center-center">
            <md-radio
              name="auth"
              value="sim"
              ?checked=${this.authenticator === 'sim'}
              @change=${() => (this.authenticator = 'sim')}
            ></md-radio>
            <span>SIM</span>
          </label>
          <label class="layout horizontal center-center">
            <md-radio
              name="auth"
              value="card"
              ?checked=${this.authenticator === 'card'}
              @change=${() => (this.authenticator = 'card')}
            ></md-radio>
            <span>Card</span>
          </label>
        </div>

        <md-filled-button
          @click=${this.startLogin}
          ?disabled=${this.polling}
          >${this.t('login') || 'Login'}</md-filled-button
        >

        <div class="status" ?hidden=${!this.polling}>
          <md-circular-progress indeterminate></md-circular-progress>
          <span>${this.t('user.waitingForConfirmation') || 'Waiting for confirmation...'}</span>
        </div>
      </div>
    `;
  }

  async startLogin() {
    if (!this.phone) {
      this.fire('yp-error', this.t('user.completeForm'));
      return;
    }
    this.polling = true;
    const response = await fetch('/api/users/auth/audkenni-rest/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: this.phone, authenticator: this.authenticator }),
    });
    if (response.ok) {
      const data = await response.json();
      this.pollId = data.id || data.pollId;
      this._poll();
    } else {
      this.polling = false;
      this.fire('yp-error', this.t('user.loginNotAuthorized'));
    }
  }

  async _poll() {
    if (!this.pollId) {
      this.polling = false;
      return;
    }
    const response = await fetch(
      `/api/users/auth/audkenni-rest/poll/${this.pollId}`
    );
    if (response.ok) {
      const data = await response.json();
      if (data.pending) {
        setTimeout(() => this._poll(), 2000);
      } else if (data.user) {
        this.polling = false;
        this.dispatchEvent(
          new CustomEvent('login-completed', {
            detail: data.user,
            bubbles: true,
            composed: true,
          })
        );
      } else {
        setTimeout(() => this._poll(), 2000);
      }
    } else {
      this.polling = false;
    }
  }
}
