var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { YpBaseElement } from "../common/yp-base-element";
let YpDrawer = class YpDrawer extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.position = "left";
        this.transparentScrim = true;
    }
    static get styles() {
        return [
            super.styles,
            css `
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
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener("keydown", this._handleEscKey.bind(this));
        this.addEventListener("click", this._handleScrimClick);
        this.addGlobalListener("yp-close-all-drawers", this._closeAllDrawers.bind(this));
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener("keydown", this._handleEscKey.bind(this));
        this.removeEventListener("click", this._handleScrimClick);
        this.removeGlobalListener("yp-close-all-drawers", this._closeAllDrawers.bind(this));
    }
    _closeAllDrawers() {
        this.open = false;
    }
    updated(changedProperties) {
        if (changedProperties.has("open")) {
            if (this.open === true) {
                this.fire("opened");
                console.error("opened");
            }
            else if (this.open === false) {
                this.fire("closed");
                console.error("closed");
            }
        }
    }
    _handleScrimClick(event) {
        const scrim = this.shadowRoot.querySelector(".scrim");
        const path = event.composedPath();
        if (scrim && path.includes(scrim)) {
            this.open = false;
        }
    }
    _handleEscKey(event) {
        if (event.key === "Escape" && this.open) {
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
    customElement("yp-drawer")
], YpDrawer);
export { YpDrawer };
//# sourceMappingURL=yp-drawer.js.map