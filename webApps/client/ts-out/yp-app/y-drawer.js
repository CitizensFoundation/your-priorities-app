var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
let YpDrawer = class YpDrawer extends LitElement {
    constructor() {
        super();
        this.open = false;
        this.position = 'left';
        this.transparentScrim = true;
        this.addEventListener('click', this._handleScrimClick);
    }
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('keydown', this._handleEscKey.bind(this));
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('keydown', this._handleEscKey.bind(this));
    }
    _handleScrimClick(event) {
        const path = event.composedPath();
        if (path.includes(this.shadowRoot.querySelector('.scrim'))) {
            this.open = false;
        }
    }
    _handleEscKey(event) {
        if (event.key === 'Escape' && this.open) {
            this.open = false;
        }
    }
    render() {
        return html `
      <div class="scrim"></div>
      <div class="drawer-content">
        <slot></slot>
      </div>
    `;
    }
};
YpDrawer.styles = css `
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
__decorate([
    property({ type: Boolean, reflect: true })
], YpDrawer.prototype, "open", void 0);
__decorate([
    property({ type: String })
], YpDrawer.prototype, "position", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], YpDrawer.prototype, "transparentScrim", void 0);
YpDrawer = __decorate([
    customElement('yp-drawer')
], YpDrawer);
export { YpDrawer };
//# sourceMappingURL=y-drawer.js.map