import { YpServerApiBase } from './YpServerApiBase.js';
export class YpServerApiAdmin extends YpServerApiBase {
    adminMethod(url, method, body = undefined) {
        if (["GET", "HEAD"].indexOf(method) > -1) {
            return this.fetchWrapper(url);
        }
        else {
            return this.fetchWrapper(url, {
                method: method,
                body: JSON.stringify(body || {}),
            }, false);
        }
    }
    removeUserFromOrganization(organizationId, userId) {
        return this.fetchWrapper(this.baseUrlPath +
            `/organizations/${organizationId}/${userId}/remove_user`, {
            method: 'DELETE',
            body: JSON.stringify({}),
        }, false);
    }
    removeAdmin(collection, collectionId, userId) {
        return this.fetchWrapper(this.baseUrlPath +
            `/${collection}/${collectionId}/${userId}/remove_admin`, {
            method: 'DELETE',
            body: JSON.stringify({}),
        }, false);
    }
    addAdmin(collection, collectionId, adminEmail) {
        return this.fetchWrapper(this.baseUrlPath +
            `/${collection}/${collectionId}/${adminEmail}/add_admin`, {
            method: 'POST',
            body: JSON.stringify({}),
        }, false);
    }
    inviteUser(collection, collectionId, inviteEmail, inviteType) {
        let query = "";
        if (inviteType == "addUserDirectly") {
            if (collection === "communities") {
                query = `?addToCommunityDirectly=1`;
            }
            else {
                query = `?addToGroupDirectly=1`;
            }
        }
        return this.fetchWrapper(this.baseUrlPath +
            `/${collection}/${collectionId}/${inviteEmail}/invite_user${query}`, {
            method: 'POST',
            body: JSON.stringify({}),
        }, true, undefined, true);
    }
    // add sibling
    // add followup promt for additional causes
    //
    addUserToOrganization(organizationId, userId) {
        return this.fetchWrapper(this.baseUrlPath +
            `/organizations/${organizationId}/${userId}/add_user`, {
            method: 'POST',
            body: JSON.stringify({}),
        }, false);
    }
    addCollectionItem(collectionId, collectionItemType, body) {
        return this.fetchWrapper(this.baseUrlPath +
            `/${YpServerApiAdmin.transformCollectionTypeToApi(collectionItemType)}/${collectionId}`, {
            method: 'POST',
            body: JSON.stringify(body),
        }, false);
    }
    updateTranslation(collectionType, collectionId, body) {
        return this.fetchWrapper(this.baseUrlPath +
            `/${YpServerApiAdmin.transformCollectionTypeToApi(collectionType)}/${collectionId}/update_translation`, {
            method: 'PUT',
            body: JSON.stringify(body),
        }, false);
    }
    getTextForTranslations(collectionType, collectionId, targetLocale) {
        return this.fetchWrapper(this.baseUrlPath +
            `/${YpServerApiAdmin.transformCollectionTypeToApi(collectionType)}/${collectionId}/get_translation_texts?targetLocale=${targetLocale}`);
    }
    addVideoToCollection(collectionId, body, type) {
        return this.fetchWrapper(this.baseUrlPath + `/videos/${collectionId}/${type}`, {
            method: 'PUT',
            body: JSON.stringify(body),
        }, false);
    }
    getCommunityFolders(domainId) {
        return this.fetchWrapper(this.baseUrlPath + `/domains/${domainId}/availableCommunityFolders`);
    }
    getAnalyticsData(communityId, type, params) {
        return this.fetchWrapper(this.baseUrlPath + `/communities/${communityId}/${type}/getPlausibleSeries?${params}`);
    }
    getSsnListCount(communityId, ssnLoginListDataId) {
        return this.fetchWrapper(this.baseUrlPath +
            `/communities/${communityId}/${ssnLoginListDataId}/ssn_login_list_count`);
    }
    deleteSsnLoginList(communityId, ssnLoginListDataId) {
        return this.fetchWrapper(this.baseUrlPath +
            `/communities/${communityId}/${ssnLoginListDataId}/ssn_login_list_count`, {
            method: 'DELETE',
            body: JSON.stringify({}),
        }, false);
    }
}
//# sourceMappingURL=YpServerApiAdmin.js.map