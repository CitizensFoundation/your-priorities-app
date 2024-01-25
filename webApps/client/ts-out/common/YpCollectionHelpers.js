import { YpMediaHelpers } from './YpMediaHelpers.js';
export class YpCollectionHelpers {
    static splitByStatus(items, containerConfig) {
        if (containerConfig && containerConfig.sortBySortOrder) {
            try {
                items = items.sort(item => {
                    return item?.configuration?.optionalSortOrder || 100000;
                });
            }
            catch (e) {
                console.error(e);
            }
        }
        return {
            active: items.filter(o => {
                return o.status == 'active' || o.status == 'hidden';
            }),
            archived: items.filter(o => {
                return o.status == 'archived';
            }),
            featured: items.filter(o => {
                return o.status == 'featured';
            }),
        };
    }
    static logoImagePath(collectionType, collection) {
        return YpMediaHelpers.getImageFormatUrl(this.logoImages(collectionType, collection), 0);
    }
    static logoImages(collectionType, collection) {
        switch (collectionType) {
            case 'domain':
                return collection.DomainLogoImages;
            case 'community':
                return collection.CommunityLogoImages;
            case 'groupCommunityLink':
                return collection.CommunityLink.CommunityLogoImages;
            case 'group':
            case 'groupDataViz':
                return collection.GroupLogoImages;
            default:
                return undefined;
        }
    }
    static nameTextType(collectionType) {
        switch (collectionType) {
            case 'domain':
                return 'domainName';
            case 'community':
            case 'groupCommunityLink':
                return 'communityName';
            case 'group':
            case 'groupDataViz':
                return 'groupName';
            default:
                return undefined;
        }
    }
    static descriptionTextType(collectionType) {
        switch (collectionType) {
            case 'domain':
                return 'domainContent';
            case 'community':
            case 'groupCommunityLink':
                return 'communityContent';
            case 'group':
                return 'groupContent';
            default:
                return undefined;
        }
    }
}
//# sourceMappingURL=YpCollectionHelpers.js.map