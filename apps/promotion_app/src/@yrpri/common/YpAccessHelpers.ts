export class YpAccessHelpers {
  static _hasAdminRights(
    objectId: number,
    adminRights: Array<YpCollectionData>
  ): boolean {
    console.log(`YpAccessHelpers _hasAdminRights ${objectId} ${adminRights.length}`);
    return (
      adminRights.find((o: YpCollectionData) => {
        return o.id == objectId;
      }) != null
    );
  }

  static _hasAccess(
    object: YpCollectionData | YpImageData | YpPointData | YpPostData,
    objectId: number,
    adminRights: Array<YpCollectionData>
  ): boolean {
    console.log("_hasAccess 1")
    if (object) {
      console.log("_hasAccess 2")
      if (window.appUser && window.appUser.user) {
        console.log("_hasAccess 3")
        if (window.appUser.user.id == object.user_id) {
          console.log("_hasAccess 4")
          return true;
        } else if (object.User && window.appUser.user.id == object.User.id) {
          console.log("_hasAccess 5")
          return true;
        } else {
          console.log("_hasAccess 5")
          if (window.appUser.adminRights) {
            console.log("_hasAccess 6")
            return this._hasAdminRights(objectId, adminRights);
          } else {
            console.log("_hasAccess 7")
            return false;
          }
        }
      } else {
        return false;
      }
    } else if (!window.appUser) {
      console.log("_hasAccess 8")
      return false;
    } else {
      console.warn('No object in hasAccess');
      return false;
    }
  }

  static hasImageAccess(image: YpImageData, post: YpPostData): boolean {
    if (image && post && window.appUser && window.appUser.adminRights) {
      return this._hasAccess(
        image,
        post.group_id,
        window.appUser.adminRights.GroupAdmins
      );
    } else {
      return false;
    }
  }

  static checkPostAccess(post: YpPostData): boolean {
    if (post && window.appUser && window.appUser.adminRights) {
      return this._hasAccess(
        post,
        post.group_id,
        window.appUser.adminRights.GroupAdmins
      );
    }
    if (post && post.User && window.appUser && window.appUser.user) {
      return post.User.id === window.appUser.user.id;
    } else if (!post) {
      console.warn('No post in hasAccess');
      return false;
    } else {
      return false;
    }
  }

  static checkPointAccess(point: YpPointData): boolean {
    if (point && point.Post && window.appUser && window.appUser.adminRights) {
      return this._hasAccess(
        point,
        point.Post.group_id,
        window.appUser.adminRights.GroupAdmins
      );
    } else if (
      point &&
      window.appUser &&
      window.appUser.user &&
      window.appUser.user.id == point.user_id
    ) {
      return true;
    } else if (point) {
      return false;
    } else {
      //console.warn("No point in hasAccess");
      return false;
    }
  }

  static checkPostAdminOnlyAccess(post: YpPostData): boolean {
    if (post && window.appUser && window.appUser.adminRights) {
      return this._hasAdminRights(
        post.group_id,
        window.appUser.adminRights.GroupAdmins
      );
    } else if (post) {
      return false;
    } else {
      console.warn('No post in hasAccess');
      return false;
    }
  }

  static checkGroupAccess(group: YpGroupData): boolean {
    if (group && window.appUser && window.appUser.adminRights) {
      return this._hasAccess(
        group,
        group.id,
        window.appUser.adminRights.GroupAdmins
      );
    } else if (group) {
      return false;
    } else {
      console.warn('No group in hasAccess');
      return false;
    }
  }

  static checkCommunityAccess(community: YpCommunityData): boolean {
    if (community && window.appUser && window.appUser.adminRights) {
      return this._hasAccess(
        community,
        community.id,
        window.appUser.adminRights.CommunityAdmins
      );
    } else if (community) {
      return false;
    } else {
      console.warn('No community in hasAccess');
      return false;
    }
  }

  static checkDomainAccess(domain: YpDomainData): boolean {
    console.log('checkDomainAccess 1', domain);
    if (domain && window.appUser && window.appUser.adminRights) {
      console.log('checkDomainAccess 2', domain);
      return this._hasAccess(
        domain,
        domain.id,
        window.appUser.adminRights.DomainAdmins
      );
    } else if (domain) {
      console.log('checkDomainAccess 3', domain);
      return false;
    } else {
      console.warn('No domain in hasAccess');
      return false;
    }
  }

  static hasUserAccess(user: YpUserData): boolean {
    if (
      user &&
      window.appUser &&
      window.appUser.user &&
      window.appUser.user.id == user.id
    ) {
      return true;
    } else {
      return false;
    }
  }
}
