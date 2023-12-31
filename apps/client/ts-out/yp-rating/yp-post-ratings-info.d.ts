import { YpBaseElement } from '../common/yp-base-element.js';
export declare class YpPostRatingsInfo extends YpBaseElement {
    post: YpPostData | undefined;
    hasWidthA: boolean;
    hasWidthB: boolean;
    hasWidthC: boolean;
    hasWidthD: boolean;
    active: boolean;
    allDisabled: boolean;
    votingDisabled: boolean;
    isEndorsed: boolean;
    cardMode: boolean;
    customRatings: Array<YpCustomRatingsData> | undefined;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
    getRating(ratingIndex: number): number;
    getRatingsCount(ratingIndex: number): string | 0;
    _fireRefresh(): void;
    openRatingsDialog(): void;
    _onPostChanged(): void;
}
//# sourceMappingURL=yp-post-ratings-info.d.ts.map