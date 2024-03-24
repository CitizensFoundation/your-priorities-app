import { YpServerApiBase } from "./YpServerApiBase.js";
export declare class YpServerApiAdmin extends YpServerApiBase {
    adminMethod(url: string, method: string, body?: Record<string, unknown> | undefined): Promise<any>;
    removeUserFromOrganization(organizationId: number, userId: number): Promise<any>;
    removeAdmin(collection: string, collectionId: number, userId: number): Promise<any>;
    addAdmin(collection: string, collectionId: number, adminEmail: string): Promise<any>;
    inviteUser(collection: string, collectionId: number, inviteEmail: string, inviteType: string): Promise<any>;
    addUserToOrganization(organizationId: number, userId: number): Promise<any>;
    addCollectionItem(collectionId: number, collectionItemType: string, body: Record<string, unknown>): Promise<any>;
    updateTranslation(collectionType: string, collectionId: number, body: YpTranslationTextData): Promise<any>;
    getTextForTranslations(collectionType: string, collectionId: number, targetLocale: string): Promise<any>;
    addVideoToCollection(collectionId: number, body: Record<string, unknown>, type: string): Promise<any>;
    deleteImage(imageId: number, collectionType: string, collectionId: number): Promise<any>;
    deleteVideo(videoId: number, collectionType: string, collectionId: number): Promise<any>;
    getCommunityFolders(domainId: number): Promise<any>;
    getAnalyticsData(communityId: number, type: string, params: string): Promise<any>;
    getSsnListCount(communityId: number, ssnLoginListDataId: number): Promise<any>;
    deleteSsnLoginList(communityId: number, ssnLoginListDataId: number): Promise<any>;
}
//# sourceMappingURL=YpServerApiAdmin.d.ts.map