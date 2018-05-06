import '../../../../@polymer/polymer/polymer.js';

export const CollectionHelpers = {

  splitByStatus: function (items) {
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
