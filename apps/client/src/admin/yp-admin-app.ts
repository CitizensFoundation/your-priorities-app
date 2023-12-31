import { html, css, nothing, PropertyValueMap } from "lit";
import { property, customElement } from "lit/decorators.js";

import "@material/web/labs/navigationtab/navigation-tab.js";
import "@material/web/iconbutton/filled-icon-button.js";

import "@material/web/list/list-item.js";
import "@material/web/list/list.js";
import "@material/web/progress/linear-progress.js";

import "@material/web/menu/menu.js";

import "../common/yp-image.js";
import { YpBaseElement } from "../common/yp-base-element.js";

import "./yp-admin-config-domain.js";
import "./yp-admin-config-community.js";
import "./yp-admin-config-group.js";

import "./yp-admin-communities.js";
import "./yp-admin-groups.js";

import "./yp-users-grid.js";
import "./yp-content-moderation.js";
import "./yp-pages-grid.js";

import "./yp-admin-translations.js";
import "./yp-admin-reports.js";

const VERSION = "[VI]Version: {version} - built on {date}[/VI]";

import "../yp-collection/yp-domain.js";
import { YpAccessHelpers } from "../common/YpAccessHelpers.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
import { YpCollectionHelpers } from "../common/YpCollectionHelpers.js";

type AdminPageOptions =
  | "login"
  | "user"
  | "configuration"
  | "translations"
  | "pages"
  | "reports"
  | "users"
  | "admins"
  | "moderation"
  | "aiAnalysis"
  | "groups"
  | "communities"
  | "back"
  | "posts"
  | "profile_images"
  | "badges"
  | "post";

type CollectionTypes = "domain" | "community" | "group";

interface RouteData {
  page: AdminPageOptions;
}

@customElement("yp-admin-app")
export class YpAdminApp extends YpBaseElement {
  @property({ type: String })
  page: AdminPageOptions = "configuration";

  @property({ type: Object })
  user: YpUserData | undefined;

  @property({ type: Boolean, reflect: true })
  active!: boolean;

  @property({ type: String })
  route = "";

  @property({ type: String })
  subRoute: string | undefined;

  @property({ type: Object })
  routeData!: RouteData;

  @property({ type: Array })
  userYpCollection: YpGroupData[] = [];

  @property({ type: String })
  forwardToYpId: string | undefined;

  @property({ type: String })
  headerTitle: string | undefined;

  @property({ type: String })
  collectionType!:
    | CollectionTypes
    | "post"
    | "groups"
    | "communities"
    | "profile_image";

  @property({ type: Number })
  collectionId!: number | "new";

  @property({ type: Number })
  parentCollectionId: number | undefined;

  @property({ type: Object })
  parentCollection: YpCollectionData | undefined;

  @property({ type: Object })
  collection: YpCollectionData | undefined;

  @property({ type: Boolean })
  adminConfirmed = false;

  @property({ type: Boolean })
  haveCheckedAdminRights = false;

  anchor: HTMLElement | null = null;

  _scrollPositionMap = {};

  communityBackOverride: Record<string, Record<string, string>> | undefined;

  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          width: 100vw;
          height: 100vh;
          background-color: var(--md-sys-color-surface, #fefefe);
        }

