import "@material/web/fab/fab.js";
import { YpBaseElementWithLogin } from "../common/yp-base-element-with-login.js";
export declare class YpAdminCommunities extends YpBaseElementWithLogin {
    domain: YpDomainData;
    newCommunity(): void;
    static get styles(): any[];
    gotoCommunity(community: YpCommunityData): void;
    renderCommunity(community: YpCommunityData): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=yp-admin-projects.d.ts.map