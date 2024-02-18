import "@material/web/labs/navigationbar/navigation-bar.js";
import "@material/web/labs/navigationtab/navigation-tab.js";
import "@material/web/labs/navigationdrawer/navigation-drawer.js";
import "@material/web/list/list-item.js";
import "@material/web/list/list.js";
import "@material/web/icon/icon.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/iconbutton/outlined-icon-button.js";
import "../yp-app/yp-snackbar.js";
import "@material/web/progress/linear-progress.js";
import "@material/web/menu/menu.js";
import "../common/yp-image.js";
import "./survey/aoi-survey-intro.js";
import "./survey/aoi-survey-voting.js";
import "./survey/aoi-survey-results.js";
import "./survey/aoi-survey-analysis.js";
import { AoiServerApi } from "./survey/AoiServerApi.js";
import { AoiAppGlobals } from "./AoiAppGlobals.js";
import { NavigationDrawer } from "@material/web/labs/navigationdrawer/internal/navigation-drawer.js";
import { YpBaseElement } from "../common/yp-base-element.js";
declare global {
    interface Window {
        aoiAppGlobals: AoiAppGlobals;
        aoiServerApi: AoiServerApi;
        needsNewEarl: boolean;
    }
}
export declare class AoiSurvey extends YpBaseElement {
    pageIndex: number;
    totalNumberOfVotes: number;
    collectionId: number;
    collection: YpGroupData;
    lastSnackbarText: string | undefined;
    currentError: string | undefined;
    earl: AoiEarlData;
    question: AoiQuestionData;
    prompt: AoiPromptData;
    isAdmin: boolean;
    surveyClosed: boolean;
    appearanceLookup: string;
    currentLeftAnswer: AoiAnswerToVoteOnData | undefined;
    currentRightAnswer: AoiAnswerToVoteOnData | undefined;
    currentPromptId: number | undefined;
    drawer: NavigationDrawer;
    constructor();
    connectedCallback(): void;
    getEarl(): Promise<void>;
    disconnectedCallback(): void;
    scrollToCollectionItemSubClass(): void;
    getHexColor(color: string): string | undefined;
    snackbarclosed(): void;
    tabChanged(event: CustomEvent): void;
    exitToMainApp(): void;
    _displaySnackbar(event: CustomEvent): Promise<void>;
    _setupEventListeners(): void;
    _removeEventListeners(): void;
    externalGoalTrigger(): void;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    _appError(event: CustomEvent): void;
    get adminConfirmed(): boolean;
    _settingsColorChanged(event: CustomEvent): void;
    static get styles(): any[];
    changeTabTo(tabId: number): void;
    updateThemeColor(event: CustomEvent): void;
    sendVoteAnalytics(): void;
    updateappearanceLookup(event: CustomEvent): void;
    renderIntroduction(): import("lit-html").TemplateResult<1>;
    renderShare(): import("lit-html").TemplateResult<1>;
    startVoting(): void;
    openResults(): void;
    triggerExternalGoalUrl(): void;
    _renderPage(): import("lit-html/directive.js").DirectiveResult<typeof import("lit-html/directives/cache.js").CacheDirective>;
    renderScore(): import("lit-html").TemplateResult<1>;
    renderNavigationBar(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=aoi-survey.d.ts.map