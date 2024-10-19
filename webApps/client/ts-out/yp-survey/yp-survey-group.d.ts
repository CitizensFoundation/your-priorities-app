import { nothing } from "lit";
import { YpBaseElement } from "../common/yp-base-element.js";
import "@material/web/button/text-button.js";
export declare class YpSurveyGroup extends YpBaseElement {
    surveyGroupId: number | undefined;
    surveySubmitError: string | undefined;
    surveyCompleted: boolean;
    submitHidden: boolean;
    surveyGroup: YpGroupData | undefined;
    structuredQuestions: Array<YpStructuredQuestionData> | undefined;
    structuredAnswers: Array<YpStructuredAnswer> | undefined;
    initiallyLoadedAnswers: Array<YpStructuredAnswer> | undefined;
    liveQuestionIds: Array<number>;
    uniqueIdsToElementIndexes: Record<string, number>;
    liveUniqueIds: Array<string>;
    liveUniqueIdsAll: Array<{
        uniqueId: string;
        atIndex: number;
    }>;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    static get styles(): any[];
    render(): typeof nothing | import("lit-html").TemplateResult<1>;
    connectedCallback(): void;
    disconnectedCallback(): void;
    _isLastRating(index: number): boolean;
    _isFirstRating(index: number): boolean;
    _openToId(event: CustomEvent): void;
    _skipToId(event: CustomEvent, showItems: boolean): void;
    _goToNextIndex(event: CustomEvent): void;
    _serializeAnswers(): void;
    _submit(): Promise<void>;
    _saveState(event: CustomEvent): void;
    _clearState(): void;
    _checkAndLoadState(): void;
    _isIpad(): boolean;
    _surveyGroupIdChanged(): void;
    _getSurveyGroup(): Promise<void>;
    refresh(): void;
}
//# sourceMappingURL=yp-survey-group.d.ts.map