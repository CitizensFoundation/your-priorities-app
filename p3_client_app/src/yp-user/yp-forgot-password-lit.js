import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-form/iron-form.js';
import 'lite-signal/lite-signal.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';

class YpForgotPasswordLit extends YpBaseElement {
  static get properties() {
    return {
      email: {
        type: String,
        value: ""
      },
  
      emailHasBeenSent: {
        type: Boolean,
        value: false
      },
  
      emailValidationPattern: {
        type: String,
        value: "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$"
      },
  
      emailErrorMessage: {
        type: String
      },
  
      isSending: {
        type: Boolean,
        value: false
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

      [hidden] {
        display: none !important;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
      <paper-dialog id="dialog">
        <h3>${this.t('user.forgotPassword')}</h3>

        <p ?hidden="${this.emailHasBeenSent}">${this.t('user.forgotPasswordInstructions')}</p>

        <p ?hidden="${!this.emailHasBeenSent}">${this.t('user.forgotPasswordEmailHasBeenSent')}</p>

        <form is="iron-form" id="form">

          <paper-input id="email" type="text" label="${this.t('email')}" value="${this.email}" pattern="${this.emailValidationPattern}" ?hidden="${this.emailHasBeenSent}" error-message="${this.emailErrorMessage}">
          </paper-input>

        </form>

        <div class="buttons" hidden\$="[[emailHasBeenSent]]">
          <yp-ajax id="forgotPasswordAjax" method="POST" url="/api/users/forgot_password" on-error="_forgotPasswordError" on-response="_forgotPasswordResponse"></yp-ajax>
          <paper-button dialog-dismiss="">${this.t('cancel')}</paper-button>
          <paper-button autofocus="" @tap="${this._validateAndSend}">${this.t('user.forgotPassword')}</paper-button>
        </div>

        <div class="buttons" ?hidden="${!this.emailHasBeenSent}">
          <paper-button dialog-dismiss="">${this.t('ok')}</paper-button>
        </div>
      </paper-dialog>

      <iron-a11y-keys id="a11y" keys="enter" on-keys-pressed="onEnter"></iron-a11y-keys>
`
  }

/*
  behaviors: [
    ypLanguageBehavior
  ],
*/

  onpointerenter(event) {
    event.stopPropagation();
    this._validateAndSend();
  }

  _validateAndSend(e) {
    if (this.$.form.checkValidity() && this.email) {
      if (!this.isSending) {
        this.set('isSending', true);
        this.$.forgotPasswordAjax.body = JSON.stringify({
          email: this.email
        });
        this.$.forgotPasswordAjax.generateRequest();
      }
    } else {
      return false;
    }
  }

  _forgotPasswordError() {
    this.set('isSending', false);
  }

  _forgotPasswordResponse(event, detail) {
    this.set('isSending', false);
    window.appGlobals.notifyUserViaToast(this.t('user.forgotPasswordEmailHasBeenSent'));
    this.emailHasBeenSent = true;
  }

  _loginCompleted(user) {
    window.appUser.setLoggedInUser(user);
    this.fire("login", user);
  }

  open(detail) {
    if (detail && detail.email) {
      this.set('email', detail.email);
    }
    this.$.dialog.open();
  }

  close() {
    this.$.dialog.close();
  }
}

window.customElements.define('yp-forgot-password-lit', YpForgotPasswordLit)
