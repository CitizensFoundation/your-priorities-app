import { YpServerApi } from "../../common/YpServerApi.js";
export declare class AoiServerApi extends YpServerApi {
    constructor(urlPath?: string);
    getEarlData(groupId: number): AoiEarlResponse;
    getPrompt(groupId: number, questionId: number): Promise<AoiPromptData>;
    getSurveyResults(groupId: number): Promise<AoiChoiceData[]>;
    getSurveyAnalysis(groupId: number, wsClientId: string, analysisIndex: number, analysisTypeIndex: number, languageName: string): AoiAnalysisResponse;
    submitIdea(groupId: number, questionId: number, newIdea: string): AoiAddIdeaResponse;
    postVote(groupId: number, questionId: number, promptId: number, locale: string, body: AoiVoteData, direction: "left" | "right" | "skip"): AoiVoteResponse;
    postVoteSkip(groupId: number, questionId: number, promptId: number, locale: string, body: AoiVoteSkipData): AoiVoteResponse;
    getResults(groupId: number, questionId: number): Promise<AoiChoiceData[]>;
    llmAnswerConverstation(groupId: number, wsClientId: string, chatLog: PsSimpleChatLog[], languageName: string): Promise<void>;
}
//# sourceMappingURL=AoiServerApi.d.ts.map