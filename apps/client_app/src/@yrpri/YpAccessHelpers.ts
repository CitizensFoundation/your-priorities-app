export class YpAccessHelpers {

  static _hasAdminRights(objectId: number, adminRights: Array<YpCollection>) {
    return adminRights.find((o: YpCollection) => { return o.id == objectId; });
  }

  static _hasAccess (object: YpCollection|YpImage|YpPoint|YpPost, objectId: number, adminRights: Array<YpCollection>) {
    if (object) {
      if (window.appUser && window.appUser.user) {
        if (window.appUser.user.id == object.user_id) {
          return true
        } else if (object.User && window.appUser.user.id == object.User.id) {
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
      console.warn("No object in hasAccess");
      return false;
    }
  }

  static hasImageAccess (image: YpImage, post: YpPost) {
    if (image && post && window.appUser && window.appUser.adminRights) {
      return this._hasAccess(image, post.group_id, window.appUser.adminRights.GroupAdmins);
    }
  }

  static checkPostAccess (post: YpPost) {
    if (post && window.appUser && window.appUser.adminRights) {
      return this._hasAccess(post, post.group_id, window.appUser.adminRights.GroupAdmins);
    } if (post && post.User && window.appUser && window.appUser.user) {
      return (post.User.id===window.appUser.user.id);
    } else {
      console.warn("No post in hasAccess");
      return false;
    }
  }

  static checkPointAccess (point: YpPoint) {
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
  }

  static checkPostAdminOnlyAccess (post: YpPost) {
    if (post && window.appUser && window.appUser.adminRights) {
      return this._hasAdminRights(post.group_id, window.appUser.adminRights.GroupAdmins);
    } else if (post) {
      return false;
    } else {
      console.warn("No post in hasAccess");
      return false;
    }
  }

  static checkGroupAccess (group: YpGroup) {
    if (group && window.appUser && window.appUser.adminRights) {
      return this._hasAccess(group, group.id, window.appUser.adminRights.GroupAdmins);
    } else if (group) {
      return false;
    } else {
      console.warn("No group in hasAccess");
      return false;
    }
  }

  static checkCommunityAccess (community: YpCommunity) {
    if (community && window.appUser && window.appUser.adminRights) {
      return this._hasAccess(community, community.id, window.appUser.adminRights.CommunityAdmins);
    } else if (community) {
      return false;
    } else {
      console.warn("No community in hasAccess");
      return false;
    }
  }

  static checkDomainAccess(domain: YpDomain) {
    if (domain && window.appUser && window.appUser.adminRights) {
      return this._hasAccess(domain, domain.id, window.appUser.adminRights.DomainAdmins);
    } else if (domain) {
      return false;
    } else {
      console.warn("No domain in hasAccess");
      return false;
    }
  }

  static hasUserAccess(user: YpUser) {
    if (user && window.appUser && window.appUser.user && window.appUser.user.id == user.id) {
      return true
    } else {
      return false;
    }
  }
}
