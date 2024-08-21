import { nothing } from "lit";
import { YpBaseElement } from "../../common/yp-base-element.js";
import "../../common/yp-image.js";
import "@material/web/fab/fab.js";
export declare class AoiSurveyIntro extends YpBaseElement {
    earl: AoiEarlData;
    group: YpGroupData;
    question: AoiQuestionData;
    isAdmin: boolean;
    private footer;
    private footerEnd;
    private footerTopObserver;
    private footerEndObserver;
    connectedCallback(): Promise<void>;
    disconnectedCallback(): void;
    firstUpdated(): void;
    _openAnalyticsAndPromotions(): void;
    _openAdmin(): void;
    renderAdminButtons(): import("lit-html").TemplateResult<1>;
    setupFooterObserver(): void;
    get formattedDescription(): string;
    clickStart(): void;
    clickResults(): void;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1> | typeof nothing;
}
//# sourceMappingURL=aoi-survey-intro.d.ts.map