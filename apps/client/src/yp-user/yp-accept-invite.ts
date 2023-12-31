import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '@material/web/button/text-button.js';
import '@material/web/dialog/dialog.js';

import { YpBaseElement } from '../common/yp-base-element.js';

import { YpNavHelpers } from '../common/YpNavHelpers.js';
import { Dialog } from '@material/web/dialog/internal/dialog.js';

@customElement('yp-accept-invite')
export class YpAcceptInvite extends YpBaseElement {
  @property({ type: String })
  token: string | undefined;

  @property({ type: String })
  errorMessage: string | undefined;

  @property({ type: String })
  inviteName: string | undefined;

  @property({ type: String })
  targetName: string | undefined;

  @property({ type: String })
  targetEmail: string | undefined;

  @property({ type: Object })
  collectionConfiguration: YpCollectionConfiguration | undefined;

  static override get styles() {
    return [
      super.styles,
      css`
        md-dialog {
          padding-left: 8px;
          padding-right: 8px;
          width: 420px;
          z-index: 9999;
        }

        @media (max-width: 480px) {
          md-dialog {
            padding: 0;
            margin: 0;
            height: 100%;
            width: 100%;
          }
        }

        b {
          padding: 0;
          margin: 0;
        }
      `,
    ];
  }

  override render() {
    return html`
      <md-dialog id="dialog" modal>
        <h3 slot="headline">${this.t('user.acceptInvite')}</h3>

        <div class="layout vertical" slot="content">
          <div>
            ${this.inviteName} ${this.t('user.hasSentYouAndInvitation')}:<br />
            <b>${this.targetName}</b>
          </div>
          <p>${this.t('user.acceptInviteInstructions')}</p>
        </div>

        <div class="buttons" slot="actions">
          <md-text-button
            @click="${this._cancel}"
            slot="secondaryAction"

            .label="${this.t('cancel')}"></md-text-button>
          <md-text-button
          slot="primaryAction"

            @click="${this._acceptInvite}"
            .label="${this.t('user.acceptInvite')}"></md-text-button>
        </div>
      </md-dialog>
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addGlobalListener('yp-network-error', this._inviteError.bind(this));
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeGlobalListener('yp-network-error', this._inviteError.bind(this));
  }

  _inviteError(event: CustomEvent) {
    if (event.detail.errorId && event.detail.errorId == 'acceptInvite') {
      this.fire('yp-error', this.t('inviteNotFoundOrAlreadyUsed'));
      this.close();
    }
  }

  async _checkInviteSender() {
    if (this.token) {
      const response = (await window.serverApi.getInviteSender(
        this.token
      )) as YpInviteSenderInfoResponse;

      this.inviteName = response.inviteName;
      this.targetName = response.targetName;
      this.targetEmail = response.targetEmail;
      this.collectionConfiguration = response.configuration;
    } else {
      console.error("Can't find token for _checkInviteSender");
    }
  }

  _acceptInvite() {
    if (window.appUser && window.appUser.loggedIn() === true) {
      this._reallyAcceptInvite();
    } else if (this.token && this.targetEmail) {
      window.appUser.loginForAcceptInvite(
        this,
        this.token,
        this.targetEmail,
        this.collectionConfiguration
      );
    } else {
      console.error('Missing parameters');
    }
  }

  afterLogin(token: string) {
    if (!this.token) {
      this.token = token;
    }
    this._reallyAcceptInvite();
  }

  async _reallyAcceptInvite() {
    if (this.token) {
      const response = (await window.serverApi.acceptInvite(
        this.token
      )) as YpAcceptInviteResponse;

      window.appGlobals.notifyUserViaToast(
        this.t('notification.invite_accepted_for') + ' ' + response.name
      );
      this.close();
      YpNavHelpers.redirectTo(response.redirectTo);
    } else {
      console.error('No token');
    }
  }

  _cancel() {
    window.location.href = '/';
  }

  open(token: string) {
    if (token) this.token = token;
    this._checkInviteSender();
    (this.$$('#dialog') as Dialog).open = true;
  }

  reOpen(token: string) {
    console.info('Repened user yp-accept-invite');
    if (token) this.token = token;
    (this.$$('#dialog') as Dialog).open = true;
  }

  close() {
    (this.$$('#dialog') as Dialog).open = false;
  }
}