        body {
          background-color: var(--md-sys-color-surface, #fefefe);
        }

        .backContainer {
          margin-top: 16px;
          margin-left: 16px;
        }

        .navContainer {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          z-index: 7;
        }

        .drawer {
          width: 300px;
        }

        .headerContainer {
          width: 100%;
          margin-bottom: 8px;
          vertical-align: middle;
        }

        .mainHeaderText {
          font-size: var(--md-sys-typescale-headline-large-size, 18px);
          margin-top: 16px;
          margin-bottom: 16px;
        }

        .collectionLogoImage {
          width: 95px;
          height: 95px;
          margin-right: 24px;
          margin-left: 24px;
        }

        .splashImage {
          width: 500px;
          height: 500px;
          margin-top: 32px;
          margin-bottom: 1024px;
        }

        .splashHeader {
          font-size: 1.75rem;
          font-family: monospace;
          margin-top: 64px;
          color: var(--md-sys-color-primary);
        }

        @media (max-width: 1000px) {
          .mainHeaderText {
            margin-top: 48px;
            margin-bottom: 8px;
          }

          .splashImage {
            width: 100%;
            margin-top: 0;
          }

          .splashHeader {
            font-size: 1.75rem;
            margin-bottom: 8px;
          }
        }

        @media (max-width: 400px) {
          .splashHeader {
            font-size: 1.5rem;
            margin-bottom: 8px;
          }
        }

        .ypSmallLogo {
          margin-top: 16px;
        }

        .rightPanel {
          width: 100%;
          min-height: 100vh;
          margin-bottom: 64px;
          margin-top: 32px;
          margin-left: 32px;
        }

        .loadingText {
          margin-top: 48px;
        }

        .titleInPrimaryColor {
          color: var(--md-sys-color-primary);
        }

        .titleInSecondaryColor {
          color: var(--md-sys-color-secondary);
        }

        .nickname {
          font-size: 1.5rem;
          margin-top: 8px;
        }

        .score {
          font-size: 1.5rem;
          margin-top: 16px;
        }

        md-list-item {
          --md-list-list-item-container-color: var(--md-sys-color-surface);
          color: var(--md-sys-color-primary);
          --md-list-list-item-label-text-color: var(--md-sys-color-primary);
          --md-list-list-item-leading-icon-color: var(--md-sys-color-primary);
          --md-list-list-item-supporting-text-color: var(
            --md-sys-color-on-primary-container
          );
        }

        .selectedContainer {
          --md-list-list-item-container-color: var(
            --md-sys-color-secondary-container
          );
          color: var(--md-sys-color-on-secondary-container);
          --md-list-list-item-label-text-color: var(--md-sys-color-primary);
        }

        md-navigation-drawer {
          --md-navigation-drawer-container-color: var(--md-sys-color-surface);
        }

        md-list {
          --md-list-container-color: var(--md-sys-color-surface);
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

        .mainPageContainer {
          margin-top: 16px;
        }

        yp-promotion-dashboard {
          max-width: 1000px;
        }

        @media (max-width: 1000px) {
          .mainPageContainer {
            max-width: 100%;
            width: 100%;
            margin-bottom: 96px;
            margin-top: 0;
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
    this._setupEventListeners();
    this.updatePageFromPath();
  }

  updatePageFromPath() {
    let pathname = window.location.pathname;

    pathname = pathname.replace("/admin", "");

    if (pathname.endsWith("/"))
      pathname = pathname.substring(0, pathname.length - 1);
    if (pathname.startsWith("/"))
      pathname = pathname.substring(1, pathname.length);

    const splitPath = pathname.split("/");

    this.collectionType = splitPath[0] as CollectionTypes;

    if (splitPath[1] == "new" && splitPath[2]) {
      this.collectionId = "new";
      this.parentCollectionId = parseInt(splitPath[2]);
      this.page = "configuration";
    } else {
      this.collectionId = parseInt(splitPath[1]);
      if (splitPath.length > 3) {
        this.page = splitPath[3] as AdminPageOptions;
      } else if (splitPath.length > 2) {
        this.page = splitPath[2] as AdminPageOptions;
      } else {
        this.page = "configuration";
      }
    }
  }

  protected override firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.firstUpdated(_changedProperties);
  }

  override connectedCallback() {
    super.connectedCallback();

    this.updateLocation();
  }

  updateLocation() {
    let path = window.location.pathname;

    path = path.replace("/admin", "");

    const pattern = "/:page";

    const remainingPieces = path.split("/");
    const patternPieces = pattern.split("/");

    const matched = [];
    const namedMatches: Record<string, string> = {};

    const oldRouteData = structuredClone(this.routeData) as RouteData;

    for (let i = 0; i < patternPieces.length; i++) {
      const patternPiece = patternPieces[i];
      if (!patternPiece && patternPiece !== "") {
        break;
      }
      const pathPiece = remainingPieces.shift();

      // We don't match this path.
      if (!pathPiece && pathPiece !== "") {
        return;
      }
      matched.push(pathPiece);

      if (patternPiece.charAt(0) == ":") {
        namedMatches[patternPiece.slice(1)] = pathPiece;
      } else if (patternPiece !== pathPiece) {
        return;
      }
    }

    let tailPath = remainingPieces.join("/");
    if (remainingPieces.length > 0) {
      tailPath = "/" + tailPath;
    }

    this.subRoute = tailPath;
    this.route = path;

    this.routeData = namedMatches as unknown as RouteData;
    this.updatePageFromPath();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._removeEventListeners();
  }

  _pageChanged() {
    const page = this.page;

    //TODO: Get bundling working
    /*if (page) {
      let resolvedPageUrl;
      if (page=="view-404") {
        resolvedPageUrl = this.resolveUrl("yp-view-404.html");
      } else if (page==='community_folder') {
        resolvedPageUrl = this.resolveUrl('../yp-community/yp-community-folder.js?v=@version@');
      } else {
        resolvedPageUrl = this.resolveUrl('/src/yp-' + page + '/' + 'yp-' + page + ".js?v=@version@");
      }
      console.log("Trying to load "+resolvedPageUrl);
      import(resolvedPageUrl).then(null, this._showPage404.bind(this));
    }*/

    if (page) {
      window.appGlobals.analytics.sendToAnalyticsTrackers(
        "send",
        "pageview",
        location.pathname
      );
    }
  }

  tabChanged(event: CustomEvent) {
    if (event.detail.activeIndex == 0) {
      this.page = "configuration";
    } else if (event.detail.activeIndex == 1) {
      this.page = "moderation";
    } else if (event.detail.activeIndex == 3) {
      this.page = "users";
    } else if (event.detail.activeIndex == 4) {
      this.page = "admins";
    }
  }

  _setupEventListeners() {}

  _refreshAdminRights() {
    window.appUser.recheckAdminRights();
  }

  _removeEventListeners() {}

  _refreshGroup() {
    this._refreshByName("#groupPage");
  }

  _refreshCommunity() {
    this._refreshByName("#communityPage");
  }

  _refreshDomain() {
    this._refreshByName("#domainPage");
  }

  _refreshByName(id: string) {
    const el = this.$$(id);
    // TODO: Get refresh to work
    if (el) {
      //el._refreshAjax();
    }
  }

  override updated(
    changedProperties: Map<string | number | symbol, unknown>
  ): void {
    super.updated(changedProperties);

    if (changedProperties.has("page")) {
      this._pageChanged();
    }

    if (
      changedProperties.has("collectionType") &&
      this.collectionId &&
      this.collectionId != "new"
    ) {
      this.getCollection();
    } else if (
      changedProperties.has("collectionId") &&
      this.collectionId == "new"
    ) {
      this._setAdminFromParent();
    }

    if (changedProperties.has("collection")) {
      console.error("collection", this.collection);
    }
  }

  _needsUpdate() {
    this.requestUpdate();
  }

  renderGroupConfigPage() {
    return html`<yp-admin-config-group
      .collectionType="${this.collectionType}"
      .collection="${this.collection}"
      .collectionId="${this.collectionId}"
      .subRoute="${this.subRoute}"
      .parentCollectionId="${this.parentCollectionId}"
    >
    </yp-admin-config-group>`;
  }

  _renderPage() {
    if (this.adminConfirmed) {
      switch (this.page) {
        case "translations":
          return html`
            ${this.collection
              ? html`<yp-admin-translations
                  .collectionType="${this.collectionType}"
                  .collection="${this.collection}"
                  .collectionId="${this.collectionId}"
                >
                </yp-admin-translations>`
              : nothing}
          `;
        case "reports":
          return html`
            ${this.collection
              ? html`<yp-admin-reports
                  .collectionType="${this.collectionType}"
                  .collection="${this.collection}"
                  .collectionId="${this.collectionId}"
                >
                </yp-yp-admin-reports>`
              : nothing}
          `;
        case "communities":
          return html`
            ${this.collection
              ? html`<yp-admin-communities .domain="${this.collection}">
                </yp-admin-communities>`
              : nothing}
          `;

        case "user":
          return html`
            ${true
              ? html`<yp-admin-user-settings .user="${this.user}">
                </yp-admin-user-settings>`
              : nothing}
          `;

        case "groups":
          return html`
            ${this.collection
              ? html`<yp-admin-groups .community="${this.collection}">
                </yp-admin-groups>`
              : nothing}
          `;
        case "configuration":
          switch (this.collectionType) {
            case "domain":
              return html`
                ${this.collection
                  ? html`<yp-admin-config-domain
                      .collectionType="${this.collectionType}"
                      .collection="${this.collection}"
                      .collectionId="${this.collectionId}"
                    >
                    </yp-admin-config-domain>`
                  : nothing}
              `;
            case "community":
              return html`
                ${this.collection || this.collectionId === "new"
                  ? html`<yp-admin-config-community
                      .collectionType="${this.collectionType}"
                      .collection="${this.collection}"
                      .collectionId="${this.collectionId}"
                      .parentCollectionId="${this.parentCollectionId}"
                    >
                    </yp-admin-config-community>`
                  : nothing}
              `;
            case "group":
              return html`
                ${this.collection || this.collectionId === "new"
                  ? this.renderGroupConfigPage()
                  : nothing}
              `;
            default:
              return html``;
          }
        case "users":
        case "admins":
          switch (this.collectionType) {
            case "domain":
              return html`
                ${this.collection
                  ? html`<yp-users-grid
                      .adminUsers="${this.page == "admins"}"
                      .domainId="${this.collectionId as number}"
                    >
                    </yp-users-grid>`
                  : nothing}
              `;
            case "community":
              return html`
                ${this.collection
                  ? html`<yp-users-grid
                      .adminUsers="${this.page == "admins"}"
                      .communityId="${this.collectionId as number}"
                    >
                    </yp-users-grid>`
                  : nothing}
              `;
            case "group":
              return html`
                ${this.collection
                  ? html`<yp-users-grid
                      .adminUsers="${this.page == "admins"}"
                      .groupId="${this.collectionId as number}"
                    >
                    </yp-users-grid>`
                  : nothing}
              `;
            default:
              return html``;
          }
        case "moderation":
          switch (this.collectionType) {
            case "domain":
              return html`
                ${this.collection
                  ? html`<yp-content-moderation
                      .domainId="${this.collectionId as number}"
                    >
                    </yp-content-moderation>`
                  : nothing}
              `;
            case "community":
              return html`
                ${this.collection
                  ? html`<yp-content-moderation
                      .communityId="${this.collectionId as number}"
                    >
                    </yp-content-moderation>`
                  : nothing}
              `;
            case "group":
              return html`
                ${this.collection
                  ? html`<yp-content-moderation
                      .groupId="${this.collectionId as number}"
                    >
                    </yp-content-moderation>`
                  : nothing}
              `;
            default:
              return html``;
          }
        case "pages":
          switch (this.collectionType) {
            case "domain":
              return html`
                ${this.collection
                  ? html`<yp-pages-grid
                      .domainId="${this.collectionId as number}"
                    >
                    </yp-pages-grid>`
                  : nothing}
              `;
            case "community":
              return html`
                ${this.collection
                  ? html`<yp-pages-grid
                      .communityId="${this.collectionId as number}"
                    >
                    </yp-pages-grid>`
                  : nothing}
              `;
            case "group":
              return html`
                ${this.collection
                  ? html`<yp-pages-grid
                      .groupId="${this.collectionId as number}"
                    >
                    </yp-pages-grid>`
                  : nothing}
              `;
            default:
              return html``;
          }

        default:
          return html``;
      }
    } else {
      return nothing;
    }
  }

  async getCollection() {
    const collectionData = (await window.serverApi.getCollection(
      this.collectionType,
      this.collectionId as number
    )) as YpCollectionData | YpGroupResults;

    if (this.collectionType == "group") {
      this.collection = (collectionData as YpGroupResults).group;
    } else {
      this.collection = collectionData as YpCollectionData;
    }

    this._setAdminConfirmed();
  }

  async _setAdminFromParent() {
    switch (this.collectionType) {
      case "community":
        const communityParentCollection = await window.serverApi.getCollection(
          "domain",
          this.parentCollectionId as number
        );
        this._setAdminConfirmedFromParent(communityParentCollection);
        break;
      case "group":
        const groupParentCollection = await window.serverApi.getCollection(
          "community",
          this.parentCollectionId as number
        );
        this._setAdminConfirmedFromParent(groupParentCollection);
        break;
    }
  }

  _setAdminConfirmedFromParent(collection: YpCollectionData) {
    if (collection) {
      switch (this.collectionType) {
        case "community":
          this.adminConfirmed = YpAccessHelpers.checkDomainAccess(
            collection as YpDomainData
          );
          break;
        case "group":
          this.adminConfirmed = YpAccessHelpers.checkCommunityAccess(
            collection as YpCommunityData
          );
          break;
      }
    }
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

    if (
      this.collection &&
      this.haveCheckedAdminRights &&
      !this.adminConfirmed
    ) {
      this.fire("yp-network-error", { message: this.t("unauthorized") });
    }
  }

  getParentCollectionType() {
    switch (this.collectionType) {
      case "group":
        return "community";
      case "community":
        return "domain";
      default:
        return "";
    }
  }

  exitToMainApp() {
    this.active = false;
    if (this.collectionId === "new") {
      YpNavHelpers.redirectTo(
        `/${this.getParentCollectionType()}/${this.parentCollectionId}`
      );
    } else {
      YpNavHelpers.redirectTo(`/${this.collectionType}/${this.collectionId}`);
    }
  }

  override render() {
    return html`
      <div class="layout horizontal" ?hidden="${!this.adminConfirmed}">
        ${this.renderNavigationBar()}
        <div class="rightPanel">
          <main>
            <div class="mainPageContainer">${this._renderPage()}</div>
          </main>
        </div>
      </div>
      <md-linear-progress
        indeterminate
        ?hidden="${this.adminConfirmed}"
      ></md-linear-progress>
    `;
  }

  _isPageSelectedClass(page: AdminPageOptions) {
    if (page === this.page) {
      return "selectedContainer";
    } else {
      return "";
    }
  }

  _getListHeadline(type: AdminPageOptions) {
    if (type === "configuration") {
      if (this.collectionType === "domain") {
        return this.t("Domain Configuration");
      } else if (this.collectionType === "community") {
        return this.t("Community Configuration");
      } else if (this.collectionType === "group") {
        return this.t("Group Configuration");
      } else if (this.collectionType === "post") {
        return this.t("Yp Configuration");
      } else if (this.collectionType === "profile_image") {
        return this.t("Profile Image Configuration");
      }
    } else if (type === "translations") {
      return this.t("Translations");
    } else if (type === "reports") {
      return this.t("reports");
    } else if (type === "users") {
      return this.t("Users");
    } else if (type === "admins") {
      return this.t("Admins");
    } else if (type === "moderation") {
      return this.t("Moderation");
    } else if (type === "aiAnalysis") {
      return this.t("aiAnalysis");
    } else if (type == "pages") {
      return this.t("Pages");
    } else if (type == "groups") {
      return this.t("Groups");
    } else if (type == "communities") {
      return this.t("Communities");
    } else if (type == "user") {
      return this.t("Settings");
    } else if (type == "badges") {
      return this.t("Badges");
    } else if (type == "profile_images") {
      return this.t("Profile Images");
    } else if (type == "back") {
      if (this.collectionType === "community") {
        return this.t("Back to domain");
      } else if (this.collectionType === "group") {
        return this.t("Back to community");
      } else if (
        this.collectionType === "post" ||
        this.collectionType === "profile_image"
      ) {
        return this.t("Back to group");
      }
    }

    return "";
  }

  _getListSupportingText(type: AdminPageOptions) {
    if (type === "configuration") {
      if (this.collectionType === "domain") {
        return this.t("Configure your domain");
      } else if (this.collectionType === "community") {
        return this.t("Configure your community");
      } else if (this.collectionType === "group") {
        return this.t("Configure your group");
      } else if (this.collectionType === "post") {
        return this.t("Configure your yp");
      } else if (this.collectionType === "profile_image") {
        return this.t("Configure profile image");
      }
    } else if (type === "reports") {
      return this.t("reportsInfo");
    } else if (type === "translations") {
      if (this.collectionType === "domain") {
        return this.t("Translate your domain");
      } else if (this.collectionType === "community") {
        return this.t("Translate your community");
      } else if (this.collectionType === "group") {
        return this.t("Translate your group");
      } else if (this.collectionType === "post") {
        return this.t("Translate your yp");
      }
    } else if (type === "back") {
      if (this.collectionType === "community") {
        return this.t("Back to domain");
      } else if (this.collectionType === "group") {
        return this.t("Back to community");
      } else if (this.collectionType === "post") {
        return this.t("Back to group");
      } else if (this.collectionType === "profile_image") {
        return this.t("Back to group");
      }
    } else if (type === "users") {
      if (this.collectionType === "domain") {
        return this.t("Manage domain users");
      } else if (this.collectionType === "community") {
        return this.t("Manage community users");
      } else if (this.collectionType === "group") {
        return this.t("Manage group users");
      }
    } else if (type === "admins") {
      if (this.collectionType === "domain") {
        return this.t("Manage domain admins");
      } else if (this.collectionType === "community") {
        return this.t("Manage community admins");
      } else if (this.collectionType === "group") {
        return this.t("Manage group admins");
      }
    } else if (type === "aiAnalysis") {
      return this.t("aiAnalysis");
    } else if (type === "moderation") {
      if (this.collectionType === "domain") {
        return this.t("Moderate domain");
      } else if (this.collectionType === "community") {
        return this.t("Moderate community");
      } else if (this.collectionType === "group") {
        return this.t("Moderate group");
      }
    } else if (type === "pages") {
      if (this.collectionType === "domain") {
        return this.t("Manage domain pages");
      } else if (this.collectionType === "community") {
        return this.t("Manage community pages");
      } else if (this.collectionType === "group") {
        return this.t("Manage group pages");
      }
    } else if (type === "posts") {
      return this.t("Manage posts");
    } else if (type === "groups") {
      return this.t("Manage groups");
    } else if (type === "communities") {
      return this.t("Manage communities");
    } else if (type === "user") {
      return this.t("Theme, language, etc.");
    } else if (type === "badges") {
      return this.t("Manage badges");
    } else if (type === "profile_images") {
      return this.t("Manage profile images");
    }

    return "";
  }

  _getListIcon(type: AdminPageOptions) {
    if (type === "configuration") {
      return "settings";
    } else if (type === "translations") {
      return "translate";
    } else if (type === "reports") {
      return "reports";
    } else if (type === "users") {
      return "supervised_user_circle";
    } else if (type === "admins") {
      return "supervisor_account";
    } else if (type === "moderation") {
      return "checklist";
    } else if (type === "aiAnalysis") {
      return "document_scanner";
    } else if (type === "pages") {
      return "description";
    } else if (type === "posts") {
      return "rocket_launch";
    } else if (type === "groups") {
      return "videogroup_asset";
    } else if (type === "communities") {
      return "category";
    } else if (type === "badges") {
      return "workspace_premium";
    } else if (type === "profile_images") {
      return "supervised_user_circle";
    } else if (type === "user") {
      return "person";
    } else if (type === "back") {
      return "arrow_back";
    }

    return "";
  }

  setPage(type: AdminPageOptions) {
    if (this.collectionType === "group") {
      if (type == "back") {
        YpNavHelpers.redirectTo(
          `/admin/community/${this.parentCollectionId}/groups`
        );
      } else if (type == "profile_images") {
        YpNavHelpers.redirectTo(
          `/admin/group/${this.collectionId}/profile_images`
        );
      } else if (type == "posts") {
        YpNavHelpers.redirectTo(`/group/${this.collectionId}/posts`);
      } else {
        this.page = type;
      }
    } else if (this.collectionType === "community") {
      if (type == "back") {
        YpNavHelpers.redirectTo(
          `/admin/domain/${
            (this.collection as YpCommunityData).domain_id
          }/communities`
        );
      } else {
        this.page = type;
      }
    } else {
      this.page = type;
    }
  }

  renderMenuListItem(type: AdminPageOptions) {
    return html`
      <md-list-item
        type="button"
        @click="${() => this.setPage(type)}"
        class="${this._isPageSelectedClass(type)}"
      >
        <div slot="headline">${this._getListHeadline(type) || ""}</div>
        <div slot="supporting-text">
          ${this._getListSupportingText(type) || ""}
        </div>
        <md-icon slot="start">${this._getListIcon(type) || ""}</md-icon>
      </md-list-item>
    `;
  }

  renderNavigationBar() {
    if (this.wide) {
      return html`
        <div class="drawer">
          <div class="layout horizontal backContainer">
            <md-icon-button @click="${this.exitToMainApp}">
              <md-icon>close</md-icon>
            </md-icon-button>
          </div>
          <div
            class="layout horizontal headerContainer"
            ?hidden="${this.collectionId == "new"}"
          >
            <div class="analyticsHeaderText layout horizontal center-center">
              <div>
                <yp-image
                  class="collectionLogoImage"
                  sizing="contain"
                  .src="${this.collection
                    ? YpCollectionHelpers.logoImagePath(
                        this.collectionType,
                        this.collection
                      )
                    : ""}"
                ></yp-image>
              </div>
              <div class="collectionName">
                ${this.collection ? this.collection.name : ""}
              </div>
            </div>
          </div>

          <md-list>
            ${this.renderMenuListItem("configuration")}
            ${this.collectionId != "new"
              ? html`
                  ${this.collectionType !== "post"
                    ? html`
                        <md-divider></md-divider>

                        ${this.renderMenuListItem("users")}
                        ${this.renderMenuListItem("admins")}
                        ${this.renderMenuListItem("moderation")}
                        ${this.renderMenuListItem("pages")}
                        ${this.collectionType != "domain"
                          ? html`
                              ${this.renderMenuListItem("reports")}
                              ${this.renderMenuListItem("translations")}
                            `
                          : nothing}
                        ${this.renderMenuListItem("aiAnalysis")}
                      `
                    : html``}
                `
              : nothing}
          </md-list>
        </div>
      `;
    } else {
      return html`
        <div class="navContainer">
          <md-navigation-bar @navigation-bar-activated="${this.tabChanged}">
            <md-navigation-tab .label="${this.t("Config")}"
              ><md-icon slot="activeIcon">settings</md-icon>
              <md-icon slot="inactiveIcon"
                >rocket_launch</md-icon
              ></md-navigation-tab
            >

            <md-navigation-tab .label="${this.t("Moderation")}">
              <md-icon slot="activeIcon">checklist</md-icon>
              <md-icon slot="inactiveIcon">checklist</md-icon>
            </md-navigation-tab>

            <md-navigation-tab .label="${this.t("Users")}">
              <md-icon slot="activeIcon">group</md-icon>
              <md-icon slot="inactiveIcon">group</md-icon>
            </md-navigation-tab>

            <md-navigation-tab .label="${this.t("Admins")}">
              <md-icon slot="activeIcon">supervisor_account</md-icon>
              <md-icon slot="inactiveIcon">supervisor_account</md-icon>
            </md-navigation-tab>
          </md-navigation-bar>
        </div>
      `;
    }
  }
}
