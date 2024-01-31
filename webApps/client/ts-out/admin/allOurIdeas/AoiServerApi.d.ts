import { YpServerApi } from '../../common/YpServerApi.js';
export declare class AoiServerApi extends YpServerApi {
    constructor(urlPath?: string);
    getEarl(earlName: string): AoiEarlResponse;
    getSurveyResults(earlName: string): AoiResultData[];
    getSurveyAnalysis(earlName: string, analysisIndex: number, analysisTypeIndex: number): AnalysisTypeData;
    submitIdea(questionId: number, newIdea: string): AoiAddIdeaResponse;
    postVote(questionId: number, promptId: number, locale: string, body: AoiVoteData): AoiVoteResponse;
    postVoteSkip(questionId: number, promptId: number, locale: string, body: AoiVoteSkipData): AoiVoteResponse;
}
//# sourceMappingURL=AoiServerApi.d.ts.map