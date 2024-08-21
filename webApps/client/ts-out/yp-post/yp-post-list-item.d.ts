import { nothing } from "lit";
import "@material/web/labs/card/filled-card.js";
import "@material/web/labs/card/elevated-card.js";
import { YpBaseElement } from "../common/yp-base-element.js";
import "../yp-magic-text/yp-magic-text.js";
import "./yp-post-cover-media.js";
import "./yp-post-actions.js";
import "./yp-post-tags.js";
import "@material/web/iconbutton/outlined-icon-button.js";
export declare class YpPostListItem extends YpBaseElement {
    selectedMenuItem: string | undefined;
    mini: boolean;
    isAudioCover: boolean;
    post: YpPostData;
    static get styles(): any[];
    get structuredAnswerTruncateLength(): number;
    renderDescription(): import("lit-html").TemplateResult<1>;
    renderTags(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1> | typeof nothing;
    renderShare(): import("lit-html").TemplateResult<1>;
    renderDebate(): import("lit-html").TemplateResult<1>;
    renderActions(): import("lit-html").TemplateResult<1>;
    _sharedContent(event: CustomEvent): void;
    get _fullPostUrl(): string;
    get structuredAnswersFormatted(): string;
    _onBottomClick(event: CustomEvent): void;
    clickOnA(): void;
    _getPostLink(post: YpPostData): string;
    _shareTap(event: CustomEvent): void;
    get hideDescription(): boolean;
    goToPostIfNotHeader(event: CustomEvent): void;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    updateDescriptionIfEmpty(description: string): void;
    _refresh(): void;
    _openReport(): void;
    _onReport(): void;
}
//# sourceMappingURL=yp-post-list-item.d.ts.map