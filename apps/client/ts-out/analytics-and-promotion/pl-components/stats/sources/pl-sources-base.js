var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state';
import { ChevronDownIcon } from '../../pl-icons';
export const UTM_TAGS = {
    utm_medium: {
        label: 'UTM Medium',
        shortLabel: 'UTM Medium',
        endpoint: 'utm_mediums',
    },
    utm_source: {
        label: 'UTM Source',
        shortLabel: 'UTM Source',
        endpoint: 'utm_sources',
    },
    utm_campaign: {
        label: 'UTM Campaign',
        shortLabel: 'UTM Campai',
        endpoint: 'utm_campaigns',
    },
    utm_content: {
        label: 'UTM Content',
        shortLabel: 'UTM Conten',
        endpoint: 'utm_contents',
    },
    utm_term: {
        label: 'UTM Term',
        shortLabel: 'UTM Term',
        endpoint: 'utm_terms',
    },
};
export class PlausibleSourcesBase extends PlausibleBaseElementWithState {
    constructor() {
        super(...arguments);
        this.loading = false;
        this.open = false;
        this.alwaysShowNoRef = false;
    }
    fetchReferrers() { }
    updated(changedProperties) {
        if (changedProperties.has('tab')) {
            this.fire('tab-changed', this.tab);
        }
        if (changedProperties.has('tab') || changedProperties.get('query')) {
            this.fetchReferrers();
        }
    }
    toggleOpen() {
        this.open = !this.open;
    }
    get label() {
        if (this.query.period === 'realtime') {
            return this.t('Current visitors');
        }
        if (this.showConversionRate) {
            return this.t('Conversions');
        }
        return this.t('Visitors');
    }
    get showConversionRate() {
        return !!this.query.filters?.goal;
    }
    get showNoRef() {
        return this.alwaysShowNoRef || this.query.period === 'realtime';
    }
    setTab(tab) {
        this.tab = tab;
        this.open = false;
    }
    faviconUrl(referrer) {
        if (this.proxyFaviconBaseUrl) {
            return `${this.proxyFaviconBaseUrl}${encodeURIComponent(referrer)}`;
        }
        else {
            return `/favicon/sources/${encodeURIComponent(referrer)}`;
        }
    }
    static get styles() {
        return [...super.styles, css `

    `];
    }
    setAllTab() {
        this.fire('tab-changed', 'all');
        this.open = false;
    }
    renderTabs() {
        const activeClass = 'inline-block h-5 text-indigo-700 dark:text-indigo-500 font-bold active-prop-heading truncate text-left';
        const defaultClass = 'hover:text-indigo-600 cursor-pointer truncate text-left';
        const dropdownOptions = [
            'utm_medium',
            'utm_source',
            'utm_campaign',
            'utm_term',
            'utm_content',
        ];
        let buttonText = UTM_TAGS[this.tab]
            ? this.t(UTM_TAGS[this.tab].label)
            : this.t('UTM');
        return html `
      <div
        class="flex text-xs font-medium text-gray-500 dark:text-gray-400 space-x-2"
      >
        <div
          class=${this.tab === 'all' ? activeClass : defaultClass}
          @click=${this.setAllTab}
        >
          ${this.t("All")}
        </div>

        <div class="relative inline-block text-left">
          <div>
            <div
              class="inline-flex justify-between focus:outline-none"
              @click="${this.toggleOpen}"
            >
              <span
                style="width: ${buttonText == "UTM" ? "1.8rem" : "4.5rem"}"
                class="${this.tab.startsWith('utm_')
            ? activeClass
            : defaultClass}"
                >${buttonText}</span
              >
              <div class="-mr-1 ml-px h-4 w-4" aria-hidden="true">
                ${ChevronDownIcon}
              </div>
            </div>
          </div>

          <div
            ?hidden="${!this.open}"
            class="text-left origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          >
            <div class="py-1">
              ${dropdownOptions.map((option) => html `<span
                  @click="${() => this.setTab(option)}"
                  class="text-gray-700 dark:text-gray-200 block px-4 py-2 text-sm ${this.tab === option ? 'font-bold' : ''}"
                >
                  ${this.t(UTM_TAGS[option].label)}
                </span>`)}
            </div>
          </div>
        </div>
      </div>
    `;
    }
}
__decorate([
    property({ type: String })
], PlausibleSourcesBase.prototype, "tab", void 0);
__decorate([
    property({ type: Array })
], PlausibleSourcesBase.prototype, "referrers", void 0);
__decorate([
    property({ type: Boolean })
], PlausibleSourcesBase.prototype, "loading", void 0);
__decorate([
    property({ type: Boolean })
], PlausibleSourcesBase.prototype, "open", void 0);
__decorate([
    property({ type: Boolean })
], PlausibleSourcesBase.prototype, "alwaysShowNoRef", void 0);
//# sourceMappingURL=pl-sources-base.js.map