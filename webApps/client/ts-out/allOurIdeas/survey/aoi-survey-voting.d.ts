import { nothing } from "lit";
import { YpBaseElement } from "../../common/yp-base-element.js";
import "../../common/yp-image.js";
import "@material/web/button/elevated-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/progress/circular-progress.js";
import "./aoi-new-idea-dialog.js";
export declare class AoiSurveyVoting extends YpBaseElement {
    groupId: number;
    earl: AoiEarlData;
    question: AoiQuestionData;
    firstPrompt: AoiPromptData;
    promptId: number;
    voteCount: number;
    leftAnswer: string | undefined;
    spinnersActive: boolean;
    rightAnswer: string | undefined;
    appearanceLookup: string;
    breakForVertical: boolean;
    levelTwoTargetVotes: number | undefined;
    timer: number | undefined;
    constructor();
    connectedCallback(): Promise<void>;
    disconnectedCallback(): void;
    resetTimer(): void;
    animateButtons(direction: "left" | "right" | "skip"): Promise<void>;
    resetAnimation(event: any): void;
    voteForAnswer(direction: "left" | "right" | "skip"): Promise<void>;
    removeAndInsertFromLeft(): void;
    openNewIdeaDialog(): void;
    static get styles(): any[];
    renderProgressBar(): import("lit-html").TemplateResult<1> | typeof nothing;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=aoi-survey-voting.d.ts.map