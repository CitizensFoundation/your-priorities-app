import { YpChatbotBase } from "../yp-llms/yp-chatbot-base.js";
import "./yp-assistant-item-base.js";
export declare abstract class YpAssistantBase extends YpChatbotBase {
    voiceEnabled: boolean;
    private mediaRecorder;
    private isRecording;
    private audioChunks;
    private audioContext;
    private audioQueue;
    private isPlayingAudio;
    private currentAudioSource;
    onlyUseTextField: boolean;
    voiceButton: HTMLElement;
    chatbotItemComponentName: import("lit-html/static.js").StaticValue;
    constructor();
    private initializeAudioContext;
    disconnectedCallback(): void;
    private cleanupAudio;
    setupVoiceCapabilities(): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
    blobToBase64(blob: Blob): Promise<string>;
    appendAudioChunk(chunk: ArrayBuffer): Promise<void>;
    private playNextAudioChunk;
    toggleRecording(): void;
    startRecording(): void;
    stopRecording(): void;
    handleVoiceInput(base64Audio: string): Promise<void>;
    onMessage(event: MessageEvent): Promise<void>;
    base64ToArrayBuffer(base64: string): ArrayBuffer;
    toggleVoiceMode(): void;
    static get styles(): (any[] | import("lit").CSSResult)[];
    renderChatInput(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "yp-assistant-base": YpAssistantBase;
    }
}
//# sourceMappingURL=yp-assistant-base.d.ts.map