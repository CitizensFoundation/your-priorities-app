import '@polymer/polymer/polymer-legacy.js';
import 'lite-signal/lite-signal.js';
import 'iron-lazy-pages/iron-lazy-pages.js';
import '../yp-ajax/yp-ajax-error-dialog.js';
import '../yp-user/yp-login.js';
import '../yp-user/yp-missing-email.js';
import '../yp-user/yp-forgot-password.js';
import '../yp-user/yp-reset-password.js';
import '../yp-page/yp-page-dialog.js';
import '../yp-user/yp-accept-invite.js';
import './yp-autotranslate-dialog.js';
import { ypGotAdminRightsBehavior } from '../yp-behaviors/yp-got-admin-rights-behavior.js';
import { ypLoggedInUserBehavior } from '../yp-behaviors/yp-logged-in-user-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';

class YpDialogContainerLit extends YpBaseElement {
  static get properties() {
    return {
        waitForUpgradeCounter: {
          type: Number,
          value: 0
        },

        bulkStatusUpdates: {
          type: Boolean,
          value: false
        },

        hideDialogs: {
          type: Boolean,
          value: true
        },

        haveLoadedDelayed: {
          type: Boolean,
          value: false
        },

        loadingStartedLoggedIn: {
          type: Boolean,
          value: false
        },

        loadingStartedAdmin: {
          type: Boolean,
          value: false
        },

        selectedDialog: {
          type: String,
          value: null
        },

        confirmationDialogOpen: {
          type: String,
          value: false
        },

        pageDialogOpen: {
          type: Boolean,
          value: false
        },

        gotUsersGrid: {
          type: Boolean,
          value: false
        },

        gotContentModeration: {
          type: Boolean,
          value: false
        },

        gotCreateReport: {
          type: Boolean,
          value: false
        },

        gotDuplicateCollection: {
          type: Boolean,
          value: false
        },

        gotMediaRecorder: {
          type: Boolean,
          value: false
        },

        needsPixelCookieConfirm: {
          type: Boolean,
          value: false
        },

        autoTranslateDialogOpen: {
          type: Boolean,
          value: false
        },

        facebookPixelTrackingId: String
      };
    }

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
    `, YplexLayout]
  }

  render() {
    return html`

    <lite-signal @lite-signal-got-admin-rights="${this._gotAdminRights}"></lite-signal>
    <lite-signal @lite-signal-logged-in="${this._loggedInUser}"></lite-signal>
    <lite-signal @lite-signal-open-bulk-status-updates="${this._openBulkStatusUpdates}"></lite-signal>

    ${ this.loggedInUser ? html`
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

    <div id="dialogs" .hide="${this.hideDialogs}">
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

          <template is="dom-if" name="communityEdit" restamp>
            <yp-community-edit id="communityEdit"></yp-community-edit>
          </template>

          <template is="dom-if" name="groupEdit" restamp>
            <yp-group-edit .new="" id="groupEdit"></yp-group-edit>
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

          <template is="dom-if" name="autoTranslateDialog" restamp>
            <yp-autotranslate-dialog id="autoTranslateDialog"></yp-autotranslate-dialog>
          </template>

          <template is="dom-if" name="userEdit" restamp>
            <yp-user-edit id="userEdit" .method="PUT"></yp-user-edit>
          </template>

          <template is="dom-if" name="userDeleteOrAnonymize" restamp>
            <yp-user-delete-or-anonymize id="userDeleteOrAnonymize"></yp-user-delete-or-anonymize>
          </template>

          <template is="dom-if" name="categoryEdit" restamp>
            <yp-category-edit .new="" id="categoryEdit"></yp-category-edit>
          </template>

          <template is="dom-if" name="pagesGrid" restamp>
            <yp-pages-grid id="pagesGrid"></yp-pages-grid>
          </template>

          <template is="dom-if" name="organizationsGrid" restamp>
            <yp-organizations-grid id="organizationsGrid"></yp-organizations-grid>
          </template>

          <template is="dom-if" name="organizationEdit" restamp>
            <yp-organization-edit id="organizationEdit"></yp-organization-edit>
          </template>

          <template is="dom-if" name="domainEdit" restamp>
            <yp-domain-edit id="domainEdit"></yp-domain-edit>
          </template>

          <template is="dom-if" name="postStatusChangeEdit" restamp>
            <yp-post-status-change-edit id="postStatusChangeEdit"></yp-post-status-change-edit>
          </template>

          <template is="dom-if" name="postMove" restamp>
            <yp-post-move id="postMove"></yp-post-move>
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

      ${this.bulkStatusUpdates ? html`
        <yp-bulk-status-update-config id="bulkStatusUpdateConfig"></yp-bulk-status-update-config>
        <yp-bulk-status-update-grid id="bulkStatusUpdateGrid"></yp-bulk-status-update-grid>
        <yp-bulk-status-update-edit id="bulkStatusUpdateEdit"></yp-bulk-status-update-edit>
        <yp-bulk-status-update-templates id="bulkStatusUpdateEditTemplates"></yp-bulk-status-update-templates>
      `: html``}

      ${ this.gotMediaRecorder ? html`
        <yp-media-recorder id="mediaRecorder"></yp-media-recorder>
      `: html``}
    </div>

      <paper-dialog id="loadingDialog">
        <paper-spinner .active></paper-spinner>
      </paper-dialog>
`
  }


/*
  behaviors: [
    ypLoggedInUserBehavior,
    ypGotAdminRightsBehavior,
  ],
*/

