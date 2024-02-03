import { nothing } from "lit";
import { YpBaseElement } from "../common/yp-base-element.js";
import "@material/web/progress/circular-progress.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/mwc-snackbar";
import "@material/web/radio/radio.js";
import "../yp-survey/yp-structured-question-edit.js";
export declare class YpRegistrationQuestions extends YpBaseElement {
    group: YpGroupData | undefined;
    structuredAnswers: Array<Record<string, string>> | undefined;
    translatedQuestions: Array<YpStructuredQuestionData> | undefined;
    autoTranslate: boolean;
    selectedSegment: string | undefined;
    segments: Array<YpStructuredQuestionData> | undefined;
    liveQuestionIds: Array<number>;
    uniqueIdsToElementIndexes: Record<string, number>;
    liveUniqueIds: Array<string>;
    liveUniqueIdsAll: Array<{
        uniqueId: string;
        atIndex: number;
    }>;
    connectedCallback(): void;
    disconnectedCallback(): void;
    static get styles(): any[];
    _goToNextIndex(event: CustomEvent): void;
    _skipToId(event: CustomEvent, showItems: boolean): void;
    _skipToWithHideId(event: CustomEvent, showItems: boolean): void;
    render(): typeof nothing | import("lit-html").TemplateResult<1>;
    get structuredQuestions(): Array<YpStructuredQuestionData> | undefined;
    get filteredQuestions(): YpStructuredQuestionData[] | null;
    _autoTranslateEvent(event: CustomEvent): void;
    _getTranslationsIfNeeded(): Promise<void>;
    _setupQuestions(): void;
    _checkForSegments(): void;
    getAnswers(): Record<string, string>[];
    validate(): boolean;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    _radioChanged(event: CustomEvent): void;
}
//# sourceMappingURL=yp-registration-questions.d.ts.map