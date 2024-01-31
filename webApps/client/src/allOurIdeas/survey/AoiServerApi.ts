import { YpServerApi } from "../../common/YpServerApi.js";

export class AoiServerApi extends YpServerApi {
  constructor(urlPath: string = "/api/allOurIdeas") {
    super();
    this.baseUrlPath = urlPath;
  }

  public getEarl(groupId: number): AoiEarlResponse {
    return this.fetchWrapper(
      this.baseUrlPath + `/${groupId}`
    ) as unknown as AoiEarlResponse;
  }

  async getPrompt(groupId: number, questionId: number) {
    return this.fetchWrapper(
      this.baseUrlPath + `/${groupId}/questions/${questionId}/prompt`
    ) as unknown as AoiPromptData;
  }

  public async getSurveyResults(groupId: number): Promise<AoiResultData[]> {
    return this.fetchWrapper(
      this.baseUrlPath + `/${groupId}/questions/results`
    ) as unknown as AoiResultData[];
  }

  getSurveyAnalysis(
    groupId: number,
    analysisIndex: number,
    analysisTypeIndex: number
  ): AnalysisTypeData {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/${groupId}/questions/${analysisIndex}/${analysisTypeIndex}/analysis`
    ) as unknown as AnalysisTypeData;
  }

  public submitIdea(
    groupId: number,
    questionId: number,
    newIdea: string
  ): AoiAddIdeaResponse {
    return this.fetchWrapper(
      this.baseUrlPath + `/${groupId}/questions/${questionId}/add_idea`,
      {
        method: "POST",
        body: JSON.stringify({ new_idea: newIdea }),
      },
      false
    ) as unknown as AoiAddIdeaResponse;
  }

  public postVote(
    groupId: number,
    questionId: number,
    promptId: number,
    locale: string,
    body: AoiVoteData
  ): AoiVoteResponse {
    const url = new URL(
      `${window.location.protocol}//${window.location.host}${this.baseUrlPath}/${groupId}/questions/${questionId}/prompts/${promptId}/votes?locale=${locale}`
    );

    Object.keys(window.appGlobals.originalQueryParameters).forEach((key) => {
      if (key.startsWith("utm_")) {
        url.searchParams.append(
          key,
          window.aoiAppGlobals.originalQueryParameters[key]
        );
      }
    });

    const browserId = window.appUser.getBrowserId();
    const browserFingerprint = window.appUser.browserFingerprint;
    const browserFingerprintConfidence =
      window.appUser.browserFingerprintConfidence;

    url.searchParams.append("checksum_a", browserId!);
    url.searchParams.append("checksum_b", browserFingerprint!);
    url.searchParams.append(
      "checksum_c",
      browserFingerprintConfidence!.toString()
    );

    return this.fetchWrapper(
      url.toString(),
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      false
    ) as unknown as AoiVoteResponse;
  }

  public postVoteSkip(
    groupId: number,
    questionId: number,
    promptId: number,
    locale: string,
    body: AoiVoteSkipData
  ): AoiVoteResponse {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/${groupId}/questions/${questionId}/prompts/${promptId}/skip.js?locale=${locale}`,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      false
    ) as unknown as AoiVoteResponse;
  }
}
