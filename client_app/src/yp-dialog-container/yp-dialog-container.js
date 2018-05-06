import '../../../../@polymer/polymer/polymer.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../iron-lazy-pages/iron-lazy-pages.js';
import '../yp-ajax/yp-ajax-error-dialog.js';
import '../yp-user/yp-login.js';
import '../yp-user/yp-missing-email.js';
import '../yp-user/yp-forgot-password.js';
import '../yp-user/yp-reset-password.js';
import '../yp-page/yp-page-dialog.js';
import '../yp-user/yp-accept-invite.js';
import { ypGotAdminRightsBehavior } from '../yp-behaviors/yp-got-admin-rights-behavior.js';
import { ypLoggedInUserBehavior } from '../yp-behaviors/yp-logged-in-user-behavior.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      :host {
        background-color: var(--primary-background-color);
      }

      #dialogs {
        background-color: var(--primary-background-color) !important;
      }

      #dialogs[hide] {
        display: none;
      }
    </style>

    <lite-signal on-lite-signal-got-admin-rights="_gotAdminRights"></lite-signal>
    <lite-signal on-lite-signal-logged-in="_loggedInUser"></lite-signal>
    <lite-signal on-lite-signal-open-bulk-status-updates="_openBulkStatusUpdates"></lite-signal>

    <div id="dialogs" hide\$="[[hideDialogs]]">
      <paper-toast id="masterToast"></paper-toast>
      <yp-ajax-error-dialog id="errorDialog"></yp-ajax-error-dialog>

      <iron-lazy-pages selected="{{selectedDialog}}" attr-for-selected="name">
        <template is="dom-if" name="userLogin" restamp="">
          <yp-login id="userLogin" on-yp-forgot-password="_forgotPassword"></yp-login>
        </template>

        <template is="dom-if" name="forgotPassword" restamp="">
          <yp-forgot-password id="forgotPassword"></yp-forgot-password>
        </template>

        <template is="dom-if" name="resetPassword" restamp="">
          <yp-reset-password id="resetPassword"></yp-reset-password>
        </template>

        <template is="dom-if" name="acceptInvite" restamp="">
          <yp-accept-invite id="acceptInvite"></yp-accept-invite>
        </template>

        <template is="dom-if" name="missingEmail" restamp="">
          <yp-missing-email id="missingEmail"></yp-missing-email>
        </template>

        <template is="dom-if" name="pageDialog" restamp="">
          <yp-page-dialog id="pageDialog"></yp-page-dialog>
        </template>

        <template is="dom-if" name="communityEdit" restamp="">
          <yp-community-edit id="communityEdit"></yp-community-edit>
        </template>

        <template is="dom-if" name="groupEdit" restamp="">
          <yp-group-edit new="" id="groupEdit"></yp-group-edit>
        </template>

        <template is="dom-if" name="postEdit" restamp="">
          <yp-post-edit id="postEdit"></yp-post-edit>
        </template>

        <template is="dom-if" name="userImageEdit" restamp="">
          <yp-post-user-image-edit id="userImageEdit"></yp-post-user-image-edit>
        </template>

        <template is="dom-if" name="magicTextDialog" restamp="">
          <yp-magic-text-dialog id="magicTextDialog"></yp-magic-text-dialog>
        </template>

        <template is="dom-if" name="apiActionDialog" restamp="">
          <yp-api-action-dialog id="apiActionDialog"></yp-api-action-dialog>
        </template>

        <template is="dom-if" name="userEdit" restamp="">
          <yp-user-edit id="userEdit" method="PUT"></yp-user-edit>
        </template>

        <template is="dom-if" name="confirmationDialog" restamp="">
          <yp-confirmation-dialog id="confirmationDialog"></yp-confirmation-dialog>
        </template>

        <template is="dom-if" name="notificationToast" restamp="">
          <ac-notification-toast id="notificationToast"></ac-notification-toast>
        </template>

        <template is="dom-if" name="categoryEdit" restamp="">
          <yp-category-edit new="" id="categoryEdit"></yp-category-edit>
        </template>

        <template is="dom-if" name="usersGrid" restamp="">
          <yp-users-grid id="usersGrid"></yp-users-grid>
        </template>

        <template is="dom-if" name="pagesGrid" restamp="">
          <yp-pages-grid id="pagesGrid"></yp-pages-grid>
        </template>

        <template is="dom-if" name="organizationsGrid" restamp="">
          <yp-organizations-grid id="organizationsGrid"></yp-organizations-grid>
        </template>

        <template is="dom-if" name="organizationEdit" restamp="">
          <yp-organization-edit id="organizationEdit"></yp-organization-edit>
        </template>

        <template is="dom-if" name="domainEdit" restamp="">
          <yp-domain-edit id="domainEdit"></yp-domain-edit>
        </template>

        <template is="dom-if" name="postStatusChangeEdit" restamp="">
          <yp-post-status-change-edit id="postStatusChangeEdit"></yp-post-status-change-edit>
        </template>

        <template is="dom-if" name="postMove" restamp="">
          <yp-post-move id="postMove"></yp-post-move>
        </template>

        <template is="dom-if" name="none" restamp="">
        </template>
      </iron-lazy-pages>

      <template is="dom-if" if="[[bulkStatusUpdates]]">
        <yp-bulk-status-update-config id="bulkStatusUpdateConfig"></yp-bulk-status-update-config>
        <yp-bulk-status-update-grid id="bulkStatusUpdateGrid"></yp-bulk-status-update-grid>
        <yp-bulk-status-update-edit id="bulkStatusUpdateEdit"></yp-bulk-status-update-edit>
        <yp-bulk-status-update-templates id="bulkStatusUpdateEditTemplates"></yp-bulk-status-update-templates>
      </template>
    </div>
