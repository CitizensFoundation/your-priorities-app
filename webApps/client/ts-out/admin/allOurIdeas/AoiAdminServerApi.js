import { YpServerApi } from "../../common/YpServerApi.js";
export class AoiAdminServerApi extends YpServerApi {
    constructor(urlPath = "/api/allOurIdeas") {
        super();
        this.baseUrlPath = urlPath;
    }
    async getChoices(groupId, questionId) {
        return this.fetchWrapper(this.baseUrlPath + `/${groupId}/choices/${questionId}.json`);
    }
    async submitIdeasForCreation(groupdId, ideas) {
        return this.fetchWrapper(this.baseUrlPath + `/${groupdId}/questions`, {
            method: "POST",
            body: JSON.stringify({
                ideas: ideas,
            }),
        }, false, undefined, true);
    }
    async startGenerateIdeas(groupId, wsClientId, currentIdeas) {
        return this.fetchWrapper(this.baseUrlPath + `/${groupId}/questions/generateIdeas`, {
            method: "PUT",
            body: JSON.stringify({
                ideas: currentIdeas,
                wsClientId: wsClientId,
            }),
        }, false, undefined, true);
    }
    async toggleIdeaActive(groupId, choiceId) {
        return this.fetchWrapper(this.baseUrlPath + `/${groupId}/choices/${choiceId}/toggleActive`, {
            method: "PUT",
            body: JSON.stringify({}),
        }, false, undefined, true);
    }
}
//# sourceMappingURL=AoiAdminServerApi.js.map