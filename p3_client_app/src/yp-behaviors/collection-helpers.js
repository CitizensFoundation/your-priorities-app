import '@polymer/polymer/polymer-legacy.js';

/**
 * @polymerBehavior Polymer.CollectionHelpers
 */
export const CollectionHelpers = {

  splitByStatus: function (items, containerConfig) {
    if (containerConfig && containerConfig.sortBySortOrder) {
      try {
        items = __.sortBy(items, function (item) {
          return item.configuration.optionalSortOrder | "100000";
        });
      } catch (e) {
        console.error(e);
      }
    }
    return {
      active: __.filter(items, function (o) {
        return o.status == 'active' || o.status == 'hidden';
      }),
      archived: __.filter(items, function (o) {
        return o.status == 'archived';
      }),
      featured: __.filter(items, function (o) {
        return o.status == 'featured';
      })
    }
  }
};
