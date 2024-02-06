var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";
import "@material/web/button/text-button.js";
import "@material/web/textfield/outlined-text-field.js";
import "../ac-notifications/ac-notification-settings.js";
import "../yp-file-upload/yp-file-upload.js";
import "../common/languages/yp-language-selector.js";
import { YpEditBase } from "../common/yp-edit-base.js";
let YpUserEdit = class YpUserEdit extends YpEditBase {
    constructor() {
        super(...arguments);
        this.action = "/users";
        this.selected = 0;
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("user")) {
            this._userChanged();
        }
        if (changedProperties.has("notificationSettings")) {
            this._notificationSettingsChanged();
        }
    }
    static get styles() {
        return [
            super.styles,
            css `
        .container {
          height: 100%;
          min-height: 350px;
        }

        .additionalSettings {
          margin-top: 16px;
        }

        .icon {
          padding-right: 8px;
        }

        h2 {
          padding-top: 16px;
        }

        #deleteUser {
          max-width: 250px;
          margin-top: 16px;
        }

        .disconnectButtons {
          margin-top: 8px;
          max-width: 250px;
        }

        yp-language-selector {
          margin-bottom: 8px;
        }

        md-text-button {
          text-align: center;
        }

        .ssn {
          margin-top: 0;
          margin-bottom: 4px;
          font-weight: 400;
        }

        [hidden] {
          display: none !important;
        }

        .tempApiKeyContainer {
          margin-top: 16px;
          margin-bottom: 16px;
          padding-bottom: 8px;
          padding-top: 8px;
        }

        .temporaryApiKeyInformation {
          color: var(--md-sys-color-on-error-container);
          background-color: var(--md-sys-color-error-container);
          font-size: 16px;
          margin-bottom: 8px;
        }

        .apiKey {
          font-size: 16px;
          padding-right: 8px;
          padding-top: 12px;
          font-weight: bold;
        }
      `,
        ];
    }
    render() {
        return this.user
            ? html `
          <yp-edit-dialog
            name="userEdit"
            id="editDialog"
            .title="${this.editHeaderText}"
            doubleWidth
            icon="face"
            .action="${this.action}"
            @iron-form-response="${this._editResponse}"
            method="${this.method}"
            .params="${this.params}"
            .saveText="${this.saveText}"
            .snackbarText="${this.snackbarText || ""}"
          >
            <div class="container">
              <div class="layout vertical wrap container">
                <md-outlined-text-field
                  id="name"
                  name="name"
                  type="text"
                  .label="${this.t("Name")}"
                  .value="${this.user.name}"
                  maxlength="50"
                  char-counter
                >
                </md-outlined-text-field>

                <div class="ssn" ?hidden="${!this.user.ssn}">
                  ${this.t("ssn")}: ${this.user.ssn}
                </div>

                <md-outlined-text-field
                  id="email"
                  name="email"
                  type="text"
                  .label="${this.t("Email")}"
                  .value="${this.user.email || ""}"
                >
                </md-outlined-text-field>

                <div class="layout horizontal wrap">
                  <div class="layout vertical additionalSettings">
                    <yp-file-upload
                      id="profileImageUpload"
                      raised
                      target="/api/images?itemType=user-profile"
                      method="POST"
                      buttonIcon="photo_camera"
                      .buttonText="${this.t("image.profile.upload")}"
                      @success="${this._profileImageUploaded}"
                    >
                    </yp-file-upload>
                  </div>

                  <div class="layout vertical additionalSettings" hidden="">
                    <yp-file-upload
                      id="headerImageUpload"
                      raised
                      target="/api/images?itemType=user-header"
                      method="POST"
                      buttonIcon="photo_camera"
                      .buttonText="${this.t("image.header.upload")}"
                      @success="${this._headerImageUploaded}"
                    >
                    </yp-file-upload>
                  </div>
                </div>

                <yp-language-selector
                  name="defaultLocale"
                  auto-translate-option-disabled=""
                  .selectedLocale="${this.user.default_locale}"
                ></yp-language-selector>

                <md-text-button
                  ?hidden="${this.user.profile_data?.hasApiKey}"
                  raised

                  class="disconnectButtons"
                  @click="${this._createApiKey}"
                >${this.t("createApiKey")}</md-text-button>

                <md-text-button
                  ?hidden="${!this.user.profile_data?.hasApiKey}"

                  class="disconnectButtons"
                  @click="${this._reCreateApiKey}"
                >${this.t("reCreateApiKey")}</md-text-button>

                <div
                  class="layout vertical tempApiKeyContainer"
                  ?hidden="${!this.currentApiKey}"
                >
                  <div class="temporaryApiKeyInformation">
                    ${this.t("showingApiKeyOnce")}
                  </div>
                  <div class="layout horizontal">
                    <div class="apiKey">${this.currentApiKey}</div>
                    <md-text-button

                      @click="${this._copyApiKey}"
                    >${this.t("copyApiKey")}</md-text-button>
                  </div>
                </div>

                <md-text-button
                  ?hidden="${!this.user.facebook_id}"
                  class="disconnectButtons"

                  @click="${this._disconnectFromFacebookLogin}"
                >${this.t("disconnectFromFacebookLogin")}</md-text-button>

                <md-text-button
                  ?hidden="${!this.user.ssn}"

                  class="disconnectButtons"
                  @click="${this._disconnectFromSamlLogin}"
                >${this.t("disconnectFromSamlLogin")}</md-text-button>

                <md-text-button
                  id="deleteUser"

                  @click="${this._deleteOrAnonymizeUser}"
                >${this.t("deleteOrAnonymizeUser")}</md-text-button>


                ${this.uploadedProfileImageId ? html `
                <input
                  type="hidden"
                  name="uploadedProfileImageId"
                  .value="${this.uploadedProfileImageId}"
                />
                ` : nothing}


                ${this.uploadedHeaderImageId ? html `
                <input
                  type="hidden"
                  name="uploadedHeaderImageId"
                  .value="${this.uploadedHeaderImageId}"
                />
                ` : nothing}


                <h2>${this.t("user.notifications")}</h2>

                <ac-notification-settings
                  .notificationsSettings="${this.notificationSettings}"
                ></ac-notification-settings>

                <input
                  type="hidden"
                  name="notifications_settings"
                  .value="${this.encodedUserNotificationSettings || ""}"
                />
              </div>
            </div>
          </yp-edit-dialog>
        `
            : nothing;
    }
    connectedCallback() {
        super.connectedCallback();
        this.addListener("yp-notifications-changed", this._setNotificationSettings.bind(this));
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeListener("yp-notifications-changed", this._setNotificationSettings.bind(this));
    }
    _editResponse(event) {
        if (event.detail.response.duplicateEmail) {
            this.fire("yp-error", this.t("emailAlreadyRegisterred"));
        }
    }
    _checkIfValidEmail() {
        return (this.user &&
            this.user.email &&
            !(this.user.email.indexOf("@citizens.is") > -1 &&
                this.user.email.indexOf("anonymous") > -1));
    }
    _disconnectFromFacebookLogin() {
        if (this._checkIfValidEmail()) {
            window.appDialogs.getDialogAsync("confirmationDialog", (dialog) => {
                dialog.open(this.t("areYouSureYouWantToDisconnectFacebookLogin"), this._reallyDisconnectFromFacebookLogin.bind(this), true);
            });
        }
        else {
            this.fire("yp-error", this.t("cantDisconnectFromFacebookWithoutValidEmail"));
        }
    }
    async _reallyDisconnectFromFacebookLogin() {
        await window.serverApi.disconnectFacebookLogin();
        this.user.facebook_id = undefined;
        window.appGlobals.notifyUserViaToast(this.t("disconnectedFacebookLoginFor") + " " + this.user.email);
    }
    _disconnectFromSamlLogin() {
        if (this._checkIfValidEmail()) {
            window.appDialogs.getDialogAsync("confirmationDialog", (dialog) => {
                dialog.open(this.t("areYouSureYouWantToDisconnectSamlLogin"), this._reallyDisconnectFromSamlLogin.bind(this), true);
            });
        }
        else {
            this.fire("yp-error", this.t("cantDisconnectFromSamlWithoutValidEmail"));
        }
    }
    async _reallyDisconnectFromSamlLogin() {
        await window.serverApi.disconnectSamlLogin();
        if (this.user)
            this.user.ssn = undefined;
        window.appGlobals.notifyUserViaToast(this.t("disconnectedSamlLoginFor") + " " + this.user.email);
    }
    _setNotificationSettings(event) {
        this.notificationSettings = event.detail;
        this.encodedUserNotificationSettings = this._encodeNotificationsSettings(this.notificationSettings);
    }
    _notificationSettingsChanged() {
        if (this.notificationSettings) {
            this.encodedUserNotificationSettings = this._encodeNotificationsSettings(this.notificationSettings);
        }
    }
    _encodeNotificationsSettings(settings) {
        if (settings) {
            return JSON.stringify(settings);
        }
        else {
            return undefined;
        }
    }
    _userChanged() {
        if (this.user) {
            this.notificationSettings = this.user.notifications_settings;
        }
    }
    _profileImageUploaded(event) {
        const image = JSON.parse(event.detail.xhr.response);
        this.uploadedProfileImageId = image.id;
    }
    _headerImageUploaded(event) {
        const image = JSON.parse(event.detail.xhr.response);
        this.uploadedHeaderImageId = image.id;
    }
    customRedirect() {
        window.appUser.checkLogin();
    }
    clear() {
        this.user = { name: "", email: "" };
        this.uploadedProfileImageId = undefined;
        this.uploadedHeaderImageId = undefined;
        this.$$("#headerImageUpload").clear();
        this.$$("#profileImageUpload").clear();
    }
    _copyApiKey() {
        navigator.clipboard.writeText(this.currentApiKey);
    }
    async _createApiKey() {
        window.appGlobals.activity("open", "user.createApiKey");
        const response = (await window.serverApi.createApiKey());
        this.currentApiKey = response.apiKey;
        this.user.profile_data.hasApiKey = true;
    }
    _reCreateApiKey() {
        window.appGlobals.activity("open", "user.reCreateApiKey");
        window.appDialogs.getDialogAsync("apiActionDialog", (dialog) => {
            dialog.setup("/api/users/createApiKey", this.t("areYouSureYouWantToRecreateApiKey"), this._createApiKey.bind(this), this.t("recreate"), "POST");
            dialog.open();
        });
    }
    setup(user, newNotEdit, refreshFunction, openNotificationTab = false) {
        this.user = user;
        this.new = newNotEdit;
        this.refreshFunction = refreshFunction;
        if (openNotificationTab) {
            this.selected = 1;
        }
        this.setupTranslation();
    }
    setupTranslation() {
        if (this.new) {
            this.editHeaderText = this.t("user.new");
            this.snackbarText = this.t("userToastCreated");
            this.saveText = this.t("create");
        }
        else {
            this.saveText = this.t("save");
            this.editHeaderText = this.t("user.edit");
            this.snackbarText = this.t("userToastUpdated");
        }
    }
    _deleteOrAnonymizeUser() {
        window.appDialogs.getDialogAsync("userDeleteOrAnonymize", (dialog) => {
            dialog.open();
        });
    }
};
__decorate([
    property({ type: String })
], YpUserEdit.prototype, "action", void 0);
__decorate([
    property({ type: Object })
], YpUserEdit.prototype, "user", void 0);
__decorate([
    property({ type: Number })
], YpUserEdit.prototype, "selected", void 0);
__decorate([
    property({ type: String })
], YpUserEdit.prototype, "encodedUserNotificationSettings", void 0);
__decorate([
    property({ type: String })
], YpUserEdit.prototype, "currentApiKey", void 0);
__decorate([
    property({ type: Number })
], YpUserEdit.prototype, "uploadedProfileImageId", void 0);
__decorate([
    property({ type: Number })
], YpUserEdit.prototype, "uploadedHeaderImageId", void 0);
__decorate([
    property({ type: Object })
], YpUserEdit.prototype, "notificationSettings", void 0);
YpUserEdit = __decorate([
    customElement("yp-user-edit")
], YpUserEdit);
export { YpUserEdit };
//# sourceMappingURL=yp-user-edit.js.map