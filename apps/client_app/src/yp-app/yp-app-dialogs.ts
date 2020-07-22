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
  @property({ type: Boolean })
  hideDialogs = false;

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

      <div id="dialogs">
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


          <iron-lazy-pages selected="${this.selectedDialog}" .attrForSelected="name">
            <template is="dom-if" name="userLogin" restamp>
              <yp-login id="userLogin" @yp-forgot-password="${this._forgotPassword}"></yp-login>
            </template>

            <template is="dom-if" name="forgotPassword" restamp>
              <yp-forgot-password id="forgotPassword"></yp-forgot-password>
            </template>

            <template is="dom-if" name="resetPassword" restamp>
              <yp-reset-password id="resetPassword"></yp-reset-password>
            </template>

            <template is="dom-if" name="ratings" restamp="">
              <yp-dialog-ratings id="ratings"></yp-dialog-ratings>
            </template>

            <template is="dom-if" name="acceptInvite" restamp>
              <yp-accept-invite id="acceptInvite"></yp-accept-invite>
            </template>

            <template is="dom-if" name="missingEmail" restamp>
              <yp-missing-email id="missingEmail"></yp-missing-email>
            </template>

            <template is="dom-if" name="postEdit" restamp>
              <yp-post-edit id="postEdit"></yp-post-edit>
            </template>

            <template is="dom-if" name="userImageEdit" restamp>
              <yp-post-user-image-edit id="userImageEdit"></yp-post-user-image-edit>
            </template>

            <template is="dom-if" name="magicTextDialog" restamp>
              <yp-magic-text-dialog id="magicTextDialog"></yp-magic-text-dialog>
            </template>

            <template is="dom-if" name="apiActionDialog" restamp>
              <yp-api-action-dialog id="apiActionDialog"></yp-api-action-dialog>
            </template>

            <template is="dom-if" name="userEdit" restamp>
              <yp-user-edit id="userEdit" .method="PUT"></yp-user-edit>
            </template>

            <template is="dom-if" name="userDeleteOrAnonymize" restamp>
              <yp-user-delete-or-anonymize id="userDeleteOrAnonymize"></yp-user-delete-or-anonymize>
            </template>

            <template is="dom-if" name="domainEdit" restamp>
              <yp-domain-edit id="domainEdit"></yp-domain-edit>
            </template>

            <template is="dom-if" name="none" restamp>
              <div hidden> </div>
            </template>

            <template is="dom-if" name="usersGrid" restamp>
              <yp-users-grid id="usersGrid"></yp-users-grid>
            </template>

            <template is="dom-if" name="contentModeration" restamp>
              <yp-content-moderation id="contentModeration"></yp-content-moderation>
            </template>

            <template is="dom-if" name="createReport" restamp="">
              <yp-create-report id="createReport"></yp-create-report>
            </template>

            <template is="dom-if" name="duplicateCollection" restamp="">
              <yp-duplicate-collection id="duplicateCollection"></yp-duplicate-collection>
            </template>
          </iron-lazy-pages>

      </div>

        <paper-dialog id="loadingDialog">
          <paper-spinner .active></paper-spinner>
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
      this.$.loadingDialog.open();
      import("../yp-rating/yp-dialog-ratings.html"), function () {
        this.$.loadingDialog.close();
        console.info("Have loaded ratings dialog");
        this.gotRatingsDialog=true;
        this.getDialogAsync("ratings", callback);
      }.bind(this), null, true);
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

  getDialogAsync(idName: string, callback: Function) {
    this.hideDialogs = false;

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

    setTimeout(() => {
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
    });
  }

  _forgotPassword() {
    this.getDialogAsync("forgotPassword", function (dialog) {
      dialog.open()
    });
  }
}
