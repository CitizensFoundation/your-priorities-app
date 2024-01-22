export declare class YpAccessHelpers {
    static _hasAdminRights(objectId: number, adminRights: Array<YpCollectionData>): boolean;
    static _hasPromoterAccess(object: YpCollectionData | YpImageData | YpPointData | YpPostData, objectId: number, promoterRights: Array<YpCollectionData>): boolean;
    static checkGroupPromoterAccess(group: YpGroupData): boolean;
    static checkCommunityPromoterAccess(community: YpCommunityData): boolean;
    static _hasAccess(object: YpCollectionData | YpImageData | YpPointData | YpPostData, objectId: number, adminRights: Array<YpCollectionData>): boolean;
    static hasImageAccess(image: YpImageData, post: YpPostData): boolean;
    static checkPostAccess(post: YpPostData): boolean;
    static checkPointAccess(point: YpPointData): boolean;
    static checkPostAdminOnlyAccess(post: YpPostData): boolean;
    static checkGroupAccess(group: YpGroupData): boolean;
    static checkCommunityAccess(community: YpCommunityData): boolean;
    static checkDomainAccess(domain: YpDomainData): boolean;
    static hasUserAccess(user: YpUserData): boolean;
}
//# sourceMappingURL=YpAccessHelpers.d.ts.map