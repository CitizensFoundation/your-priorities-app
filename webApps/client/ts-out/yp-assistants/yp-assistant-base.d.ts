import { PropertyValueMap } from "lit";
import { YpChatbotBase } from "../yp-chatbots/yp-chatbot-base.js";
import "./yp-assistant-item-base.js";
export declare abstract class YpAssistantBase extends YpChatbotBase {
    voiceEnabled: boolean;
    domainId: number;
    private mediaRecorder;
    private wavStreamPlayer;
    private isRecording;
    userIsSpeaking: boolean;
    aiIsSpeaking: boolean;
    onlyUseTextField: boolean;
    chatLogFromServer: YpAssistantMessage[] | undefined;
    currentMode: string;
    isExpanded: boolean;
    voiceButton: HTMLElement;
    textInputLabel: string;
    defaultInfoMessage: string | undefined;
    chatbotItemComponentName: import("lit-html/static.js").StaticValue;
    private waveformCanvas;
    private canvasCtx;
    private renderLoopActive;
    aiSpeakingTimeout: NodeJS.Timeout | undefined;
    constructor();
    connectedCallback(): void;
    firstUpdated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void;
    getMemoryFromServer(): Promise<void>;
    private setupCanvasRendering;
    private renderLoop;
    private stopCanvasRendering;
    disconnectedCallback(): void;
    setupVoiceCapabilities(): Promise<void>;
    get talkingHeadImage(): "https://assets.evoly.ai/direct/talkingHead.png" | "https://assets.evoly.ai/direct/listeningHead.png" | "https://assets.evoly.ai/direct/idleHead.png";
    renderVoiceTalkingHead(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
    toggleRecording(): void;
    startRecording(): Promise<void>;
    stopRecording(): void;
    static floatTo16BitPCM(float32Array: Float32Array): ArrayBuffer;
    static arrayBufferToBase64(arrayBuffer: ArrayBuffer | Iterable<number>): string;
    handleVoiceInput(data: {
        mono: ArrayBuffer;
        raw: ArrayBuffer;
    }): Promise<void>;
    onMessage(event: MessageEvent): Promise<void>;
    base64ToArrayBuffer(base64: string): ArrayBuffer;
    toggleVoiceMode(): Promise<void>;
    reallyClearHistory(): Promise<void>;
    clearHistory(): Promise<void>;
    static get styles(): (any[] | import("lit").CSSResult)[];
    renderChatInput(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "yp-assistant-base": YpAssistantBase;
    }
}
//# sourceMappingURL=yp-assistant-base.d.ts.map