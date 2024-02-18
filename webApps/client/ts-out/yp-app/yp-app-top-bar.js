var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators";
let YpTopAppBar = class YpTopAppBar extends LitElement {
    constructor() {
        super();
        this.lastScrollY = 0; // Keep track of the last scroll position
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
                // Scrolling down, hide the app bar
                appBar.style.top = `-${getComputedStyle(this).getPropertyValue("--top-app-bar-height")}`;
            }
            else {
                // Scrolling up, show the app bar
                appBar.style.top = "0";
            }
        }
        this.lastScrollY = currentScrollY;
    }
    render() {
        return html `
      <div class="top-app-bar">
        <slot name="navigation"></slot>
        <span class="title"><slot name="title"></slot></span>
        <slot name="actions"></slot>
      </div>
    `;
    }
};
YpTopAppBar.styles = css `
    :host {
      --top-app-bar-height: 64px; /* Standard height for top app bars */
    }
    .top-app-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: var(--top-app-bar-height);
      padding: 0 16px;
      background-color: #6200ee; /* Example color */
      color: white;
      position: fixed; /* Make it overlay content */
      top: 0;
      left: 0;
      right: 0;
      transition: top 0.3s; /* Smooth transition for sliding effect */
      z-index: 100; /* Ensure it's above other content */
    }
  `;
YpTopAppBar = __decorate([
    customElement("yp-top-app-bar")
], YpTopAppBar);
export { YpTopAppBar };
//# sourceMappingURL=yp-app-top-bar.js.map