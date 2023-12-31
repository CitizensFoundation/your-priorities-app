import { YpCampaignApi } from '../yp-promotion/YpCampaignApi.js';
import { PlausibleBaseElementWithState } from '../pl-components/pl-base-element-with-state';
import './yp-campaign-analysis.js';
export declare class YpCampaignsAnalytics extends PlausibleBaseElementWithState {
    collectionType: string;
    collectionId: number;
    collection: YpCollectionData | undefined;
    campaigns: YpCampaignAnalyticsData[] | undefined;
    foundCampaigns: YpCampaignAnalyticsData[] | undefined;
    noData: boolean;
    campaignApi: YpCampaignApi;
    connectedCallback(): void;
    static get styles(): import("lit").CSSResult[];
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    getCampaigns(): Promise<void>;
    getSourceData(campaign: YpCampaignAnalyticsData, utmMediums: any): Promise<YpCampaignAnalyticsData>;
    renderCampaign(campaign: YpCampaignAnalyticsData): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=yp-campaigns-analytics.d.ts.map