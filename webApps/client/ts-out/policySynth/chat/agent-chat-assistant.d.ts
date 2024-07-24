import '@material/web/fab/fab.js';
import '@material/web/radio/radio.js';
import '@material/web/button/elevated-button.js';
import '@material/web/button/text-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/filled-button.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/outlined-icon-button.js';
import '@yrpri/webapp/common/yp-image.js';
import { LtpAiChatElement } from './agent-ai-chat-element.js';
import './agent-ai-chat-element.js';
import { PsServerApi } from '../PsServerApi.js';
import { PsChatAssistant } from '../../chatBot/ps-chat-assistant.js';
export declare class LtpChatAssistant extends PsChatAssistant {
    crtData: LtpCurrentRealityTreeData;
    nodeToAddCauseTo: LtpCurrentRealityTreeDataNode;
    defaultInfoMessage: string;
    lastChainCompletedAsValid: boolean;
    chatElements?: LtpAiChatElement[];
    lastCausesToValidate: string[] | undefined;
    lastValidatedCauses: string[] | undefined;
    api: PsServerApi;
    heartbeatInterval: number | undefined;
    defaultDevWsPort: number;
    constructor();
    connectedCallback(): void;
    addChatBotElement(data: PsAiChatWsMessage): Promise<void>;
    sendChatMessage(): Promise<void>;
    validateSelectedChoices(event: CustomEvent): Promise<void>;
    getSuggestionsFromValidation(agentName: string, validationResults: PsValidationAgentResult): Promise<void>;
    renderChatInput(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=agent-chat-assistant.d.ts.map