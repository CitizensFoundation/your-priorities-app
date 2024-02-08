import "@material/web/dialog/dialog.js";
import { MdDialog } from "@material/web/dialog/dialog.js";
import "@material/web/button/elevated-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/button/text-button.js";
import "@material/web/progress/circular-progress.js";
import "@material/web/textfield/filled-text-field.js";
import { YpChatbotBase } from "../../yp-llms/yp-chatbot-base.js";
import { AoiServerApi } from "./AoiServerApi.js";
export declare class AoiLlmExplainDialog extends YpChatbotBase {
    earl: AoiEarlData;
    groupId: number;
    question: AoiQuestionData;
    leftAnswer: AoiAnswerToVoteOnData;
    rightAnswer: AoiAnswerToVoteOnData;
    currentError: string | undefined;
    showCloseButton: boolean;
    defaultInfoMessage: string | undefined;
    serverApi: AoiServerApi;
    haveSentFirstQuestion: boolean;
    setupServerApi(): void;
    connectedCallback(): Promise<void>;
    disconnectedCallback(): void;
    sendFirstQuestion(): Promise<void>;
    dialog: MdDialog;
    sendChatMessage(): Promise<void>;
    open(): void;
    cancel(): void;
    textAreaKeyDown(e: KeyboardEvent): boolean;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=aoi-llm-explain-dialog.d.ts.map