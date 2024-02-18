import { html, css, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";

import { YpBaseElement } from "../common/yp-base-element.js";
import { ShadowStyles } from "../common/ShadowStyles.js";

import { YpAppGlobals } from "../yp-app/YpAppGlobals.js";
import { YpAppUser } from "../yp-app/YpAppUser.js";
import { YpServerApi } from "../common/YpServerApi.js";
import { YpServerApiAdmin } from "../common/YpServerApiAdmin.js";

import { YpAccessHelpers } from "../common/YpAccessHelpers.js";
import { classMap } from "lit/directives/class-map.js";

import "@material/web/labs/navigationbar/navigation-bar.js";
import "@material/web/labs/navigationtab/navigation-tab.js";
import "@material/web/iconbutton/filled-icon-button.js";
import "@material/web/labs/navigationdrawer/navigation-drawer.js";
import "@material/web/list/list-item.js";
import "@material/web/list/list.js";
import "@material/web/iconbutton/outlined-icon-button.js";
import "@material/web/iconbutton/icon-button.js";


import {
  argbFromHex,
  themeFromSourceColor,
  applyTheme,
} from "@material/material-color-utilities";

import "@material/web/menu/menu.js";
import "./yp-analytics/yp-promotion-dashboard.js";
import { cache } from "lit/directives/cache.js";

import "./yp-promotion/yp-campaign-manager.js";
import { YpCollectionHelpers } from "../common/YpCollectionHelpers.js";
import { ifDefined } from "lit/directives/if-defined.js";

import "../common/yp-image.js";
import { YpBaseElementWithLogin } from "../common/yp-base-element-with-login.js";
import { Dialog } from "@material/web/dialog/internal/dialog.js";

const PagesTypes = {
  Analytics: 1,
  Campaign: 2,
  EmailLists: 3,
  AiAnalysis: 4,
  Settings: 5,
};

@customElement("yp-promotion-app")
export class YpPromotionApp extends YpBaseElementWithLogin {
  @property({ type: String })
  collectionType: string;

  @property({ type: Number })
  collectionId: number | string;

  @property({ type: String })
  collectionAction: string = "config";

  @property({ type: String })
  page: string | undefined;

  @property({ type: Number })
  pageIndex = 1;

  @property({ type: Object })
  collection: YpCollectionData | undefined;

  @property({ type: String })
  currentError: string | undefined;

  @property({ type: Boolean })
  adminConfirmed = false;

  @property({ type: Boolean })
  haveCheckedAdminRights = false;

  @property({ type: Boolean })
  haveCheckedPromoterRights = false;

  @property({ type: Boolean, reflect: true })
  active!: boolean;

  @property({ type: String })
  lastSnackbarText: string | undefined;

  @property({ type: String })
  useCommunityId: string | number | undefined;

  originalCollectionType: string | undefined;

  collectionURL: string | undefined;

  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          width: 100vw;
          height: 100vh;
          background-color: var(--md-sys-color-surface, #fefefe);
        }
        .backContainer {
          margin-top: 16px;
          margin-left: 16px;
        }
        body {
          background-color: var(--md-sys-color-surface, #fefefe);
        }

        .navContainer {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          z-index: 7;
        }

        .headerContainer {
          width: 100%;
          margin-bottom: 8px;
          vertical-align: middle;
        }

        .analyticsHeaderText {
          font-size: var(--md-sys-typescale-headline-large-size, 18px);
          margin-top: 16px;
          margin-bottom: 16px;
        }

        .ypLogo {
          margin-top: 16px;
        }

        .rightPanel {
          margin-left: 16px;
          width: 100%;
        }

        .loadingText {
          margin-top: 48px;
        }

        .collectionName {
          color: var(--md-sys-color-on-surface);
        }

        .selectedContainer {
          --md-list-list-item-container-color: var(
            --md-sys-color-secondary-container
          );
          color: var(--md-sys-color-on-secondary-container);
          --md-list-list-item-label-text-color: var(
            --md-sys-color-on-secondary-container
          );
        }

        .topAppBar {
          border-radius: 48px;
          background-color: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
          margin-top: 32px;
          padding: 0px;
          padding-left: 32px;
          padding-right: 32px;
          text-align: center;
        }

        .collectionLogoImage {
          width: 120px;
          height: 68px;
          margin-right: 16px;
          margin-left: 16px;
        }

        .mainPageContainer {
          margin-top: 16px;
          max-width: 1100px;
          width: 1100px;
        }

        yp-promotion-dashboard {
          max-width: 1100px;
        }

        @media (max-width: 1100px) {
          .mainPageContainer {
            max-width: 100%;
            width: 100%;
            margin-bottom: 96px;
          }

          yp-promotion-dashboard {
            max-width: 100%;
          }
        }
      `,
    ];
  }

  constructor() {
    super();

    let pathname = window.location.pathname;
    if (pathname.endsWith("/"))
      pathname = pathname.substring(0, pathname.length - 1);
    const split = pathname.split("/");
    this.collectionType = split[split.length - 2];

    this.originalCollectionType = this.collectionType;

    this.collectionId = split[split.length - 1];
  }

  override connectedCallback() {
    super.connectedCallback();
    this._setupEventListeners();
    window.appUser.recheckAdminRights();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._removeEventListeners();
  }

  async _getCollection() {
    const collection = (await window.serverApi.getCollection(
      this.collectionType,
      this.collectionId as number
    )) as YpCollectionData | YpGroupResults;
    if (this.collectionType == "group") {
      this.collection = (collection as YpGroupResults).group;
    } else if (this.collectionType == "community") {
      if (
        (collection as YpCommunityData).configuration.useCommunityIdForAnalytics &&
        (collection as YpCommunityData).configuration.communityId
      ) {
        this.useCommunityId = (
          collection as YpCommunityData
        ).configuration.communityId;
      } else {
        this.useCommunityId = undefined;
      }
      this.collection = collection as YpCollectionData;
    } else {
      this.collection = collection as YpCollectionData;
    }
    await this.updateComplete;
    this._setAdminConfirmed();
  }

  renderTopBar() {
    return html`
      <div class="layout vertical center-center">
        <div class="layout horizontal topAppBar">
          <div class="layout horizontal headerContainer">
            <div class="analyticsHeaderText layout horizontal center-center">
              <div>
                <img
                  class="collectionLogoImage"
                  src="${ifDefined(
                    YpCollectionHelpers.logoImagePath(
                      this.collectionType,
                      this.collection!
                    )
                  )}"
                />
              </div>
              <div></div>
              ${this.collection ? this.collection.name : ""}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  snackbarclosed() {
    this.lastSnackbarText = undefined;
  }

  override render() {
    return html`
      <md-dialog id="errorDialog">
        <div slot="heading">${this.t("error")}</div>
        <div>${this.currentError}</div>
        <md-text-button dialogAction="cancel" slot="secondaryAction">
          ${this.t("ok")}
        </md-text-button>
      </md-dialog>
      ${this.collection
        ? html`
            <div class="layout horizontal">
              ${this.renderNavigationBar()}
              <div class="rightPanel">
                <main>
                  <div class="mainPageContainer">${this._renderPage()}</div>
                </main>
              </div>
            </div>
          `
        : html`
            <div class="layout horizontal center-center loadingText">
              <div>${this.t("Loading...")}</div>
            </div>
          `}
    `;
  }

  renderNavigationBar() {
    if (this.wide) {
      return html`
        <div class="layout vertical">
          <div class="layout horizontal backContainer">
            <md-icon-button @click="${this.exitToMainApp}">
              <md-icon>close</md-icon>
            </md-icon-button>
          </div>
          <div class="layout horizontal headerContainer">
            <div class="analyticsHeaderText layout horizontal center-center">
              <div>
                <yp-image
                  class="collectionLogoImage"
                  sizing="contain"
                  .src="${YpCollectionHelpers.logoImagePath(
                    this.collectionType,
                    this.collection!
                  )}"
                ></yp-image>
              </div>
              <div class="collectionName">
                ${this.collection ? this.collection.name : ""}
              </div>
            </div>
          </div>

          <md-list>
            <md-list-item
              class="${this.pageIndex == 1 && "selectedContainer"}"
              @click="${() => (this.pageIndex = 1)}"
              type="button"
            >
              <div slot="headline">${this.t("Analytics")}</div>
              <div slot="supporting-text">
                ${this.t("Historical and realtime")}
              </div>
              <md-icon slot="start">
                <md-icon>insights</md-icon>
              </md-icon></md-list-item
            >
            <md-list-item
              class="${this.pageIndex == 2 && "selectedContainer"}"
              @click="${() => (this.pageIndex = 2)}"
              type="button"
            >
              <div slot="headline">${this.t("Promotion")}</div>
              <div slot="supporting-text">
                ${this.collectionType == "post"
                  ? this.t("Promote your idea")
                  : this.t("Promote your community")}
              </div>
              <md-icon slot="start"
                ><md-icon>ads_click</md-icon></md-icon
              ></md-list-item
            >
            <md-list-item
              class="${this.pageIndex == 3 && "selectedContainer"}"
              @click="${() => (this.pageIndex = 3)}"
              ?hidden="${true || this.collectionType == "post"}"
              type="button"
            >
              <div slot="headline">${this.t("Email Lists")}</div>
              <div slot="supporting-text">
                ${this.t("Send promotional emails")}
              </div>
              <md-icon slot="start"
                ><md-icon
                  ><span class="material-symbols-outlined"
                    >schedule_send</span
                  ></md-icon
                ></md-icon
              ></md-list-item
            >
          </md-list>
        </div>
      `;
    } else {
      return html`
        <div class="navContainer">
          <md-navigation-bar @navigation-bar-activated="${this.tabChanged}">
            <md-navigation-tab .label="${this.t("Analytics")}"
              ><md-icon slot="activeIcon">insights</md-icon>
              <md-icon slot="inactiveIcon">insights</md-icon></md-navigation-tab
            >
            <md-navigation-tab .label="${this.t("Promotion")}">
              <md-icon slot="activeIcon">ads_click</md-icon>
              <md-icon slot="inactiveIcon">ads_click</md-icon>
            </md-navigation-tab>
            <md-navigation-tab .label="${this.t("Settings")}">
              <md-icon slot="activeIcon">settings</md-icon>
              <md-icon slot="inactiveIcon">settings</md-icon>
            </md-navigation-tab>
          </md-navigation-bar>
        </div>
      `;
    }
  }

  tabChanged(event: CustomEvent) {
    if (event.detail.activeIndex == 0) {
      this.pageIndex = 1;
    } else if (event.detail.activeIndex == 1) {
      this.pageIndex = 2;
    } else if (event.detail.activeIndex == 2) {
      this.pageIndex = 5;
    }
  }

  exitToMainApp() {
    window.location.href = `/${this.originalCollectionType}/${this.collectionId}`;
  }

  _setupEventListeners() {
    this.addListener("exit-to-app", this.exitToMainApp);
    this.addGlobalListener(
      "yp-got-admin-rights",
      this._gotAdminRights.bind(this)
    );
    this.addGlobalListener(
      "yp-got-promoter-rights",
      this._gotPromoterRights.bind(this)
    );
  }

  _removeEventListeners() {
    this.removeGlobalListener(
      "yp-got-admin-rights",
      this._gotAdminRights.bind(this)
    );
    this.removeGlobalListener(
      "yp-got-promoter-rights",
      this._gotPromoterRights.bind(this)
    );
  }

  _gotAdminRights(event: CustomEvent) {
    this.haveCheckedAdminRights = true;
  }

  _gotPromoterRights(event: CustomEvent) {
    this.haveCheckedPromoterRights = true;
  }

  _setAdminConfirmed() {
    if (this.collection) {
      switch (this.collectionType) {
        case "domain":
          this.adminConfirmed = YpAccessHelpers.checkDomainAccess(
            this.collection as YpDomainData
          );
          break;
        case "community":
          this.adminConfirmed = YpAccessHelpers.checkCommunityAccess(
            this.collection as YpCommunityData
          );
          break;
        case "group":
          this.adminConfirmed = YpAccessHelpers.checkGroupAccess(
            this.collection as YpGroupData
          );
          break;
        case "post":
          this.adminConfirmed = YpAccessHelpers.checkPostAccess(
            this.collection as unknown as YpPostData
          );
          break;
      }
    }

    if (!this.adminConfirmed) {
      switch (this.collectionType) {
        case "community":
          this.adminConfirmed = YpAccessHelpers.checkCommunityPromoterAccess(
            this.collection as YpCommunityData
          );
          break;
        case "group":
          this.adminConfirmed = YpAccessHelpers.checkGroupPromoterAccess(
            this.collection as YpGroupData
          );
          break;
      }
    }

    if (!this.adminConfirmed) {
      this.fire("yp-network-error", { message: this.t("unauthorized") });
    }
  }

  override updated(
    changedProperties: Map<string | number | symbol, unknown>
  ): void {
    super.updated(changedProperties);

    if (
      (changedProperties.has("loggedInUser") ||
        changedProperties.has("haveCheckedAdminRights") ||
        changedProperties.has("haveCheckedPromoterRights")) &&
      this.loggedInUser &&
      this.haveCheckedAdminRights === true &&
      this.haveCheckedPromoterRights == true
    ) {
      this._getCollection();
    }
  }

  _appError(event: CustomEvent) {
    let error = event.detail.message;
    if (event.detail && event.detail.response) {
      error = event.detail.response.statusText;
    }
    console.error(error);
    this.currentError = error;
    (this.$$("#errorDialog") as Dialog).open = true;
  }

  _renderPage() {
    console.error(`admin confirmed: ${this.adminConfirmed}`);
    if (this.adminConfirmed) {
      console.error(this.pageIndex);
      switch (this.pageIndex) {
        case PagesTypes.Analytics:
          switch (this.collectionType) {
            case "domain":
            case "community":
            case "group":
            case "post":
              return html`
                ${cache(
                  this.collection
                    ? html`<yp-promotion-dashboard
                        .collectionType="${this.collectionType}"
                        .collection="${this.collection}"
                        .collectionId="${this.collectionId}"
                        .useCommunityId="${this.useCommunityId}"
                      >
                      </yp-promotion-dashboard>`
                    : nothing
                )}
              `;
            default:
              return html`<p>
                Page not found try going to <a href="#main">Main</a>
              </p>`;
          }
        case PagesTypes.Campaign:
          return html`
            ${cache(
              this.collection
                ? html`<yp-campaign-manager
                    .collectionType="${this.collectionType}"
                    .collection="${this.collection}"
                    .collectionId="${this.collectionId}"
                  >
                  </yp-campaign-manager>`
                : nothing
            )}
          `;
        case PagesTypes.AiAnalysis:
          return html`
            ${cache(
              this.collection
                ? html`<yp-ai-text-analysis
                    .collectionType="${this.collectionType}"
                    .collection="${this.collection}"
                    .collectionId="${this.collectionId}"
                  >
                  </yp-ai-text-analysis>`
                : nothing
            )}
          `;
        case PagesTypes.EmailLists:
          return html`
            ${cache(
              this.collection
                ? html`<yp-email-lists
                    .collectionType="${this.collectionType}"
                    .collection="${this.collection}"
                    .collectionId="${this.collectionId}"
                  >
                  </yp-email-lists>`
                : nothing
            )}
          `;
        case PagesTypes.Settings:
          return html`
            ${cache(
              this.collection
                ? html`<yp-promotion-settings
                    .collectionType="${this.collectionType}"
                    .collection="${this.collection}"
                    .collectionId="${this.collectionId}"
                    @color-changed="${this._settingsColorChanged}"
                  >
                  </yp-promotion-settings>`
                : nothing
            )}
          `;
        default:
          return html`
            <p>Page not found try going to <a href="#main">Main</a></p>
          `;
      }
    } else {
      return nothing;
    }
  }

  _settingsColorChanged(event: CustomEvent) {
    this.fireGlobal("yp-theme-color", event.detail.value);
  }
}
