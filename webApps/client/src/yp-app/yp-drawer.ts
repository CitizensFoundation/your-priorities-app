import { LitElement, html, css, CSSResult, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { YpBaseElement } from "../common/yp-base-element";

@customElement("yp-drawer")
export class YpDrawer extends YpBaseElement {
  @property({ type: Boolean, reflect: true })
  open: boolean = false;

  @property({ type: String })
  position: "left" | "right" = "left";

  @property({ type: Boolean, reflect: true })
  transparentScrim: boolean = true;

  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          margin-left: -8px;
          --drawer-width: 256px;
          --drawer-background-color: var(
            --md-sys-color-surface-container-lowest
          ); /* Fallback to white if custom property is not defined */
          --scrim-background: rgba(0, 0, 0, 0.5);
          --scrim-transparent: rgba(0, 0, 0, 0);
          height: 100%;
        }
        .drawer-content {
          width: var(--drawer-width);
          height: 100vh;
          position: fixed;
          opacity: 0;
          top: 0;
          bottom: 0;
          overflow-y: auto;
          background-color: var(--md-sys-color-surface-container);
          z-index: 2;
          transform: translateX(-100%);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        :host([position="right"]) .drawer-content {
          right: 0;
          left: 0; /* Ensure it does not stretch across the screen */
          transform: translateX(100%);
        }
        :host([open]) .drawer-content {
          transform: translateX(0);
          opacity: 1;
          transition: opacity 0.3s ease, transform 0.3s ease;
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
          transition: opacity 0.3s ease;
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
