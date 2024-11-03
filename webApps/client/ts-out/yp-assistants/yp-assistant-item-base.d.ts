import { nothing } from "lit";
import { YpAiChatbotItemBase } from '../yp-chatbots/yp-chatbot-item-base.js';
import "./yp-agent-chip.js";
import "./yp-agent-chip-for-purchase.js";
export declare class YpAssistantItemBase extends YpAiChatbotItemBase {
    isVoiceMode: boolean;
    isListening: boolean;
    isSpeaking: boolean;
    htmlToRender?: string;
    firstUpdated(changedProps: Map<string, any>): void;
    updated(changedProps: Map<string, any>): void;
    static get styles(): (any[] | import("lit").CSSResult)[];
    renderVoiceStatus(): import("lit-html").TemplateResult<1> | typeof nothing;
    renderChatGPT(): import("lit-html").TemplateResult<1>;
    renderUser(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "yp-assistant-item-base": YpAssistantItemBase;
    }
}
//# sourceMappingURL=yp-assistant-item-base.d.ts.map