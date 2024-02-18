var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { YpBaseElement } from '../common/yp-base-element.js';
import '@material/web/dialog/dialog.js';
import '../yp-app/yp-snackbar.js';
import '../yp-magic-text/yp-magic-text-dialog.js';
import '../yp-user/yp-login.js';
import '../yp-user/yp-user-edit.js';
import './yp-confirmation-dialog.js';
import '../yp-api-action-dialog/yp-api-action-dialog.js';
import "../yp-user/yp-missing-email.js";
import "../yp-user/yp-registration-questions-dialog.js";
import "../yp-user/yp-forgot-password.js";
import "../yp-user/yp-reset-password.js";
//import '../yp-user/yp-accept-invite.js';
//import './yp-autotranslate-dialog.js';
import "../yp-post/yp-post-edit.js";
import "../yp-page/yp-page-dialog.js";
let YpAppDialogs = class YpAppDialogs extends YpBaseElement {
    static get styles() {
        return [
            super.styles,
            css `
        #dialogs[hide] {
          display: none;
        }

        .trackingInfo,
        #pixelTrackingCookieConfirm {
          color: var(--md-sys-color-primary-on-container);
          background-color: var(--md-sys-color-primary-container);
        }

        .trackingInfo {
          margin-bottom: 16px;
          font-size: 16px;
        }

        md-text-button {
          margin-right: 12px;
          text-align: center;
        }
      `,
        ];
    }
    renderSelectedDialog() {
        let selectedDialog = nothing;
        switch (this.selectedDialog) {
            case 'userLogin':
                selectedDialog = html `
          <yp-login
            id="userLogin"
            @yp-forgot-password="${this._forgotPassword}"></yp-login>
        `;
                break;
            case 'forgotPassword':
                selectedDialog = html `
          <yp-forgot-password id="forgotPassword"></yp-forgot-password>
        `;
                break;
            case 'resetPassword':
                selectedDialog = html `
          <yp-reset-password id="resetPassword"></yp-reset-password>
        `;
                break;
            case 'ratings':
                selectedDialog = html `
          <yp-dialog-ratings id="ratings"></yp-dialog-ratings>
        `;
                break;
            case 'acceptInvite':
                selectedDialog = html `
          <yp-accept-invite id="acceptInvite"></yp-accept-invite>
        `;
                break;
            case 'emojiDialog':
                selectedDialog = html `
          <yp-emoji-dialog id="emojiDialog"></yp-emoji-dialog>
        `;
                break;
            case 'missingEmail':
                selectedDialog = html `
          <yp-missing-email id="missingEmail"></yp-missing-email>
        `;
                break;
            case 'postEdit':
                selectedDialog = html ` <yp-post-edit id="postEdit"></yp-post-edit> `;
                break;
            case 'userImageEdit':
                selectedDialog = html `
          <yp-post-user-image-edit id="userImageEdit"></yp-post-user-image-edit>
        `;
                break;
            case 'userEdit':
                selectedDialog = html `
          <yp-user-edit id="userEdit" method="PUT"></yp-user-edit>
        `;
                break;
            case 'shareDialog':
                selectedDialog = html `
          <yp-share-dialog id="shareDialog"></yp-share-dialog>
        `;
                break;
            case 'userDeleteOrAnonymize':
                selectedDialog = html `
          <yp-user-delete-or-anonymize
            id="userDeleteOrAnonymize"></yp-user-delete-or-anonymize>
        `;
                break;
        }
        return selectedDialog;
    }
    render() {
        return html `
      ${this.hasLoggedInUser
            ? html `
            <ac-notification-toast
              id="notificationToast"></ac-notification-toast>
          `
            : nothing}
      ${this.needsPixelCookieConfirm
            ? html `
            <yp-snackbar
              id="pixelTrackingCookieConfirm"
              .labelText="${this.t('facebookTrackingToastInfo')}"
              timeoutMs="-1">
              <md-text-button
                raised
                slot="dismiss"
                @click="${this._disableFaceookPixelTracking}"
                .label="${this.t('disableFacebookTracking')}"></md-text-button>
              <md-text-button
                raised
                slot="action"
                @click="${this._agreeToFacebookPixelTracking}"
                .label="${this.t('iAgree')}"></md-text-button>
            </yp-snackbar>
          `
            : nothing}

      ${this.apiActionDialogOpen
            ? html `
            <yp-api-action-dialog
              id="apiActionDialog"
              @close="${this._closeActionDialog}"
            ></yp-api-action-dialog>
          `
            : nothing}

      ${this.pageDialogOpen
            ? html ` <yp-page-dialog id="pageDialog"></yp-page-dialog> `
            : nothing}

      ${this.registrationQuestionsOpen
            ? html `
            <yp-registration-questions-dialog
              id="registrationQuestions"
              @close="${this._closeRegistrationQuestionsDialog}"
            ></yp-registration-questions-dialog>
          `
            : nothing}

      <yp-snackbar id="masterToast"></yp-snackbar>

      ${this.renderSelectedDialog()}

      ${this.magicTextDialogOpen
            ? html `
            <yp-magic-text-dialog id="magicTextDialog"></yp-magic-text-dialog>
          `
            : nothing}
      ${this.confirmationDialogOpen
            ? html `
            <yp-confirmation-dialog
              id="confirmationDialog"></yp-confirmation-dialog>
          `
            : nothing}
      ${this.autoTranslateDialogOpen
            ? html `
            <yp-autotranslate-dialog
              id="autoTranslateDialog"></yp-autotranslate-dialog>
          `
            : nothing}
      ${this.mediaRecorderOpen
            ? html ` <yp-media-recorder id="mediaRecorder"></yp-media-recorder> `
            : nothing}

      ${this.loadingDialogOpen
            ? html `
            <md-dialog id="loadingDialog">
              <md-linear-progress indeterminate slot="content"></md-linear-progress>
            </md-dialog>
          `
            : nothing}
    `;
    }
    constructor() {
        super();
        this.confirmationDialogOpen = false;
        this.pageDialogOpen = false;
        this.magicTextDialogOpen = false;
        this.mediaRecorderOpen = false;
        this.loadingDialogOpen = false;
        this.needsPixelCookieConfirm = false;
        this.apiActionDialogOpen = false;
        this.registrationQuestionsOpen = false;
        this.autoTranslateDialogOpen = false;
        this.hasLoggedInUser = false;
        this.haveLoadedDelayed = false;
        this.gotRatingsDialog = false;
        this.gotMediaRecorder = false;
        this.loadingStartedLoggedIn = false;
        this.haveLoadedDataViz = false;
        this.waitForUpgradeCounter = 0;
        this.addGlobalListener('yp-logged-in-user', this._loggedInUser.bind(this));
    }
    connectedCallback() {
        super.connectedCallback();
        this.fire('yp-app-dialogs-ready', this);
        setTimeout(() => {
            import('./yp-dialog-container-delayed.js').then(() => {
                this.haveLoadedDelayed = true;
            });
        }, 3000);
        setTimeout(() => {
            import('./yp-dialog-container-short-delay.js').then(() => {
                this.haveLoadedDelayed = true;
            });
        }, 1000);
    }
    async openPixelCookieConfirm(facebookPixelTrackingId) {
        this.facebookPixelTrackingId = facebookPixelTrackingId;
        this.needsPixelCookieConfirm = true;
        await this.requestUpdate();
        this.$$('#pixelTrackingCookieConfirm').open = true;
    }
    _disableFaceookPixelTracking() {
        localStorage.setItem('disableFacebookPixelTracking', 'true');
        this.$$('#pixelTrackingCookieConfirm').open = false;
    }
    _agreeToFacebookPixelTracking() {
        localStorage.setItem('consentGivenForFacebookPixelTracking', 'true');
        if (this.facebookPixelTrackingId)
            window.appGlobals.analytics.setCommunityPixelTracker(this.facebookPixelTrackingId);
        this.$$('#pixelTrackingCookieConfirm').open = false;
    }
    _loggedInUser(event) {
        const user = event.detail;
        if (user) {
            this.hasLoggedInUser = true;
            if (!this.loadingStartedLoggedIn) {
                this.loadingStartedLoggedIn = true;
                import('./yp-dialog-container-logged-in.js').then(() => {
                    console.info('Have loaded logged-in container');
                });
            }
            else {
                console.warn('Trying to load logged in twice, see appUser potentially removing that second event');
            }
        }
    }
    closeDialog(idName) {
        const element = this.$$('#' + idName);
        if (element) {
            element.open = false;
        }
        else {
            console.error('Did not find dialog to close: ' + idName);
        }
    }
    dialogClosed(event) {
        if (event.detail.name === this.selectedDialog) {
            this.selectedDialog = undefined;
        }
    }
    _closeActionDialog() {
        this.apiActionDialogOpen = false;
    }
    _closeRegistrationQuestionsDialog() {
        this.registrationQuestionsOpen = false;
    }
    loadDataViz() {
        if (!this.haveLoadedDataViz) {
            this.haveLoadedDataViz = true;
            import('./yp-dialog-container-data-viz.js').then(async () => { });
        }
    }
    async openLoadingDialog() {
        this.loadingDialogOpen = true;
        await this.requestUpdate();
        this.$$("#loadingDialog").show();
    }
    async closeLoadingDialog() {
        this.$$("#loadingDialog").close();
        this.loadingDialogOpen = true;
    }
    async getRatingsDialogAsync(callback) {
        if (this.gotRatingsDialog) {
            this.getDialogAsync('ratings', callback);
        }
        else {
            this.openLoadingDialog();
            /* TODO: Implement
            import('../yp-rating/yp-dialog-ratings.html').then(async () => {
              this.closeLoadingDialog();
              console.info('Have loaded ratings dialog');
              this.gotRatingsDialog = true;
              await this.requestUpdate();
              this.getDialogAsync('ratings', callback);
            });
            */
        }
    }
    getMediaRecorderAsync(callback) {
        if (this.gotMediaRecorder) {
            this.getDialogAsync('mediaRecorder', callback);
        }
        else {
            this.openLoadingDialog();
            import('../yp-media-recorder/yp-media-recorder.js').then(async () => {
                this.closeLoadingDialog();
                console.info('Have loaded media recorder container');
                this.gotMediaRecorder = true;
                this.mediaRecorderOpen = true;
                await this.requestUpdate();
                this.getDialogAsync('mediaRecorder', callback);
            });
        }
    }
    //TODO: Figure out how to bind to close of dialogs to remove from DOM when not open
    async getDialogAsync(idName, callback) {
        if (idName === 'pageDialog') {
            this.pageDialogOpen = true;
        }
        else if (idName === 'confirmationDialog') {
            this.confirmationDialogOpen = true;
        }
        else if (idName === 'autoTranslateDialog') {
            this.autoTranslateDialogOpen = true;
        }
        else if (idName === "apiActionDialog") {
            this.apiActionDialogOpen = true;
        }
        else if (idName === "registrationQuestions") {
            this.registrationQuestionsOpen = true;
        }
        else if (idName === 'magicTextDialog') {
            this.magicTextDialogOpen = true;
        }
        else if (idName !== 'notificationToast' && idName !== 'masterToast' && idName !== 'mediaRecorder') {
            this.pageDialogOpen = false;
            this.confirmationDialogOpen = false;
            this.autoTranslateDialogOpen = false;
            this.selectedDialog = idName;
        }
        await this.requestUpdate();
        const element = this.$$('#' + idName);
        if (element && typeof element.connectedCallback === 'function') {
            this.waitForUpgradeCounter = 0;
            callback(element);
        }
        else {
            this.waitForUpgradeCounter += 1;
            if (this.waitForUpgradeCounter > 100) {
                console.error('Element not upgraded after wait: ' + idName);
            }
            setTimeout(() => {
                this.getDialogAsync(idName, callback);
            }, this.waitForUpgradeCounter > 100 ? 1000 : 250);
        }
    }
    _forgotPassword() {
        this.getDialogAsync('forgotPassword', (dialog) => {
            dialog.open = true;
        });
    }
};
__decorate([
    property({ type: String })
], YpAppDialogs.prototype, "selectedDialog", void 0);
__decorate([
    property({ type: Boolean })
], YpAppDialogs.prototype, "confirmationDialogOpen", void 0);
__decorate([
    property({ type: Boolean })
], YpAppDialogs.prototype, "pageDialogOpen", void 0);
__decorate([
    property({ type: Boolean })
], YpAppDialogs.prototype, "magicTextDialogOpen", void 0);
__decorate([
    property({ type: Boolean })
], YpAppDialogs.prototype, "mediaRecorderOpen", void 0);
__decorate([
    property({ type: Boolean })
], YpAppDialogs.prototype, "loadingDialogOpen", void 0);
__decorate([
    property({ type: Boolean })
], YpAppDialogs.prototype, "needsPixelCookieConfirm", void 0);
__decorate([
    property({ type: Boolean })
], YpAppDialogs.prototype, "apiActionDialogOpen", void 0);
__decorate([
    property({ type: Boolean })
], YpAppDialogs.prototype, "registrationQuestionsOpen", void 0);
__decorate([
    property({ type: Boolean })
], YpAppDialogs.prototype, "autoTranslateDialogOpen", void 0);
__decorate([
    property({ type: Boolean })
], YpAppDialogs.prototype, "hasLoggedInUser", void 0);
YpAppDialogs = __decorate([
    customElement('yp-app-dialogs')
], YpAppDialogs);
export { YpAppDialogs };
//# sourceMappingURL=yp-app-dialogs.js.map