  connectedCallback() {
    super.connectedCallback()
      this.async(function () {
        import(this.resolveUrl("/src/yp-dialog-container/yp-dialog-container-delayed.js")).then(() => {
          this.set('haveLoadedDelayed', true)
        });
      }, 3000);
  }

  openPixelCookieConfirm(facebookPixelTrackingId) {
    this.set('facebookPixelTrackingId', facebookPixelTrackingId);
    this.async(function () {
      this.set('needsPixelCookieConfirm', true);
      this.async(function () {
        this.$$("#pixelTrackingCookieConfirm").open();
      });
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

  _loggedInUser(event, user) {
    console.info("_loggedInUser");
    if (user) {
      this.set('loggedInUser', user);
      if (!this.loadingStartedLoggedIn) {
        this.loadingStartedLoggedIn = true;
        import(this.resolveUrl("/src/yp-dialog-container/yp-dialog-container-logged-in.js")).then(() => {
          console.info("Have loaded logged-in container");
        });
      } else {
        console.warn("Trying to load logged in twice, see appUser potentially removing that second event");
      }
    }
  }

  _gotAdminRights(event, detail) {
    console.info("_gotAdminRights");
    if (detail && detail>0) {
      this.set('gotAdminRights', true);
      if (!this.loadingStartedAdmin) {
        this.loadingStartedAdmin = true;
        import(this.resolveUrl("/src/yp-dialog-container/yp-dialog-container-admin.js")).then(() => {
          console.info("Have loaded admin container");
        });
      } else {
        console.warn("Trying to load admin in twice, see appUser potentially removing that second event");
      }
    }
  }

  _openBulkStatusUpdates() {
    this.$$("#loadingDialog").open();

    import(this.resolveUrl("/src/yp-dialog-container/yp-dialog-container-bulk-status-updates.js")).then(() => {
      this.$$("#loadingDialog").close();
      console.info("Have loaded bulk status container");
    });
    this.set('bulkStatusUpdates', true);

  }

  closeDialog(idName) {
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
      this.set('selectedDialog', "none");
      console.log("Setting selectedDialog to none");
    }
  }

  getRatingsDialogAsync(callback) {
    if (this.gotRatingsDialog) {
      this.getDialogAsync("ratings", callback);
    } else {
      this.$.loadingDialog.open();
      this.importHref(this.resolveUrl("/src/yp-rating/yp-dialog-ratings.html"), function () {
        this.$.loadingDialog.close();
        console.info("Have loaded ratings dialog");
        this.gotRatingsDialog=true;
        this.getDialogAsync("ratings", callback);
      }.bind(this), null, true);
    }
  }

  getUsersGridAsync(callback) {
    if (this.gotUsersGrid) {
      this.getDialogAsync("usersGrid", callback);
    } else {
      this.$$("#loadingDialog").open();
      import(this.resolveUrl("/src/yp-dialog-container/yp-dialog-vaadin-grid-shared.js")).then(() => {
        import(this.resolveUrl("/src/yp-dialog-container/yp-dialog-container-users-grid.js")).then(() => {
          this.$$("#loadingDialog").close();
          console.info("Have loaded users grid container");
          this.set('gotUsersGrid', true);
          this.getDialogAsync("usersGrid", callback);
        });
      });
    }
  }

  getContentModerationAsync(callback) {
    if (this.gotContentModeration) {
      this.getDialogAsync("contentModeration", callback);
    } else {
      this.$$("#loadingDialog").open();
      import(this.resolveUrl("/src/yp-dialog-container/yp-dialog-vaadin-grid-shared.js")).then(() => {
        import(this.resolveUrl("/src/yp-dialog-container/yp-dialog-container-moderation.js")).then(() => {
          this.$$("#loadingDialog").close();
          console.info("Have loaded contentModeration");
          this.set('gotContentModeration', true);
          this.getDialogAsync("contentModeration", callback);
        });
      });
    }
  }


  getCreateReportAsync(callback) {
    if (this.gotCreateReport) {
      this.getDialogAsync("createReport", callback);
    } else {
      this.$.loadingDialog.open();
      this.importHref(this.resolveUrl("/src/yp-dialog-container/yp-dialog-container-create-report.html"), function () {
        this.$.loadingDialog.close();
        console.info("Have loaded createReport");
        this.set('gotCreateReport', true);
        this.getDialogAsync("createReport", callback);
      }.bind(this), null, true);
    }
  }

  getDuplicateCollectionAsync(callback) {
    if (this.gotDuplicateCollection) {
      this.getDialogAsync("duplicateCollection", callback);
    } else {
      this.$.loadingDialog.open();
      this.importHref(this.resolveUrl("/src/yp-dialog-container/yp-dialog-container-duplicate-collection.html"), function () {
        this.$.loadingDialog.close();
        console.info("Have loaded duplicateCollection");
        this.set('gotDuplicateCollection', true);
        this.getDialogAsync("duplicateCollection", callback);
      }.bind(this), null, true);
    }
  }

  getMediaRecorderAsync(callback) {
    if (this.gotMediaRecorder) {
      this.getDialogAsync("mediaRecorder", callback);
    } else {
      this.$$("#loadingDialog").open();
      import(this.resolveUrl("/src/yp-dialog-container/yp-dialog-container-media-recorder.js")).then(() => {
        this.$$("#loadingDialog").close();
        console.info("Have loaded media recorder container");
        this.set('gotMediaRecorder', true);
        this.getDialogAsync("mediaRecorder", callback);
      });
    }
  }

  getDialogAsync(idName, callback) {
    this.set('hideDialogs', false);

    if (idName==="pageDialog") {
      this.set('pageDialogOpen', true);
    } else if (idName==="confirmationDialog") {
      this.set('confirmationDialogOpen', true);
    } else if (idName==="autoTranslateDialog") {
      this.set('autoTranslateDialogOpen', true);
    } else if (idName!=='notificationToast' && idName!=='masterToast') {
      this.set('pageDialogOpen', false);
      this.set('confirmationDialogOpen', false);
      this.set('autoTranslateDialogOpen', false);
      this.set('selectedDialog', idName);
    }

    this.async(function () {
      const element = this.$$("#"+idName);
      if (element && (typeof element.ready === "function")) {
        this.set('waitForUpgradeCounter', 0);
        console.info("Found dialog: "+idName);
        callback(element);
      } else {
        console.warn("Element not upgraded: "+idName);
        this.waitForUpgradeCounter += 1;
        if (this.waitForUpgradeCounter>100) {
          console.error("Element not upgraded after wait: "+idName);
        }
        this.async(function () {
          this.getDialogAsync(idName, callback);
        }.bind(this), this.waitForUpgradeCounter>100 ? 1000 : 250);
      }
    });
  }

  _forgotPassword() {
    this.getDialogAsync("forgotPassword", function (dialog) {
      dialog.open()
    });
  }
}

window.customElements.define('yp-dialog-container-lit', YpDialogContainerLit)
