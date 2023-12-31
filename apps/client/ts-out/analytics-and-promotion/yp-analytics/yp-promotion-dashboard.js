var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import '../pl-components/pl-dashboard.js';
import './yp-realtime.js';
import './yp-historical.js';
import { PlausibleDashboard } from '../pl-components/pl-dashboard.js';
import { YpServerApi } from '../../common/YpServerApi.js';
let YpPromotionDashboard = class YpPromotionDashboard extends PlausibleDashboard {
    connectedCallback() {
        try {
            fetch('/api/users/has/PlausibleSiteName', {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                this.plausibleSiteName = data.plausibleSiteName;
                this.site = {
                    domain: this.plausibleSiteName,
                    hasGoals: true,
                    embedded: false,
                    offset: 1,
                    statsBegin: this.collection.created_at,
                    isDbip: false,
                    flags: {
                        custom_dimension_filter: false,
                    },
                };
                super.connectedCallback();
            });
        }
        catch (error) {
            console.error(error);
        }
    }
    static get styles() {
        return [css `
      :host {
        max-width: 1280px;
        width: 1280px;
      }
    `];
    }
    render() {
        if (this.site && this.query) {
            if (this.query.period === 'realtime') {
                return html `
          <yp-realtime
            .timer="${this.timer}"
            .site="${this.site}"
            .currentRole="${this.currentUserRole}"
            .query="${this.query}"
            .collectionType="${this.collectionType}"
            .collectionId="${this.collectionId}"
            .history="${this.history}"
            .proxyUrl="${`/api/${YpServerApi.transformCollectionTypeToApi(this.collectionType)}/${this.collectionId}/plausibleStatsProxy${this.useCommunityId ? `?communityId=${this.useCommunityId}` : ''}`}"
            proxyFaviconBaseUrl="/api/users/PlausibleFavIcon/"
          ></yp-realtime>
        `;
            }
            else {
                return html `
          <yp-historical
            .timer="${this.timer}"
            .site="${this.site}"
            .history="${this.history}"
            .currentRole="${this.currentUserRole}"
            .query="${this.query}"
            .collectionType="${this.collectionType}"
            .collectionId="${this.collectionId}"
            .proxyUrl="${`/api/${YpServerApi.transformCollectionTypeToApi(this.collectionType)}/${this.collectionId}/plausibleStatsProxy${this.useCommunityId ? `?communityId=${this.useCommunityId}` : ''}`}"
            proxyFaviconBaseUrl="/api/users/PlausibleFavIcon/"
          ></yp-historical>
        `;
            }
        }
        else {
            return nothing;
        }
    }
};
__decorate([
    property({ type: String })
], YpPromotionDashboard.prototype, "plausibleSiteName", void 0);
__decorate([
    property({ type: Object })
], YpPromotionDashboard.prototype, "collection", void 0);
__decorate([
    property({ type: String })
], YpPromotionDashboard.prototype, "collectionType", void 0);
__decorate([
    property({ type: Number })
], YpPromotionDashboard.prototype, "collectionId", void 0);
__decorate([
    property({ type: Number })
], YpPromotionDashboard.prototype, "useCommunityId", void 0);
YpPromotionDashboard = __decorate([
    customElement('yp-promotion-dashboard')
], YpPromotionDashboard);
export { YpPromotionDashboard };
//# sourceMappingURL=yp-promotion-dashboard.js.map