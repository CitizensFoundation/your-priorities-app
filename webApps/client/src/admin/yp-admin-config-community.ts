import { LitElement, css, html, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";

//import { YpBaseWithLogin } from './@yrpri/common/yp-base-element-with-login.js';
import { YpAdminPage } from "./yp-admin-page.js";
import "@material/web/radio/radio.js";
import { MdOutlinedSelect } from "@material/web/select/outlined-select.js";
import "@material/web/select/select-option.js";
import "@material/web/dialog/dialog.js";
import "@material/web/list/list.js";
import "@material/web/list/list-item.js";
import "@material/web/button/text-button.js";
import "@material/web/progress/circular-progress.js";

import "../yp-survey/yp-structured-question-edit.js";

import {
  YpAdminConfigBase,
  defaultLtpConfiguration,
  defaultLtpPromptsConfiguration,
} from "./yp-admin-config-base.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
import { YpFileUpload } from "../yp-file-upload/yp-file-upload.js";

//import { YpEmojiSelector } from './@yrpri/common/yp-emoji-selector.js';
//import './@yrpri/common/yp-emoji-selector.js';
import "../yp-theme/yp-theme-selector.js";

import "../yp-file-upload/yp-file-upload.js";
//import './@yrpri/yp-theme/yp-theme-selector.js';
import "../common/languages/yp-language-selector.js";
import { YpConfirmationDialog } from "../yp-dialog-container/yp-confirmation-dialog.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { TextField } from "@material/web/textfield/internal/text-field.js";
import { Radio } from "@material/web/radio/internal/radio.js";
import { YpMediaHelpers } from "../common/YpMediaHelpers.js";
import { Corner, Menu } from "@material/web/menu/menu.js";
import { YpApiActionDialog } from "../yp-api-action-dialog/yp-api-action-dialog.js";
import { Dialog } from "@material/web/dialog/internal/dialog.js";
import { MdCircularProgress } from "@material/web/progress/circular-progress.js";

@customElement("yp-admin-config-community")
export class YpAdminConfigCommunity extends YpAdminConfigBase {
  @property({ type: Number })
  appHomeScreenIconImageId: number | undefined;

  @property({ type: String })
  hostnameExample: string | undefined;

  @property({ type: Boolean })
  hasSamlLoginProvider = false;

  @property({ type: Array })
  availableCommunityFolders: Array<YpCommunityData> | undefined;

  @property({ type: Number })
  ssnLoginListDataId: number | undefined;

  @property({ type: Number })
  ssnLoginListDataCount: number | undefined;

  @property({ type: Number })
  inCommunityFolderId: number | undefined;

  @property({ type: Number })
  signupTermsPageId: number | undefined;

  @property({ type: Number })
  welcomePageId: number | undefined;

  @property({ type: String })
  communityAccess: YpCommunityAccessTypes = "public";

  @property({ type: Boolean })
  hideHostnameInput = false;

  @property({ type: Array })
  templates?: Array<YpCommunityData>;

  @property({ type: Boolean })
  cloning = false;

  @property({ type: Number })
  cloningTemplateId: number | null = null;

  constructor() {
    super();
    this.action = "/communities";
  }

  _generateRandomHostname() {
    return "c" + Math.random().toString(36).substr(2, 9);
  }

  static override get styles() {
    return [
      super.styles,
      css`
        .accessContainer {
        }

        .templatesButton {
          margin-top: 16px;
          margin-left: 16px;
        }

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

  renderHostname() {
    if (this.hideHostnameInput) {
      return html`
        <input
          type="hidden"
          name="hostname"
          value="${ifDefined((this.collection as YpCommunityData).hostname)}"
        />
      `;
    } else {
      return html`
        <div class="layout vertical">
          <md-outlined-text-field
            id="hostname"
            name="hostname"
            type="text"
            @keyup="${this._hostnameChanged}"
            label="${this.t("community.hostname")}"
            .value="${(this.collection as YpCommunityData).hostname || ""}"
            ?required="${!(this.collection as YpCommunityData)
              .is_community_folder}"
            maxlength="80"
            charCounter
            class="mainInput"
          ></md-outlined-text-field>
          <div class="hostnameInfo">https://${this.hostnameExample}</div>
        </div>
      `;
    }
  }

  renderHeader() {
    return this.collection
      ? html`
          <div class="layout horizontal wrap topInputContainer">
            ${this.renderLogoMedia()}
            <div class="layout vertical">
              ${this.renderNameAndDescription()} ${this.renderHostname()}
            </div>
            <div class="layout vertical center-center">
              ${this.renderSaveButton()}
              <md-text-button
                @click="${this._openTemplatesDialog}"
                class="templatesButton"
                ?hidden="${this.collectionId !== "new"}"
                >${this.t("templates")}</md-text-button
              >
              <div
                ?hidden="${this.collectionId == "new"}"
                class="actionButtonContainer layout horizontal center-center"
              >
                ${this.renderActionMenu()}
              </div>
              <div class="flex"></div>
            </div>
          </div>
        `
      : nothing;
  }

  renderActionMenu() {
    return html`
      <div style="position: relative;" class="layout vertical center-center">
        <md-outlined-icon-button
          .ariaLabelSelected="${this.t("actions")}"
          id="menuAnchor"
          type="button"
          @click="${() => ((this.$$("#actionMenu") as Menu).open = true)}"
          ><md-icon>menu</md-icon></md-outlined-icon-button
        >
        <md-menu
          id="actionMenu"
          positioning="popover"
          .menuCorner="${Corner.START_END}"
          anchor="menuAnchor"
        >
          <md-menu-item
            hidden
            @click="${this._menuSelection}"
            id="newCategoryMenuItem"
          >
            <div slot="headline">New Category</div>
          </md-menu-item>
          <md-menu-item @click="${this._menuSelection}" id="deleteMenuItem">
            <div slot="headline">Delete</div>
          </md-menu-item>
          <md-menu-item
            @click="${this._menuSelection}"
            id="cloneMenuItem"
            ?disabled="${this.cloning}"
          >
            <div slot="headline" class="layout horizontal center-center">
              ${this.t("cloneCommunity")}
            </div>
          </md-menu-item>
          <md-menu-item
            hidden
            @click="${this._menuSelection}"
            id="promotersMenuItem"
          >
            <div slot="headline">Promoters</div>
          </md-menu-item>
          <md-menu-item
            hidden
            @click="${this._menuSelection}"
            id="deleteContentMenuItem"
          >
            <div slot="headline">Delete Content</div>
          </md-menu-item>
          <md-menu-item
            hidden
            @click="${this._menuSelection}"
            id="anonymizeMenuItem"
          >
            <div slot="headline">Anonymize</div>
          </md-menu-item>
        </md-menu>
        ${this.cloning
          ? html`<md-circular-progress
              indeterminate
              style="--md-circular-progress-size:32px; margin-top: 12px;"
            ></md-circular-progress>`
          : nothing}
      </div>
    `;
  }

  _onDeleted() {
    this.dispatchEvent(
      new CustomEvent("yp-refresh-domain", { bubbles: true, composed: true })
    );

    YpNavHelpers.redirectTo(
      "/domain/" + (this.collection as YpCommunityData).domain_id
    );
  }

  _openDelete() {
    window.appGlobals.activity("open", "group.delete");

    window.appDialogs.getDialogAsync(
      "apiActionDialog",
      (dialog: YpApiActionDialog) => {
        dialog.setup(
          "/api/communities/" + this.collection!.id,
          this.t("communityDeleteConfirmation"),
          this._onDeleted.bind(this)
        );
        dialog.open({ finalDeleteWarning: true });
      }
    );
  }

  _menuSelection(event: CustomEvent) {
    // Log both target and currentTarget to understand the event source
    console.log("Menu selection event:", event);
    console.log("event.target:", event.target);
    console.log("event.currentTarget:", event.currentTarget);

    // Attempt to get id from currentTarget if target doesn't have it
    const targetElement = event.target as HTMLElement;
    const currentTargetElement = event.currentTarget as HTMLElement;
    const id = targetElement?.id || currentTargetElement?.id || "";

    console.log(`Menu item clicked, derived id: ${id}`); // <-- Updated log

    if (id == "deleteMenuItem") {
      this._openDelete();
    } else if (id == "cloneMenuItem") {
      console.log("Calling _openClone...");
      this._openClone();
    }
    /*switch (id) {
      case "newCategoryMenuItem":
        this._openCategoryEdit();
        break;
      case "deleteMenuItem":
        this._openDelete();
        break;
      case "cloneMenuItem":
        this._openClone();
        break;
      case "promotersMenuItem":
        this._openPromotersDialog();
        break;
      case "deleteContentMenuItem":
        this._openDeleteContent();
        break;
      case "anonymizeMenuItem":
        this._openAnonymizeContent();
        break;
      case "newGroupItem":
        this._newGroup();
        break;
      case "newGroupFolderItem":
        this._newGroupFolder();
        break;
      default:
        break;
    }
    */
  }

  async _openClone() {
    console.log("_openClone started");
    this.cloning = true;
    window.appGlobals.activity("open", "community.clone");

    try {
      // direct POST to clone endpoint (no intermediate dialog)
      const newCommunity = (await window.serverApi.apiAction(
        `/api/communities/${this.collection!.id}/clone`,
        "POST",
        {}
      )) as YpCommunityData;

      // once we have the new ID, redirect into the admin namespace
      window.appGlobals.activity("completed", "cloneCommunity");
      window.location.href = `/community/${newCommunity.id}`;
    } catch (err) {
      console.error("Clone failed", err);
      // optionally show error toast or dialog here
    } finally {
      console.log("_openClone finished");
      this.cloning = false;
    }
  }

  renderHiddenAccessSettings() {
    if (this.communityAccess) {
      return html`
        <input type="hidden" name="${this.communityAccess}" value="on" />
      `;
    } else {
      return nothing;
    }
  }

  renderHiddenInputsNotActive() {
    return html`
      <input type="hidden" name="themeId" value="${ifDefined(this.themeId)}" />
    `;
  }

  renderHiddenInputs() {
    return html`
      ${this.collection?.configuration.theme
        ? html`
            <input
              type="hidden"
              name="theme"
              value="${JSON.stringify(this.collection?.configuration.theme)}"
            />
          `
        : nothing}
      <input
        type="hidden"
        name="appHomeScreenIconImageId"
        value="${this.appHomeScreenIconImageId?.toString() || ""}"
      />

      ${(this.collection?.configuration as YpCommunityConfiguration).ltp
        ? html`
            <input
              type="hidden"
              name="ltp"
              value="${JSON.stringify(
                (this.collection?.configuration as YpCommunityConfiguration).ltp
              )}"
            />
          `
        : nothing}

      <input
        type="hidden"
        name="ssnLoginListDataId"
        value="${ifDefined(this.ssnLoginListDataId)}"
      />

      <input type="hidden" name="status" value="${this.status || ""}" />

      <input
        type="hidden"
        name="is_community_folder"
        value="${ifDefined(
          (this.collection as YpCommunityData).is_community_folder
        )}"
      />

      <input
        type="hidden"
        name="in_community_folder_id"
        value="${ifDefined(this.inCommunityFolderId)}"
      />

      <input
        type="hidden"
        name="welcomePageId"
        value="${ifDefined(this.welcomePageId)}"
      />

      <input
        type="hidden"
        name="signupTermsPageId"
        value="${ifDefined(this.signupTermsPageId)}"
      />

      ${this.renderHiddenAccessSettings()}
    `;
  }

  _hostnameChanged() {
    const hostname = (this.$$("#hostname") as TextField).value;
    if (hostname) {
      this.hostnameExample =
        hostname + "." + window.appGlobals!.domain!.domain_name;
    } else {
      this.hostnameExample =
        "your-hostname." + "." + window.appGlobals!.domain!.domain_name;
    }
    this._configChanged();
  }

  override _clear() {
    super._clear();
    this.appHomeScreenIconImageId = undefined;
    this.ssnLoginListDataId = undefined;
    this.ssnLoginListDataCount = undefined;
    this.inCommunityFolderId = undefined;
    this.signupTermsPageId = undefined;
    this.welcomePageId = undefined;
    this.availableCommunityFolders = undefined;
    (this.$$("#appHomeScreenIconImageUpload") as YpFileUpload).clear();
    this._configChanged();
  }

  override updated(
    changedProperties: Map<string | number | symbol, unknown>
  ): void {
    if (changedProperties.has("collectionId") && this.collectionId) {
      this._collectionIdChanged();
    }

    if (changedProperties.has("collection") && this.collection) {
      this.currentLogoImages = (
        this.collection as YpCommunityData
      ).CommunityLogoImages;

      this.currentHeaderImages = (
        this.collection as YpCommunityData
      ).CommunityHeaderImages;

      this._communityChanged();

      if (!(this.collection.configuration as YpCommunityConfiguration).ltp) {
        (this.collection.configuration as YpCommunityConfiguration).ltp =
          defaultLtpConfiguration;
      } else if (
        !(this.collection.configuration as YpCommunityConfiguration).ltp!.crt!
          .prompts
      ) {
        (
          this.collection.configuration as YpCommunityConfiguration
        ).ltp!.crt!.prompts = defaultLtpPromptsConfiguration();
      }
    }

    super.updated(changedProperties);
  }

  override languageChanged() {
    this._setupTranslations();
  }

  _communityChanged() {
    this._setupTranslations();
    //this._updateEmojiBindings();

    if (
      (this.collection as YpCommunityData).CommunityLogoVideos &&
      (this.collection as YpCommunityData).CommunityLogoVideos!.length > 0
    ) {
      this.uploadedVideoId = (
        this.collection as YpCommunityData
      ).CommunityLogoVideos![0].id;
    }

    this._getHelpPages("community");

    if (this.collection) {
      if ((this.collection as YpCommunityData).access === 0) {
        this.communityAccess = "public";
      } else if ((this.collection as YpCommunityData).access === 1) {
        this.communityAccess = "closed";
      } else if ((this.collection as YpCommunityData).access === 2) {
        this.communityAccess = "secret";
      }

      if ((this.collection as YpCommunityData).status) {
        this.status = (this.collection as YpCommunityData).status;
      }

      if ((this.collection as YpCommunityData).in_community_folder_id) {
        this.inCommunityFolderId = (
          this.collection as YpCommunityData
        ).in_community_folder_id;
      }

      if ((this.collection as YpCommunityData).configuration) {
        if (
          (this.collection as YpCommunityData).configuration.signupTermsPageId
        ) {
          this.signupTermsPageId = (
            this.collection as YpCommunityData
          ).configuration.signupTermsPageId;
        }
        if ((this.collection as YpCommunityData).configuration.welcomePageId) {
          this.welcomePageId = (
            this.collection as YpCommunityData
          ).configuration.welcomePageId;
        }
      }
    }

    if (window.appGlobals.hasVideoUpload) {
      this.hasVideoUpload = true;
    } else {
      this.hasVideoUpload = false;
    }

    if (
      window.appGlobals.domain &&
      window.appGlobals.domain.samlLoginProvided
    ) {
      this.hasSamlLoginProvider = true;
    } else {
      this.hasSamlLoginProvider = false;
    }

    if (
      this.collection &&
      this.collection.configuration &&
      (this.collection as YpCommunityData).configuration.ssnLoginListDataId
    ) {
      this.ssnLoginListDataId = (
        this.collection as YpCommunityData
      ).configuration.ssnLoginListDataId;
      this._getSsnListCount();
    }

    //    this._checkCommunityFolders(this.collection as YpCommunityData);

    this.requestUpdate();
  }

  _deleteSsnLoginList() {
    if (this.collection && this.ssnLoginListDataId) {
      window.adminServerApi.deleteSsnLoginList(
        this.collection.id,
        this.ssnLoginListDataId
      );
      this.ssnLoginListDataId = undefined;
      this.ssnLoginListDataCount = undefined;
    }
  }

  _ssnLoginListDataUploaded(event: CustomEvent) {
    this.ssnLoginListDataId = JSON.parse(
      event.detail.xhr.response
    ).ssnLoginListDataId;
    this._getSsnListCount();
    this._configChanged();
  }

  async _getSsnListCount() {
    if (this.collection && this.ssnLoginListDataId) {
      const response = await window.adminServerApi.getSsnListCount(
        this.collection.id,
        this.ssnLoginListDataId
      );
      this.ssnLoginListDataCount = response.count;
    }
  }

  async _collectionIdChanged() {
    if (this.collectionId == "new" || this.collectionId == "newFolder") {
      this.action = `/communities/${this.parentCollectionId}`;
      this.collection = {
        id: -1,
        name: "",
        description: "",
        access: 2,
        status: "active",
        only_admins_can_create_groups: true,
        counter_points: 0,
        counter_posts: 0,
        counter_users: 0,
        configuration: {
          ltp: defaultLtpConfiguration,
        },
        hostname: "",
        is_community_folder: this.collectionId == "newFolder" ? true : false,
      } as YpCommunityData;

      await this.checkDomainName(this.parentCollectionId!);

      if (this.parentCollection && this.parentCollection.configuration.theme) {
        this.collection.configuration.theme =
          this.parentCollection.configuration.theme;
      }
    } else {
      this.action = `/communities/${this.collectionId}`;
      await this.checkDomainName(
        (this.collection as YpCommunityData).Domain!.id
      );
    }
  }

  async checkDomainName(id: number) {
    const domain = await window.serverApi.getCollection("domain", id);

    (this.collection as YpCommunityData).Domain = domain as YpDomainData;
    if (
      this.collection &&
      (this.collection as YpCommunityData).Domain &&
      (this.collection as YpCommunityData).Domain?.domain_name
    ) {
      const domainName = (this.collection as YpCommunityData).Domain!
        .domain_name;
      if (!domainName.includes(".")) {
        if (!(this.collection as YpCommunityData).hostname) {
          (this.collection as YpCommunityData).hostname =
            this._generateRandomHostname();
        }
        this.hideHostnameInput = true;
      } else {
        this.hideHostnameInput = false;
      }
    }
  }

  async _checkCommunityFolders(community: YpCommunityData) {
    let domain;
    if (community.Domain) {
      domain = community.Domain;
    } else {
      domain = window.appGlobals.domain;
    }

    const communityFolders = (await window.adminServerApi.getCommunityFolders(
      domain!.id
    )) as Array<YpCommunityData>;

    if (communityFolders && this.collection?.id) {
      var deleteIndex;
      communityFolders.forEach((community, index) => {
        if (community.id == this.collection?.id) deleteIndex = index;
      });
      if (deleteIndex) communityFolders.splice(deleteIndex, 1);
    }
    if (communityFolders && communityFolders.length > 0) {
      communityFolders.unshift({
        id: -1,
        name: this.t("none"),
      } as unknown as YpCommunityData);
      this.availableCommunityFolders = communityFolders;
    } else {
      this.availableCommunityFolders = undefined;
    }
  }

  _setupTranslations() {
    if (this.collectionId == "new") {
      if (
        this.collection &&
        (this.collection as YpCommunityData).is_community_folder
      ) {
        this.editHeaderText = this.t("newCommunityFolder");
      } else {
        this.editHeaderText = this.t("community.new");
      }
      this.saveText = this.t("create");
      this.toastText = this.t("communityToastCreated");
    } else {
      if (
        this.collection &&
        (this.collection as YpCommunityData).is_community_folder
      ) {
        this.editHeaderText = this.t("updateCommunityFolder");
      } else {
        this.editHeaderText = this.t("Update community info");
      }
      this.saveText = this.t("save");
      this.toastText = this.t("communityToastUpdated");
    }
  }

  override async _formResponse(event: CustomEvent) {
    super._formResponse(event);
    const community = event.detail as YpCommunityData;
    if (community) {
      if (community.hostnameTaken) {
        window.appDialogs.getDialogAsync(
          "confirmationDialog",
          (dialog: YpConfirmationDialog) => {
            dialog.open(this.t("hostnameTaken"), undefined);
          }
        );
      } else {
        if (this.uploadedVideoId && this.connectedVideoToCollection) {
          await window.adminServerApi.addVideoToCollection(
            community.id,
            {
              videoId: this.uploadedVideoId,
            },
            "community"
          );
          this._finishRedirect(community);
        } else {
          this._finishRedirect(community);
        }
      }
    } else {
      console.warn("No community found on custom redirect");
    }
  }

  _finishRedirect(community: YpCommunityData) {
    if (this.collectionId == "new") {
      window.appUser.recheckAdminRights();
    }
    if (community.is_community_folder) {
      YpNavHelpers.redirectTo("/community_folder/" + community.id);
    } else {
      YpNavHelpers.redirectTo("/community/" + community.id);
    }
    window.appGlobals.activity("completed", "editCommunity");
  }

  _accessRadioChanged(event: CustomEvent) {
    this.communityAccess = (event.target as Radio)
      .value as YpCommunityAccessTypes;
    this._configChanged();
  }

  private _getAccessTab() {
    return {
      name: "access",
      icon: "code",
      items: [
        {
          text: "status",
          type: "html",
          templateData: html`
            <div class="layout vertical accessContainer">
              <div class="accessHeader">${this.t("access")}</div>
              <label>
                <md-radio
                  @change="${this._accessRadioChanged}"
                  value="public"
                  ?checked="${this.communityAccess == "public"}"
                  name="access"
                ></md-radio>
                ${this.t("public")}
              </label>
              <label>
                <md-radio
                  @change="${this._accessRadioChanged}"
                  ?checked="${this.communityAccess == "secret"}"
                  value="secret"
                  name="access"
                ></md-radio>
                ${this.t("private")}
              </label>
            </div>
          `,
        },
        {
          text: "status",
          type: "html",
          templateData: html`
            <md-outlined-select
              .label="${this.t("status.select")}"
              @change="${this._statusSelected}"
            >
              ${this.collectionStatusOptions?.map(
                (statusOption, index) => html`
                  <md-select-option ?selected="${this.statusIndex == index}"
                    >${statusOption.translatedName}</md-select-option
                  >
                `
              )}
            </md-outlined-select>
          `,
        },
        {
          text: "onlyAdminsCanCreateGroups",
          type: "checkbox",
          value: (this.collection as YpCommunityData)
            .only_admins_can_create_groups,
          translationToken: "community.onlyAdminsCanCreateGroups",
        },
        {
          text: "alwaysShowOnDomainPage",
          type: "checkbox",
          value: (this.collection as YpCommunityData).configuration
            .alwaysShowOnDomainPage,
          translationToken: "alwaysShowOnDomainPage",
        },
        {
          text: "useAsTemplate",
          type: "checkbox",
          value: (this.collection as YpCommunityData).configuration
            .useAsTemplate,
          translationToken: "useAsTemplate",
        },
      ] as Array<YpStructuredConfigData>,
    } as YpConfigTabData;
  }

  private _getBasicTab() {
    return {
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
          text: "mediaUploads",
          type: "html",
          templateData: this.renderHeaderImageUploads(),
        },
        {
          text: "alwaysHideLogoImage",
          type: "checkbox",
        },
        {
          text: "facebookPixelId",
          type: "textfield",
          maxLength: 40,
        },
        {
          text: "redirectToGroupId",
          type: "textfield",
          maxLength: 40,
        },
        {
          text: "defaultLocationLongLat",
          type: "textfield",
          maxLength: 100,
          value: (this.collection as YpCommunityData).defaultLocationLongLat,
        },
        {
          text: "inCommunityFolder",
          type: "html",
          templateData: html`
            <md-outlined-select
              .label="${this.t("inCommunityFolder")}"
              @change="${this._communityFolderSelected}"
              .value="${ifDefined(
                this.inCommunityFolderId != null
                  ? String(this.inCommunityFolderId)
                  : ""
              )}"
            >
              <md-select-option value="">
                ${this.t("none")}
              </md-select-option>
              ${this.availableCommunityFolders?.map(
                (communityFolder, index) => html`
                  <md-select-option
                    value="${communityFolder.id}"
                    ?selected="${this.inCommunityFolderId ==
                    communityFolder.id}"
                    >${communityFolder.name}</md-select-option
                  >
                `
              )}
            </md-outlined-select>
          `,
          hidden: !this.availableCommunityFolders,
        },
        {
          text: "signupTermsSelectPage",
          type: "html",
          templateData: html`
            <md-outlined-select
              .label="${this.t("signupTermsSelectPage")}"
              @change="${this._signupTermsPageSelected}"
              .value="${ifDefined(
                this.signupTermsPageId != null
                  ? String(this.signupTermsPageId)
                  : ""
              )}"
            >
              <md-select-option value="">
                ${this.t("none")}
              </md-select-option>
              ${this.translatedPages?.map(
                (page, index) => html`
                  <md-select-option
                    value="${page.id}"
                    ?selected="${this.signupTermsPageId == page.id}"
                    >${this._getLocalizePageTitle(page)}</md-select-option
                  >
                `
              )}
            </md-outlined-select>
          `,
          hidden: !this.translatedPages,
        },
        {
          text: "welcomePageSelect",
          type: "html",
          templateData: html`
            <md-outlined-select
              .label="${this.t("welcomeSelectPage")}"
              @change="${this._welcomePageSelected}"
              .value="${ifDefined(
                this.welcomePageId != null ? String(this.welcomePageId) : ""
              )}"
            >
              <md-select-option value="">
                ${this.t("none")}
              </md-select-option>
              ${this.translatedPages?.map(
                (page, index) => html`
                  <md-select-option
                    value="${page.id}"
                    ?selected="${this.welcomePageId == page.id}"
                    >${this._getLocalizePageTitle(page)}</md-select-option
                  >
                `
              )}
            </md-outlined-select>
          `,
          hidden: !this.translatedPages,
        },
      ],
    } as YpConfigTabData;
  }

  _welcomePageSelected(event: Event) {
    const select = event.target as MdOutlinedSelect;
    const value = select.value;
    this.welcomePageId = value ? Number(value) : undefined;
    this._configChanged();
  }

  _signupTermsPageSelected(event: Event) {
    const select = event.target as MdOutlinedSelect;
    const value = select.value;
    this.signupTermsPageId = value ? Number(value) : undefined;
    this._configChanged();
  }

  _communityFolderSelected(event: Event) {
    const select = event.target as MdOutlinedSelect;
    const value = select.value;
    this.inCommunityFolderId = value ? Number(value) : undefined;
    this._configChanged();
  }

  _getLookAndFeelTab() {
    return {
      name: "lookAndFeel",
      icon: "code",
      items: [
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
          text: "hideRecommendationOnNewsFeed",
          type: "checkbox",
        },
        {
          text: "disableCollectionUpLink",
          type: "checkbox",
          translationToken: "disableCommunityDomainUpLink",
        },
        {
          text: "disableNameAutoTranslation",
          type: "checkbox",
        },
        {
          text: "hideAllTabs",
          type: "checkbox",
        },
        {
          text: "useInfoIconInsteadOfHelpIcon",
          type: "checkbox",
          value: this.collection?.configuration.useInfoIconInsteadOfHelpIcon,
          translationToken: "useInfoIconInsteadOfHelpIcon",
        },
        {
          text: "welcomeHTML",
          type: "textarea",
          rows: 2,
          maxRows: 5,
        },
        {
          text: "sortBySortOrder",
          type: "checkbox",
          translationToken: "sortGroupsBySortOrder",
        },
        {
          text: "sortAlphabetically",
          type: "checkbox",
          translationToken: "sortGroupsAlphabetically",
        },
        {
          text: "highlightedLanguages",
          type: "textfield",
          maxLength: 200,
        },
        {
          text: "hideItemCount",
          type: "checkbox",
          value: this.collection?.configuration.hideItemCount,
          translationToken: "hideItemCount",
        },
        {
          text: "customBackName",
          type: "textfield",
          maxLength: 20,
        },
        {
          text: "customBackURL",
          type: "textfield",
          maxLength: 256,
        },
      ],
    } as YpConfigTabData;
  }

  _getWebAppTab() {
    return {
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
      ] as Array<YpStructuredConfigData>,
    };
  }

  _getSamlTab() {
    return {
      name: "samlAuth",
      icon: "security",
      items: [
        {
          text: "forceSecureSamlLogin",
          type: "checkbox",
          disabled: !this.hasSamlLoginProvider,
        },
        {
          text: "customSamlLoginMessage",
          type: "textarea",
          rows: 2,
          maxRows: 5,
          maxLength: 175,
        },
        {
          text: "customSamlDeniedMessage",
          type: "textarea",
          rows: 2,
          maxRows: 5,
          maxLength: 150,
        },
        {
          text: "ssnLoginListDataUpload",
          type: "html",
          templateData: html`
            ${this.collection && this.ssnLoginListDataId
              ? html`
                <div>
                  <b>${this.t("ssnLoginListCount")}: ${
                  this.ssnLoginListDataCount
                }</b>
                </div>
                <div>
                  <md-filled-button
                    style="padding: 8px;"
                    raised
                    .label="${this.t("deleteSsnLoginList")}"
                    @click="${this._deleteSsnLoginList}"
                    ></md-filled-button
                  >
                </div>
              </div>
                `
              : nothing}
            ${this.collection && !this.ssnLoginListDataId
              ? html`
                  <yp-file-upload
                    id="ssnLoginListDataUpload"
                    raised
                    ?disable="${!this.hasSamlLoginProvider}"
                    accept=".txt,.csv"
                    .target="/api/communities/${this.collection
                      .id}/upload_ssn_login_list"
                    method="POST"
                    buttonIcon="link"
                    .buttonText="${this.t("appHomeScreenIconImageUpload")}"
                    @success="${this._ssnLoginListDataUploaded}"
                  >
                  </yp-file-upload>
                `
              : nothing}
          `,
        },
      ] as Array<YpStructuredConfigData>,
    };
  }

  setupConfigTabs() {
    const tabs: Array<YpConfigTabData> = [];

    tabs.push(this._getAccessTab());
    tabs.push(this._getBasicTab());
    tabs.push(this._getLookAndFeelTab());
    tabs.push(this._getWebAppTab());
    tabs.push(this._getSamlTab());

    this.tabsPostSetup(tabs);

    return tabs;
  }

  _appHomeScreenIconImageUploaded(event: CustomEvent) {
    var image = JSON.parse(event.detail.xhr.response);
    this.appHomeScreenIconImageId = image.id;
    this._configChanged();
  }

  async _openTemplatesDialog() {
    const domainId = (this.collection as YpCommunityData).Domain?.id;
    if (!domainId) return;
    try {
      this.templates = await window.adminServerApi.getCommunityTemplates(
        domainId
      );
      this.requestUpdate();
      await this.updateComplete;
      (this.$$("#templatesDialog") as Dialog).show();
    } catch (error) {
      console.error("Failed to fetch community templates", error);
      // Optionally show an error to the user
    }
  }

  async _cloneTemplate(template: YpCommunityData, event: Event) {
    if (this.cloningTemplateId) return; // Already cloning

    event.preventDefault();

    console.log("Cloning template:", template.name);
    this.cloningTemplateId = template.id;

    window.appGlobals.activity("open", "community.cloneFromTemplate");


    try {
      const newCommunity = (await window.serverApi.apiAction(
        `/api/communities/${template.id}/clone`,
        "POST",
        {}
      )) as YpCommunityData;

      window.appGlobals.activity("completed", "cloneCommunityFromTemplate");
      window.appGlobals.showToast(this.t("templateClonedSuccessfully")); // Assuming a translation key exists
      window.location.href = `/community/${newCommunity.id}`;
    } catch (err) {
      console.error("Template clone failed", err);
      window.appGlobals.activity("error", "cloneCommunityFromTemplate", (err as Error).message);
      window.appGlobals.showToast(this.t("templateCloningFailed"), 5000); // Assuming a translation key exists
      this.cloningTemplateId = null; // Reset on error
    }
    // No finally block needed as redirection happens on success
  }

  override renderTemplatesDialog() {
    return html`
      <md-dialog id="templatesDialog">
        <div slot="headline">${this.t("templates")}</div>
        <md-list slot="content">
          ${this.templates && this.templates.length > 0
            ? this.templates.map(
                (t) => html`
                  <md-list-item
                    @click="${(e: Event) => this._cloneTemplate(t, e)}"
                    ?disabled="${this.cloningTemplateId !== null}"
                  >
                    <div slot="headline" class="layout horizontal center-center">
                      ${t.name}
                      ${this.cloningTemplateId === t.id
                        ? html`<md-circular-progress
                            indeterminate
                            style="--md-circular-progress-size:32px; margin-left: 12px;"
                          ></md-circular-progress>`
                        : nothing}
                    </div>
                  </md-list-item>
                `
              )
            : html`<md-list-item>${this.t("noTemplatesFound")}</md-list-item>`}
        </md-list>
        <div slot="actions">
          <md-text-button
            @click="${() => (this.$$("#templatesDialog") as Dialog).close()}"
            ?disabled="${this.cloningTemplateId !== null}"
            dialogAction="close"
            >${this.t("close")}</md-text-button
          >
        </div>
      </md-dialog>
    `;
  }
}
