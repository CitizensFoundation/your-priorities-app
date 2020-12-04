import { sortBy, filter } from 'lodash-es';
import { YpMediaHelpers } from './YpMediaHelpers.js';

export class YpCollectionHelpers {
  static splitByStatus(
    items: Array<YpCollectionData>,
    containerConfig: YpCollectionConfiguration | undefined
  ): YpSplitCollectionsReturn {
    if (containerConfig && containerConfig.sortBySortOrder) {
      try {
        items = sortBy(items, item => {
          return item?.configuration?.optionalSortOrder || 100000;
        });
      } catch (e) {
        console.error(e);
      }
    }

    return {
      active: filter(items, o => {
        return o.status == 'active' || o.status == 'hidden';
      }),
      archived: filter(items, o => {
        return o.status == 'archived';
      }),
      featured: filter(items, o => {
        return o.status == 'featured';
      }),
    };
  }

  static logoImagePath(collectionType: string | undefined, collection: YpCollectionData): string | undefined {
    return YpMediaHelpers.getImageFormatUrl(this.logoImages(collectionType, collection), 0);
  }

  static logoImages(collectionType: string | undefined, collection: YpCollectionData): Array<YpImageData> | undefined {
    switch (collectionType) {
      case 'domain':
        return (collection as YpDomainData).DomainLogoImages;
      case 'community':
        return (collection as YpCommunityData).CommunityLogoImages;
      case 'group':
        return (collection as YpGroupData).GroupLogoImages;
    }
  }

  static nameTextType(collectionType: string | undefined): string | undefined {
    switch (collectionType) {
      case 'domain':
        return 'domainName';
      case 'community':
        return 'communityName';
      case 'group':
        return 'groupName';
    }
  }

  static descriptionTextType(collectionType: string | undefined): string | undefined {
    switch (collectionType) {
      case 'domain':
        return 'domainContent';
      case 'community':
        return 'communityContent';
      case 'group':
        return 'groupContent';
    }
  }
}