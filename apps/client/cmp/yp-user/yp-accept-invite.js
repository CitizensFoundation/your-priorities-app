var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@material/web/button/text-button.js';
import '@material/web/dialog/dialog.js';
import { YpBaseElement } from '../common/yp-base-element.js';
import { YpNavHelpers } from '../common/YpNavHelpers.js';
let YpAcceptInvite = class YpAcceptInvite extends YpBaseElement {
    static get styles() {
        return [
            super.styles,
            css `
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
    render() {
        return html `
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
    connectedCallback() {
        super.connectedCallback();
        this.addGlobalListener('yp-network-error', this._inviteError.bind(this));
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeGlobalListener('yp-network-error', this._inviteError.bind(this));
    }
    _inviteError(event) {
        if (event.detail.errorId && event.detail.errorId == 'acceptInvite') {
            this.fire('yp-error', this.t('inviteNotFoundOrAlreadyUsed'));
            this.close();
        }
    }
    async _checkInviteSender() {
        if (this.token) {
            const response = (await window.serverApi.getInviteSender(this.token));
            this.inviteName = response.inviteName;
            this.targetName = response.targetName;
            this.targetEmail = response.targetEmail;
            this.collectionConfiguration = response.configuration;
        }
        else {
            console.error("Can't find token for _checkInviteSender");
        }
    }
    _acceptInvite() {
        if (window.appUser && window.appUser.loggedIn() === true) {
            this._reallyAcceptInvite();
        }
        else if (this.token && this.targetEmail) {
            window.appUser.loginForAcceptInvite(this, this.token, this.targetEmail, this.collectionConfiguration);
        }
        else {
            console.error('Missing parameters');
        }
    }
    afterLogin(token) {
        if (!this.token) {
            this.token = token;
        }
        this._reallyAcceptInvite();
    }
    async _reallyAcceptInvite() {
        if (this.token) {
            const response = (await window.serverApi.acceptInvite(this.token));
            window.appGlobals.notifyUserViaToast(this.t('notification.invite_accepted_for') + ' ' + response.name);
            this.close();
            YpNavHelpers.redirectTo(response.redirectTo);
        }
        else {
            console.error('No token');
        }
    }
    _cancel() {
        window.location.href = '/';
    }
    open(token) {
        if (token)
            this.token = token;
        this._checkInviteSender();
        this.$$('#dialog').open = true;
    }
    reOpen(token) {
        console.info('Repened user yp-accept-invite');
        if (token)
            this.token = token;
        this.$$('#dialog').open = true;
    }
    close() {
        this.$$('#dialog').open = false;
    }
};
__decorate([
    property({ type: String })
], YpAcceptInvite.prototype, "token", void 0);
__decorate([
    property({ type: String })
], YpAcceptInvite.prototype, "errorMessage", void 0);
__decorate([
    property({ type: String })
], YpAcceptInvite.prototype, "inviteName", void 0);
__decorate([
    property({ type: String })
], YpAcceptInvite.prototype, "targetName", void 0);
__decorate([
    property({ type: String })
], YpAcceptInvite.prototype, "targetEmail", void 0);
__decorate([
    property({ type: Object })
], YpAcceptInvite.prototype, "collectionConfiguration", void 0);
YpAcceptInvite = __decorate([
    customElement('yp-accept-invite')
], YpAcceptInvite);
export { YpAcceptInvite };
//# sourceMappingURL=yp-accept-invite.js.map