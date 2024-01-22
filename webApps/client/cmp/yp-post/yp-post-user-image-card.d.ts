import { YpBaseElement } from '../common/yp-base-element.js';
import '@material/web/iconbutton/outlined-icon-button.js';
import '../common/yp-image.js';
import '../yp-point/yp-point-comment-list.js';
export declare class YpPostUserImageCard extends YpBaseElement {
    image: YpImageData;
    post: YpPostData;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
    _openEdit(): void;
    _openDelete(): void;
    _refresh(): void;
    get imageUrl(): any;
}
//# sourceMappingURL=yp-post-user-image-card.d.ts.map