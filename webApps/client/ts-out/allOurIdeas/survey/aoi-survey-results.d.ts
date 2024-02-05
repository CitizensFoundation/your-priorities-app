import '../../common/yp-image.js';
import { YpBaseElement } from '../../common/yp-base-element.js';
import '@material/web/checkbox/checkbox.js';
import '@material/web/button/outlined-button.js';
import '@material/web/progress/circular-progress.js';
export declare class AoiSurveyResuls extends YpBaseElement {
    results: AoiChoiceData[];
    question: AoiQuestionData;
    earl: AoiEarlData;
    groupId: number;
    showScores: boolean;
    connectedCallback(): Promise<void>;
    fetchResults(): Promise<void>;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    disconnectedCallback(): void;
    toggleScores(): void;
    exportToCSV(): void;
    static get styles(): any[];
    renderRow(index: number, result: AoiChoiceData): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=aoi-survey-results.d.ts.map