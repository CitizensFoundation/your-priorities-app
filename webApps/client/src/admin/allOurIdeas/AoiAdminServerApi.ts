import { YpServerApi } from "../../common/YpServerApi.js";

export class AoiAdminServerApi extends YpServerApi {
  constructor(urlPath: string = "/api/allOurIdeas") {
    super();
    this.baseUrlPath = urlPath;
  }

  public async getChoices(
    communityId: number,
    questionId: number
  ): Promise<AoiChoiceData[]> {
    return this.fetchWrapper(
      this.baseUrlPath + `/${communityId}/choices/${questionId}?showAll=true`,
    ) as unknown as AoiChoiceData[];
  }

  public async submitIdeasForCreation(
    communityId: number,
    ideas: string[],
    questionName: string
  ): Promise<AoiEarlData> {
    return this.fetchWrapper(
      this.baseUrlPath + `/${communityId}/questions`,
      {
        method: "POST",
        body: JSON.stringify({
          ideas: ideas,
          question: questionName
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

  public async updateChoice(
    communityId: number,
    questionId: number,
    choiceId: number,
    choiceData: AoiAnswerToVoteOnData,
 ): Promise<void> {
    return this.fetchWrapper(
      this.baseUrlPath + `/${communityId}/questions/${questionId}/choices/${choiceId}`,
      {
        method: "PUT",
        body: JSON.stringify({
          data: choiceData
        }),
      },
      true,
      undefined,
      true
    );
  }

  public async updateActive(
    communityId: number,
    questionId: number,
    choiceId: number,
    active: boolean,
 ): Promise<void> {
    return this.fetchWrapper(
      this.baseUrlPath + `/${communityId}/questions/${questionId}/choices/${choiceId}/active`,
      {
        method: "PUT",
        body: JSON.stringify({
          active
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
