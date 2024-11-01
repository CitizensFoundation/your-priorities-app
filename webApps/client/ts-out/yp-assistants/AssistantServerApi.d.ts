import { YpServerApi } from "../common/YpServerApi.js";
export declare class YpAssistantServerApi extends YpServerApi {
    constructor(urlPath?: string);
    sendChatMessage(domainId: number, wsClientId: string, chatLog: PsSimpleChatLog[], languageName: string): Promise<void>;
    startVoiceSession(domainId: number, wsClientId: string, chatLog: PsSimpleChatLog[]): Promise<void>;
}
//# sourceMappingURL=AssistantServerApi.d.ts.map