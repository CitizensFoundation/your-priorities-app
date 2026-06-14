import { YpMediaHelpers } from './YpMediaHelpers.js';

export class YpCollectionHelpers {
  private static defaultSortOrder = 100000;

  private static optionalSortOrder(item: YpCollectionData) {
    const optionalSortOrder = Number(item?.configuration?.optionalSortOrder);
    return Number.isFinite(optionalSortOrder) && optionalSortOrder > 0
      ? optionalSortOrder
      : this.defaultSortOrder;
  }

  private static shuffleItems(items: Array<YpCollectionData>) {
    const shuffledItems = [...items];

    for (let i = shuffledItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledItems[i], shuffledItems[j]] = [shuffledItems[j], shuffledItems[i]];
    }

    return shuffledItems;
  }

  static splitByStatus(
    items: Array<YpCollectionData>,
    containerConfig: YpCollectionConfiguration | undefined
  ): YpSplitCollectionsReturn {
    let orderedItems = [...items];

    if (containerConfig && containerConfig.orderByRandom) {
      orderedItems = this.shuffleItems(orderedItems);
    } else if (containerConfig && containerConfig.sortBySortOrder) {
      try {
        orderedItems = orderedItems.sort((a, b) => {
          return this.optionalSortOrder(a) - this.optionalSortOrder(b);
        });
      } catch (e) {
        console.error(e);
      }
    } else if (containerConfig && containerConfig.sortAlphabetically) {
      try {
        orderedItems = orderedItems.sort((a, b) => {
          return (a.name || '').localeCompare(b.name || '');
        });
      } catch (e) {
        console.error(e);
      }
    }

    return {
      active: orderedItems.filter(o => {
        return o.status == 'active' || o.status == 'hidden';
      }),
      archived: orderedItems.filter(o => {
        return o.status == 'archived';
      }),
      featured: orderedItems.filter(o => {
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
      case 'groupCommunityLink':
        return (collection as YpGroupData).CommunityLink!.CommunityLogoImages;
      case 'group':
      case 'groupDataViz':
        return (collection as YpGroupData).GroupLogoImages;
      default:
        return undefined;
    }
  }

  static nameTextType(collectionType: string | undefined): string | undefined {
    switch (collectionType) {
      case 'domain':
        return 'domainName';
      case 'community':
      case 'groupCommunityLink':
        return 'communityName';
      case 'group':
      case 'groupDataViz':
        return 'groupName';
      default:
        return undefined;
      }
  }

  static descriptionTextType(collectionType: string | undefined): string | undefined {
    switch (collectionType) {
      case 'domain':
        return 'domainContent';
      case 'community':
      case 'groupCommunityLink':
        return 'communityContent';
      case 'group':
        return 'groupContent';
      default:
        return undefined;
    }
  }
}
