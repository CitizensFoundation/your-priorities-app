import { YpBaseElement } from '../common/yp-base-element.js';
import '../common/yp-image.js';
import '@material/web/iconbutton/icon-button.js';
import '@lit-labs/virtualizer';
import './yp-point-comment.js';
import './yp-point-comment-edit.js';
export declare class YpPointCommentList extends YpBaseElement {
    comments: Array<YpPointData> | undefined;
    point: YpPointData | undefined;
    image: YpImageData | undefined;
    open: boolean;
    loadingList: boolean;
    disableOpenClose: boolean;
    commentsCount: number | undefined;
    commentType: 'points' | 'images' | undefined;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    static get styles(): any[];
    renderComment(comment: YpPointData, index: number): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
    scrollEvent(event: any): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    _openChanged(): void;
    get noComments(): boolean;
    setOpen(): void;
    setClosed(): void;
    _pointChanged(): void;
    refresh(): void;
    _imageChanged(): void;
    get hasContent(): YpPointData | YpImageData | undefined;
    _getComments(): Promise<void>;
    _getCommentsCount(): Promise<void>;
}
//# sourceMappingURL=yp-point-comment-list.d.ts.map