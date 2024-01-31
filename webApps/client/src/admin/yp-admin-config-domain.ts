import { LitElement, css, html, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";

import { Layouts } from "lit-flexbox-literals";
//import { YpBaseWithLogin } from './@yrpri/common/yp-base-element-with-login.js';
import { YpAdminPage } from "./yp-admin-page.js";

import "../yp-survey/yp-structured-question-edit.js";

import { YpAdminConfigBase, defaultLtpConfiguration, defaultLtpPromptsConfiguration } from "./yp-admin-config-base.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
import { YpFileUpload } from "../yp-file-upload/yp-file-upload.js";
//import { YpEmojiSelector } from './@yrpri/common/yp-emoji-selector.js';
//import './@yrpri/common/yp-emoji-selector.js';

import "../yp-file-upload/yp-file-upload.js";
//import './@yrpri/yp-theme/yp-theme-selector.js';
import "../yp-app/yp-language-selector.js";

import "./yp-admin-communities.js";

@customElement("yp-admin-config-domain")
export class YpAdminConfigDomain extends YpAdminConfigBase {
  @property({ type: Number })
  appHomeScreenIconImageId: number | undefined;

  constructor() {
    super();
    this.action = "/domains";
  }

  static override get styles() {
    return [super.styles, css``];
  }

  renderHeader() {
    return this.collection
      ? html`
          <div class="layout horizontal topInputContainer">
            ${this.renderLogoMedia()}
            <div class="layout horizontal wrap">
              ${this.renderNameAndDescription()}
              <div>${this.renderSaveButton()}</div>
            </div>
          </div>

          <input
            type="hidden"
            name="appHomeScreenIconImageId"
            value="${this.appHomeScreenIconImageId?.toString() || ""}"
          />
        `
      : nothing;
  }

  renderHiddenInputs() {
    if ((this.collection?.configuration as YpDomainConfiguration).ltp) {
      return html`
        <input
          type="hidden"
          name="ltp"
          value="${JSON.stringify(
            (this.collection?.configuration as YpDomainConfiguration).ltp
          )}"
        />
      `;
    } else {
      return nothing;
    }
  }

  override _clear() {
    super._clear();
    this.appHomeScreenIconImageId = undefined;
  }

  override updated(
    changedProperties: Map<string | number | symbol, unknown>
  ): void {
    super.updated(changedProperties);

    if (changedProperties.has("collection") && this.collection) {
      this._setupTranslations();
      //this._updateEmojiBindings();

      if (!(this.collection.configuration as YpDomainConfiguration).ltp) {
        (this.collection.configuration as YpDomainConfiguration).ltp =
          defaultLtpConfiguration;
      } else if (!(this.collection.configuration as YpDomainConfiguration).ltp!.crt!.prompts) {
        (this.collection.configuration as YpDomainConfiguration).ltp!.crt!.prompts =
          defaultLtpPromptsConfiguration();
      }

      if (
        (this.collection as YpDomainData).DomainLogoVideos &&
        (this.collection as YpDomainData).DomainLogoVideos!.length > 0
      ) {
        this.uploadedVideoId = (
          this.collection as YpDomainData
        ).DomainLogoVideos![0].id;
      }

      this.currentLogoImages = (
        this.collection as YpDomainData
      ).DomainLogoImages;
    }

    if (changedProperties.has("collectionId") && this.collectionId) {
      if (this.collectionId == "new") {
        this.action = "/domains";
      } else {
        this.action = `/domains/${this.collectionId}`;
      }
    }
  }

  _setupTranslations() {
    if (this.collectionId == "new") {
      this.editHeaderText = this.t("domain.new");
      this.toastText = this.t("domainToastCreated");
      this.saveText = this.t("create");
    } else {
      this.saveText = this.t("save");
      this.editHeaderText = this.t("domain.edit");
      this.toastText = this.t("domainToastUpdated");
    }
  }

  override async _formResponse(event: CustomEvent) {
    super._formResponse(event);
    const domain = event.detail;
    if (domain) {
      if (this.uploadedVideoId) {
        await window.adminServerApi.addVideoToCollection(
          domain.id,
          {
            videoId: this.uploadedVideoId,
          },
          "completeAndAddToDomain"
        );
        this._finishRedirect(domain);
      } else {
        this._finishRedirect(domain);
      }
    } else {
      console.warn("No domain found on custom redirect");
    }
  }

  _finishRedirect(domain: YpDomainData) {
    YpNavHelpers.redirectTo("/domain/" + domain.id);
    window.appGlobals.activity("completed", "editDomain");
  }

  setupConfigTabs() {
    const tabs: Array<YpConfigTabData> = [];

    tabs.push({
      name: "basic",
      icon: "code",
      items: [
        {
          text: "defaultLocale",
          type: "html",
          templateData: html`
            <yp-language-selector
              name="defaultLocale"
              noUserEvents
              @changed="${this._configChanged}"
              .selectedLocale="${this.collection!.default_locale}"
            >
            </yp-language-selector>
          `,
        },
        {
          text: "theme",
          type: "html",
          templateData: html`<yp-theme-selector
            .object="${this.collection}"
            .themeObject="${this.collection as YpThemeContainerObject}"
            .selectedTheme="${this.collection?.theme_id}"
            @yp-theme-changed="${(event: CustomEvent) => {
              this.themeId = event.detail;
              if (this.themeId) {
                this._configChanged();
              }
            }}"
          ></yp-theme-selector>`,
        },
        {
          text: "mediaUploads",
          type: "html",
          templateData: html`
            <div class="layout horizontal wrap">
              ${this.renderHeaderImageUploads()}
            </div>
          `,
        },
        {
          text: "onlyAdminsCanCreateCommunities",
          type: "checkbox",
          value: (this.collection as YpDomainData)
            .only_admins_can_create_communities,
          translationToken: "domain.onlyAdminsCanCreateCommunities",
        },
        {
          text: "hideDomainNews",
          type: "checkbox",
        },
        {
          text: "welcomeHTMLforNotLoggedInUsers",
          type: "textarea",
          rows: 5,
        },
      ],
    });

    tabs.push({
      name: "webApp",
      icon: "get_app",
      items: [
        {
          text: "appHomeScreenShortName",
          type: "textfield",
          maxLength: 12,
        },
        {
          text: "appHomeScreenIconImageUpload",
          type: "html",
          templateData: html`
            <yp-file-upload
              id="appHomeScreenIconImageUpload"
              raised
              target="/api/images?itemType=app-home-screen-icon"
              method="POST"
              buttonIcon="photo_camera"
              .buttonText="${this.t("appHomeScreenIconImageUpload")}"
              @success="${this._appHomeScreenIconImageUploaded}"
            >
            </yp-file-upload>
          `,
        },
      ],
    });

    tabs.push({
      name: "authApis",
      icon: "api",
      items: [
        {
          text: "Facebook Client Id",
          name: "facebookClientId",
          type: "textfield",
          value: this._getSaveCollectionPath(
            "secret_api_keys.facebook.client_id"
          ),
          maxLength: 60,
        },
        {
          text: "Facebook Client Secret",
          name: "facebookClientSecret",
          type: "textfield",
          value: this._getSaveCollectionPath(
            "secret_api_keys.facebook.client_secret"
          ),
          maxLength: 60,
        },
        {
          text: "Google Client Id",
          name: "googleClientId",
          type: "textfield",
          value: this._getSaveCollectionPath(
            "secret_api_keys.google.client_id"
          ),
          maxLength: 60,
        },
        {
          text: "Google Client Secret",
          name: "googleClientSecret",
          type: "textfield",
          value: this._getSaveCollectionPath(
            "secret_api_keys.google.client_secret"
          ),
          maxLength: 60,
        },
        {
          text: "Discord Client Id",
          name: "discordClientId",
          type: "textfield",
          value: this._getSaveCollectionPath(
            "secret_api_keys.discord.client_id"
          ),
          maxLength: 60,
        },
        {
          text: "Discord Client Secret",
          name: "discordClientSecret",
          type: "textfield",
          value: this._getSaveCollectionPath(
            "secret_api_keys.discord.client_secret"
          ),
          maxLength: 60,
        },
        {
          text: "Twitter Client Id",
          name: "twitterClientId",
          type: "textfield",
          value: this._getSaveCollectionPath(
            "secret_api_keys.twitter.client_id"
          ),
          maxLength: 60,
        },
        {
          text: "Twitter Client Secret",
          name: "twitterClientSecret",
          type: "textfield",
          value: this._getSaveCollectionPath(
            "secret_api_keys.twitter.client_secret"
          ),
          maxLength: 60,
        },
      ],
    });

    this.tabsPostSetup(tabs);

    return tabs;
  }

  _appHomeScreenIconImageUploaded(event: CustomEvent) {
    var image = JSON.parse(event.detail.xhr.response);
    this.appHomeScreenIconImageId = image.id;
    this._configChanged();
  }
}
