import { YpServerApi } from "../../common/YpServerApi.js";
export declare class AoiServerApi extends YpServerApi {
    constructor(urlPath?: string);
    getEarl(groupId: number): AoiEarlResponse;
    getPrompt(groupId: number, questionId: number): Promise<AoiPromptData>;
    getSurveyResults(groupId: number): Promise<AoiResultData[]>;
    getSurveyAnalysis(groupId: number, analysisIndex: number, analysisTypeIndex: number): AnalysisTypeData;
    submitIdea(groupId: number, questionId: number, newIdea: string): AoiAddIdeaResponse;
    postVote(groupId: number, questionId: number, promptId: number, locale: string, body: AoiVoteData): AoiVoteResponse;
    postVoteSkip(groupId: number, questionId: number, promptId: number, locale: string, body: AoiVoteSkipData): AoiVoteResponse;
}
//# sourceMappingURL=AoiServerApi.d.ts.map