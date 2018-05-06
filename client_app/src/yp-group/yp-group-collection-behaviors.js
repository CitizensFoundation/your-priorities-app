import '../../../../@polymer/polymer/polymer.js';

export const GroupCollectionBehaviors = {

  properties: {
    activeGroups: {
      type: Array,
      notify: true
    },

    featuredGroups: {
      type: Array
    },

    archivedGroups: {
      type: Array
    },

    groupsLength: {
      type: Number
    }
  },

  setupGroups: function (groups) {
    this.set('groupsLength', groups.length);
    var splitGroups = this.splitByStatus(groups);
    this.set('activeGroups', splitGroups.featured.concat(splitGroups.active.concat(splitGroups.archived)));
  }
};
