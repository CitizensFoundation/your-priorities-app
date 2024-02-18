import { LitElement, html, css, CSSResult, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('yp-drawer')
export class YpDrawer extends LitElement {
  @property({ type: Boolean, reflect: true })
  open: boolean = false;

  @property({ type: String })
  position: 'left' | 'right' = 'left';

  @property({ type: Boolean, reflect: true })
  transparentScrim: boolean = true;

  static override styles: CSSResult = css`
    :host {
      --drawer-width: 256px;
      --scrim-background: rgba(0, 0, 0, 0.5);
      --scrim-transparent: rgba(0, 0, 0, 0);
    }
    .drawer-content {
      width: var(--drawer-width);
      position: fixed;
      top: 0;
      bottom: 0;
      background-color: white;
      z-index: 2;
      transform: translateX(-100%);
      transition: transform 0.3s ease;
    }
    :host([position='right']) .drawer-content {
      right: 0;
      transform: translateX(100%);
    }
    :host([open]) .drawer-content {
      transform: translateX(0);
    }
    .scrim {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--scrim-background);
      z-index: 1;
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
  `;

  constructor() {
    super();
    this.addEventListener('click', this._handleScrimClick);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('keydown', this._handleEscKey.bind(this));
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this._handleEscKey.bind(this));
  }

  private _handleScrimClick(event: MouseEvent): void {
    const scrim = this.shadowRoot!.querySelector('.scrim');
    const path = event.composedPath();
    if (scrim && path.includes(scrim)) {
      this.open = false;
    }
  }

  private _handleEscKey(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.open) {
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
