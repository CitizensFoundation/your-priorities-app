import { nothing } from "lit";
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/button/filled-button.js";
import "../common/yp-image.js";
import "../yp-user/yp-user-info.js";
import { YpBaseElementWithLogin } from "../common/yp-base-element-with-login.js";
export declare class YpPointCommentEdit extends YpBaseElementWithLogin {
    comment: YpPointData | undefined;
    point: YpPointData | undefined;
    image: YpImageData | undefined;
    static get styles(): any[];
    render(): typeof nothing | import("lit-html").TemplateResult<1>;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    get newPointComment(): string;
    connectedCallback(): void;
    _responseError(): void;
    _reset(): void;
    _sendComment(): Promise<void>;
    _keyDown(event: KeyboardEvent): void;
}
//# sourceMappingURL=yp-point-comment-edit.d.ts.map