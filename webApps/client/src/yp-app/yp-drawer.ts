import { LitElement, html, css, CSSResult, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { YpBaseElement } from "../common/yp-base-element";

@customElement("yp-drawer")
export class YpDrawer extends YpBaseElement {
  @property({ type: Boolean, reflect: true })
  open: boolean | undefined;

  @property({ type: String })
  position: "left" | "right" = "left";

  @property({ type: Boolean, reflect: true })
  transparentScrim: boolean = true;

  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          --drawer-width: 256px;
          --drawer-background-color: var(
            --md-sys-color-surface-container-lowest
          ); /* Fallback to white if custom property is not defined */
          --scrim-background: rgba(0, 0, 0, 0.5);
          --scrim-transparent: rgba(0, 0, 0, 0);
          height: 100%;
          z-index: 9999;
        }
        .drawer-content {
          width: var(--drawer-width);
          height: 100%;
          position: fixed;
          opacity: 0;
          top: 0;
          bottom: 0;
          overflow-y: auto;
          transform: translateX(-100%);
          background-color: var(--md-sys-color-surface-container);
          z-index: 2;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        :host([position="left"]) .drawer-content {
          left: 0;
          right: auto;
          transform: translateX(-100%); /* Start off-screen to the left */
        }

        :host([position="right"]) .drawer-content {
          right: 0;
          transform: translateX(100%); /* Start off-screen to the right */
          overflow-y: initial;
        }

        :host([open]) .drawer-content {
          transform: translateX(0); /* Slide in */
          opacity: 1; /* Fade in */
          transition: opacity 0.3s ease, transform 0.3s ease; /* Apply transitions */
        }
        .scrim {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: transparent;
          z-index: 2;
          opacity: 0;
          pointer-events: none;
          visibility: hidden;
        }

        :host([open]) .scrim {
          background-color: var(--scrim-transparent);
          visibility: visible;
        }

        :host([open][transparentScrim]) .scrim {
          background-color: var(--scrim-transparent);
        }

        :host([open]) .scrim {
          opacity: 1;
          pointer-events: auto;
        }
      `,
    ];
  }

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("keydown", this._handleEscKey.bind(this));
    this.addEventListener("click", this._handleScrimClick);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this._handleEscKey.bind(this));
    this.removeEventListener("click", this._handleScrimClick);
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>): void {
    if (changedProperties.has("open")) {
      if (this.open===true) {
        this.fire("opened")
        console.error("opened")
      } else if (this.open===false) {
        this.fire("closed");
        console.error("closed")
      }
    }
  }

  private _handleScrimClick(event: MouseEvent): void {
    const scrim = this.shadowRoot!.querySelector(".scrim");
    const path = event.composedPath();
    if (scrim && path.includes(scrim)) {
      this.open = false;
    }
  }

  private _handleEscKey(event: KeyboardEvent): void {
    if (event.key === "Escape" && this.open) {
      this.open = false;
    }
  }

  override render(): TemplateResult {
    return html`
      <div class="scrim"></div>
      <div class="drawer-content">
        <slot></slot>
      </div>
    `;
  }
}
