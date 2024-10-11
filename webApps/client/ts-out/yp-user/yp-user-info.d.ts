import "@material/web/button/text-button.js";
import "@material/web/button/outlined-button.js";
import { YpBaseElement } from "../common/yp-base-element.js";
import "./yp-user-image.js";
export declare class YpUserInfo extends YpBaseElement {
    user: YpUserData;
    showCreateNewOrganization: boolean;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
    connectedCallback(): void;
    _createNewOrganization(): void;
    _openAllContentModeration(): void;
    _openEdit(): void;
    _logout(): void;
}
//# sourceMappingURL=yp-user-info.d.ts.map