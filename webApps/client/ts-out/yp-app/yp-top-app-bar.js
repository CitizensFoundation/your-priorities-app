var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing, } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/icon/icon.js";
import "@material/web/menu/menu.js";
import "@material/web/menu/menu-item.js";
import { YpBaseElement } from "../common/yp-base-element";
import { Corner } from "@material/web/menu/menu.js";
import { YpNavHelpers } from "../common/YpNavHelpers";
let YpTopAppBar = class YpTopAppBar extends YpBaseElement {
    get computedBreadcrumbs() {
        const domain = this.domain;
        if (!domain) {
            return this.breadcrumbs;
        }
        const domainUrl = `/domain/${domain.id}`;
        const domainName = domain.name;
        // Remove any existing domain entries from breadcrumbs
        const breadcrumbsWithoutDomain = this.breadcrumbs.filter((crumb) => !(crumb.url === domainUrl || crumb.name === domainName));
        // Return breadcrumbs with domain prepended
        return [{ name: domainName, url: domainUrl }, ...breadcrumbsWithoutDomain];
    }
    renderBreadcrumbsDropdown() {
        if (this.computedBreadcrumbs.length > 1 && !this.hideBreadcrumbs) {
            return html `
        <md-icon-button id="breadCrumbTrigger" @click="${this._toggleMenu}">
          <md-icon>unfold_more</md-icon>
        </md-icon-button>
        <md-menu
          id="breadcrumbMenu"
          anchor="breadCrumbTrigger"
          positioning="popover"
          .open="${this.isMenuOpen}"
          @closed="${this._onMenuClosed}"
          .menuCorner="${Corner.START_END}"
        >
          ${this.computedBreadcrumbs.map((crumb, index) => html `
              <md-menu-item @click=${() => this.redirectTo(crumb.url)}>
                ${crumb.name}
              </md-menu-item>
              ${index < this.computedBreadcrumbs.length - 1
                ? html `<md-divider></md-divider>`
                : ""}
            `)}
        </md-menu>
      `;
        }
        else {
            return nothing;
        }
    }
    redirectTo(url) {
        YpNavHelpers.redirectTo(url);
        this.fireGlobal("yp-close-all-drawers");
        this.isMenuOpen = false;
    }
    renderMyDomainsDropdown() {
        if (this.myDomains && this.myDomains.length > 1) {
            return html `
        <md-icon-button id="domainTrigger" @click="${this._toggleMenu}" ?hidden="${this.hideTitle}">
          <md-icon>unfold_more</md-icon>
        </md-icon-button>
        <md-menu
          id="domainMenu"
          anchor="domainTrigger"
          positioning="popover"
          .open="${this.isMenuOpen}"
          @closed="${this._onMenuClosed}"
          .menuCorner="${Corner.START_END}"
        >
          ${this.myDomains.map((domain, index) => html `
              <md-menu-item
                @click=${() => this.redirectTo(`/domain/${domain.id}`)}
              >
                ${domain.name}
              </md-menu-item>
              ${this.myDomains && index < this.myDomains.length - 1
                ? html `<md-divider></md-divider>`
                : ""}
            `)}
        </md-menu>
      `;
        }
        else {
            return nothing;
        }
    }
    _toggleMenu(e) {
        e.stopPropagation();
        this.isMenuOpen = !this.isMenuOpen;
    }
    _onMenuClosed() {
        this.isMenuOpen = false;
    }
    static get styles() {
        return [
            super.styles,
            css `
        :host {
          --top-app-bar-height: 60px;
          --top-app-bar-expanded-height: 80px;
        }

        a {
          color: var(--md-sys-color-on-surface);
          text-decoration: none;
          margin: 0;
          padding: 0;
        }

        .top-app-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: var(--top-app-bar-height);
          padding: 0 16px;
          background-color: var(--md-sys-color-surface-container-low);
          color: var(--md-sys-color-on-surface);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          transition: top 0.3s;
          z-index: 1;
          max-width: 100vw;
        }

        .top-app-bar[useLowestContainerColor] {
          background-color: var(--md-sys-color-surface-container-lowest);
        }

        .top-app-bar[restrict-width] {
        }

        .middleContainer {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-left: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .middleContainer[restrict-width] {
          /*width: 982px;*/
        }

        .title {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .titleText {
          margin-right: 4px;
          margin-left: 8px;
          cursor: pointer;
        }

        .chevronIcon {
        }

        .title md-icon-button {
        }

        slot[name="action"]::slotted(*) {
          display: flex;
          flex-direction: row;
          align-items: center;
        }

        @media (max-width: 480px) {
          .title {
            margin-bottom: 4px;
          }

          .middleContainer {
            padding-left: 4px;
          }

          .top-app-bar {
            padding-top: 0;
            padding-bottom: 0;
            padding-left: 0;
            padding-right: 0;
            background: var(--md-sys-color-surface);
          }

          .top-app-bar.expanded {
            height: var(--top-app-bar-expanded-height);
            flex-direction: column;
            justify-content: center;
          }
          .top-app-bar {
            height: var(--top-app-bar-height);
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
          .top-app-bar.expanded {
            height: var(--top-app-bar-expanded-height);
            flex-direction: column;
            justify-content: center;
            align-items: start;
          }

          .title.expanded {
            order: 2;
            margin-left: 12px;
            margin-bottom: 0;
            margin-top: 6px;
          }

          .pathTitles {
          }

          slot[name="action"] {
            position: absolute;
            right: 0;
            top: 4px;
            display: flex;
            align-items: center;
          }
        }
      `,
        ];
    }
    constructor() {
        super();
        this.isTitleLong = false;
        this.isMenuOpen = false;
        this.hideBreadcrumbs = false;
        this.hideTitle = false;
        this.restrictWidth = false;
        this.disableArrowBasedNavigation = false;
        this.breadcrumbs = [];
        this.fixed = false;
        this.useLowestContainerColor = false;
        this.titleString = "";
        this.lastScrollY = 0;
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("titleString")) {
            this.isTitleLong = this.titleString.trim().length > 16;
        }
    }
    connectedCallback() {
        super.connectedCallback();
        window.addEventListener("scroll", this.handleScroll.bind(this));
        this.addGlobalListener("yp-domain-changed", this._onDomainChanged.bind(this));
        this.addGlobalListener("yp-my-domains-loaded", this._onMyDomainsLoaded.bind(this));
    }
    disconnectedCallback() {
        window.removeEventListener("scroll", this.handleScroll.bind(this));
        this.removeGlobalListener("yp-domain-changed", this._onDomainChanged.bind(this));
        this.removeGlobalListener("yp-my-domains-loaded", this._onMyDomainsLoaded.bind(this));
        super.disconnectedCallback();
    }
    _onDomainChanged(event) {
        if (event.detail &&
            event.detail.domain &&
            event.detail.domain.id &&
            event.detail.domain.id !== this.domain?.id) {
            this.domain = event.detail.domain;
        }
    }
    _onMyDomainsLoaded(event) {
        this.myDomains = event.detail.domains;
    }
    handleScroll() {
        if (!this.fixed) {
            const currentScrollY = window.scrollY;
            const appBar = this.shadowRoot?.querySelector(".top-app-bar");
            if (appBar) {
                if (currentScrollY > this.lastScrollY) {
                    appBar.style.top = `-${getComputedStyle(this).getPropertyValue("--top-app-bar-height")}`;
                }
                else {
                    appBar.style.top = "0";
                }
            }
            this.lastScrollY = currentScrollY;
        }
    }
    render() {
        const appBarClass = this.isTitleLong
            ? "top-app-bar expanded"
            : "top-app-bar";
        const computedBreadcrumbs = this.computedBreadcrumbs.map((crumb) => ({
            ...crumb,
            isLink: true,
        }));
        let breadcrumbsWithTitle = [...computedBreadcrumbs];
        const lastBreadcrumbName = computedBreadcrumbs.length > 0
            ? computedBreadcrumbs[computedBreadcrumbs.length - 1].name
            : null;
        if (this.titleString && this.titleString !== lastBreadcrumbName) {
            breadcrumbsWithTitle.push({
                name: this.titleString,
                url: "",
                isLink: false,
            });
        }
        return html `
      <div ?useLowestContainerColor="${this.useLowestContainerColor}"
        class="${appBarClass} layout"
        ?restrict-width="${this.restrictWidth}"
      >
        <div class="middleContainer" ?restrict-width="${this.restrictWidth}" >
          <slot name="navigation"></slot>
          ${this.renderMyDomainsDropdown()}
          <div class="title ${this.isTitleLong ? "expanded" : ""}" ?hidden="${this.hideTitle}">
            ${breadcrumbsWithTitle.map((crumb, index) => html `
                ${crumb.isLink
            ? html `
                      <div
                        class="titleText"
                        @click="${() => this.redirectTo(crumb.url)}"
                      >
                        ${crumb.name}
                      </div>
                    `
            : html ` <span class="titleText">${crumb.name}</span> `}
                ${index < breadcrumbsWithTitle.length - 1
            ? html `<md-icon class="chevronIcon">chevron_right</md-icon>`
            : ""}
              `)}
          </div>
          <div class="flex"></div>
          <slot name="action"></slot>
        </div>
      </div>
    `;
    }
};
__decorate([
    state()
], YpTopAppBar.prototype, "isTitleLong", void 0);
__decorate([
    state()
], YpTopAppBar.prototype, "isMenuOpen", void 0);
__decorate([
    state()
], YpTopAppBar.prototype, "domain", void 0);
__decorate([
    property({ type: Boolean })
], YpTopAppBar.prototype, "hideBreadcrumbs", void 0);
__decorate([
    property({ type: Boolean })
], YpTopAppBar.prototype, "hideTitle", void 0);
__decorate([
    property({ type: Boolean })
], YpTopAppBar.prototype, "restrictWidth", void 0);
__decorate([
    property({ type: Boolean })
], YpTopAppBar.prototype, "disableArrowBasedNavigation", void 0);
__decorate([
    property({ type: Array })
], YpTopAppBar.prototype, "breadcrumbs", void 0);
__decorate([
    property({ type: Boolean })
], YpTopAppBar.prototype, "fixed", void 0);
__decorate([
    property({ type: Boolean })
], YpTopAppBar.prototype, "useLowestContainerColor", void 0);
__decorate([
    property({ type: String })
], YpTopAppBar.prototype, "backUrl", void 0);
__decorate([
    property({ type: String })
], YpTopAppBar.prototype, "titleString", void 0);
__decorate([
    property({ type: Array })
], YpTopAppBar.prototype, "myDomains", void 0);
YpTopAppBar = __decorate([
    customElement("yp-top-app-bar")
], YpTopAppBar);
export { YpTopAppBar };
//# sourceMappingURL=yp-top-app-bar.js.map