`,

  is: 'yp-dialog-container',

  behaviors: [
    ypLoggedInUserBehavior,
    ypGotAdminRightsBehavior
  ],

  properties: {
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
    }
  },

  ready: function () {
    this.async(function () {
      this.importHref(this.resolveUrl("yp-dialog-container-delayed.html"), function () {
        this.set('haveLoadedDelayed', true)
      }, null, true);
    });
  },

  _loggedInUser: function (event, user) {
    console.info("_loggedInUser");
    if (user) {
      this.set('loggedInUser', user);
      if (!this.loadingStartedLoggedIn) {
        this.loadingStartedLoggedIn = true;
        this.importHref(this.resolveUrl("yp-dialog-container-logged-in.html"), function () {
          console.info("Have loaded logged-in container");
        }, null, true);
      } else {
        console.error("Trying to load logged in twice");
      }
    }
  },

  _gotAdminRights: function (event, detail) {
    console.info("_gotAdminRights");
    if (detail && detail>0) {
      this.set('gotAdminRights', true);
      if (!this.loadingStartedAdmin) {
        this.loadingStartedAdmin = true;
        this.importHref(this.resolveUrl("yp-dialog-container-admin.html"), function () {
          console.info("Have loaded admin container");
        }, null, true);
      } else {
        console.error("Trying to load logged in twice");
      }
    }
  },

  _openBulkStatusUpdates: function () {
    this.importHref(this.resolveUrl("yp-dialog-container-bulk-status-updates.html"), function () {
      console.info("Have loaded bulk status container");
    }, null, true);
    this.set('bulkStatusUpdates', true);
  },

  closeDialog: function (idName) {
    var element = this.$$("#"+idName);
    if (element) {
      console.info("Closing dialog: "+idName);
      element.close();
    } else {
      console.error("Did not find dialog to close: "+idName);
    }
  },

  dialogClosed: function  (detail) {
    if (detail.name===this.selectedDialog) {
      this.set('selectedDialog', 'none');
      console.log("Setting selectedDialog to none");
    }
  },

  getDialogAsync: function (idName, callback) {
    this.set('hideDialogs', false);
    this.set('selectedDialog', idName);
    this.async(function () {
      var element = this.$$("#"+idName);
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
  },

  _forgotPassword: function () {
    this.getDialogAsync("forgotPassword", function (dialog) {
      dialog.open()
    });
  }
});
