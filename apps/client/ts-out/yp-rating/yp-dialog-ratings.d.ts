import { YpBaseElement } from "../common/yp-base-element.js";
import "@material/web/button/text-button.js";
import "@material/web/dialog/dialog.js";
export declare class YpDialogRatings extends YpBaseElement {
    itemName: string | undefined;
    isOpen: boolean;
    post: YpPostData | undefined;
    refreshFunction: Function | undefined;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
    getRating(index: number): number | null;
    _close(): void;
    _addRating(event: CustomEvent): void;
    _deleteRating(event: CustomEvent): void;
    open(post: YpPostData, refreshFunction: Function): Promise<void>;
}
//# sourceMappingURL=yp-dialog-ratings.d.ts.map