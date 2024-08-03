import { nothing } from "lit";
import "../../common/yp-image.js";
import { YpBaseElement } from "../../common/yp-base-element.js";
import "@material/web/progress/circular-progress.js";
import "./aoi-streaming-analysis.js";
export declare class AoiSurveyAnalysis extends YpBaseElement {
    groupId: number;
    group: YpGroupData;
    question: AoiQuestionData;
    earl: AoiEarlData;
    connectedCallback(): Promise<void>;
    disconnectedCallback(): void;
    renderStreamingAnalysis(): typeof nothing | import("lit-html").TemplateResult<1>;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    static get styles(): any[];
    renderAnalysis(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=aoi-survey-analysis.d.ts.map