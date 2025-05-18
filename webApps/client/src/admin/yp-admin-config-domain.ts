import { LitElement, css, html, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";

import { Layouts } from "lit-flexbox-literals";
//import { YpBaseWithLogin } from './@yrpri/common/yp-base-element-with-login.js';
import { YpAdminPage } from "./yp-admin-page.js";

import "../yp-survey/yp-structured-question-edit.js";
import "../yp-file-upload/yp-file-upload.js";

import {
  YpAdminConfigBase,
  defaultLtpConfiguration,
  defaultLtpPromptsConfiguration,
} from "./yp-admin-config-base.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
import { YpFileUpload } from "../yp-file-upload/yp-file-upload.js";
//import { YpEmojiSelector } from './@yrpri/common/yp-emoji-selector.js';
//import './@yrpri/common/yp-emoji-selector.js';

import "../yp-file-upload/yp-file-upload.js";
import "../yp-theme/yp-theme-selector.js";
import "../common/languages/yp-language-selector.js";

import "./yp-admin-communities.js";
import { YpMediaHelpers } from "../common/YpMediaHelpers.js";
import { Corner } from "@material/web/menu/menu.js";

@customElement("yp-admin-config-domain")
export class YpAdminConfigDomain extends YpAdminConfigBase {
  @property({ type: Number })
  appHomeScreenIconImageId: number | undefined;

  constructor() {
    super();
    this.action = "/domains";
  }

  static override get styles() {
    return [
      super.styles,
      css`
        .accessHeader {
          font-weight: bold;
          margin: 8px;
        }

        label {
          padding: 8px;
        }

        .actionButtonContainer {
          margin-left: 16px;
          margin-top: 16px;
        }

        md-radio {
          margin-right: 4px;
        }
      `,
    ];
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
    return html`
      ${(this.collection?.configuration as YpDomainConfiguration).ltp
        ? html`
            <input
              type="hidden"
              name="ltp"
              value="${JSON.stringify(
                (this.collection?.configuration as YpDomainConfiguration).ltp
              )}"
            />
          `
        : nothing}
      ${this.collection?.configuration.theme
        ? html`
            <input
              type="hidden"
              name="theme"
              value="${JSON.stringify(this.collection?.configuration.theme)}"
            />
          `
        : nothing}
    `;
  }

  override _clear() {
    super._clear();
    this.appHomeScreenIconImageId = undefined;
  }

  override updated(
    changedProperties: Map<string | number | symbol, unknown>
  ): void {
    if (changedProperties.has("collection") && this.collection) {
      this.currentLogoImages = (
        this.collection as YpDomainData
      ).DomainLogoImages;

      this.currentHeaderImages = (
        this.collection as YpDomainData
      ).DomainHeaderImages;

      this._setupTranslations();
      //this._updateEmojiBindings();

      if (!(this.collection.configuration as YpDomainConfiguration).ltp) {
        (this.collection.configuration as YpDomainConfiguration).ltp =
          defaultLtpConfiguration;
      } else if (
        !(this.collection.configuration as YpDomainConfiguration).ltp!.crt!
          .prompts
      ) {
        (
          this.collection.configuration as YpDomainConfiguration
        ).ltp!.crt!.prompts = defaultLtpPromptsConfiguration();
      }

      if (
        (this.collection as YpDomainData).DomainLogoVideos &&
        (this.collection as YpDomainData).DomainLogoVideos!.length > 0
      ) {
        this.uploadedVideoId = (
          this.collection as YpDomainData
        ).DomainLogoVideos![0].id;
      }
    }

    if (changedProperties.has("collectionId") && this.collectionId) {
      this._collectionIdChanged();
    }

    super.updated(changedProperties);
  }

  _collectionIdChanged() {
    if (this.collectionId == "new" || this.collectionId == "newFolder") {
      this.action = `/domains/${this.parentCollectionId}`;
      this.collection = {
        id: -1,
        name: "",
        description: "",
        counter_points: 0,
        counter_posts: 0,
        counter_users: 0,
        access: 2,
        default_locale: "en",
        configuration: {
          useLoginOnDomainIfNotLoggedIn: true,
          disableArrowBasedTopNavigation: true,
          useFixedTopAppBar: true,
        } as YpDomainConfiguration,
      } as YpDomainData;

      if (this.parentCollection && this.parentCollection.configuration.theme) {
        this.collection.configuration.theme =
          this.parentCollection.configuration.theme;
      }
    } else {
      this.action = `/domains/${this.collectionId}`;
    }
  }

  _setupTranslations() {
    if (window.location.href.includes("organization")) {
      if (this.collectionId == "new") {
        this.editHeaderText = this.t("newOrganization");
        this.toastText = this.t("organizationToastCreated");
        this.saveText = this.t("create");
      } else {
        this.saveText = this.t("save");
        this.editHeaderText = this.t("editOrganization");
        this.toastText = this.t("organizationToastUpdated");
      }
    } else {
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
  }

  override async _formResponse(event: CustomEvent) {
    super._formResponse(event);
    const domain = event.detail;
    if (domain) {
      if (this.uploadedVideoId && this.connectedVideoToCollection) {
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
    if (this.collectionId == "new") {
      window.appUser.recheckAdminRights();
      window.appGlobals.setupMyDomains();
    }
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
          text: "status",
          type: "html",
          templateData: html`
            <div class="layout vertical accessContainer">
              <div class="accessHeader">${this.t("access")}</div>
              <label>
                <md-radio
                  @change="${this._configChanged}"
                  value="0"
                  ?checked="${(this.collection as YpDomainData).access == 0}"
                  name="access"
                ></md-radio>
                ${this.t("public")}
              </label>
              <label>
                <md-radio
                  @change="${this._configChanged}"
                  ?checked="${(this.collection as YpDomainData).access == 2}"
                  value="2"
                  name="access"
                ></md-radio>
                ${this.t("private")}
              </label>
            </div>
          `,
        },
        {
          text: "themeSelector",
          type: "html",
          templateData: html`
            <yp-theme-selector
              @config-updated="${this._configChanged}"
              ?hasLogoImage="${this.imagePreviewUrl ||
              YpMediaHelpers.getImageFormatUrl(this.currentLogoImages)}"
              @get-color-from-logo="${this.getColorFromLogo}"
              @yp-theme-configuration-changed="${this._themeChanged}"
              .themeConfiguration="${this.collection!.configuration.theme!}"
            ></yp-theme-selector>
          `,
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
          text: "hideAllTabs",
          type: "checkbox",
        },
        {
          text: "showItemCount",
          type: "checkbox",
          value: this.collection?.configuration.showItemCount,
          translationToken: "showItemCount",
        },
        {
          text: "hideDomainNews",
          type: "checkbox",
        },
        {
          text: "onlyAllowCreateUserOnInvite",
          type: "checkbox",
        },
        {
          text: "useFixedTopAppBar",
          type: "checkbox",
        },
        {
          text: "disableArrowBasedTopNavigation",
          type: "checkbox",
        },
        {
          text: "useLoginOnDomainIfNotLoggedIn",
          type: "checkbox",
        },
        {
          text: "welcomeHtmlInsteadOfCommunitiesList",
          type: "textarea",
          rows: 5,
        },
        {
          text: "hideAppBarIfWelcomeHtml",
          type: "checkbox",
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
