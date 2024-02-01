import { YpBaseElement } from "../../common/yp-base-element.js";
import "../../common/yp-image.js";
import "@material/web/fab/fab.js";
export declare class AoiSurveyIntro extends YpBaseElement {
    earl: AoiEarlData;
    group: YpGroupData;
    question: AoiQuestionData;
    themeHighContrast: boolean;
    private footer;
    private footerEnd;
    private footerTopObserver;
    private footerEndObserver;
    connectedCallback(): Promise<void>;
    disconnectedCallback(): void;
    firstUpdated(): void;
    setupFooterObserver(): void;
    get formattedDescription(): string;
    clickStart(): void;
    clickResults(): void;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=aoi-survey-intro.d.ts.map