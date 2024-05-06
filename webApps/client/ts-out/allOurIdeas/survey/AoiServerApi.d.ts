import { YpServerApi } from "../../common/YpServerApi.js";
export declare class AoiServerApi extends YpServerApi {
    constructor(urlPath?: string);
    getEarlData(groupId: number): AoiEarlResponse;
    getPrompt(groupId: number, questionId: number): Promise<AoiPromptData>;
    getSurveyResults(groupId: number): Promise<AoiChoiceData[]>;
    getSurveyAnalysis(groupId: number, wsClientId: string, analysisIndex: number, analysisTypeIndex: number, languageName: string): AoiAnalysisResponse;
    checkLogin(): Promise<boolean>;
    submitIdea(groupId: number, questionId: number, newIdea: string): Promise<AoiAddIdeaResponse | null>;
    postVote(groupId: number, questionId: number, promptId: number, locale: string, body: AoiVoteData, direction: "left" | "right" | "skip"): Promise<AoiVoteResponse | null>;
    postVoteSkip(groupId: number, questionId: number, promptId: number, locale: string, body: AoiVoteSkipData): Promise<AoiVoteResponse | null>;
    getResults(groupId: number, questionId: number, showAll?: boolean): Promise<AoiChoiceData[]>;
    llmAnswerConverstation(groupId: number, wsClientId: string, chatLog: PsSimpleChatLog[], languageName: string): Promise<void>;
}
//# sourceMappingURL=AoiServerApi.d.ts.map