import { TemplateResult } from "lit";
import "@material/web/iconbutton/outlined-icon-button.js";
import "@material/web/labs/card/outlined-card.js";
import "./yp-post-actions.js";
import { YpBaseElementWithLogin } from "../common/yp-base-element-with-login.js";
import "./yp-post-transcript.js";
declare const YpPostHeader_base: (new (...args: any[]) => import("./yp-post-base-with-answers.js").YpPostBaseWithAnswersInterface) & typeof YpBaseElementWithLogin;
export declare class YpPostHeader extends YpPostHeader_base {
    isAudioCover: boolean;
    hideActions: boolean;
    transcriptActive: boolean;
    post: YpPostData;
    static get styles(): any[];
    renderPostInformation(): TemplateResult<1>;
    renderMenu(): TemplateResult<1>;
    renderActions(): TemplateResult<1>;
    render(): TemplateResult<1>;
    _openPostMenu(): void;
    _sharedContent(event: CustomEvent): void;
    _shareTap(event: CustomEvent): void;
    get hasPostAccess(): boolean;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    _postChanged(): void;
    updateDescriptionIfEmpty(description: string): void;
    _refresh(): void;
    _openMovePost(): void;
    _openPostStatusChangeNoEmails(): void;
    _openPostStatusChange(): void;
    _openEdit(): void;
    _openReport(): void;
    _openDelete(): void;
    _openDeleteContent(): void;
    _openAnonymizeContent(): void;
    _onReport(): void;
    _onDeleted(): void;
}
export {};
//# sourceMappingURL=yp-post-header.d.ts.map