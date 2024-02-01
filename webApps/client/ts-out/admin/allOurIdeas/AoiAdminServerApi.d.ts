import { YpServerApi } from "../../common/YpServerApi.js";
export declare class AoiAdminServerApi extends YpServerApi {
    constructor(urlPath?: string);
    getChoices(communityId: number, questionId: number): Promise<AoiChoiceData[]>;
    submitIdeasForCreation(communityId: number, ideas: string[], questionName: string): Promise<AoiEarlData>;
    startGenerateIdeas(question: string, communityId: number, wsClientSocketId: string, currentIdeas: string[]): Promise<void>;
    toggleIdeaActive(groupId: number, choiceId: number): Promise<void>;
}
//# sourceMappingURL=AoiAdminServerApi.d.ts.map