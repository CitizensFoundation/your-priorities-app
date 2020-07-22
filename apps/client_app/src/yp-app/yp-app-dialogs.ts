import { property, html, css, customElement } from 'lit-element';
import { nothing, TemplateResult } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';

import { YpBaseElement } from '../@yrpri/yp-base-element.js';
import { YpAccessHelpers } from '../@yrpri/YpAccessHelpers.js';
import { YpMediaHelpers } from '../@yrpri/YpMediaHelpers.js';
import { ShadowStyles } from '../@yrpri/ShadowStyles.js';
import { Menu } from '@material/mwc-menu';
import { YpCollectionHelpers } from '../@yrpri/YpCollectionHelpers.js';

@customElement('yp-app-dialogs')
export class YpAppDialogs extends YpBaseElement {
  @property({ type: String })
  selectedDialog: string | undefined;

  @property({ type: Boolean })
  confirmationDialogOpen = false;

  @property({ type: Boolean })
  pageDialogOpen = false;

  @property({ type: Boolean })
  mediaRecorderOpen = false

  @property({ type: Boolean })
  needsPixelCookieConfirm = false

  @property({ type: Boolean })
  autoTranslateDialogOpen = false

  @property({ type: Boolean })
  hasLoggedInUser = false

  haveLoadedDelayed = false;
  gotRatingsDialog = false
  loadingStartedLoggedIn = false;

  waitForUpgradeCounter = 0;

