import { YpServerApi } from '../../common/YpServerApi.js';
export class AoiServerApi extends YpServerApi {
    constructor(urlPath = '/api') {
        super();
        this.baseUrlPath = urlPath;
    }
    getEarl(earlName) {
        return this.fetchWrapper(this.baseUrlPath + `/earls/${earlName}.json`);
    }
    getSurveyResults(earlName) {
        return this.fetchWrapper(this.baseUrlPath + `/questions/${earlName}/results.json`);
    }
    getSurveyAnalysis(earlName, analysisIndex, analysisTypeIndex) {
        return this.fetchWrapper(this.baseUrlPath +
            `/questions/${earlName}/${analysisIndex}/${analysisTypeIndex}/analysis.json`);
    }
    submitIdea(questionId, newIdea) {
        return this.fetchWrapper(this.baseUrlPath + `/questions/${questionId}/add_idea.js`, {
            method: 'POST',
            body: JSON.stringify({ new_idea: newIdea }),
        }, false);
    }
    postVote(questionId, promptId, locale, body) {
        const url = new URL(`${window.location.protocol}//${window.location.host}${this.baseUrlPath}/questions/${questionId}/prompts/${promptId}/votes.js?locale=${locale}`);
        Object.keys(window.appGlobals.originalQueryParameters).forEach(key => {
            if (key.startsWith('utm_')) {
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
            method: 'POST',
            body: JSON.stringify(body),
        }, false);
    }
    postVoteSkip(questionId, promptId, locale, body) {
        return this.fetchWrapper(this.baseUrlPath +
            `/questions/${questionId}/prompts/${promptId}/skip.js?locale=${locale}`, {
            method: 'POST',
            body: JSON.stringify(body),
        }, false);
    }
}
//# sourceMappingURL=AoiServerApi.js.map