import { YpServerApi } from "../../common/YpServerApi.js";
export declare class AoiAdminServerApi extends YpServerApi {
    constructor(urlPath?: string);
    getChoices(domainId: number | undefined, communityId: number | undefined, questionId: number): Promise<AoiChoiceData[]>;
    submitIdeasForCreation(domainId: number | undefined, communityId: number | undefined, ideas: string[], questionName: string): Promise<AoiEarlData>;
    startGenerateIdeas(question: string, domainId: number | undefined, communityId: number | undefined, wsClientSocketId: string, currentIdeas: string[]): Promise<void>;
    updateChoice(domainId: number | undefined, communityId: number | undefined, questionId: number, choiceId: number, choiceData: AoiAnswerToVoteOnData): Promise<void>;
    updateGroupChoice(groupId: number, questionId: number, choiceId: number, choiceData: AoiAnswerToVoteOnData): Promise<void>;
    updateActive(domainId: number | undefined, communityId: number | undefined, questionId: number, choiceId: number, active: boolean): Promise<void>;
    updateName(domainId: number | undefined, communityId: number | undefined, questionId: number, name: string): Promise<void>;
    toggleIdeaActive(groupId: number, choiceId: number): Promise<void>;
}
//# sourceMappingURL=AoiAdminServerApi.d.ts.map