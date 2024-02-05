import { YpServerApi } from "../../common/YpServerApi.js";
export class AoiAdminServerApi extends YpServerApi {
    constructor(urlPath = "/api/allOurIdeas") {
        super();
        this.baseUrlPath = urlPath;
    }
    async getChoices(communityId, questionId) {
        return this.fetchWrapper(this.baseUrlPath + `/${communityId}/choices/${questionId}?showAll=true`);
    }
    async submitIdeasForCreation(communityId, ideas, questionName) {
        return this.fetchWrapper(this.baseUrlPath + `/${communityId}/questions`, {
            method: "POST",
            body: JSON.stringify({
                ideas: ideas,
                question: questionName
            }),
        }, true, undefined, true);
    }
    async startGenerateIdeas(question, communityId, wsClientSocketId, currentIdeas) {
        return this.fetchWrapper(this.baseUrlPath + `/${communityId}/generateIdeas`, {
            method: "PUT",
            body: JSON.stringify({
                currentIdeas,
                wsClientSocketId,
                question
            }),
        }, true, undefined, true);
    }
    async updateChoice(communityId, questionId, choiceId, choiceData) {
        return this.fetchWrapper(this.baseUrlPath + `/${communityId}/questions/${questionId}/choices/${choiceId}`, {
            method: "PUT",
            body: JSON.stringify({
                data: choiceData
            }),
        }, true, undefined, true);
    }
    async updateGroupChoice(groupId, questionId, choiceId, choiceData) {
        return this.fetchWrapper(this.baseUrlPath + `/${groupId}/questions/${questionId}/choices/${choiceId}/throughGroup`, {
            method: "PUT",
            body: JSON.stringify({
                data: choiceData
            }),
        }, true, undefined, true);
    }
    async updateActive(communityId, questionId, choiceId, active) {
        return this.fetchWrapper(this.baseUrlPath + `/${communityId}/questions/${questionId}/choices/${choiceId}/active`, {
            method: "PUT",
            body: JSON.stringify({
                active
            }),
        }, true, undefined, true);
    }
    async updateName(communityId, questionId, name) {
        return this.fetchWrapper(this.baseUrlPath + `/${communityId}/questions/${questionId}/name`, {
            method: "PUT",
            body: JSON.stringify({
                name
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