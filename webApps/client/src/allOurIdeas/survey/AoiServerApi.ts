import { StringUnitLength } from "luxon";
import { YpServerApi } from "../../common/YpServerApi.js";

export class AoiServerApi extends YpServerApi {
  constructor(urlPath: string = "/api/allOurIdeas") {
    super();
    this.baseUrlPath = urlPath;
  }

  public getEarlData(groupId: number): AoiEarlResponse {
    return this.fetchWrapper(
      this.baseUrlPath + `/${groupId}`
    ) as unknown as AoiEarlResponse;
  }

  async getPrompt(groupId: number, questionId: number) {
    return this.fetchWrapper(
      this.baseUrlPath + `/${groupId}/questions/${questionId}/prompt`
    ) as unknown as AoiPromptData;
  }

  public async getSurveyResults(groupId: number): Promise<AoiChoiceData[]> {
    return this.fetchWrapper(
      this.baseUrlPath + `/${groupId}/questions/results`
    ) as unknown as AoiChoiceData[];
  }

  getSurveyAnalysis(
    groupId: number,
    wsClientId: string,
    analysisIndex: number,
    analysisTypeIndex: number,
    languageName: string
  ): AoiAnalysisResponse {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/${groupId}/questions/${wsClientId}/${analysisIndex}/${analysisTypeIndex}/analysis?languageName=${languageName}`
    ) as unknown as AoiAnalysisResponse;
  }

  public submitIdea(
    groupId: number,
    questionId: number,
    newIdea: string
  ): AoiAddIdeaResponse {
    return this.fetchWrapper(
      this.baseUrlPath + `/${groupId}/questions/${questionId}/addIdea`,
      {
        method: "POST",
        body: JSON.stringify({ newIdea }),
      },
      false
    ) as unknown as AoiAddIdeaResponse;
  }

  public postVote(
    groupId: number,
    questionId: number,
    promptId: number,
    locale: string,
    body: AoiVoteData,
    direction: "left" | "right" | "skip"
  ): AoiVoteResponse {
    const url = new URL(
      `${window.location.protocol}//${window.location.host}${
        this.baseUrlPath
      }/${groupId}/questions/${questionId}/prompts/${promptId}/${
        direction == "skip" ? "skips" : "votes"
      }?locale=${locale}`
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

  public async getResults(
    groupId: number,
    questionId: number
  ): Promise<AoiChoiceData[]> {
    return this.fetchWrapper(
      this.baseUrlPath + `/${groupId}/choices/${questionId}/throughGroup`,
    ) as unknown as AoiChoiceData[];
  }

  public llmAnswerConverstation(
    groupId: number,
    wsClientId: string,
    chatLog: PsSimpleChatLog[],
  ): Promise<void> {

    return this.fetchWrapper(
      this.baseUrlPath + `/${groupId}/llmAnswerExplain`,
      {
        method: "PUT",
        body: JSON.stringify({
          wsClientId,
          chatLog
        }),
      },
      false
    ) ;
  }
}
