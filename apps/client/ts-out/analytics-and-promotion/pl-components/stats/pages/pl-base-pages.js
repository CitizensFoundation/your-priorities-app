var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as url from '../../util/url.js';
import * as api from '../../api.js';
import './../reports/pl-list-report.js';
import { property } from 'lit/decorators.js';
import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state.js';
export class PlausableBasePages extends PlausibleBaseElementWithState {
    connectedCallback() {
        super.connectedCallback();
    }
    fetchData() {
        return api.get(this.proxyUrl, url.apiPath(this.site, this.pagePath), this.query, { limit: 9 });
    }
    externalLinkDest(page) {
        return url.externalLinkForPage(this.site.domain, page.name);
    }
}
__decorate([
    property({ type: String })
], PlausableBasePages.prototype, "pagePath", void 0);
//# sourceMappingURL=pl-base-pages.js.map