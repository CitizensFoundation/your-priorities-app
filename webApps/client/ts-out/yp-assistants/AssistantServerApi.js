import { YpServerApi } from "../common/YpServerApi.js";
export class YpAssistantServerApi extends YpServerApi {
    constructor(urlPath = "/api/assistants") {
        super();
        this.baseUrlPath = urlPath;
    }
    sendChatMessage(domainId, wsClientId, chatLog, languageName, currentMode = undefined) {
        return this.fetchWrapper(this.baseUrlPath + `/${domainId}/chat`, {
            method: "PUT",
            body: JSON.stringify({
                wsClientId,
                chatLog,
                languageName,
                currentMode
            }),
        }, false);
    }
    startVoiceSession(domainId, wsClientId, chatLog) {
        return this.fetchWrapper(this.baseUrlPath + `/${domainId}/voice`, { method: "POST", body: JSON.stringify({ wsClientId, chatLog }) }, false);
    }
}
//# sourceMappingURL=AssistantServerApi.js.map