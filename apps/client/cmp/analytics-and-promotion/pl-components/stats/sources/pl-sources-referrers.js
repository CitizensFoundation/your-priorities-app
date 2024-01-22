var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement } from 'lit/decorators.js';
import * as api from '../../api.js';
import '../../pl-link.js';
import '../pl-bar.js';
import '../../pl-fade-in.js';
import { PlausibleSourcesAll } from './pl-sources-all';
let PlausibleSourcesReferres = class PlausibleSourcesReferres extends PlausibleSourcesAll {
    fetchReferrers() {
        this.loading = true;
        this.referrers = undefined;
        api
            .get(this.proxyUrl, `/api/stats/${encodeURIComponent(this.site.domain)}/referrers/${encodeURIComponent(this.query.filters["source"])}`, this.query, { show_noref: this.showNoRef })
            .then((res) => {
            this.loading = false;
            this.referrers = res;
        });
    }
};
PlausibleSourcesReferres = __decorate([
    customElement('pl-sources-referrers')
], PlausibleSourcesReferres);
export { PlausibleSourcesReferres };
//# sourceMappingURL=pl-sources-referrers.js.map