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

  async checkLogin() {
    if (window.appUser.loggedIn()) return true;

    if (window.appGlobals.currentAnonymousGroup) {
      const user = (await window.serverApi.registerAnonymously({
        groupId: window.appGlobals.currentAnonymousGroup.id,
        trackingParameters: window.appGlobals.originalQueryParameters,
      })) as YpUserData;
      if (user) {
        window.appUser.setLoggedInUser(user);
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  public async submitIdea(
    groupId: number,
    questionId: number,
    newIdea: string
  ): Promise<AoiAddIdeaResponse | null> {
    if (await this.checkLogin()) {
      return this.fetchWrapper(
        this.baseUrlPath + `/${groupId}/questions/${questionId}/addIdea`,
        {
          method: "POST",
          body: JSON.stringify({ newIdea }),
        },
        false
      ) as unknown as AoiAddIdeaResponse;
    } else {
      window.appUser.openUserlogin();
      return null;
    }
  }

  public async postVote(
    groupId: number,
    questionId: number,
    promptId: number,
    locale: string,
    body: AoiVoteData,
    direction: "left" | "right" | "skip"
  ): Promise<AoiVoteResponse | null> {
    if (await this.checkLogin()) {
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
    } else {
      window.appUser.openUserlogin();
      return null;
    }
  }

  public async postVoteSkip(
    groupId: number,
    questionId: number,
    promptId: number,
    locale: string,
    body: AoiVoteSkipData
  ): Promise<AoiVoteResponse | null> {
    if (await this.checkLogin()) {
      const url = new URL(
        `${window.location.protocol}//${window.location.host}${this.baseUrlPath}/${groupId}/questions/${questionId}/prompts/${promptId}/skip.js?locale=${locale}`
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
    } else {
      window.appUser.openUserlogin();
      return null;
    }
  }

  public async getResults(
    groupId: number,
    questionId: number,
    showAll = false
  ): Promise<AoiChoiceData[]> {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/${groupId}/choices/${questionId}/throughGroup${
          showAll ? "?showAll=1" : ""
        }`
    ) as unknown as AoiChoiceData[];
  }

  public llmAnswerConverstation(
    groupId: number,
    wsClientId: string,
    chatLog: YpSimpleChatLog[],
    languageName: string
  ): Promise<void> {
    return this.fetchWrapper(
      this.baseUrlPath + `/${groupId}/llmAnswerExplain`,
      {
        method: "PUT",
        body: JSON.stringify({
          wsClientId,
          chatLog,
          languageName,
        }),
      },
      false
    );
  }
}
