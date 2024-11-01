import { YpServerApi } from "../common/YpServerApi.js";
export class YpAssistantServerApi extends YpServerApi {
    constructor(urlPath = "/api/assistants") {
        super();
        this.baseUrlPath = urlPath;
    }
    sendChatMessage(groupId, wsClientId, chatLog, languageName) {
        return this.fetchWrapper(this.baseUrlPath + `/${groupId}/chat`, {
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