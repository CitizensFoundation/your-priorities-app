import { YpServerApi } from "../common/YpServerApi.js";
export declare class YpAssistantServerApi extends YpServerApi {
    constructor(urlPath?: string);
    sendChatMessage(groupId: number, wsClientId: string, chatLog: PsSimpleChatLog[], languageName: string): Promise<void>;
}
//# sourceMappingURL=AssistantServerApi.d.ts.map