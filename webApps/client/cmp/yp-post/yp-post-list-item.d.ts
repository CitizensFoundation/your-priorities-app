import { YpBaseElement } from '../common/yp-base-element.js';
declare const YpPostListItem_base: (new (...args: any[]) => import("./yp-post-base-with-answers.js").YpPostBaseWithAnswersInterface) & typeof YpBaseElement;
export declare class YpPostListItem extends YpPostListItem_base {
    selectedMenuItem: string | undefined;
    elevation: number;
    post: YpPostData;
    mini: boolean;
    isAudioCover: boolean;
    isEndorsed: boolean;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
    computeSpanHidden(items: Array<string>, index: number | string): boolean;
    get postTags(): string[];
    _onBottomClick(event: CustomEvent): void;
    clickOnA(): void;
    _savePostToBackCache(): void;
    _getPostLink(post: YpPostData): string;
    _shareTap(event: CustomEvent): void;
    get hideDescription(): boolean | undefined;
    get hasPostAccess(): boolean;
    goToPostIfNotHeader(): void;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    _postChanged(): void;
    updateDescriptionIfEmpty(description: string): void;
    _refresh(): void;
    _openReport(): void;
    _onReport(): void;
}
export {};
//# sourceMappingURL=yp-post-list-item.d.ts.map