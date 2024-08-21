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
let YpTopAppBar = class YpTopAppBar extends YpBaseElement {
    renderBreadcrumbsDropdown() {
        if (this.breadcrumbs.length > 1 && !this.hideBreadcrumbs) {
            return html `
        <md-icon-button id="breadCrumbTrigger" @click="${this._toggleMenu}">
          <md-icon>stat_minus_1</md-icon>
        </md-icon-button>
        <md-menu
          id="breadcrumbMenu"
          anchor="breadCrumbTrigger"
          positioning="popover"
          .open="${this.isMenuOpen}"
          @closed="${this._onMenuClosed}"
          .menuCorner="${Corner.START_END}"
        >
          ${this.breadcrumbs.map((crumb, index) => html `
              <md-menu-item @click=${() => this.navigateTo(crumb.url)}>
                ${crumb.name}
              </md-menu-item>
              ${index < this.breadcrumbs.length - 1
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
    navigateTo(url) {
        window.history.pushState({}, "", url);
        window.dispatchEvent(new CustomEvent("location-changed"));
        this.isMenuOpen = false;
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

        .top-app-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: var(--top-app-bar-height);
          padding: 0 16px;
          background-color: var(--md-sys-color-surface);
          color: var(--md-sys-color-on-surface);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          transition: top 0.3s;
          z-index: 2000;
        }

        .top-app-bar[restrict-width] {
        }

        .middleContainer {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-left: 12px;
        }

        .middleContainer[restrict-width] {
          /*width: 982px;*/
        }

        .title {
          flex-grow: 1;
          text-align: left;
          margin-left: 6px;
          transform: translateY(-15%);
        }

        .title md-icon-button {
          transform: translateY(15%);
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

          .top-app-bar {
            padding-top: 0;
            padding-bottom: 0;
            padding-left: 16px;
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
        this.restrictWidth = false;
        this.titleString = "";
        this.breadcrumbs = [];
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
    }
    disconnectedCallback() {
        window.removeEventListener("scroll", this.handleScroll.bind(this));
        super.disconnectedCallback();
    }
    handleScroll() {
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
    render() {
        const appBarClass = this.isTitleLong
            ? "top-app-bar expanded"
            : "top-app-bar";
        return html `
      <div
        class="${appBarClass} layout center-center"
        ?restrict-width="${this.restrictWidth}"
      >
        <div class="middleContainer" ?restrict-width="${this.restrictWidth}">
          <slot name="navigation"></slot>
          <div class="title ${this.isTitleLong ? "expanded" : ""}">
            ${this.titleString}
            ${this.breadcrumbs.length > 0
            ? this.renderBreadcrumbsDropdown()
            : ""}
          </div>
          ${!this.restrictWidth ? html `<div class="flex"></div>` : nothing}
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
    property({ type: Boolean })
], YpTopAppBar.prototype, "hideBreadcrumbs", void 0);
__decorate([
    property({ type: Boolean })
], YpTopAppBar.prototype, "restrictWidth", void 0);
__decorate([
    property({ type: String })
], YpTopAppBar.prototype, "titleString", void 0);
__decorate([
    property({ type: Array })
], YpTopAppBar.prototype, "breadcrumbs", void 0);
YpTopAppBar = __decorate([
    customElement("yp-top-app-bar")
], YpTopAppBar);
export { YpTopAppBar };
//# sourceMappingURL=yp-top-app-bar.js.map