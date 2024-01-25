var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import * as storage from '../../util/storage.js';
import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state';
import './pl-sources-all.js';
import './pl-sources-utm.js';
import './pl-sources-referrers.js';
let PlausibleSourcesList = class PlausibleSourcesList extends PlausibleBaseElementWithState {
    constructor() {
        super(...arguments);
        this.alwaysShowNoRef = false;
    }
    connectedCallback() {
        super.connectedCallback();
        this.tabKey = 'sourceTab__' + this.site.domain;
        const storedTab = storage.getItem(this.tabKey);
        this.tab = storedTab || 'all';
    }
    tabChanged(e) {
        this.tab = e.detail;
        if (this.tab) {
            storage.setItem(this.tabKey, this.tab);
        }
    }
    render() {
        if (this.query.filters['source'] &&
            this.query.filters['source'] !== 'Direct / None') {
            return html `
        <pl-sources-referrers
          .tab=${this.tab}
          .proxyUrl=${this.proxyUrl}
          .proxyFaviconBaseUrl="${this.proxyFaviconBaseUrl}"
          .query=${this.query}
          .site=${this.site}
          .alwaysShowNoRef="${this.alwaysShowNoRef}"
          .timer="${this.timer}"
          @tab-changed=${this.tabChanged}
        ></pl-sources-referrers>
      `;
        }
        else if (this.tab === 'all') {
            return html `
        <pl-sources-all
          .tab=${this.tab}
          .proxyUrl=${this.proxyUrl}
          .proxyFaviconBaseUrl="${this.proxyFaviconBaseUrl}"
          .query=${this.query}
          .site=${this.site}
          .alwaysShowNoRef="${this.alwaysShowNoRef}"
          .timer="${this.timer}"
          @tab-changed=${this.tabChanged}
        ></pl-sources-all>
      `;
        }
        else {
            return html `
        <pl-sources-utm
          .tab=${this.tab}
          .proxyUrl=${this.proxyUrl}
          .proxyFaviconBaseUrl="${this.proxyFaviconBaseUrl}"
          .query=${this.query}
          .site=${this.site}
          .timer="${this.timer}"
          @tab-changed=${this.tabChanged}
        ></pl-sources-utm>
      `;
        }
    }
};
__decorate([
    property({ type: String })
], PlausibleSourcesList.prototype, "tabKey", void 0);
__decorate([
    property({ type: String })
], PlausibleSourcesList.prototype, "tab", void 0);
__decorate([
    property({ type: Boolean })
], PlausibleSourcesList.prototype, "alwaysShowNoRef", void 0);
PlausibleSourcesList = __decorate([
    customElement('pl-sources-list')
], PlausibleSourcesList);
export { PlausibleSourcesList };
//# sourceMappingURL=pl-sources-list.js.map