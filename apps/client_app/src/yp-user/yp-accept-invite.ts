import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-form/iron-form.js';
import 'lite-signal/lite-signal.js';
import '@material/mwc-button';
import '@polymer/paper-dialog/paper-dialog.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

class YpAcceptInviteLit extends YpBaseElement {
  static get properties() {
    return {
      token: {
        type: String
      },

      errorMessage: {
        type: String
      },

      inviteName: {
        type: String
      },

      targetName: String,

      targetEmail: {
        type: String,
        value: null
      },

      collectionConfiguration: {
        type: Object,
        value: null
      }
    }
  }

  static get styles() {
    return [
      css`

      paper-dialog {
        padding-left: 8px;
        padding-right: 8px;
        width: 420px;
        background-color: #fff;
        z-index: 9999;
      }

      @media (max-width: 480px) {
        paper-dialog {
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
    `, YpFlexLayout]
  }

  render() {
    return html`
    <paper-dialog id="dialog" modal>
      <h3>${this.t('user.acceptInvite')}</h3>

      <div class="layout vertical">
        <div>
          ${this.inviteName} ${this.t('user.hasSentYouAndInvitation')}:<br> <b>${this.targetName}</b>
        </div>
        <p>${this.t('user.acceptInviteInstructions')}</p>
      </div>

      <div class="buttons">
        <yp-ajax id="acceptInviteAjax" .method="POST" dispatch-error="" @error="${this._inviteError}" @response="${this._acceptInviteResponse}"></yp-ajax>
        <yp-ajax id="getInviteSenderAjax" .dispatch-error="" .method="GET" @error="${this._inviteError}" @response="${this._getInviteSenderResponse}"></yp-ajax>
        <mwc-button @click="${this._cancel}" .dialog-dismiss .label="${this.t('cancel')}"></mwc-button>
        <mwc-button .autofocus @click="${this._acceptInvite}" .label="${this.t('user.acceptInvite')}"></mwc-button>
      </div>
    </paper-dialog>
    `
  }
/*
  behaviors: [
    ypGotoBehavior
  ],
*/

  _inviteError(event, detail) {
    this.$$("#acceptInviteAjax").showErrorDialog(this.t('inviteNotFoundOrAlreadyUsed'));
    this.close();
  }

  _checkInviteSender(e) {
    if (this.token) {
      this.$$("#getInviteSenderAjax").url = '/api/users/get_invite_info/'+this.token;
      this.$$("#getInviteSenderAjax").generateRequest();
    } else {
      console.warn("Can't find token for _checkInviteSender");
    }
  }

  _acceptInvite(e) {
    if (window.appUser && window.appUser.loggedIn()===true) {
      this._reallyAcceptInvite();
    } else {
      window.appUser.loginForAcceptInvite(this, this.token, this.targetEmail, this.collectionConfiguration);
    }
  }

  afterLogin(token) {
    if (!this.token) {
      this.token = token;
    }
    this._reallyAcceptInvite();
  }

  _reallyAcceptInvite(e) {
    this.$$("#acceptInviteAjax").url = '/api/users/accept_invite/'+this.token;
    this.$$("#acceptInviteAjax").body = {};
    this.$$("#acceptInviteAjax").generateRequest();
  }

  _getInviteSenderResponse(event, detail) {
    this.inviteName = detail.response.inviteName;
    this.targetName = detail.response.targetName;
    this.targetEmail = detail.response.targetEmail;
    this.collectionConfiguration = detail.response.configuration;
  }

  _acceptInviteResponse(event, detail) {
    window.appGlobals.notifyUserViaToast(this.t('notification.invite_accepted_for')+' '+detail.response.name);
    console.debug("_acceptInviteResponse: redirectTo: "+detail.response.redirectTo);
    this.close();
    this.redirectTo(detail.response.redirectTo);
  }

  _cancel() {
    window.location = "/";
  }

  open(token) {
    console.info("Opened user yp-accept-invite");
    if (token)
      this.token = token;
    this._checkInviteSender();
    this.$$("#dialog").open();
  }

  reOpen(token) {
    console.info("Repened user yp-accept-invite");
    if (token)
      this.token = token;
    this.$$("dialog").open();
  }

  close() {
    this.$$("#dialog").close();
  }
}

window.customELements.define('yp-accept-invite-lit', YpAcceptInviteLit)