  facebookPixelTrackingId: string | undefined;

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          background-color: var(--primary-background-color);
        }

        #dialogs {
          background-color: var(--primary-background-color) !important;
        }

        #dialogs[hide] {
          display: none;
        }

        paper-dialog {
          background-color: #FFF;
        }

        .trackingInfo, #pixelTrackingCookieConfirm {
          color: #FFF;
          background-color: #222;
        }

        .trackingInfo {
          margin-bottom: 16px;
          font-size: 16px;
        }

        mwc-button {
          background-color: #555;
          margin-right: 12px;
          text-align: center;
        }
      `
    ]
  }

  renderSelectedDialog() {
    let selectedDialog = nothing;

    switch(this.selectedDialog) {
      case "magicTextDialog":
        selectedDialog =  html`
          <yp-magic-text-dialog id="magicTextDialog"></yp-magic-text-dialog>
        `;
        break;
      case "userLogin":
        selectedDialog =  html`
          <yp-login id="userLogin" @yp-forgot-password="${this._forgotPassword}"></yp-login>
        `;
        break;
      case "forgotPassword":
        selectedDialog =  html`
          <yp-forgot-password id="forgotPassword"></yp-forgot-password>
        `;
      break;
      case "resetPassword":
        selectedDialog =  html`
          <yp-reset-password id="resetPassword"></yp-reset-password>
        `;
      break;
      case "ratings":
        selectedDialog =  html`
          <yp-dialog-ratings id="ratings"></yp-dialog-ratings>
        `;
      break;
      case "acceptInvite":
        selectedDialog =  html`
          <yp-accept-invite id="acceptInvite"></yp-accept-invite>
        `;
      break;
      case "missingEmail":
        selectedDialog =  html`
          <yp-missing-email id="missingEmail"></yp-missing-email>
        `;
      break;
      case "postEdit":
        selectedDialog =  html`
          <yp-post-edit id="postEdit"></yp-post-edit>
        `;
      break;
      case "userImageEdit":
        selectedDialog =  html`
          <yp-post-user-image-edit id="userImageEdit"></yp-post-user-image-edit>
        `;
      break;
      case "apiActionDialog":
        selectedDialog =  html`
          <yp-api-action-dialog id="apiActionDialog"></yp-api-action-dialog>
        `;
      break;
      case "userEdit":
        selectedDialog =  html`
          <yp-user-edit id="userEdit" method="PUT"></yp-user-edit>
        `;
      break;
      case "userDeleteOrAnonymize":
        selectedDialog =  html`
           <yp-user-delete-or-anonymize id="userDeleteOrAnonymize"></yp-user-delete-or-anonymize>
        `;
      break;
    }

    return selectedDialog;
  }

  render() {
    return html`
      ${ this.hasLoggedInUser ? html`
        <ac-notification-toast id="notificationToast"></ac-notification-toast>
      `: html``}

      ${ this.needsPixelCookieConfirm ? html`
        <paper-toast id="pixelTrackingCookieConfirm" .duration="0">
            <div class="layout vertical">
              <div class="trackingInfo">${this.t('facebookTrackingToastInfo')}</div>
                <div class="layout horizontal">
              <div class="flex"></div>
                <mwc-button raised @click="${this._disableFaceookPixelTracking}" .label="${this.t('disableFacebookTracking')}"></mwc-button>
                <mwc-button raised @click="${this._agreeToFacebookPixelTracking}" .label="${this.t('iAgree')}"></mwc-button>
                </div>
              </div>
        </paper-toast>
      `: html``}

        <paper-toast id="masterToast"></paper-toast>
        <yp-ajax-error-dialog id="errorDialog"></yp-ajax-error-dialog>

        ${ this.pageDialogOpen ? html`
          <yp-page-dialog id="pageDialog"></yp-page-dialog>
        ` : html``}

        ${this.confirmationDialogOpen ? html`
          <yp-confirmation-dialog id="confirmationDialog"></yp-confirmation-dialog>
        `: html``}

        ${this.autoTranslateDialogOpen ? html`
          <yp-autotranslate-dialog id="autoTranslateDialog"></yp-autotranslate-dialog>
        `: html``}

        ${ this.mediaRecorderOpen ? html`
          <yp-media-recorder id="mediaRecorder"></yp-media-recorder>
        `: html``}

        ${ this.renderSelectedDialog() }

        <paper-dialog id="loadingDialog">
          <paper-spinner active></paper-spinner>
        </paper-dialog>
    `
  }

  constructor() {
    super();
    this.addGlobalListener('yp-logged-in-user', this._loggedInUser);
  }

  connectedCallback() {
    super.connectedCallback()
      setTimeout(() => {
        import("./yp-dialog-container-delayed.js").then(() => {
          this.haveLoadedDelayed = true;
        });
      }, 3000);
  }

  openPixelCookieConfirm(facebookPixelTrackingId) {
    this.facebookPixelTrackingId = facebookPixelTrackingId;
    setTimeout(() => {
      this.needsPixelCookieConfirm = true;
      this.$$("#pixelTrackingCookieConfirm").open = true;
    }, 2000);
  }

  _disableFaceookPixelTracking() {
    localStorage.setItem("disableFacebookPixelTracking", true);
    this.$$("#pixelTrackingCookieConfirm").close();
  }

  _agreeToFacebookPixelTracking() {
    localStorage.setItem("consentGivenForFacebookPixelTracking", true);
    window.appGlobals.setCommunityPixelTracker(this.facebookPixelTrackingId);
    this.$$("#pixelTrackingCookieConfirm").close();
  }

  _loggedInUser(event) {
    const user = event.detail;
    if (user) {
      this.hasLoggedInUser = true;
      if (!this.loadingStartedLoggedIn) {
        this.loadingStartedLoggedIn = true;
        import("./yp-dialog-container-logged-in.js").then(() => {
          console.info("Have loaded logged-in container");
        });
      } else {
        console.warn("Trying to load logged in twice, see appUser potentially removing that second event");
      }
    }
  }

  closeDialog(idName: string) {
    const element = this.$$("#"+idName);
    if (element) {
      console.info("Closing dialog: "+idName);
      element.close();
    } else {
      console.error("Did not find dialog to close: "+idName);
    }
  }

  dialogClosed(detail) {
    if (detail.name===this.selectedDialog) {
      this.selectedDialog = undefined;
      console.log("Setting selectedDialog to none");
    }
  }

  getRatingsDialogAsync(callback) {
    if (this.gotRatingsDialog) {
      this.getDialogAsync("ratings", callback);
    } else {
      this.$$("#loadingDialog").open();
      import("../yp-rating/yp-dialog-ratings.html").then(()=> {
        this.$$("#loadingDialog").close();
        console.info("Have loaded ratings dialog");
        this.gotRatingsDialog=true;
        this.getDialogAsync("ratings", callback);
      });
    }
  }

  getMediaRecorderAsync(callback) {
    if (this.gotMediaRecorder) {
      this.getDialogAsync("mediaRecorder", callback);
    } else {
      this.$$("#loadingDialog").open();
      import("./yp-dialog-container-media-recorder.js").then(() => {
        this.$$("#loadingDialog").close();
        console.info("Have loaded media recorder container");
        this.gotMediaRecorder = true;
        this.getDialogAsync("mediaRecorder", callback);
      });
    }
  }

  async getDialogAsync(idName: string, callback: Function) {
    if (idName==="pageDialog") {
      this.pageDialogOpen = true;
    } else if (idName==="confirmationDialog") {
      this.confirmationDialogOpen = true;
    } else if (idName==="autoTranslateDialog") {
      this.autoTranslateDialogOpen = true;
    } else if (idName!=='notificationToast' && idName!=='masterToast') {
      this.pageDialogOpen = false;
      this.confirmationDialogOpen = false;
      this.autoTranslateDialogOpen = false;
      this.selectedDialog = idName;
    }

    await this.requestUpdate();

    const element = this.$$("#"+idName);
    if (element && (typeof element.ready === "function")) {
      this.waitForUpgradeCounter = 0;
      console.info("Found dialog: "+idName);
      callback(element);
    } else {
      console.warn("Element not upgraded: "+idName);
      this.waitForUpgradeCounter += 1;
      if (this.waitForUpgradeCounter>100) {
        console.error("Element not upgraded after wait: "+idName);
      }
      setTimeout(() => {
        this.getDialogAsync(idName, callback);
      }, this.waitForUpgradeCounter>100 ? 1000 : 250);
    }
  }

  _forgotPassword() {
    this.getDialogAsync("forgotPassword", function (dialog) {
      dialog.open()
    });
  }
}
