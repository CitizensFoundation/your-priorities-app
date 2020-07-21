import { sortBy, filter } from 'lodash-es';

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
}
