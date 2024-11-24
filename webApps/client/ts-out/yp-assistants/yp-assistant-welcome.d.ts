import { YpBaseElementWithLogin } from "../common/yp-base-element-with-login.js";
export declare class YpAssistantWelcome extends YpBaseElementWithLogin {
    welcomeTextHtml: string;
    avatarUrl: string;
    static get styles(): any[];
    startInVoiceMode(event: CustomEvent): void;
    startInTextMode(event: CustomEvent): void;
    renderVoiceStartIcon(): import("lit-html").TemplateResult<1>;
    renderVoiceIconButton(): import("lit-html").TemplateResult<1>;
    renderVoiceButton(): import("lit-html").TemplateResult<1>;
    renderVoiceTalkingHead(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=yp-assistant-welcome.d.ts.map