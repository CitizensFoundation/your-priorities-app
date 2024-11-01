import { YpAssistantBase } from "./yp-assistant-base.js";
import { YpAssistantServerApi } from "./AssistantServerApi.js";
export declare class YpAssistant extends YpAssistantBase {
    groupId: number;
    serverApi: YpAssistantServerApi;
    setupServerApi(): void;
    sendChatMessage(): Promise<void>;
}
//# sourceMappingURL=yp-assistant.d.ts.map