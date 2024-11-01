import { YpServerApi } from "../common/YpServerApi.js";
export class YpAssistantServerApi extends YpServerApi {
    constructor(urlPath = "/api/assistants") {
        super();
        this.baseUrlPath = urlPath;
    }
    sendChatMessage(domainId, wsClientId, chatLog, languageName) {
        return this.fetchWrapper(this.baseUrlPath + `/${domainId}/chat`, {
            method: "PUT",
            body: JSON.stringify({
                wsClientId,
                chatLog,
                languageName,
            }),
        }, false);
    }
}
//# sourceMappingURL=AssistantServerApi.js.map