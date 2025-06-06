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
import { YpNavHelpers } from "../common/YpNavHelpers";

interface BreadcrumbItem {
  name: string;
  url: string;
  isLink: boolean;
}

@customElement("yp-top-app-bar")
export class YpTopAppBar extends YpBaseElement {
  @state()
  private isTitleLong: boolean = false;

  @state()
  private isMenuOpen: boolean = false;

  @state()
  private domain: YpDomainData | undefined;

  @property({ type: Boolean })
  hideBreadcrumbs = false;

  @property({ type: Boolean })
  hideTitle = false;

  @property({ type: Boolean })
  restrictWidth = false;

  @property({ type: Boolean })
  disableDomainDropdown = true;

  @property({ type: Boolean })
  disableArrowBasedNavigation = false;

  @property({ type: Array })
  breadcrumbs: Array<{ name: string; url: string }> = [];

  @property({ type: Boolean })
  fixed = false;

  @property({ type: Boolean })
  useLowestContainerColor = false;

  @property({ type: String })
  backUrl: string | undefined;

  @property({ type: String })
  titleString: string = "";

  @property({ type: Array })
  myDomains: Array<YpShortDomainList> | undefined;

  private _boundHandleScroll = this.handleScroll.bind(this);
  private _boundOnDomainChanged = this._onDomainChanged.bind(this);
  private _boundOnMyDomainsLoaded = this._onMyDomainsLoaded.bind(this);

  get computedBreadcrumbs() {
    const domain = this.domain;
    if (!domain) {
      return this.breadcrumbs;
    }
    const domainUrl = `/domain/${domain.id}`;
    const domainName = domain.name;
    // Remove any existing domain entries from breadcrumbs
    const breadcrumbsWithoutDomain = this.breadcrumbs.filter(
      (crumb) => !(crumb.url === domainUrl || crumb.name === domainName)
    );
    // Return breadcrumbs with domain prepended
    return [{ name: domainName, url: domainUrl }, ...breadcrumbsWithoutDomain];
  }

