var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, property } from 'lit/decorators.js';
import { html, nothing } from 'lit';
import * as storage from '../../util/storage.js';
import './../reports/pl-list-report.js';
import './pl-top-pages.js';
import './pl-entry-pages.js';
import './pl-exit-pages.js';
import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state.js';
let PlausablePages = class PlausablePages extends PlausibleBaseElementWithState {
    constructor() {
        super(...arguments);
        this.labelFor = {
            pages: 'Top Pages',
            'entry-pages': 'Entry Pages',
            'exit-pages': 'Exit Pages',
        };
    }
    connectedCallback() {
        super.connectedCallback();
        this.tabKey = `pageTab__${this.site.domain}`;
        this.mode = this.storedTab || 'pages';
    }
    setMode(mode) {
        storage.setItem(this.tabKey, mode);
        this.mode = mode;
    }
    renderContent() {
        switch (this.mode) {
            case 'entry-pages':
                return html `<pl-entry-pages
          .site=${this.site}
          .query=${this.query}
          .timer=${this.timer}
          .proxyUrl="${this.proxyUrl}"
        ></pl-entry-pages>`;
            case 'exit-pages':
                return html `<pl-exit-pages
          .site=${this.site}
          .query=${this.query}
          .timer=${this.timer}
          .proxyUrl="${this.proxyUrl}"
        ></pl-exit-pages>`;
            case 'pages':
            default:
                return html `<pl-top-pages
          .site=${this.site}
          .query=${this.query}
          .timer=${this.timer}
          .proxyUrl="${this.proxyUrl}"
        ></pl-top-pages>`;
        }
    }
    renderPill(name, mode) {
        const isActive = this.mode === mode;
        if (isActive) {
            return html `
        <li
          class="inline-block h-5 text-indigo-700 dark:text-indigo-500 font-bold active-prop-heading"
        >
          ${this.t(name)}
        </li>
      `;
        }
        else {
            return html `
        <li
          class="hover:text-indigo-600 cursor-pointer"
          @click=${() => this.setMode(mode)}
        >
          ${this.t(name)}
        </li>
      `;
        }
    }
    render() {
        if (this.site) {
            return html `
        <div
          class="stats-item flex flex-col w-full mt-6 stats-item--has-header"
        >
          <div
            class="stats-item-header flex flex-col flex-grow bg-white dark:bg-gray-825 shadow-xl rounded p-4 relative"
          >
            <div class="w-full flex justify-between" style="max-height: 40px !important">
              <h3 class="font-bold dark:text-gray-100">
                ${
            //@ts-ignore
            this.t(this.labelFor[this.mode]) || this.t('Page Visits')}
              </h3>
              <div class="flex"></div>
              <ul
                class="flex font-medium text-xs text-gray-500 dark:text-gray-400 space-x-2"
              >
                ${this.renderPill('Top Pages', 'pages')}
                ${this.renderPill('Entry Pages', 'entry-pages')}
                ${this.renderPill('Exit Pages', 'exit-pages')}
              </ul>
            </div>
            ${this.renderContent()}
          </div>
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
], PlausablePages.prototype, "tabKey", void 0);
__decorate([
    property({ type: String })
], PlausablePages.prototype, "storedTab", void 0);
__decorate([
    property({ type: String })
], PlausablePages.prototype, "mode", void 0);
PlausablePages = __decorate([
    customElement('pl-pages')
], PlausablePages);
export { PlausablePages };
//# sourceMappingURL=pl-pages.js.map