import { YpServerApiBase } from "../@yrpri/common/YpServerApiBase";

export class YpCampaignApi extends YpServerApiBase {

  public createCampaign(collectionType: string, collectionId: number, body: YpCampaignData) {
    return this.fetchWrapper(
      this.baseUrlPath + `/campaigns/${collectionType}/${collectionId}`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public getCommunityFolders(domainId: number) {
    return this.fetchWrapper(
      this.baseUrlPath + `/domains/${domainId}/availableCommunityFolders`
    );
  }

}
