import {
  LitElement,
  html,
  css,
  CSSResult,
  TemplateResult,
  PropertyValues,
  nothing,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "@material/web/iconbutton/icon-button.js";
import "@material/web/icon/icon.js";
import "@material/web/menu/menu.js";
import "@material/web/menu/menu-item.js";

import { YpBaseElement } from "../common/yp-base-element";
import { Corner } from "@material/web/menu/menu.js";

@customElement("yp-top-app-bar")
export class YpTopAppBar extends YpBaseElement {
  @state()
  private isTitleLong: boolean = false;

  @state()
  private isMenuOpen: boolean = false;

  @property({ type: Boolean })
  hideBreadcrumbs = false;

  @property({ type: String })
  titleString: string = "";

  @property({ type: Array })
  breadcrumbs: Array<{ name: string; url: string }> = [];

  renderBreadcrumbsDropdown() {
    if (this.breadcrumbs.length > 1 && !this.hideBreadcrumbs) {
      return html`
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
          ${this.breadcrumbs.map(
            (crumb, index) => html`
              <md-menu-item @click=${() => this.navigateTo(crumb.url)}>
                ${crumb.name}
              </md-menu-item>
              ${index < this.breadcrumbs.length - 1
                ? html`<md-divider></md-divider>`
                : ""}
            `
          )}
        </md-menu>
      `;
    } else {
      return nothing;
    }
  }

  navigateTo(url: string) {
    window.history.pushState({}, "", url);
    window.dispatchEvent(new CustomEvent("location-changed"));
    this.isMenuOpen = false;
  }

  private _toggleMenu(e: Event) {
    e.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  private _onMenuClosed() {
    this.isMenuOpen = false;
  }

  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          --top-app-bar-height: 48px;
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
          z-index: 1;
        }

        .middleContainer {
          width: 982px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-left: 12px;
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

  lastScrollY: number = 0;

  constructor() {
    super();
  }

  override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (changedProperties.has("titleString")) {
      this.isTitleLong = this.titleString.trim().length > 16;
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("scroll", this.handleScroll.bind(this));
  }

  override disconnectedCallback(): void {
    window.removeEventListener("scroll", this.handleScroll.bind(this));
    super.disconnectedCallback();
  }

  handleScroll(): void {
    const currentScrollY: number = window.scrollY;
    const appBar: HTMLElement | null | undefined =
      this.shadowRoot?.querySelector(".top-app-bar");

    if (appBar) {
      if (currentScrollY > this.lastScrollY) {
        appBar.style.top = `-${getComputedStyle(this).getPropertyValue(
          "--top-app-bar-height"
        )}`;
      } else {
        appBar.style.top = "0";
      }
    }

    this.lastScrollY = currentScrollY;
  }

  override render(): TemplateResult {
    const appBarClass = this.isTitleLong
      ? "top-app-bar expanded"
      : "top-app-bar";

    return html`
      <div class="${appBarClass} layout center-center">
        <div class="middleContainer">
          <slot name="navigation"></slot>
          <div class="title ${this.isTitleLong ? "expanded" : ""}">
            ${this.titleString}
            ${this.breadcrumbs.length > 0
              ? this.renderBreadcrumbsDropdown()
              : ""}
          </div>
          <slot name="action"></slot>
        </div>
      </div>
    `;
  }
}
