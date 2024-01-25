var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { PlausibleBaseElement } from './pl-base-element';
let PlausibleMoreLink = class PlausibleMoreLink extends PlausibleBaseElement {
    static get styles() {
        return [...super.styles, css `
      span {
        text-transform: uppercase;
      }
    `];
    }
    render() {
        if (this.list.length > 0) {
            return html `
        <div hidden
          class="text-center w-full py-3 md:pb-3 md:pt-0 md:absolute md:bottom-0 md:left-0"
        >
          <pl-link
            .to=${this.url ||
                `/${encodeURIComponent(this.site.domain)}/${this.endpoint}${window.location.search}`}
            class="leading-snug font-bold text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition tracking-wide"
          >
            <svg
              class="feather mr-1"
              style=${{ marginTop: '-2px' }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"
              />
            </svg>
            <span>${this.t('details')}</span>
          </pl-link>
        </div>
      `;
        }
        else {
            return nothing;
        }
    }
};
__decorate([
    property({ type: String })
], PlausibleMoreLink.prototype, "url", void 0);
__decorate([
    property({ type: String })
], PlausibleMoreLink.prototype, "endpoint", void 0);
__decorate([
    property({ type: Object })
], PlausibleMoreLink.prototype, "site", void 0);
__decorate([
    property({ type: Array })
], PlausibleMoreLink.prototype, "list", void 0);
PlausibleMoreLink = __decorate([
    customElement('pl-more-link')
], PlausibleMoreLink);
export { PlausibleMoreLink };
//# sourceMappingURL=pl-more-link.js.map