  renderBreadcrumbsDropdown() {
    if (this.computedBreadcrumbs.length > 1 && !this.hideBreadcrumbs) {
      return html`
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
          ${this.computedBreadcrumbs.map(
            (crumb, index) => html`
              <md-menu-item @click=${() => this.redirectTo(crumb.url)}>
                ${crumb.name}
              </md-menu-item>
              ${index < this.computedBreadcrumbs.length - 1
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

  redirectTo(url: string) {
    YpNavHelpers.redirectTo(url);
    this.fireGlobal("yp-close-all-drawers");
    this.isMenuOpen = false;
  }

  renderMyDomainsDropdown() {
    if (this.disableDomainDropdown) {
      return html``;
    } else {
      if (this.myDomains && this.myDomains!.length > 1) {
        return html`
          <md-icon-button
            id="domainTrigger"
            @click="${this._toggleMenu}"
            ?hidden="${this.hideTitle}"
          >
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
            ${this.myDomains?.map(
              (domain, index) => html`
                <md-menu-item
                  @click=${() => this.redirectTo(`/domain/${domain.id}`)}
                >
                  ${domain.name}
                </md-menu-item>
                ${this.myDomains && index < this.myDomains.length - 1
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

        /* Restore this rule */
        slot[name="action"]::slotted(*) {
          display: flex;
          flex-direction: row;
          align-items: center;
          /* Default desktop margin */
          margin-left: 8px;
          margin-right: 8px;
        }

        @media (max-width: 480px) {
          .middleContainer {
            width: auto;
          }

          /* Restore this rule */
          slot[name="action"]::slotted(*) {
            margin-left: 4px;
            margin-right: 4px;
          }

          .title {
            margin-bottom: 4px;
          }

          .titleText {
            margin-left: 0;
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
    window.addEventListener("scroll", this._boundHandleScroll);
    this.addGlobalListener(
      "yp-domain-changed",
      this._boundOnDomainChanged
    );
    this.addGlobalListener(
      "yp-my-domains-loaded",
      this._boundOnMyDomainsLoaded
    );
  }

  override disconnectedCallback(): void {
    window.removeEventListener("scroll", this._boundHandleScroll);
    this.removeGlobalListener(
      "yp-domain-changed",
      this._boundOnDomainChanged
    );
    this.removeGlobalListener(
      "yp-my-domains-loaded",
      this._boundOnMyDomainsLoaded
    );
    super.disconnectedCallback();
  }

  private _onDomainChanged(event: CustomEvent) {
    if (
      event.detail &&
      event.detail.domain &&
      event.detail.domain.id &&
      event.detail.domain.id !== this.domain?.id
    ) {
      this.domain = event.detail.domain;
    }
  }

  private _onMyDomainsLoaded(event: CustomEvent) {
    this.myDomains = event.detail.domains;
  }

  handleScroll(): void {
    if (!this.fixed) {
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
  }

  override render(): TemplateResult {
    const appBarClass = this.isTitleLong
      ? "top-app-bar expanded"
      : "top-app-bar";

    let computedBreadcrumbs = this.computedBreadcrumbs.map((crumb) => ({
      ...crumb,
      isLink: true,
    }));

    let breadcrumbsWithTitle: Array<BreadcrumbItem>;

    const lastBreadcrumbName =
      computedBreadcrumbs.length > 0
        ? computedBreadcrumbs[computedBreadcrumbs.length - 1].name
        : null;

    let finalTitle = "";

    if (this.titleString && this.titleString !== lastBreadcrumbName) {
      finalTitle = this.titleString;
    } else if (lastBreadcrumbName) {
      finalTitle = lastBreadcrumbName;
      computedBreadcrumbs = computedBreadcrumbs.slice(0, -1); // Remove last breadcrumb if it's the same as titleString
    }

    if (!this.wide) {
      // On mobile, show only the parent (second to last breadcrumb) and the final title
      if (computedBreadcrumbs.length > 0) {
        breadcrumbsWithTitle = [
          computedBreadcrumbs[computedBreadcrumbs.length - 1],
        ];
        // Truncate the name if it's too long
        if (breadcrumbsWithTitle[0].name.length > 16) {
          breadcrumbsWithTitle[0].name =
            breadcrumbsWithTitle[0].name.substring(0, 17) + "...";
        }
      } else {
        breadcrumbsWithTitle = [];
      }
    } else if (this.disableArrowBasedNavigation) {
      // On desktop, show all breadcrumbs and the final title
      breadcrumbsWithTitle = [...computedBreadcrumbs];
      if (finalTitle) {
        breadcrumbsWithTitle.push({
          name: finalTitle,
          url: "",
          isLink: false,
        });
      }
    } else {
      if (computedBreadcrumbs.length > 0) {
        breadcrumbsWithTitle = [
          computedBreadcrumbs[computedBreadcrumbs.length - 1],
        ];
      } else {
        breadcrumbsWithTitle = [];
      }
    }

    // Ensure the last item is not a link if it's the final title derived from breadcrumbs
    if (
      breadcrumbsWithTitle.length > 0 &&
      !breadcrumbsWithTitle[breadcrumbsWithTitle.length - 1].isLink &&
      breadcrumbsWithTitle[breadcrumbsWithTitle.length - 1].name ===
        lastBreadcrumbName &&
      !(this.titleString && this.titleString !== lastBreadcrumbName)
    ) {
      // This logic seems redundant now with the separate finalTitle handling, review if needed.
    }

    return html`
      <div
        ?useLowestContainerColor="${this.useLowestContainerColor}"
        class="${appBarClass} layout"
        ?restrict-width="${this.restrictWidth}"
      >
        <div class="middleContainer" ?restrict-width="${this.restrictWidth}">
          <slot name="navigation"></slot>
          ${this.renderMyDomainsDropdown()}
          <div
            class="title ${this.isTitleLong ? "expanded" : ""}"
            ?hidden="${this.hideTitle || !this.wide}"
          >
            ${breadcrumbsWithTitle.map(
              (crumb, index) => html`
                ${crumb.isLink
                  ? html`
                      <div
                        class="titleText"
                        @click="${() => this.redirectTo(crumb.url)}"
                      >
                        ${crumb.name}
                      </div>
                    `
                  : html` <span class="titleText">${crumb.name}</span> `}
                ${index < breadcrumbsWithTitle.length - 1
                  ? html`<md-icon class="chevronIcon">chevron_right</md-icon>`
                  : ""}
              `
            )}
          </div>
          <div class="flex"></div>
          <slot name="action"></slot>
        </div>
      </div>
    `;
  }
}
