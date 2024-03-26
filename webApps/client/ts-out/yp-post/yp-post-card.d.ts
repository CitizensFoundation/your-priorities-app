import { nothing } from "lit";
import { YpBaseElement } from "../common/yp-base-element.js";
import "../yp-magic-text/yp-magic-text.js";
import "./yp-post-cover-media.js";
import "./yp-post-actions.js";
import "./yp-post-tags.js";
import "@material/web/iconbutton/outlined-icon-button.js";
export declare class YpPostCard extends YpBaseElement {
    selectedMenuItem: string | undefined;
    mini: boolean;
    isAudioCover: boolean;
    post: YpPostData;
    static get propersties(): {
        post: {
            type: ObjectConstructor;
            observer: string;
        };
    };
    static get styles(): any[];
    renderDescription(): import("lit-html").TemplateResult<1>;
    renderTags(): import("lit-html").TemplateResult<1>;
    render(): typeof nothing | import("lit-html").TemplateResult<1>;
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
//# sourceMappingURL=yp-post-card.d.ts.map