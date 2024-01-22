import { YpBaseElementWithLogin } from '../../common/yp-base-element-with-login';
import '@material/web/fab/fab.js';
import './yp-new-campaign.js';
import './yp-campaign.js';
import { YpCampaignApi } from './YpCampaignApi';
export declare class YpCampaignManager extends YpBaseElementWithLogin {
    collectionType: string;
    collectionId: number;
    collection: YpCollectionData | undefined;
    campaigns: YpCampaignData[] | undefined;
    private newCampaignElement;
    campaignApi: YpCampaignApi;
    campaignToDelete: number | undefined;
    firstUpdated(): void;
    newCampaign(): void;
    getTrackingUrl(campaign: YpCampaignData, medium: string): string;
    createCampaign(event: CustomEvent): Promise<void>;
    campaignConfigurationUpdated(event: CustomEvent): Promise<void>;
    getCampaigns(): Promise<void>;
    reallyDeleteCampaign(): Promise<void>;
    deleteCampaign(event: CustomEvent): void;
    cancelDeleteCampaign(): void;
    static get styles(): any[];
    renderDeleteConfirmationDialog(): import("lit-html").TemplateResult<1>;
    renderCampaign(campaign: YpCampaignData): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=yp-campaign-manager.d.ts.map