import '../../../../@polymer/polymer/polymer.js';

export const ypPostMoveBehavior = {

  properties: {

    availableGroups: {
      type: Array,
      value: null
    }
  },

  _getGroupsResponse: function (event, detail) {
    if (detail.response) {
      var groups = [];
      groups = groups.concat(window.appUser.adminRights.GroupAdmins, window.appUser.memberships.GroupUsers);
      groups = groups.concat(detail.response.groups);
      groups = this._uniqueInDomain(groups, detail.response.domainId);
      this.set("availableGroups", groups);
    }
  },

  _uniqueInDomain: function (array, domainId) {
    var newArray = [];
    var ids = {};
    __.each(array, function (item) {
      if (!ids[item.id]) {
        ids[item.id] = item.id;
        if (!item.configuration) {
          item.configuration = {canAddNewPosts: true}
        }
        if (item.Community && item.Community.domain_id==domainId &&
           (item.configuration.canAddNewPosts || this._hasAdminRights(item.id, window.appUser.adminRights.GroupAdmins))) {
          newArray.push(item);
        } else {
          console.log("Ignoring group:"+item.name);
        }
      }
    }.bind(this));
    return newArray;
  }
};
