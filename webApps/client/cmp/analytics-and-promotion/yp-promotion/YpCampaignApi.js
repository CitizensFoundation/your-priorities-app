import { YpServerApiBase } from '../../common/YpServerApiBase';
export class YpCampaignApi extends YpServerApiBase {
    createCampaign(collectionType, collectionId, body) {
        return this.fetchWrapper(this.baseUrlPath +
            `/${YpCampaignApi.transformCollectionTypeToApi(collectionType)}/${collectionId}/create_campaign`, {
            method: 'POST',
            body: JSON.stringify(body),
        }, false);
    }
    updateCampaign(collectionType, collectionId, campaignId, body) {
        return this.fetchWrapper(this.baseUrlPath +
            `/${YpCampaignApi.transformCollectionTypeToApi(collectionType)}/${collectionId}/${campaignId}/update_campaign`, {
            method: 'PUT',
            body: JSON.stringify(body),
        }, false);
    }
    deleteCampaign(collectionType, collectionId, campaignId) {
        return this.fetchWrapper(this.baseUrlPath +
            `/${YpCampaignApi.transformCollectionTypeToApi(collectionType)}/${collectionId}/${campaignId}/delete_campaign`, {
            method: 'DELETE',
            body: JSON.stringify({}),
        }, false);
    }
    getCampaigns(collectionType, collectionId) {
        return this.fetchWrapper(this.baseUrlPath +
            `/${YpCampaignApi.transformCollectionTypeToApi(collectionType)}/${collectionId}/get_campaigns`);
    }
}
//# sourceMappingURL=YpCampaignApi.js.map