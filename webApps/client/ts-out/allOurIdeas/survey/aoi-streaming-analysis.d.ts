import "@material/web/dialog/dialog.js";
import "@material/web/button/elevated-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/button/text-button.js";
import "@material/web/progress/circular-progress.js";
import "@material/web/textfield/filled-text-field.js";
import { AoiServerApi } from "./AoiServerApi.js";
import { YpStreamingLlmScrolling } from "../../yp-chatbots/yp-streaming-llm-scrolling.js";
export declare class AoiStreamingAnalysis extends YpStreamingLlmScrolling {
    earl: AoiEarlData;
    groupId: number;
    group: YpGroupData;
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
    addChatBotElement(wsMessage: YpAssistantMessage): Promise<void>;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=aoi-streaming-analysis.d.ts.map