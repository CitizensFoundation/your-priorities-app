import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-input/paper-input.js';
import '@material/mwc-button';
import '@polymer/paper-dialog/paper-dialog.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';

class YpMissingEmailLit extends YpBaseElement {
  static get properties() {
    return {
      emailValidationPattern: {
        type: String,
        value: "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$"
      },

      emailErrorMessage: {
        type: String
      },

      passwordErrorMessage: {
        type: String
      },

      needPassword: {
        type: Boolean,
        value: false
      },

      email: {
        type: String,
        value: "" //robert@citizens.is"
      },

      password: {
        type: String,
        value: "" //"DksdSodksSokssss"
      },

      credentials: {
        type: String,
        notify: true,
        computed: '_computeCredentials(email, password)'
      },

      linkAccountText: {
        type: Boolean,
        value: false
      },

      heading: {
        type: String
      },

      target: {
        type: Object
      },

      onlyConfirmingEmail: {
        type: Boolean,
        value: false
      },

      originalConfirmationEmail: {
        type: String,
        value: null
      }
    }
  }

  static get styles() {
    return [
      css`

      paper-dialog {
        background-color: #FFF;
        width: 420px;
      }

      .linkAccounts {
        padding-top: 16px;
      }

      @media (max-width: 480px) {
        paper-dialog {
          padding: 0;
          margin: 0;
          width: 100%;
        }
      }

      [hidden] {
        display: none !important;
      }

      .buttons {
        margin-bottom: 8px;
        margin-right: 4px;
        text-align: center;
      }

      .setEmailInfo {
        font-size: 16px;
        font-weight: bold;
      }
    `, YpFlexLayout]
  }
  render() {
    return html`
    <div id="outer">
      <paper-dialog id="dialog">
        <h2>${this.heading}</h2>
        <div class="setEmailInfo">
          <span ?hidden="${!this.onlyConfirmingEmail}">${this.t('user.setEmailConfirmationInfo')}</span>
          <span ?hidden="${this.onlyConfirmingEmail}">${this.t('user.setEmailInfo')}</span>
        </div>
        <form is="iron-form" id="form">
          <paper-input id="email" .type="text" .label="${this.t('user.email')}" .value="${this.email}" .pattern="${this.emailValidationPattern}" .error-message="${this.emailErrorMessage}">
          </paper-input>

          ${ this.needPassword ? html`
            <div class="linkAccounts">
              ${this.t('user.existsLinkAccountInfo')}
            </div>
            <paper-input id="password" .type="password" .label="${this.t('user.password')}" .value="${this.password}" .autocomplete="off" .error-message="${this.passwordErrorMessage}">
            </paper-input>
          ` : html``}

        </form>
        <div class="buttons">
          <yp-ajax id="setEmailAjax" .dispatch-error="" .method="PUT" url="/api/users/missingEmail/setEmail" @response="${this._setEmailResponse}"></yp-ajax>
          <yp-ajax id="linkAccountsAjax" .method="PUT" .dispatch-error="" @error="${this._registerError}" url="/api/users/missingEmail/linkAccounts" @response="${this._linkAccountsResponse}"></yp-ajax>
          <yp-ajax id="confirmEmailShownAjax" .dispatch-error="" .method="PUT" url="/api/users/missingEmail/emailConfirmationShown"></yp-ajax>
          <mwc-button @click="${this._logout}" ?hidden="${this.onlyConfirmingEmail}">${this.t('user.logout')}</mwc-button>
          <mwc-button @click="${this._forgotPassword}" ?hidden="${!this.needPassword}">${this.t('user.newPassword')}</mwc-button>
          <mwc-button raised @click="${this._notNow}" ?hidden="${this.onlyConfirmingEmail}">${this.t('later')}</mwc-button>
          <mwc-button raised id="sendButton" .autofocus="" @click="${this._validateAndSend}">
            <span ?hidden="${this.linkAccountText}">
              <span ?hidden="${this.onlyConfirmingEmail}">
                ${this.t('user.setEmail')}
              </span>
              <span ?hidden="${!this.onlyConfirmingEmail}">
                ${this.t('confirm')}
              </span>
            </span>
            <span ?hidden="${!this.linkAccountText}">
              ${this.t('user.linkAccount')}
            </span>
          </mwc-button>
        </div>
      </paper-dialog>

      <iron-a11y-keys id="a11y" .keys="enter" @keys-pressed="${this.onEnter}"></iron-a11y-keys>
    </div>
`
  }


  onEnter(event) {
    this._validateAndSend();
  }

  _notNow(event) {
    window.appGlobals.activity('cancel', 'setEmail');
    this.$$("#dialog").close();
  }

  _logout() {
    window.appGlobals.activity('logout', 'setEmail');
    window.appUser.logout();
  }

  _forgotPassword() {
    window.appGlobals.activity('open', 'forgotPasswordFromSetEmail');
    window.appUser.fire("yp-forgot-password", { email: this.email });
  }

  connectedCallback() {
    super.connectedCallback()
      this.header = this.t('user.setEmail');
      this.async(function () {
        this.$$("#a11y").target = this.$$("#form");
      }.bind(this), 50);
  }

  _computeCredentials(email, password) {
   return JSON.stringify({
      email: email,
      password: password
    });
  }

  _validateAndSend(e) {
    if (this.$$("#form").checkValidity() && this.email){
      if (this.needPassword && this.password) {
        window.appGlobals.activity('confirm', 'linkAccountsAjax');
        this.$$("#linkAccountsAjax").body = this.credentials;
        this.$$("#linkAccountsAjax").generateRequest();
      } else {
        window.appGlobals.activity('confirm', 'setEmail');
        if (!this.originalConfirmationEmail || (this.originalConfirmationEmail!=this.email)) {
          this.$$("#setEmailAjax").body = {email: this.email };
          this.$$("#setEmailAjax").generateRequest();
        } else {
          window.appGlobals.notifyUserViaToast(this.t('userHaveSetEmail')+ " " + this.email);
          this.close();
        }
      }
    } else {
      this.$$("#linkAccountsAjax").showErrorDialog(this.t('user.completeForm'));
      return false;
    }
  }

  _setEmailResponse(event, detail) {
    if (detail.response && detail.response.alreadyRegistered) {
      this.needPassword = true;
      this.header = this.t('user.linkAccount');
      this.linkAccountText = true;
    } else {
      window.appGlobals.notifyUserViaToast(this.t('userHaveSetEmail')+ " " + detail.response.email);
      this.close();
    }
    this.$$("#dialog").fire('iron-resize');
  }

  _linkAccountsResponse(event, detail) {
    if (detail.response.accountLinked) {
      window.appGlobals.notifyUserViaToast(this.t('userHaveLinkedAccounts')+ " " + detail.response.email);
      window.appUser.checkLogin();
      this.close();
    } else {
      this.$$("#linkAccountsAjax").showErrorDialog(this.t('user.loginNotAuthorized'));
    }
    this.$$("#dialog").fire('iron-resize');
  }

  open(loginProvider, onlyConfirming, email) {
    this.onlyConfirmingEmail = onlyConfirming;
    if (email) {
      this.email = email;
      this.originalConfirmationEmail = email;
    }
    this.$$("#dialog").open();
    if (this.onlyConfirmingEmail) {
      this.$$("#confirmEmailShownAjax").body = {};
      this.$$("#confirmEmailShownAjax").generateRequest();
    }
  }

  close() {
    this.$$("#dialog").close();
  }
}

window.customElements.define('yp-missing-email-lit', YpMissingEmailLit)