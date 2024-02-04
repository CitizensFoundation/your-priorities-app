import { nothing } from 'lit';
import '../pl-components/pl-dashboard.js';
import './yp-realtime.js';
import './yp-historical.js';
import { PlausibleDashboard } from '../pl-components/pl-dashboard.js';
export declare class YpPromotionDashboard extends PlausibleDashboard {
    plausibleSiteName: string | undefined;
    collection: YpCollectionData;
    collectionType: string;
    collectionId: number | string;
    useCommunityId: number | undefined;
    connectedCallback(): void;
    static get styles(): import("lit").CSSResult[];
    render(): import("lit-html").TemplateResult<1> | typeof nothing;
}
//# sourceMappingURL=yp-promotion-dashboard.d.ts.map