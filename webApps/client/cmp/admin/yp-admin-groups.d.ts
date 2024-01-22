import "@material/web/fab/fab.js";
import { YpBaseElementWithLogin } from "../common/yp-base-element-with-login.js";
export declare class YpAdminGroups extends YpBaseElementWithLogin {
    community: YpCommunityData;
    newGroup(): void;
    static get styles(): any[];
    gotoGroup(group: YpGroupData): void;
    renderGroup(group: YpGroupData): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=yp-admin-groups.d.ts.map