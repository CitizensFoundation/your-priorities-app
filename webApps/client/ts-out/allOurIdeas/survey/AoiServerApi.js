import { YpServerApi } from "../../common/YpServerApi.js";
export class AoiServerApi extends YpServerApi {
    constructor(urlPath = "/api/allOurIdeas") {
        super();
        this.baseUrlPath = urlPath;
    }
    getEarlData(groupId) {
        return this.fetchWrapper(this.baseUrlPath + `/${groupId}`);
    }
    async getPrompt(groupId, questionId) {
        return this.fetchWrapper(this.baseUrlPath + `/${groupId}/questions/${questionId}/prompt`);
    }
    async getSurveyResults(groupId) {
        return this.fetchWrapper(this.baseUrlPath + `/${groupId}/questions/results`);
    }
    getSurveyAnalysis(groupId, wsClientId, analysisIndex, analysisTypeIndex, languageName) {
        return this.fetchWrapper(this.baseUrlPath +
            `/${groupId}/questions/${wsClientId}/${analysisIndex}/${analysisTypeIndex}/analysis?languageName=${languageName}`);
    }
    async checkLogin() {
        if (window.appUser.loggedIn())
            return true;
        if (window.appGlobals.currentAnonymousGroup) {
            const user = (await window.serverApi.registerAnonymously({
                groupId: window.appGlobals.currentAnonymousGroup.id,
                trackingParameters: window.appGlobals.originalQueryParameters,
            }));
            if (user) {
                window.appUser.setLoggedInUser(user);
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    async submitIdea(groupId, questionId, newIdea) {
        if (await this.checkLogin()) {
            return this.fetchWrapper(this.baseUrlPath + `/${groupId}/questions/${questionId}/addIdea`, {
                method: "POST",
                body: JSON.stringify({ newIdea }),
            }, false);
        }
        else {
            window.appUser.openUserlogin();
            return null;
        }
    }
    async postVote(groupId, questionId, promptId, locale, body, direction) {
        if (await this.checkLogin()) {
            const url = new URL(`${window.location.protocol}//${window.location.host}${this.baseUrlPath}/${groupId}/questions/${questionId}/prompts/${promptId}/${direction == "skip" ? "skips" : "votes"}?locale=${locale}`);
            Object.keys(window.appGlobals.originalQueryParameters).forEach((key) => {
                if (key.startsWith("utm_")) {
                    url.searchParams.append(key, window.aoiAppGlobals.originalQueryParameters[key]);
                }
            });
            const browserId = window.appUser.getBrowserId();
            const browserFingerprint = window.appUser.browserFingerprint;
            const browserFingerprintConfidence = window.appUser.browserFingerprintConfidence;
            url.searchParams.append("checksum_a", browserId);
            url.searchParams.append("checksum_b", browserFingerprint);
            url.searchParams.append("checksum_c", browserFingerprintConfidence.toString());
            return this.fetchWrapper(url.toString(), {
                method: "POST",
                body: JSON.stringify(body),
            }, false);
        }
        else {
            window.appUser.openUserlogin();
            return null;
        }
    }
    async postVoteSkip(groupId, questionId, promptId, locale, body) {
        if (await this.checkLogin()) {
            const url = new URL(`${window.location.protocol}//${window.location.host}${this.baseUrlPath}/${groupId}/questions/${questionId}/prompts/${promptId}/skip.js?locale=${locale}`);
            Object.keys(window.appGlobals.originalQueryParameters).forEach((key) => {
                if (key.startsWith("utm_")) {
                    url.searchParams.append(key, window.aoiAppGlobals.originalQueryParameters[key]);
                }
            });
            const browserId = window.appUser.getBrowserId();
            const browserFingerprint = window.appUser.browserFingerprint;
            const browserFingerprintConfidence = window.appUser.browserFingerprintConfidence;
            url.searchParams.append("checksum_a", browserId);
            url.searchParams.append("checksum_b", browserFingerprint);
            url.searchParams.append("checksum_c", browserFingerprintConfidence.toString());
            return this.fetchWrapper(url.toString(), {
                method: "POST",
                body: JSON.stringify(body),
            }, false);
        }
        else {
            window.appUser.openUserlogin();
            return null;
        }
    }
    async getResults(groupId, questionId, showAll = false) {
        return this.fetchWrapper(this.baseUrlPath +
            `/${groupId}/choices/${questionId}/throughGroup${showAll ? "?showAll=1" : ""}`);
    }
    llmAnswerConverstation(groupId, wsClientId, chatLog, languageName) {
        return this.fetchWrapper(this.baseUrlPath + `/${groupId}/llmAnswerExplain`, {
            method: "PUT",
            body: JSON.stringify({
                wsClientId,
                chatLog,
                languageName,
            }),
        }, false);
    }
}
//# sourceMappingURL=AoiServerApi.js.map