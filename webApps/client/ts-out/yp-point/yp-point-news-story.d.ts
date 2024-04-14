import { YpBaseElement } from "../common/yp-base-element.js";
import "@material/web/iconbutton/icon-button.js";
import "./yp-point-comment-list.js";
import "./yp-point-news-story-embed.js";
import "./yp-point-actions.js";
export declare class YpPointNewsStory extends YpBaseElement {
    point: YpPointData;
    user: YpUserData | undefined;
    withComments: boolean;
    open: boolean;
    hideUser: boolean;
    commentsCount: number;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
    _setOpenToValue(): void;
    _openChanged(): void;
    get noComments(): boolean;
    _setOpen(): void;
    _setClosed(): void;
    _setCommentsCount(event: CustomEvent): void;
    _pointChanged(): void;
    loginName(): string;
}
//# sourceMappingURL=yp-point-news-story.d.ts.map