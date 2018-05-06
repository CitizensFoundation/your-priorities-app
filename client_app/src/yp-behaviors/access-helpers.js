import '../../../../@polymer/polymer/polymer.js';

export const AccessHelpers = {

  _hasAdminRights: function(objectId, adminRights) {
    return __.find(adminRights, function(o) { return o.id == objectId; });
  },

  _hasAccess: function (object, objectId, adminRights) {
    if (object) {
      if (window.appUser && window.appUser.user) {
        if (window.appUser.user.id == object.user_id) {
          return true
        } else {
          if (window.appUser.adminRights) {
            return this._hasAdminRights(objectId, adminRights)
          } else {
            return false;
          }
        }
      } else {
        return false;
      }
    } else if (!window.appUser) {
      return false;
    } else {
      console.error("No object in hasAccess");
      return false;
    }
  },

  hasImageAccess: function (image, post) {
    if (image && post && window.appUser && window.appUser.adminRights) {
      return this._hasAccess(image, post.group_id, window.appUser.adminRights.GroupAdmins);
    }
  },

  checkPostAccess: function (post) {
    if (post && window.appUser && window.appUser.adminRights) {
      return this._hasAccess(post, post.group_id, window.appUser.adminRights.GroupAdmins);
    } else if (post) {
      return false;
    } else {
      console.error("No post in hasAccess");
      return false;
    }
  },

  checkPointAccess: function (point) {
    if (point && point.Post && window.appUser && window.appUser.adminRights) {
      return this._hasAccess(point, point.Post.group_id, window.appUser.adminRights.GroupAdmins);
    } else if (point && window.appUser && window.appUser.user && window.appUser.user.id==point.user_id) {
      return true;
    } else if (point) {
      return false;
    } else {
      //console.warn("No point in hasAccess");
      return false;
    }
  },

  checkPostAdminOnlyAccess: function (post) {
    if (post && window.appUser && window.appUser.adminRights) {
      return this._hasAdminRights(post.group_id, window.appUser.adminRights.GroupAdmins);
    } else if (post) {
      return false;
    } else {
      console.error("No post in hasAccess");
      return false;
    }
  },

  checkGroupAccess: function (group) {
    if (group && window.appUser && window.appUser.adminRights) {
      return this._hasAccess(group, group.id, window.appUser.adminRights.GroupAdmins);
    } else if (group) {
      return false;
    } else {
      console.error("No group in hasAccess");
      return false;
    }
  },

  checkCommunityAccess: function (community) {
    if (community && window.appUser && window.appUser.adminRights) {
      return this._hasAccess(community, community.id, window.appUser.adminRights.CommunityAdmins);
    } else if (community) {
      return false;
    } else {
      console.error("No community in hasAccess");
      return false;
    }
  },

  checkDomainAccess: function(domain) {
    if (domain && window.appUser && window.appUser.adminRights) {
      return this._hasAccess(domain, domain.id, window.appUser.adminRights.DomainAdmins);
    } else if (domain) {
      return false;
    } else {
      console.error("No domain in hasAccess");
      return false;
    }
  },

  hasUserAccess: function(user) {
    if (user && window.appUser && window.appUser.user && window.appUser.user.id == user.id) {
      return true
    } else {
      return false;
    }
  }

};
