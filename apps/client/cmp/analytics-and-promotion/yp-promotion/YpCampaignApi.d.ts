import { YpServerApiBase } from '../../common/YpServerApiBase';
export declare class YpCampaignApi extends YpServerApiBase {
    createCampaign(collectionType: string, collectionId: number, body: YpCampaignData): Promise<any>;
    updateCampaign(collectionType: string, collectionId: number, campaignId: number, body: YpCampaignData): Promise<any>;
    deleteCampaign(collectionType: string, collectionId: number, campaignId: number): Promise<any>;
    getCampaigns(collectionType: string, collectionId: number): Promise<any>;
}
//# sourceMappingURL=YpCampaignApi.d.ts.map