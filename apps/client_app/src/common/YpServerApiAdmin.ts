import { YpServerApiBase } from './YpServerApiBase.js';

export class YpServerApiAdmin extends YpServerApiBase {
  public addCollectionItem(
    collectionId: number,
    collectionItemType: string,
    body: object
  ) {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/${YpServerApiAdmin.transformCollectionTypeToApi(
          collectionItemType
        )}/${collectionId}`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public updateTranslation(
    collectionType: string,
    collectionId: number,
    body: object
  ) {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/${YpServerApiAdmin.transformCollectionTypeToApi(
          collectionType
        )}/${collectionId}/update_translation`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public getTextForTranslations(collectionType: string, collectionId: number, targetLocale: string) {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/${YpServerApiAdmin.transformCollectionTypeToApi(
          collectionType
        )}/${collectionId}/get_translation_texts?targetLocale=${targetLocale}`
    );
  }

  public addVideoToDomain(
    collectionId: number,
    body: object
  ) {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/videos/${collectionId}/completeAndAddToDomain`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
      false
    );
  }

}
