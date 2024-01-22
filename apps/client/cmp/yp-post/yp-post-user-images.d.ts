import { YpBaseElement } from "../common/yp-base-element.js";
import "@material/web/button/outlined-button.js";
import "./yp-post-user-image-card.js";
export declare class YpPostUserImages extends YpBaseElement {
    images: Array<YpImageData> | undefined;
    post: YpPostData | undefined;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
    _refresh(): Promise<void>;
    _postChanged(): void;
    _newImage(): void;
}
//# sourceMappingURL=yp-post-user-images.d.ts.map