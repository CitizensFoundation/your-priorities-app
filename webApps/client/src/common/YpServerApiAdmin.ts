import { YpServerApiBase } from "./YpServerApiBase.js";

export class YpServerApiAdmin extends YpServerApiBase {
  public adminMethod(
    url: string,
    method: string,
    body: Record<string, unknown> | undefined = undefined
  ) {
    if (["GET", "HEAD"].indexOf(method) > -1) {
      return this.fetchWrapper(url);
    } else {
      return this.fetchWrapper(
        url,
        {
          method: method,
          body: JSON.stringify(body || {}),
        },
        false
      );
    }
  }

  public removeUserFromOrganization(organizationId: number, userId: number) {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/organizations/${organizationId}/${userId}/remove_user`,
      {
        method: "DELETE",
        body: JSON.stringify({}),
      },
      false
    );
  }

  public removeAdmin(collection: string, collectionId: number, userId: number) {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/${collection}/${collectionId}/${userId}/remove_admin`,
      {
        method: "DELETE",
        body: JSON.stringify({}),
      },
      false
    );
  }

  public addAdmin(
    collection: string,
    collectionId: number,
    adminEmail: string
  ) {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/${collection}/${collectionId}/${adminEmail}/add_admin`,
      {
        method: "POST",
        body: JSON.stringify({}),
      },
      false
    );
  }

  public inviteUser(
    collection: string,
    collectionId: number,
    inviteEmail: string,
    inviteType: string
  ) {
    let query = "";
    if (inviteType == "addUserDirectly") {
      if (collection === "communities") {
        query = `?addToCommunityDirectly=1`;
      } else {
        query = `?addToGroupDirectly=1`;
      }
    }

    return this.fetchWrapper(
      this.baseUrlPath +
        `/${collection}/${collectionId}/${inviteEmail}/invite_user${query}`,
      {
        method: "POST",
        body: JSON.stringify({}),
      },
      true,
      undefined,
      true
    );
  }

  // add sibling
  // add followup promt for additional causes
  //

  public addUserToOrganization(organizationId: number, userId: number) {
    return this.fetchWrapper(
      this.baseUrlPath + `/organizations/${organizationId}/${userId}/add_user`,
      {
        method: "POST",
        body: JSON.stringify({}),
      },
      false
    );
  }

  public addCollectionItem(
    collectionId: number,
    collectionItemType: string,
    body: Record<string, unknown>
  ) {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/${YpServerApiAdmin.transformCollectionTypeToApi(
          collectionItemType
        )}/${collectionId}`,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      false
    );
  }

  public updateTranslation(
    collectionType: string,
    collectionId: number,
    body: YpTranslationTextData
  ) {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/${YpServerApiAdmin.transformCollectionTypeToApi(
          collectionType
        )}/${collectionId}/update_translation`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      },
      false
    );
  }

  public getTextForTranslations(
    collectionType: string,
    collectionId: number,
    targetLocale: string
  ) {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/${YpServerApiAdmin.transformCollectionTypeToApi(
          collectionType
        )}/${collectionId}/get_translation_texts?targetLocale=${targetLocale}`
    );
  }

  public addVideoToCollection(
    collectionId: number,
    body: Record<string, unknown>,
    type: string
  ) {
    let fullType;

    if (type == "group") {
      fullType = "completeAndAddToGroup";
    } else if (type == "community") {
      fullType = "completeAndAddToCommunity";
    } else {
      fullType = "completeAndAddToDomain";
    }

    return this.fetchWrapper(
      this.baseUrlPath + `/videos/${collectionId}/${fullType}`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      },
      false
    );
  }

  async deleteImage(
    imageId: number,
    collectionType: string,
    collectionId: number,
    deleteByUserOnly = false,
    htmlImage = false
  ) {
    let fullType;
    if (collectionType == "group") {
      fullType = "deleteImageFromGroup";
    } else if (collectionType == "community") {
      fullType = "deleteImageFromCommunity";
    } else {
      fullType = "deleteImageFromDomain";
    }

    let queryParams = "";

    if (deleteByUserOnly && htmlImage) {
      queryParams = "removeByUserIdOnly=true&htmlImage=true";
    } else if (htmlImage) {
      queryParams = "htmlImage=true";
    } else if (deleteByUserOnly) {
      queryParams = "removeByUserIdOnly=true";
    }

    if (queryParams) {
      queryParams = "?" + queryParams;
    }

    return this.fetchWrapper(
      this.baseUrlPath +
        `/images/${collectionId}/${imageId}/${fullType}${queryParams}`,
      {
        method: "DELETE",
        body: JSON.stringify({}),
      },
      false
    );
  }

  async deleteVideo(
    videoId: number,
    collectionType: string,
    collectionId: number,
    deleteByUserOnly = false,
    htmlVideo = false
  ) {
    let queryParams = "";
    if (deleteByUserOnly && htmlVideo) {
      queryParams = "removeByUserIdOnly=true&htmlVideo=true";
    } else if (htmlVideo) {
      queryParams = "htmlVideo=true";
    } else if (deleteByUserOnly) {
      queryParams = "removeByUserIdOnly=true";
    }
    if (queryParams) {
      queryParams = "?" + queryParams;
    }
    let fullType;
    if (collectionType == "group") {
      fullType = "deleteVideoFromGroup";
    } else if (collectionType == "community") {
      fullType = "deleteVideoFromCommunity";
    } else {
      fullType = "deleteVideoFromDomain";
    }

    return this.fetchWrapper(
      this.baseUrlPath +
        `/videos/${collectionId}/${videoId}/${fullType}${queryParams}`,
      {
        method: "DELETE",
        body: JSON.stringify({}),
      },
      false
    );
  }

  public getCommunityFolders(domainId: number) {
    return this.fetchWrapper(
      this.baseUrlPath + `/domains/${domainId}/availableCommunityFolders`
    );
  }

  public getAnalyticsData(communityId: number, type: string, params: string) {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/communities/${communityId}/${type}/getPlausibleSeries?${params}`
    );
  }

  public getSsnListCount(communityId: number, ssnLoginListDataId: number) {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/communities/${communityId}/${ssnLoginListDataId}/ssn_login_list_count`
    );
  }

  public deleteSsnLoginList(communityId: number, ssnLoginListDataId: number) {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/communities/${communityId}/${ssnLoginListDataId}/ssn_login_list_count`,
      {
        method: "DELETE",
        body: JSON.stringify({}),
      },
      false
    );
  }
}
