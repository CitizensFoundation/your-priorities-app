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
    async toggleIdeaActive(groupId, choiceId) {
        return this.fetchWrapper(this.baseUrlPath + `/${groupId}/choices/${choiceId}/toggleActive`, {
            method: "PUT",
            body: JSON.stringify({}),
        }, true, undefined, true);
    }
}
//# sourceMappingURL=AoiAdminServerApi.js.map