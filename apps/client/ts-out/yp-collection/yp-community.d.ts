import { YpCollection } from './yp-collection.js';
export declare class YpCommunity extends YpCollection {
    constructor();
    refresh(): void;
    _setupCommunitySaml(community: YpCommunityData): void;
    scrollToGroupItem(): void;
    _setupCommunityBackPath(community: YpCommunityData): void;
    scrollToCollectionItemSubClass(): void;
    _openHelpPageIfNeededOnce(): void;
    _hideMapIfNotUsedByGroups(): void;
}
//# sourceMappingURL=yp-community.d.ts.map