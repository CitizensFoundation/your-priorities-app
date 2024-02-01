import { YpServerApi } from "../../common/YpServerApi.js";

export class AoiAdminServerApi extends YpServerApi {
  constructor(urlPath: string = "/api/allOurIdeas") {
    super();
    this.baseUrlPath = urlPath;
  }

  public async getChoices(
    groupId: number,
    questionId: number
  ): Promise<AoiChoiceData[]> {
    return this.fetchWrapper(
      this.baseUrlPath + `/${groupId}/choices/${questionId}.json`
    ) as unknown as AoiChoiceData[];
  }

  public async submitIdeasForCreation(
    communityId: number,
    ideas: string[]
  ): Promise<AoiEarlData> {
    return this.fetchWrapper(
      this.baseUrlPath + `/${communityId}/questions`,
      {
        method: "POST",
        body: JSON.stringify({
          ideas: ideas,
        }),
      },
      true,
      undefined,
      true
    );
  }

  public async startGenerateIdeas(
    question: string,
    communityId: number,
    wsClientSocketId: string,
    currentIdeas: string[]
  ): Promise<void> {
    return this.fetchWrapper(
      this.baseUrlPath + `/${communityId}/generateIdeas`,
      {
        method: "PUT",
        body: JSON.stringify({
          currentIdeas,
          wsClientSocketId,
          question
        }),
      },
      true,
      undefined,
      true
    );
  }

  public async toggleIdeaActive(
    groupId: number,
    choiceId: number,
  ): Promise<void> {
    return this.fetchWrapper(
      this.baseUrlPath + `/${groupId}/choices/${choiceId}/toggleActive`,
      {
        method: "PUT",
        body: JSON.stringify({}),
      },
      true,
      undefined,
      true
    );
  }
}
