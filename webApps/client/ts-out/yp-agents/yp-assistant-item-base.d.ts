import { nothing } from "lit";
import { YpAiChatbotItemBase } from '../yp-llms/yp-chatbot-item-base.js';
export declare class YpAgentItemBase extends YpAiChatbotItemBase {
    isVoiceMode: boolean;
    isListening: boolean;
    isSpeaking: boolean;
    static get styles(): (any[] | import("lit").CSSResult)[];
    renderVoiceStatus(): typeof nothing | import("lit-html").TemplateResult<1>;
    renderChatGPT(): import("lit-html").TemplateResult<1>;
    renderUser(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=yp-assistant-item-base.d.ts.map