import "../../common/yp-image.js";
import { YpBaseElement } from "../../common/yp-base-element.js";
import "@material/web/progress/circular-progress.js";
export declare class AoiSurveyAnalysis extends YpBaseElement {
    groupId: number;
    results: AoiResultData[];
    question: AoiQuestionData;
    earl: AoiEarlData;
    connectedCallback(): Promise<void>;
    disconnectedCallback(): void;
    fetchResults(): Promise<void>;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    static get styles(): any[];
    renderIdeas(index: number, result: AoiResultData): import("lit-html").TemplateResult<1>;
    analysisRow(analysisItem: AnalysisTypeData): import("lit-html").TemplateResult<1>;
    renderAnalysis(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=aoi-survey-analysis.d.ts.map