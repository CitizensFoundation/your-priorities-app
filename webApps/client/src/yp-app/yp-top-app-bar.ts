import {
  LitElement,
  html,
  css,
  CSSResult,
  TemplateResult,
  PropertyValues,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("yp-top-app-bar")
export class YpTopAppBar extends LitElement {
  @state()
  private isTitleLong: boolean = false;

  @property({ type: String })
  titleString: string = "";

  static override styles: CSSResult = css`
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

    .title {
      flex-grow: 1; /* This will push the title to the left and actions to the right */
      text-align: left;
      margin-left: 4px;
      margin-bottom: 1px;
    }

    slot[name="action"]::slotted(*) {
      display: flex;
      flex-direction: row; /* This ensures that slotted action items are laid out in a row */
      align-items: center;
    }

    /* Media query for mobile devices */
    @media (max-width: 480px) {
      .title {
        margin-bottom: 4px;
      }

      .top-app-bar {
        /* Reset the padding here to avoid affecting the absolute positioning of the action slot */
        padding-top: 0;
        padding-bottom: 0;
        padding-left: 8px;
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
        right: 0; /* Adjust this value to match the desired spacing from the right edge */
        top: 4px;
        display: flex;
        align-items: center;
      }
    }
  `;

  private lastScrollY: number = 0;

  constructor() {
    super();
  }

  protected override updated(changedProperties: PropertyValues) {
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

  private handleScroll(): void {
    const currentScrollY: number = window.scrollY;
    const appBar: HTMLElement | null | undefined =
      this.shadowRoot?.querySelector(".top-app-bar");

    if (appBar) {
      if (currentScrollY > this.lastScrollY) {
        // Scrolling down, hide the app bar
        appBar.style.top = `-${getComputedStyle(this).getPropertyValue(
          "--top-app-bar-height"
        )}`;
      } else {
        // Scrolling up, show the app bar
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
      <div class="${appBarClass}">
        <slot name="navigation"></slot>
        <span class="title ${this.isTitleLong ? "expanded" : ""}"
          >${this.titleString}</span
        >
        <slot name="action"></slot>
      </div>
    `;
  }
}
