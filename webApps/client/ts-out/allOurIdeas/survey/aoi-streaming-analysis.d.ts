import "@material/web/dialog/dialog.js";
import "@material/web/button/elevated-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/button/text-button.js";
import "@material/web/progress/circular-progress.js";
import "@material/web/textfield/filled-text-field.js";
import { AoiServerApi } from "./AoiServerApi.js";
import { YpStreamingLlmBase } from "../../yp-llms/yp-streaming-llm-base.js";
export declare class AoiStreamingAnalysis extends YpStreamingLlmBase {
    earl: AoiEarlData;
    groupId: number;
    analysisIndex: number;
    analysisTypeIndex: number;
    analysis: string;
    selectedChoices: AoiChoiceData[];
    serverApi: AoiServerApi;
    constructor();
    connectedCallback(): Promise<void>;
    disconnectedCallback(): void;
    streamAnalysis(): Promise<void>;
    renderChoice(index: number, result: AoiChoiceData): import("lit-html").TemplateResult<1>;
    addChatBotElement(wsMessage: PsAiChatWsMessage): Promise<void>;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=aoi-streaming-analysis.d.ts.map