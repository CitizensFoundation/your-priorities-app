import { StringUnitLength } from "luxon";
import { YpServerApi } from "../common/YpServerApi.js";

export class YpAssistantServerApi extends YpServerApi {
  constructor(urlPath: string = "/api/assistants") {
    super();
    this.baseUrlPath = urlPath;
  }

  public sendChatMessage(
    domainId: number,
    wsClientId: string,
    chatLog: PsSimpleChatLog[],
    languageName: string
  ): Promise<void> {
    return this.fetchWrapper(
      this.baseUrlPath + `/${domainId}/chat`,
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
