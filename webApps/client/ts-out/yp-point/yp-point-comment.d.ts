import { nothing } from "lit";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/iconbutton/icon-button.js";
import "../yp-user/yp-user-image.js";
import "../yp-user/yp-user-with-organization.js";
import "./yp-point-actions.js";
import { YpBaseElementWithLogin } from "../common/yp-base-element-with-login.js";
export declare class YpPointComment extends YpBaseElementWithLogin {
    point: YpPointData | undefined;
    user: YpUserData | undefined;
    hideUser: boolean;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    static get styles(): any[];
    render(): typeof nothing | import("lit-html").TemplateResult<1>;
    connectedCallback(): void;
    disconnectedCallback(): void;
    _deletePoint(): void;
    _reallyDeletePoint(): Promise<void>;
    _reportPoint(): void;
    _onReport(): void;
    _pointChanged(): void;
    get hasPointAccess(): boolean | undefined;
    loginName(): string | undefined;
}
//# sourceMappingURL=yp-point-comment.d.ts.map