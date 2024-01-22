import { YpBaseElement } from '../common/yp-base-element.js';
export declare class YpRating extends YpBaseElement {
    emoji: string | undefined;
    votingDisabled: boolean;
    readOnly: boolean;
    postId: number | undefined;
    ratingIndex: number | undefined;
    numberOf: number | undefined;
    rate: number;
    currentRatings: Array<number> | undefined;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
    isActive(index: number, rate: number): "" | "active";
    _postIdChanged(): void;
    _resetRatings(): void;
    _setRate(e: CustomEvent): void;
}
//# sourceMappingURL=yp-rating.d.ts.map