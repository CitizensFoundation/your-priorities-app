import { YpServerApiBase } from "../@yrpri/common/YpServerApiBase";

export class YpCampaignApi extends YpServerApiBase {

  public createCampaign(collectionType: string, collectionId: number, body: YpCampaignData) {
    return this.fetchWrapper(
      this.baseUrlPath + `/${collectionType}/${collectionId}/create_campaign`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public updateCampaign(collectionType: string, collectionId: number, body: YpCampaignData) {
    return this.fetchWrapper(
      this.baseUrlPath + `/${collectionType}/${collectionId}/update_campaign`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public getCampaigns(collectionType: string, collectionId: number) {
    return this.fetchWrapper(
      this.baseUrlPath + `/${collectionType}/${collectionId}/get_campaigns`
    );
  }
}
