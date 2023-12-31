var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as url from '../../util/url.js';
import './../reports/pl-list-report.js';
import { customElement } from 'lit/decorators.js';
import { html } from 'lit';
import { PlausableBasePages } from './pl-base-pages.js';
let PlausableEntryPages = class PlausableEntryPages extends PlausableBasePages {
    constructor() {
        super();
        this.pagePath = '/entry-pages';
    }
    render() {
        return html `
      <pl-list-report
        .fetchDataFunction=${this.fetchData}
        .filter=${{ entry_page: 'name' }}
        .keyLabel=${this.t("Entry page")}
        .proxyUrl="${this.proxyUrl}"
        .valueLabel=${this.t("Unique Entrances")}
        valueKey="unique_entrances"
        .pagePath="${this.pagePath}"
        .timer="${this.timer}"
        .site="${this.site}"
        .detailsLink=${url.sitePath(this.site, this.pagePath)}
        .query=${this.query}
        .externalLinkDest=${this.externalLinkDest}
        color="bg-orange-50"
      ></pl-list-report>
    `;
    }
};
PlausableEntryPages = __decorate([
    customElement('pl-entry-pages')
], PlausableEntryPages);
export { PlausableEntryPages };
//# sourceMappingURL=pl-entry-pages.js.map