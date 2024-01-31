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
    groupdId: number,
    ideas: string[]
  ): Promise<AoiEarlData> {
    return this.fetchWrapper(
      this.baseUrlPath + `/${groupdId}/questions`,
      {
        method: "POST",
        body: JSON.stringify({
          ideas: ideas,
        }),
      },
      false,
      undefined,
      true
    );
  }

  public async startGenerateIdeas(
    groupId: number,
    wsClientId: string,
    currentIdeas: string[]
  ): Promise<void> {
    return this.fetchWrapper(
      this.baseUrlPath + `/${groupId}/questions/generateIdeas`,
      {
        method: "PUT",
        body: JSON.stringify({
          ideas: currentIdeas,
          wsClientId: wsClientId,
        }),
      },
      false,
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
      false,
      undefined,
      true
    );
  }
}
