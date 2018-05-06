import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-form/iron-form.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/paper-button/paper-button.js';
import '../../../../@polymer/paper-dialog/paper-dialog.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';

Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
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
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <paper-dialog id="dialog">
      <h3>[[t('user.acceptInvite')]]</h3>

      <div class="layout vertical">
        <div>
          [[inviteName]] [[t('user.hasSentYouAndInvitation')]]:<br> <b>[[targetName]]</b>
        </div>
        <p>[[t('user.acceptInviteInstructions')]]</p>
      </div>

      <div class="buttons">
        <yp-ajax id="acceptInviteAjax" method="POST" dispatch-error="" on-error="_inviteError" on-response="_acceptInviteResponse"></yp-ajax>
        <yp-ajax id="getInviteSenderAjax" dispatch-error="" method="GET" on-error="_inviteError" on-response="_getInviteSenderResponse"></yp-ajax>
        <paper-button on-tap="_cancel" dialog-dismiss="">[[t('cancel')]]</paper-button>
        <paper-button autofocus="" on-tap="_acceptInvite">[[t('user.acceptInvite')]]</paper-button>
      </div>
    </paper-dialog>
`,

  is: 'yp-accept-invite',

  behaviors: [
    ypLanguageBehavior,
    ypGotoBehavior
  ],

  properties: {
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
    }
  },

  _inviteError: function (event, detail) {
    this.$.acceptInviteAjax.showErrorDialog(this.t('inviteNotFoundOrAlreadyUsed'));
    this.close();
  },

  _checkInviteSender: function(e) {
    this.$.getInviteSenderAjax.url = '/api/users/get_invite_info/'+this.token;
    this.$.getInviteSenderAjax.generateRequest();
  },

  _acceptInvite: function(e) {
    if (window.appUser && window.appUser.loggedIn()===true) {
      this._reallyAcceptInvite();
    } else {
      window.appUser.loginForAcceptInvite(this, this.token, this.targetEmail);
    }
  },

  afterLogin: function (token) {
    if (!this.token) {
      this.set('token', token);
    }
    this._reallyAcceptInvite();
  },

  _reallyAcceptInvite: function(e) {
    this.$.acceptInviteAjax.url = '/api/users/accept_invite/'+this.token;
    this.$.acceptInviteAjax.body = {};
    this.$.acceptInviteAjax.generateRequest();
  },

  _getInviteSenderResponse: function (event, detail) {
    this.set('inviteName', detail.response.inviteName);
    this.set('targetName', detail.response.targetName);
    this.set('targetEmail', detail.response.targetEmail);
  },

  _acceptInviteResponse: function(event, detail) {
    window.appGlobals.notifyUserViaToast(this.t('notification.invite_accepted_for')+ detail.response.name);
    console.debug("_acceptInviteResponse: redirectTo: "+detail.response.redirectTo);
    this.redirectTo(detail.response.redirectTo);
    this.close();
  },

  _cancel: function () {
    window.location = "/";
  },

  open: function(token) {
    if (token)
      this.set('token', token);
    this._checkInviteSender();
    this.$.dialog.open();
  },

  close: function() {
    this.$.dialog.close();
  }
});
