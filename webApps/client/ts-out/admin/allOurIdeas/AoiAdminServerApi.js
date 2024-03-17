import { YpServerApi } from "../../common/YpServerApi.js";
export class AoiAdminServerApi extends YpServerApi {
    constructor(urlPath = "/api/allOurIdeas") {
        super();
        this.baseUrlPath = urlPath;
    }
    async getChoices(domainId, communityId, questionId) {
        return this.fetchWrapper(this.baseUrlPath +
            `/${domainId || communityId}/choices/${questionId}${domainId ? "/throughDomain" : ""}?showAll=true`);
    }
    async submitIdeasForCreation(domainId, communityId, ideas, questionName) {
        return this.fetchWrapper(this.baseUrlPath +
            `/${domainId || communityId}/questions${domainId ? "/throughDomain" : ""}`, {
            method: "POST",
            body: JSON.stringify({
                ideas: ideas,
                question: questionName,
            }),
        }, true, undefined, true);
    }
    async startGenerateIdeas(question, domainId, communityId, wsClientSocketId, currentIdeas) {
        return this.fetchWrapper(this.baseUrlPath +
            `/${domainId || communityId}/generateIdeas${domainId ? "/throughDomain" : ""}`, {
            method: "PUT",
            body: JSON.stringify({
                currentIdeas,
                wsClientSocketId,
                question,
            }),
        }, true, undefined, true);
    }
    async updateChoice(domainId, communityId, questionId, choiceId, choiceData) {
        return this.fetchWrapper(this.baseUrlPath +
            `/${domainId || communityId}/questions/${questionId}/choices/${choiceId}${domainId ? "/throughDomain" : ""}`, {
            method: "PUT",
            body: JSON.stringify({
                data: choiceData,
            }),
        }, true, undefined, true);
    }
    async updateGroupChoice(groupId, questionId, choiceId, choiceData) {
        return this.fetchWrapper(this.baseUrlPath +
            `/${groupId}/questions/${questionId}/choices/${choiceId}/throughGroup`, {
            method: "PUT",
            body: JSON.stringify({
                data: choiceData,
            }),
        }, true, undefined, true);
    }
    async updateActive(domainId, communityId, questionId, choiceId, active) {
        return this.fetchWrapper(this.baseUrlPath +
            `/${domainId || communityId}/questions/${questionId}/choices/${choiceId}/active${domainId ? "/throughDomain" : ""}`, {
            method: "PUT",
            body: JSON.stringify({
                active,
            }),
        }, true, undefined, true);
    }
    async updateName(domainId, communityId, questionId, name) {
        return this.fetchWrapper(this.baseUrlPath +
            `/${domainId || communityId}/questions/${questionId}/name${domainId ? "/throughDomain" : ""}`, {
            method: "PUT",
            body: JSON.stringify({
                name,
            }),
        }, true, undefined, true);
    }
    async toggleIdeaActive(groupId, choiceId) {
        return this.fetchWrapper(this.baseUrlPath + `/${groupId}/choices/${choiceId}/toggleActive`, {
            method: "PUT",
            body: JSON.stringify({}),
        }, true, undefined, true);
    }
}
//# sourceMappingURL=AoiAdminServerApi.js.map