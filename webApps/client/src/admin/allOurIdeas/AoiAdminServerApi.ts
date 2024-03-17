import { YpServerApi } from "../../common/YpServerApi.js";

export class AoiAdminServerApi extends YpServerApi {
  constructor(urlPath: string = "/api/allOurIdeas") {
    super();
    this.baseUrlPath = urlPath;
  }

  public async getChoices(
    domainId: number | undefined,
    communityId: number | undefined,
    questionId: number
  ): Promise<AoiChoiceData[]> {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/${domainId || communityId}/choices/${questionId}${
          domainId ? "/throughDomain" : ""
        }?showAll=true`
    ) as unknown as AoiChoiceData[];
  }

  public async submitIdeasForCreation(
    domainId: number | undefined,
    communityId: number | undefined,
    ideas: string[],
    questionName: string
  ): Promise<AoiEarlData> {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/${domainId || communityId}/questions${
          domainId ? "/throughDomain" : ""
        }`,
      {
        method: "POST",
        body: JSON.stringify({
          ideas: ideas,
          question: questionName,
        }),
      },
      true,
      undefined,
      true
    );
  }

  public async startGenerateIdeas(
    question: string,
    domainId: number | undefined,
    communityId: number | undefined,
    wsClientSocketId: string,
    currentIdeas: string[]
  ): Promise<void> {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/${domainId || communityId}/generateIdeas${
          domainId ? "/throughDomain" : ""
        }`,
      {
        method: "PUT",
        body: JSON.stringify({
          currentIdeas,
          wsClientSocketId,
          question,
        }),
      },
      true,
      undefined,
      true
    );
  }

  public async updateChoice(
    domainId: number | undefined,
    communityId: number | undefined,
    questionId: number,
    choiceId: number,
    choiceData: AoiAnswerToVoteOnData
  ): Promise<void> {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/${
          domainId || communityId
        }/questions/${questionId}/choices/${choiceId}${
          domainId ? "/throughDomain" : ""
        }`,
      {
        method: "PUT",
        body: JSON.stringify({
          data: choiceData,
        }),
      },
      true,
      undefined,
      true
    );
  }

  public async updateGroupChoice(
    groupId: number,
    questionId: number,
    choiceId: number,
    choiceData: AoiAnswerToVoteOnData
  ): Promise<void> {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/${groupId}/questions/${questionId}/choices/${choiceId}/throughGroup`,
      {
        method: "PUT",
        body: JSON.stringify({
          data: choiceData,
        }),
      },
      true,
      undefined,
      true
    );
  }

  public async updateActive(
    domainId: number | undefined,
    communityId: number | undefined,
    questionId: number,
    choiceId: number,
    active: boolean
  ): Promise<void> {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/${
          domainId || communityId
        }/questions/${questionId}/choices/${choiceId}/active${
          domainId ? "/throughDomain" : ""
        }`,
      {
        method: "PUT",
        body: JSON.stringify({
          active,
        }),
      },
      true,
      undefined,
      true
    );
  }

  public async updateName(
    domainId: number | undefined,
    communityId: number | undefined,
    questionId: number,
    name: string
  ): Promise<void> {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/${domainId || communityId}/questions/${questionId}/name${
          domainId ? "/throughDomain" : ""
        }`,
      {
        method: "PUT",
        body: JSON.stringify({
          name,
        }),
      },
      true,
      undefined,
      true
    );
  }

  public async toggleIdeaActive(
    groupId: number,
    choiceId: number
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
