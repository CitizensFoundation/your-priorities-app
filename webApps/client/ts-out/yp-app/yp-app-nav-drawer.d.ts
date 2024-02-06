import { YpBaseElement } from "../common/yp-base-element.js";
import "@material/web/button/outlined-button.js";
import "@material/web/icon/icon.js";
import "@material/web/iconbutton/outlined-icon-button.js";
import "@material/web/progress/linear-progress.js";
import "../common/languages/yp-language-selector.js";
export declare class YpAppNavDrawer extends YpBaseElement {
    homeLink: YpHomeLinkData | undefined;
    user: YpUserData | undefined;
    opened: boolean;
    spinner: boolean;
    route: string | undefined;
    myAdminGroups: YpGroupData[] | undefined;
    myAdminCommunities: YpCommunityData[] | undefined;
    myGroups: YpGroupData[] | undefined;
    myCommunities: YpCommunityData[] | undefined;
    myDomains: YpDomainData[] | undefined;
    adminRights: YpAdminRights | undefined;
    memberships: YpMemberships | undefined;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    connectedCallback(): void;
    _openChanged(): Promise<void>;
    _selectedLocale(): string;
    _goBack(): void;
    _goToGroup(event: CustomEvent): void;
    _goToCommunity(event: CustomEvent): void;
    _goToDomain(event: CustomEvent): void;
    _userChanged(): void;
    _reset(): void;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=yp-app-nav-drawer.d.ts.map