import { LitElement, PropertyValues } from "lit";
import "@material/web/button/filled-button.js";
import "@material/web/select/filled-select.js";
import "@material/web/select/select-option.js";
import "@material/web/progress/circular-progress.js";
import "@material/web/divider/divider.js";
export declare class InteractiveAvatar extends LitElement {
    getConfigPath: string;
    audioBackupPath: string;
    conversationBackupPath: string;
    private isLoadingSession;
    private isLoadingRepeat;
    private stream;
    private debug;
    knowledgeId: string;
    knowledgeBase: string;
    avatarId: string;
    language: string;
    private data;
    private text;
    isUserTalking: boolean;
    private avatar;
    private mediaStreamEl;
    private audioBackup;
    private conversationBackup;
    private sessionId;
    static styles: import("lit").CSSResult;
    private getConfig;
    constructor();
    initBackups(token: string): void;
    private startSession;
    private getVoiceConfig;
    private setupAvatarEventListeners;
    private handleSpeak;
    private handleInterrupt;
    private endSession;
    updated(changedProperties: PropertyValues): void;
    disconnectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "interactive-avatar": InteractiveAvatar;
    }
}
//# sourceMappingURL=hg-interactive-avatar.d.ts.map