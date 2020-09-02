import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-form/iron-form.js';
import 'lite-signal/lite-signal.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/paper-input/paper-input.js';
import '@material/mwc-button';
import '@polymer/paper-dialog/paper-dialog.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';

class YpResetPasswordLit extends YpBaseElement {
  static get properties() {
    return {
      password: {
        type: String,
        value: ""
      },

      token: {
        type: String
      },

      passwordErrorMessage: {
        type: String
      }
    }
  }

  static get styles() {
    return[
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
    `, YpFlexLayout]
  }

  render() {
    return html`
    <paper-dialog id="dialog" modal>
      <h3>${this.t('user.resetPassword')}</h3>

      <p>${this.t('user.resetPasswordInstructions')}</p>

      <form is="iron-form" id="form">
        <paper-input id="password" .type="password" .label="${this.t('password')}" .value="${this.password}" .autocomplete="off" .error-message="${this.passwordErrorMessage}">
        </paper-input>

      </form>
      <div class="buttons">
        <yp-ajax id="resetPasswordAjax" method="POST" @response="${this._resetPasswordResponse}"></yp-ajax>
        <mwc-button @click="${this._cancel}" dialog-dismiss="">${this.t('cancel')}</mwc-button>
        <mwc-button .autofocus="" @click="${this._validateAndSend}">${this.t('user.resetPassword')}</mwc-button>
      </div>
    </paper-dialog>

    <iron-a11y-keys id="a11y" .keys="enter" @keys-pressed="${this.onEnter}"></iron-a11y-keys>
`

  }


  onEnter(event) {
    event.stopPropagation();
    this._validateAndSend();
  }

  _validateAndSend(e) {
    if (this.$$("#form").checkValidity() && this.password){
      this.$$("#resetPasswordAjax").url = '/api/users/reset/'+this.token;
      this.$$("#resetPasswordAjax").body = JSON.stringify({
        password: this.password
      });
      this.$$("#resetPasswordAjax").generateRequest();
    }
  }

  _resetPasswordResponse(event, detail) {
    if (detail.response.error && detail.response.error=='not_found') {
      this.$$("#resetPasswordAjax").showErrorDialog(this.t('errorResetTokenNotFoundOrUsed'));
    } else {
      this.close();
      window.appGlobals.notifyUserViaToast(this.t('notification.passwordResetAndLoggedIn'));
      this._loginCompleted(detail.response);
      window.location = "/";
    }
  }

  _cancel() {
    window.location = "/";
  }

  _loginCompleted(user) {
    window.appUser.setLoggedInUser(user);
    this.fire("login",user);
  }

  open(token) {
    if (token)
      this.token = token;
    this.$$("#dialog").open();
  }

  close() {
    this.$$("#dialog").close();
  }
}

window.customElements.define('yp-reset-password-lit', YpResetPasswordLit)